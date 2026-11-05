import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/site/PageHero";
import NextStep from "@/components/site/NextStep";
import LiveImage from "@/components/motion/LiveImage";
import Marquee from "@/components/motion/Marquee";
import LoopVideo from "@/components/motion/LoopVideo";
import Cta from "@/components/motion/Cta";
import Eyebrow from "@/components/motion/Eyebrow";
import TileGlyph, { glyphs } from "@/components/brand/TileGlyph";
import CountUp from "@/components/visuals/CountUp";
import JsonLd from "@/components/site/JsonLd";
import { aboutPage } from "@/content/schema";
import { founder, services, site, stack } from "@/content/site";
import { getTranslations } from "next-intl/server";
import { loadLocale } from "@/i18n/copy";
import { localeInfo, locales } from "@/i18n/locales";

export async function generateMetadata({ params }: PageProps<"/[locale]/studio">): Promise<Metadata> {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.studio;
  return pageMetadata({ locale, title: p.title, description: p.description, path: "/studio", og: "studio", ogAlt: p.ogAlt });
}

const productLink = (chunks: React.ReactNode) => (
  <Link href="/work/skedez" className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal">
    {chunks}
  </Link>
);

const heading = (lines: readonly string[], tone = "") => (
  <h2 className={`display text-[clamp(34px,4vw,56px)] ${tone}`}>
    <span className="line-mask"><span>{lines[0]}</span></span>{" "}
    {lines[1] && (
      <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>{lines[1]}</span></span>
    )}
  </h2>
);

export default async function StudioPage({ params }: PageProps<"/[locale]/studio">) {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.studio;
  const t = await getTranslations({ locale, namespace: "pages.studio" });
  const { principles, principleNotes } = copy.studio;
  return (
    <main id="main">
      <JsonLd data={aboutPage(locale, copy)} />
      <PageHero
        current={copy.nav.studio}
        eyebrow={p.eyebrow}
        title={p.heading}
        lede={t.rich("lede", { link: productLink })}
        visual={
          <div className="relative">
            {/* Path-traced loop: window light drifting across the ceramic stacks. */}
            <LoopVideo
              name="studio"
              alt={p.videoAlt}
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="aspect-[4/3] rounded-[clamp(20px,2vw,28px)] bg-line lg:aspect-[4/5]"
              priority
            />
            <span className="eyebrow absolute bottom-5 left-5 rounded-full bg-paper/90 px-3 py-1.5 text-ink backdrop-blur">{p.figCaption}</span>
          </div>
        }
      />

      {/* How we work */}
      <section className="border-t border-line">
        <div className="shell flex flex-wrap gap-12 py-28 md:py-32">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
            <div data-reveal><Eyebrow className="text-steel">{p.howEyebrow}</Eyebrow></div>
            {heading(p.howTitle)}
            <div data-reveal>
              <Cta href="/process" variant="link" arrow="→">
                {p.fullProcess}
              </Cta>
            </div>
          </div>
          <ol className="min-w-0 flex-[999_1_620px] border-t border-ink">
            {principles.map((principle, i) => (
              <li key={principle} data-reveal className="group grid gap-4 border-b border-line py-8 md:grid-cols-[72px_1fr]">
                <TileGlyph {...glyphs[i * 2]} className="size-11" />
                <div className="flex flex-col gap-2">
                  <h3 className="text-[clamp(22px,2.2vw,30px)] font-semibold leading-tight tracking-[-0.035em]">{principle}</h3>
                  <p className="text-steel">{principleNotes[i]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-ink text-paper">
        <div className="shell flex flex-wrap gap-14 py-28 md:py-32">
          <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-8">
            <div data-reveal><Eyebrow className="text-fog">{p.founderEyebrow}</Eyebrow></div>
            <div data-reveal className="flex items-center gap-5">
              <span className="relative size-24 shrink-0 overflow-hidden rounded-[24px] bg-graphite ring-1 ring-edge">
                <Image src="/images/pablo-italo.webp" alt={p.portraitAlt} fill sizes="96px" className="object-cover object-top" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[30px] font-semibold leading-none tracking-[-0.04em]">{founder.name}</p>
                <p className="text-fog">{copy.founder.role}</p>
              </div>
            </div>
            <p data-reveal className="max-w-[520px] text-[clamp(18px,1.5vw,20px)] leading-normal">{copy.founder.bio}</p>
            <ul data-reveal className="flex flex-wrap gap-x-6 gap-y-3">
              {founder.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener" className="border-b border-edge py-1 transition-colors hover:border-signal-ink hover:text-signal-ink">
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
            <p data-reveal className="eyebrow text-fog">{p.trackRecord}</p>
            <dl data-reveal className="grid grid-cols-3 gap-4 border-t border-edge pt-6">
              {founder.stats.map((s, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <dt className="order-2 text-[13px] leading-snug text-fog">{copy.founder.stats[i]}</dt>
                  <dd className="order-1 text-[clamp(32px,3.6vw,52px)] font-semibold leading-none tracking-[-0.045em]">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="border-t border-edge">
              {founder.projects.map((name, i) => (
                <li key={name} data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties} className="grid gap-1 border-b border-edge py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <span className="font-medium">{name}</span>
                  <span className="text-fog">{copy.founder.projects[i]}</span>
                </li>
              ))}
            </ul>
            <p data-reveal className="text-[13px] text-fog/80">{p.projectsNote}</p>
          </div>
        </div>
      </section>

      {/* Company facts */}
      <section className="shell flex flex-wrap gap-12 py-28 md:py-32">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
          <div data-reveal><Eyebrow className="text-steel">{p.companyEyebrow}</Eyebrow></div>
          {heading(p.companyTitle)}
          <LiveImage
            src="/images/studio-bench.webp"
            alt={p.benchAlt}
            sizes="(min-width: 1024px) 30vw, 92vw"
            className="mt-6 aspect-[3/2] rounded-[22px] bg-line"
            drift={3}
          />
        </div>
        <dl data-reveal className="min-w-0 flex-[999_1_620px] border-t border-ink">
          <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
            <dt className="eyebrow pt-1 text-steel">{p.legalName}</dt>
            <dd>{site.legalName}</dd>
          </div>
          <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
            <dt className="eyebrow pt-1 text-steel">{p.whatWeDo}</dt>
            <dd className="flex flex-wrap gap-x-2">
              {services.map((s, i) => (
                <span key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="underline decoration-line underline-offset-4 transition-colors hover:decoration-signal">
                    {copy.services[s.slug].title}
                  </Link>
                  {i < services.length - 1 ? "," : ""}
                </span>
              ))}
            </dd>
          </div>
          <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
            <dt className="eyebrow pt-1 text-steel">{p.ourProduct}</dt>
            <dd>
              {t.rich("ourProductValue", {
                link: (chunks) => (
                  <Link href="/work/skedez" className="underline decoration-line underline-offset-4 transition-colors hover:decoration-signal">
                    {chunks}
                  </Link>
                ),
              })}
            </dd>
          </div>
          <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
            <dt className="eyebrow pt-1 text-steel">{p.languages}</dt>
            <dd>{locales.map((l) => localeInfo[l].name).join(" · ")}</dd>
          </div>
          <div className="grid gap-1 border-b border-line py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
            <dt className="eyebrow pt-1 text-steel">{p.contact}</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="underline decoration-line underline-offset-4 transition-colors hover:decoration-signal">
                {site.email}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <div className="pb-28 md:pb-32">
        <Marquee items={stack} label={copy.common.toolsLabel} />
      </div>

      <NextStep />
    </main>
  );
}
