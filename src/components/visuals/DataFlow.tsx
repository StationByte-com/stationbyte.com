"use client";

import { useTicker } from "./useTicker";

const NOT = ["Cookies", "Analytics", "Ad pixels", "Trackers"];

/** What happens to your data here: one path in, nothing out to third parties. */
export default function DataFlow() {
  const { ref, tick } = useTicker(700, 20);
  const struck = Math.min(NOT.length, Math.max(0, (tick % 12) - 2));

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[clamp(20px,2vw,28px)] bg-ink p-7 text-paper md:p-10">
      <div aria-hidden="true" className="absolute -left-16 -top-16 size-64 rounded-full bg-signal/15 blur-3xl" />
      <div className="relative flex flex-col gap-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col gap-1.5 rounded-2xl border border-edge bg-graphite p-4">
            <span className="eyebrow text-fog">You</span>
            <span className="text-[15px]">Name, email, message</span>
          </div>
          <div aria-hidden="true" className="relative h-px w-12 bg-edge md:w-20">
            <span className="absolute -top-[3px] left-0 size-[7px] rounded-full bg-signal [animation:travel-x_1.4s_var(--ease-station)_infinite]" style={{ "--travel": "72px" } as React.CSSProperties} />
          </div>
          <div className="flex flex-col gap-1.5 rounded-2xl border border-signal bg-signal/15 p-4">
            <span className="eyebrow text-signal-ink">Our team</span>
            <span className="text-[15px]">Used to reply</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-edge pt-6">
          <span className="eyebrow text-fog">Not on this site</span>
          <ul className="flex flex-wrap gap-2">
            {NOT.map((n, i) => (
              <li
                key={n}
                className={`relative rounded-lg border px-3 py-1.5 text-[14px] transition-colors duration-500 ${i < struck ? "border-edge text-fog" : "border-edge text-paper"}`}
              >
                {n}
                <span
                  aria-hidden="true"
                  className={`absolute left-2 right-2 top-1/2 h-[1.5px] origin-left bg-signal-ink transition-transform duration-500 ease-station ${i < struck ? "scale-x-100" : "scale-x-0"}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
