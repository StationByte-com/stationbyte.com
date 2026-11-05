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
import { agreements, engagements, process, rhythm } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Process",
  description:
    "How StationByte works: discover, design, build and operate, with weekly releases, three ways to engage, and code and accounts that are yours from day one.",
  path: "/process",
  og: "process",
  ogAlt: "Stacks of ceramic tiles growing into a full grid, beside the words From idea to running",
});

const heading = (lines: [string, string?], tone = "") => (
  <h2 className={`display text-[clamp(34px,4vw,56px)] ${tone}`}>
    <span className="line-mask"><span>{lines[0]}</span></span>
    {lines[1] && (
      <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>{lines[1]}</span></span>
    )}
  </h2>
);

export default function ProcessPage() {
  return (
    <main id="main">
      <PageHero
        current="Process"
        eyebrow="How we work"
        title={["From idea", "to running."]}
        lede="You get a working link early, not a status report. Every stage ends with something you can use, and you can stop after any of them with everything we've made."
        visual={<StageGrid />}
      >
        <Cta href="/contact">Start a project</Cta>
        <Cta href="#ways" variant="link" arrow="">
          Ways to work with us
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
                <span data-reveal className="font-mono text-[13px] text-signal-deep">Stage 0{i + 1}</span>
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
                  <p className="eyebrow text-steel">What happens</p>
                  <p className="text-[clamp(18px,1.5vw,20px)] leading-normal">{step.happens}</p>
                </div>
                <div data-reveal className="flex flex-col gap-4">
                  <p className="eyebrow text-steel">You get</p>
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
                  <p className="eyebrow text-steel">We need from you</p>
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
              <div data-reveal><Eyebrow className="text-fog">Every week</Eyebrow></div>
              {heading(["A rhythm you", "can plan around."])}
            </div>
            <p data-reveal className="max-w-[420px] text-fog">
              The same three moments every week, so you always know what&apos;s happening without asking.
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
            alt="Four stacks of off-white ceramic tiles growing from one tile to a full grid with a blue tile in the centre"
            sizes="(min-width: 1440px) 1312px, 92vw"
            className="aspect-[4/3] rounded-[clamp(20px,2vw,28px)] bg-line sm:aspect-[16/7]"
          />
          <figcaption className="eyebrow absolute bottom-5 left-5 rounded-full bg-paper/90 px-3 py-1.5 text-ink backdrop-blur">
            Fig. 03 · Every stage adds to the byte
          </figcaption>
        </figure>
      </section>

      {/* Ways to work */}
      <section id="ways" className="scroll-mt-[72px]">
        <div className="shell flex flex-col gap-12 py-28 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="flex flex-col gap-5">
              <div data-reveal><Eyebrow className="text-steel">Ways to work with us</Eyebrow></div>
              {heading(["Three shapes,", "one team."])}
            </div>
            <p data-reveal className="max-w-[420px] text-steel">
              A discovery sprint is the usual first step. Every proposal is written, with scope, timeline and price agreed before work starts.
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
                    {Array.from({ length: 9 }, (_, t) => (
                      <span
                        key={t}
                        className={`size-[7px] rounded-[2px] transition-colors duration-500 ${
                          t === 8 ? "bg-transparent" : t < [3, 6, 8][i] ? "bg-ink group-hover:bg-signal" : "bg-line"
                        }`}
                      />
                    ))}
                  </span>
                </div>
                <h3 className="text-[30px] font-semibold leading-none tracking-[-0.04em]">{e.name}</h3>
                <div className="flex flex-col gap-3">
                  <p className="eyebrow text-steel">Fits when</p>
                  <p>{e.fit}</p>
                </div>
                <div className="mt-auto flex flex-col gap-3 border-t border-line pt-6">
                  <p className="eyebrow text-steel">How it works</p>
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
            <div data-reveal><Eyebrow className="text-steel">Working agreements</Eyebrow></div>
            {heading(["Yours from", "day one."])}
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

      <NextStep title={["Start with a", "discovery sprint."]} />
    </main>
  );
}
