/** What the project form offers. Values are stable ids sent with the form; labels are in messages `contactForm`. */
export const kinds = ["ai", "saas", "apps", "design", "unsure"] as const;
export type Kind = (typeof kinds)[number];

/** Budget ranges in US dollars, written out per language with Intl (e.g. "$15K", "15 mil $", "$1.5万"). */
export const budgets = [
  { id: "lt15", to: 15_000 },
  { id: "15to50", from: 15_000, to: 50_000 },
  { id: "50to150", from: 50_000, to: 150_000 },
  { id: "gt150", from: 150_000 },
  { id: "unsure" },
] as const;
export type BudgetId = (typeof budgets)[number]["id"];

type Field = "name" | "email" | "kind" | "budget" | "message";

export type ContactState = {
  status: "idle" | "sent" | "error" | "unconfigured" | "failed" | "limited";
  errors?: Partial<Record<Field, string>>;
  values?: Partial<Record<Field, string>>;
  /** A prefilled email to fall back on when the form can't send. */
  mailto?: string;
};
