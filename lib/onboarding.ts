// Options for /get-started (the interview), shared by the page, the server action (allowlists)
// and /admin (labels). Labels from docs/pages/get-started.copy.md; keys are stable (stored).

import { LOGOS } from "@/components/landing/logos";

const kebab = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

/** The 11 tools in logos.ts order, then "Something else". */
export const TOOL_OPTIONS = [...LOGOS.map((l) => ({ slug: kebab(l.name), name: l.name })), { slug: "other", name: "Something else" }];
export const TOOL_SLUGS = new Set(TOOL_OPTIONS.map((t) => t.slug));

export const PAIN_OPTIONS = [
  { key: "priorities", label: "Priorities" },
  { key: "meeting-follow-up", label: "Meeting follow-up" },
  { key: "customer-feedback", label: "Customer feedback" },
  { key: "roadmap-drift", label: "Roadmap drift" },
  { key: "lost-decisions", label: "Lost decisions" },
  { key: "scattered-docs", label: "Scattered docs" },
  { key: "unread-metrics", label: "Metrics nobody reads" },
  { key: "specs-and-tickets", label: "Specs and tickets" },
] as const;
export const PAIN_KEYS = new Set<string>(PAIN_OPTIONS.map((p) => p.key));

export const ROLE_OPTIONS = [
  { key: "founder", label: "Founder" },
  { key: "product-manager", label: "Product manager" },
  { key: "engineering", label: "Engineering" },
  { key: "design", label: "Design" },
  { key: "other", label: "Other" },
] as const;
export const ROLE_KEYS = new Set<string>(ROLE_OPTIONS.map((r) => r.key));

export const painLabel = (key: string) => PAIN_OPTIONS.find((p) => p.key === key)?.label ?? key;
export const roleLabel = (key: string) => ROLE_OPTIONS.find((r) => r.key === key)?.label ?? key;
/** "slack" → the Slack logo; "other:Figma" / "other" → null. */
export const toolLogo = (slug: string) => LOGOS.find((l) => kebab(l.name) === slug) ?? null;

/** Where an inquiry came from. */
export const SOURCES = { modal: "selixa.ai/landing", contact: "selixa.ai/contact", "get-started": "selixa.ai/get-started" } as const;
export type SourceKey = keyof typeof SOURCES;
/** "selixa.ai/contact" → "contact" (older rows: the landing tag → "modal"). */
export const sourceTag = (source: string) => (Object.entries(SOURCES).find(([, v]) => v === source)?.[0] ?? (source ? "modal" : "")) as SourceKey | "";
