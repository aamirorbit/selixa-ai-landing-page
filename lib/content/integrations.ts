// The 11 tools Selixa connects to, for /integrations and /integrations/[slug].
// Names and categories match components/landing/logos.ts; the Builder joins marks by `name`.
// Everything a tool brings in lands in one product's own, isolated context (sample product: Atlas).
// Demo strings are illustrative and follow the home page's story:
// Aug 12 release adds an integrations step → activation −8% → ship the shorter
// onboarding flow on Oct 14 → Slack connect moves after the first project → 14 tasks.
//
// Not included on purpose (unconfirmed, see SITE_PLAN §11):
// - availability status (Live / Coming soon)
// - permission scopes, storage region, retention
// TODO(owner): supply `permissions` per tool; until then it stays null.

import type { AgentSlug } from "./agents";

export type IntegrationSlug =
  | "slack"
  | "notion"
  | "google-drive"
  | "linear"
  | "jira"
  | "github"
  | "zoom"
  | "google-meet"
  | "intercom"
  | "clickup"
  | "posthog";

export type IntegrationCategory = "Chat" | "Docs" | "Issues" | "Code" | "Meetings" | "Feedback" | "Analytics";

/** Chip order on /integrations. */
export const CATEGORIES: IntegrationCategory[] = ["Chat", "Docs", "Issues", "Code", "Meetings", "Feedback", "Analytics"];

export type DemoKind = "thread" | "doc" | "issue" | "call" | "chart";

/** One line in a thread. `from` is a sample person, "Selixa", or a role label like "Customer". */
export type ThreadMessage = { from: string; text: string };

/** Slack / Intercom: a thread where Selixa replies. */
export type ThreadScript = {
  kind: "thread";
  /** Where the thread lives, e.g. "#atlas-onboarding". */
  place: string;
  messages: ThreadMessage[];
  /** Selixa's reply, typed out last. */
  reply: string;
  /** Small label on Selixa's reply, e.g. "Internal note". Optional. */
  replyTag?: string;
};

/** Notion / Google Drive: a doc gaining a Selixa-written section. */
export type DocScript = {
  kind: "doc";
  title: string;
  /** Lines already on the page before Selixa writes. */
  existing: string[];
  /** The section Selixa adds. */
  section: { heading: string; lines: string[] };
  /** Attribution under the new section. */
  byline: string;
};

/** Linear / Jira / ClickUp / GitHub: an issue created from a decision. */
export type IssueScript = {
  kind: "issue";
  /** The decision the issue came from, shown above it. */
  decision: string;
  /** Issue key in the tool's own style, e.g. "ATL-142" or "#142". */
  key: string;
  title: string;
  fields: { label: string; value: string }[];
  /** Closing line, e.g. "14 issues created in Onboarding v2". */
  footer: string;
};

/** Zoom / Google Meet: Selixa joining a call. */
export type CallScript = {
  kind: "call";
  title: string;
  /** Human participants; Selixa's tile is added by the component. */
  participants: string[];
  /** Status under Selixa's tile, in order. */
  statuses: string[];
  /** Chips captured during the call. */
  captured: string[];
  /** Closing line after the call ends. */
  footer: string;
};

/** PostHog: a chart with Selixa's annotation. */
export type ChartScript = {
  kind: "chart";
  metric: string;
  change: string;
  /** Label on the marked point. */
  marker: string;
  /** Selixa's annotation on the dip. */
  annotation: string;
  /** Source chips under the annotation. */
  sources: string[];
};

export type DemoScript = ThreadScript | DocScript | IssueScript | CallScript | ChartScript;

export type Integration = {
  slug: IntegrationSlug;
  /** Matches `name` in components/landing/logos.ts. */
  name: string;
  category: IntegrationCategory;
  /** One-line job. Also the page headline, rendered with a lowercase first letter. */
  job: string;
  /** What Selixa reads. 3 bullets. */
  reads: string[];
  /** What Selixa sends back. 2–3 bullets. */
  writes: string[];
  /** Which small demo the page shows. Always equals `demoScript.kind`. */
  demo: DemoKind;
  demoScript: DemoScript;
  /** Set up in 3 steps. */
  setup: [string, string, string];
  /** Most related agents, most related first. */
  agents: AgentSlug[];
  /** Meta description for /integrations/[slug]. */
  metaDescription: string;
  /** TODO(owner): access requested, storage, disconnect. Null until confirmed; the page shows the placeholder. */
  permissions: null;
  /** Extra search words for /integrations (not shown), e.g. "pr" finds GitHub. */
  keywords?: string[];
};

