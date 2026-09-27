// Every visible string on /agents/analyst that isn't agent data, from
// docs/pages/agents-analyst.copy.md, plus the demo series (spec §3.2–3.4). Illustrative:
// activation goes 38.0% → 35.0% (shown as −8%, relative).

export const ANALYST_COPY = {
  meta: {
    title: "Analyst Agent — Selixa",
    ogTitle: "Numbers, with a cause — Selixa",
    ogDescription: "Activation fell 8%. Selixa found the release, the step and the calls behind it.",
  },
  hero: {
    eyebrow: "Analyst Agent",
    chartTitle: "Activation · Atlas",
    rangeChip: "Last 12 weeks",
    legend: "Activation rate, weekly",
    yAxis: [
      { value: 30, label: "30%" },
      { value: 35, label: "35%" },
      { value: 40, label: "40%" },
    ],
    xAxis: ["Jul 1", "Jul 15", "Jul 29", "Aug 12", "Aug 26", "Sep 9", "Sep 23"],
    markedPoint: "Aug 12",
    dipLabel: "−8%",
    dipTooltip: "38.0% → 35.0% · since Aug 12",
    ariaLabel: "Activation, weekly, Jul 1 to Sep 23: about 38% until Aug 12, then 35%.",
  },
  annotations: {
    label: "Why it moved",
    headline: "it tells you why.",
    line: "Every callout links to its source.",
    items: [
      { title: "Aug 12 release", detail: "Integrations step added to setup", source: "GitHub · PR #451", logo: "GitHub" },
      { title: "Setup completion −9%", detail: "38% never finish setup", source: "PostHog", logo: "PostHog" },
      { title: "4 customer calls", detail: "All mention the integrations step", source: "Meeting Agent", logo: null },
      { title: "7 feedback notes", detail: "“Onboarding takes too long”", source: "Intercom", logo: "Intercom" },
    ],
    summary: "Activation −8% since the Aug 12 release.",
  },
  ask: {
    label: "Ask a number",
    headline: "ask any number.",
    placeholder: "Ask about a metric…",
    question: "Why did retention change in May?",
    answer: ["Week-4 retention rose 5% in May, after saved views shipped on May 6.", "Teams that used saved views drove most of it."],
    chartTitle: "Week-4 retention · Apr–Jun",
    marker: "May 6 · Saved views",
    sources: ["PostHog", "Mixpanel"],
    followUps: ["Break down by plan", "Compare to last year"],
    sender: "Selixa",
  },
  metrics: {
    label: "Metrics",
    headline: "watching 12 metrics, so you don’t have to.",
    columns: ["Metric", "Now", "Change", "Last 12 weeks"],
    product: "Atlas",
    phoneBar: "Atlas · Last 12 weeks",
    footer: "Atlas · Updated 2h ago",
  },
  related: {
    label: "Where the numbers go",
    headline: "where the numbers go.",
    linkText: "See how it works",
    agents: [
      { slug: "research", reason: "Finds what customers say about the same drop." },
      { slug: "product", reason: "Decides what to do about it." },
    ],
  },
  cta: { headline: "stop building in chaos.", line: "Find out why your numbers moved." },
} as const;

/** Weekly activation, Jul 1 → Sep 23 (index 6 = Aug 12). */
export const ACTIVATION = [37.8, 38.2, 37.9, 38.3, 38.1, 38.0, 38.0, 36.4, 35.3, 35.1, 34.9, 35.0, 35.0];
/** Week-4 retention, Apr → Jun (index 5 = May 6). */
export const RETENTION = [41, 41.2, 40.8, 41.1, 41.0, 43.2, 44.6, 45.4, 45.8, 46.1, 46.0, 46.2, 46.3];

export type Metric = { name: string; now: string; change: string; dir: "up" | "down" | "flat"; points: number[]; anomaly?: boolean };

export const METRICS: Metric[] = [
  { name: "Activation", now: "35.0%", change: "−8%", dir: "down", anomaly: true, points: [38.1, 37.9, 38.3, 38.0, 38.2, 38.0, 36.4, 35.3, 35.1, 34.9, 35.0, 35.0] },
  { name: "Setup completion", now: "62%", change: "−9%", dir: "down", anomaly: true, points: [68, 69, 68, 68, 69, 68, 64, 62, 62, 61, 62, 62] },
  { name: "Time to first project", now: "2.4 days", change: "+41%", dir: "up", points: [1.7, 1.7, 1.6, 1.7, 1.7, 1.7, 2.1, 2.3, 2.4, 2.4, 2.4, 2.4] },
  { name: "Week-4 retention", now: "46%", change: "+5%", dir: "up", points: [43, 43, 44, 44, 44, 45, 45, 45, 46, 46, 46, 46] },
  { name: "Weekly active teams", now: "1,284", change: "+3%", dir: "up", points: [1240, 1248, 1251, 1255, 1262, 1260, 1266, 1270, 1271, 1276, 1280, 1284] },
  { name: "Projects created", now: "3,912", change: "+2%", dir: "up", points: [3820, 3790, 3850, 3840, 3870, 3860, 3880, 3875, 3890, 3900, 3905, 3912] },
  { name: "Invites sent per team", now: "2.7", change: "0%", dir: "flat", points: [2.7, 2.6, 2.7, 2.7, 2.8, 2.7, 2.7, 2.6, 2.7, 2.7, 2.7, 2.7] },
  { name: "Integrations connected", now: "1.9", change: "−4%", dir: "down", points: [2.0, 2.0, 2.0, 1.9, 2.0, 2.0, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9] },
  { name: "Trial to paid", now: "14%", change: "+1%", dir: "up", points: [13.8, 13.9, 13.8, 14.0, 13.9, 13.9, 14.0, 14.0, 13.9, 14.0, 14.1, 14.0] },
  { name: "Support tickets", now: "212", change: "+18%", dir: "up", points: [178, 181, 176, 180, 179, 184, 205, 214, 210, 212, 209, 212] },
  { name: "Feature adoption · Saved views", now: "31%", change: "+6%", dir: "up", points: [25, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31] },
  { name: "Churned teams", now: "23", change: "−2%", dir: "down", points: [24, 23, 25, 24, 23, 24, 23, 24, 23, 23, 24, 23] },
];
