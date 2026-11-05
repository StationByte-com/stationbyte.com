import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import PageHero from "@/components/site/PageHero";
import NextStep from "@/components/site/NextStep";
import JsonLd from "@/components/site/JsonLd";
import { serviceGraph } from "@/content/schema";
import Cta from "@/components/motion/Cta";
import Eyebrow from "@/components/motion/Eyebrow";
import LoopVideo from "@/components/motion/LoopVideo";
import TileGlyph, { glyphs } from "@/components/brand/TileGlyph";
import ServiceDiagram from "@/components/visuals/ServiceDiagram";
import { getTranslations } from "next-intl/server";
import { getService, services, tagLabel } from "@/content/services";
import { loadLocale } from "@/i18n/copy";
import ClientMessages from "@/i18n/ClientMessages";

// The messages each service's diagram reads (the design diagram reuses the sample salon from the booking flow).
const DIAGRAM_COPY = {
  "ai-product-engineering": ["ai"],
  "saas-platforms": ["saas"],
  "web-and-mobile-apps": ["apps"],
  "product-design": ["design", "booking"],
} as const satisfies Record<string, readonly ("ai" | "saas" | "apps" | "design" | "booking")[]>;

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, copy } = await loadLocale(params);
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const s = copy.services[service.slug];
  const t = await getTranslations({ locale, namespace: "pages.service" });
  return pageMetadata({
    locale,
    title: s.metaTitle,
    description: s.description,
    path: `/services/${service.slug}`,
    og: service.slug,
    ogAlt: t("ogAlt", { alt: s.imageAlt, headline: s.headline.join(" ") }),
  });
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const { locale, copy } = await loadLocale(params);
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const s = copy.services[service.slug];
  const p = copy.pages.service;
  const t = await getTranslations({ locale });
  const index = services.indexOf(service);
  const others = services.filter((o) => o.slug !== service.slug);

  return (
    <ClientMessages locale={locale} copy={copy} visuals={[...DIAGRAM_COPY[service.slug]]}>
    <main id="main">
      <JsonLd data={serviceGraph(service.slug, locale, copy, t("schema.whatYouGet", { title: s.title }))} />
      <PageHero
        trail={[{ href: "/services", label: copy.nav.services }]}
        current={s.title}
        eyebrow={t("pages.service.eyebrow", { n: `0${index + 1}`, title: s.title })}
        title={s.headline}
        lede={s.problem}
        visual={
          <LoopVideo
            name={service.loop}
            alt={s.imageAlt}
            sizes="(min-width: 1024px) 40vw, 92vw"
            className="aspect-[4/3] rounded-[clamp(20px,2vw,28px)] bg-ink lg:aspect-square"
            priority
          />
        }
      >
        <Cta href="/contact">{copy.common.startProject}</Cta>
        <Cta href="/process" variant="link" arrow="">
          {copy.common.howWeWork}
        </Cta>
      </PageHero>

      {/* What you get */}
      <section className="shell flex flex-col gap-12 pb-28 md:pb-32">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-ink pt-10">
          <h2 className="display text-[clamp(34px,4vw,56px)]">
            <span className="line-mask"><span>{p.whatYouGet}</span></span>
          </h2>
          <ul data-reveal className="flex flex-wrap gap-2">
            {service.tags.map((tag) => tagLabel(tag, copy)).map((tag) => (
              <li key={tag} className="eyebrow rounded-md border border-line px-2.5 py-1.5 text-ink">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {s.deliverables.map((d, i) => (
            <li key={d.title} data-reveal style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties} className="group flex flex-col gap-4 bg-paper p-8 transition-colors duration-500 hover:bg-white">
              <div className="flex items-start justify-between gap-4">
                <TileGlyph {...glyphs[i % glyphs.length]} className="size-11" />
                <span className="font-mono text-[13px] text-steel transition-colors group-hover:text-signal-deep">0{i + 1}</span>
              </div>
              <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.03em]">{d.title}</h3>
              <p className="text-[15px] text-steel">{d.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How we approach it */}
      <section className="bg-ink text-paper">
        <div className="shell flex flex-col gap-14 py-28 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
            <div className="flex flex-col gap-5">
              <div data-reveal><Eyebrow className="text-fog">{p.howItWorks}</Eyebrow></div>
              <h2 className="display text-[clamp(34px,4vw,56px)]">
                <span className="line-mask"><span>{s.diagram[0]}</span></span>{" "}
                <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>{s.diagram[1]}</span></span>
              </h2>
            </div>
            <div data-reveal className="min-w-0">
              <ServiceDiagram slug={service.slug} />
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-edge pt-14">
            <div data-reveal><Eyebrow className="text-fog">{p.approachEyebrow}</Eyebrow></div>
            <h2 className="display text-[clamp(34px,4vw,56px)]">
              <span className="line-mask"><span>{p.approachTitle}</span></span>
            </h2>
          </div>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {s.approach.map((a, i) => (
              <li key={a.title} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties} className="flex flex-col gap-3 border-t border-edge pt-6">
                <span className={`font-mono text-[13px] ${i === 0 ? "text-signal-ink" : "text-fog"}`}>0{i + 1}</span>
                <h3 className="text-[24px] font-semibold tracking-[-0.03em]">{a.title}</h3>
                <p className="text-base text-fog">{a.body}</p>
              </li>
            ))}
          </ol>

          <div data-reveal className="flex flex-wrap items-center justify-between gap-8 rounded-[22px] border border-edge bg-graphite p-8 md:p-10">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
              <p className="eyebrow text-signal-ink">{s.proof.label}</p>
              <p className="max-w-[640px] text-[clamp(18px,1.6vw,22px)] leading-normal">{s.proof.body}</p>
            </div>
            <Cta href={service.proofHref} variant="light">{s.proof.cta}</Cta>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="shell flex flex-wrap gap-12 py-28 md:py-32">
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
          <div data-reveal><Eyebrow className="text-steel">{p.questionsEyebrow}</Eyebrow></div>
          <h2 className="display text-[clamp(34px,4vw,56px)]">
            <span className="line-mask"><span>{p.questionsTitle}</span></span>
          </h2>
        </div>
        <div data-reveal className="flex min-w-0 flex-[999_1_620px] flex-col border-t border-ink">
          {s.questions.map((q) => (
            <details key={q.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-7 text-[clamp(20px,2vw,26px)] font-semibold tracking-[-0.03em] transition-colors hover:text-signal-deep [&::-webkit-details-marker]:hidden">
                {q.q}
                <span aria-hidden="true" className="relative size-4 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-500 ease-station group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[640px] pb-8 text-steel">{q.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Other services */}
      <section className="border-t border-line">
        <div className="shell flex flex-col gap-8 py-20">
          <p data-reveal className="eyebrow text-steel">{p.others}</p>
          <ul className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug} data-reveal>
                <Link
                  href={`/services/${o.slug}`}
                  className="group flex h-full flex-col justify-between gap-8 rounded-[22px] border border-line bg-white p-7 transition-[border-color,translate] duration-500 ease-station hover:-translate-y-1 hover:border-ink"
                >
                  <span className="text-[22px] font-semibold leading-tight tracking-[-0.03em]">{copy.services[o.slug].title}</span>
                  <span className="flex items-center justify-between text-[15px] text-steel">
                    {o.tags.slice(0, 3).map((tag) => tagLabel(tag, copy)).join(" · ")}
                    <span aria-hidden="true" className="text-ink transition-transform duration-500 ease-station group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NextStep />
    </main>
    </ClientMessages>
  );
}
