import type { Messages } from "next-intl";
import { founder, site } from "./site";
import { services, type ServiceSlug } from "./services";
import { skedez } from "./work";
import { absoluteUrl, ogImage } from "./seo";
import { localeInfo, locales, type Locale } from "@/i18n/locales";

// Stable @ids: one organisation, site and founder, whichever language a page is in.
export const ids = {
  org: `${site.url}/#organization`,
  site: `${site.url}/#website`,
  founder: `${site.url}/studio#pablo-italo`,
};

const allLanguages = locales.map((l) => localeInfo[l].hreflang);

const founderNode = (copy: Messages) => ({
  "@type": "Person",
  "@id": ids.founder,
  name: founder.name,
  jobTitle: copy.founder.jobTitle,
  url: "https://pabloitalo.com",
  image: `${site.url}/images/pablo-italo.webp`,
  sameAs: founder.links.map((l) => l.href),
  worksFor: { "@id": ids.org },
});

/** Site-wide graph, rendered once in the locale layout. */
export const siteGraph = (locale: Locale, copy: Messages) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ids.org,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/icons/icon-512.png`, width: 512, height: 512 },
      image: `${site.url}/opengraph-image.jpg`,
      email: site.email,
      description: copy.meta.description,
      founder: { "@id": ids.founder },
      contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.email, url: absoluteUrl(locale, "/contact"), availableLanguage: allLanguages },
      knowsAbout: copy.schema.knowsAbout,
      knowsLanguage: allLanguages,
      makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: copy.services[s.slug].title, url: absoluteUrl(locale, `/services/${s.slug}`) } })),
      owns: { "@type": "Product", name: skedez.name, url: skedez.url, category: copy.schema.skedezCategory },
    },
    {
      "@type": "WebSite",
      "@id": ids.site,
      url: site.url,
      name: site.name,
      description: copy.meta.description,
      inLanguage: allLanguages,
      publisher: { "@id": ids.org },
    },
    founderNode(copy),
  ],
});

const page = (type: string, locale: Locale, name: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": type,
  name,
  url: absoluteUrl(locale, path),
  inLanguage: localeInfo[locale].hreflang,
  isPartOf: { "@id": ids.site },
});

export const servicesList = (locale: Locale, copy: Messages) => ({
  ...page("CollectionPage", locale, copy.pages.services.title, "/services"),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: copy.services[s.slug].title, url: absoluteUrl(locale, `/services/${s.slug}`) })),
  },
});

export const serviceGraph = (slug: ServiceSlug, locale: Locale, copy: Messages, whatYouGet: string) => {
  const s = copy.services[slug];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: s.title,
        serviceType: s.metaTitle,
        description: s.description,
        url: absoluteUrl(locale, `/services/${slug}`),
        inLanguage: localeInfo[locale].hreflang,
        image: `${site.url}${ogImage(locale, slug)}`,
        provider: { "@id": ids.org },
        areaServed: copy.schema.areaServed,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: whatYouGet,
          itemListElement: s.deliverables.map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d.title, description: d.body } })),
        },
      },
      {
        "@type": "FAQPage",
        inLanguage: localeInfo[locale].hreflang,
        mainEntity: s.questions.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
      },
    ],
  };
};

export const aboutPage = (locale: Locale, copy: Messages) => ({
  ...page("AboutPage", locale, copy.pages.studio.title, "/studio"),
  about: { "@id": ids.org },
  mainEntity: founderNode(copy),
});

export const contactPage = (locale: Locale, copy: Messages) => ({
  ...page("ContactPage", locale, copy.pages.contact.title, "/contact"),
  about: { "@id": ids.org },
});

export const workPage = (locale: Locale, copy: Messages) => ({
  ...page("CollectionPage", locale, copy.pages.work.title, "/work"),
  mainEntity: { "@type": "ItemList", itemListElement: [{ "@type": "ListItem", position: 1, name: copy.pages.skedez.title, url: absoluteUrl(locale, "/work/skedez") }] },
});
