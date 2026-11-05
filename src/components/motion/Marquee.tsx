"use client";

import { useState } from "react";

/** Slow, pausable strip of items. The only looping animation on the site. */
export default function Marquee({ items, label }: { items: string[]; label: string }) {
  const [paused, setPaused] = useState(false);
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-7">{item}</span>
          <span aria-hidden="true" className="size-[7px] rounded-[2px] bg-current opacity-40" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={label} className="marquee relative border-y border-line" data-paused={paused}>
      <div className="overflow-hidden py-5 eyebrow text-steel text-[13px]">
        <div className="marquee-track flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="absolute right-[clamp(16px,4.5vw,64px)] top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper text-steel transition-colors hover:text-ink"
      >
        <span className="sr-only">{paused ? "Play" : "Pause"} the tools strip</span>
        {paused ? (
          <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z" fill="currentColor" /></svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0h3v12H0zM7 0h3v12H7z" fill="currentColor" /></svg>
        )}
      </button>
    </section>
  );
}
