# Archived: the six-agents framing

Until September 2026 the site presented Selixa as **a team of six AI agents**. We moved
to presenting it as **one AI Product Manager** whose work covers six areas (menu label
**Product**), because "agents" made one teammate sound like a toolkit you assemble.

This file keeps the agents version so it can come back.

## Where the full version lives

- **Git tag `agents-framing`** (commit `5cfd5e2`): the whole site as it was, with the
  agents framing everywhere. To see it: `git checkout agents-framing`. To diff what changed:
  `git diff agents-framing -- components lib app`.
- **Page copy sheets** in `docs/pages/agents-*.copy.md` and design specs in
  `docs/pages/agents-*.md` were written for the agents version and were left as they were.
- **The brief**: section "06. Agents" of `docs/NEW_REQ.md`.

## The six agents

In hand-off order. Each one picks up where the last one left off.

| Agent | Old URL | New name | New URL | Menu line | Card line |
|---|---|---|---|---|---|
| Meeting Agent | `/agents/meeting` | Meetings | `/product/meetings` | Joins calls, captures decisions. | Joins meetings, captures decisions and follow-ups. |
| Research Agent | `/agents/research` | Research | `/product/research` | Customer and market signals. | Finds customer, market and competitor signals. |
| Analyst Agent | `/agents/analyst` | Analytics | `/product/analytics` | Connects data to what's happening. | Connects product data to what's happening. |
| Product Agent | `/agents/product` | Priorities | `/product/priorities` | Turns context into priorities. | Turns context into priorities and product decisions. |
| Roadmap Agent | `/agents/roadmap` | Roadmap | `/product/roadmap` | Keeps the roadmap current. | Turns decisions into an evolving roadmap. |
| Execution Agent | `/agents/execution` | Tasks | `/product/tasks` | Plans into tasks, tracks progress. | Turns plans into tasks and follows progress. |

The hub `/agents` became `/product`. Every old URL redirects to its new one (permanent,
in `next.config.ts`).

## The agents-era lines worth keeping

- Home section 06: label **Agents**, title **"Your product team, in AI."**
- Under it and in the menu card: **"One product's context. Every agent knows it."**
- Menu card link: **"Meet the agents"**.
- Hub (`/agents`): eyebrow **Agents**, headline **"your product team, in AI."**, line
  **"Six agents. One hand-off, from meeting to shipped."**, index headline **"meet the agents."**,
  relay headline **"one card, six hands."**
- Hub meta: **"Six AI agents that run your product work: meetings, research, analytics,
  priorities, roadmap and tasks. Each product keeps its own context."**
- Security: **"Selixa agent, working in {product}"**, **"Agents work inside one product at a time."**
- Use cases: **"Agents you'll lean on"** / **"agents you'll lean on."**
- Integrations: flow column **"Agents"**; **"its six agents work there and write back to your tools."**;
  related headline **"related agents."**
- Cross-links on the detail pages: "Open in Meeting Agent", "Sent to Product Agent",
  "Analyst note · from Analyst Agent", "See how the Analyst Agent tracks it".

## Bringing it back

The code was renamed at the surface only. Internally it still says agent (`AGENTS` and
`AgentSlug` in `lib/content/agents.ts`, `components/agents/*`, `components/agents-hub/*`,
`AgentRelated`), and the slugs (`meeting`, `research`, `analyst`, `product`, `roadmap`,
`execution`) did not change. Only the display names, the copy and the URL segments did.

To restore:

1. In `lib/content/agents.ts`, set each `name` back to "<X> Agent" (table above).
2. In `lib/site.ts`, point `AGENT_PATH` back at `/agents/<slug>` and the hub at `/agents`,
   then move `app/product/*` back to `app/agents/*` and flip the redirects in `next.config.ts`.
3. Put back the copy listed above. `git diff agents-framing` shows every line that changed.
