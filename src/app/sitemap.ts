import type { MetadataRoute } from "next";
import { services, site } from "@/content/site";
import { absoluteUrl, languageAlternates, ogImage } from "@/content/seo";
import { defaultLocale, locales, type Locale } from "@/i18n/locales";

const img = (path: string) => `${site.url}${path}`;

// Each page with the images that carry it, so they can surface in image search.
const pages: { path: string; priority: number; images?: (locale: Locale) => string[] }[] = [
  { path: "/", priority: 1, images: (l) => [img(l === defaultLocale ? "/opengraph-image.jpg" : ogImage(l, "home")), img("/video/hero-wide-poster.jpg")] },
  { path: "/work", priority: 0.9, images: () => [img("/images/skedez-desktop.webp"), img("/images/work-nda.webp")] },
  { path: "/work/skedez", priority: 0.8, images: () => [img("/images/skedez-desktop.webp"), img("/images/skedez-mobile.webp")] },
  { path: "/services", priority: 0.9, images: () => services.map((s) => img(s.image)) },
  ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.8, images: (l: Locale) => [img(s.image), img(ogImage(l, s.slug))] })),
  { path: "/process", priority: 0.7, images: () => [img("/images/process-stacks.webp")] },
  { path: "/studio", priority: 0.7, images: () => [img("/images/studio-stack.webp"), img("/images/studio-bench.webp")] },
  { path: "/contact", priority: 0.8, images: () => [img("/images/contact-slot.webp")] },
  { path: "/privacy", priority: 0.2 },
];

/**
 * Every page in every language. Each entry lists all its language versions plus x-default, which is how
 * Google pairs them (the same set is also in each page's <head>).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified: the build time would claim every page changed on every deploy.
  return pages.flatMap((p) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, p.path),
      changeFrequency: "monthly" as const,
      priority: p.priority,
      images: p.images?.(locale),
      alternates: { languages: languageAlternates(p.path) },
    })),
  );
}
