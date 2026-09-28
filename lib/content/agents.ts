// The six areas of Selixa's work, in hand-off order: each one picks up where the last left off.
// (Formerly the six agents; ids and types keep that name, see docs/archive/agents-framing.md.)
// Wording matches the home page (components/landing/Agents.tsx) and the header menu
// (components/Nav.tsx). Demo numbers are illustrative and follow the home page's story:
// onboarding friction → activation drop → prioritize onboarding → 14 tasks.

export type AgentSlug = "meeting" | "research" | "analyst" | "product" | "roadmap" | "execution";

/** lucide-react icon names; the Builder maps these to components. */
export type AgentIcon = "Video" | "Telescope" | "ChartLine" | "Compass" | "Map" | "ListChecks";

export type Agent = {
  slug: AgentSlug;
  /** Display name, e.g. "Meetings". */
  name: string;
  /** Menu blurb, six words or fewer. */
  short: string;
  /** One sentence for cards. */
  line: string;
  /** What it hands over to the next area, in a few words. */
  produces: string;
  /** What it adds to the shared work item in the /product relay. */
  handoff: string;
  /** Live-looking status for the card's corner. Illustrative. */
  status: string;
  /** Action line typed out when the card is live. Illustrative. */
  doing: string;
  icon: AgentIcon;
  /** Detail page (/product/<AGENT_PATH[slug]>) hero headline, lowercase as on the home page. */
  headline: string;
  /** Detail page meta description. */
  description: string;
  /** Agents linked in the detail page's Related section, in order. */
  related: AgentSlug[];
};

export const AGENTS: Agent[] = [
  {
    slug: "meeting",
    name: "Meetings",
    short: "Joins calls, captures decisions.",
    line: "Joins meetings, captures decisions and follow-ups.",
    produces: "Decisions and action items",
    handoff: "Decision: ship the shorter onboarding flow",
    status: "In 2 calls today",
    doing: "Captured 3 decisions from Product review",
    icon: "Video",
    headline: "it’s already in the room.",
    description:
      "Selixa joins your product meetings, captures decisions, action items and open questions, and sends the recap as the call ends.",
    related: ["execution", "roadmap"],
  },
  {
    slug: "research",
    name: "Research",
    short: "Customer and market signals.",
    line: "Finds customer, market and competitor signals.",
    produces: "Evidence from customers and competitors",
    handoff: "3 competitors with shorter onboarding",
    status: "Tracking 6 competitors",
    doing: "Found 3 competitors with shorter onboarding",
    icon: "Telescope",
    headline: "it finds the signal.",
    description:
      "Selixa reads customer calls, support tickets, competitors and market notes, and turns them into a research brief with every source attached.",
    related: ["analyst", "product"],
  },
  {
    slug: "analyst",
    name: "Analytics",
    short: "Connects data to what’s happening.",
    line: "Connects product data to what’s happening.",
    produces: "The numbers, with a cause",
    handoff: "Activation −8% since the Aug 12 release",
    status: "Watching 12 metrics",
    doing: "Linked the activation drop to the Aug 12 release",
    icon: "ChartLine",
    headline: "numbers, with a cause.",
    description:
      "Selixa watches your product metrics, explains why they moved, and answers questions about any number with the sources behind it.",
    related: ["research", "product"],
  },
  {
    slug: "product",
    name: "Priorities",
    short: "Turns context into priorities.",
    line: "Turns context into priorities and product decisions.",
    produces: "A recommendation",
    handoff: "Recommendation: prioritize onboarding",
    status: "3 recommendations",
    doing: "Recommended: prioritize onboarding",
    icon: "Compass",
    headline: "it takes a position.",
    description:
      "Selixa weighs your meetings, customer evidence and data, and writes the recommendation: problem, options, impact and next steps, with sources cited.",
    related: ["roadmap", "execution"],
  },
  {
    slug: "roadmap",
    name: "Roadmap",
    short: "Keeps the roadmap current.",
    line: "Turns decisions into an evolving roadmap.",
    produces: "An up-to-date roadmap",
    handoff: "Onboarding v2 moved to Now",
    status: "Updated 2h ago",
    doing: "Moved Onboarding v2 to Now",
    icon: "Map",
    headline: "a roadmap that keeps up.",
    description:
      "Selixa turns product decisions into a roadmap that updates itself. Every move links back to the decision and meeting behind it.",
    related: ["meeting", "execution"],
  },
  {
    slug: "execution",
    name: "Tasks",
    short: "Plans into tasks, tracks progress.",
    line: "Turns plans into tasks and follows progress.",
    produces: "Tasks with owners",
    handoff: "14 tasks, synced to Linear",
    status: "14 tasks in flight",
    doing: "Created 14 tasks in Linear",
    icon: "ListChecks",
    headline: "from decision to done.",
    description:
      "Selixa turns decisions into tasks with owners, syncs them to Linear, Jira or GitHub, and follows up until the work ships.",
    related: ["analyst", "roadmap"],
  },
];

export const agentBySlug = (slug: string): Agent | undefined => AGENTS.find((a) => a.slug === slug);
