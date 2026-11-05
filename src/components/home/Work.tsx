"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Puzzle from "./Puzzle";
import Cta from "@/components/motion/Cta";
import Eyebrow from "@/components/motion/Eyebrow";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

const MotionLink = motion.create(Link);

const facts = [
  ["Plan", "Free plan, no card"],
  ["Pricing", "No commission"],
  ["Languages", "Clients book in 6"],
];

/** Selected work band. On /work the page hero carries the heading, so `intro` is off there. */
export default function Work({ intro = true }: { intro?: boolean }) {
  // Without the section heading, the cards sit directly under the page h1.
  const Heading = intro ? "h3" : "h2";
  const reduce = useReducedMotionSafe();
  const frame = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const shotY = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  // Cursor-follow "View" label on pointer devices.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 40 });
  const sy = useSpring(y, { stiffness: 400, damping: 40 });
  const show = useMotionValue(0);
  const scale = useSpring(show, { stiffness: 500, damping: 35 });

  return (
    <section id="work" className="scroll-mt-[72px] bg-ink text-paper">
      <div className="shell flex flex-col gap-14 py-28 md:py-32">
        {intro && (
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-5">
            <div data-reveal><Eyebrow className="text-fog">Selected work</Eyebrow></div>
            <h2 className="display text-[clamp(42px,5.5vw,80px)]">
              <span className="line-mask"><span>Products we build</span></span>
              <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>and run.</span></span>
            </h2>
          </div>
          <p data-reveal className="max-w-[420px] text-fog">
            Running our own product in production shapes how we build for clients.
          </p>
        </div>
        )}

        <article data-reveal className="flex flex-wrap items-center gap-10 rounded-[28px] border border-edge bg-graphite p-4 md:gap-12 md:p-10">
          <MotionLink
            ref={frame}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            href="/work/skedez"
            aria-label="Read the SkedEz case study"
            className="group relative min-w-0 flex-[999_1_560px] cursor-none overflow-hidden rounded-2xl border border-edge bg-ink"
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return;
              const r = e.currentTarget.getBoundingClientRect();
              x.set(e.clientX - r.left);
              y.set(e.clientY - r.top);
              show.set(1);
            }}
            onPointerLeave={() => show.set(0)}
          >
            <motion.div
              style={{ y: reduce ? 0 : shotY }}
              variants={{
                hidden: { clipPath: "inset(0% 100% 0% 0%)" },
                shown: { clipPath: "inset(0% 0% 0% 0%)", transition: reduce ? { duration: 0 } : { duration: 1.2, ease: [0.7, 0, 0.2, 1] } },
              }}
              className="relative hidden aspect-[1440/756] sm:block"
            >
              <Image
                src="/images/skedez-desktop.webp"
                alt="SkedEz homepage: Clients book you 24/7. You just show up."
                fill
                sizes="(min-width: 1440px) 820px, 60vw"
                className="object-cover object-top transition-transform duration-700 ease-station group-hover:scale-[1.02]"
              />
            </motion.div>
            <div className="relative aspect-[390/640] sm:hidden">
              <Image
                src="/images/skedez-mobile.webp"
                alt="SkedEz on a phone: Clients book you 24/7. You just show up."
                fill
                sizes="100vw"
                className="object-cover object-top"
              />
            </div>
            <motion.span
              aria-hidden="true"
              style={{ x: sx, y: sy, scale }}
              className="pointer-events-none absolute left-0 top-0 -ml-11 -mt-11 hidden size-22 place-items-center rounded-full bg-signal text-sm font-medium text-white [@media(pointer:fine)]:grid"
            >
              Case study
            </motion.span>
          </MotionLink>

          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5 px-2 pb-4 md:p-0">
            <Eyebrow className="text-signal-ink">In-house product · Live</Eyebrow>
            <Heading className="text-5xl font-semibold tracking-[-0.04em]">SkedEz</Heading>
            <p className="text-fog">
              Online booking for service businesses. Clients book any free time, reminders go out on their own, and on paid
              plans every booking lands in Google Calendar.
            </p>
            <dl className="border-t border-edge">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-edge py-3">
                  <dt className="text-fog">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-5">
              <Cta href="/work/skedez" variant="light">Read the case study</Cta>
              <Cta href="https://skedez.com" variant="link" arrow="↗" external className="hover:!text-signal-ink">
                Visit skedez.com
              </Cta>
            </div>
          </div>
        </article>

        <div className="flex flex-wrap gap-6">
          <article data-reveal className="relative isolate flex min-h-[420px] min-w-0 flex-[1_1_420px] flex-col justify-between gap-10 overflow-hidden rounded-[28px] border border-edge bg-graphite p-8 md:p-10">
            {/* Tiles behind frosted glass: the work is there, just not ours to show. */}
            <Image
              src="/images/work-nda.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="-z-10 object-cover object-right opacity-80 transition-transform duration-[1.4s] ease-station hover:scale-[1.03]"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(22_22_24/0.96)_30%,rgb(22_22_24/0.55)_65%,rgb(22_22_24/0.15))]" />
            <Eyebrow className="text-fog">Client work</Eyebrow>
            <div className="flex flex-col gap-4">
              <Heading className="text-[clamp(28px,2.6vw,36px)] font-semibold leading-[1.05] tracking-[-0.035em]">Work like yours, on a call.</Heading>
              <p className="max-w-[460px] text-fog">
                Pablo&apos;s earlier projects are on the Studio page. Tell us what you&apos;re building and we&apos;ll walk you through the ones closest to it.
              </p>
            </div>
            <Cta href="/contact" variant="link" className="self-start hover:!text-signal-ink">
              Ask about similar work
            </Cta>
          </article>

          <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties} className="min-w-0 flex-[1_1_420px]">
            <Puzzle headingLevel={intro ? 3 : 2} />
          </div>
        </div>
      </div>
    </section>
  );
}
