// Every visible string on /product/roadmap that isn't agent data, from docs/pages/agents-roadmap.copy.md,
// plus the board data. Owner decisions: moves play in the order 1, 3, 2, 4 (so each happens where
// the camera is); the dependency points at the existing "Public API v2" card (the copy's "Import
// API" isn't on the board), so its toast and blocked tag name Public API v2; only Onboarding v2
// opens the "why it moved" drawer.

export type ColId = "now" | "next" | "later";

export const ROADMAP_COPY = {
  meta: {
    title: "Roadmap — Selixa",
    ogTitle: "A roadmap that keeps up — Selixa",
    ogDescription: "Decided in the meeting. On the roadmap before it ends, with the reason attached.",
  },
  hero: { eyebrow: "Roadmap", toast: "Decision captured" },
  columns: { now: "Now", next: "Next", later: "Later" } as Record<ColId, string>,
  board: {
    label: "Atlas roadmap",
    headline: "decisions move the cards.",
    product: "Atlas",
    source: "From Product review · Sep 24",
    /** In play order (copy moves 1, 3, 2, 4). */
    toasts: [
      { kind: "Decision captured:", text: "Ship the shorter onboarding flow" },
      { kind: "Shipped:", text: "Billing page fixes" },
      { kind: "Decision captured:", text: "Pause mobile until Q1" },
      { kind: "Dependency:", text: "Import from CSV blocked by Public API v2" },
    ],
    shipped: "Shipped",
  },
  why: {
    label: "Why it moved",
    headline: "every move has a reason.",
    line: "Tap a card to see the decision behind it.",
    drawer: {
      title: "Onboarding v2",
      from: "Next",
      to: "Now",
      date: "Sep 24",
      decisionLabel: "Decision",
      decision: "Ship the shorter onboarding flow on Oct 14",
      decidedByLabel: "Decided by",
      decidedBy: "Sara Kim",
      fromLabel: "From",
      meeting: "Product review · Sep 24 · 11:04",
      meetingLink: "Open meeting",
      whyLabel: "Why",
      why: ["Activation −8% since the Aug 12 release", "3 competitors with shorter onboarding"],
      recommendationLabel: "Recommendation",
      recommendation: "Prioritize onboarding",
      memoLink: "Open memo",
      close: "Close",
    },
  },
  products: {
    label: "Per product",
    headline: "every product, its own roadmap.",
    line: "Separate decisions. Separate context.",
    isolated: "Isolated",
    list: [
      { name: "Atlas", mark: "A", now: ["Onboarding v2", "Faster search"], updated: "Updated 2h ago" },
      { name: "Beacon", mark: "B", now: ["Usage alerts", "Team billing"], updated: "Updated yesterday" },
      { name: "Cove", mark: "C", now: ["Offline mode", "Sharing links"], updated: "Updated 3d ago" },
      { name: "Drift", mark: "D", now: ["Dashboard redesign", "Slack digest"], updated: "Updated 5h ago" },
    ],
  },
  related: {
    label: "Before and after",
    headline: "before and after the roadmap.",
    linkText: "See how it works",
    agents: [
      { slug: "meeting", reason: "Where the decisions come from." },
      { slug: "execution", reason: "Turns Now into tasks." },
    ],
  },
  cta: { headline: "stop building in chaos.", line: "Keep your roadmap as current as your last meeting." },
} as const;

export type RoadmapCard = {
  id: string;
  title: string;
  owner?: string;
  /** Tag before / after its move (stacked, cross-faded). */
  tag?: string;
  tagAfter?: string;
};

export const CARDS: RoadmapCard[] = [
  { id: "billing", title: "Billing page fixes", owner: "Dev Patel" },
  { id: "search", title: "Faster search", owner: "Dev Patel" },
  { id: "onboarding", title: "Onboarding v2", owner: "Sara Kim", tag: "Q4", tagAfter: "Oct 14" },
  { id: "views", title: "Saved views for teams", owner: "Maya Chen" },
  { id: "csv", title: "Import from CSV", owner: "Dev Patel", tag: "Blocked", tagAfter: "Blocked by Public API v2" },
  { id: "beta", title: "Mobile app beta", owner: "Maya Chen" },
  { id: "mobile", title: "Mobile app" },
  { id: "api", title: "Public API v2" },
  { id: "sso", title: "SSO" },
];

/** Where every card sits before and after the four moves. */
export const START: Record<string, { col: ColId; slot: number }> = {
  billing: { col: "now", slot: 0 },
  search: { col: "now", slot: 1 },
  // Next is two-up: Onboarding v2 (moves at camera A) on the left, Import from CSV and Mobile
  // app beta (both act at camera B, where only Next's right half is in view) on the right.
  onboarding: { col: "next", slot: 0 },
  csv: { col: "next", slot: 1 },
  views: { col: "next", slot: 2 },
  beta: { col: "next", slot: 3 },
  // Public API v2 sits first in Later, level with Import from CSV, so the dependency runs straight across.
  api: { col: "later", slot: 0 },
  mobile: { col: "later", slot: 1 },
  sso: { col: "later", slot: 2 },
};
export const MOVED: Record<string, { col: ColId; slot: number }> = {
  onboarding: { col: "now", slot: 2 },
  beta: { col: "later", slot: 3 },
};
