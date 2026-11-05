"use client";

import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";

/** SkedEz on desktop and phone, leaning gently toward the cursor (Apple-style product staging, real screenshots). */
export default function DeviceDuo() {
  const reduce = useReducedMotionSafe();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 80, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 80, damping: 20 });
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 20 });

  return (
    <div
      className="relative [perspective:1400px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative pb-[14%] pr-[18%] [transform-style:preserve-3d]">
        <BrowserFrame src="/images/skedez-desktop.webp" alt="SkedEz homepage in a desktop browser" url="skedez.com" sizes="(min-width: 1024px) 40vw, 80vw" priority />
        <motion.div style={{ x: px }} className="absolute bottom-0 right-0 w-[34%] [transform:translateZ(60px)]">
          <PhoneFrame src="/images/skedez-mobile.webp" alt="SkedEz on a phone" sizes="200px" />
        </motion.div>
        <span className="eyebrow absolute -top-3 left-6 rounded-full bg-signal px-3 py-1.5 text-white shadow-lg">Live · skedez.com</span>
      </motion.div>
    </div>
  );
}
