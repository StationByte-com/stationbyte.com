import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import LoopVideo from "@/components/motion/LoopVideo";
import ContactSection from "@/components/contact/ContactSection";
import JsonLd from "@/components/site/JsonLd";
import { contactPage } from "@/content/schema";
import CopyEmail from "@/components/contact/CopyEmail";
import { nextSteps } from "@/content/contact";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Start a project",
  description: `Tell StationByte what you're building. Use the form or email ${site.email}; we reply ${site.replyTime}.`,
  path: "/contact",
  og: "contact",
  ogAlt: "Ceramic tiles with the blue one in the last slot, beside the words Tell us what you're building",
});

export default function ContactPage() {
  return (
    <main id="main">
      <JsonLd data={contactPage} />
      <PageHero
        current="Start a project"
        eyebrow="Start a project"
        title={["Tell us what", "you're building."]}
        lede={`A few lines are enough to start. We reply ${site.replyTime}, and the person who answers is an engineer, not a salesperson.`}
        visual={
          <LoopVideo
            name="contact"
            alt="Eight off-white ceramic tiles in a grid on linen, a blue tile settling into the one open slot"
            sizes="(min-width: 1024px) 40vw, 92vw"
            className="aspect-[4/3] rounded-[clamp(20px,2vw,28px)] bg-line lg:aspect-[4/5]"
            priority
          />
        }
      />

      <ContactSection
        aside={
          <>
          <div data-reveal className="flex flex-col gap-4 rounded-[22px] border border-line bg-white p-7">
            <p className="eyebrow text-steel">Rather email?</p>
            <CopyEmail />
            <p className="text-[15px] text-steel">Include what you&apos;re building, where it stands today, and when you need it.</p>
          </div>

          <div className="flex flex-col gap-6">
            <p data-reveal className="eyebrow text-steel">What happens next</p>
            <ol className="relative flex flex-col gap-8 pl-8">
              <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-[2px] rounded bg-line" />
              {nextSteps.map((s, i) => (
                <li key={s.title} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties} className="relative flex flex-col gap-1.5">
                  <span aria-hidden="true" className={`absolute -left-8 top-1.5 size-3 rounded-[3px] ${i === 0 ? "bg-signal" : "bg-ink"}`} />
                  <h2 className="text-xl font-semibold tracking-[-0.03em]">{s.title}</h2>
                  <p className="text-[15px] text-steel">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <p data-reveal className="text-[15px] text-steel">
            Not ready to talk yet? See{" "}
            <Link href="/process" className="text-ink underline decoration-line underline-offset-4 hover:decoration-signal">
              how we work
            </Link>{" "}
            or{" "}
            <Link href="/work/skedez" className="text-ink underline decoration-line underline-offset-4 hover:decoration-signal">
              a product we built
            </Link>
            .
          </p>
          </>
        }
      />
    </main>
  );
}
