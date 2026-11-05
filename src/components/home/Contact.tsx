"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useState } from "react";
import { AnimatePresence, motion} from "motion/react";
import Eyebrow from "@/components/motion/Eyebrow";
import Link from "next/link";
import { site } from "@/content/site";

// The tile edge in studio-macro.webp (1672x941), traced so a light can travel along it.
const EDGE = "M 345 268 C 352 470, 470 565, 760 652 S 1440 838, 1672 900";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotionSafe();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section id="contact" className="relative isolate scroll-mt-[72px] overflow-hidden bg-ink text-paper">
      {/* Photo and travelling edge light share one viewBox, so they crop identically at every width. */}
      <svg aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="edge-glow">
            <stop offset="0%" stopColor="#9aa8ff" stopOpacity="0.95" />
            <stop offset="18%" stopColor="#3046ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3046ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <image href="/images/studio-macro.webp" width="1672" height="941" />
        {/* Always rendered so server and client markup match; hidden for reduced motion. */}
        <circle r="120" fill="url(#edge-glow)" className="motion-reduce:hidden" style={{ mixBlendMode: "screen" }}>
          <animateMotion dur="6.5s" repeatCount="indefinite" path={EDGE} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.7 0 0.2 1" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="6.5s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(10_10_11/0.94)_32%,rgb(10_10_11/0.35))]" />

      <div className="shell flex flex-col gap-8 py-32 md:py-36">
        <div data-reveal>
          <Eyebrow className="text-signal-ink">Start a project</Eyebrow>
        </div>
        <h2 className="display max-w-[820px] text-[clamp(42px,5vw,72px)]">
          <span className="line-mask"><span>Tell us what</span></span>
          <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>you&apos;re building.</span></span>
        </h2>
        <div data-reveal className="flex flex-wrap items-center gap-5">
          <a
            href={`mailto:${site.email}`}
            className="group relative text-[clamp(28px,4.4vw,64px)] font-medium leading-[1.15] tracking-[-0.04em] [overflow-wrap:anywhere] transition-colors hover:text-signal-ink"
          >
            {site.email}
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-1 h-[2px] origin-left bg-signal"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </a>
          <motion.button
            layout
            type="button"
            onClick={copy}
            transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            className={`min-h-11 overflow-hidden rounded-full px-5.5 py-3.5 text-[15px] font-medium transition-colors duration-300 ${
              copied ? "bg-signal text-white" : "bg-paper text-ink hover:bg-signal hover:text-white"
            }`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={copied ? "done" : "copy"}
                className="block"
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {copied ? "Copied ✓" : "Copy address"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <span role="status" className="sr-only">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
        <p data-reveal className="max-w-[560px] text-fog">
          We reply {site.replyTime}. Include what you&apos;re building, where it stands today, and when you need it, or{" "}
          <Link href="/contact" className="text-paper underline decoration-edge underline-offset-4 transition-colors hover:decoration-signal-ink">
            use the project form
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
