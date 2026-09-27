// Every visible string on /agents that isn't agent data, from docs/pages/agents-hub.copy.md.
// Agent names, lines, "produces", status and hand-offs come from lib/content/agents.ts.

export const HUB_COPY = {
  meta: {
    title: "Agents — Selixa",
    description:
      "Six AI agents that run your product work: meetings, research, analytics, priorities, roadmap and tasks. Each product keeps its own context.",
    ogTitle: "Your product team, in AI — Selixa",
    ogDescription: "One piece of work, six agents, from a meeting to 14 shipped tasks.",
  },
  hero: {
    eyebrow: "Agents",
    headline: "your product team, in AI.",
    line: "Six agents. One hand-off, from meeting to shipped.",
    scrollHint: "Follow one piece of work",
  },
  relay: {
    label: "The relay",
    headline: "one card, six hands.",
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
    label: "The team",
    headline: "meet the agents.",
    producesLabel: "Produces",
    linkText: "See how it works",
  },
  context: {
    label: "Context",
    headline: "one product’s context.",
    line: "The whole team shares it. No other product can see it.",
    active: "Atlas",
    activeTag: "Isolated",
    memory: ["Meetings", "Research", "Data", "Decisions", "Roadmap", "Tasks"],
    greyed: "Beacon",
    greyedTag: "Separate memory",
    greyedNote: "Same team. Its own context.",
  },
  cta: {
    headline: "stop building in chaos.",
    line: "Put the team on your product.",
  },
} as const;
