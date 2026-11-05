import { site } from "./site";

export const kinds = ["AI feature", "SaaS platform", "Web or mobile app", "Product design", "Not sure yet"];

export const budgets = ["Under $15k", "$15k–$50k", "$50k–$150k", "Over $150k", "Not sure yet"];

export const nextSteps = [
  { title: "We reply", body: `${site.replyTime[0].toUpperCase()}${site.replyTime.slice(1)}, with questions or a time to talk.` },
  { title: "We talk", body: "A call about what you're building, where it stands and what done looks like." },
  { title: "You get a proposal", body: "In writing: scope, timeline and price. Usually a discovery sprint first." },
];

type Field = "name" | "email" | "kind" | "budget" | "message";

export type ContactState = {
  status: "idle" | "sent" | "error" | "unconfigured" | "failed" | "limited";
  errors?: Partial<Record<Field, string>>;
  values?: Partial<Record<Field, string>>;
  /** A prefilled email to fall back on when the form can't send. */
  mailto?: string;
};
