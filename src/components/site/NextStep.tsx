import { useTranslations } from "next-intl";
import Cta from "@/components/motion/Cta";
import Eyebrow from "@/components/motion/Eyebrow";
import { site } from "@/content/site";

/** Closing band on inner pages: one next step, plus the address for people who'd rather just email. */
export default function NextStep({ title }: { title?: readonly string[] }) {
  const t = useTranslations("common");
  const [a, b] = title ?? (t.raw("nextStepTitle") as string[]);
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* The open slot, drawn large and faint behind the copy; one tile slides into it and back. */}
      <svg aria-hidden="true" viewBox="0 0 64 64" className="absolute -right-24 top-1/2 -z-10 hidden h-[560px] -translate-y-1/2 opacity-[0.09] md:block">
        {[0, 23, 46].flatMap((y, r) =>
          [0, 23, 46].map((x, c) =>
            r === 2 && c === 2 ? (
              <rect key="slot" x={x + 0.5} y={y + 0.5} width="17" height="17" rx="4.5" fill="none" stroke="var(--color-signal-ink)" strokeDasharray="2 2" />
            ) : (
              <rect
                key={`${r}${c}`}
                x={x}
                y={y}
                width="18"
                height="18"
                rx="4.5"
                fill={r === 1 && c === 1 ? "var(--color-signal)" : "var(--color-paper)"}
                className={r === 2 && c === 1 ? "slot-mover" : undefined}
              />
            ),
          ),
        )}
      </svg>
      <div className="shell flex flex-col gap-8 py-28 md:py-32">
        <div data-reveal>
          <Eyebrow className="text-signal-ink">{t("nextStepEyebrow")}</Eyebrow>
        </div>
        <h2 className="display max-w-[820px] text-[clamp(40px,5vw,72px)]">
          <span className="line-mask"><span>{a}</span></span>{" "}
          <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>{b}</span></span>
        </h2>
        <p data-reveal className="max-w-[520px] text-fog">
          {t("nextStepBody")}
        </p>
        <div data-reveal className="flex flex-wrap items-center gap-6">
          <Cta href="/contact" variant="light">{t("startProject")}</Cta>
          <a href={`mailto:${site.email}`} className="border-b border-edge py-2 text-paper transition-colors hover:border-signal-ink hover:text-signal-ink">
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}
