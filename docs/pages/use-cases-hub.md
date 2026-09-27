# `/use-cases`: pick your role (design spec)

Plan: `docs/SITE_PLAN.md` §5.1. Copy: `docs/pages/use-cases-hub.copy.md`. Data: `lib/content/use-cases.ts` (`USE_CASES`, `USE_CASE_GROUPS`), agent names/icons from `lib/content/agents.ts`.
Reuses: **`PageHero`, `RelatedCards`, `CTASection`** (agents-hub §5). New shared pieces in §5.

---

## 1. Concept

**The page reshapes around who you are.** A row of role chips sits under the headline; picking one swaps a single, large preview panel below it: that role's pain, the agents they'd lean on, and a four-moment "day with Selixa". The panel never changes size; it cross-fades in place, so the page feels like it *turns to face you* rather than reloading.

Why it can't be mistaken for another page: it's the only page whose hero is a selector with a live answer. Integrations is a search (type → filter), Agents is a relay (scroll → travel); here you choose an identity and the content re-forms. The browseable grid below is deliberately plain.

No auto-rotation of chips or panels, ever. Nothing changes unless the visitor picks.

---

## 2. Page structure

Shell as the agents hub.

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero + role chips + preview | `PageHero` + `RoleTabs` (shared, new) + `RolePreview` (page-local) | load reveal; crossfade on pick |
| 2 | Grid of 12, grouped | `UseCaseGroups` (page-local) using `RelatedCards variant="compact"` | reveal |
| 3 | CTA | `CTASection` | reveal |

Anchors: `#roles` (hero panel), `#all` (grid). Eyebrow for section 2: `01 Every role`.

---

## 3. Sections

### 3.1 Hero

`PageHero align="center"`, not `fill`, `rings` on, `pt-20 sm:pt-28`. Eyebrow **Hero.eyebrow**, H1 **Hero.headline** ("built for people building products.", may wrap to 2 lines ≤ 1280), line **Hero.line**. Visual slot (mt-10): chips, then the panel 28px below.

#### 3.1.1 Role chips (`RoleTabs`)

