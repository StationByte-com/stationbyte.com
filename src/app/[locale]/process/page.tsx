import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import PageHero from "@/components/site/PageHero";
import NextStep from "@/components/site/NextStep";
import Cta from "@/components/motion/Cta";
import Eyebrow from "@/components/motion/Eyebrow";
import LoopVideo from "@/components/motion/LoopVideo";
import Process from "@/components/home/Process";
import TileGlyph, { glyphs } from "@/components/brand/TileGlyph";
import { StageArtifact, StageGrid, WeekStrip } from "@/components/visuals/ProcessVisuals";
import { getTranslations } from "next-intl/server";
import { loadLocale } from "@/i18n/copy";
import ClientMessages from "@/i18n/ClientMessages";

export async function generateMetadata({ params }: PageProps<"/[locale]/process">): Promise<Metadata> {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.process;
  return pageMetadata({ locale, title: p.title, description: p.description, path: "/process", og: "process", ogAlt: p.ogAlt });
}

const heading = (lines: readonly string[], tone = "") => (
  <h2 className={`display text-[clamp(34px,4vw,56px)] ${tone}`}>
    <span className="line-mask"><span>{lines[0]}</span></span>{" "}
    {lines[1] && (
      <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>{lines[1]}</span></span>
    )}
  </h2>
);

