"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useEffect, useRef, useState } from "react";
import { animate, useInView} from "motion/react";
import { useLocale } from "next-intl";
import { localeInfo, type Locale } from "@/i18n/locales";

/** A figure that counts up once when it scrolls into view; renders the final value for reduced motion and no JS. */
export default function CountUp({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const locale = useLocale() as Locale;
  // Starts as the element enters, while its reveal is still fading in, so the reset to 0 is never seen.
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const reduce = useReducedMotionSafe();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!seen || reduce) return;
    const controls = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [seen, reduce, to]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value.toLocaleString(localeInfo[locale].htmlLang)}
      {suffix}
    </span>
  );
}
