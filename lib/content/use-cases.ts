// The 12 use cases in the header menu (components/Nav.tsx), one page each at /use-cases/[slug].
// `title` and `line` match the menu exactly. Everything in `day` is illustrative and follows
// the home page's story where it can: onboarding friction → activation drop → prioritize
// onboarding → 14 tasks. Sample products: Atlas, Beacon, Cove, Drift. Every product (and
// every client) keeps its own isolated context; nothing here implies memory crosses products.

import type { AgentSlug } from "./agents";

export type UseCaseGroup = "Founders" | "Product teams" | "Around the product";

/** Must match a `name` in components/landing/logos.ts. */
export type IntegrationName =
  | "Slack"
  | "Notion"
  | "Google Drive"
  | "Linear"
  | "Jira"
  | "GitHub"
  | "Zoom"
  | "Google Meet"
  | "Intercom"
  | "ClickUp"
  | "PostHog";

/** A: timeline on the left. B: timeline across the top. C: timeline as stacked cards. */
export type UseCaseVariant = "A" | "B" | "C";

export type DayMoment = {
  /** Clock time shown on the timeline, e.g. "9:00". */
  time: string;
  /** What's happening in the person's day. */
  moment: string;
  /** What Selixa did, one line. */
  selixa: string;
};

export type UseCase = {
  slug: string;
  /** Menu title, e.g. "Solo founders". */
  title: string;
  group: UseCaseGroup;
  /** Menu one-liner. */
  line: string;
  /** The role's biggest pain, one sentence. */
  pain: string;
  /** Before side of the split: short "chaos" items. */
  without: string[];
  /** After side of the split, matched item for item with `without`. */
  with: string[];
  /** Exactly four moments, morning to evening. */
  day: [DayMoment, DayMoment, DayMoment, DayMoment];
  /** 2–3 agents this role leans on, most important first. */
  agents: AgentSlug[];
  /** 2–4 tools this role usually connects. */
  integrations: IntegrationName[];
  variant: UseCaseVariant;
};

export const USE_CASE_GROUPS: UseCaseGroup[] = ["Founders", "Product teams", "Around the product"];

