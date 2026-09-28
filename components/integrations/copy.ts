// Strings for /integrations and /integrations/[slug], from docs/pages/integrations-hub.copy.md and
// integrations-template.copy.md. Tool names, categories, jobs, reads/writes, demos and setup come
// from lib/content/integrations.ts. Owner decisions: no Live / Coming soon tags anywhere; the
// request tile borrows the header menu's "More on the way" / "Tell us what you use.".

export const HUB_COPY = {
  meta: {
    title: "Integrations — Selixa",
    description:
      "Connect Slack, Notion, Linear, Zoom, PostHog and more. Selixa reads them into each product's own context and writes back where your team works.",
    ogTitle: "Connect what you already use — Selixa",
    ogDescription: "Eleven tools, one product's context at a time.",
  },
  hero: {
    eyebrow: "Integrations",
    headline: "connect what you already use.",
    line: "Each tool feeds one product's context. Nothing crosses over.",
  },
  search: {
    placeholder: "Search integrations…",
    label: "Search integrations",
    hint: "⌘K",
    countMany: "{n} integrations",
    countOne: "1 integration",
    all: "All",
    emptyBefore: "No match for “",
    emptyAfter: "”.",
    emptyLink: "Request it",
    requestPrefix: "Integration request: ",
    request: { href: "#request", title: "More on the way", body: "Tell us what you use." },
  },
  flow: {
    label: "How it flows",
    headline: "one product, one context.",
    line: "What you connect to Atlas stays in Atlas.",
    tools: "Your tools",
    agents: "Selixa",
    reads: "reads →",
    writes: "← writes back",
    product: { initial: "A", name: "Atlas", tag: "Isolated" },
    context: ["Conversations", "Docs", "Meetings", "Issues", "Feedback", "Data"],
    greyed: { initial: "B", name: "Beacon", tag: "Separate context", note: "Its own tools. Its own memory." },
    summary:
      "What you connect to Atlas stays in Atlas. Your tools feed Atlas's isolated context; Selixa works there and writes back to your tools. Beacon has its own tools and its own memory.",
  },
  request: {
    label: "Request",
    headline: "don't see yours?",
    line: "Tell us what you use.",
    button: "Request an integration",
    prefix: "Integration request: ",
  },
  cta: { headline: "stop building in chaos.", line: "Start with your product's website." },
} as const;

export const TOOL_COPY = {
  eyebrow: "Integrations",
  connector: (name: string) => `${name} ↔ Selixa`,
  line: "Connected to one product. Its context stays there.",
  flow: { label: "Flow", reads: "What Selixa reads", writes: "What comes back" },
  demo: { label: (name: string) => `In ${name}`, headline: (name: string) => `see it in ${name}.` },
  permissions: {
    label: "Permissions",
    headline: "permissions and data.",
    line: (name: string) => `Everything ${name} shares goes into one product's context. No other product can see it.`,
    smallPrint: "Details on access and storage are coming soon.",
    link: "Questions? Talk to us",
    prefix: (name: string) => `Question about the ${name} integration: `,
  },
  setup: { label: "Setup", headline: "set up in 3 steps." },
  related: { label: "Related", headline: "where it's used.", cardLink: "See how it works", allLink: "All integrations" },
  cta: { headline: "stop building in chaos.", line: (name: string) => `Connect ${name} to your product.` },
  meta: {
    title: (name: string) => `${name} integration — Selixa`,
    ogTitle: (name: string) => `${name} + Selixa`,
  },
  demoLabels: { selixa: "Selixa", issueFrom: "From a decision" },
} as const;
