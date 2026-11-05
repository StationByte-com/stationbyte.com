export { services } from "./services";

/** Facts that are the same in every language. All prose lives in messages/<locale>.json. */
export const site = {
  name: "StationByte",
  legalName: "StationByte LLC",
  url: "https://stationbyte.com",
  email: "contact@stationbyte.com",
};

/** Main navigation: hrefs here, labels in messages `nav`. */
export const nav = [
  { href: "/work", key: "work" },
  { href: "/services", key: "services" },
  { href: "/process", key: "process" },
  { href: "/studio", key: "studio" },
] as const;

export const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Python",
  "OpenAI",
  "Anthropic",
  "AWS",
  "Docker",
  "React Native",
  "Expo",
  "Stripe",
];

export const founder = {
  name: "Pablo Italo",
  // From pabloitalo.com; these are Pablo's projects, so they're attributed to him rather than to the studio.
  // Labels are in messages `founder.stats`, in the same order.
  stats: [
    { value: 30, suffix: "+" },
    { value: 20000, suffix: "+" },
    { value: 1200, suffix: "+" },
  ],
  // Notes are in messages `founder.projects`, in the same order.
  projects: ["Iluy.ai", "Climate4Buildings", "AorForms", "ElevateAB"],
  links: [
    { label: "pabloitalo.com", href: "https://pabloitalo.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pablo-italo/" },
    { label: "GitHub", href: "https://github.com/pabloitaloac" },
  ],
};
