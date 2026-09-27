import type { BrandLogo } from "@/components/landing/logos";
import { LOGOS } from "@/components/landing/logos";
import type { Integration, IntegrationSlug } from "@/lib/content/integrations";

/**
 * Presentation per tool: the hero wash colour and its strength per scheme. Colour channels
 * are the brands' own (not Selixa UI colours). "ink" = a near-black brand (Notion, GitHub,
 * PostHog): the wash becomes a neutral spotlight built from --ink-rgb. Owner decisions: Slack
 * uses its blue; PostHog stays neutral.
 */
export type ToolLook = { rgb: string | "ink"; aDark: number; aLight: number };

export const TOOL_LOOK: Record<IntegrationSlug, ToolLook> = {
  slack: { rgb: "54 197 240", aDark: 0.22, aLight: 0.14 },
  notion: { rgb: "ink", aDark: 0.1, aLight: 0.06 },
  "google-drive": { rgb: "66 133 244", aDark: 0.24, aLight: 0.13 },
  linear: { rgb: "94 106 210", aDark: 0.3, aLight: 0.14 },
  jira: { rgb: "0 82 204", aDark: 0.34, aLight: 0.13 },
  github: { rgb: "ink", aDark: 0.1, aLight: 0.06 },
  zoom: { rgb: "11 92 255", aDark: 0.3, aLight: 0.13 },
  "google-meet": { rgb: "0 137 123", aDark: 0.3, aLight: 0.14 },
  intercom: { rgb: "106 253 239", aDark: 0.16, aLight: 0.18 },
  posthog: { rgb: "ink", aDark: 0.1, aLight: 0.06 },
  mixpanel: { rgb: "120 86 255", aDark: 0.26, aLight: 0.13 },
};

/** The tool's mark, joined by name. */
export const logoOf = (i: Pick<Integration, "name">): BrandLogo => LOGOS.find((l) => l.name === i.name)!;
