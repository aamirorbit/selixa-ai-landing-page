// Every visible string on /product/tasks that isn't agent data, from docs/pages/agents-execution.copy.md,
// plus the task list. Owner decisions: sync is shown one way only (Selixa → tracker): no return
// rail, no "Status changes flow both ways." line, no "← Status back" label. The hero loop starts
// at 0 (the board visibly empties). Slack is the only nudge channel.

export const EXECUTION_COPY = {
  meta: {
    title: "Tasks — Selixa",
    ogTitle: "From decision to done — Selixa",
    ogDescription: "One decision, 14 tasks, three owners, no chasing.",
  },
  hero: {
    eyebrow: "Tasks",
    board: "Onboarding v2",
    columns: { todo: "To do", doing: "In progress", done: "Done" },
    of: "of",
    doneLabel: "Done",
  },
  breakdown: {
    label: "Breakdown",
    headline: "one decision, fourteen tasks.",
    line: "Every task has an owner before the meeting ends.",
    levels: ["Decision", "Requirement", "Tasks", "Owners"],
    decisionSource: "Product review",
    decision: "Shorten onboarding",
    requirement: "Onboarding v2",
    requirementDate: "Ship Oct 14",
    tasksHeader: "14 tasks · Synced to",
    tasksTool: "Linear",
  },
  nudges: {
    label: "Follow-up",
    headline: "it follows up, so you don’t.",
    sender: "Selixa · now",
    list: [
      { title: "Blocked for 2 days: auth dependency", body: "ATL-217 is waiting on the auth review. Want me to ask Dev?", to: "Sara Kim", blocked: true },
      { title: "Due tomorrow", body: "ATL-214 Empty states for new workspaces", to: "Maya Chen" },
      { title: "Unassigned for 1 day", body: "ATL-225 Email existing trial users needs an owner.", to: "Sara Kim" },
      { title: "PR #482 merged", body: "ATL-212 moved to Done.", to: "#atlas-product" },
      { title: "On track for Oct 14", body: "12 of 14 done. 2 in review.", to: "#atlas-product" },
    ],
  },
  sync: {
    label: "Sync",
    headline: "stays in sync with your tracker.",
    out: "Tasks out →",
    selixa: "Selixa · Atlas",
    task: { id: "ATL-212", title: "Move Slack connect after first project", owner: "Dev Patel" },
    status: { open: "In progress", done: "Done" },
    github: { id: "PR #482", open: "Open", done: "Merged" },
    trackers: ["Linear", "Jira", "GitHub"],
  },
  outcome: {
    label: "Outcome",
    headline: "done means the number moved.",
    line: "Selixa measures the outcome, not just the tasks.",
    title: "Activation · Atlas",
    from: "35.0%",
    to: 37.4,
    change: "Back up since Oct 14",
    sub: "Measured weekly",
    marker: "Oct 14",
    link: "See how Selixa tracks it",
  },
  related: {
    label: "Before and after",
    headline: "before and after the tasks.",
    linkText: "See how it works",
    agents: [
      { slug: "analyst", reason: "Measures whether the work paid off." },
      { slug: "roadmap", reason: "Where the plan came from." },
    ],
  },
  cta: { headline: "stop building in chaos.", line: "Stop chasing tasks. Start shipping them." },
} as const;

export type Task = { id: string; title: string; owner: "Dev Patel" | "Maya Chen" | "Sara Kim" };

/** The 14 tasks, in the copy's order (the hero plays them in this order). */
export const TASKS: Task[] = [
  { id: "ATL-212", title: "Move Slack connect after first project", owner: "Dev Patel" },
  { id: "ATL-213", title: "Replace product tour with 3-step checklist", owner: "Maya Chen" },
  { id: "ATL-214", title: "Empty states for new workspaces", owner: "Maya Chen" },
  { id: "ATL-215", title: "Checklist copy", owner: "Maya Chen" },
  { id: "ATL-216", title: "Defer integrations prompt", owner: "Dev Patel" },
  { id: "ATL-217", title: "Auth for deferred Slack connect", owner: "Dev Patel" },
  { id: "ATL-218", title: "Setup events in analytics", owner: "Dev Patel" },
  { id: "ATL-219", title: "Feature flag and rollout plan", owner: "Dev Patel" },
  { id: "ATL-220", title: "QA: new workspace flow", owner: "Dev Patel" },
  { id: "ATL-221", title: "Design review", owner: "Maya Chen" },
  { id: "ATL-222", title: "Weekly activation report", owner: "Sara Kim" },
  { id: "ATL-223", title: "Update onboarding help guide", owner: "Sara Kim" },
  { id: "ATL-224", title: "Brief customer success", owner: "Sara Kim" },
  { id: "ATL-225", title: "Email existing trial users", owner: "Sara Kim" },
];

/** Owners in tree order, with their tasks (copy order within each). */
export const OWNERS = (["Dev Patel", "Maya Chen", "Sara Kim"] as const).map((name) => ({ name, tasks: TASKS.filter((t) => t.owner === name) }));