export default async function ProcessPage({ params }: PageProps<"/[locale]/process">) {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.process;
  const t = await getTranslations({ locale, namespace: "pages.process" });
  const { stages: process, rhythm, engagements, agreements } = copy.process;
  return (
    <ClientMessages locale={locale} copy={copy} stages visuals={["stages", "week"]}>
    <main id="main">
      <PageHero current={copy.nav.process} eyebrow={p.eyebrow} title={p.heading} lede={p.lede} visual={<StageGrid />}>
        <Cta href="/contact">{copy.common.startProject}</Cta>
        <Cta href="#ways" variant="link" arrow="">
          {p.waysLink}
        </Cta>
      </PageHero>

      {/* The four stages at a glance: the same scroll-filled line as the homepage. */}
      <Process intro={false} />

      {/* Each stage in depth */}
      <section className="border-t border-line">
        <div className="shell flex flex-col py-12 md:py-16">
          {process.map((step, i) => (
            <article key={step.title} className="grid gap-8 border-b border-line py-14 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:py-20">
              <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
                <span data-reveal className="font-mono text-[13px] text-signal-deep">{t("stage", { n: `0${i + 1}` })}</span>
                <h2 className="display text-[clamp(44px,5.5vw,80px)]">
                  <span className="line-mask"><span>{step.title}</span></span>
                </h2>
                <p data-reveal className="max-w-[360px] text-steel">{step.body}</p>
                <div data-reveal className="mt-4 max-w-[400px]">
                  <StageArtifact index={i} />
                </div>
              </div>
              <div className="grid gap-10 sm:grid-cols-2">
                <div data-reveal className="flex flex-col gap-3 sm:col-span-2">
                  <p className="eyebrow text-steel">{p.happens}</p>
                  <p className="text-[clamp(18px,1.5vw,20px)] leading-normal">{step.happens}</p>
                </div>
                <div data-reveal className="flex flex-col gap-4">
                  <p className="eyebrow text-steel">{p.youGet}</p>
                  <ul className="flex flex-col gap-3">
                    {step.get.map((g) => (
                      <li key={g} className="flex items-baseline gap-3">
                        <span aria-hidden="true" className="size-2.5 shrink-0 translate-y-[-1px] rounded-[3px] bg-signal" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-reveal style={{ "--reveal-delay": "80ms" } as React.CSSProperties} className="flex flex-col gap-4">
                  <p className="eyebrow text-steel">{p.weNeed}</p>
                  <p className="text-steel">{step.need}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Weekly rhythm */}
      <section className="bg-ink text-paper">
        <div className="shell flex flex-col gap-14 py-28 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="flex flex-col gap-5">
              <div data-reveal><Eyebrow className="text-fog">{p.weekEyebrow}</Eyebrow></div>
              {heading(p.weekTitle)}
            </div>
            <p data-reveal className="max-w-[420px] text-fog">
              {p.weekNote}
            </p>
          </div>
          <div data-reveal>
            <WeekStrip />
          </div>
          <ol className="grid gap-px overflow-hidden rounded-[22px] border border-edge bg-edge md:grid-cols-3">
            {rhythm.map((r, i) => (
              <li key={r.when} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties} className="flex flex-col gap-4 bg-graphite p-8">
                <span className={`eyebrow ${i === 2 ? "text-signal-ink" : "text-fog"}`}>{r.when}</span>
                <p className="text-[20px] leading-snug tracking-[-0.01em]">{r.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Every stage adds to the byte. */}
      <section className="shell pt-28 md:pt-32">
        <figure className="relative">
          <LoopVideo
            name="process"
            alt={p.figAlt}
            sizes="(min-width: 1440px) 1312px, 92vw"
            className="aspect-[4/3] rounded-[clamp(20px,2vw,28px)] bg-line sm:aspect-[16/7]"
          />
          <figcaption className="eyebrow absolute bottom-5 left-5 rounded-full bg-paper/90 px-3 py-1.5 text-ink backdrop-blur">
            {p.figCaption}
          </figcaption>
        </figure>
      </section>

      {/* Ways to work */}
      <section id="ways" className="scroll-mt-[72px]">
        <div className="shell flex flex-col gap-12 py-28 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="flex flex-col gap-5">
              <div data-reveal><Eyebrow className="text-steel">{p.waysEyebrow}</Eyebrow></div>
              {heading(p.waysTitle)}
            </div>
            <p data-reveal className="max-w-[420px] text-steel">
              {p.waysNote}
            </p>
          </div>
          <ul className="grid gap-4 lg:grid-cols-3">
            {engagements.map((e, i) => (
              <li
                key={e.name}
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                className="group flex flex-col gap-8 rounded-[22px] border border-line bg-white p-8 transition-[border-color,translate] duration-500 ease-station hover:-translate-y-1 hover:border-ink"
              >
                {/* The grid fills up as the commitment grows: a third, two thirds, the full byte. */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] text-steel">0{i + 1}</span>
                  <span aria-hidden="true" className="grid grid-cols-3 gap-[3px]">
                    {Array.from({ length: 9 }, (_, tile) => (
                      <span
                        key={tile}
                        className={`size-[7px] rounded-[2px] transition-colors duration-500 ${
                          tile === 8 ? "bg-transparent" : tile < [3, 6, 8][i] ? "bg-ink group-hover:bg-signal" : "bg-line"
                        }`}
                      />
                    ))}
                  </span>
                </div>
                <h3 className="text-[30px] font-semibold leading-none tracking-[-0.04em]">{e.name}</h3>
                <div className="flex flex-col gap-3">
                  <p className="eyebrow text-steel">{p.fits}</p>
                  <p>{e.fit}</p>
                </div>
                <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6">
                  <p className="eyebrow text-steel">{p.how}</p>
                  <p className="text-[15px] text-steel">{e.shape}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Working agreements */}
      <section className="border-t border-line bg-white">
        <div className="shell flex flex-wrap gap-12 py-24 md:py-28">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
            <div data-reveal><Eyebrow className="text-steel">{p.agreementsEyebrow}</Eyebrow></div>
            {heading(p.agreementsTitle)}
          </div>
          <ul className="grid min-w-0 flex-[999_1_620px] gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-3">
            {agreements.map((a, i) => (
              <li key={a.title} data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties} className="group flex flex-col gap-3 bg-paper p-7">
                <TileGlyph {...glyphs[(i + 3) % glyphs.length]} className="mb-2 size-10" />
                <h3 className="text-xl font-semibold tracking-[-0.03em]">{a.title}</h3>
                <p className="text-[15px] text-steel">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <NextStep title={p.nextStep} />
    </main>
    </ClientMessages>
  );
}
