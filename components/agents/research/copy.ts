// Every visible string on /product/research that isn't agent data, from
// docs/pages/agents-research.copy.md, plus the board layout (world coordinates, spec §3.2–3.3).
// No real brands: competitors are Competitor A / B / C.

export const RESEARCH_COPY = {
  meta: {
    title: "Research — Selixa",
    ogTitle: "It finds the signal — Selixa",
    ogDescription: "Customer quotes, competitors and market notes, pulled into one brief.",
  },
  hero: { eyebrow: "Research" },
  stops: [
    { name: "Customers", caption: "Customers: 4 calls and 7 notes say the same thing.", chip: "Complaints up 60% in two weeks" },
    { name: "Competitors", caption: "Competitors: 3 of 6 ask for integrations later.", chip: "3 competitors with shorter onboarding" },
    { name: "Market", caption: "Market: buyers judge a tool in the first session.", chip: null },
  ],
  threads: { supports: "supports", contradicts: "contradicts", sameTheme: "same theme" },
  brief: {
    headline: "one brief. every source attached.",
    label: "Atlas · Research brief",
    confidence: "Confidence · High",
    title: "Onboarding asks too much, too early",
    finding: "New users stall when asked to connect tools before they see value. 3 competitors ask later.",
    evidence: 16,
    evidenceLabel: "pieces of evidence",
    breakdown: [
      { n: 4, label: "customer calls" },
      { n: 7, label: "feedback notes" },
      { n: 3, label: "competitors" },
      { n: 2, label: "market notes" },
    ],
    sources: ["Intercom", "Slack", "Notion", "Google Drive"],
    footer: "Sent to Priorities",
    placeholder: "Research brief",
  },
  sources: { label: "Sources", headline: "reads where your evidence lives." },
  related: {
    label: "Where the brief goes",
    headline: "where the brief goes.",
    linkText: "See how it works",
    agents: [
      { slug: "analyst", reason: "Checks the brief against the numbers." },
      { slug: "product", reason: "Turns the brief into a recommendation." },
    ],
  },
  cta: { headline: "stop building in chaos.", line: "Let Selixa read what your customers are saying." },
} as const;

export type CardKind = "quote" | "ticket" | "count" | "screenshot" | "note";
export type BoardCard = {
  id: string;
  cluster: 0 | 1 | 2;
  kind: CardKind;
  tag: string;
  text: string;
  /** Screenshot layout (grey UI blocks, no logos). */
  shot?: "stepper" | "table" | "single";
  /** Analyst note: a sparkline with the dip. */
  spark?: boolean;
};

/** Every card on the board, by cluster. Text from the copy sheet. */
export const CARDS: BoardCard[] = [
  { id: "c-maya", cluster: 0, kind: "quote", tag: "Call · Interview · Maya", text: "I gave up at the integrations screen. I just wanted to see my project." },
  { id: "c-call", cluster: 0, kind: "quote", tag: "Call · Customer call · Sep 18", text: "We needed our Slack admin before we could even start." },
  { id: "c-4127", cluster: 0, kind: "ticket", tag: "Ticket · #4127", text: "Can’t finish setup without admin access" },
  { id: "c-4133", cluster: 0, kind: "ticket", tag: "Ticket · #4133", text: "Skipped setup, now the workspace is empty" },
  { id: "c-notes", cluster: 0, kind: "count", tag: "Feedback · 7 related notes", text: "Onboarding takes too long" },
  { id: "k-a", cluster: 1, kind: "screenshot", tag: "Competitor A", text: "3-step setup. Integrations after the first project.", shot: "stepper" },
  { id: "k-b", cluster: 1, kind: "screenshot", tag: "Competitor B", text: "Starts with sample data. Connect tools later.", shot: "table" },
  { id: "k-c", cluster: 1, kind: "screenshot", tag: "Competitor C", text: "One screen to first value.", shot: "single" },
  { id: "m-1", cluster: 2, kind: "note", tag: "Market note", text: "Self-serve trials are decided in the first session." },
  { id: "m-2", cluster: 2, kind: "note", tag: "Market note", text: "Teams expect value before setup." },
  { id: "m-an", cluster: 2, kind: "note", tag: "Analyst note · from Analytics", text: "Activation −8% since the Aug 12 release", spark: true },
];

