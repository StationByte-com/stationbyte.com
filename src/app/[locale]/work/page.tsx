import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import PageHero from "@/components/site/PageHero";
import NextStep from "@/components/site/NextStep";
import Work from "@/components/home/Work";
import DeviceDuo from "@/components/visuals/DeviceDuo";
import JsonLd from "@/components/site/JsonLd";
import { workPage } from "@/content/schema";
import { loadLocale } from "@/i18n/copy";
import ClientMessages from "@/i18n/ClientMessages";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.work;
  return pageMetadata({ locale, title: p.title, description: p.description, path: "/work", og: "work", ogAlt: p.ogAlt });
}

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.work;
  return (
    <ClientMessages locale={locale} copy={copy} home visuals={["deviceDuo"]}>
    <main id="main">
      <JsonLd data={workPage(locale, copy)} />
      <PageHero current={copy.nav.work} eyebrow={p.eyebrow} title={p.heading} lede={p.lede} visual={<DeviceDuo />} />
      <Work intro={false} />
      <NextStep title={p.nextStep} />
    </main>
    </ClientMessages>
  );
}
