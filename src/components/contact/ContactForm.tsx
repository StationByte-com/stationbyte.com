"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { sendProject } from "@/app/[locale]/contact/actions";
import { budgets, kinds, type ContactState } from "@/content/contact";
import { site } from "@/content/site";

const field =
  "w-full rounded-2xl border border-line bg-white px-5 py-4 text-[17px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-steel hover:border-steel/50 focus:border-ink focus:shadow-[0_0_0_4px_rgb(48_70_255/0.12)] aria-[invalid=true]:border-alert";
const group = "flex flex-col gap-2.5";
const labelText = "text-[15px] font-medium";
const ease = [0.16, 1, 0.3, 1] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Progress = { fields: Record<"name" | "email" | "kind" | "budget" | "message", boolean>; sent: boolean };

/** Which fields are answered right now, read straight from the form. */
const read = (form: HTMLFormElement): Progress["fields"] => {
  const d = new FormData(form);
  const v = (k: string) => String(d.get(k) ?? "").trim();
  return { name: !!v("name"), email: EMAIL.test(v("email")), kind: !!v("kind"), budget: !!v("budget"), message: v("message").length >= 10 };
};

export default function ContactForm({ onProgress, budgetLabels }: { onProgress?: (p: Progress) => void; budgetLabels: Record<string, string> }) {
  const t = useTranslations("contactForm");
  const locale = useLocale();
  const [state, action, pending] = useActionState<ContactState, FormData>(sendProject, { status: "idle" });
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);
  // When the form was first shown, sent with each attempt for the server's anti-bot timing check.
  const startedAt = useRef(0);
  const v = state.values ?? {};
  const err = state.errors ?? {};

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Submitting through onSubmit (not the form's action) skips React's automatic form reset,
  // so everything the visitor typed or picked stays put after a validation error.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.set("started", String(startedAt.current));
    startTransition(() => action(data));
  };

  useEffect(() => {
    if (state.status === "sent") onProgress?.({ fields: { name: true, email: true, kind: true, budget: true, message: true }, sent: true });
  }, [state.status, onProgress]);

  useEffect(() => {
    if (state.status === "idle") return;
    // Errors: focus the first field that needs fixing. Anything else: focus the message about it.
    // Either way, centre it so the fixed header never covers it.
    const target = state.status === "error" ? form.current?.querySelector<HTMLElement>("[aria-invalid='true']") : status.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  if (state.status === "sent") {
    return (
      <motion.div
        ref={status}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="flex flex-col gap-6 rounded-[28px] bg-ink p-10 text-paper outline-none md:p-14"
      >
        <span aria-hidden="true" className="grid grid-cols-3 gap-1.5 self-start">
          {Array.from({ length: 9 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease }}
              className={`size-4 rounded-[4px] ${i === 4 || i === 8 ? "bg-signal" : "bg-paper"}`}
            />
          ))}
        </span>
        <h2 className="text-[clamp(32px,3.4vw,48px)] font-semibold leading-none tracking-[-0.04em]">{t("sentTitle")}</h2>
        <p className="max-w-[480px] text-fog">
          {t("sentBody")}
        </p>
      </motion.div>
    );
  }

  return (
    <form ref={form} action={action} onSubmit={onSubmit} noValidate onChange={(e) => onProgress?.({ fields: read(e.currentTarget), sent: false })} className="flex flex-col gap-7" aria-labelledby="project-form-title">
      <h2 id="project-form-title" className="sr-only">
        {t("formTitle")}
      </h2>
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          {t("honeypot")}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div className={group}>
          <label htmlFor="cf-name" className={labelText}>{t("name")}</label>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            required
            defaultValue={v.name}
            aria-invalid={!!err.name}
            aria-describedby={err.name ? "name-error" : undefined}
            className={field}
          />
          {err.name && <p id="name-error" className="text-[14px] text-alert">{err.name}</p>}
        </div>
        <div className={group}>
          <label htmlFor="cf-email" className={labelText}>{t("email")}</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            defaultValue={v.email}
            aria-invalid={!!err.email}
            aria-describedby={err.email ? "email-error" : undefined}
            className={field}
          />
          {err.email && <p id="email-error" className="text-[14px] text-alert">{err.email}</p>}
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className={`${labelText} mb-3`}>{t("kind")}</legend>
        <div className="flex flex-wrap gap-2.5">
          {kinds.map((k) => (
            <label key={k} className="group relative cursor-pointer">
              <input type="radio" name="kind" value={k} defaultChecked={v.kind === k} className="peer sr-only" />
              <span className="flex min-h-11 items-center gap-2.5 rounded-full border border-line bg-white px-4.5 py-2.5 text-[15px] transition-[background-color,border-color,color] duration-300 group-hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-signal">
                <span aria-hidden="true" className="size-2 rounded-[2px] bg-current opacity-40" />
                {t(`kinds.${k}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={group}>
        <label htmlFor="cf-budget" className={labelText}>
          {t("budget")} <span className="font-normal text-steel">{t("optional")}</span>
        </label>
        <span className="relative">
          <select id="cf-budget" name="budget" defaultValue="" className={`${field} appearance-none pr-12`}>
            <option value="">{t("chooseRange")}</option>
            {budgets.map((b) => (
              <option key={b.id} value={b.id}>
                {budgetLabels[b.id]}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-steel">
            ↓
          </span>
        </span>
      </div>

      <div className={group}>
        <label htmlFor="cf-message" className={labelText}>{t("message")}</label>
        <textarea
          id="cf-message"
          name="message"
          rows={6}
          required
          defaultValue={v.message}
          placeholder={t("placeholder")}
          aria-invalid={!!err.message}
          aria-describedby={err.message ? "message-error" : undefined}
          className={`${field} resize-y`}
        />
        {err.message && <p id="message-error" className="text-[14px] text-alert">{err.message}</p>}
      </div>

      <div ref={status} tabIndex={-1} aria-live="polite" className="outline-none">
        <AnimatePresence>
          {(state.status === "unconfigured" || state.status === "failed" || state.status === "limited") && state.mailto && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5, ease }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
                <p>
                  {t(state.status as "failed" | "limited" | "unconfigured")}
                </p>
                <a href={state.mailto} className="self-start rounded-full bg-signal px-5.5 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-signal-deep">
                  {t("openMail")}
                </a>
                <p className="text-[14px] text-steel">{t("orWrite", { email: site.email })}</p>
              </div>
            </motion.div>
          )}
          {state.status === "error" && (
            <p className="text-[15px] text-alert">{t("errors.summary")}</p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-5 border-t border-line pt-7">
        <p className="max-w-[420px] text-[14px] text-steel">
          {t.rich("privacy", {
            link: (chunks) => (
              <Link href="/privacy" className="text-ink underline decoration-line underline-offset-4 hover:decoration-signal">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-ink px-7 py-4 font-medium text-paper transition-[background-color,opacity] duration-300 hover:bg-signal disabled:opacity-70"
        >
          {pending ? t("sending") : t("send")}
          <span aria-hidden="true" className={`transition-transform duration-500 ease-station ${pending ? "translate-x-1" : "group-hover:translate-x-1"}`}>
            →
          </span>
        </button>
      </div>
    </form>
  );
}
