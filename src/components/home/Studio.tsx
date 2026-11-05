import LiveImage from "@/components/motion/LiveImage";
import Cta from "@/components/motion/Cta";
import Eyebrow from "@/components/motion/Eyebrow";
import { useMessages, useTranslations } from "next-intl";

export default function Studio() {
  const t = useTranslations("home.studio");
  const { studio, common } = useMessages();
  const principles = studio.principles;
  const [l1, l2] = t.raw("title") as string[];
  return (
    <section id="studio" className="scroll-mt-[72px]">
      <div className="shell flex flex-wrap items-center gap-16 pb-32 pt-10 md:pb-36">
        <div className="relative min-w-0 flex-[1_1_420px]">
          <LiveImage
            src="/images/studio-stack.webp"
            alt={t("imageAlt")}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-[4/5] rounded-[28px] bg-line"
          />
          {/* Window light drifting slowly across the tiles. */}
          <div aria-hidden="true" className="window-light pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] mix-blend-soft-light" />
        </div>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
          <div data-reveal><Eyebrow className="text-steel">{t("eyebrow")}</Eyebrow></div>
          <h2 className="display text-[clamp(42px,5vw,72px)]">
            <span className="line-mask"><span>{l1}</span></span>{" "}
            <span className="line-mask" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}><span>{l2}</span></span>
          </h2>
          <p data-reveal className="max-w-[540px] text-[clamp(18px,1.5vw,20px)] leading-normal text-steel">
            {t.rich("lede", {
              link: (chunks) => (
                <a href="https://pabloitalo.com" className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal">
                  {chunks}
                </a>
              ),
            })}
          </p>
          <ul data-reveal className="border-t border-line">
            {principles.map((p, i) => (
              <li key={p} className="flex items-baseline gap-4 border-b border-line py-4">
                <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-[3px] ${i === principles.length - 1 ? "bg-signal" : "bg-ink"}`} />
                {p}
              </li>
            ))}
          </ul>
          <div data-reveal>
            <Cta href="/studio" variant="link" arrow="→">
              {common.aboutStudio}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
