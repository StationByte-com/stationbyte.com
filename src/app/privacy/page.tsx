import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import DataFlow from "@/components/visuals/DataFlow";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "How StationByte LLC collects, uses and protects personal data on stationbyte.com and when you contact us.",
  path: "/privacy",
  og: "privacy",
  ogAlt: "The StationByte tile mark beside the words Your data, kept small",
});

const updated = "5 November 2026";

const mail = (
  <a href={`mailto:${site.email}`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-signal">
    {site.email}
  </a>
);

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <p>
        This website is run by {site.legalName} (&ldquo;StationByte&rdquo;, &ldquo;we&rdquo;). We are the controller of the
        personal data described here. For anything about this policy or your data, write to {mail}.
      </p>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>
          <b>When you contact us.</b> If you use the{" "}
          <Link href="/contact" className="text-ink underline decoration-line underline-offset-4 hover:decoration-signal">
            project form
          </Link>{" "}
          or email us, we receive your name, email address, what you&apos;re building, a budget range if you choose one, your
          message, and anything else you decide to include.
        </p>
        <p>
          <b>When you visit.</b> Like most websites, our server records standard technical details for each request: IP
          address, browser and device type, the page requested and the time. We don&apos;t use them to identify you.
        </p>
        <p>
          <b>Cookies and tracking.</b> This site sets no cookies and uses no analytics, advertising or tracking tools. Fonts,
          images and video are served from our own server.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "Why we use it, and on what basis",
    body: (
      <ul>
        <li>
          <b>To reply and to prepare a proposal</b> you asked for: steps taken at your request before a possible contract
          (GDPR Art. 6(1)(b)).
        </li>
        <li>
          <b>To deliver a project</b> if we work together: performance of our contract (Art. 6(1)(b)).
        </li>
        <li>
          <b>To keep the site secure and working</b>, using server logs: our legitimate interest in protecting the site and
          its visitors (Art. 6(1)(f)).
        </li>
      </ul>
    ),
  },
  {
    id: "never",
    title: "What we never do",
    body: <p>We don&apos;t sell your data, share it for advertising, add you to a newsletter, or use it to train AI models.</p>,
  },
  {
    id: "share",
    title: "Who else handles it",
    body: (
      <>
        <p>
          Only the providers we need to run the site and answer you: our hosting provider, which stores server logs; our
          team chat (Slack), which receives project-form submissions; and our email provider, which stores the messages you
          send us. They process data on our instructions and may not use it for
          their own purposes.
        </p>
        <p>
          Your data may be processed outside the country where you live. Where the law requires it, we use the safeguards it
          provides, such as standard contractual clauses.
        </p>
      </>
    ),
  },
  {
    id: "keep",
    title: "How long we keep it",
    body: (
      <ul>
        <li>Enquiries that don&apos;t lead to a project: deleted within 12 months of our last message.</li>
        <li>Client correspondence: for as long as the work and any legal record-keeping duties require.</li>
        <li>Server logs: only as long as needed to keep the site secure, then deleted.</li>
      </ul>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>
          You can ask us to access, correct, delete or export your data, to restrict how we use it, or object to our use of
          it. Email {mail} and we&apos;ll answer within one month. We may need to confirm it&apos;s you before acting.
        </p>
        <p>
          If you&apos;re in the EU, the UK or another country with data-protection law, you can also complain to your local
          data-protection authority. We&apos;d appreciate the chance to fix it first.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: <p>The site is served only over HTTPS, and access to messages and servers is limited to the people who need it.</p>,
  },
  {
    id: "children",
    title: "Children",
    body: <p>This site is for businesses. It isn&apos;t aimed at children, and we don&apos;t knowingly collect their data.</p>,
  },
  {
    id: "changes",
    title: "Changes",
    body: <p>If we change how we handle data, we&apos;ll update this page and the date at the top.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <main id="main">
      <PageHero
        current="Privacy"
        eyebrow={`Privacy policy · Updated ${updated}`}
        title={["Your data,", "kept small."]}
        lede="We collect only what we need to reply to you and to run this site. No cookies, no analytics, no tracking."
        visual={<DataFlow />}
      />

      <section className="shell grid gap-12 pb-28 md:pb-32 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
        <nav aria-label="On this page" className="hidden lg:block">
          <ol className="sticky top-28 flex flex-col gap-2.5 border-l border-line pl-5 text-[15px]">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-steel transition-colors hover:text-ink">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex max-w-[720px] flex-col border-t border-ink">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-line py-10">
              <h2 className="mb-5 flex items-baseline gap-4 text-[clamp(24px,2.4vw,32px)] font-semibold tracking-[-0.035em]">
                <span className="font-mono text-[13px] font-medium tracking-normal text-steel">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="flex flex-col gap-4 text-steel [&_b]:font-medium [&_b]:text-ink [&_li]:flex [&_li]:gap-3 [&_li]:before:mt-[0.6em] [&_li]:before:size-2 [&_li]:before:shrink-0 [&_li]:before:rounded-[2px] [&_li]:before:bg-ink [&_li]:before:content-[''] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
