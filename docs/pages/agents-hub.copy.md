# /agents — copy sheet

Every visible string on the Agents hub (SITE_PLAN §3.1). Section names match the Designer's spec (`docs/pages/agents-hub.md`): Hero, Relay, Index, Context, CTA.

Agent names, lines, "produces" and relay additions come from `lib/content/agents.ts`. Strings marked *(data)* should be read from there, not retyped. Demo numbers are illustrative and follow the home page story.

---

## Page metadata

- **`<title>`:** Agents — Selixa
- **Meta description:** Six AI agents that run your product work: meetings, research, analytics, priorities, roadmap and tasks. Each product keeps its own context.
- **OG title:** Your product team, in AI — Selixa
- **OG description:** One piece of work, six agents, from a meeting to 14 shipped tasks.

---

## Hero

- **Eyebrow:** Agents
- **Headline:** your product team, in AI.
- **Line:** Six agents. One hand-off, from meeting to shipped.
- **Agent tiles (around the orb, hand-off order):** agent `name` *(data)*, without the word "Agent" if the tile is tight: Meeting · Research · Analyst · Product · Roadmap · Execution
- **Scroll hint (optional, under the arc):** Follow one piece of work

---

## Relay

Pinned, scroll-scrubbed. One card travels six stations.

- **Section headline:** one card, six hands.
- **Line:** Watch a problem become a plan.

**The work card**
- **Card label:** Atlas · Work item
- **Card title:** Onboarding is losing people
- **Card state chip, by stage:** New → In review → Prioritized → Now → In progress → Shipped
  - New: before Meeting
  - In review: after Meeting, Research, Analyst
  - Prioritized: after Product
  - Now: after Roadmap
  - In progress: after Execution
  - Shipped: final beat (owner decision: the relay ends shipped)

**Stations** (station label = agent `name`; the row it adds to the card = `handoff` *(data)*)

| # | Station | Adds to the card | Row tag |
|---|---|---|---|
| 1 | Meeting Agent | Decision: ship the shorter onboarding flow | Decision |
| 2 | Research Agent | 3 competitors with shorter onboarding | Evidence |
| 3 | Analyst Agent | Activation −8% since the Aug 12 release | Data |
| 4 | Product Agent | Recommendation: prioritize onboarding | Recommendation |
| 5 | Roadmap Agent | Onboarding v2 moved to Now | Roadmap |
| 6 | Execution Agent | 14 tasks, synced to Linear | Tasks |

**Mini visuals inside the card rows (if the Designer wants them)**
- Research: three small tiles labeled Competitor A · Competitor B · Competitor C (no real brands)
- Analyst: sparkline with the dip, label "Activation −8%"
- Execution: owner avatars Sara Kim · Dev Patel · Maya Chen, and "0 of 14 done"

**Shipped beat** (final, after Execution): the Execution row's count reads "14 of 14 done".

**End state (card unpins)**
- **Line under the finished card:** From one meeting to 14 tasks. Nobody chased it.

**Static / reduced-motion fallback:** show the finished card with all six rows and the same section headline and line. No extra copy.

---

## Index

- **Section headline:** meet the agents.
- **Line:** none (the cards carry it).

**Each card** *(all from data)*
- Icon: `icon`
- Title: `name`
- Body: `line`
- Label + value: **Produces** — `produces`
- Link text: See how it works →

For reference, the six cards read:

| Title | Body | Produces |
|---|---|---|
| Meeting Agent | Joins meetings, captures decisions and follow-ups. | Decisions and action items |
| Research Agent | Finds customer, market and competitor signals. | Evidence from customers and competitors |
| Analyst Agent | Connects product data to what’s happening. | The numbers, with a cause |
| Product Agent | Turns context into priorities and product decisions. | A recommendation |
| Roadmap Agent | Turns decisions into an evolving roadmap. | An up-to-date roadmap |
| Execution Agent | Turns plans into tasks and follows progress. | Tasks with owners |

**Status line in the card corner (optional):** `status` *(data)*, e.g. "In 2 calls today".

---

## Context

"One product's context." Six agents inside one product boundary; a second product greyed beside it.

- **Section headline:** one product's context.
- **Line:** The whole team shares it. No other product can see it.
- **Active boundary label:** Atlas
- **Active boundary tag:** Isolated (with lock icon, as on the home page)
- **Inside the boundary, under the agents:** Meetings · Research · Data · Decisions · Roadmap · Tasks
- **Greyed product label:** Beacon
- **Greyed product tag:** Separate memory
- **Greyed product note:** Same team. Its own context.

Do not use "one brain", "shared memory" or anything implying context crosses products.

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Put the team on your product.
- **Primary action:** `ConversationCTA variant="site"`. Placeholder stays "Enter your product’s website" (from the component; do not override).

---

## TODO(owner)

- None required for this page. Proof (customer quotes, logos) is intentionally absent; per SITE_PLAN §11.8 the hub is a natural home once real proof exists.
