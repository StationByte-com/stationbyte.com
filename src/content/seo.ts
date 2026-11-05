import type { Metadata } from "next";
import { site } from "./site";

/**
 * Metadata for an inner page. Next replaces a parent's openGraph and twitter objects instead of merging them,
 * so every page sets the full set: its own title, description, URL and 1200×630 preview from public/og
 * (built by `npm run og:build`).
 */
export function pageMetadata({ title, description, path, og, ogAlt, type = "website" }: { title: string; description: string; path: string; og: string; ogAlt: string; type?: "website" | "article" }): Metadata {
  const full = `${title} · ${site.name}`;
  const image = { url: `/og/${og}.jpg`, width: 1200, height: 630, alt: ogAlt };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, siteName: site.name, locale: "en_GB", url: path, title: full, description, images: [image] },
    twitter: { card: "summary_large_image", title: full, description, images: [image] },
  };
}
