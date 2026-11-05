import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import SmoothScroll from "@/components/motion/SmoothScroll";
import MotionProvider from "@/components/motion/MotionProvider";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LanguageSuggest, { type Suggestion } from "@/components/site/LanguageSuggest";
import JsonLd from "@/components/site/JsonLd";
import { site } from "@/content/site";
import { siteGraph } from "@/content/schema";
import { getCopy, loadLocale } from "@/i18n/copy";
import { SHARED } from "@/i18n/ClientMessages";
import { localeInfo, locales } from "@/i18n/locales";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f6f4",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await loadLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: `%s · ${site.name}` },
    description: t("description"),
    applicationName: site.name,
    authors: [{ name: site.legalName, url: site.url }],
    creator: site.legalName,
    publisher: site.legalName,
    category: "technology",
    formatDetection: { telephone: false, address: false, email: false },
    // Search Console's HTML-tag method, if used: set at build time so the token never lives in the repo.
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  };
}


export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale, copy } = await loadLocale(params);
  // Header, menus and buttons only; each page adds what its own client components read (see ClientMessages).
  const clientMessages = Object.fromEntries(SHARED.map((k) => [k, copy[k]]));
  // Each language's own words for "this page is also in <language>", so the bar can speak the visitor's language.
  const suggestions = Object.fromEntries(
    await Promise.all(
      locales.map(async (l) => {
        const { language } = await getCopy(l);
        return [l, { text: language.suggestText, go: language.suggestGo, stay: language.suggestStay, label: language.suggestLabel }];
      }),
    ),
  ) as Record<(typeof locales)[number], Suggestion>;

  return (
    <html lang={localeInfo[locale].htmlLang} className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint so scroll reveals never hide content for no-JS visitors. */}
        <Script id="js-flag" strategy="beforeInteractive">{"document.documentElement.classList.add('js')"}</Script>
        <JsonLd data={siteGraph(locale, copy)} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
          >
            {copy.common.skipToContent}
          </a>
          <SmoothScroll />
          <MotionProvider>
            <Header suggestions={suggestions} />
            <LanguageSuggest suggestions={suggestions} placement="bottom" />
            {children}
            <Footer locale={locale} />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
