export { services } from "./services";

export const site = {
  name: "StationByte",
  legalName: "StationByte LLC",
  url: "https://stationbyte.com",
  email: "contact@stationbyte.com",
  title: "StationByte · Software studio for AI, SaaS, web and mobile products",
  description:
    "StationByte is a software studio. We design, build and run AI features, SaaS platforms, and web and mobile apps, from first prototype to production.",
  /** Response time promised on the contact page and band. */
  replyTime: "within 48 hours",
};

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/studio", label: "Studio" },
];

export const nowBuilding = ["AI products", "SaaS platforms", "Mobile apps", "Internal tools", "Dashboards"];

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

export const process = [
  {
    title: "Discover",
    body: "We map the problem, the users and the constraints, and agree on what done looks like.",
    happens: "Conversations with you and, where possible, the people who'll use the product. We look at what exists today, the data and the systems it has to work with.",
    get: ["A written scope and success criteria", "The risks, and how we'll reduce them", "A plan and an estimate"],
    need: "Time with the decision-maker, access to existing systems and data, and a few real users to talk to.",
  },
  {
    title: "Design",
    body: "Flows and screens you can click through before we write production code.",
    happens: "User flows, then a clickable prototype of the main tasks, tested with people who'll use it. The visual design and component system follow.",
    get: ["A prototype you can tap through", "Screens for every state, phone and desktop", "A design system in Figma and code"],
    need: "Fast feedback on the prototype, ideally within a day or two of each review.",
  },
  {
    title: "Build",
    body: "Weekly releases to a staging link. You see progress in the product itself.",
    happens: "Small, reviewed changes shipped every week to a staging environment you can open at any time, with a short demo of what moved.",
    get: ["Working software every week", "A changelog in plain language", "Tests on the paths that matter"],
    need: "Someone who can say yes or no to scope questions within the week.",
  },
  {
    title: "Operate",
    body: "Launch, monitoring and iteration. We stay on after go-live.",
    happens: "Launch with monitoring and alerts in place, then fixes and the next round of improvements based on how people actually use it.",
    get: ["A launch checklist, run with you", "Monitoring, alerts and backups", "Docs and recorded walkthroughs for your team"],
    need: "A view on what to improve next, from your users and your numbers.",
  },
];

export const rhythm = [
  { when: "Start of week", what: "Agree the week's goals and anything blocking them." },
  { when: "During the week", what: "Short written updates in a shared channel; questions answered the same working day." },
  { when: "End of week", what: "A release to staging and a short demo of what changed." },
];

export const engagements = [
  {
    name: "Discovery sprint",
    fit: "You have an idea or a problem, and need a plan you can trust.",
    shape: "Fixed scope and fixed price. Ends with a written plan, a clickable prototype and an estimate for the build.",
  },
  {
    name: "Product build",
    fit: "You know what to build and need senior people to design, build and launch it.",
    shape: "Planned in milestones, each ending with working software. Priced per milestone.",
  },
  {
    name: "Ongoing support",
    fit: "Your product is live and needs steady improvement, new features or AI work.",
    shape: "A monthly arrangement with a set amount of capacity, reviewed together each month.",
  },
];

export const agreements = [
  { title: "Your accounts", body: "Code, cloud, app stores and third-party services live in accounts you own from day one." },
  { title: "Your code and designs", body: "Once invoices are paid, everything we make for you is yours: source code, Figma files, documentation." },
  { title: "Clean handover", body: "Docs, runbooks and recorded walkthroughs, whether your own team takes over or we stay on." },
];

export const principles = [
  "You work with engineers, not account managers.",
  "Small, reviewable releases every week.",
  "We stay on after launch.",
];

export const founder = {
  name: "Pablo Italo",
  role: "Founder · AI and full-stack engineer",
  bio: "Pablo is a senior AI and full-stack engineer and a hands-on tech lead and CTO. He founded StationByte to build products the way he builds his own: senior hands on the work, weekly releases, and staying on after launch.",
  // From pabloitalo.com; these are Pablo's projects, so they're attributed to him rather than to the studio.
  stats: [
    { value: 30, suffix: "+", label: "projects and production platforms" },
    { value: 20000, suffix: "+", label: "users across them" },
    { value: 1200, suffix: "+", label: "brands using ElevateAB, one of those platforms" },
  ],
  projects: [
    { name: "Iluy.ai", note: "A controlled AI assistant with model routing, content filters and multi-channel access" },
    { name: "Climate4Buildings", note: "Architecture and development for an early-stage climate and energy analysis platform" },
    { name: "AorForms", note: "A compliance-focused e-signature SaaS, from early build to production" },
    { name: "ElevateAB", note: "A Shopify experimentation platform used by 1,200+ brands" },
  ],
  links: [
    { label: "pabloitalo.com", href: "https://pabloitalo.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pablo-italo/" },
    { label: "GitHub", href: "https://github.com/pabloitaloac" },
  ],
};
