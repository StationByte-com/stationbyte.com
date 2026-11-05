"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { localeInfo, localePath, locales, type Locale } from "@/i18n/locales";

/** Remembered so the suggestion bar never asks again once the visitor has picked a language. */
export const LANGUAGE_KEY = "stationbyte.language";
export const rememberLanguage = (locale: Locale) => {
  try {
    localStorage.setItem(LANGUAGE_KEY, locale);
  } catch {
    // Storage can be blocked; the choice still works for this page view.
  }
};

/** The page's #fragment, so switching language keeps the reader on the same section. Empty on the server. */
export function useHash() {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  return hash;
}

const Globe = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M1.5 8h13M8 1.5c1.9 2 2.8 4.1 2.8 6.5S9.9 12.5 8 14.5C6.1 12.5 5.2 10.4 5.2 8S6.1 3.5 8 1.5z" />
  </svg>
);

/** Header language menu: a disclosure button and a list of links to this same page in each language. */
export function LanguageMenu() {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const hash = useHash();
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const items = () => Array.from(root.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const list = items();
      const i = list.indexOf(document.activeElement as HTMLAnchorElement);
      // From the button (not in the list yet), Up goes to the last item and Down to the first.
      const next = i < 0 ? (e.key === "ArrowDown" ? 0 : list.length - 1) : e.key === "ArrowDown" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
      list[next]?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={root} className="relative" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 items-center gap-2 rounded-full border bg-white pl-3 pr-3.5 transition-colors duration-300 hover:border-ink ${open ? "border-ink" : "border-line"}`}
      >
        <Globe />
        <span className="font-mono text-[12px] font-medium tracking-[0.08em]">{localeInfo[locale].short}</span>
        <span className="sr-only"> {t("change", { name: localeInfo[locale].name })}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5l3 3 3-3" />
        </svg>
      </button>
      <div
        id={`${id}-list`}
        hidden={!open}
        className="absolute right-0 top-[54px] w-[248px] rounded-[22px] border border-line bg-white p-2 text-ink shadow-[0_30px_60px_-30px_rgb(10_10_11/0.35)]"
      >
        <p className="eyebrow px-3 pb-2 pt-2.5 text-steel">{t("label")}</p>
        {/* Rendered only while open: hidden lists would add nine links to every page's HTML (the footer has the crawlable ones). */}
        {open && (
        <ul>
          {locales.map((l) => (
            <li key={l}>
              <a
                href={localePath(l, pathname) + hash}
                lang={localeInfo[l].htmlLang}
                hrefLang={localeInfo[l].hreflang}
                aria-current={l === locale ? "true" : undefined}
                onClick={() => {
                  rememberLanguage(l);
                  setOpen(false);
                }}
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-[15px] transition-colors hover:bg-paper focus-visible:bg-paper aria-[current=true]:bg-paper aria-[current=true]:font-medium"
              >
                <span className="flex items-center gap-2.5">
                  <span aria-hidden="true" className={`size-[7px] rounded-[2px] ${l === locale ? "bg-signal" : "bg-transparent"}`} />
                  {localeInfo[l].name}
                </span>
                <span aria-hidden="true" className="font-mono text-[11px] font-medium tracking-[0.08em] text-steel">
                  {localeInfo[l].short}
                </span>
              </a>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}

/** Phone menu: every language as a chip, two to a row. */
export function LanguageChips({ onPick }: { onPick?: () => void }) {
  const t = useTranslations("language");
  const id = useId();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const hash = useHash();

  return (
    <div role="group" aria-labelledby={`${id}-label`} className="flex flex-col gap-3">
      <p id={`${id}-label`} className="eyebrow text-fog">{t("label")}</p>
      <ul className="grid grid-cols-2 gap-2">
        {locales.map((l) => (
          <li key={l}>
            <a
              href={localePath(l, pathname) + hash}
              lang={localeInfo[l].htmlLang}
              hrefLang={localeInfo[l].hreflang}
              aria-current={l === locale ? "true" : undefined}
              onClick={() => {
                rememberLanguage(l);
                onPick?.();
              }}
              className="flex min-h-11 items-center gap-2.5 rounded-full border border-edge px-3.5 text-[15px] transition-colors aria-[current=true]:border-paper aria-[current=true]:bg-paper aria-[current=true]:text-ink"
            >
              <span aria-hidden="true" className={`size-[7px] shrink-0 rounded-[2px] ${l === locale ? "bg-signal" : "bg-edge"}`} />
              {localeInfo[l].name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Footer column: plain links between the language versions of this page (also how crawlers find them). */
export function LanguageList({ heading }: { heading: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const hash = useHash();

  return (
    <nav aria-label={heading} className="flex flex-col gap-2.5">
      <p className="eyebrow text-[11px] text-fog/80">{heading}</p>
      {locales.map((l) => (
        <a
          key={l}
          href={localePath(l, pathname) + hash}
          lang={localeInfo[l].htmlLang}
          hrefLang={localeInfo[l].hreflang}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => rememberLanguage(l)}
          className="flex items-center gap-2 text-paper transition-colors hover:text-signal-ink aria-[current=true]:text-signal-ink"
        >
          {l === locale && <span aria-hidden="true" className="size-[7px] rounded-[2px] bg-signal" />}
          {localeInfo[l].name}
        </a>
      ))}
    </nav>
  );
}
