"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useMessages } from "next-intl";
import Eyebrow from "@/components/motion/Eyebrow";

/** Scroll-filled stage line. On /process the page hero carries the heading, so `intro` is off there. */
export default function Process({ intro = true }: { intro?: boolean }) {
  const Heading = intro ? "h3" : "h2";
  const { process: copy, home, common } = useMessages();
  const process = copy.stages;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  // Markers light up from scroll position in every mode; only the moving line is motion.
  const [reached, setReached] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.min(process.length, Math.floor(v * process.length + 0.35)));
  });

  return (
    <section id={intro ? "process" : undefined} className="scroll-mt-[72px] border-t border-line">
      <div className="shell flex flex-col gap-16 py-28 md:py-32">
        {intro && (
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-5">
            <div data-reveal><Eyebrow className="text-steel">{home.process.eyebrow}</Eyebrow></div>
            <h2 className="display text-[clamp(42px,5vw,72px)]">
              <span className="line-mask"><span>{home.process.title}</span></span>
            </h2>
          </div>
          <p data-reveal className="max-w-[420px] text-steel">
            {home.process.lede}{" "}
            <Link href="/process" className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal">
              {common.howWeWork}
            </Link>
          </p>
        </div>
        )}

        <div ref={ref} className="relative pl-7 md:pl-0">
          {/* Track: vertical on phones, horizontal from md up. */}
          <div aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-[2px] rounded bg-line md:inset-x-0 md:bottom-auto md:top-0 md:h-[2px] md:w-auto">
            <motion.div
              style={{ scaleY: reduce ? 1 : fill }}
              className="h-full w-full origin-top rounded bg-signal md:hidden"
            />
            <motion.div
              style={{ scaleX: reduce ? 1 : fill }}
              className="hidden h-full w-full origin-left rounded bg-signal md:block"
            />
          </div>

          <ol className="grid gap-10 md:grid-cols-4 md:gap-8 md:pt-10">
            {process.map((step, i) => {
              const on = i < reached;
              return (
                <li key={step.title} className="relative flex flex-col gap-3">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-7 top-1 size-3 rounded-[3px] transition-colors duration-500 md:-top-[46px] md:left-0 ${
                      on ? "bg-signal" : "bg-line"
                    }`}
                  />
                  <span className={`font-mono text-[13px] transition-colors duration-500 ${on ? "text-signal-deep" : "text-steel"}`}>
                    0{i + 1}
                  </span>
                  <Heading className="text-[26px] font-semibold tracking-[-0.03em]">{step.title}</Heading>
                  <p className="text-base text-steel">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
