# /use-cases/[slug] — copy sheet (shared template)

Shared strings for all 12 use-case pages (SITE_PLAN §5.2). Per-page content comes from `lib/content/use-cases.ts`; strings marked *(data)* are read from there. Agent names and lines come from `lib/content/agents.ts`. Section names follow the plan: Hero (split), Timeline, Agents, Integrations, CTA. Variants A/B/C change layout only, never copy.

---

## Page metadata (pattern)

- **`<title>`:** {title} — Selixa use cases
  - e.g. "Product managers — Selixa use cases"
- **Meta description:** {line} {pain} See a day with Selixa, the AI Product Manager.
  - e.g. "Less time collecting context. Most of the week goes to chasing context, not deciding what to build. See a day with Selixa, the AI Product Manager."
- **OG title:** Selixa for {title lowercase}
  - e.g. "Selixa for product managers"
- **OG description:** {line} *(data)*

---

## Hero (draggable split)

- **Eyebrow:** Use cases · {title} *(data)*
- **Headline:** {line lowercase, as on the home page} *(data)*, e.g. "less time collecting context."
- **Line:** `pain` *(data)*

**Split**
- **Left label:** Without Selixa
- **Left items:** `without` *(data)*, shown as scattered scraps (tabs, notes, stale roadmap)
- **Right label:** With Selixa
- **Right items:** `with` *(data)*, same order, so item 1 left matches item 1 right
- **Drag hint (on the divider, fades after first drag):** Drag to clear the chaos
- **Divider handle (screen readers):** Compare without and with Selixa
- **Keyboard hint (screen readers):** Use the arrow keys to move the divider

**Touch toggle** (replaces the drag on touch devices)
- **Option 1:** Without
- **Option 2:** With Selixa
- **Default:** Without, so the first tap shows the change

---

## Timeline

- **Section headline:** a day with Selixa.
- **Line:** Four moments. What Selixa did in each.
- **Each moment** *(data)*: `time` · `moment`, then `selixa`
- **Small label before `selixa` (optional):** Selixa

---

## Agents

- **Section headline:** agents you'll lean on.
- **Line:** none.
- **Each card** *(data, from agents.ts via `agents`)*: `name`, `line`
- **Card link:** See how it works → (to `/agents/{slug}`)

---

## Integrations

- **Section headline:** tools you'll connect.
- **Line:** Selixa reads them for this product only.
- **Each tile** *(data)*: logo + `name` from `integrations`
- **Link:** All integrations → (to `/integrations`)

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Start with your product's website.
- **Primary action:** `ConversationCTA variant="site"`. Placeholder stays "Enter your product’s website" (from the component; do not override).

---

## Notes for Designer / Builder

- Multi-product founders, Agencies and studios, and Venture studios: their `day` lines name separate products (Atlas, Beacon, Cove, Drift) on purpose. If the split visual shows product labels, keep each product in its own container; never merge them.
- `without` and `with` always have the same length (3 or 4), paired by index.

## TODO(owner)

- None required. No testimonials or customer quotes per role until supplied.
