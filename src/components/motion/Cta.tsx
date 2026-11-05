"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";

const MotionLink = motion.create(Link);

type CtaProps = {
  href: string;
  children: string;
  variant?: "solid" | "light" | "link";
  arrow?: string;
  className?: string;
  external?: boolean;
  onClick?: () => void;
};

const styles = {
  solid: "rounded-full bg-ink px-6.5 py-4 text-paper hover:bg-signal",
  light: "rounded-full bg-paper px-5.5 py-3.5 text-[15px] text-ink hover:bg-signal hover:text-white",
  link: "border-b border-current px-1 py-3 hover:text-signal-deep",
};

/** Button-like link: pulls toward the cursor (max 6px), label rolls up on hover, arrow slides. */
export default function Cta({ href, children, variant = "solid", arrow = "→", className = "", external, onClick }: CtaProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotionSafe();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  // Internal pages go through the router; external, mailto and in-page links stay plain anchors.
  const Anchor = href.startsWith("/") && !external ? MotionLink : motion.a;

  return (
    <Anchor
      ref={ref}
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || variant === "link") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`group inline-flex items-center gap-2.5 font-medium transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-station group-hover:-translate-y-full">{children}</span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-station group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {arrow && (
        <span aria-hidden="true" className="transition-transform duration-500 ease-station group-hover:translate-x-1">
          {arrow}
        </span>
      )}
    </Anchor>
  );
}
