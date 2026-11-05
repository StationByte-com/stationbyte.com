"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LANGUAGE_KEY, rememberLanguage, useHash } from "./LanguageSwitcher";
import { isLocale, localeInfo, localePath, type Locale } from "@/i18n/locales";

export type Suggestion = { text: string; go: string; stay: string; label: string };

/** The visitor's first browser language that the site is published in, if any. */
function preferred(): Locale | null {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const lower = tag.toLowerCase();
    const match = lower.startsWith("pt") ? "pt-br" : lower.split("-")[0];
    if (isLocale(match)) return match;
  }
  return null;
}

/**
 * "This page is also in Español": shown only when the browser prefers another language the site has, written in
 * that language. Never redirects (Google's guidance), never shown again once either button is used.
 * Lives inside the fixed header, so it overlays the page instead of pushing it down.
 */
const CHOSEN = "stationbyte:language-chosen";

export default function LanguageSuggest({ suggestions, placement }: { suggestions: Record<Locale, Suggestion>; placement: "header" | "bottom" }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const hash = useHash();
  const [target, setTarget] = useState<Locale | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LANGUAGE_KEY);
    } catch {
      // Blocked storage: treat as no choice yet.
    }
    if (stored) return;
    const want = preferred();
    // Reading the browser's language can only happen after hydration, so this one state update is the point of the effect.
    // oxlint-disable-next-line react-hooks/set-state-in-effect
    if (want && want !== locale) setTarget(want);
    const hide = () => setTarget(null);
    window.addEventListener(CHOSEN, hide);
    return () => window.removeEventListener(CHOSEN, hide);
  }, [locale]);

  if (!target) return null;
  const s = suggestions[target];
  // The current page's language named in the visitor's language: "inglés", "Englisch", "英語".
  const current = new Intl.DisplayNames([localeInfo[target].htmlLang], { type: "language" }).of(localeInfo[locale].htmlLang.split("-")[0]) ?? localeInfo[locale].name;
  const stay = s.stay.replace("{language}", current);

  return (
    <aside
      lang={localeInfo[target].htmlLang}
      aria-label={s.label}
      className={
        placement === "header"
          ? "hidden border-y border-line bg-white text-ink md:block"
          : "fixed inset-x-3 bottom-3 z-40 rounded-[22px] border border-line bg-white text-ink shadow-[0_24px_48px_-24px_rgb(10_10_11/0.45)] md:hidden"
      }
    >
      <div className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-3 ${placement === "header" ? "shell py-2" : "p-4"}`}>
        <p className="flex items-center gap-3 text-[15px]">
          <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[3px] bg-signal" />
          {s.text}
        </p>
        <div className="flex items-center gap-1.5">
          <a
            href={localePath(target, pathname) + hash}
            hrefLang={localeInfo[target].hreflang}
            onClick={() => rememberLanguage(target)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4.5 text-[15px] font-medium text-paper transition-colors hover:bg-signal"
          >
            {s.go} <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            onClick={() => {
              rememberLanguage(locale);
              window.dispatchEvent(new Event(CHOSEN));
              // The bar is about to disappear; keep keyboard focus at the top of the page instead of losing it.
              document.querySelector<HTMLElement>("header a")?.focus();
            }}
            className="min-h-11 px-3 text-[15px] text-steel transition-colors hover:text-ink"
          >
            {stay}
          </button>
        </div>
      </div>
    </aside>
  );
}

