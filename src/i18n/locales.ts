/**
 * Every language the site is published in. The `code` is also the URL prefix (English has none).
 * Spanish is written for Spain and Portuguese for Brazil, but hreflang uses the language alone, so Google can
 * offer them to every Spanish and Portuguese speaker (it has no `es-419`). Labels are language names only.
 */
export const locales = ["en", "es", "pt-br", "fr", "de", "it", "nl", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

type LocaleInfo = {
  /** Native name, shown in the switcher, footer and suggestion bar. */
  name: string;
  /** Two-letter label on the switcher button. */
  short: string;
  /** `<html lang>`: the exact variety the copy is written in. */
  htmlLang: string;
  /** Value used in hreflang and in schema.org `inLanguage`. */
  hreflang: string;
  /** Open Graph `og:locale`. */
  og: string;
};

export const localeInfo: Record<Locale, LocaleInfo> = {
  en: { name: "English", short: "EN", htmlLang: "en-GB", hreflang: "en", og: "en_GB" },
  es: { name: "Español", short: "ES", htmlLang: "es-ES", hreflang: "es", og: "es_ES" },
  "pt-br": { name: "Português", short: "PT", htmlLang: "pt-BR", hreflang: "pt", og: "pt_BR" },
  fr: { name: "Français", short: "FR", htmlLang: "fr-FR", hreflang: "fr", og: "fr_FR" },
  de: { name: "Deutsch", short: "DE", htmlLang: "de-DE", hreflang: "de", og: "de_DE" },
  it: { name: "Italiano", short: "IT", htmlLang: "it-IT", hreflang: "it", og: "it_IT" },
  nl: { name: "Nederlands", short: "NL", htmlLang: "nl-NL", hreflang: "nl", og: "nl_NL" },
  ja: { name: "日本語", short: "JA", htmlLang: "ja", hreflang: "ja", og: "ja_JP" },
  ko: { name: "한국어", short: "KO", htmlLang: "ko", hreflang: "ko", og: "ko_KR" },
};

export const isLocale = (value: unknown): value is Locale => typeof value === "string" && (locales as readonly string[]).includes(value);

/** Site-relative path for `path` (always starting with "/") in `locale`: "/services" → "/es/services". */
export const localePath = (locale: Locale, path: string) => {
  const clean = path === "/" ? "" : path;
  return locale === defaultLocale ? clean || "/" : `/${locale}${clean}`;
};
