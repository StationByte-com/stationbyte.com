"use client";

import { motion } from "motion/react";
import { useMessages } from "next-intl";
import { useTicker } from "./useTicker";

const ease = [0.16, 1, 0.3, 1] as const;
// How much of the byte is in place after each stage; the last tile is the open slot, ready for what's next.
const FILLED = [2, 4, 7, 8];

/** Hero: the logo grid assembling stage by stage. */
export function StageGrid() {
  const STAGES = useMessages().process.stages.map((s) => s.title);
  const { ref, tick } = useTicker(1500, 3);
  const stage = tick % STAGES.length;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[clamp(20px,2vw,28px)] bg-ink p-8 text-paper md:p-12">
      <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full bg-signal/20 blur-3xl" />
      <div className="relative flex flex-col gap-10">
        <div className="mx-auto grid w-full max-w-[300px] grid-cols-3 gap-3">
          {Array.from({ length: 9 }, (_, i) => {
            const on = i < FILLED[stage];
            const core = i === 4 && on;
            const slot = i === 8;
            return (
              <motion.span
                key={i}
                animate={{ scale: on || slot ? 1 : 0.82, opacity: on || slot ? 1 : 0.35 }}
                transition={{ duration: 0.6, ease, delay: on ? (i % 3) * 0.04 : 0 }}
                className={`aspect-square rounded-[22%] ${
                  slot
                    ? `border-2 border-dashed ${stage === 3 ? "border-signal-ink" : "border-edge"}`
                    : core
                      ? "bg-signal shadow-[0_0_40px_rgb(48_70_255/0.6)]"
                      : on
                        ? "bg-paper"
                        : "border border-edge"
                }`}
              />
            );
          })}
        </div>
        <ol className="grid grid-cols-4 gap-2" aria-hidden="true">
          {STAGES.map((s, i) => (
            <li key={s} className="flex flex-col gap-2">
              <span className={`h-[3px] rounded-full transition-colors duration-500 ${i <= stage ? "bg-signal" : "bg-edge"}`} />
              <span className={`eyebrow text-[11px] transition-colors duration-500 ${i === stage ? "text-paper" : "text-fog"}`}>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const card = "rounded-[20px] border border-line bg-white p-6 shadow-[0_30px_60px_-40px_rgb(10_10_11/0.35)]";

/** What each stage produces, drawn small. */
export function StageArtifact({ index }: { index: number }) {
  const t = useMessages().visuals.stages;
  const { ref, tick } = useTicker(900, 6);

  if (index === 0) {
    const items = t.scopeItems;
    const done = Math.min(items.length, tick % 7);
    return (
      <div ref={ref} className={card}>
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow text-steel">{t.scope}</span>
          <span className="rounded-full bg-paper px-2.5 py-1 text-[12px] text-steel">{t.sharedDoc}</span>
        </div>
        <ul className="flex flex-col gap-2.5">
          {items.map((it, i) => (
            <li key={it} className="flex items-center gap-3 text-[15px]">
              <span className={`grid size-5 place-items-center rounded-[6px] border text-[11px] transition-colors duration-300 ${i < done ? "border-signal bg-signal text-white" : "border-line"}`}>
                {i < done ? "✓" : ""}
              </span>
              <span className={i < done ? "text-ink" : "text-steel"}>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (index === 1) {
    const screen = tick % 3;
    return (
      <div ref={ref} className={card}>
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow text-steel">{t.prototype}</span>
          <span className="rounded-full bg-paper px-2.5 py-1 text-[12px] text-steel">{t.clickable}</span>
        </div>
        <div className="relative flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`flex flex-1 flex-col gap-1.5 rounded-xl border p-2.5 transition-[border-color,transform] duration-500 ${i === screen ? "-translate-y-1 border-ink" : "border-line"}`}>
              <span className="h-2 w-2/3 rounded bg-line" />
              <span className={`h-6 rounded-md ${i === screen ? "bg-ink" : "bg-paper"}`} />
              <span className="h-6 rounded-md bg-paper" />
              <span className={`mt-1 h-4 rounded-full ${i === screen ? "bg-signal" : "bg-line"}`} />
            </div>
          ))}
          <motion.span
            aria-hidden="true"
            animate={{ left: `${screen * 33 + 22}%`, top: "78%" }}
            transition={{ duration: 0.7, ease }}
            className="absolute size-4 rounded-full border-2 border-white bg-ink shadow"
          />
        </div>
      </div>
    );
  }

  if (index === 2) {
    const log = t.releaseItems;
    const shown = (tick % 6) + 1;
    return (
      <div ref={ref} className={card}>
        <div className="mb-4 flex items-center justify-between">
          <span className="eyebrow text-steel">{t.releases}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-[12px] text-steel">
            <span className="size-1.5 rounded-full bg-signal" />
            {t.staging}
          </span>
        </div>
        <ol className="flex flex-col gap-2">
          {log.map((l, i) => (
            <li
              key={l}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[14px] transition-[opacity,transform] duration-500 ${
                i < shown ? "translate-y-0 border-line opacity-100" : "translate-y-1 border-transparent opacity-0"
              }`}
            >
              <span>{l}</span>
              <span className="font-mono text-[12px] text-steel">{t.week.replace("{n}", String(i + 1))}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // Operate: a calm response-time line drawing itself, checks passing.
  return (
    <div ref={ref} className={card}>
      <div className="mb-4 flex items-center justify-between">
        <span className="eyebrow text-steel">{t.monitoring}</span>
        <span className="flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-[12px] text-steel">
          <span className="relative grid size-1.5 place-items-center">
            <span className="absolute inset-0 rounded-full bg-signal [animation:ping_1.8s_ease-out_infinite]" />
            <span className="size-1.5 rounded-full bg-signal" />
          </span>
          {t.checks}
        </span>
      </div>
      <svg viewBox="0 0 300 90" className="w-full" aria-hidden="true">
        {[22, 45, 68].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--color-line)" strokeDasharray="2 4" />
        ))}
        <motion.path
          key={Math.floor(tick / 8)}
          d="M0 60 C 20 58, 30 40, 50 46 S 80 62, 100 52 S 130 30, 150 38 S 180 58, 200 48 S 230 34, 250 40 S 280 50, 300 44"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </svg>
      <p className="mt-2 text-[13px] text-steel">{t.monitoringNote}</p>
    </div>
  );
}


/** The weekly rhythm as a week: plan Monday, updates midweek, release and demo Friday. */
export function WeekStrip() {
  const w = useMessages().visuals.week;
  const DAYS = w.days;
  const { ref, tick } = useTicker(120, 70);
  const t = (tick % 90) / 75; // 0 → 1.2, the playhead rests a moment on Friday
  const pos = Math.min(1, t);

  return (
    <div ref={ref} className="relative rounded-[22px] border border-edge bg-graphite p-6 md:p-8">
      <div className="relative grid grid-cols-5 gap-2">
        {DAYS.map((d, i) => {
          const passed = pos >= i / 5;
          return (
            <div key={d} className={`flex min-h-[112px] min-w-0 flex-col gap-3 rounded-xl border p-2 transition-colors duration-300 md:min-h-[132px] md:rounded-2xl md:p-4 ${passed ? "border-edge bg-ink" : "border-edge/60 bg-ink/40"}`}>
              <span className="eyebrow text-fog">{d}</span>
              {i === 0 && (
                <span className="rounded-lg bg-edge px-1.5 py-1.5 text-[11px] text-paper md:px-2 md:text-[13px]">
                  <span className="md:hidden">{w.plan}</span>
                  <span className="hidden md:inline">{w.planLong}</span>
                </span>
              )}
              {i > 0 && i < 4 && (
                <span className="flex flex-col gap-1.5">
                  <span className="h-1.5 w-4/5 rounded bg-edge" />
                  <span className="h-1.5 w-3/5 rounded bg-edge" />
                  <span className="hidden text-[12px] text-fog sm:inline">{w.update}</span>
                </span>
              )}
              {i === 4 && (
                <span className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-[11px] transition-colors duration-500 md:px-2 md:text-[13px] ${pos >= 0.95 ? "bg-signal text-white" : "bg-edge text-paper"}`}>
                  <span aria-hidden="true" className="hidden md:inline">↑</span>
                  <span className="md:hidden">{w.ship}</span>
                  <span className="hidden md:inline">{w.release}</span>
                </span>
              )}
            </div>
          );
        })}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 -top-3 w-[2px] rounded bg-signal shadow-[0_0_16px_rgb(48_70_255/0.8)]"
          style={{ left: `calc(${pos * 100}% - 1px)` }}
        />
      </div>
    </div>
  );
}
