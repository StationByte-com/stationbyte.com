import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/site/PageHero";
import NextStep from "@/components/site/NextStep";
import Cta from "@/components/motion/Cta";
import JsonLd from "@/components/site/JsonLd";
import { servicesList } from "@/content/schema";
import TileGlyph, { glyphs } from "@/components/brand/TileGlyph";
import LoopVideo from "@/components/motion/LoopVideo";
import { services } from "@/content/site";
import { tagLabel } from "@/content/services";
import { loadLocale } from "@/i18n/copy";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.services;
  return pageMetadata({ locale, title: p.title, description: p.description, path: "/services", og: "services", ogAlt: p.ogAlt });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.services;
  const agreements = copy.process.agreements;
  return (
    <main id="main">
      <JsonLd data={servicesList(locale, copy)} />
      <PageHero
        current={copy.nav.services}
        eyebrow={p.eyebrow}
        title={p.heading}
        lede={p.lede}
        visual={
          <ul className="grid grid-cols-2 gap-3">
            {services.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-ink"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <LoopVideo
                    name={s.loop}
                    alt=""
                    sizes="(min-width: 1024px) 20vw, 46vw"
                    priority={i < 2}
                    className="absolute inset-0 transition-transform duration-[1.2s] ease-station group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[linear-gradient(0deg,rgb(10_10_11/0.85),transparent)] p-4 pt-12 text-paper">
                    <span className="text-[15px] font-medium leading-tight">{copy.services[s.slug].title}</span>
                    <span aria-hidden="true" className="transition-transform duration-500 ease-station group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        }
      >
        <Cta href="/contact">{copy.common.startProject}</Cta>
        <Cta href="/process" variant="link" arrow="">
          {copy.common.howWeWork}
        </Cta>
      </PageHero>

      <section className="shell pb-28 md:pb-32">
        <ul className="border-t border-ink">
          {services.map((s, i) => (
            <li key={s.slug} data-reveal className="border-b border-line">
              <Link
                href={`/services/${s.slug}`}
                className="group grid gap-6 py-10 md:grid-cols-[80px_minmax(0,1.1fr)_minmax(0,1fr)_220px] md:gap-10 md:py-14"
              >
                <span className="font-mono text-[13px] text-steel transition-colors group-hover:text-signal-deep">0{i + 1}</span>
                <div className="flex min-w-0 flex-col gap-4">
                  <h2 className="text-[clamp(30px,3.4vw,48px)] font-semibold leading-[1.02] tracking-[-0.04em] transition-colors group-hover:text-signal-deep">
                    {copy.services[s.slug].title}
                  </h2>
                  <p className="max-w-[520px] text-steel">{copy.services[s.slug].body}</p>
                </div>
                <div className="flex min-w-0 flex-col gap-5">
                  <ul className="flex flex-col gap-2.5">
                    {copy.services[s.slug].deliverables.slice(0, 4).map((d) => (
                      <li key={d.title} className="flex items-baseline gap-3">
                        <span aria-hidden="true" className="size-2 shrink-0 translate-y-[-2px] rounded-[2px] bg-ink" />
                        {d.title}
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-wrap gap-2">
                    {s.tags.map((t) => tagLabel(t, copy)).map((t) => (
                      <li key={t} className="eyebrow rounded-md border border-line px-2.5 py-1.5 text-ink">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="relative order-first block aspect-[16/10] overflow-hidden rounded-2xl bg-ink md:order-none md:aspect-[4/3]">
                  <LoopVideo
                    name={s.loop}
                    alt=""
                    play="hover"
                    sizes="(min-width: 768px) 220px, 92vw"
                    className="absolute inset-0 transition-transform duration-[1.2s] ease-station group-hover:scale-[1.08]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-paper text-ink transition-[background-color,color,translate] duration-500 ease-station group-hover:translate-x-0.5 group-hover:bg-signal group-hover:text-white"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-white">
        <div className="shell flex flex-wrap gap-12 py-24 md:py-28">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
            <p data-reveal className="eyebrow text-steel">{p.agreementsEyebrow}</p>
            <h2 className="display text-[clamp(34px,4vw,56px)]">
              <span className="line-mask"><span>{p.agreementsTitle}</span></span>
            </h2>
            <div data-reveal>
              <Cta href="/process" variant="link" arrow="→">
                {p.fullProcess}
              </Cta>
            </div>
          </div>
          <ul data-reveal className="grid min-w-0 flex-[999_1_620px] gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-3">
            {agreements.map((a, i) => (
              <li key={a.title} className="group flex flex-col gap-3 bg-paper p-7">
                <TileGlyph {...glyphs[(i + 3) % glyphs.length]} className="mb-2 size-10" />
                <h3 className="text-xl font-semibold tracking-[-0.03em]">{a.title}</h3>
                <p className="text-[15px] text-steel">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NextStep />
    </main>
  );
}
