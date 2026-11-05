import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // English keeps every URL it had before translations existed; other languages live under /es, /pt-br, ...
  localePrefix: "as-needed",
  // Google: never redirect on a guessed language, link the versions instead. No detection also means no cookie,
  // which keeps the privacy page's "no cookies" promise.
  localeDetection: false,
  localeCookie: false,
  // hreflang is written into each page's <head> and the sitemap; Link headers would be a third copy.
  alternateLinks: false,
});