export const INTEGRATIONS: Integration[] = [
  {
    slug: "slack",
    keywords: ["chat", "channel", "thread"],
    name: "Slack",
    category: "Chat",
    job: "Threads and decisions.",
    reads: ["Channels you choose", "Threads and replies", "Decisions made in chat"],
    writes: ["Meeting recaps", "Answers in the thread", "Nudges on blocked work"],
    demo: "thread",
    demoScript: {
      kind: "thread",
      place: "#atlas-onboarding",
      messages: [
        { from: "Maya Chen", text: "New workspaces are stalling at the integrations step again." },
        { from: "Dev Patel", text: "Did we decide to move Slack connect after the first project?" },
      ],
      reply: "Yes, in Product review. Ship the shorter flow on Oct 14, Slack connect after the first project. Dev owns it.",
    },
    setup: ["Connect Slack to Atlas.", "Pick the channels Selixa can read.", "Mention Selixa in any thread."],
    agents: ["meeting", "research", "execution"],
    metaDescription: "Connect Slack to Selixa. It reads the threads you choose, keeps the decisions, and answers with your product's context.",
    permissions: null,
  },
  {
    slug: "notion",
    keywords: ["docs", "wiki", "pages"],
    name: "Notion",
    category: "Docs",
    job: "Specs and decision logs.",
    reads: ["Pages you share", "Specs and PRDs", "Meeting notes"],
    writes: ["Decision logs", "Draft PRDs", "Updated specs"],
    demo: "doc",
    demoScript: {
      kind: "doc",
      title: "Atlas · Onboarding v2",
      existing: ["Goal: get new workspaces to their first project."],
      section: {
        heading: "Decision log",
        lines: [
          "Oct 14: ship the shorter onboarding flow.",
          "Slack connect moves after the first project.",
          "Why: activation −8% since the Aug 12 release.",
        ],
      },
      byline: "Written by Selixa · from Product review",
    },
    setup: ["Connect Notion to Atlas.", "Share the pages Selixa can read.", "Selixa keeps them current."],
    agents: ["product", "research", "roadmap"],
    metaDescription: "Connect Notion to Selixa. It reads your specs and notes, and writes decision logs and draft PRDs back to your pages.",
    permissions: null,
  },
  {
    slug: "google-drive",
    keywords: ["docs", "wiki", "files", "slides"],
    name: "Google Drive",
    category: "Docs",
    job: "Docs, decks and research.",
    reads: ["Folders you choose", "Docs and slides", "Research and interview notes"],
    writes: ["Evidence summaries", "Draft briefs"],
    demo: "doc",
    demoScript: {
      kind: "doc",
      title: "Atlas · Q4 planning",
      existing: ["Question: why did activation drop in August?"],
      section: {
        heading: "Evidence",
        lines: [
          "38% of new workspaces never finish setup.",
          "4 customer calls raised the integrations step.",
          "3 competitors with shorter onboarding.",
        ],
      },
      byline: "Written by Selixa · from 4 calls and 7 feedback notes",
    },
    setup: ["Connect Google Drive to Atlas.", "Choose the folders Selixa can read.", "Selixa cites them in its answers."],
    agents: ["research", "product"],
    metaDescription: "Connect Google Drive to Selixa. It reads the folders you choose and turns docs and research into evidence for decisions.",
    permissions: null,
  },
  {
    slug: "linear",
    keywords: ["issue", "ticket", "tracker"],
    name: "Linear",
    category: "Issues",
    job: "Decisions into issues.",
    reads: ["Projects and cycles", "Issue status", "Blockers"],
    writes: ["Issues from decisions", "Owners and projects", "Status follow-ups"],
    demo: "issue",
    demoScript: {
      kind: "issue",
      decision: "Ship the shorter onboarding flow on Oct 14",
      key: "ATL-142",
      title: "Move Slack connect after first project",
      fields: [
        { label: "Assignee", value: "Dev Patel" },
        { label: "Project", value: "Onboarding v2" },
        { label: "Status", value: "Todo" },
      ],
      footer: "14 issues created in Onboarding v2",
    },
    setup: ["Connect Linear to Atlas.", "Pick the team and projects.", "Decisions become issues."],
    agents: ["execution", "roadmap"],
    metaDescription: "Connect Linear to Selixa. Decisions from meetings become issues with owners, and Selixa follows them to done.",
    permissions: null,
  },
  {
    slug: "jira",
    keywords: ["ticket", "tickets", "issue", "tracker"],
    name: "Jira",
    category: "Issues",
    job: "Decisions into tickets.",
    reads: ["Projects and sprints", "Ticket status", "Blockers"],
    writes: ["Tickets from decisions", "Epics and owners", "Status follow-ups"],
    demo: "issue",
    demoScript: {
      kind: "issue",
      decision: "Ship the shorter onboarding flow on Oct 14",
      key: "ATL-142",
      title: "Move Slack connect after first project",
      fields: [
        { label: "Assignee", value: "Dev Patel" },
        { label: "Epic", value: "Onboarding v2" },
        { label: "Status", value: "To Do" },
      ],
      footer: "14 tickets created in Onboarding v2",
    },
    setup: ["Connect Jira to Atlas.", "Pick the project and board.", "Decisions become tickets."],
    agents: ["execution", "roadmap"],
    metaDescription: "Connect Jira to Selixa. Decisions from meetings become tickets with owners, and Selixa follows them to done.",
    permissions: null,
  },
  {
    slug: "clickup",
    keywords: ["task", "tasks", "ticket", "tracker", "project"],
    name: "ClickUp",
    category: "Issues",
    job: "Decisions into tasks.",
    reads: ["Spaces and lists you choose", "Task status", "Blockers"],
    writes: ["Tasks from decisions", "Owners and due dates", "Status follow-ups"],
    demo: "issue",
    demoScript: {
      kind: "issue",
      decision: "Ship the shorter onboarding flow on Oct 14",
      key: "ATL-142",
      title: "Move Slack connect after first project",
      fields: [
        { label: "Assignee", value: "Dev Patel" },
        { label: "List", value: "Onboarding v2" },
        { label: "Status", value: "To Do" },
      ],
      footer: "14 tasks created in Onboarding v2",
    },
    setup: ["Connect ClickUp to Atlas.", "Pick the space and lists.", "Decisions become tasks."],
    agents: ["execution", "roadmap"],
    metaDescription: "Connect ClickUp to Selixa. Decisions from meetings become tasks with owners, and Selixa follows them to done.",
    permissions: null,
  },
  {
    slug: "github",
    keywords: ["pr", "prs", "pull request", "repo", "code"],
    name: "GitHub",
    category: "Code",
    job: "What actually shipped.",
    reads: ["Repositories you choose", "Issues and pull requests", "Releases"],
    writes: ["Issues from decisions", "Task status from merged work"],
    demo: "issue",
    demoScript: {
      kind: "issue",
      decision: "Ship the shorter onboarding flow on Oct 14",
      key: "#142",
      title: "Move Slack connect after first project",
      fields: [
        { label: "Assignee", value: "Dev Patel" },
        { label: "Label", value: "onboarding" },
        { label: "Linked", value: "PR #318 merged" },
      ],
      footer: "Task moved to Done",
    },
    setup: ["Connect GitHub to Atlas.", "Choose the repositories.", "Merged work updates the plan."],
    agents: ["execution", "roadmap"],
    metaDescription: "Connect GitHub to Selixa. It follows issues, pull requests and releases, so the plan reflects what actually shipped.",
    permissions: null,
  },
  {
    slug: "zoom",
    keywords: ["call", "video", "meeting"],
    name: "Zoom",
    category: "Meetings",
    job: "Calls into decisions.",
    reads: ["Meetings you invite it to", "What was said", "Who agreed to what"],
    writes: ["Recaps after the call", "Decisions and action items", "Owners for follow-ups"],
    demo: "call",
    demoScript: {
      kind: "call",
      title: "Atlas · Product review",
      participants: ["Maya Chen", "Dev Patel", "Sara Kim"],
      statuses: ["Joining", "Listening", "Writing recap"],
      captured: ["3 decisions", "5 action items", "2 open questions"],
      footer: "Recap sent to 3 attendees",
    },
    setup: ["Connect Zoom to Atlas.", "Invite Selixa to a meeting.", "Get the recap when it ends."],
    agents: ["meeting", "execution"],
    metaDescription: "Connect Zoom to Selixa. It joins the calls you invite it to and sends back decisions, action items and owners.",
    permissions: null,
  },
  {
    slug: "google-meet",
    keywords: ["call", "video", "meeting"],
    name: "Google Meet",
    category: "Meetings",
    job: "Calls into decisions.",
    reads: ["Meetings you invite it to", "What was said", "Who agreed to what"],
    writes: ["Recaps after the call", "Decisions and action items", "Owners for follow-ups"],
    demo: "call",
    demoScript: {
      kind: "call",
      title: "Atlas · Product review",
      participants: ["Maya Chen", "Dev Patel", "Sara Kim"],
      statuses: ["Joining", "Listening", "Writing recap"],
      captured: ["3 decisions", "5 action items", "2 open questions"],
      footer: "Recap sent to 3 attendees",
    },
    setup: ["Connect Google Meet to Atlas.", "Add Selixa to the calendar invite.", "Get the recap when it ends."],
    agents: ["meeting", "execution"],
    metaDescription: "Connect Google Meet to Selixa. It joins the calls you invite it to and sends back decisions, action items and owners.",
    permissions: null,
  },
  {
    slug: "intercom",
    keywords: ["support", "inbox", "chat"],
    name: "Intercom",
    category: "Feedback",
    job: "The voice of the customer.",
    reads: ["Customer conversations", "Feature requests", "Recurring complaints"],
    writes: ["Themes across conversations", "Internal notes linking to the roadmap"],
    demo: "thread",
    demoScript: {
      kind: "thread",
      place: "Conversation · New workspace",
      messages: [{ from: "Customer", text: "We got stuck connecting our tools during setup. Can we skip that for now?" }],
      reply: "Tagged: onboarding friction. 7th note this month. Linked to Onboarding v2, now on the roadmap.",
      replyTag: "Internal note",
    },
    setup: ["Connect Intercom to Atlas.", "Choose the inboxes Selixa reads.", "Themes show up in Atlas."],
    agents: ["research", "product"],
    metaDescription: "Connect Intercom to Selixa. It reads customer conversations, finds the themes, and links them to what's on the roadmap.",
    permissions: null,
  },
  {
    slug: "posthog",
    keywords: ["metrics", "events", "funnel"],
    name: "PostHog",
    category: "Analytics",
    job: "Numbers with a cause.",
    reads: ["Events and funnels", "Metrics you pick", "Releases and flags"],
    writes: ["Annotations on what moved", "Alerts when a metric drops"],
    demo: "chart",
    demoScript: {
      kind: "chart",
      metric: "Activation",
      change: "−8%",
      marker: "Aug 12 release",
      annotation: "Integrations step added. 38% of new workspaces never finish setup.",
      sources: ["4 customer calls", "7 feedback notes"],
    },
    setup: ["Connect PostHog to Atlas.", "Pick the metrics to watch.", "Selixa explains what moves."],
    agents: ["analyst", "product"],
    metaDescription: "Connect PostHog to Selixa. It watches the metrics you pick and explains what moved, with the meetings and feedback behind it.",
    permissions: null,
  },
];

export const integrationBySlug = (slug: string): Integration | undefined => INTEGRATIONS.find((i) => i.slug === slug);

export const integrationsByCategory = (category: IntegrationCategory): Integration[] =>
  INTEGRATIONS.filter((i) => i.category === category);
