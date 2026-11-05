"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "@/components/brand/Logo";
import { nav } from "@/content/site";
import type { Locale } from "@/i18n/locales";
import { LanguageChips, LanguageMenu } from "./LanguageSwitcher";
import LanguageSuggest, { type Suggestion } from "./LanguageSuggest";

export default function Header({ suggestions }: { suggestions: Record<Locale, Suggestion> }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const current = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Hide while reading down the page; come back as soon as the visitor scrolls up.
      if (Math.abs(y - lastY) > 6) setAway(y > lastY && y > 320);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.dispatchEvent(new Event("scroll-lock"));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
        return;
      }
      // Keep Tab inside the open menu: the toggle button plus the menu's links.
      if (e.key !== "Tab") return;
      const items = [button.current, ...Array.from(document.querySelectorAll<HTMLElement>("#mobile-menu a"))].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.dispatchEvent(new Event("scroll-unlock"));
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,color,translate] duration-200 [transition-duration:200ms,200ms,200ms,200ms,500ms] ease-station ${
        away && !open ? "-translate-y-full" : ""
      } ${
        scrolled && !open ? "border-b border-line bg-paper/85 backdrop-blur-xl" : "border-b border-transparent"
      } ${open ? "bg-ink text-paper" : ""}`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={t("header.homeLabel")} onClick={close} className="group/logo relative z-10 block">
          <Logo assemble shuffle className="h-[26px] w-auto" />
        </Link>

        <nav aria-label={t("header.main")} className="hidden items-center gap-7 text-[15px] md:flex lg:gap-9">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current(item.href) ? "page" : undefined}
              className="relative text-ink/80 transition-colors hover:text-ink aria-[current=page]:text-ink"
            >
              {t(`nav.${item.key}`)}
              {/* The active page gets the open-slot tile under its label. */}
              <span
                aria-hidden="true"
                className={`absolute -bottom-2.5 left-1/2 size-1.5 -translate-x-1/2 rounded-[2px] bg-signal transition-[opacity,scale] duration-300 ease-station ${
                  current(item.href) ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              />
            </Link>
          ))}
          <LanguageMenu />
          <Link
            href="/contact"
            className="rounded-full bg-ink px-5 py-3 font-medium text-paper transition-[background-color,transform] duration-300 ease-station hover:-translate-y-px hover:bg-signal"
          >
            {t("common.startProject")}
          </Link>
        </nav>

        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className={`relative z-10 grid size-11 place-items-center rounded-full border md:hidden ${
            open ? "border-edge bg-graphite" : "border-line bg-white"
          }`}
        >
          <span className="sr-only">{open ? t("header.closeMenu") : t("header.openMenu")}</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            {[0, 1, 2].flatMap((r) =>
              [0, 1, 2].map((c) => {
                if (r === 2 && c === 2) return null;
                // Closed: the brand grid. Open: tiles collapse into an X.
                const onX = r === c || r + c === 2;
                return (
                  <rect
                    key={`${r}${c}`}
                    x={2 + c * 5}
                    y={2 + r * 5}
                    width="4"
                    height="4"
                    rx="1"
                    fill={r === 1 && c === 1 ? "var(--color-signal)" : "currentColor"}
                    className="transition-opacity duration-200"
                    opacity={open && !onX ? 0 : 1}
                  />
                );
              }),
            )}
            {open && <rect x="12" y="12" width="4" height="4" rx="1" fill="currentColor" />}
          </svg>
        </button>
      </div>

      {!open && <LanguageSuggest suggestions={suggestions} placement="header" />}

      <div id="mobile-menu" hidden={!open} className="fixed inset-0 top-[72px] bg-ink text-paper md:hidden">
        <nav aria-label={t("header.mobile")} className="shell flex h-full flex-col justify-between gap-8 overflow-y-auto pb-10 pt-8">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-edge">
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={current(item.href) ? "page" : undefined}
                  className="flex items-baseline justify-between py-4 text-[40px] font-semibold tracking-[-0.04em] aria-[current=page]:text-signal-ink [:lang(ja)_&]:text-[32px] [:lang(ja)_&]:tracking-normal [:lang(ko)_&]:text-[32px] [:lang(ko)_&]:tracking-normal"
                >
                  {t(`nav.${item.key}`)}
                  <span aria-hidden="true" className="text-2xl text-fog">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-6">
            {open && <LanguageChips onPick={close} />}
            <Link href="/contact" onClick={close} className="rounded-full bg-paper px-6 py-4 text-center font-medium text-ink">
              {t("common.startProject")}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
