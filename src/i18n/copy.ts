import { getMessages, setRequestLocale } from "next-intl/server";
import type { Messages } from "next-intl";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./locales";

/**
 * Reads the route's locale, enables static rendering for it, and returns that language's full message tree.
 * Server components use the tree for structured copy (lists, cards, FAQs) and `getTranslations` for strings
 * that need ICU formatting or rich text.
 */
export async function loadLocale(params: Promise<{ locale: string }>): Promise<{ locale: Locale; copy: Messages }> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const copy = (await getMessages({ locale })) as Messages;
  return { locale, copy };
}

/** Same message tree without touching request state, for metadata, sitemaps and text routes. */
export async function getCopy(locale: Locale): Promise<Messages> {
  return (await getMessages({ locale })) as Messages;
}

