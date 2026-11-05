"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import ContactForm, { type Progress } from "./ContactForm";

const ease = [0.16, 1, 0.3, 1] as const;
// Each answered field sets a tile; the core lights when the required ones are done; the slot fills on send.
const FIELD_TILES: (keyof Progress["fields"])[] = ["name", "email", "kind", "budget", "message"];
const TILE_FOR = [0, 1, 2, 3, 5];

function SlotProgress({ progress }: { progress: Progress }) {
  const t = useTranslations("contactForm.progress");
  const { fields, sent } = progress;
  const ready = fields.name && fields.email && fields.message;
  const count = FIELD_TILES.filter((f) => fields[f]).length;
  const label = sent ? t("sent") : ready ? t("ready") : count ? t("answered", { count: String(count) }) : t("start");

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-ink p-7 text-paper">
      <div aria-hidden="true" className={`absolute -right-16 -top-16 size-56 rounded-full blur-3xl transition-colors duration-700 ${ready ? "bg-signal/35" : "bg-signal/10"}`} />
      <div className="relative flex items-center gap-7">
        <div aria-hidden="true" className="grid w-[112px] shrink-0 grid-cols-3 gap-1.5">
          {Array.from({ length: 9 }, (_, i) => {
            const field = TILE_FOR.indexOf(i);
            const on = field >= 0 ? fields[FIELD_TILES[field]] : i === 4 ? ready : i === 6 || i === 7 ? sent : false;
            const slot = i === 8;
            return (
              <motion.span
                key={i}
                animate={{ scale: on || (slot && sent) ? 1 : 0.86 }}
                transition={{ duration: 0.5, ease }}
                className={`aspect-square rounded-[24%] transition-colors duration-500 ${
                  slot
                    ? sent
                      ? "bg-signal"
                      : "border-2 border-dashed border-signal-ink/70"
                    : i === 4
                      ? on
                        ? "bg-signal shadow-[0_0_24px_rgb(48_70_255/0.7)]"
                        : "border border-edge"
                      : on
                        ? "bg-paper"
                        : "border border-edge"
                }`}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <p className="eyebrow text-fog">{t("yourProject")}</p>
          <p className="text-[20px] font-semibold leading-tight tracking-[-0.03em]" aria-live="polite">
            {label}
          </p>
          <p className="text-[14px] text-fog">{t("hint")}</p>
        </div>
      </div>
    </div>
  );
}

/** The project form and its live progress tile, sharing state. `aside` is the rest of the sidebar. */
export default function ContactSection({ aside, budgetLabels }: { aside: React.ReactNode; budgetLabels: Record<string, string> }) {
  const [progress, setProgress] = useState<Progress>({ fields: { name: false, email: false, kind: false, budget: false, message: false }, sent: false });

  return (
    <section className="shell grid gap-16 pb-28 md:pb-32 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-20">
      <div data-reveal className="flex min-w-0 flex-col gap-10">
        {/* On phones the progress tile sits above the form, where it can be seen while typing. */}
        <div className="lg:hidden">
          <SlotProgress progress={progress} />
        </div>
        <ContactForm onProgress={setProgress} budgetLabels={budgetLabels} />
      </div>
      <aside className="flex min-w-0 flex-col gap-12 lg:sticky lg:top-28 lg:self-start">
        <div data-reveal className="hidden lg:block">
          <SlotProgress progress={progress} />
        </div>
        {aside}
      </aside>
    </section>
  );
}
