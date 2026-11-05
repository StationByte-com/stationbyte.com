import { founder, services, site, stack } from "./site";
import { tagLabel } from "./services";
import { skedez } from "./work";
import { absoluteUrl } from "./seo";
import { getCopy } from "@/i18n/copy";
import { defaultLocale, localeInfo, localePath, locales, type Locale } from "@/i18n/locales";

/**
 * Markdown for language models (llmstxt.org): a short index at /llms.txt and the full site text at
 * /llms-full.txt, in English, plus the same pair under each language prefix (/es/llms.txt, /ja/llms-full.txt…).
 * Built from the same messages as the pages, so they never drift apart.
 */
const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
const llmsUrl = (locale: Locale, file: "llms.txt" | "llms-full.txt") => `${site.url}${locale === defaultLocale ? "" : `/${locale}`}/${file}`;

async function header(locale: Locale) {
  const copy = await getCopy(locale);
  return { copy, lines: [`# ${site.name}`, "", `> ${copy.meta.description}`, "", copy.llms.about] };
}

function languages(locale: Locale, file: "llms.txt" | "llms-full.txt", heading: string) {
  return [
    `## ${heading}`,
    ...locales.filter((l) => l !== locale).map((l) => `- [${localeInfo[l].name}](${llmsUrl(l, file)}): ${site.url}${localePath(l, "/") === "/" ? "/" : localePath(l, "/")}`),
  ];
}

export async function llmsIndex(locale: Locale) {
  const { copy, lines } = await header(locale);
  const l = copy.llms;
  const u = (path: string) => absoluteUrl(locale, path);
  return [
    ...lines,
    "",
    `## ${l.pages}`,
    `- [${l.homeLink}](${u("/")}): ${l.home}`,
    `- [${copy.pages.work.title}](${u("/work")}): ${l.work}`,
    `- [${copy.pages.skedez.title}](${u("/work/skedez")}): ${l.skedez}`,
    `- [${copy.pages.services.title}](${u("/services")}): ${l.services}`,
    ...services.map((s) => `- [${copy.services[s.slug].title}](${u(`/services/${s.slug}`)}): ${copy.services[s.slug].description}`),
    `- [${copy.pages.process.title}](${u("/process")}): ${l.process}`,
    `- [${copy.pages.studio.title}](${u("/studio")}): ${l.studio}`,
    `- [${copy.pages.contact.title}](${u("/contact")}): ${l.contact}`,
    "",
    ...languages(locale, "llms.txt", l.languages),
    "",
    `## ${l.optional}`,
    `- [${l.fullText}](${llmsUrl(locale, "llms-full.txt")})`,
    `- [${copy.pages.privacy.title}](${u("/privacy")})`,
    `- [${l.sitemap}](${site.url}/sitemap.xml)`,
    "",
  ].join("\n");
}

export async function llmsFull(locale: Locale) {
  const { copy, lines: start } = await header(locale);
  const l = copy.llms;
  const u = (path: string) => absoluteUrl(locale, path);
  const lines: string[] = [...start, ""];
  const h = (t: string) => lines.push("", t, "");

  h(`## ${copy.pages.services.title}`);
  for (const s of services) {
    const c = copy.services[s.slug];
    lines.push(`### ${c.title}`, "", `URL: ${u(`/services/${s.slug}`)}`, "", c.problem, "", l.whatYouGet);
    c.deliverables.forEach((d) => lines.push(`- ${d.title}: ${d.body}`));
    lines.push("", l.approach);
    c.approach.forEach((a, i) => lines.push(`${i + 1}. ${a.title}: ${a.body}`));
    lines.push("", l.questions);
    c.questions.forEach((q) => lines.push(`- ${q.q} ${q.a}`));
    lines.push("", fill(l.tools, { list: s.tags.map((tag) => tagLabel(tag, copy)).join(", ") }), "");
  }

  h(`## ${copy.pages.process.title}`);
  copy.process.stages.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.title}`, "", p.happens, "", fill(l.youGet, { list: p.get.join("; ") }), fill(l.needed, { text: p.need }), "");
  });
  lines.push(l.everyWeek);
  copy.process.rhythm.forEach((r) => lines.push(`- ${r.when}: ${r.what}`));
  lines.push("", l.ways);
  copy.process.engagements.forEach((e) => lines.push(`- ${e.name}. ${l.fitsWhen} ${e.fit} ${l.howItWorks} ${e.shape}`));
  lines.push("", l.agreements);
  copy.process.agreements.forEach((a) => lines.push(`- ${a.title}: ${a.body}`));

  h(`## ${l.workHeading}`);
  lines.push(fill(l.skedezIntro, { url: `<${u("/work/skedez")}>`, live: `<${skedez.url}>` }), "", copy.skedez.problem, "", l.built);
  copy.skedez.built.forEach((b) => lines.push(`- ${b.title}: ${b.body}`));
  lines.push("", l.notes);
  copy.skedez.notes.forEach((n) => lines.push(`- ${n.title}: ${n.body}`));
  lines.push("", l.plans);
  copy.skedez.pricing.forEach((p) => lines.push(`- ${p.plan}, ${p.price}: ${p.note}`));
  lines.push("", l.clientWork);

  h(`## ${copy.pages.studio.title}`);
  copy.studio.principles.forEach((p) => lines.push(`- ${p}`));
  lines.push("", `${founder.name}, ${copy.founder.role}. ${copy.founder.bio}`, "", l.projects);
  founder.projects.forEach((name, i) => lines.push(`- ${name}: ${copy.founder.projects[i]}`));
  lines.push("", fill(l.stack, { list: stack.join(", ") }));

  h(`## ${copy.pages.contact.title}`);
  lines.push(fill(l.contactLine, { url: `<${u("/contact")}>`, email: `<${site.email}>` }));
  copy.pages.contact.steps.forEach((s, i) => lines.push(`${i + 1}. ${s.title}: ${s.body}`));
  lines.push("", ...languages(locale, "llms-full.txt", l.languages), "");
  return lines.join("\n");
}
