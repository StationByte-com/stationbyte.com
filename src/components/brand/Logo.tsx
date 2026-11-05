"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { motion} from "motion/react";
import { WORDMARK_PATH } from "./wordmark-path";

// 3x3 grid, 18-unit tiles, 5-unit gap. Eight tiles make a byte; bottom-right stays open.
const SLOTS = [0, 23, 46];
const TILES = SLOTS.flatMap((y, r) => SLOTS.map((x, c) => ({ x, y, r, c }))).filter((t) => !(t.r === 2 && t.c === 2));
const isAccent = (t: { r: number; c: number }) => t.r === 1 && t.c === 1;

// Hover: tile (2,1) slides right into the open slot, then the blue core drops into the space it left.
const shuffleClass = (t: { r: number; c: number }) =>
  t.r === 2 && t.c === 1
    ? "transition-transform duration-[320ms] ease-switch delay-[140ms] group-hover/logo:translate-x-[23px] group-hover/logo:delay-0 motion-reduce:transition-none"
    : t.r === 1 && t.c === 1
      ? "transition-transform duration-[320ms] ease-switch group-hover/logo:translate-y-[23px] group-hover/logo:delay-[140ms] motion-reduce:transition-none"
      : undefined;

type LogoProps = {
  variant?: "full" | "mark";
  /** Slide the tiles into place on mount; the blue tile lands last. */
  assemble?: boolean;
  /** On hover of a `group/logo` ancestor, the bottom tile and then the blue tile slide one slot. */
  shuffle?: boolean;
  className?: string;
  title?: string;
};

export default function Logo({ variant = "full", assemble = false, shuffle = false, className, title = "StationByte" }: LogoProps) {
  const reduce = useReducedMotionSafe();
  const order = [...TILES.filter((t) => !isAccent(t)), ...TILES.filter(isAccent)];

  return (
    <svg
      viewBox={variant === "full" ? "0 0 401 64" : "0 0 64 64"}
      role="img"
      aria-label={title}
      className={className}
      fill="currentColor"
    >
      {order.map((t, i) => {
        const accent = isAccent(t);
        return (
          <motion.g
            key={`${t.r}-${t.c}`}
            initial={assemble ? { opacity: 0, x: accent ? 23 : (1 - t.c) * 10, y: accent ? 23 : (1 - t.r) * 10 } : false}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.15 + i * 0.06 + (accent ? 0.2 : 0), ease: [0.16, 1, 0.3, 1] }}
          >
            <rect
              x={t.x}
              y={t.y}
              width={18}
              height={18}
              rx={4.5}
              fill={accent ? "var(--color-signal)" : "currentColor"}
              className={shuffle ? shuffleClass(t) : undefined}
            />
          </motion.g>
        );
      })}
      {variant === "full" && (
        <motion.path
          transform="translate(83.58 48.55) scale(0.62)"
          d={WORDMARK_PATH}
          initial={assemble ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.5 }}
        />
      )}
    </svg>
  );
}
