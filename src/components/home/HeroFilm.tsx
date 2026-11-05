"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

const FPS = 24;
const pad = (n: number) => String(n).padStart(2, "0");
const timecode = (s: number) => {
  const f = Math.floor(s * FPS);
  return `${pad(Math.floor(f / (FPS * 60)))}:${pad(Math.floor(f / FPS) % 60)}:${pad(f % FPS)}`;
};

/**
 * The hero film: an 8-second seamless glass loop, path-traced in Blender Cycles (scripts/hero-film).
 * Poster is frame 1, so the first paint and the loop start match. Drifts with the cursor and pushes in on scroll.
 */
export default function HeroFilm() {
  const reduce = useReducedMotionSafe();
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const tc = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({ target: frame, offset: ["start 70%", "end start"] });
  const push = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 20 });
  const y = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // Read the preference directly: the safe hook reports false during hydration, and the film must never start then.
    if (reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    // Only play while on screen; saves battery and keeps the main thread free elsewhere.
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.1 });
    io.observe(v);
    // The timecode only ticks while the film is actually playing.
    let raf = 0;
    const tick = () => {
      if (tc.current) tc.current.textContent = timecode(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(raf);
    v.addEventListener("play", start);
    v.addEventListener("pause", stop);
    return () => {
      io.disconnect();
      stop();
      v.removeEventListener("play", start);
      v.removeEventListener("pause", stop);
    };
  }, [reduce]);

  return (
    <div
      ref={frame}
      className="absolute inset-0"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * -24);
        my.set(((e.clientY - r.top) / r.height - 0.5) * -16);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div style={{ scale: reduce ? 1.04 : push, x, y }} className="absolute inset-0">
        {/* Frame 0 of the matching cut, so the still and the loop start are identical. */}
        <picture>
          <source media="(max-width: 639px)" srcSet="/video/hero-tall-poster.jpg" />
          <img
            src="/video/hero-wide-poster.jpg"
            alt="Eight glass and graphite tiles in a grid on a reflective floor, the centre tile glowing blue, one slot open"
            className="absolute inset-0 h-full w-full object-cover object-[60%_0%]"
            fetchPriority="high"
          />
        </picture>
        <video
          ref={video}
          className={`absolute inset-0 h-full w-full object-cover object-[60%_0%] transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
        >
          <source src="/video/hero-tall.webm" type="video/webm" media="(max-width: 639px)" />
          <source src="/video/hero-tall.mp4" type="video/mp4" media="(max-width: 639px)" />
          <source src="/video/hero-wide.webm" type="video/webm" />
          <source src="/video/hero-wide.mp4" type="video/mp4" />
        </video>
      </motion.div>
      {/* Film-style letterbox fades top and bottom into the card. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_7/0.55),transparent_22%,transparent_78%,rgb(5_5_7/0.6))]" />
      <p
        aria-hidden="true"
        className={`eyebrow pointer-events-none absolute right-6 top-6 flex items-center gap-2 text-fog/80 transition-opacity duration-700 md:right-8 md:top-7 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="size-1.5 rounded-full bg-signal" />
        <span ref={tc} className="tabular-nums">00:00:00</span>
      </p>
    </div>
  );
}
