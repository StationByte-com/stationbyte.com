"use client";

import { MotionConfig } from "motion/react";

/** Site-wide motion defaults: visitors who ask for reduced motion get no movement from the motion library. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
