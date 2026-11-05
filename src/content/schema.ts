import { founder, site } from "./site";
import { services, type Service } from "./services";

// Stable @ids so every page's structured data points at the same organisation, site and founder.
export const ids = {
  org: `${site.url}/#organization`,
  site: `${site.url}/#website`,
  founder: `${site.url}/studio#pablo-italo`,
};

const founderNode = {
  "@type": "Person",
  "@id": ids.founder,
  name: founder.name,
  jobTitle: "Founder, AI and full-stack engineer",
  url: "https://pabloitalo.com",
  image: `${site.url}/images/pablo-italo.webp`,
  sameAs: founder.links.map((l) => l.href),
  worksFor: { "@id": ids.org },
};

/** Site-wide graph, rendered once in the root layout. */
export const siteGraph = {
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
      description: site.description,
      founder: { "@id": ids.founder },
      contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.email, url: `${site.url}/contact`, availableLanguage: ["English"] },
      knowsAbout: ["AI product engineering", "Large language models", "SaaS development", "Web development", "Mobile app development", "Product design"],
      makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: `${site.url}/services/${s.slug}` } })),
      owns: { "@type": "Product", name: "SkedEz", url: "https://skedez.com", category: "Online booking software" },
    },
    {
      "@type": "WebSite",
      "@id": ids.site,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-GB",
      publisher: { "@id": ids.org },
    },
    founderNode,
  ],
};

export const servicesList = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Services",
  url: `${site.url}/services`,
  isPartOf: { "@id": ids.site },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${site.url}/services/${s.slug}` })),
  },
};

export const serviceGraph = (s: Service) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: s.title,
      serviceType: s.metaTitle,
      description: s.description,
      url: `${site.url}/services/${s.slug}`,
      image: `${site.url}/og/${s.slug}.jpg`,
      provider: { "@id": ids.org },
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${s.title}: what you get`,
        itemListElement: s.deliverables.map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: d.title, description: d.body } })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: s.questions.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
    },
  ],
});

export const aboutPage = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Studio",
  url: `${site.url}/studio`,
  isPartOf: { "@id": ids.site },
  about: { "@id": ids.org },
  mainEntity: founderNode,
};

export const contactPage = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Start a project",
  url: `${site.url}/contact`,
  isPartOf: { "@id": ids.site },
  about: { "@id": ids.org },
};

export const workPage = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Work",
  url: `${site.url}/work`,
  isPartOf: { "@id": ids.site },
  mainEntity: { "@type": "ItemList", itemListElement: [{ "@type": "ListItem", position: 1, name: "SkedEz case study", url: `${site.url}/work/skedez` }] },
};
