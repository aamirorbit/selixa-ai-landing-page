// Every visible string on /product/meetings that isn't agent data, from docs/pages/agents-meeting.copy.md.
// Owner decisions: consent-dependent strings (presence badge, consent line, Selixa's participant
// tag) are left out until confirmed; the email peek is dropped; missing micro-labels use the
// shortest honest wording (scrollHint, endLink, appTag, panelTitle).

export type ChipKind = "decision" | "action" | "question" | "insight";

export const MEETING_COPY = {
  meta: {
    title: "Meetings — Selixa",
    ogTitle: "It’s already in the room — Selixa",
    ogDescription: "A 24-minute product review, captured as 3 decisions and 5 action items.",
  },
  hero: {
    eyebrow: "Meetings",
    windowTitle: "Atlas · Product review",
    endTime: "24:18",
    tiles: [
      { name: "Sara Kim", role: "Product" },
      { name: "Dev Patel", role: "Engineering" },
      { name: "Maya Chen", role: "Design" },
    ],
    selixa: "Selixa",
    selixaStatus: ["Listening", "Noting a decision"],
    scrollHint: "Scroll to play the call",
  },
  timeline: {
    eyebrow: "The call",
    headline: "scroll is the meeting.",
    line: "Every decision lands on the timeline as it’s said.",
    /** Chip labels and the counter's plural labels. */
    chips: {
      decision: { label: "Decision", one: "decision", plural: "decisions" },
      action: { label: "Action item", one: "action item", plural: "action items" },
      question: { label: "Open question", one: "open question", plural: "open questions" },
      insight: { label: "Insight", one: "insight", plural: "insights" },
    } as Record<ChipKind, { label: string; one: string; plural: string }>,
    rows: [
      { time: "00:00", who: "Sara Kim", line: "Let’s start with onboarding. Maya, what did testing show?" },
      { time: "02:41", who: "Maya Chen", line: "The new setup flow tested well, but people still stall at the integrations step.", chip: "insight", chipText: "Onboarding friction is a recurring theme" },
      { time: "05:12", who: "Sara Kim", line: "And activation’s down 8% since the Aug 12 release." },
      { time: "08:30", who: "Dev Patel", line: "If we defer the Slack connect, we can ship it this sprint.", chip: "action", chipText: "Dev · Move Slack connect after first project" },
      { time: "11:04", who: "Sara Kim", line: "Let’s do that. Ship the shorter flow on the 14th.", chip: "decision", chipText: "Ship the shorter onboarding flow on Oct 14" },
      { time: "12:38", who: "Dev Patel", line: "I’ll size it before Thursday’s review.", chip: "action", chipText: "Dev · Size Onboarding v2 before Thursday" },
      { time: "13:47", who: "Maya Chen", line: "Should imports stay behind the trial?", chip: "question", chipText: "Should imports stay behind the trial?" },
      { time: "16:20", who: "Sara Kim", line: "Keep a checklist, drop the product tour.", chip: "decision", chipText: "Replace the product tour with a 3-step checklist" },
      { time: "17:55", who: "Maya Chen", line: "I’ll have the empty states by Friday.", chip: "action", chipText: "Maya · Empty-state designs by Friday" },
      { time: "19:10", who: "Maya Chen", line: "And I’ll rewrite the checklist copy.", chip: "action", chipText: "Maya · Checklist copy" },
      { time: "21:35", who: "Sara Kim", line: "We watch activation weekly until it’s back.", chip: "decision", chipText: "Track activation weekly until it recovers" },
      { time: "22:40", who: "Dev Patel", line: "Do we tell existing trial users?", chip: "question", chipText: "Do we email existing trial users?" },
      { time: "23:30", who: "Sara Kim", line: "I’ll brief customer success today.", chip: "action", chipText: "Sara · Brief customer success" },
    ] as { time: string; who: string; line: string; chip?: ChipKind; chipText?: string }[],
    endMarker: "Call ended · 24:18",
    endLink: "See the recap",
  },
  recap: {
    eyebrow: "The recap",
    headline: "in everyone’s inbox before they close the tab.",
    channel: "#atlas-product",
    sender: "Selixa",
    appTag: "App",
    time: "just now",
    firstLine: "Product review · Sep 24 · 24 min · Sara, Dev, Maya",
    labels: { decisions: "Decisions", actions: "Action items", questions: "Open questions", insight: "Insight" },
    decisions: [
      "Ship the shorter onboarding flow on Oct 14",
      "Replace the product tour with a 3-step checklist",
      "Track activation weekly until it recovers",
    ],
    actions: [
      { who: "Dev Patel", task: "Move Slack connect after first project" },
      { who: "Dev Patel", task: "Size Onboarding v2 before Thursday" },
      { who: "Maya Chen", task: "Empty-state designs by Friday" },
      { who: "Maya Chen", task: "Checklist copy" },
      { who: "Sara Kim", task: "Brief customer success" },
    ],
    questions: ["Should imports stay behind the trial?", "Do we email existing trial users?"],
    insight: "Onboarding has come up in 4 meetings this month.",
    buttons: ["Create 5 tasks", "Open notes"],
    reactions: "3",
  },
  where: {
    label: "Where you meet",
    headline: "works where you meet.",
    panelTitle: "In this call",
  },
  related: {
    label: "What happens next",
    headline: "what happens next.",
    linkText: "See how it works",
    agents: [
      { slug: "execution", reason: "The 5 action items become tasks with owners." },
      { slug: "roadmap", reason: "The decision moves Onboarding v2 to Now." },
    ],
  },
  cta: { headline: "stop building in chaos.", line: "Bring Selixa to your next product review." },
} as const;
