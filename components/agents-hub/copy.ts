// Every visible string on /product that isn't area data, from docs/pages/agents-hub.copy.md.
// Agent names, lines, "produces", status and hand-offs come from lib/content/agents.ts.

export const HUB_COPY = {
  meta: {
    title: "Product — Selixa, the AI Product Manager",
    description:
      "Selixa is one AI Product Manager for the whole job: meetings, research, analytics, priorities, roadmap and tasks. Each product keeps its own context.",
    ogTitle: "The whole job, in one AI — Selixa",
    ogDescription: "One piece of work, from a meeting to 14 shipped tasks. Selixa carries it the whole way.",
  },
  hero: {
    eyebrow: "Product",
    headline: "the whole job, in one AI.",
    line: "From the meeting to shipped tasks. Selixa carries it all the way.",
    scrollHint: "Follow one piece of work",
  },
  relay: {
    label: "The relay",
    headline: "one card, start to finish.",
    line: "Watch a problem become a plan.",
    cardLabel: "Atlas · Work item",
    cardTitle: "Onboarding is losing people",
    /** State chip by stage: New → … → Shipped. */
    states: ["New", "In review", "Prioritized", "Now", "In progress", "Shipped"],
    /** Row tag per station, in hand-off order. */
    tags: ["Decision", "Evidence", "Data", "Recommendation", "Roadmap", "Tasks"],
    competitors: ["Competitor A", "Competitor B", "Competitor C"],
    activation: "Activation −8%",
    owners: ["Sara Kim", "Dev Patel", "Maya Chen"],
    /** "{n} of 14 done": 0 when the tasks land, 14 at the Shipped beat. */
    tasksTotal: 14,
    tasksDone: "done",
    endLine: "From one meeting to 14 tasks. Nobody chased it.",
  },
  index: {
    label: "The work",
    headline: "everything it does.",
    producesLabel: "Produces",
    linkText: "See how it works",
  },
  context: {
    label: "Context",
    headline: "one product’s context.",
    line: "Selixa works inside it. No other product can see it.",
    active: "Atlas",
    activeTag: "Isolated",
    memory: ["Meetings", "Research", "Data", "Decisions", "Roadmap", "Tasks"],
    greyed: "Beacon",
    greyedTag: "Separate memory",
    greyedNote: "Same Selixa. Its own context.",
  },
  cta: {
    headline: "stop building in chaos.",
    line: "Put Selixa on your product.",
  },
} as const;
