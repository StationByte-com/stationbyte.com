"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useEffect, useRef, useState } from "react";

/**
 * A counter that advances every `ms` while the element is on screen, for looping diagrams.
 * With reduced motion it stays at `still`, a frame that shows the whole idea at once.
 */
export function useTicker<T extends HTMLElement = HTMLDivElement>(ms: number, still = 0) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotionSafe();
  const [tick, setTick] = useState(still);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    let id = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id);
      if (e.isIntersecting) id = window.setInterval(() => setTick((t) => t + 1), ms);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [ms, reduce]);

  return { ref, tick: reduce ? still : tick, reduce: !!reduce };
}
