import { ChartLine, Compass, ListChecks, Map as MapIcon, Telescope, Video, type LucideIcon } from "lucide-react";
import type { Agent, AgentIcon, AgentSlug } from "@/lib/content/agents";
import { AGENT_PATH, LIVE_AGENT_PAGES, PRODUCT_HUB } from "@/lib/site";

/** `agent.icon` (a lucide name in lib/content/agents.ts) → the icon component. */
export const AGENT_ICONS: Record<AgentIcon, LucideIcon> = {
  Video,
  Telescope,
  ChartLine,
  Compass,
  Map: MapIcon,
  ListChecks,
};

/** Strips a trailing " Agent" (agents-era names, "Meeting Agent" → "Meeting"); a no-op on today's names. */
export const agentShortName = (agent: Pick<Agent, "name">) => agent.name.replace(/\s+Agent$/, "");

const LIVE: ReadonlySet<AgentSlug> = new Set<AgentSlug>(LIVE_AGENT_PAGES);

/** The agent's own page, or null if it hasn't shipped yet (see LIVE_AGENT_PAGES in lib/site.ts). */
export const agentPage = (slug: AgentSlug) => (LIVE.has(slug) ? `${PRODUCT_HUB}/${AGENT_PATH[slug]}` : null);

/**
 * Where a link to an agent goes: its page if it exists, else `fallback`
 * ("#relay" on the hub itself, "/product" everywhere else).
 */
export const agentHref = (slug: AgentSlug, fallback = "#relay") => agentPage(slug) ?? fallback;
