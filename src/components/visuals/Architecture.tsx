"use client";

import { useMessages } from "next-intl";
import { useTicker } from "./useTicker";

// Deliberately general: the shape of the system, not the vendors or internals behind it (copy: messages visuals.architecture).

const node = (on: boolean) =>
  `flex flex-col gap-1 rounded-2xl border px-4 py-3.5 transition-[border-color,background-color] duration-500 ${on ? "border-ink bg-white" : "border-line bg-paper"}`;

/** The SkedEz system at a glance: the ways in, one API, and what it talks to. A pulse follows one booking through it. */
export default function Architecture() {
  const t = useMessages().visuals.architecture;
  const CLIENTS = t.clients;
  const SERVICES = t.services;
  const { ref, tick } = useTicker(900, 1);
  const client = tick % CLIENTS.length;
  const service = tick % SERVICES.length;
  const phase = tick % 3;

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {CLIENTS.map((c, i) => (
          <div key={c.k} className={node(i === client && phase === 0)}>
            <span className="eyebrow text-steel">{c.k}</span>
            <span className="text-[15px]">{c.v}</span>
          </div>
        ))}
      </div>

      <Connector on={phase === 0} />

      <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-5 transition-colors duration-500 ${phase === 1 ? "bg-signal text-white" : "bg-ink text-paper"}`}>
          <span className="flex flex-col gap-1">
            <span className={`eyebrow ${phase === 1 ? "text-white" : "text-fog"}`}>{t.api}</span>
            <span className="text-[20px] font-semibold tracking-[-0.02em]">{t.oneApi}</span>
          </span>
          <span aria-hidden="true" className="relative grid size-3 place-items-center">
            <span className="absolute inset-0 rounded-full bg-current opacity-60 [animation:ping_1.6s_ease-out_infinite]" />
            <span className="size-3 rounded-full bg-current" />
          </span>
        </div>
        <div className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-5 transition-colors duration-500 ${phase === 1 ? "border-ink bg-white" : "border-line bg-paper"}`}>
          <span className="flex flex-col gap-1">
            <span className="eyebrow text-steel">{t.data}</span>
            <span className="text-[20px] font-semibold tracking-[-0.02em]">{t.database}</span>
          </span>
          <span className="text-[13px] text-steel">{t.databaseNote}</span>
        </div>
      </div>

      <Connector on={phase === 2} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <div key={s.k} className={node(i === service && phase === 2)}>
            <span className="eyebrow text-steel">{s.k}</span>
            <span className="text-[15px]">{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Connector({ on }: { on: boolean }) {
  return (
    <div aria-hidden="true" className="relative mx-auto h-8 w-px bg-line">
      <span
        className={`absolute -left-[3px] top-0 size-[7px] rounded-full bg-signal transition-opacity ${on ? "opacity-100 [animation:travel-y_0.9s_var(--ease-station)_infinite]" : "opacity-0"}`}
        style={{ "--travel": "26px" } as React.CSSProperties}
      />
    </div>
  );
}