export const USE_CASES: UseCase[] = [
  {
    slug: "solo-founders",
    title: "Solo founders",
    group: "Founders",
    line: "Your AI product team.",
    pain: "You're the PM, the researcher and the analyst, and there's no time left to build.",
    without: ["Notes in 6 places", "Feedback in your inbox", "Roadmap in your head", "No one to ask why"],
    with: ["One context for Atlas", "Feedback sorted by theme", "A roadmap that updates itself", "A team that explains the why"],
    day: [
      { time: "8:30", moment: "Coffee and metrics", selixa: "Flagged activation −8% since the Aug 12 release." },
      { time: "11:00", moment: "User call", selixa: "Captured 3 decisions and 2 follow-ups." },
      { time: "15:00", moment: "What to build next", selixa: "Recommended: prioritize onboarding." },
      { time: "19:00", moment: "Before logging off", selixa: "Split Onboarding v2 into 14 tasks in Linear." },
    ],
    agents: ["product", "analyst", "execution"],
    integrations: ["Linear", "PostHog", "Google Meet", "Notion"],
    variant: "A",
  },
  {
    slug: "lean-startups",
    title: "Lean startups",
    group: "Founders",
    line: "Move without more meetings.",
    pain: "Every decision needs a meeting, and half of them get lost after it.",
    without: ["A sync for every decision", "Decisions lost in Slack", "Priorities that change daily", "Tickets nobody owns"],
    with: ["Decisions captured once", "Every decision findable", "Priorities with a reason", "Every task has an owner"],
    day: [
      { time: "9:30", moment: "Standup", selixa: "Posted blockers and owners to Slack." },
      { time: "11:30", moment: "Product review", selixa: "Captured the decision: ship the shorter onboarding flow." },
      { time: "14:00", moment: "Planning", selixa: "Moved Onboarding v2 to Now on the roadmap." },
      { time: "17:30", moment: "Wrap-up", selixa: "Assigned 14 tasks to Sara, Dev and Maya." },
    ],
    agents: ["meeting", "execution"],
    integrations: ["Slack", "Linear", "Zoom"],
    variant: "B",
  },
  {
    slug: "product-managers",
    title: "Product managers",
    group: "Product teams",
    line: "Less time collecting context.",
    pain: "Most of the week goes to chasing context, not deciding what to build.",
    without: ["12 tabs of research", "Call notes nobody reads", "A stale roadmap", "Status updates by hand"],
    with: ["Evidence in one place", "Decisions from every call", "A roadmap that stays current", "Updates written for you"],
    day: [
      { time: "9:00", moment: "Standup", selixa: "Summarized what changed on Atlas overnight." },
      { time: "11:00", moment: "Customer call", selixa: "Logged onboarding friction as evidence." },
      { time: "14:00", moment: "Prioritization", selixa: "Ranked onboarding first, with the data behind it." },
      { time: "17:00", moment: "Stakeholder update", selixa: "Drafted the weekly update from the week's decisions." },
    ],
    agents: ["meeting", "research", "product"],
    integrations: ["ClickUp", "Zoom", "Intercom", "PostHog"],
    variant: "C",
  },
  {
    slug: "multi-product-founders",
    title: "Multi-product founders",
    group: "Founders",
    line: "One workspace for all of it.",
    pain: "Switching between products means rebuilding context in your head every time.",
    without: ["Products blurring together", "One doc for everything", "Wrong numbers in the wrong deck", "Context lost on every switch"],
    with: ["Each product, its own context", "Separate docs per product", "Numbers that stay with their product", "Pick up where you left off"],
    day: [
      { time: "9:00", moment: "Atlas check-in", selixa: "Flagged Atlas activation −8%, inside Atlas only." },
      { time: "11:30", moment: "Beacon user call", selixa: "Filed the call to Beacon. Atlas never sees it." },
      { time: "15:00", moment: "Cove planning", selixa: "Built Cove's roadmap from Cove's own decisions." },
      { time: "18:00", moment: "End of day", selixa: "Gave each product its own summary." },
    ],
    agents: ["product", "roadmap", "analyst"],
    integrations: ["Linear", "PostHog", "Notion"],
    variant: "A",
  },
  {
    slug: "heads-of-product",
    title: "Heads of product",
    group: "Product teams",
    line: "Every team’s decisions in one view.",
    pain: "You find out about decisions after they've shipped.",
    without: ["Decisions scattered across teams", "Roadmaps that disagree", "Reviews spent catching up", "Surprises at launch"],
    with: ["Every decision in one view", "One roadmap, kept current", "Reviews that start informed", "Changes flagged early"],
    day: [
      { time: "8:30", moment: "Morning scan", selixa: "Listed yesterday's decisions across teams." },
      { time: "10:30", moment: "Product review", selixa: "Brought the evidence for prioritizing onboarding." },
      { time: "14:00", moment: "Roadmap check", selixa: "Flagged Onboarding v2 moving to Now." },
      { time: "17:00", moment: "Leadership update", selixa: "Drafted the update, with the reasons behind each change." },
    ],
    agents: ["roadmap", "product", "meeting"],
    integrations: ["Notion", "Jira", "Google Meet", "Slack"],
    variant: "B",
  },
  {
    slug: "engineering-leads",
    title: "Engineering leads",
    group: "Product teams",
    line: "Decisions that reach the backlog.",
    pain: "Decisions get made in meetings you weren't in, and the backlog never hears about them.",
    without: ["Specs from memory", "Tickets without context", "Priorities by Slack thread", "Nobody knows why"],
    with: ["Specs from the actual decision", "Tickets that link the why", "Priorities with evidence", "The reason, one click away"],
    day: [
      { time: "9:30", moment: "Standup", selixa: "Showed 14 tasks: 5 done, 2 blocked." },
      { time: "11:00", moment: "Backlog grooming", selixa: "Linked every task to the onboarding decision." },
      { time: "14:30", moment: "PR review", selixa: "Matched merged PRs in GitHub to their tasks." },
      { time: "17:00", moment: "Sprint check", selixa: "Flagged one task at risk of slipping." },
    ],
    agents: ["execution", "meeting"],
    integrations: ["GitHub", "Linear", "Jira", "Slack"],
    variant: "C",
  },
  {
    slug: "design-teams",
    title: "Design teams",
    group: "Product teams",
    line: "Research and feedback in one place.",
    pain: "Research lives in decks nobody opens, and feedback arrives too late to change the design.",
    without: ["Research in old decks", "Feedback in DMs", "Designs without the why", "Late surprises from support"],
    with: ["Research you can search", "Feedback grouped by theme", "The decision behind each design", "Friction flagged early"],
    day: [
      { time: "9:30", moment: "Design standup", selixa: "Surfaced new onboarding feedback overnight." },
      { time: "11:00", moment: "User interview", selixa: "Tagged 4 friction points in the signup flow." },
      { time: "14:00", moment: "Design critique", selixa: "Showed how 3 competitors shorten onboarding." },
      { time: "16:30", moment: "Handoff", selixa: "Turned the new flow into tasks for Maya and Dev." },
    ],
    agents: ["research", "meeting"],
    integrations: ["Google Drive", "Intercom", "Google Meet"],
    variant: "A",
  },
  {
    slug: "product-led-saas",
    title: "Product-led SaaS",
    group: "Around the product",
    line: "Usage data into priorities.",
    pain: "The data says something is wrong, but not why, or what to do about it.",
    without: ["Dashboards nobody checks", "A dip with no cause", "Guesses in planning", "Fixes that ship late"],
    with: ["Changes flagged for you", "A dip, linked to a release", "Priorities backed by data", "Fixes planned the same day"],
    day: [
      { time: "8:00", moment: "Overnight numbers", selixa: "Flagged activation −8% since the Aug 12 release." },
      { time: "10:30", moment: "Digging in", selixa: "Found the drop sits in onboarding step 3." },
      { time: "13:30", moment: "Planning", selixa: "Recommended: prioritize onboarding." },
      { time: "16:00", moment: "Kickoff", selixa: "Created 14 tasks and set activation as the goal." },
    ],
    agents: ["analyst", "product", "research"],
    integrations: ["PostHog", "Linear", "ClickUp"],
    variant: "B",
  },
  {
    slug: "customer-success",
    title: "Customer success",
    group: "Around the product",
    line: "Feedback that reaches the roadmap.",
    pain: "You hear the same complaint every week and can't tell if product ever did.",
    without: ["Feedback in tickets", "The same request, 20 times", "No idea what's planned", "Promises you can't check"],
    with: ["Feedback tied to the product", "Requests counted and grouped", "The roadmap, in plain words", "Status you can share"],
    day: [
      { time: "9:00", moment: "Inbox", selixa: "Grouped 23 conversations about onboarding." },
      { time: "11:30", moment: "Customer call", selixa: "Added the account to the onboarding evidence." },
      { time: "14:00", moment: "Product sync", selixa: "Showed onboarding is now top priority." },
      { time: "16:30", moment: "Follow-ups", selixa: "Listed customers to tell when Onboarding v2 ships." },
    ],
    agents: ["research", "meeting", "roadmap"],
    integrations: ["Intercom", "Slack", "Zoom"],
    variant: "C",
  },
  {
    slug: "product-ops",
    title: "Product ops",
    group: "Around the product",
    line: "Reviews and rituals on track.",
    pain: "Keeping reviews, rituals and roadmaps in sync is a full-time job of chasing people.",
    without: ["Chasing updates", "Review prep by hand", "Templates nobody fills in", "Roadmaps out of sync"],
    with: ["Updates that arrive", "Reviews prepped for you", "Notes captured automatically", "One roadmap, kept current"],
    day: [
      { time: "9:00", moment: "Weekly prep", selixa: "Collected updates from every team." },
      { time: "11:00", moment: "Product review", selixa: "Captured decisions and owners in the notes." },
      { time: "14:00", moment: "Roadmap hygiene", selixa: "Moved Onboarding v2 to Now and noted why." },
      { time: "17:00", moment: "Close the loop", selixa: "Sent follow-ups to Sara, Dev and Maya." },
    ],
    agents: ["meeting", "roadmap", "execution"],
    integrations: ["Notion", "Slack", "Google Meet", "Jira"],
    variant: "A",
  },
  {
    slug: "agencies-and-studios",
    title: "Agencies and studios",
    group: "Around the product",
    line: "Separate context per client.",
    pain: "Every client has its own product, and mixing up their context costs trust.",
    without: ["Client notes in one folder", "Calls blur together", "Status decks by hand", "Context lost on handover"],
    with: ["Each client, its own context", "Every call filed to its client", "Status written from real work", "Handovers with the full history"],
    day: [
      { time: "9:00", moment: "Client A standup", selixa: "Summarized Atlas, from Atlas's context only." },
      { time: "11:30", moment: "Client B workshop", selixa: "Filed Drift's decisions to Drift. No other client sees them." },
      { time: "14:30", moment: "Scoping", selixa: "Turned Drift's decisions into tasks." },
      { time: "17:30", moment: "Client updates", selixa: "Drafted a separate update for each client." },
    ],
    agents: ["meeting", "execution", "roadmap"],
    integrations: ["Zoom", "Google Drive", "Linear", "Slack"],
    variant: "B",
  },
  {
    slug: "venture-studios",
    title: "Venture studios",
    group: "Founders",
    line: "New products, no lost threads.",
    pain: "New products start fast, and early decisions vanish before the team grows.",
    without: ["Ideas in old decks", "Early calls forgotten", "Each team starts from zero", "No record of why"],
    with: ["Each product, its own context", "Every early call captured", "Teams start with the history", "The why, on record"],
    day: [
      { time: "9:00", moment: "Portfolio check", selixa: "Gave Atlas, Beacon and Cove separate summaries." },
      { time: "11:00", moment: "Customer discovery", selixa: "Logged signals for Cove, inside Cove." },
      { time: "14:00", moment: "Kill or build", selixa: "Laid out Cove's evidence for and against." },
      { time: "17:00", moment: "New team kickoff", selixa: "Handed Cove's team its full history." },
    ],
    agents: ["research", "product", "meeting"],
    integrations: ["Notion", "Google Meet", "Google Drive"],
    variant: "C",
  },
];

export const useCaseBySlug = (slug: string): UseCase | undefined => USE_CASES.find((u) => u.slug === slug);

export const useCasesByGroup = (group: UseCaseGroup): UseCase[] => USE_CASES.filter((u) => u.group === group);
