import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import PageHero from "@/components/site/PageHero";
import NextStep from "@/components/site/NextStep";
import JsonLd from "@/components/site/JsonLd";
import { ids } from "@/content/schema";
import Cta from "@/components/motion/Cta";
import Eyebrow from "@/components/motion/Eyebrow";
import TileGlyph, { glyphs } from "@/components/brand/TileGlyph";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";
import BookingFlow from "@/components/visuals/BookingFlow";
import Architecture from "@/components/visuals/Architecture";
import { skedez } from "@/content/work";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "SkedEz case study",
  description: skedez.description,
  path: "/work/skedez",
  og: "skedez",
  ogAlt: "The SkedEz homepage beside the words Booking that runs itself",
  type: "article",
});

const heading = (lines: [string, string?]) => (
  <h2 className="display text-[clamp(34px,4vw,56px)]">
    <span className="line-mask"><span>{lines[0]}</span></span>
    {lines[1] && (
      <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>{lines[1]}</span></span>
    )}
  </h2>
);

export default function SkedezCaseStudy() {
  return (
    <main id="main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "SkedEz: booking that runs itself",
          description: skedez.description,
          url: `${site.url}/work/skedez`,
          image: `${site.url}/images/skedez-desktop.webp`,
          datePublished: "2026-11-05",
          dateModified: "2026-11-05",
          author: { "@id": ids.org },
          publisher: { "@id": ids.org },
          isPartOf: { "@id": ids.site },
          about: { "@type": "SoftwareApplication", name: "SkedEz", url: skedez.url, applicationCategory: "BusinessApplication" },
        }}
      />
      <PageHero
        trail={[{ href: "/work", label: "Work" }]}
        current="SkedEz"
        eyebrow="Case study · In-house product"
        title={["SkedEz: booking", "that runs itself."]}
        lede={skedez.summary}
      >
        <Cta href={skedez.url} arrow="↗" external>
          Visit skedez.com
        </Cta>
      </PageHero>

      <section className="shell flex flex-col gap-10 pb-28 md:pb-32">
        <dl data-reveal className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {skedez.facts.map((f) => (
            <div key={f.k} className="flex flex-col gap-2 bg-paper p-6">
              <dt className="eyebrow text-steel">{f.k}</dt>
              <dd className="text-[17px] font-medium leading-snug">{f.v}</dd>
            </div>
          ))}
        </dl>
        <div>
          <BrowserFrame
            src="/images/skedez-desktop.webp"
            alt="SkedEz homepage: Clients book you 24/7. You just show up."
            url="skedez.com"
            sizes="(min-width: 1440px) 1312px, 92vw"
            priority
          />
        </div>
        <p data-reveal className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5 text-[15px] text-steel">
          <span aria-hidden="true" className="mt-1.5 size-2.5 shrink-0 rounded-[3px] bg-signal" />
          <span>
            <b className="font-medium text-ink">SkedEz is our own product, not client work.</b> We show it because it&apos;s
            the one product we can open up completely: the decisions and the live app.
          </span>
        </p>
      </section>

      {/* The problem */}
      <section className="border-t border-line">
        <div className="shell flex flex-wrap gap-12 py-28 md:py-32">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
            <div data-reveal><Eyebrow className="text-steel">The problem</Eyebrow></div>
            {heading(["Time lost to", "messages and no-shows."])}
          </div>
          <p data-reveal className="min-w-0 flex-[999_1_560px] self-end text-[clamp(18px,1.6vw,22px)] leading-normal text-steel">
            {skedez.problem}
          </p>
        </div>
      </section>

      {/* How a booking works */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="shell flex flex-col gap-14 py-28 md:py-32">
          <div className="flex flex-col gap-5">
            <div data-reveal><Eyebrow className="text-fog">From the client&apos;s side</Eyebrow></div>
            {heading(["A booking in", "four steps."])}
          </div>
          <BookingFlow />
        </div>
      </section>

      {/* What we built */}
      <section className="border-t border-edge bg-ink text-paper">
        <div className="shell flex flex-col gap-14 py-28 md:py-32">
          <div className="flex flex-col gap-5">
            <div data-reveal><Eyebrow className="text-fog">What we built</Eyebrow></div>
            {heading(["Everything a small", "business needs to be booked."])}
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[22px] border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-4">
            {skedez.built.map((b, i) => (
              <li key={b.title} data-reveal style={{ "--reveal-delay": `${(i % 4) * 60}ms` } as React.CSSProperties} className="group flex flex-col gap-3 bg-graphite p-7 transition-colors duration-500 hover:bg-[#1c1c1f]">
                <div className="flex items-start justify-between gap-4 pb-2">
                  <TileGlyph {...glyphs[i % glyphs.length]} tone="dark" className="size-10" />
                  <span className={`font-mono text-[13px] ${i === 1 ? "text-signal-ink" : "text-fog"}`}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight tracking-[-0.03em]">{b.title}</h3>
                <p className="text-[15px] text-fog">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How: phone + engineering notes */}
      <section className="shell flex flex-wrap items-center gap-16 py-28 md:py-32">
        <div data-reveal className="relative mx-auto w-full max-w-[340px] flex-[0_1_340px]">
          <PhoneFrame src="/images/skedez-mobile.webp" alt="SkedEz on a phone: Clients book you 24/7. You just show up." sizes="340px" />
        </div>
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-10">
          <div className="flex flex-col gap-5">
            <div data-reveal><Eyebrow className="text-steel">How it&apos;s built</Eyebrow></div>
            {heading(["Decisions that", "keep it running."])}
          </div>
          <ol className="flex flex-col border-t border-ink">
            {skedez.notes.map((n, i) => (
              <li key={n.title} data-reveal className="grid gap-3 border-b border-line py-7 md:grid-cols-[56px_1fr]">
                <span className="font-mono text-[13px] text-signal-deep">0{i + 1}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[22px] font-semibold tracking-[-0.03em]">{n.title}</h3>
                  <p className="text-steel">{n.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stack */}
      <section className="border-t border-line bg-white">
        <div className="shell flex flex-wrap gap-12 py-24 md:py-28">
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
            <div data-reveal><Eyebrow className="text-steel">Stack</Eyebrow></div>
            {heading(["What it runs on"])}
            <p data-reveal className="max-w-[340px] text-steel">
              How a booking moves from the client&apos;s screen to a reminder. The highlight follows one through.
            </p>
          </div>
          <div data-reveal className="min-w-0 flex-[999_1_720px]">
            <Architecture />
          </div>
        </div>
      </section>

      {/* Live today */}
      <section className="shell flex flex-col gap-12 py-28 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-5">
            <div data-reveal><Eyebrow className="text-steel">Live today</Eyebrow></div>
            {heading(["Three plans,", "no commission."])}
          </div>
          <p data-reveal className="max-w-[420px] text-steel">
            Prices as published on skedez.com. Paid plans start with a 15-day trial (card required); the free plan needs no card.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {skedez.pricing.map((p, i) => (
            <li
              key={p.plan}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className={`flex flex-col gap-6 rounded-[22px] border p-8 ${i === 1 ? "border-ink bg-ink text-paper" : "border-line bg-white"}`}
            >
              <span className={`eyebrow ${i === 1 ? "text-signal-ink" : "text-steel"}`}>{p.plan}</span>
              <span className="text-[44px] font-semibold leading-none tracking-[-0.04em]">{p.price}</span>
              <span className={`text-[15px] ${i === 1 ? "text-fog" : "text-steel"}`}>{p.note}</span>
            </li>
          ))}
        </ul>
        <div data-reveal>
          <Cta href={skedez.url} variant="link" arrow="↗" external>
            See it live at skedez.com
          </Cta>
        </div>
      </section>

      <NextStep title={["Building something", "like this?"]} />
    </main>
  );
}
