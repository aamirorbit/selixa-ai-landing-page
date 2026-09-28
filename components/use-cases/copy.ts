// Strings for /use-cases and /use-cases/[slug], from docs/pages/use-cases-hub.copy.md and
// use-cases-template.copy.md. Titles, lines, pains, days, agents and tools come from
// lib/content/use-cases.ts. The role chips (label, order, default) are the hub copy's table.

export const ROLE_CHIPS: { slug: string; label: string }[] = [
  { slug: "solo-founders", label: "Solo founder" },
  { slug: "lean-startups", label: "Startup" },
  { slug: "product-managers", label: "PM" },
  { slug: "heads-of-product", label: "Head of product" },
  { slug: "engineering-leads", label: "Engineering lead" },
  { slug: "design-teams", label: "Design" },
  { slug: "customer-success", label: "Customer success" },
  { slug: "product-ops", label: "Product ops" },
  { slug: "agencies-and-studios", label: "Agencies" },
  { slug: "venture-studios", label: "Venture studios" },
  { slug: "product-led-saas", label: "Product-led SaaS" },
  { slug: "multi-product-founders", label: "Multi-product founder" },
];
export const DEFAULT_ROLE = "product-managers";

export const HUB_COPY = {
  meta: {
    title: "Use cases — Selixa",
    description:
      "How founders, product teams and the people around them use Selixa, an AI Product Manager. Pick your role and see a day with it.",
    ogTitle: "Built for people building products — Selixa",
    ogDescription: "Twelve roles, one AI product team. Every product keeps its own context.",
  },
  hero: { eyebrow: "Use cases", headline: "built for people building products.", line: "Pick your role. See your day with Selixa." },
  chipsLabel: "Choose your role",
  preview: { pain: "The pain", agents: "Where Selixa helps most", day: "A day with Selixa", link: "See the full day" },
  grid: { label: "Every role", headline: "every role, at a glance.", cardLink: "Read more" },
  cta: { headline: "stop building in chaos.", line: "Whatever your role, start with your product." },
} as const;

export const PAGE_COPY = {
  eyebrow: "Use cases",
  split: {
    without: "Without Selixa",
    with: "With Selixa",
    dragHint: "Drag to clear the chaos",
    handle: "Compare without and with Selixa",
    keyboard: "Use the arrow keys to move the divider",
    toggleWithout: "Without",
    toggleWith: "With Selixa",
  },
  timeline: { label: "The day", headline: "a day with Selixa.", line: "Four moments. What Selixa did in each.", selixa: "Selixa" },
  agents: { label: "What it does", headline: "where it helps most.", cardLink: "See how it works" },
  tools: { label: "Tools", headline: "tools you'll connect.", line: "Selixa reads them for this product only.", link: "All integrations" },
  cta: { headline: "stop building in chaos.", line: "Start with your product's website." },
} as const;
