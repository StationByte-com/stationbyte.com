"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·";
// Only Latin letters and digits shuffle; Japanese, Korean and other wide characters appear as they are, so the line never jumps in width.
const SHUFFLES = /[A-Za-z0-9\u00C0-\u024F]/;

/** Monospace section label that decodes from random glyphs when it scrolls into view. */
export default function Eyebrow({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [text, setText] = useState(children);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const total = 450;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / total);
          const settled = Math.floor(p * children.length);
          setText(
            children
              .split("")
              .map((ch, i) => (i < settled || !SHUFFLES.test(ch) ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join(""),
          );
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [children]);

  return (
    <p ref={ref} className={`eyebrow ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">{text}</span>
    </p>
  );
}
