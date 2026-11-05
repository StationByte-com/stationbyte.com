"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useEffect, useRef, useState } from "react";
import { motion} from "motion/react";
import { useTranslations } from "next-intl";

type Slot = [number, number];
const START: Record<string, Slot> = {
  a: [0, 0], b: [0, 1], c: [0, 2],
  d: [1, 0], core: [1, 1], f: [1, 2],
  g: [2, 0], h: [2, 1],
};
const isNeighbour = (a: Slot, b: Slot) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;

/** "The open slot is yours": a playable 8-puzzle of ceramic tiles. Auto-plays until the visitor touches it. */
export default function Puzzle({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const t = useTranslations("home.puzzle");
  const [l1, l2] = t.raw("title") as string[];
  const reduce = useReducedMotionSafe();
  const [tiles, setTiles] = useState(START);
  const [empty, setEmpty] = useState<Slot>([2, 2]);
  const [moves, setMoves] = useState(0);
  const touched = useRef(false);
  const last = useRef<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const slide = (id: string) => {
    const from = tiles[id];
    if (!isNeighbour(from, empty)) return false;
    setTiles((prev) => ({ ...prev, [id]: empty }));
    setEmpty(from);
    last.current = id;
    return true;
  };

  useEffect(() => {
    if (reduce) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    if (root.current) io.observe(root.current);
    const id = setInterval(() => {
      if (touched.current || !visible || document.hidden) return;
      const options = Object.entries(tiles).filter(([k, s]) => isNeighbour(s, empty) && k !== last.current);
      const [pick] = options[Math.floor(Math.random() * options.length)] ?? [];
      if (pick) slide(pick);
    }, 2400);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles, empty, reduce]);

  const solved = Object.entries(tiles).every(([k, s]) => s[0] === START[k][0] && s[1] === START[k][1]);

  return (
    <div
      ref={root}
      // Autoplay stops for good once a pointer or keyboard focus arrives, so a move never disables the tile in focus.
      onPointerEnter={() => (touched.current = true)}
      onFocusCapture={() => (touched.current = true)}
      className="relative flex h-full min-h-[420px] flex-col justify-between gap-6 rounded-[28px] bg-[#ecebe7] p-6 text-ink md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <Heading className="text-[clamp(26px,2.4vw,32px)] font-semibold leading-[1.05] tracking-[-0.035em]">
          {l1}
          <br />
          {l2}
        </Heading>
        <p className="eyebrow text-right text-steel" aria-live="polite">
          {moves === 0 ? t("start") : solved ? t("solved") : t("moves", { count: moves })}
        </p>
      </div>

      <div role="group" aria-label={t("group")} className="relative mx-auto aspect-square w-full max-w-[340px]">
        {Object.entries(tiles).map(([id, [r, c]]) => {
          const movable = isNeighbour([r, c], empty);
          const core = id === "core";
          return (
            <motion.button
              key={id}
              type="button"
              aria-label={t("tile", { core: core ? "yes" : "no", row: String(r + 1), col: String(c + 1), movable: movable ? "yes" : "no" })}
              disabled={!movable}
              onClick={() => {
                touched.current = true;
                if (slide(id)) setMoves((m) => m + 1);
              }}
              initial={false}
              animate={{ left: `${c * 34}%`, top: `${r * 34}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
              whileHover={movable ? { y: -3 } : undefined}
              whileTap={movable ? { y: 1, scale: 0.98 } : undefined}
              className={`absolute size-[32%] rounded-[22%] transition-shadow duration-300 enabled:cursor-pointer disabled:cursor-default ${
                core
                  ? "bg-signal shadow-[inset_0_-6px_0_rgb(0_0_0/0.18),0_10px_20px_-8px_rgb(48_70_255/0.6)]"
                  : "bg-[#f8f7f4] shadow-[inset_0_-6px_0_rgb(0_0_0/0.06),0_10px_18px_-10px_rgb(0_0_0/0.35)]"
              } ${movable ? "ring-1 ring-inset ring-ink/10 hover:ring-signal/50" : ""}`}
            />
          );
        })}
        <span
          aria-hidden="true"
          className="absolute size-[32%] rounded-[22%] border border-dashed border-steel/40"
          style={{ left: `${empty[1] * 34}%`, top: `${empty[0] * 34}%` }}
        />
      </div>

      <p className="eyebrow text-steel">{t("footer")}</p>
    </div>
  );
}
