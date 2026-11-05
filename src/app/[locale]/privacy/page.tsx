import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/content/seo";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/site/PageHero";
import DataFlow from "@/components/visuals/DataFlow";
import { site } from "@/content/site";
import { loadLocale } from "@/i18n/copy";
import { localeInfo } from "@/i18n/locales";
import ClientMessages from "@/i18n/ClientMessages";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.privacy;
  return pageMetadata({ locale, title: p.title, description: p.description, path: "/privacy", og: "privacy", ogAlt: p.ogAlt });
}

/** Date of the last change to this policy, in any language's own date format. */
const UPDATED = new Date("2026-11-05T12:00:00Z");

const link = "text-ink underline decoration-line underline-offset-4 hover:decoration-signal";

// Each section's paragraphs (p*) or list items (i*), in order. The words are in messages pages.privacy.sections.
const SECTIONS = [
  { id: "who", paras: ["p1"] },
  { id: "collect", paras: ["p1", "p2", "p3"] },
  { id: "use", items: ["i1", "i2", "i3"] },
  { id: "never", paras: ["p1"] },
  { id: "share", paras: ["p1", "p2"] },
  { id: "keep", items: ["i1", "i2", "i3"] },
  { id: "rights", paras: ["p1", "p2"] },
  { id: "security", paras: ["p1"] },
  { id: "children", paras: ["p1"] },
  { id: "changes", paras: ["p1"] },
] as const;

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale, copy } = await loadLocale(params);
  const p = copy.pages.privacy;
  const t = await getTranslations({ locale, namespace: "pages.privacy" });
  const tags = {
    b: (chunks: React.ReactNode) => <b>{chunks}</b>,
    mail: (chunks: React.ReactNode) => (
      <a href={`mailto:${site.email}`} className={link}>
        {chunks}
      </a>
    ),
    form: (chunks: React.ReactNode) => (
      <Link href="/contact" className={link}>
        {chunks}
      </Link>
    ),
  };
  // Keys are built from the typed list above, so every one exists in the English messages.
  const rich = (key: string) => (t.rich as unknown as (key: string, values: typeof tags) => React.ReactNode)(`sections.${key}`, tags);
  // Formatted for the exact variety the page is written in: "5 November 2026" (en-GB), not the US default.
  const date = new Intl.DateTimeFormat(localeInfo[locale].htmlLang, { dateStyle: "long", timeZone: "UTC" }).format(UPDATED);

  return (
    <ClientMessages locale={locale} copy={copy} visuals={["dataFlow"]}>
    <main id="main">
      <PageHero
        current={p.current}
        eyebrow={p.eyebrow.replace("{date}", date)}
        title={p.heading}
        lede={p.lede}
        visual={<DataFlow />}
      />

      <section className="shell grid gap-12 pb-28 md:pb-32 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
        <nav aria-label={p.onThisPage} className="hidden lg:block">
          <ol className="sticky top-28 flex flex-col gap-2.5 border-l border-line pl-5 text-[15px]">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-steel transition-colors hover:text-ink">
                  {p.sections[s.id].title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex max-w-[720px] flex-col border-t border-ink">
          {p.translationNote && <p className="border-b border-line py-6 text-[15px] text-steel">{p.translationNote}</p>}
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-line py-10">
              <h2 className="mb-5 flex items-baseline gap-4 text-[clamp(24px,2.4vw,32px)] font-semibold tracking-[-0.035em]">
                <span className="font-mono text-[13px] font-medium tracking-normal text-steel">{String(i + 1).padStart(2, "0")}</span>
                {p.sections[s.id].title}
              </h2>
              <div className="flex flex-col gap-4 text-steel [&_b]:font-medium [&_b]:text-ink [&_li]:flex [&_li]:gap-3 [&_li]:before:mt-[0.6em] [&_li]:before:size-2 [&_li]:before:shrink-0 [&_li]:before:rounded-[2px] [&_li]:before:bg-ink [&_li]:before:content-[''] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3">
                {"paras" in s && s.paras.map((k) => <p key={k}>{rich(`${s.id}.${k}`)}</p>)}
                {"items" in s && (
                  <ul>
                    {s.items.map((k) => (
                      <li key={k}>
                        <span>{rich(`${s.id}.${k}`)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
    </ClientMessages>
  );
}
