"use server";

import { headers } from "next/headers";
import { site } from "@/content/site";
import { budgets, kinds, type ContactState } from "@/content/contact";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

// At most 5 sends per address every 10 minutes. In memory: enough for one container, resets on deploy.
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;
const recent = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (hits.length >= LIMIT) return true;
  recent.set(ip, [...hits, now]);
  if (recent.size > 5000) recent.clear();
  return false;
}

/** A mailto link short enough for every mail app; long messages are trimmed with a note. */
const mailtoFor = (subject: string, text: string) => {
  const body = text.length > 1500 ? `${text.slice(0, 1500)}\n\n[Message shortened; paste the rest here.]` : text;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/** Validates the project form and posts it to the studio's Slack channel. Without Slack settings it returns a ready-made email instead. */
export async function sendProject(_: ContactState, form: FormData): Promise<ContactState> {
  const values = {
    name: clean(form.get("name"), 120),
    email: clean(form.get("email"), 200),
    kind: clean(form.get("kind"), 60),
    budget: clean(form.get("budget"), 60),
    message: clean(form.get("message"), 5000),
  };

  const errors: ContactState["errors"] = {};
  if (!values.name) errors.name = "Tell us your name.";
  if (!EMAIL.test(values.email)) errors.email = "Enter an email address we can reply to, like name@company.com.";
  if (values.message.length < 10) errors.message = "A sentence or two about what you're building is enough.";
  if (values.kind && !kinds.includes(values.kind)) values.kind = "";
  if (values.budget && !budgets.includes(values.budget)) values.budget = "";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  // Bots fill the hidden field or post a complete form instantly; tell them it worked and drop the message.
  // This runs after validation, so a person who presses Send early still sees what's missing.
  const started = Number(form.get("started") ?? 0);
  if (clean(form.get("website"), 200) || (started && Date.now() - started < 2500)) return { status: "sent" };

  const subject = `New project: ${values.name.replace(/[\r\n]+/g, " ")}${values.kind ? ` · ${values.kind}` : ""}`;
  const text = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Building: ${values.kind || "Not specified"}`,
    `Budget: ${values.budget || "Not specified"}`,
    "",
    values.message,
  ].join("\n");

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (limited(ip)) return { status: "limited", mailto: mailtoFor(subject, text), values };

  const token = process.env.SLACK_BOT_TOKEN?.trim();
  const channel = process.env.SLACK_CHANNEL_ID?.trim();
  if (!token || !channel) return { status: "unconfigured", mailto: mailtoFor(subject, text), values };

  try {
    await postToSlack(token, channel, values);
    return { status: "sent" };
  } catch (error) {
    console.error("Project form Slack post failed", error instanceof Error ? error.message : "unknown");
    return { status: "failed", mailto: mailtoFor(subject, text), values };
  }
}

// Slack mrkdwn treats &, < and > as control characters.
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Posts the enquiry to Slack with the bot token, as pabloitalo.com does; gives up after 10 s so the email fallback shows. */
async function postToSlack(token: string, channel: string, v: Record<"name" | "email" | "kind" | "budget" | "message", string>) {
  const base = (process.env.SLACK_API_BASE_URL ?? "https://slack.com/api").trim().replace(/\/+$/, "");
  const fields = [
    ["Name", v.name],
    ["Email", v.email],
    ["Building", v.kind || "Not specified"],
    ["Budget", v.budget || "Not specified"],
  ];
  const res = await fetch(`${base}/chat.postMessage`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json; charset=utf-8" },
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      channel,
      text: `New stationbyte.com project enquiry from ${v.name}`,
      unfurl_links: false,
      blocks: [
        { type: "header", text: { type: "plain_text", text: "New project enquiry", emoji: false } },
        { type: "section", fields: fields.map(([k, val]) => ({ type: "mrkdwn", text: `*${k}:*\n${esc(val)}` })) },
        { type: "section", text: { type: "mrkdwn", text: `*Message:*\n${esc(v.message)}` } },
        { type: "context", elements: [{ type: "mrkdwn", text: `From the form at ${site.url}/contact · reply to ${esc(v.email)}` }] },
      ],
    }),
  });
  const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !result?.ok) throw new Error(`chat.postMessage failed: ${result?.error ?? res.status}`);
}
