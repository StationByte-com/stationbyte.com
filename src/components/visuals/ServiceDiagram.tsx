"use client";

import { AnimatePresence, motion } from "motion/react";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";
import { useMessages, useTranslations } from "next-intl";
import { useTicker } from "./useTicker";

const ease = [0.16, 1, 0.3, 1] as const;

function Caption({ children }: { children: string }) {
  return <p className="eyebrow mt-5 text-fog/80">{children}</p>;
}

/* ------------------------------------------------------------------ AI: request → context → routing → guardrails, scored by evals */
// The routing stage (index 2) shows the two models as chips instead of its text.
const ROUTING = 2;
const STAGE_COUNT = 5;
const CASES = 40;
const FAILS = new Set([7, 23]);

function AiDiagram() {
  const t = useMessages().visuals.ai;
  const STAGES = t.stages;
  const { ref, tick } = useTicker(700, 60);
  const active = tick % (STAGE_COUNT + 2);
  const run = Math.min(CASES, (tick % 70) * 2);
  const passed = Array.from({ length: run }, (_, i) => i).filter((i) => !FAILS.has(i)).length;
  const done = run >= CASES;

  return (
    <div ref={ref}>
      <div className="rounded-[22px] border border-edge bg-graphite p-6 md:p-8">
        <ol className="grid gap-3 md:grid-cols-5 md:gap-0">
          {STAGES.map((s, i) => {
            const on = i === active;
            const past = i < active;
            return (
              <li key={s.k} className="relative flex items-center gap-3 md:flex-col md:items-stretch md:gap-0">
                <div
                  className={`relative z-10 flex min-w-0 flex-1 flex-col gap-1.5 rounded-2xl border p-4 transition-[border-color,background-color] duration-500 md:mx-1.5 ${
                    on ? "border-signal bg-signal/15" : past ? "border-edge bg-ink" : "border-edge bg-ink/60"
                  }`}
                >
                  <span className={`eyebrow transition-colors duration-500 ${on ? "text-signal-ink" : "text-fog"}`}>{s.k}</span>
                  {i === ROUTING ? (
                    <span className="flex flex-wrap gap-1.5 text-[13px]">
                      {t.models.map((m, j) => (
                        <span
                          key={m}
                          className={`rounded-md px-2 py-0.5 transition-colors duration-500 ${
                            Math.floor(tick / 7) % 2 === j ? "bg-signal text-white" : "bg-edge text-fog"
                          }`}
                        >
                          {m}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-[14px] leading-snug text-paper">{s.v}</span>
                  )}
                </div>
                {i < STAGES.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[calc(100%-6px)] top-1/2 z-0 hidden h-px w-3 bg-edge md:block" />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 grid gap-6 border-t border-edge pt-6 md:grid-cols-[1fr_auto] md:items-end">
          <div className="flex flex-col gap-3">
            <p className="eyebrow text-fog">{t.eval}</p>
            <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
              {Array.from({ length: CASES }, (_, i) => (
                <span
                  key={i}
                  className={`aspect-square rounded-[3px] transition-colors duration-300 ${
                    i >= run ? "bg-edge" : FAILS.has(i) ? "border border-fog/60 bg-transparent" : "bg-signal"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-1">
            <span className="font-mono text-[28px] font-medium tabular-nums tracking-[-0.02em] text-paper">
              {passed}/{CASES}
            </span>
            <span className={`eyebrow transition-colors ${done ? "text-signal-ink" : "text-fog"}`}>{done ? t.pass : t.running}</span>
          </div>
        </div>
      </div>
      <Caption>{t.caption}</Caption>
    </div>
  );
}

/* ------------------------------------------------------------------ SaaS: a request travelling down the platform layers */
function SaasDiagram() {
  const LAYERS = useMessages().visuals.saas.layers;
  const t = useTranslations("visuals.saas");
  const { ref, tick } = useTicker(650, 2);
  const step = tick % (LAYERS.length + 2);
  const tenant = Math.floor(tick / (LAYERS.length + 2)) % 3;

  return (
    <div ref={ref}>
      <div className="relative flex flex-col gap-2.5 rounded-[22px] border border-edge bg-graphite p-6 md:p-8">
        {LAYERS.map((l, i) => {
          const on = i === step;
          const lit = i <= step && step < LAYERS.length;
          return (
            <div
              key={l.k}
              className={`grid items-center gap-3 rounded-2xl border p-4 transition-[border-color,background-color] duration-500 sm:grid-cols-[130px_1fr] ${
                on ? "border-signal bg-signal/12" : "border-edge bg-ink/70"
              }`}
            >
              <span className={`eyebrow transition-colors duration-500 ${lit ? "text-signal-ink" : "text-fog"}`}>{l.k}</span>
              <span className="flex flex-wrap gap-2">
                {l.items.map((it, j) => {
                  const hit = (i === 0 && j === tenant) || (on && i > 0 && j === tick % l.items.length);
                  return (
                    <span
                      key={it}
                      className={`rounded-lg px-3 py-1.5 text-[14px] transition-colors duration-500 ${hit ? "bg-signal text-white" : "bg-edge/70 text-paper"}`}
                    >
                      {it}
                    </span>
                  );
                })}
              </span>
            </div>
          );
        })}
        <p className="pt-2 text-[14px] text-fog">
          {t.rich("note", { team: LAYERS[0].items[tenant], b: (chunks) => <b className="font-medium text-paper">{chunks}</b> })}
        </p>
      </div>
      <Caption>{t("caption")}</Caption>
    </div>
  );
}

/* ------------------------------------------------------------------ Web & mobile: one core, two surfaces */
function AppsDiagram() {
  const t = useMessages().visuals.apps;
  const SHARED = t.items;
  const { ref, tick } = useTicker(1100, 0);
  const lit = tick % SHARED.length;

  return (
    <div ref={ref}>
      <div className="relative rounded-[22px] border border-edge bg-graphite p-6 pb-10 md:p-10 md:pb-14">
        <div className="relative pr-[22%]">
          <BrowserFrame src="/images/skedez-desktop.webp" alt={t.desktopAlt} url="skedez.com" sizes="(min-width: 1024px) 640px, 80vw" />
          <div className="absolute -bottom-6 right-0 w-[30%] md:-bottom-10">
            <PhoneFrame src="/images/skedez-mobile.webp" alt={t.phoneAlt} sizes="220px" />
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-2.5 md:mt-16">
          <span className="eyebrow mr-2 text-fog">{t.shared}</span>
          {SHARED.map((s, i) => (
            <span
              key={s}
              className={`rounded-lg border px-3 py-1.5 text-[14px] transition-colors duration-500 ${
                i === lit ? "border-signal bg-signal text-white" : "border-edge text-paper"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <Caption>{t.caption}</Caption>
    </div>
  );
}

/* ------------------------------------------------------------------ Design: flow → wireframe → final, on one screen */
function DesignDiagram() {
  const { design: t, booking } = useMessages().visuals;
  const MODES = t.modes;
  const SERVICES = booking.services.slice(0, 3);
  const { ref, tick } = useTicker(2600, 2);
  // 0 flow, 1 wireframe, 2 final; labels come from messages.
  const index = tick % MODES.length;
  const mode = MODES[index];

  return (
    <div ref={ref}>
      <div className="rounded-[22px] border border-edge bg-graphite p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="eyebrow text-fog">{t.screen}</span>
          <span className="flex rounded-full border border-edge p-1" aria-hidden="true">
            {MODES.map((m) => (
              <span key={m} className={`rounded-full px-3 py-1 text-[13px] transition-colors duration-500 ${m === mode ? "bg-paper text-ink" : "text-fog"}`}>
                {m}
              </span>
            ))}
          </span>
        </div>
        <div className="relative mx-auto min-h-[340px] max-w-[420px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease }}
            >
              {index === 0 && (
                <div className="flex flex-col items-center gap-3 pt-6">
                  {t.flow.map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-3">
                      <span className="rounded-xl border border-dashed border-fog/50 px-5 py-3 text-[15px] text-paper">{s}</span>
                      {i < 2 && <span aria-hidden="true" className="h-6 w-px bg-fog/40" />}
                    </div>
                  ))}
                </div>
              )}
              {index === 1 && (
                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-fog/40 p-5">
                  <span className="h-4 w-1/2 rounded bg-edge" />
                  <span className="h-3 w-1/3 rounded bg-edge/70" />
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`flex h-12 items-center justify-between rounded-xl border border-dashed px-4 ${i === 0 ? "border-fog/70" : "border-fog/30"}`}>
                      <span className="h-3 w-2/5 rounded bg-edge" />
                      <span className="h-3 w-12 rounded bg-edge/70" />
                    </span>
                  ))}
                  <span className="mt-2 h-11 rounded-full border border-dashed border-fog/60" />
                </div>
              )}
              {index === 2 && (
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-ink text-[12px] font-semibold text-white">{booking.initials}</span>
                    <span className="flex flex-col">
                      <b className="text-[15px] font-semibold">{booking.business}</b>
                      <span className="text-[12px] text-steel">{booking.choose}</span>
                    </span>
                  </div>
                  {SERVICES.map((s, i) => (
                    <span
                      key={s.name}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-[14px] ${i === 0 ? "bg-ink text-white" : "border border-line"}`}
                    >
                      {s.name}
                      <span className={`text-[12px] ${i === 0 ? "text-white/70" : "text-steel"}`}>{s.time}</span>
                    </span>
                  ))}
                  <span className="mt-2 rounded-full bg-signal py-3 text-center text-[14px] font-medium text-white">{t.book}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Caption>{t.caption}</Caption>
    </div>
  );
}

export default function ServiceDiagram({ slug }: { slug: string }) {
  if (slug === "ai-product-engineering") return <AiDiagram />;
  if (slug === "saas-platforms") return <SaasDiagram />;
  if (slug === "web-and-mobile-apps") return <AppsDiagram />;
  return <DesignDiagram />;
}
