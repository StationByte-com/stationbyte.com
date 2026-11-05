export type Service = {
  slug: string;
  title: string;
  /** One line for cards and the homepage list. */
  body: string;
  tags: string[];
  /** Search title and description: unique per page. */
  metaTitle: string;
  description: string;
  headline: [string, string];
  /** Path-traced still: frame 1 of `loop`, for social cards and the sitemap. */
  image: { src: string; alt: string };
  /** Seamless 3D loop in public/video/loops (scripts/hero-film/scenes.py). */
  loop: string;
  /** Heading for the "how it works" diagram. */
  diagram: [string, string];
  /** The problem, in the buyer's words. */
  problem: string;
  deliverables: { title: string; body: string }[];
  approach: { title: string; body: string }[];
  proof: { label: string; body: string; href: string; cta: string };
  questions: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "ai-product-engineering",
    loop: "ai",
    image: { src: "/images/services/ai.webp", alt: "Glass and graphite tiles in a grid around a brightly glowing blue core tile" },
    diagram: ["How a feature", "earns its release."],
    title: "AI product engineering",
    body: "LLM features, agents, retrieval and automations designed around real user tasks, with cost, latency and evaluation measured from the first release.",
    tags: ["OpenAI", "Anthropic", "RAG", "Agents", "Evals"],
    metaTitle: "AI product engineering",
    description:
      "LLM features, agents, retrieval and automations built into your product, with evaluation, cost and latency measured from the first release.",
    headline: ["AI features your", "customers rely on."],
    problem:
      "Most AI features stall between a good demo and something customers trust. What closes the gap is rarely the model: it's an evaluation set, cost and latency budgets, permissions, fallbacks and monitoring.",
    deliverables: [
      { title: "LLM features in your product", body: "Assistants, search, drafting, extraction and classification, built into the screens people already use." },
      { title: "Agents and automations", body: "Workflows that call your APIs and tools, with approval steps where a mistake would be expensive." },
      { title: "Retrieval over your data", body: "Answers grounded in your documents and database, with sources shown and access rules respected." },
      { title: "Evaluation suites", body: "Real examples, scored automatically on every change, so quality is measured before a release, not after." },
      { title: "Cost and latency budgets", body: "Model routing, caching and limits per task, with spend and response time tracked in production." },
      { title: "Guardrails", body: "Content filters, personal-data handling and audit logs, designed in from the start." },
    ],
    approach: [
      { title: "Start from a task", body: "We pick one job a user does today and define what a good result looks like before choosing a model." },
      { title: "Build the eval set first", body: "Examples from real use become the test suite every prompt and model change has to pass." },
      { title: "Ship to a small group", body: "The feature goes out behind a flag, with feedback and outputs logged from day one." },
      { title: "Measure, then widen", body: "Quality, cost per task and latency decide when it reaches everyone." },
    ],
    proof: {
      label: "From our founder's work",
      body: "Our founder, Pablo Italo, built a controlled AI assistant for Iluy.ai with model routing, content filters and access across several channels.",
      href: "/studio",
      cta: "About the studio",
    },
    questions: [
      { q: "Which model should we use?", a: "Usually more than one. We choose per task on measured quality, cost and latency, and keep the choice swappable so a better or cheaper model is a configuration change, not a rewrite." },
      { q: "Will our data be used to train models?", a: "We build on the providers' business APIs, which don't train on your data by default. When data can't leave your infrastructure, we design for self-hosted models." },
      { q: "How do we know it works?", a: "An evaluation set built from real examples, scored on every change, plus monitoring and review of live outputs once it ships." },
    ],
  },
  {
    slug: "saas-platforms",
    loop: "saas",
    image: { src: "/images/services/saas.webp", alt: "Three layers of glass and graphite tiles stacked above each other, a blue tile glowing in the middle layer" },
    diagram: ["One request,", "every layer."],
    title: "SaaS platforms",
    body: "Multi-tenant apps, dashboards, billing, APIs and the cloud infrastructure underneath them, built to grow without a rewrite.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    metaTitle: "SaaS platform development",
    description:
      "Multi-tenant SaaS apps with accounts, teams, billing, APIs and admin tools, on cloud infrastructure built to grow without a rewrite.",
    headline: ["SaaS that grows", "without a rewrite."],
    problem:
      "A SaaS product is the feature customers see plus a lot they don't: accounts, teams, roles, billing, emails, admin tools, backups. Getting those foundations right early is what lets the product grow without starting over.",
    deliverables: [
      { title: "Accounts, teams and roles", body: "Multi-tenant data model, sign-in with email or Google, invitations and permissions." },
      { title: "Subscriptions and billing", body: "Plans, trials, upgrades, failed payments and invoices on Stripe, tested end to end." },
      { title: "APIs and integrations", body: "Public APIs, webhooks and connections to the tools your customers use, from calendars to WhatsApp." },
      { title: "Dashboards and admin", body: "Reporting for your customers and internal tools for support, so your team doesn't need a developer to help a user." },
      { title: "Infrastructure", body: "Containers, CI/CD, staging, backups and monitoring on AWS or the provider you already use." },
      { title: "Security basics, done", body: "Least-privilege access, secrets management, audit trails, and data export and deletion for your users." },
    ],
    approach: [
      { title: "Data model first", body: "Tenancy, permissions and billing shape everything else, so we design them before the first screen." },
      { title: "One deployable app", body: "A well-structured monolith ships faster and is easier to run. Services split out only when load or teams demand it." },
      { title: "Staging from week one", body: "Every change runs in a production-like environment you can open and try." },
      { title: "Observability before launch", body: "Errors, logs and key metrics are wired up before real customers arrive." },
    ],
    proof: {
      label: "Case study",
      body: "SkedEz, our own booking platform: multi-tenant accounts and teams, Stripe subscriptions, Google Calendar and WhatsApp integrations, in production.",
      href: "/work/skedez",
      cta: "Read the SkedEz case study",
    },
    questions: [
      { q: "How do you avoid a rewrite later?", a: "By getting tenancy, permissions and billing right first, keeping the codebase modular, and adding complexity such as queues or separate services only when there's a measured need." },
      { q: "Which cloud do you use?", a: "AWS or the provider you already use. Everything runs in containers, so the product isn't tied to one host." },
      { q: "What does billing actually involve?", a: "Plans, trials, upgrades and downgrades, failed payments and retries, invoices and taxes, plus the webhooks that keep your database in step with Stripe. We test those paths end to end." },
    ],
  },
  {
    slug: "web-and-mobile-apps",
    loop: "apps",
    image: { src: "/images/services/apps.webp", alt: "A wide frosted glass slab and a tall glass slab, each holding tiles, one blue tile in each" },
    diagram: ["Two surfaces,", "one core."],
    title: "Web and mobile apps",
    body: "Fast websites, web apps, and iOS and Android apps, sharing one codebase where it makes sense and going native where it doesn't.",
    tags: ["React", "Next.js", "React Native", "Expo"],
    metaTitle: "Web and mobile app development",
    description:
      "Websites, web apps and iOS and Android apps, sharing one codebase where it helps and going native where it matters.",
    headline: ["On the web and", "in every pocket."],
    problem:
      "You need the product on the web and on phones, without paying to build and maintain it three times, and without an app that feels like a website in a frame.",
    deliverables: [
      { title: "Websites and web apps", body: "Fast, accessible and easy to find in search, built with Next.js and React." },
      { title: "iOS and Android from one codebase", body: "React Native with Expo, so most features ship to both platforms at once." },
      { title: "Native where it matters", body: "Native modules for camera, sensors, widgets or anything performance-critical." },
      { title: "Sign-in, payments, notifications", body: "Google and Apple sign-in, in-app purchases and subscriptions, push notifications." },
      { title: "Store release", body: "App Store and Google Play builds, listings and over-the-air updates for fixes between releases." },
      { title: "Performance and accessibility", body: "Fast first load, smooth scrolling, screen-reader labels and touch targets that fit a thumb." },
    ],
    approach: [
      { title: "Share what helps", body: "Business logic, design system and most screens are shared; platform conventions are respected." },
      { title: "Go native when needed", body: "When a shared approach would compromise the experience, that part is written natively." },
      { title: "Release pipeline early", body: "Builds, test devices and update channels are set up in the first weeks, not the last." },
      { title: "Test on real devices", body: "Every release is checked on real phones, not only in simulators." },
    ],
    proof: {
      label: "Case study",
      body: "SkedEz's app is one cross-platform codebase, built for the web first and ready for the app stores, alongside a Next.js marketing site.",
      href: "/work/skedez",
      cta: "Read the SkedEz case study",
    },
    questions: [
      { q: "Native or cross-platform?", a: "Cross-platform for most products, because one codebase is faster to build and cheaper to maintain. Native for apps that live on device features or need the last bit of performance. Often it's a mix." },
      { q: "Do you handle the app store release?", a: "Yes: builds, signing, store listings and review submissions, set up under your own developer accounts." },
      { q: "Can the website and the app share code?", a: "Yes. Types, API clients, validation and the design tokens are shared, so a change lands everywhere at once." },
    ],
  },
  {
    slug: "product-design",
    loop: "design",
    image: { src: "/images/services/design.webp", alt: "Glass, frosted and graphite tiles floating apart at different heights, one glowing blue" },
    diagram: ["From flow", "to finished screen."],
    title: "Product design",
    body: "Research, flows, interface design and design systems, done by the people who build them, so nothing gets lost in handoff.",
    tags: ["Figma", "Prototyping", "Design systems"],
    metaTitle: "Product design",
    description:
      "Research, user flows, interface design and design systems, by the people who also build them, so nothing gets lost in handoff.",
    headline: ["Designed by the people", "who build it."],
    problem:
      "Designs that look right in a file and break in code cost twice. When the people who design the product also build it, the handoff, and most of what gets lost in it, disappears.",
    deliverables: [
      { title: "Research", body: "Interviews and reviews of how people work today, turned into a short list of problems worth solving." },
      { title: "Flows and wireframes", body: "The path through each task, agreed before anyone argues about colours." },
      { title: "Clickable prototypes", body: "Something you can tap through and put in front of users before code is written." },
      { title: "Interface design", body: "Every screen and state, including empty, loading and error, at phone and desktop sizes." },
      { title: "Design systems", body: "Tokens, components and guidelines kept in step in Figma and in code." },
      { title: "Brand for products", body: "Logos, colour, type and motion that work inside an interface, like this site's." },
    ],
    approach: [
      { title: "Map the task", body: "Who uses it, what they're trying to get done, and where it goes wrong today." },
      { title: "Prototype before code", body: "Flows are clicked through and tested while changes are still cheap." },
      { title: "Finish details in the browser", body: "Spacing, motion and responsive behaviour are tuned in the real thing." },
      { title: "One system", body: "Design tokens drive both Figma and the codebase, so they don't drift apart." },
    ],
    proof: {
      label: "Our own work",
      body: "The StationByte brand, this website and its motion system were designed and built in-house, from the logo grid to the glass film in the hero.",
      href: "/work",
      cta: "See our work",
    },
    questions: [
      { q: "Can you work from our existing brand?", a: "Yes. We extend what you have into a product design system, and only suggest changes where the brand doesn't hold up on screen." },
      { q: "Do we get the design files?", a: "Yes. Figma files, components and tokens are handed over with the code, in your accounts." },
      { q: "Do you test with real users?", a: "Yes, with prototypes before build and with the live product after. A handful of sessions catches most of the problems that matter." },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
