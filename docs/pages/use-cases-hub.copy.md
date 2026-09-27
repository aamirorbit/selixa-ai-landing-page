# /use-cases — copy sheet

Every visible string on the Use cases hub (SITE_PLAN §5.1). No Designer spec yet; section names follow the plan: Hero, Role chips, Preview panel, Grid, CTA.

Titles, one-liners, pains, agents and day moments come from `lib/content/use-cases.ts`. Strings marked *(data)* should be read from there, not retyped. Agent names come from `lib/content/agents.ts`.

---

## Page metadata

- **`<title>`:** Use cases — Selixa
- **Meta description:** How founders, product teams and the people around them use Selixa, an AI Product Manager. Pick your role and see a day with it.
- **OG title:** Built for people building products — Selixa
- **OG description:** Twelve roles, one AI product team. Every product keeps its own context.

---

## Hero

- **Eyebrow:** Use cases
- **Headline:** built for people building products.
- **Line:** Pick your role. See your day with Selixa.

---

## Role chips

One line of chips. Chip labels are shorter than the menu titles; each maps to a `slug`.

| Chip | Slug |
|---|---|
| Solo founder | solo-founders |
| Startup | lean-startups |
| PM | product-managers |
| Head of product | heads-of-product |
| Engineering lead | engineering-leads |
| Design | design-teams |
| Customer success | customer-success |
| Product ops | product-ops |
| Agencies | agencies-and-studios |
| Venture studios | venture-studios |
| Product-led SaaS | product-led-saas |
| Multi-product founder | multi-product-founders |

- **Default selection:** PM
- **Chip group label (screen readers only):** Choose your role

---

## Preview panel

Swaps (crossfade) when a chip is picked.

- **Title:** `title` *(data)*
- **Sub-line:** `line` *(data)*
- **Label:** The pain
- **Value:** `pain` *(data)*
- **Label:** Agents you'll lean on
- **Value:** agent `name` for each of `agents` *(data)*, as small chips
- **Label:** A day with Selixa
- **Value:** the four `day` moments *(data)*: `time` · `moment`, then `selixa` underneath. If space is tight, show `time` + `selixa` only.
- **Link (to `/use-cases/{slug}`):** See the full day →

---

## Grid

- **Section headline:** every role, at a glance.
- **Line:** none.

**Group headings** (order): *(data: `USE_CASE_GROUPS`)*
- Founders
- Product teams
- Around the product

**Each card** *(all from data)*
- Title: `title`
- Body: `line`
- Link text (or whole card as link): Read more →

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Whatever your role, start with your product.
- **Primary action:** `ConversationCTA variant="site"`. Placeholder stays "Enter your product’s website" (from the component; do not override).

---

## TODO(owner)

- None required. No proof (logos, quotes, counts) on this page until supplied.
