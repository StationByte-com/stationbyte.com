import type { MetadataRoute } from "next";
import { services, site } from "@/content/site";

const img = (path: string) => `${site.url}${path}`;

// Each page with the images that carry it, so they can surface in image search.
const pages: { path: string; priority: number; images?: string[] }[] = [
  { path: "", priority: 1, images: [img("/opengraph-image.jpg"), img("/video/hero-wide-poster.jpg")] },
  { path: "/work", priority: 0.9, images: [img("/images/skedez-desktop.webp"), img("/images/work-nda.webp")] },
  { path: "/work/skedez", priority: 0.8, images: [img("/images/skedez-desktop.webp"), img("/images/skedez-mobile.webp")] },
  { path: "/services", priority: 0.9, images: services.map((s) => img(s.image.src)) },
  ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.8, images: [img(s.image.src), img(`/og/${s.slug}.jpg`)] })),
  { path: "/process", priority: 0.7, images: [img("/images/process-stacks.webp")] },
  { path: "/studio", priority: 0.7, images: [img("/images/studio-stack.webp"), img("/images/studio-bench.webp")] },
  { path: "/contact", priority: 0.8, images: [img("/images/contact-slot.webp")] },
  { path: "/privacy", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified: the build time would claim every page changed on every deploy.
  return pages.map((p) => ({ url: `${site.url}${p.path}`, changeFrequency: "monthly", priority: p.priority, images: p.images }));
}
