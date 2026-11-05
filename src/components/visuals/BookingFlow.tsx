"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTicker } from "./useTicker";

const ease = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { title: "Choose a service", body: "Clients open the booking link from a bio, a Google profile or a website, and pick what they need." },
  { title: "Pick a free time", body: "Only real free slots show, worked out from each person's hours and existing bookings." },
  { title: "Booked", body: "The booking is confirmed straight away. On paid plans it lands in Google Calendar, with a Google Meet link if the service is online." },
  { title: "Reminded", body: "Email 24 hours and 1 hour before, and WhatsApp on paid plans, so nobody has to chase." },
];

const SERVICES = [
  { name: "Cut and blow-dry", time: "1 hr" },
  { name: "Balayage", time: "2 hr 30 min" },
  { name: "Men's cut", time: "30 min" },
  { name: "Colour refresh", time: "1 hr 30 min" },
];
const TIMES = ["9:00", "9:30", "10:00", "11:30", "14:00", "15:30"];

function Screen({ step }: { step: number }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.45, ease }}
        className="flex h-full flex-col gap-3 p-4 text-ink"
      >
        <div className="flex items-center gap-2.5 pb-1">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-[11px] font-semibold text-white">SL</span>
          <span className="flex flex-col leading-tight">
            <b className="text-[13px] font-semibold">Studio Lumière</b>
            <span className="text-[11px] text-steel">Sample business</span>
          </span>
        </div>
        {step === 0 && (
          <>
            <p className="text-[12px] font-medium text-steel">Choose a service</p>
            {SERVICES.map((s, i) => (
              <span key={s.name} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[12px] ${i === 0 ? "bg-ink text-white" : "border border-line"}`}>
                {s.name}
                <span className={i === 0 ? "text-white/70" : "text-steel"}>{s.time}</span>
              </span>
            ))}
            <span className="mt-auto rounded-full bg-ink py-2.5 text-center text-[12px] font-medium text-white">Continue</span>
          </>
        )}
        {step === 1 && (
          <>
            <p className="text-[12px] font-medium text-steel">Tuesday · Cut and blow-dry</p>
            <div className="grid grid-cols-3 gap-2">
              {TIMES.map((t, i) => (
                <span key={t} className={`rounded-lg py-2 text-center text-[12px] ${i === 1 ? "bg-signal text-white" : i === 3 ? "text-fog line-through" : "border border-line"}`}>
                  {t}
                </span>
              ))}
            </div>
            <span className="mt-auto rounded-full bg-ink py-2.5 text-center text-[12px] font-medium text-white">Book 9:30</span>
          </>
        )}
        {step === 2 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease }}
              className="grid size-14 place-items-center rounded-full bg-signal/10 text-2xl text-signal"
            >
              ✓
            </motion.span>
            <b className="text-[15px] font-semibold">Booked</b>
            <span className="text-[12px] text-steel">Cut and blow-dry · Tue 9:30</span>
            <span className="rounded-lg bg-paper px-3 py-1.5 text-[11px] text-steel">Added to Google Calendar</span>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-1 flex-col gap-2.5 pt-2">
            {[
              { when: "Mon 9:30", ch: "Email", text: "Reminder: Cut and blow-dry tomorrow at 9:30." },
              { when: "Tue 8:30", ch: "WhatsApp", text: "See you in an hour at Studio Lumière." },
            ].map((n, i) => (
              <motion.div
                key={n.ch}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.5, duration: 0.45, ease }}
                className="flex flex-col gap-1 rounded-xl border border-line bg-paper p-3"
              >
                <span className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-steel">
                  {n.ch}
                  <span>{n.when}</span>
                </span>
                <span className="text-[12px] leading-snug">{n.text}</span>
              </motion.div>
            ))}
          </div>
        )}
        <span className="pt-1 text-center text-[10px] text-steel">Booking page by SkedEz</span>
      </motion.div>
    </AnimatePresence>
  );
}

/** A booking from the client's side, in four steps; auto-advances on screen, and each step can be picked. */
export default function BookingFlow() {
  const { ref, tick } = useTicker(2800, 0);
  const [picked, setPicked] = useState<number | null>(null);
  const step = picked ?? tick % STEPS.length;

  return (
    <div ref={ref} className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
      <ol className="flex flex-col border-t border-edge">
        {STEPS.map((s, i) => (
          <li key={s.title} className="border-b border-edge">
            <button
              type="button"
              onClick={() => setPicked(i)}
              aria-pressed={i === step}
              className="group grid w-full gap-2 py-6 text-left md:grid-cols-[56px_1fr]"
            >
              <span className={`font-mono text-[13px] transition-colors duration-300 ${i === step ? "text-signal-ink" : "text-fog"}`}>0{i + 1}</span>
              <span className="flex flex-col gap-2">
                <span className={`text-[22px] font-semibold tracking-[-0.03em] transition-colors duration-300 ${i === step ? "text-paper" : "text-fog group-hover:text-paper"}`}>
                  {s.title}
                </span>
                <span
                  className={`grid text-fog transition-[grid-template-rows,opacity] duration-500 ease-station ${i === step ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <span className="overflow-hidden">{s.body}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* The phone mirrors the step list, which carries the content; it is hidden from assistive tech. */}
      <div aria-hidden="true" className="relative mx-auto w-full max-w-[300px]">
        <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-signal/25 blur-3xl" />
        <div className="relative rounded-[38px] border-[9px] border-[#1d1d21] bg-[#1d1d21] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]">
          <span aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-[18px] w-[30%] -translate-x-1/2 rounded-full bg-[#1d1d21]" />
          <div className="relative aspect-[390/760] overflow-hidden rounded-[29px] bg-white pt-7">
            <Screen step={step} />
          </div>
        </div>
        <div aria-hidden="true" className="mt-5 flex justify-center gap-1.5">
          {STEPS.map((s, i) => (
            <span key={s.title} className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${i === step ? "w-6 bg-signal" : "w-1.5 bg-edge"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
