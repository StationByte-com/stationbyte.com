import type { Metadata } from "next";
import { site } from "./site";
import { defaultLocale, localeInfo, localePath, locales, type Locale } from "@/i18n/locales";

/** Absolute URL of `path` in `locale`. */
export const absoluteUrl = (locale: Locale, path: string) => `${site.url}${localePath(locale, path) === "/" ? "" : localePath(locale, path)}`;

/** hreflang map for one page: every language plus x-default (English), the same set on every version. */
export function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of locales) map[localeInfo[l].hreflang] = absoluteUrl(l, path);
  map["x-default"] = absoluteUrl(defaultLocale, path);
  return map;
}

/** Social preview for a page: English images live in /og, other languages in /og/<locale> (npm run og:build). */
/** Indexing rules for real pages (404s set their own noindex). */
export const ROBOTS: Metadata["robots"] = { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } };

/** The language's llms.txt, advertised to AI tools as the page's Markdown alternate. */
export const llmsTxt = (locale: Locale) => `${site.url}${locale === defaultLocale ? "" : `/${locale}`}/llms.txt`;

export const ogImage = (locale: Locale, name: string) => (locale === defaultLocale ? `/og/${name}.jpg` : `/og/${locale}/${name}.jpg`);

/**
 * Metadata for an inner page. Next replaces a parent's openGraph and twitter objects instead of merging them,
 * so every page sets the full set: its own title, description, canonical, hreflang alternates and 1200×630 preview.
 */
export function pageMetadata({
  locale,
  title,
  description,
  path,
  og,
  ogAlt,
  type = "website",
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  og: string;
  ogAlt: string;
  type?: "website" | "article";
}): Metadata {
  const full = `${title} · ${site.name}`;
  const image = { url: ogImage(locale, og), width: 1200, height: 630, alt: ogAlt };
  const url = absoluteUrl(locale, path);
  return {
    title,
    description,
    robots: ROBOTS,
    alternates: { canonical: url, languages: languageAlternates(path), types: { "text/markdown": llmsTxt(locale) } },
    openGraph: {
      type,
      siteName: site.name,
      locale: localeInfo[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].og),
      url,
      title: full,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [image] },
  };
}
