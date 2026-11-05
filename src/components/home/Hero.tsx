"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { motion} from "motion/react";
import { useRef } from "react";
import SplitFlap from "@/components/motion/SplitFlap";
import Cta from "@/components/motion/Cta";
import Eyebrow from "@/components/motion/Eyebrow";
import { useTranslations } from "next-intl";
import HeroFilm from "./HeroFilm";

const ease = [0.16, 1, 0.3, 1] as const;

// Text uses the CSS reveal system (visible without JavaScript); delays stagger the intro.
const delay = (ms: number) => ({ style: { "--reveal-delay": `${ms}ms` } as React.CSSProperties });

export default function Hero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("common");
  const [l1, l2] = t.raw("title") as string[];
  const reduce = useReducedMotionSafe();
  const media = useRef<HTMLDivElement>(null);


  return (
    <section id="top" className="pt-[72px]">
      <div className="shell flex flex-col items-center gap-7 pb-16 pt-20 text-center md:pt-28">
        <div data-reveal {...delay(150)}>
          <Eyebrow className="text-steel">{t("eyebrow")}</Eyebrow>
        </div>

        <h1 className="display text-[clamp(48px,8vw,120px)] leading-[0.92] tracking-[-0.05em]">
          <span className="line-mask" {...delay(250)}>
            <span>{l1}</span>
          </span>{" "}
          <span className="line-mask" {...delay(370)}>
            <span>{l2}</span>
          </span>
        </h1>

        <div data-reveal className="flex flex-wrap items-center justify-center gap-3.5" {...delay(550)}>
          <span className="eyebrow text-steel">{t("nowBuilding")}</span>
          <SplitFlap words={t.raw("words") as string[]} className="text-[clamp(14px,1.6vw,20px)]" />
        </div>

        <p data-reveal className="max-w-[640px] text-[clamp(18px,1.6vw,22px)] leading-normal text-steel" {...delay(650)}>
          {t("lede")}
        </p>

        <div data-reveal className="flex flex-wrap items-center justify-center gap-5 pt-2" {...delay(750)}>
          <Cta href="/contact">{tc("startProject")}</Cta>
          <Cta href="/work" variant="link" arrow="">
            {tc("seeOurWork")}
          </Cta>
        </div>
      </div>

      <div className="shell">
        <motion.div
          ref={media}
          className="relative overflow-hidden rounded-[clamp(20px,2vw,28px)] bg-ink"
          initial={{ clipPath: "inset(8% 6% 0% 6% round 28px)", opacity: 0.4 }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 1.4, delay: 0.5, ease }}
        >
          <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[16/8]">
            <HeroFilm alt={t("filmAlt")} />
          </div>
          <p className="eyebrow pointer-events-none absolute bottom-6 left-6 text-fog md:bottom-8 md:left-8">{t("figure")}</p>
        </motion.div>
      </div>
    </section>
  );
}
