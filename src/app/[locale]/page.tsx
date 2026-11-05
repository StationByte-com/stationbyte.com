import Hero from "@/components/home/Hero";
import Work from "@/components/home/Work";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import Studio from "@/components/home/Studio";
import Contact from "@/components/home/Contact";
import Marquee from "@/components/motion/Marquee";
import { services, stack } from "@/content/site";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, languageAlternates, llmsTxt, ogImage, ROBOTS } from "@/content/seo";
import { loadLocale } from "@/i18n/copy";
import { defaultLocale, localeInfo, locales } from "@/i18n/locales";
import { site } from "@/content/site";
import { tagLabel } from "@/content/services";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await loadLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  const hero = await getTranslations({ locale, namespace: "home.hero" });
  const url = absoluteUrl(locale, "/");
  // English keeps its hand-made card; other languages get one with their own headline (npm run og:build).
  const image =
    locale === defaultLocale
      ? { url: "/opengraph-image.jpg", width: 1200, height: 630, alt: t("ogAlt") }
      : { url: ogImage(locale, "home"), width: 1200, height: 630, alt: `${site.name}: ${(hero.raw("title") as string[]).join(" ")} ${hero("eyebrow")}` };
  return {
    title: { absolute: t("title") },
    robots: ROBOTS,
    alternates: { canonical: url, languages: languageAlternates("/"), types: { "text/markdown": llmsTxt(locale) } },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: t("title"),
      description: t("description"),
      locale: localeInfo[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].og),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description"), images: [image] },
  };
}
import ClientMessages from "@/i18n/ClientMessages";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale, copy } = await loadLocale(params);
  return (
    <ClientMessages locale={locale} copy={copy} home stages>
    <main id="main">
        <Hero />
        <div className="mt-20 md:mt-24">
          <Marquee items={stack} label={copy.common.toolsLabel} />
        </div>
        <div className="mt-28 md:mt-32">
          <Work />
        </div>
        <Services services={services.map((s) => ({ slug: s.slug, loop: s.loop, tags: s.tags.map((tag) => tagLabel(tag, copy)), title: copy.services[s.slug].title, body: copy.services[s.slug].body }))} />
        <Process />
        <Studio />
        <Contact />
    </main>
    </ClientMessages>
  );
}
