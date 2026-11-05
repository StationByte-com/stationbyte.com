import Link from "next/link";
import Eyebrow from "@/components/motion/Eyebrow";
import JsonLd from "./JsonLd";
import { site } from "@/content/site";

type Crumb = { href: string; label: string };

type PageHeroProps = {
  /** Trail above the page itself; Home is added automatically. */
  trail?: Crumb[];
  current: string;
  eyebrow: string;
  title: [string, string?];
  lede: React.ReactNode;
  children?: React.ReactNode;
  /** Optional illustration beside the text from lg up, below it on smaller screens. */
  visual?: React.ReactNode;
};

const delay = (ms: number) => ({ style: { "--reveal-delay": `${ms}ms` } as React.CSSProperties });

/** Shared top of every inner page: breadcrumbs (with BreadcrumbList data), label, two-line masked headline, lede. */
export default function PageHero({ trail = [], current, eyebrow, title, lede, children, visual }: PageHeroProps) {
  const crumbs = [{ href: "/", label: "Home" }, ...trail];

  return (
    <section className="pt-[72px]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [...crumbs.map((c) => c.label), current].map((name, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name,
            ...(i < crumbs.length ? { item: `${site.url}${crumbs[i].href === "/" ? "" : crumbs[i].href}` } : {}),
          })),
        }}
      />
      <div
        className={`shell grid gap-14 pb-20 pt-16 md:pb-24 md:pt-24 ${
          visual ? "lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-16" : ""
        }`}
      >
      <div className="flex min-w-0 flex-col gap-7">
        <nav aria-label="Breadcrumb" data-reveal>
          <ol className="eyebrow flex flex-wrap items-center gap-2 text-steel">
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-2">
                <Link href={c.href} className="transition-colors hover:text-ink">
                  {c.label}
                </Link>
                <span aria-hidden="true" className="size-1 rounded-[1px] bg-line" />
              </li>
            ))}
            <li aria-current="page" className="text-ink">
              {current}
            </li>
          </ol>
        </nav>

        <div data-reveal {...delay(80)}>
          <Eyebrow className="text-signal-deep">{eyebrow}</Eyebrow>
        </div>

        <h1
          className={`display max-w-[1100px] leading-[0.94] tracking-[-0.05em] ${
            visual ? "text-[clamp(44px,6vw,92px)]" : "text-[clamp(44px,7vw,104px)]"
          }`}
        >
          <span className="line-mask" {...delay(140)}>
            <span>{title[0]}</span>
          </span>
          {title[1] && (
            <span className="line-mask" {...delay(240)}>
              <span>{title[1]}</span>
            </span>
          )}
        </h1>

        <div data-reveal className="max-w-[680px] text-[clamp(18px,1.6vw,22px)] leading-normal text-steel" {...delay(360)}>
          {lede}
        </div>

        {children && (
          <div data-reveal className="flex flex-wrap items-center gap-5 pt-2" {...delay(460)}>
            {children}
          </div>
        )}
      </div>
      {/* Not a scroll reveal: the hero visual is usually the largest paint, so it shows as soon as it loads. */}
      {visual && <div className="min-w-0">{visual}</div>}
      </div>
    </section>
  );
}
