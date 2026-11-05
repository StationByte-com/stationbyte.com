"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { budgets, kinds, type ContactState } from "@/content/contact";
import { defaultLocale, isLocale, localeInfo } from "@/i18n/locales";

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
const mailtoFor = (subject: string, text: string, shortened: string) => {
  const body = text.length > 1500 ? `${text.slice(0, 1500)}\n\n${shortened}` : text;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

type Translate = Awaited<ReturnType<typeof getTranslations<"contactForm">>>;

const usd = (n: number) => `$${n / 1000}k`;

/** The chosen budget in words, e.g. "$15k–$50k" or "Not sure yet". */
function budgetText(t: Translate, id: string) {
  const b = budgets.find((x) => x.id === id);
  if (!b) return t("mail.notSpecified");
  if (!("from" in b) && !("to" in b)) return t("budgets.unsure");
  if (!("from" in b)) return t("budgets.under", { amount: usd(b.to) });
  if (!("to" in b)) return t("budgets.over", { amount: usd(b.from) });
  return t("budgets.range", { from: usd(b.from), to: usd(b.to) });
}

/**
 * Validates the project form and posts it to the studio's Slack channel. Without Slack settings it returns a
 * ready-made email instead. Errors and the fallback email are in the visitor's language; Slack always gets
 * English plus the language they wrote from, so the reply can be in it.
 */
export async function sendProject(_: ContactState, form: FormData): Promise<ContactState> {
  const requested = String(form.get("locale") ?? "");
  const locale = isLocale(requested) ? requested : defaultLocale;
  const t = await getTranslations({ locale, namespace: "contactForm" });
  const en = await getTranslations({ locale: defaultLocale, namespace: "contactForm" });

  const values = {
    name: clean(form.get("name"), 120),
    email: clean(form.get("email"), 200),
    kind: clean(form.get("kind"), 20),
    budget: clean(form.get("budget"), 20),
    message: clean(form.get("message"), 5000),
  };

  const errors: ContactState["errors"] = {};
  if (!values.name) errors.name = t("errors.name");
  if (!EMAIL.test(values.email)) errors.email = t("errors.email");
  if (values.message.length < 10) errors.message = t("errors.message");
  const kind = kinds.find((k) => k === values.kind);
  if (!kind) values.kind = "";
  if (!budgets.some((b) => b.id === values.budget)) values.budget = "";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  // Bots fill the hidden field or post a complete form instantly; tell them it worked and drop the message.
  // This runs after validation, so a person who presses Send early still sees what's missing.
  const started = Number(form.get("started") ?? 0);
  if (clean(form.get("website"), 200) || (started && Date.now() - started < 2500)) return { status: "sent" };

  // The fallback email is the visitor's own message, sent from their mail app, so it's in their language.
  const subject = t("mail.subject", { name: values.name.replace(/[\r\n]+/g, " ") }) + (kind ? ` · ${t(`kinds.${kind}`)}` : "");
  const text = [
    `${t("mail.name")}: ${values.name}`,
    `${t("mail.email")}: ${values.email}`,
    `${t("mail.building")}: ${kind ? t(`kinds.${kind}`) : t("mail.notSpecified")}`,
    `${t("mail.budget")}: ${budgetText(t, values.budget)}`,
    "",
    values.message,
  ].join("\n");
  const mailto = mailtoFor(subject, text, t("mail.shortened"));

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (limited(ip)) return { status: "limited", mailto, values };

  const token = process.env.SLACK_BOT_TOKEN?.trim();
  const channel = process.env.SLACK_CHANNEL_ID?.trim();
  if (!token || !channel) return { status: "unconfigured", mailto, values };

  try {
    await postToSlack(token, channel, {
      name: values.name,
      email: values.email,
      kind: kind ? en(`kinds.${kind}`) : "Not specified",
      budget: budgetText(en, values.budget),
      message: values.message,
      language: `${localeInfo[locale].name} (${localeInfo[locale].htmlLang})`,
    });
    return { status: "sent" };
  } catch (error) {
    console.error("Project form Slack post failed", error instanceof Error ? error.message : "unknown");
    return { status: "failed", mailto, values };
  }
}

// Slack mrkdwn treats &, < and > as control characters.
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Posts the enquiry to Slack with the bot token, as pabloitalo.com does; gives up after 10 s so the email fallback shows. */
async function postToSlack(token: string, channel: string, v: Record<"name" | "email" | "kind" | "budget" | "message" | "language", string>) {
  const base = (process.env.SLACK_API_BASE_URL ?? "https://slack.com/api").trim().replace(/\/+$/, "");
  const fields = [
    ["Name", v.name],
    ["Email", v.email],
    ["Building", v.kind],
    ["Budget", v.budget],
    ["Language", v.language],
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
        { type: "context", elements: [{ type: "mrkdwn", text: `From the form at ${site.url}/contact · reply in ${esc(v.language)} to ${esc(v.email)}` }] },
      ],
    }),
  });
  const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !result?.ok) throw new Error(`chat.postMessage failed: ${result?.error ?? res.status}`);
}
