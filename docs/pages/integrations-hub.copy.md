# /integrations — copy sheet

Every visible string on the Integrations directory (SITE_PLAN §4.1). No Designer spec yet; section names follow the plan: Hero, Grid, Flow, Request, CTA.

Tool names, categories and one-line jobs come from `lib/content/integrations.ts`. Strings marked *(data)* should be read from there, not retyped.

---

## Page metadata

- **`<title>`:** Integrations — Selixa
- **Meta description:** Connect Slack, Notion, Linear, Zoom, PostHog and more. Selixa reads them into each product's own context and writes back where your team works.
- **OG title:** Connect what you already use — Selixa
- **OG description:** Eleven tools, one product's context at a time.

---

## Hero

- **Eyebrow:** Integrations
- **Headline:** connect what you already use.
- **Line:** Each tool feeds one product's context. Nothing crosses over.
- **Search placeholder:** Search integrations…
- **Shortcut hint (right side of the field):** ⌘K (show "Ctrl K" on Windows/Linux)
- **Search field label (screen readers):** Search integrations
- **Result count (live region, screen readers):** {n} integrations / 1 integration

**Category chips** (in this order; `CATEGORIES` *(data)*)
- All · Chat · Docs · Issues · Code · Meetings · Feedback · Analytics

**Empty results** (typed query matches nothing)
- **Line:** No match for "{query}".
- **Link:** Request it →
  - Opens the form with the problem field pre-filled: `Integration request: {query}`

**Empty results with a chip selected and no query:** not reachable (every category has at least one tool). No copy needed.

---

## Grid

Logo tiles as on the home page: monochrome at rest, brand color on hover.

**Each tile** *(all from data)*
- Title: `name`
- Sub-line at rest: `category`
- Sub-line on hover/focus: `job` (e.g. "Threads and decisions.")
- Link (whole tile): to `/integrations/{slug}`; accessible name: "{name} integration"

**Status tag:** none. TODO(owner): SITE_PLAN §11.1, which tools are Live vs Coming soon. Do not render a tag until answered.

---

## Flow

Compact diagram: tools → one product's context → agents, with the lock boundary.

- **Section headline:** one product, one context.
- **Line:** What you connect to Atlas stays in Atlas.

**Diagram labels**
- **Left column label:** Your tools
- **Left column items:** the tool marks *(data)*, no text needed beyond `name` as alt/tooltip
- **Center boundary label:** Atlas
- **Center boundary tag:** Isolated (with lock icon, as on the home page)
- **Inside the boundary:** Conversations · Docs · Meetings · Issues · Feedback · Data
- **Right column label:** Agents
- **Right column items:** Meeting · Research · Analyst · Product · Roadmap · Execution
- **Connector labels (optional, small):** reads → / ← writes back
- **Greyed second boundary label:** Beacon
- **Greyed boundary tag:** Separate context
- **Greyed boundary note:** Its own tools. Its own memory.

Do not use "one brain", "shared memory" or anything implying context crosses products.

---

## Request

- **Headline:** don't see yours?
- **Line:** Tell us what you use.
- **Button:** Request an integration
  - Opens the form with the problem field pre-filled: `Integration request: ` (trailing space, caret after it)

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Start with your product's website.
- **Primary action:** `ConversationCTA variant="site"`. Placeholder stays "Enter your product's website" (from the component; do not override).

---

## TODO(owner)

- **Status per tool** (Live / Coming soon), SITE_PLAN §11.1. The grid ships without tags until answered.
- **Permissions and data facts** feed the tool pages, not this one; see `integrations-template.copy.md`.
