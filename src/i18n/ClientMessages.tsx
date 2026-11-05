import { NextIntlClientProvider, type Messages } from "next-intl";
import type { Locale } from "./locales";

/** Namespaces every client component may use: header, menus, buttons. Sent once per page. */
export const SHARED = ["common", "nav", "header", "language"] as const;

type VisualKey = keyof Messages["visuals"];

/**
 * Sends a page's client components only the messages they read, instead of the whole message tree on every page.
 * A nested provider replaces (doesn't merge) its parent's messages, so the shared namespaces are included again.
 */
export default function ClientMessages({
  locale,
  copy,
  home,
  stages,
  contactForm,
  visuals = [],
  children,
}: {
  locale: Locale;
  copy: Messages;
  /** Homepage sections (also used by the Work band on /work). */
  home?: boolean;
  /** Stage names and one-line summaries for the process line and grid. */
  stages?: boolean;
  contactForm?: boolean;
  visuals?: VisualKey[];
  children: React.ReactNode;
}) {
  const messages: Record<string, unknown> = Object.fromEntries(SHARED.map((k) => [k, copy[k]]));
  if (home) messages.home = copy.home;
  if (stages) messages.process = { stages: copy.process.stages.map(({ title, body }) => ({ title, body })) };
  if (contactForm) messages.contactForm = copy.contactForm;
  if (visuals.length) messages.visuals = Object.fromEntries(visuals.map((k) => [k, copy.visuals[k]]));
  return (
    <NextIntlClientProvider locale={locale} messages={messages as Messages}>
      {children}
    </NextIntlClientProvider>
  );
}
