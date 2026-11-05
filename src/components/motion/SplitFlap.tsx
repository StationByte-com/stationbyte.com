"use client";

import { useEffect, useRef, useState } from "react";

const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const KANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモラリルレロ";
const HANGUL = "가나다라마바사아자차카타파하거너더러머버서어저처";
const isKana = (ch: string) => /[\u3040-\u30ff\u3400-\u9fff]/.test(ch);
const isHangul = (ch: string) => /[\uac00-\ud7af]/.test(ch);
// Code points, after upper-casing: "ß" becomes "SS", and kana are one cell each.
const chars = (w: string) => Array.from(w.toUpperCase());
/** While a cell flips it shows glyphs from the script it will land on, so Japanese flips through kana, not A–Z. */
const shuffleFor = (ch: string) => (isKana(ch) ? KANA : isHangul(ch) ? HANGUL : LATIN);

type SplitFlapProps = {
  words: string[];
  /** Milliseconds each word stays on the board. */
  hold?: number;
  className?: string;
};

/** A departure-board line that flips through `words`, one character cell at a time. */
export default function SplitFlap({ words, hold = 2600, className }: SplitFlapProps) {
  const size = Math.max(...words.map((w) => chars(w).length));
  const pad = (w: string) => [...chars(w), ...Array(size - chars(w).length).fill(" ")];
  // Full-width scripts need wider cells.
  const wide = words.some((w) => Array.from(w).some((ch) => isKana(ch) || isHangul(ch)));
  const [cells, setCells] = useState(() => pad(words[0]));
  const [flips, setFlips] = useState(() => Array(size).fill(0));
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (root.current) io.observe(root.current);

    const setCell = (i: number, ch: string) => {
      setCells((prev) => (prev[i] === ch ? prev : prev.map((c, j) => (j === i ? ch : c))));
      setFlips((prev) => prev.map((n, j) => (j === i ? n + 1 : n)));
    };

    const flipTo = (word: string) => {
      // The previous flip has finished by now; drop its timers instead of letting the list grow forever.
      timers.forEach(clearTimeout);
      timers.length = 0;
      pad(word).forEach((target, i) => {
        const steps = target === " " ? 1 : 3 + Math.floor(Math.random() * 3);
        for (let s = 0; s < steps; s++) {
          const last = s === steps - 1;
          const glyphs = shuffleFor(target);
          const ch = last ? target : glyphs[Math.floor(Math.random() * glyphs.length)];
          timers.push(setTimeout(() => setCell(i, ch), i * 38 + s * 70));
        }
      });
    };

    const tick = setInterval(() => {
      if (!visible || document.hidden) return;
      index = (index + 1) % words.length;
      flipTo(words[index]);
    }, hold);

    return () => {
      clearInterval(tick);
      timers.forEach(clearTimeout);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.join("|"), hold]);

  return (
    <span ref={root} className={className} role="img" aria-label={words.join(", ")}>
      <span aria-hidden="true" className="flex gap-[3px] font-mono font-medium">
        {cells.map((ch, i) => (
          <span
            key={i}
            className={`relative grid h-[1.55em] ${wide ? "w-[1.7em]" : "w-[1.12em]"} place-items-center overflow-hidden rounded-[5px] ${
              i === 0 ? "bg-signal text-white" : "bg-ink text-paper"
            }`}
          >
            <span key={flips[i]} className="flap-char">
              {ch === " " ? " " : ch}
            </span>
            <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/10" />
          </span>
        ))}
      </span>
    </span>
  );
}
