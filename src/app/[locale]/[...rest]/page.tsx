import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadLocale } from "@/i18n/copy";

export async function generateMetadata({ params }: PageProps<"/[locale]/[...rest]">): Promise<Metadata> {
  const { copy } = await loadLocale(params);
  return { title: copy.pages.notFound.title, robots: { index: false, follow: true } };
}

// The locale layout sets dynamicParams = false (only real languages); this segment must accept any path, or the
// request 404s at routing level and skips the localized not-found page.
export const dynamicParams = true;

/** Any unknown path inside a language shows that language's 404 page. */
export default async function CatchAll({ params }: PageProps<"/[locale]/[...rest]">) {
  await loadLocale(params);
  notFound();
}