- Labels and order from the copy table (Solo founder … Multi-product founder), mapped to slugs. **Data request:** add `chip: string` to `UseCase` in `use-cases.ts` (Writer's table) so the label travels with the entry; order the chips by a `CHIP_ORDER: string[]` of slugs exported beside it.
- Chip: `button role="tab"`, `h-10 px-4 rounded-full border border-line bg-ink/[0.02] text-[0.9375rem] text-fg-2 whitespace-nowrap`. Hover `border-line-strong text-fg`. Selected: `border-brand-400/40 bg-brand-500/10 text-fg` + a 6px brand dot before the label (`opacity` 0 → 1; the dot's 12px slot is always reserved so the chip width never changes). Transitions: color, border-color, background-color 200ms; dot opacity 200ms.
- Container `role="tablist" aria-label={Chips.groupLabel}`.
- **Desktop (≥ lg):** the plan asks for "a single line"; 12 chips at this size need ≈1,520px, so on ≥ lg they **wrap to two centred lines** (max-w 60rem, `gap-2`, `justify-center`, 6 + 6 at 1280). See open decision 1.
- **Tablet (md–lg):** same wrap, likely three lines, centred.
- **Phone (< md):** a true single line: `overflow-x-auto snap-x`, chips `snap-start`, `-mx-5 px-5 scroll-px-5`, scrollbar hidden, edge fade `mask-image` (as the integrations chips). On select, the row scrolls the chip to centre with `row.scrollTo({ left, behavior: "smooth" })` (computed from cached chip offsets; never `scrollIntoView`, which could scroll the page).
- **Keyboard (tabs pattern, automatic activation):** roving `tabIndex` (selected = 0, others −1); ← → move and select (wrap), Home/End first/last. Tab moves into the panel.
- **Default:** PM (`product-managers`), per copy. **Deep link:** `#pm`-style hashes are not needed; use `?role={slug}` read on mount, updated with `history.replaceState` on pick (no scroll, no history spam). The server renders the default; a `?role` link hydrates straight into that role (the panel swap happens before paint via layout effect, only once on mount).

#### 3.1.2 Preview panel (`RolePreview`)

One `.window` panel (no bar), radius 24, `max-w-[1040px] mx-auto`, `id="roles"`. Inside, **all 12 previews are rendered, stacked in one grid cell** (`grid [&>*]:col-start-1 [&>*]:row-start-1`), so the panel's height is always the tallest preview: **no layout jump on switch, ever**. Each preview is `role="tabpanel"` with `aria-labelledby` its chip; inactive ones get `inert` + `aria-hidden` and `visibility: hidden` (delayed until their fade-out ends).

**Desktop layout (≥ md)**: `grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 p-8 lg:p-10`.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  Product managers                          A DAY WITH SELIXA                      │
│  Less time collecting context.             ┌──────────────────────────────────┐   │
│                                            │ 9:00  ●  Standup                 │   │
│  THE PAIN                                  │          ◉ Summarized what …     │   │
│  Most of the week goes to chasing          │ 11:00 ●  Customer call           │   │
│  context, not deciding what to build.      │          ◉ Logged onboarding …   │   │
│                                            │ 14:00 ●  Prioritization          │   │
│  AGENTS YOU'LL LEAN ON                     │          ◉ Ranked onboarding …   │   │
│  [▣ Meeting] [▣ Research] [▣ Product]      │ 17:00 ●  Stakeholder update      │   │
│                                            │          ◉ Drafted the weekly …  │   │
│  See the full day →                        └──────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

- **Left column** (flex column, full height):
  - `title` 28px Inter 400 `tracking-[-0.02em] text-fg`; `line` 15px `text-fg-3`, mt-1.
  - Label **Preview.painLabel** (11px uppercase `tracking-[0.14em] text-fg-3`, mt-8) → `pain` 20px `text-fg-2 leading-[1.45] max-w-[30ch] text-pretty`, mt-2.
  - Label **Preview.agentsLabel** (mt-7) → agent chips (mt-3, `flex flex-wrap gap-2`): `.tag` with the agent's lucide icon 12px `text-brand-300` + name without "Agent".
  - Pushed to the bottom (`mt-auto pt-8`): **Preview.link** "See the full day →" as `.link-arrow` to `/use-cases/{slug}`.
- **Right column**: label **Preview.dayLabel**, then the day card `bg-well rounded-[18px] border border-line p-5`:
  - 4 rows, each `grid grid-cols-[3.25rem_14px_1fr] gap-x-3`, row `py-2.5`, `min-h-[64px]`:
    - `time` 12px `text-fg-3 tabular-nums` (top aligned, pt-0.5);
    - node column: 7px dot (`bg-ink/25`, the current row's dot brand, see motion) on a 1px vertical rail `bg-ink/[0.1]` that runs from the first dot to the last;
    - `moment` 14px `text-fg`; under it the Selixa line: `Orb size={12}` + `selixa` 13px `text-fg-2 line-clamp-2`.

**Phone (< md)**: single column, p-5:
- title, line, pain (17px), agent chips;
- day card (p-4): per copy's "if space is tight", rows show `time` + `selixa` only (moment hidden, `sr-only`), `grid-cols-[2.75rem_12px_1fr]`, `min-h-[52px]`;
- link at the bottom.
- The panel's height is the tallest of 12 at 358px (≈ 600px). Acceptable: it's the hero.

**Crossfade on pick** (no layout change; opacity/transform only):
- Outgoing preview: `opacity 1 → 0`, 180ms `ease-out`; then `visibility: hidden` (transition-delay 180ms on `visibility`).
- Incoming: `visibility: visible` immediately; `opacity 0 → 1`, 280ms, delay 60ms. Its inner blocks rise `translateY(6px → 0)` with the same timing, staggered via `--d`: title 0 · pain 40 · agents 80 · day rows 120/170/220/270 · link 300.
- The day card's first row dot turns brand 320ms after arrival, then the rail stays neutral (a single "you are here" beat; no looping).
- Fast repeated picks: each switch just retargets classes; CSS transitions interrupt cleanly.
- Reduced motion: instant swap (no transitions, no stagger).
- Before JS: only the default (PM) preview is visible (server renders `data-active` on it). The other 11 are in the SSR markup with `visibility: hidden` (not `display:none` / `hidden`), so the panel height is correct from the first paint.

### 3.2 Grid of all 12 (`#all`)

`SectionHeader num="01" label="Every role"` + **Grid.headline** ("every role, at a glance."), left aligned. 56px below, three group rows in `USE_CASE_GROUPS` order, separated by `border-t border-line` with `py-8`.

- **Desktop (≥ lg)**: each group `grid grid-cols-[13rem_1fr] gap-8 items-start`. Left: group name 13px uppercase `tracking-[0.14em] text-fg-3` + count (`tabular-nums text-fg-3/70`, e.g. "4"), static (not sticky). Right: `RelatedCards variant="compact"` with the group's 4 use cases in `grid-cols-4 gap-3`.
- **Tablet (md–lg)**: group label above its cards; cards `grid-cols-2`.
- **Phone**: group label above; cards `grid-cols-1`, compact cards become rows: icon 32 left, title + line, arrow right (`RelatedCards` compact already supports this at narrow widths: see §5.2).
- Card content: icon (use-case icon map, §5.3), `title`, `line`, link text **Grid.cardLink** "Read more", whole card `<a href="/use-cases/{slug}">`. Hover/focus: the compact card's lit layer (brand), icon tile fills, arrow nudges; 200ms. Nothing lights on its own.
- Reveal: group label 0, cards stagger 50ms.
- Group membership comes from data (`group`): Founders = Solo founders, Lean startups, Multi-product founders, Venture studios; Product teams = Product managers, Heads of product, Engineering leads, Design teams; Around the product = Product-led SaaS, Customer success, Product ops, Agencies and studios. Within a group, keep data order.

### 3.3 CTA

`<CTASection title={CTA.headline} line={CTA.line} />`.

---

## 4. Light and dark

- Tokens only. The panel is `.window`; the day card `bg-well` (a faint darker well in dark, a faint grey in light: both read as "inside" the panel).
- Selected chip uses the brand ramp; in the mono theme it's a neutral lift, which is fine because the dot and the text colour also change.
- No scheme-specific rules needed.

---

## 5. New shared components

### 5.1 `RoleTabs` (`components/site/RoleTabs.tsx`)

```ts
type RoleTabsProps = {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  label: string;                 // aria-label for the tablist
  idPrefix: string;              // tab id = `${idPrefix}-tab-${id}`, panel id = `${idPrefix}-panel-${id}`
  wrap?: "lines" | "scroll" | "responsive"; // default responsive: wrap ≥ md, scroll < md
};
```

The chip look and keyboard model in §3.1.1. Reused by: `/get-started` step 3 pains (as a multi-select variant later), `/agents/roadmap` product switcher (Atlas/Beacon/Cove/Drift), blog category filter.

### 5.2 `RelatedCards` compact: phone row layout

Extend agents-hub §5.3 compact: below `sm`, the card lays out as a row (`flex items-center gap-4 p-4`, icon tile 36 → 32, title 15px, body 13px `line-clamp-1`, arrow at the right) so 12 cards stack at ~72px each instead of ~150px. Same props.

### 5.3 Use-case icon map

Nav already pairs each use case with a lucide icon (`User`, `Rocket`, `Users`, `Layers`, `Eye`, `Code`, `PenTool`, `ChartLine`, `Headphones`, `Workflow`, `Briefcase`, `FlaskConical`). Move that pairing to one helper keyed by slug (e.g. `lib/content/use-case-icons.ts` exporting icon *names* like `agents.ts` does, mapped to components in `components/site/icons.ts`), and make Nav, this page and the template read it. Also point the Nav's use-case links at `/use-cases/{slug}` once pages exist.

---

## 6. Acceptance checklist (Reviewer)

- [ ] Hero shows chips and the PM preview on load; the top of the panel is visible at 1280×720.
- [ ] Picking any chip cross-fades the panel in place: DevTools shows **no layout shift** (panel height constant across all 12; CLS 0 on switching).
- [ ] Chips keep their width when selected (dot slot reserved).
- [ ] Keyboard: Tab reaches the selected chip; ←/→ switch roles (wrap); Home/End; Tab moves into the panel. Screen reader announces tab + panel.
- [ ] `?role=engineering-leads` opens with that role selected; picking updates the URL without new history entries.
- [ ] Phone 390: chips on one scrolling line with edge fades; selecting scrolls the chip row (not the page); preview single column with time + Selixa line only; no horizontal page scroll.
- [ ] Grid: three labelled groups (Founders, Product teams, Around the product) with 4 cards each, linking to `/use-cases/{slug}`; phone shows compact rows.
- [ ] Nothing rotates or lights on a timer.
- [ ] Reduced motion: instant swaps.
- [ ] Light and dark, mono and crimson; tokens only.
- [ ] Ends with `CTASection` (`ConversationCTA variant="site"`); no other primary button; no invented proof.

---

## 7. Open decisions

1. **"A single line of role chips."** Twelve chips don't fit one line on desktop at a readable size. This spec wraps them to two centred lines on desktop and keeps a true single (scrolling) line on phone. The alternative is a single desktop line with horizontal scroll, which hides half the roles.
2. **Chip labels in data.** Needs a `chip` field on each use case (Writer's table already has the words).
3. **Order.** Chips follow the copy table order (Solo founder first) but default to PM. If you'd rather the default chip be first, move PM to the front.
