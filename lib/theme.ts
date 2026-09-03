/**
 * Accent themes. The palettes themselves live in `app/globals.css` under
 * `[data-theme="…"]`; this is the list the app renders and picks from.
 *
 * To change the theme the site ships with, set NEXT_PUBLIC_SITE_THEME
 * (`.env.local` locally, project settings on Vercel) and restart/redeploy.
 */
export const THEMES = [
  { id: "violet", label: "Violet", swatch: "#8b5cf6" },
  { id: "dracula", label: "Dracula red", swatch: "#ff5555" },
  { id: "blue", label: "Blue", swatch: "#3b82f6" },
  { id: "cyan", label: "Cyan", swatch: "#22d3ee" },
  { id: "lime", label: "Lime", swatch: "#a3e635" },
  { id: "amber", label: "Amber", swatch: "#f59e0b" },
  { id: "rose", label: "Rose", swatch: "#f43f5e" },
  { id: "emerald", label: "Emerald", swatch: "#10b981" },
  { id: "mono", label: "Mono", swatch: "linear-gradient(135deg, #f7f7f9 50%, #43434c 50%)" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "mono";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEMES.some((t) => t.id === value);
}

const configured = process.env.NEXT_PUBLIC_SITE_THEME;

/** The theme the site ships with. Falls back to mono for an unset or unknown name. */
export const ACTIVE_THEME: ThemeId = isThemeId(configured) ? configured : DEFAULT_THEME;
