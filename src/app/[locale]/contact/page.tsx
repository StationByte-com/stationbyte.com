import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/content/seo";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/site/PageHero";
import LoopVideo from "@/components/motion/LoopVideo";
import ContactSection from "@/components/contact/ContactSection";
import JsonLd from "@/components/site/JsonLd";
import { contactPage } from "@/content/schema";
import CopyEmail from "@/components/contact/CopyEmail";
import { loadLocale } from "@/i18n/copy";
import ClientMessages from "@/i18n/ClientMessages";
import { budgets } from "@/content/contact";
import { usdCompact } from "@/i18n/format";
import { localeInfo, type Locale } from "@/i18n/locales";

/** Budget ranges in US dollars, written the way the page's language writes amounts. Formatted here, on the server,
 *  so the browser's ICU version can never disagree with the server's. */
async function budgetLabels(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "contactForm.budgets" });
  const usd = new Intl.NumberFormat(localeInfo[locale].htmlLang, usdCompact).format;
  return Object.fromEntries(
    budgets.map((b) => [
      b.id,
      !("from" in b) && !("to" in b) ? t("unsure") : !("from" in b) ? t("under", { amount: usd(b.to) }) : !("to" in b) ? t("over", { amount: usd(b.from) }) : t("range", { from: usd(b.from), to: usd(b.to) }),
    ]),
  );
}

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.contact;
  return pageMetadata({ locale, title: p.title, description: p.description, path: "/contact", og: "contact", ogAlt: p.ogAlt });
}

const inline = "text-ink underline decoration-line underline-offset-4 hover:decoration-signal";

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.contact;
  const t = await getTranslations({ locale, namespace: "pages.contact" });

  return (
    <ClientMessages locale={locale} copy={copy} contactForm>
    <main id="main">
      <JsonLd data={contactPage(locale, copy)} />
      <PageHero
        current={p.title}
        eyebrow={p.eyebrow}
        title={p.heading}
        lede={p.lede}
        visual={
          <LoopVideo
            name="contact"
            alt={p.videoAlt}
            sizes="(min-width: 1024px) 40vw, 92vw"
            className="aspect-[4/3] rounded-[clamp(20px,2vw,28px)] bg-line lg:aspect-[4/5]"
            priority
          />
        }
      />

      <ContactSection
        budgetLabels={await budgetLabels(locale)}
        aside={
          <>
          <div data-reveal className="flex flex-col gap-4 rounded-[22px] border border-line bg-white p-7">
            <p className="eyebrow text-steel">{p.ratherEmail}</p>
            <CopyEmail />
            <p className="text-[15px] text-steel">{p.emailTip}</p>
          </div>

          <div className="flex flex-col gap-6">
            <p data-reveal className="eyebrow text-steel">{p.whatNext}</p>
            <ol className="relative flex flex-col gap-8 pl-8">
              <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-[2px] rounded bg-line" />
              {p.steps.map((s, i) => (
                <li key={s.title} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties} className="relative flex flex-col gap-1.5">
                  <span aria-hidden="true" className={`absolute -left-8 top-1.5 size-3 rounded-[3px] ${i === 0 ? "bg-signal" : "bg-ink"}`} />
                  <h2 className="text-xl font-semibold tracking-[-0.03em]">{s.title}</h2>
                  <p className="text-[15px] text-steel">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <p data-reveal className="text-[15px] text-steel">
            {t.rich("notReady", {
              process: (chunks) => (
                <Link href="/process" className={inline}>
                  {chunks}
                </Link>
              ),
              product: (chunks) => (
                <Link href="/work/skedez" className={inline}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
          </>
        }
      />
    </main>
    </ClientMessages>
  );
}
