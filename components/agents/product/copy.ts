// Every visible string on /product/priorities that isn't agent data, from docs/pages/agents-product.copy.md.
// Owner decision: Related shows the memo's inputs (Meeting, Research, Analyst). The copy has no
// headline or reasons for those; the headline is the Designer's wording from the spec
// ("where the evidence comes from") and the reasons are each agent's `line` (data). Flagged.

export const PRODUCT_COPY = {
  meta: {
    title: "AI product prioritization, with sources — Selixa",
    ogTitle: "It takes a position — Selixa",
    ogDescription: "A product memo that writes itself, cites its evidence and defends its call.",
  },
  hero: { eyebrow: "Priorities" },
  doc: {
    crumbs: ["Atlas", "Memos"],
    title: "Prioritize onboarding",
    meta: "Drafted by Selixa · Sep 25 · 3 min read",
    draft: "Draft",
    review: "In review",
    people: ["Sara Kim", "Dev Patel", "Maya Chen"],
  },
  sections: {
    problem: {
      heading: "Problem",
      before: "New workspaces stall at the integrations step. ",
      stat: "38% never finish setup",
      after: ", and activation is down 8% since the Aug 12 release.",
    },
    evidence: {
      heading: "Evidence",
      items: [
        { value: 4, suffix: "", label: "customer calls name the integrations step.", cite: 1 },
        { value: 7, suffix: "", label: "feedback notes say onboarding takes too long.", cite: 2 },
        { value: 3, suffix: "", label: "competitors ask for integrations after the first project.", cite: 3 },
        { value: 9, suffix: "%", label: "Setup completion fell 9% the week of the release.", cite: 4, down: true },
      ],
    },
    options: {
      heading: "Options considered",
      items: [
        { title: "Shorter first-run flow, integrations after the first project.", verdict: "Recommended", reason: null },
        { title: "Guided setup call for every new workspace.", verdict: "Later", reason: "Later: worth testing once v2 ships." },
        {
          title: "Revert the Aug 12 integrations step.",
          verdict: "Rejected",
          reason: "Rejected: teams that connect tools early retain better. Reverting fixes setup and hurts retention.",
        },
      ],
    },
    recommendation: {
      heading: "Recommendation",
      statement: "Ship a shorter first-run flow and ask for integrations after the first project.",
    },
    impact: {
      heading: "Impact",
      body: "Recovers most of the activation drop within two release cycles. Measured weekly.",
      agentTag: "Analytics",
    },
    next: {
      heading: "Next steps",
      items: ["Draft the requirement", "Size it with engineering", "Review on Thursday"],
    },
  },
  sources: [
    { kind: "Meeting", title: "Product review · Sep 24 · 02:41", quote: "People still stall at the integrations step.", linkText: "Open in Meetings", href: "meeting" },
    { kind: "Intercom", title: "Intercom · 7 notes", quote: "Onboarding takes too long.", linkText: "Open in Research", href: "research" },
    { kind: "Research", title: "Research brief · Onboarding", quote: "3 of 6 competitors ask for integrations later.", linkText: "Open in Research", href: "research" },
    { kind: "PostHog", title: "PostHog · Setup completion", quote: "62%, down 9% since Aug 12.", linkText: "Open in Analytics", href: "analyst" },
  ],
  notes: {
    headline: "and it defends it.",
    resolved: "Resolved",
    threads: [
      [
        { author: "Dev Patel", body: "Why not just revert? It’s the fastest fix." },
        { author: "Selixa", selixa: true, body: "Faster, but it drops integrations for everyone. Teams that connect Slack in week one retain better. Deferring keeps both." },
      ],
      [
        { author: "Maya Chen", body: "Can we keep the product tour?" },
        { author: "Selixa", selixa: true, body: "All 4 customer calls skipped it [1]. I’d replace it with a 3-step checklist." },
      ],
      [{ author: "Sara Kim", body: "Agreed. Taking this to Thursday’s review." }],
    ],
  },
  handoff: {
    label: "Recommendation: prioritize onboarding",
    button1: "Create roadmap item",
    button2: "Draft PRD",
  },
  related: {
    label: "Where the evidence comes from",
    headline: "where the evidence comes from.",
    linkText: "See how it works",
    agents: ["meeting", "research", "analyst"],
  },
  cta: { headline: "stop building in chaos.", line: "Get a recommendation you can argue with." },
} as const;