/** A card's place on a board: centre x, the card's top edge (where the pin is), width, rotation. */
export type Placed = { id: string; x: number; top: number; w: number; rot: number };
export type World = {
  w: number;
  h: number;
  knots: [number, number][];
  labels: { cluster: number; x: number; y: number; chip?: [number, number] }[];
  cards: Placed[];
  brief: { x: number; y: number; w: number; h: number };
  /** Camera stops as world rects [x, y, w, h]; S0 and S4 are the overview. */
  stops: [number, number, number, number][];
  /** Extra threads with a label: [from card, to card, label, dashed]. */
  extra: [string, string, keyof typeof RESEARCH_COPY.threads, boolean][];
  /** Label "supports" on these clusters' knot → brief threads. */
  supports: number[];
};

// Cluster chips sit just after their label (the spec's centred chips collided with the
// Satoshi labels), left-anchored at the point given.
// The spec gives card centres; approximate heights turn them into top edges (the pin point).
const H: Record<string, number> = { quote: 150, ticket: 110, count: 130, screenshot: 260, note: 110, spark: 150 };
const at = (id: string, x: number, y: number, w: number, rot: number): Placed => {
  const c = CARDS.find((k) => k.id === id)!;
  return { id, x, top: y - (c.spark ? H.spark : H[c.kind]) / 2, w, rot };
};

export const DESKTOP_WORLD: World = {
  w: 2400,
  h: 1500,
  knots: [
    [560, 560],
    [1840, 540],
    [1180, 1200],
  ],
  labels: [
    { cluster: 0, x: 250, y: 250, chip: [505, 244] },
    { cluster: 1, x: 1540, y: 250, chip: [1830, 234] },
    { cluster: 2, x: 860, y: 1030 },
  ],
  cards: [
    at("c-maya", 400, 390, 300, -2),
    at("c-call", 730, 370, 280, 1.5),
    at("c-4127", 390, 650, 250, 1),
    at("c-4133", 690, 670, 250, -1.5),
    at("c-notes", 550, 860, 260, 0.5),
    at("k-a", 1660, 440, 300, -1.5),
    at("k-b", 2010, 410, 300, 2),
    at("k-c", 1840, 740, 300, -0.5),
    at("m-1", 990, 1150, 270, 1),
    at("m-2", 1380, 1130, 270, -2),
    at("m-an", 1180, 1350, 290, 0.5),
  ],
  brief: { x: 1200, y: 650, w: 420, h: 240 },
  stops: [
    [0, 0, 2400, 1500],
    [200, 220, 760, 760],
    [1480, 220, 720, 700],
    [820, 1000, 720, 460],
    [0, 0, 2400, 1500],
  ],
  extra: [
    ["c-notes", "m-2", "sameTheme", false],
    ["m-1", "k-c", "contradicts", true],
  ],
  supports: [0, 1],
};

// Phone: clusters stacked on a spine at x = 400; Competitor B dropped. Stops are ~360 wide so
// the camera sits near scale 1 on a 390px screen (cards stay readable); labels and chips start
// at the cards' left edge so they're inside each stop.
export const PHONE_WORLD: World = {
  w: 800,
  h: 2260,
  knots: [
    [400, 470],
    [400, 1240],
    [400, 1790],
  ],
  labels: [
    { cluster: 0, x: 230, y: 120, chip: [230, 172] },
    { cluster: 1, x: 230, y: 860, chip: [230, 912] },
    { cluster: 2, x: 230, y: 1580 },
  ],
  cards: [
    at("c-maya", 380, 330, 300, -2),
    at("c-4127", 420, 560, 300, 1),
    at("c-notes", 390, 770, 300, 0.5),
    at("k-a", 390, 1100, 300, -1.5),
    at("k-c", 410, 1390, 300, 1),
    at("m-1", 380, 1710, 300, 1),
    at("m-an", 410, 1890, 300, -1),
  ],
  brief: { x: 400, y: 2110, w: 340, h: 160 },
  stops: [
    [0, 0, 800, 2260],
    [220, 100, 360, 700],
    [220, 840, 360, 700],
    [220, 1560, 360, 440],
    [0, 0, 800, 2260],
  ],
  extra: [["m-1", "k-c", "contradicts", true]],
  supports: [],
};
