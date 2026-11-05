"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LoopVideo from "@/components/motion/LoopVideo";
import Link from "next/link";
import { services } from "@/content/site";
import Eyebrow from "@/components/motion/Eyebrow";

export default function Services() {
  const [open, setOpen] = useState(0);
  const id = useId();

  return (
    <section id="services" className="scroll-mt-[72px]">
      <div className="shell flex flex-wrap gap-12 pb-28 pt-32 md:pb-32 md:pt-36">
        <div className="flex min-w-0 flex-[1_1_340px] flex-col items-start gap-5">
          <div data-reveal><Eyebrow className="text-steel">Services</Eyebrow></div>
          <h2 className="display text-[clamp(42px,5vw,72px)]">
            <span className="line-mask"><span>Four things,</span></span>
            <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>done properly.</span></span>
          </h2>
          <Link data-reveal href="/services" className="group/all mt-2 inline-flex items-center gap-2 border-b border-ink py-1 font-medium transition-colors hover:border-signal hover:text-signal-deep">
            All services
            <span aria-hidden="true" className="transition-transform duration-500 ease-station group-hover/all:translate-x-1">→</span>
          </Link>
        </div>

        <div data-reveal className="flex min-w-0 flex-[999_1_640px] flex-col border-t border-ink">
          {services.map((s, i) => {
            const expanded = open === i;
            return (
              <div key={s.title} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`${id}-h${i}`}
                    aria-expanded={expanded}
                    aria-controls={`${id}-p${i}`}
                    onClick={() => setOpen(expanded ? -1 : i)}
                    className="group flex w-full items-baseline justify-between gap-6 py-7 text-left md:py-8"
                  >
                    <span className="text-[clamp(24px,2.6vw,36px)] font-semibold leading-[1.1] tracking-[-0.035em] transition-colors group-hover:text-signal-deep">
                      {s.title}
                    </span>
                    <span aria-hidden="true" className="relative size-4 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded bg-current" />
                      <span
                        className={`absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 rounded bg-current transition-transform duration-500 ease-station ${
                          expanded ? "scale-y-0" : ""
                        }`}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={`${id}-p${i}`}
                      role="region"
                      aria-labelledby={`${id}-h${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 sm:grid-cols-[minmax(0,1fr)_200px] sm:gap-8">
                      <div className="flex flex-col gap-5">
                        <p className="max-w-[620px] text-steel">{s.body}</p>
                        <ul className="flex flex-wrap gap-2">
                          {s.tags.map((t) => (
                            <li key={t} className="eyebrow rounded-md border border-line px-2.5 py-1.5 text-ink">
                              {t}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/services/${s.slug}`}
                          className="group/more inline-flex items-center gap-2 self-start border-b border-ink py-1 font-medium transition-colors hover:border-signal hover:text-signal-deep"
                        >
                          {s.title} in detail
                          <span aria-hidden="true" className="transition-transform duration-500 ease-station group-hover/more:translate-x-1">→</span>
                        </Link>
                      </div>
                      <motion.div
                        initial={{ clipPath: "inset(0% 0% 100% 0% round 16px)" }}
                        animate={{ clipPath: "inset(0% 0% 0% 0% round 16px)" }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.7, 0, 0.2, 1] }}
                        className="relative order-first aspect-[16/10] overflow-hidden rounded-2xl bg-ink sm:order-none sm:aspect-[4/5]"
                      >
                        <LoopVideo name={s.loop} alt="" sizes="(min-width: 640px) 200px, 90vw" className="absolute inset-0" />
                      </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
