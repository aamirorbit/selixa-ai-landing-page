import type { AgentSlug } from "@/lib/content/agents";
import { INTEGRATIONS } from "@/lib/content/integrations";
import { USE_CASES } from "@/lib/content/use-cases";

/** The canonical origin. Used for metadataBase, the sitemap and robots.txt. */
export const SITE_URL = "https://selixa.ai";

/**
 * Agents whose /agents/<slug> page exists: the single list. The sitemap, the hub's cards,
 * the header menu, the footer and every Related section all follow it. Add a slug only in
 * the same change that adds app/agents/<slug>/page.tsx.
 */
export const LIVE_AGENT_PAGES = ["meeting", "research", "analyst", "product", "roadmap", "execution"] as const satisfies readonly AgentSlug[];

type Route = { path: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number };

/** Public routes that exist today, for app/sitemap.ts. Never list a route before it exists. */
export const SITE_ROUTES: Route[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/agents", changeFrequency: "monthly", priority: 0.9 },
  ...LIVE_AGENT_PAGES.map((slug): Route => ({ path: `/agents/${slug}`, changeFrequency: "monthly", priority: 0.8 })),
  { path: "/integrations", changeFrequency: "monthly", priority: 0.8 },
  // Every tool page is generated from the same list (app/integrations/[slug], generateStaticParams).
  ...INTEGRATIONS.map((i): Route => ({ path: `/integrations/${i.slug}`, changeFrequency: "monthly", priority: 0.6 })),
  { path: "/use-cases", changeFrequency: "monthly", priority: 0.8 },
  // Every use-case page is generated from the same list (app/use-cases/[slug], generateStaticParams).
  ...USE_CASES.map((u): Route => ({ path: `/use-cases/${u.slug}`, changeFrequency: "monthly", priority: 0.6 })),
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/get-started", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/security", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
];

/** Per-page metadata in one shape: title, description, canonical path, Open Graph and Twitter. */
export function pageMetadata(m: { title: string; description: string; ogTitle: string; ogDescription: string; path: string }) {
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: m.path },
    openGraph: { title: m.ogTitle, description: m.ogDescription, url: m.path, siteName: "Selixa", type: "website" as const },
    twitter: { card: "summary_large_image" as const, title: m.ogTitle, description: m.ogDescription },
  };
}

/** "https://www.Acme.com/pricing" → "acme.com". Empty if it doesn't look like a site. Shared by the
    site CTA, /get-started and the onboarding server action. */
export function toDomain(input: string) {
  const raw = input.trim().toLowerCase();
  if (!raw) return "";
  try {
    const host = new URL(raw.includes("://") ? raw : `https://${raw}`).hostname.replace(/^www\./, "");
    return host.includes(".") ? host : "";
  } catch {
    return "";
  }
}
