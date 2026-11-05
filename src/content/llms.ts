import { agreements, engagements, founder, principles, process, rhythm, site, stack } from "./site";
import { services } from "./services";
import { skedez } from "./work";
import { nextSteps } from "./contact";

/**
 * Markdown for language models (llmstxt.org): a short index at /llms.txt and the full site text at
 * /llms-full.txt. Built from the same content modules as the pages, so the two never drift apart.
 */
const u = (path: string) => `${site.url}${path}`;

const header = [
  `# ${site.name}`,
  "",
  `> ${site.description}`,
  "",
  `${site.legalName} is a small software studio founded by ${founder.name}. It designs, builds and runs AI features, SaaS platforms, and web and mobile apps for founders and growing teams, and runs its own product, SkedEz (online booking for service businesses). Contact: ${site.email}. It replies ${site.replyTime}.`,
];

export function llmsIndex() {
  return [
    ...header,
    "",
    "## Pages",
    `- [Home](${u("/")}): what the studio does, selected work, services, process, studio and contact.`,
    `- [Work](${u("/work")}): SkedEz, the studio's own product, and how to see work close to yours.`,
    `- [SkedEz case study](${u("/work/skedez")}): problem, what was built, how it is engineered, stack and live plans.`,
    `- [Services](${u("/services")}): the four services and what each delivers.`,
    ...services.map((s) => `- [${s.title}](${u(`/services/${s.slug}`)}): ${s.description}`),
    `- [Process](${u("/process")}): discover, design, build, operate; the weekly rhythm; ways to engage; working agreements.`,
    `- [Studio](${u("/studio")}): how the studio works and who it is.`,
    `- [Start a project](${u("/contact")}): the project form and email address.`,
    "",
    "## Optional",
    `- [Full text for language models](${u("/llms-full.txt")})`,
    `- [Privacy policy](${u("/privacy")})`,
    `- [Sitemap](${u("/sitemap.xml")})`,
    "",
  ].join("\n");
}

export function llmsFull() {
  const lines: string[] = [...header, ""];
  const h = (t: string) => lines.push("", t, "");

  h("## Services");
  for (const s of services) {
    lines.push(`### ${s.title}`, "", `URL: ${u(`/services/${s.slug}`)}`, "", s.problem, "", "What you get:");
    s.deliverables.forEach((d) => lines.push(`- ${d.title}: ${d.body}`));
    lines.push("", "How it is approached:");
    s.approach.forEach((a, i) => lines.push(`${i + 1}. ${a.title}: ${a.body}`));
    lines.push("", "Questions buyers ask:");
    s.questions.forEach((q) => lines.push(`- ${q.q} ${q.a}`));
    lines.push("", `Tools: ${s.tags.join(", ")}.`, "");
  }

  h("## Process");
  process.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.title}`, "", p.happens, "", `You get: ${p.get.join("; ")}.`, `Needed from you: ${p.need}`, "");
  });
  lines.push("Every week:");
  rhythm.forEach((r) => lines.push(`- ${r.when}: ${r.what}`));
  lines.push("", "Ways to work together:");
  engagements.forEach((e) => lines.push(`- ${e.name}. Fits when: ${e.fit} How it works: ${e.shape}`));
  lines.push("", "Working agreements:");
  agreements.forEach((a) => lines.push(`- ${a.title}: ${a.body}`));

  h("## Work: SkedEz case study");
  lines.push(`URL: ${u("/work/skedez")}. Live at ${skedez.url}. SkedEz is the studio's own product, not client work.`, "", skedez.problem, "", "What was built:");
  skedez.built.forEach((b) => lines.push(`- ${b.title}: ${b.body}`));
  lines.push("", "Engineering notes:");
  skedez.notes.forEach((n) => lines.push(`- ${n.title}: ${n.body}`));
  lines.push("", "Plans (as published on skedez.com):");
  skedez.pricing.forEach((p) => lines.push(`- ${p.plan}, ${p.price}: ${p.note}`));
  lines.push("", "For client work, the studio walks prospective clients through the closest projects on a call.");

  h("## Studio");
  principles.forEach((p) => lines.push(`- ${p}`));
  lines.push("", `${founder.name}, ${founder.role}. ${founder.bio}`, "", "Projects Pablo led, built or worked on (from pabloitalo.com):");
  founder.projects.forEach((p) => lines.push(`- ${p.name}: ${p.note}`));
  lines.push("", `Tools the studio ships with: ${stack.join(", ")}.`);

  h("## Start a project");
  lines.push(`Use the form at ${u("/contact")} or email ${site.email}.`);
  nextSteps.forEach((s, i) => lines.push(`${i + 1}. ${s.title}: ${s.body}`));
  lines.push("");
  return lines.join("\n");
}
