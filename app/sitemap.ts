import { existsSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { AGENT_PATH, LIVE_AGENT_PAGES, SITE_ROUTES, SITE_URL } from "@/lib/site";

/**
 * Guard against drift: while building (or in dev), fail loudly if an area is marked live
 * without its page. The sitemap is prerendered, so this never runs in production requests.
 */
function assertLivePagesExist() {
  if (process.env.NEXT_PHASE !== "phase-production-build" && process.env.NODE_ENV !== "development") return;
  const missing = LIVE_AGENT_PAGES.filter((slug) => !existsSync(join(/*turbopackIgnore: true*/ process.cwd(), "app", "product", AGENT_PATH[slug], "page.tsx")));
  if (missing.length) throw new Error(`LIVE_AGENT_PAGES lists areas without a page: ${missing.join(", ")} (lib/site.ts)`);
  // Integration and use-case pages each come from one template.
  for (const file of [
    ["app", "integrations", "page.tsx"],
    ["app", "integrations", "[slug]", "page.tsx"],
    ["app", "use-cases", "page.tsx"],
    ["app", "use-cases", "[slug]", "page.tsx"],
    ["app", "get-started", "page.tsx"],
    ["app", "about", "page.tsx"],
    ["app", "security", "page.tsx"],
    ["app", "contact", "page.tsx"],
  ]) {
    if (!existsSync(join(/*turbopackIgnore: true*/ process.cwd(), ...file))) throw new Error(`Sitemap lists pages but ${file.join("/")} is missing`);
  }
}

/** /sitemap.xml, generated from the route list in lib/site.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  assertLivePagesExist();
  return SITE_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
