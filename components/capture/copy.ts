// /product/capture: the human signal layer. Conversations, voice notes, messages and ideas
// brought into Selixa as lasting product context. Never position it as a meeting recorder,
// a CRM or a transcription tool: the product is the context, not the recording.
// People and companies in the demos are samples (Sarah at Acme); numbers are illustrative.

export const CAPTURE_COPY = {
  meta: {
    title: "Selixa Capture: never lose the context behind an idea",
    description:
      "Capture brings conversations, recordings, messages and ideas into Selixa, so the people, problems and ideas behind them become lasting product context.",
    ogTitle: "Never lose the context behind an idea — Selixa Capture",
    ogDescription: "Human signals, remembered and connected to everything else Selixa knows about your product.",
  },
  hero: {
    eyebrow: "Capture · Human signals",
    headline: "The best product ideas don’t always happen at your desk.",
    line: "Calls, messages, voice notes, conversations. Capture keeps the context with you.",
    cta: "Try Capture",
    secondary: "See how it works",
  },
  problem: {
    label: "Human signals",
    headline: "Not every product signal lives online.",
    lines: ["Some happen in a five-minute conversation you almost forget."],
  },
  anywhere: { label: "Capture anywhere", headline: "Capture it wherever it happens." },
  understand: { label: "Conversation to context", headline: "Not a transcript. An understanding." },
  memory: {
    label: "Memory",
    headline: "Selixa remembers the context, not just the conversation.",
    line: "Who they are, and what they keep coming back to.",
  },
  stays: {
    label: "Selixa stays with you",
    headline: "Selixa stays with you.",
    line: "Because product intelligence doesn’t stop when you leave your laptop.",
  },
  share: {
    label: "Shareable Selixa",
    headline: "Give every conversation a way back to your product.",
    line: "They choose what to share. It joins your context.",
  },
  network: { label: "Long-term memory", headline: "What if Selixa remembered everyone you meet?" },
  connect: { label: "Signal + Capture", headline: "Human signals + market signals = stronger product intelligence." },
  execution: {
    label: "Capture to execution",
    headline: "Don’t just remember the conversation. Do something with it.",
    line: "Capture feeds straight into the rest of Selixa.",
  },
  trust: { label: "Trust", headline: "Your conversations. Your context. Your control." },
  cta: {
    headline: "Never lose the context behind an idea.",
    line: "Capture it. Selixa connects it to everything else.",
    label: "Start capturing",
    secondary: "Explore Selixa",
  },
  closing: { headline: "Selixa stays with you.", line: "From the market, to the meeting, to the product." },
} as const;
