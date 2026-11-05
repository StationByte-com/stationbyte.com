/** The four services. Everything a visitor reads is in messages `services.<slug>`; this is what stays the same in every language. */
export const services = [
  { slug: "ai-product-engineering", loop: "ai", image: "/images/services/ai.webp", tags: ["OpenAI", "Anthropic", "RAG", "Agents", "Evals"], proofHref: "/studio" },
  { slug: "saas-platforms", loop: "saas", image: "/images/services/saas.webp", tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "AWS"], proofHref: "/work/skedez" },
  { slug: "web-and-mobile-apps", loop: "apps", image: "/images/services/apps.webp", tags: ["React", "Next.js", "React Native", "Expo"], proofHref: "/work/skedez" },
  { slug: "product-design", loop: "design", image: "/images/services/design.webp", tags: ["Figma", "Prototyping", "Design systems"], proofHref: "/work" },
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

// Tags that are words rather than product names; their labels are in messages `common.tags`.
const TAG_KEYS = { Agents: "agents", Evals: "evals", Prototyping: "prototyping", "Design systems": "designSystems" } as const;

/** A tag as shown in `copy`'s language: "Agents" → "Agentes"; "Stripe" stays "Stripe". */
export const tagLabel = (tag: string, copy: { common: { tags: Record<(typeof TAG_KEYS)[keyof typeof TAG_KEYS], string> } }) =>
  tag in TAG_KEYS ? copy.common.tags[TAG_KEYS[tag as keyof typeof TAG_KEYS]] : tag;
