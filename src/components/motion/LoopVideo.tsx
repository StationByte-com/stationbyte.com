"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type LoopVideoProps = {
  /** Clip name in public/video/loops (scripts/hero-film/scenes.py), e.g. "ai". */
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  /** "view": plays while on screen. "hover": plays while the pointer is over the nearest `.group`. */
  play?: "view" | "hover";
  priority?: boolean;
};

/**
 * A short seamless 3D loop over its own first frame. The poster is a real image (alt text, instant paint);
 * the video fades in once playing, pauses off screen and never plays for visitors who prefer reduced motion.
 */
export default function LoopVideo({ name, alt, sizes, className = "", play = "view", priority }: LoopVideoProps) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    const el = frame.current;
    if (!v || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => v.play().catch(() => {});
    const stop = () => v.pause();

    if (play === "hover") {
      const host = el.closest<HTMLElement>(".group") ?? el;
      host.addEventListener("pointerenter", start);
      host.addEventListener("pointerleave", stop);
      host.addEventListener("focusin", start);
      host.addEventListener("focusout", stop);
      return () => {
        host.removeEventListener("pointerenter", start);
        host.removeEventListener("pointerleave", stop);
        host.removeEventListener("focusin", start);
        host.removeEventListener("focusout", stop);
      };
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  return (
    // Callers that position the clip themselves (absolute) keep that; otherwise it's its own positioning context.
    <div ref={frame} className={`${/\babsolute\b/.test(className) ? "" : "relative"} overflow-hidden ${className}`}>
      <Image src={`/video/loops/${name}.webp`} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
      >
        <source src={`/video/loops/${name}.webm`} type="video/webm" />
        <source src={`/video/loops/${name}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
