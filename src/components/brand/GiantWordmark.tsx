"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { motion} from "motion/react";
import { WORDMARK_BOX, WORDMARK_LETTERS } from "./wordmark-letters";

/** Footer-scale outlined wordmark. Letters rise one by one as it enters; each fills on hover. */
export default function GiantWordmark() {
  const reduce = useReducedMotionSafe();
  const { y, width, height } = WORDMARK_BOX;

  return (
    // The in-view trigger lives on the svg: fully clipped letters have no visible area to observe.
    <motion.svg
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      viewBox={`-2 ${y - 2} ${width + 4} ${height + 4}`}
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label="stationbyte"
    >
      <defs>
        <clipPath id="wordmark-clip">
          <rect x="-2" y={y - 2} width={width + 4} height={height + 4} />
        </clipPath>
      </defs>
      <g clipPath="url(#wordmark-clip)">
        {WORDMARK_LETTERS.map((l, i) => (
          <motion.path
            key={i}
            d={l.d}
            variants={{ hidden: { y: height }, shown: { y: 0, transition: reduce ? { duration: 0 } : { duration: 1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] } } }}
            className="fill-transparent stroke-[#3a3a40] transition-[fill,stroke] duration-500 [stroke-width:0.6] hover:fill-signal hover:stroke-signal"
          />
        ))}
      </g>
    </motion.svg>
  );
}
