"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

type LiveImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Scroll drift as a percentage of the frame height. */
  drift?: number;
  /** Cursor-following specular highlight. */
  sheen?: boolean;
  /** Paper curtain that wipes away on reveal. Off for images that are on screen at load, so they paint at once. */
  curtain?: boolean;
  priority?: boolean;
};

/** Image frame that wipes in on reveal, drifts with scroll and catches a highlight under the cursor. */
export default function LiveImage({ src, alt, sizes, className = "", imageClassName = "", drift = 6, sheen = true, priority, curtain = !priority }: LiveImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${drift}%`, `${drift}%`]);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glow = useMotionValue(0);
  const sxp = useSpring(mx, { stiffness: 120, damping: 20 });
  const syp = useSpring(my, { stiffness: 120, damping: 20 });
  const op = useSpring(glow, { stiffness: 120, damping: 20 });
  const background = useMotionTemplate`radial-gradient(420px circle at ${sxp}% ${syp}%, rgb(255 255 255 / 0.35), transparent 60%)`;

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
      onPointerMove={(e) => {
        if (!sheen || reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
        glow.set(1);
      }}
      onPointerLeave={() => glow.set(0)}
    >
      {curtain && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-10 hidden bg-paper [.js_&]:block"
          variants={{
            hidden: { clipPath: "inset(0% 0% 0% 0%)" },
            shown: { clipPath: "inset(0% 0% 100% 0%)", transition: reduce ? { duration: 0 } : { duration: 1.1, ease: [0.7, 0, 0.2, 1] } },
          }}
        />
      )}
      <motion.div style={{ y: reduce ? 0 : y }} className="absolute -inset-y-[8%] inset-x-0">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imageClassName}`} />
      </motion.div>
      {sheen && (
        <motion.div aria-hidden="true" style={{ background, opacity: op }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
      )}
    </motion.div>
  );
}
