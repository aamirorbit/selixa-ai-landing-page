import { AGENTS } from "@/lib/content/agents";
import { INTEGRATIONS } from "@/lib/content/integrations";
import { USE_CASES } from "@/lib/content/use-cases";
import { AGENT_PATH, PRODUCT_HUB, SITE_URL } from "@/lib/site";

/*
 * What Selixa is, in words search engines and AI assistants can quote: one source for the
 * structured data (JSON-LD) on every page and for /llms.txt and /llms-full.txt. Only facts
 * the site itself states; no ratings, prices, customers or dates that aren't real.
 */

export const BRAND = {
  name: "Selixa",
  tagline: "Product intelligence",
  /** One sentence: what it is. Leads llms.txt and the Organization/SoftwareApplication description. */
  summary:
    "Selixa is product intelligence for founders and product teams: it connects customer feedback, product data, team conversations and engineering work, so you know what matters and what to build next.",
  /** A self-contained paragraph an assistant can cite whole. */
  about:
    "Selixa is an AI Product Manager for founders and product teams. Product context is scattered across meetings, Slack threads, docs, support tickets, analytics and trackers, so decisions get lost and work drifts. Selixa brings it into one place per product. It joins product meetings and captures decisions, action items and open questions; reads customer calls, feedback and competitor notes into a research brief; explains why metrics moved; weighs the evidence and recommends what to build next with sources cited; keeps the roadmap current as decisions change; and turns decisions into tasks with owners in Linear, Jira, ClickUp or GitHub, following up until the work ships. Each product keeps its own isolated context, so nothing is shared between products.",
  logo: `${SITE_URL}/brand/logo.png`,
} as const;

/** The six areas of Selixa's work, with their public URLs, in hand-off order. */
export const AREAS = AGENTS.map((a) => ({
  name: a.name,
  line: a.line,
  description: a.description,
  url: `${SITE_URL}${PRODUCT_HUB}/${AGENT_PATH[a.slug]}`,
}));

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const APP_ID = `${SITE_URL}/#software`;

/** Sitewide: who publishes the site, and the site itself. */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: BRAND.name,
      url: SITE_URL,
      logo: BRAND.logo,
      description: BRAND.summary,
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      name: BRAND.name,
      url: SITE_URL,
      description: BRAND.summary,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
  ],
};

/** Home: the product itself, and what it does. */
export const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": APP_ID,
  name: BRAND.name,
  alternateName: `${BRAND.name}, ${BRAND.tagline}`,
  url: SITE_URL,
  description: BRAND.about,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "AI product management",
  operatingSystem: "Web",
  publisher: { "@id": ORG_ID },
  featureList: AREAS.map((a) => `${a.name}: ${a.line}`),
  audience: { "@type": "Audience", audienceType: "Founders and product teams" },
};

/** A page's trail from home, e.g. Home › Product › Meetings. The last item is the page itself. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.path === "/" ? SITE_URL : `${SITE_URL}${t.path}`,
    })),
  };
}

// ---------------------------------------------------------------------------
// llms.txt (https://llmstxt.org): a map of the site for AI assistants
// ---------------------------------------------------------------------------

const link = (title: string, path: string, note?: string) => `- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;

/** /llms.txt: short, links first. */
export function llmsTxt() {
  return [
    `# ${BRAND.name}`,
    "",
    `> ${BRAND.summary}`,
    "",
    BRAND.about,
    "",
    "## Product",
    "",
    link("Product overview", PRODUCT_HUB, "The six areas of Selixa's work, following one piece of work from a meeting to shipped tasks."),
    ...AREAS.map((a) => `- [${a.name}](${a.url}): ${a.line}`),
    "",
    "## Integrations",
    "",
    link("All integrations", "/integrations", "Tools Selixa reads from and writes back to."),
    ...INTEGRATIONS.map((i) => link(i.name, `/integrations/${i.slug}`, i.job)),
    "",
    "## Use cases",
    "",
    link("All use cases", "/use-cases", "Who uses Selixa, by role."),
    ...USE_CASES.map((u) => link(u.title, `/use-cases/${u.slug}`, u.line)),
    "",
    "## Company",
    "",
    link("About", "/about", "Why Selixa exists."),
    link("Security", "/security", "Every product is a sealed context; nothing is shared across products."),
    link("Get started", "/get-started", "Tell Selixa about your product."),
    link("Contact", "/contact"),
    "",
    "## Optional",
    "",
    link("Full text for AI assistants", "/llms-full.txt", "Every product area, integration and use case in one file."),
    "",
  ].join("\n");
}

/** /llms-full.txt: the same map with each page's substance inline, for assistants that read one file. */
export function llmsFullTxt() {
  const section = (title: string, lines: string[]) => [`## ${title}`, "", ...lines, ""];
  return [
    `# ${BRAND.name} — ${BRAND.tagline}`,
    "",
    `> ${BRAND.summary}`,
    "",
    BRAND.about,
    "",
    `Website: ${SITE_URL}`,
    "",
    ...section(
      "What Selixa does",
      AREAS.flatMap((a) => [`### ${a.name}`, "", `${a.description}`, "", `More: ${a.url}`, ""]),
    ),
    ...section(
      "How product context stays separate",
      [
        "Selixa supports multiple products, and each product has its own isolated context: its own meetings, docs, decisions, memory and connected tools. Selixa works inside one product's context at a time, and nothing is shared between products.",
        "",
        `More: ${SITE_URL}/security`,
      ],
    ),
    ...section(
      "Integrations",
      INTEGRATIONS.flatMap((i) => [
        `### ${i.name}`,
        "",
        i.metaDescription,
        "",
        `Reads: ${i.reads.join("; ")}.`,
        `Writes back: ${i.writes.join("; ")}.`,
        "",
        `More: ${SITE_URL}/integrations/${i.slug}`,
        "",
      ]),
    ),
    ...section(
      "Who it's for",
      USE_CASES.flatMap((u) => [`### ${u.title}`, "", `${u.line} ${u.pain}`, "", `More: ${SITE_URL}/use-cases/${u.slug}`, ""]),
    ),
    ...section("Getting started", [`Share your product's website at ${SITE_URL}/get-started and the Selixa team sets you up.`]),
  ].join("\n");
}
