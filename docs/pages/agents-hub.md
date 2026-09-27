# `/agents` — the relay (design spec)

Plan: `docs/SITE_PLAN.md` §3.1. Copy: `docs/pages/agents-hub.copy.md`. Data: `lib/content/agents.ts` (`AGENTS`, hand-off order).
First page built after home, so it also defines four shared components: **`PageHero`, `StickyScene`, `RelatedCards`, `CTASection`** (§5).

---

## 1. Concept

**One piece of work travels the whole team.** The page pins. A single work card, *Onboarding is losing people*, moves across six agent stations as you scroll. Each station adds one row to the card, and by the last station it's a planned, owned, shipped piece of work.

Why it can't be mistaken for another page: it's the only page where **one object moves through a line of stations**. Meeting is a timeline, Research a canvas, Roadmap a sideways board, Execution a kanban. The home page's Agents section shows six cards lighting in place; here the *work* moves and the agents stand still.

Everything else on the page is quiet (fade-ins, one in-view sequence) so the relay has room.

---

## 2. Page structure

Same shell as `app/page.tsx`: `<Nav />`, `<main className="relative flex-1 overflow-x-clip">` with the `max-w-[1280px] px-5 sm:px-8` container, `<Footer />`, `<ScrollReveal />`. No `<Background>` image.

> `overflow-x-clip` on `main` is fine for sticky. Never put `overflow-hidden`/`overflow-x-hidden` on any ancestor of `StickyScene`: it breaks `position: sticky`.

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero | `PageHero` + `AgentArc` (new, page-local) | load reveal + one short loop |
| 2 | Relay | section header + `StickyScene` + `Relay` (page-local) | **scroll-scrubbed** (the only one) |
| 3 | Index | `RelatedCards variant="large"` + `RelayStrip` (page-local) | reveal; hover lights strip |
| 4 | Context | `ContextBoundary` (page-local) | reveal + one in-view sequence |
| 5 | CTA | `CTASection` | reveal |

Section anchors: `#relay`, `#team`, `#context`. Eyebrows are numbered like home: `01 The relay`, `02 The team`, `03 Context` (label words are the Writer's section names if they want different ones).

Icons: `agent.icon` string → lucide component map (`Video`, `Telescope`, `ChartLine`, `Compass`, `Map as MapIcon`, `ListChecks`), one map in `lib/content/agents.ts`-adjacent helper so Nav/home can reuse it.

Data fields used on this page: `slug`, `name` (hero tiles and stations drop the word "Agent"), `line`, `produces`, `handoff`, `status`, `icon`. Not used here: `short` (menu) and `doing` (home and detail pages).

---

## 3. Sections, top to bottom

### 3.1 Hero

**Layout.** `PageHero align="center" fill` (see §5.1). Min height `calc(100svh - 4.5rem)` on ≥`md` so hero + arc fit one screen; content vertically centred.

- Eyebrow pill with `live-dot`: copy **Hero.eyebrow** ("Agents").
- H1: **Hero.headline**, Satoshi Light, lowercase, `clamp(2.75rem, 6.4vw, 5.75rem)`, `leading-[0.95] tracking-[-0.05em]`. One line on desktop, may wrap on phone.
- Line: **Hero.line**, 18/20px Inter, `text-fg-2`, max 38rem.
- Visual slot: `<AgentArc />`.
- Under the arc: **Hero.scrollHint** as a small `text-fg-3` 13px link to `#relay` with a `ChevronDown` (12px). Chevron bobs 4px on a 2.4s CSS keyframe (transform only). Lenis handles the anchor glide.

**`AgentArc` (desktop ≥ md).** A 1000×300 box (scales with width, `max-w-[1000px] w-full aspect-[10/3]`).
- Orb (`<Orb size={88} />`) centred at (500, 270).
- Six tiles placed on the upper half of an ellipse centred (500, 270), rx 430, ry 210, at angles 180°, 144°, 108°, 72°, 36°, 0° in hand-off order (Meeting at far left, Execution far right). Positions are percentages of the box, `translate(-50%,-50%)`.
- Tile: `.card` pill, h-11, px-3, icon tile 28px (`border-line bg-ink/[0.03] text-brand-300`, radius 8) + name without "Agent" (Inter 14px, `text-fg-2`).
- The hand-off line: one SVG path along the same ellipse arc from Meeting to Execution, `stroke: rgb(var(--brand-400-rgb)/0.55)`, 1px, `vector-effect: non-scaling-stroke`, `pathLength="1"` with the existing `.draw` class, turned on 300ms after the H1 reveal (page load, before any scroll). A faint full ring (`border-ink/[0.05]`) around the orb, as on home.

**`AgentArc` phone (< md).** Box 358×220. Orb 64px at (50%, 88%). Tiles become **icon-only 40px squares** on an ellipse rx 150, ry 150 (same angles). Names hidden (the whole arc is `aria-hidden`; the Index is the accessible list). Line drawn the same way.

**Hero loop** (`useSequence` on the arc, plays only in view):

| Step | ms | Frame |
|---|---|---|
| 0–5 | 320 each | tile *i* gets `.is-live` and its icon tile fills `bg-brand-500 text-white`; tiles before it show a 6px brand dot at their top-right (done) |
| 6 | 450 | orb glow layer (radial brand glow, `opacity` 0→1) pulses; all six show done dots |
| 7 | 3000 | hold: all done dots, no live tile, orb glow off |

Loop total ≈ 5.4s. Reduced motion / before JS: step 7 frame (all done dots, line fully drawn).

### 3.2 Relay (the signature)

**Header (normal flow, above the pinned stage).** `SectionHeader num="01" label="The relay"` with **Relay.headline** as title and **Relay.line** as lead. Align left on desktop, left on phone. `pt-24 sm:pt-32`, then the scene immediately. The header scrolls away; only the stage pins.

**Scene.** `<StickyScene id="relay" length={3.4} label={Relay.headline}>` (see §5.2). Stage = `calc(100svh - 4.5rem)` tall, pinned under the nav, content centred vertically, max width 1120px centred.

#### Beat map (exact)

Progress `p` 0→1 across the pinned scroll. Six station windows of 0.15 each starting at 0.04, then an outro.

| Beat | Station | Window | Card travels in | Station "working" at | Row lands at | Card state chip after landing |
|---|---|---|---|---|---|---|
| — | intro | 0.00–0.04 | — (card sits under station 1) | — | — | **New** |
| 1 | Meeting | 0.04–0.19 | — | 0.04 | 0.08 | In review |
| 2 | Research | 0.19–0.34 | 0.19–0.24 | 0.21 | 0.25 | In review |
| 3 | Analyst | 0.34–0.49 | 0.34–0.39 | 0.36 | 0.40 | In review |
| 4 | Product | 0.49–0.64 | 0.49–0.54 | 0.51 | 0.55 | Prioritized |
| 5 | Roadmap | 0.64–0.79 | 0.64–0.69 | 0.66 | 0.70 | Now |
| 6 | Execution | 0.79–0.94 | 0.79–0.84 | 0.81 | 0.85 | In progress |
| 7 | shipped | 0.94–1.00 | — | — | 0.94 | **Shipped** (see Open decision 1) |

Implementation:

```ts
const BEATS = [0.04, 0.08, 0.21, 0.25, 0.36, 0.40, 0.51, 0.55, 0.66, 0.70, 0.81, 0.85, 0.94];
const b = useSceneBeat(BEATS);            // 0…13, re-renders only when it changes
// station i (0-based): working ⇔ b === 2i+1 ; done ⇔ b >= 2i+2 ; row i shown ⇔ b >= 2i+2
// shipped ⇔ b === 13
// continuous station position s ∈ [0,5], used for travel (never React state):
const TRAVEL = [0.19, 0.34, 0.49, 0.64, 0.79];   // start of each 0.05-long move
s = Σ_k smoothstep(seg(p, TRAVEL[k], TRAVEL[k] + 0.05))
```

- **Scrubbed (continuous, via `useSceneProgress`, imperative style writes):** card position, notch/token position, rail fill. Nothing else.
- **Stepped (via beat index → CSS transitions, time-based):** station states, card rows, chip, lit layers. Transitions are short and fixed so it feels snappy regardless of scroll speed: rows 320ms opacity + `translateY(6px→0)`, chips 200ms cross-fade, lit layers 400ms opacity. All reverse cleanly when scrolling back (beats are a pure function of `p`).
- Scroll budget: 3.4 viewports total. Each station holds for ~0.09 × 3.4 ≈ 0.3 viewport (~250px on a laptop): enough to read one row, never a slog.

#### The work card (both layouts)

A `.window`-styled panel (no window bar), radius 18, `bg-panel`. **Its height is fixed at the finished frame from the start**: all six rows are always in the DOM, un-landed rows sit at their empty state. Nothing ever changes size while scrolling.

- **Header** (h ≈ 76): left, product chip (20px `bg-brand-500 text-white` square "A" + **Relay.card.label** "Atlas · Work item", 12px `text-fg-3`); right, the **state chip** (`.tag`). Title below: **Relay.card.title**, Inter 17px, weight 400, `tracking-[-0.015em] text-fg`.
  - State chip: all six labels (New, In review, Prioritized, Now, In progress, Shipped) are stacked in one grid cell (`grid [&>*]:col-start-1 [&>*]:row-start-1`), only the current one at `opacity:1`. The cell is as wide as the widest label, so no width changes. "Prioritized" onward uses the brand tint (`border-brand-400/30 bg-brand-500/10 text-brand-200`), "Shipped" adds a `Check` icon.
- **Rows** (6 × 48px, `border-t border-line`, px-5): line 1 (11px, `text-fg-3`, uppercase tracking 0.12em) = **row tag** from copy (Decision, Evidence, Data, Recommendation, Roadmap, Tasks), with the mini visual right-aligned on the same line; line 2 (13.5px `text-fg`, single line, `truncate`) = `agent.handoff` **with a leading "Word: " stripped** (`handoff.replace(/^[A-Z][a-z]+:\s*/, "")`) since the tag already says it.
  - **Empty state** (before landing): tag line in `text-fg-3/60`, text line replaced by a static 60%-wide 6px bar `bg-ink/[0.06]` rounded. The real text sits in the same cell at `opacity:0` (cross-fade, no reflow).
  - **Working state** (the station's "working" beat): the empty bar is swapped (opacity) for the existing `.thinking` dots.
  - **Landed**: text fades up (320ms), mini visual fades in 80ms later.
- **Mini visuals** (all ≤ 64px wide, 16px tall, opacity/transform only):
  1. Meeting: none (the tag carries it).
  2. Research: three 16px squircles overlapped −4px, `bg-ink/[0.14] / [0.09] / [0.2]`, letters A B C 9px `text-fg-2`. No brands.
  3. Analyst: 56×16 SVG sparkline, flat then a dip at 70%: base stroke `text-fg-3`, dip segment + end dot `brand-400`. Appears whole (opacity + `translateX(-4px→0)`), never draws via dash offset.
  4. Product: none; instead the **whole card's lit layer** turns on (a pre-rendered `card-lit` overlay, `inset-0 rounded-[18px]`, `opacity` 0→1). It stays on to the end.
  5. Roadmap: a 3-cell segmented pill "L · N · Now" (22px cells, `border-line`), a 6px brand dot starts in L and moves to "Now" with `translateX` 400ms, 120ms after landing.
  6. Execution: three `Avatar`s (SK, DP, MC) at 20px, overlapped −6px, then "`<Count>` of 14" in 12px tabular `text-fg-2`. On landing the count shows **0 of 14**; at the Shipped beat it counts to **14 of 14** (`Count` 500ms).
- **Shipped beat (0.94):** chip → Shipped; card lifts `translateY(-4px)` (300ms); a brand glow layer under the card fades to `opacity:1`; the rail fill is complete; the Execution station shows its done check. **Relay.endLine** ("From one meeting to 14 tasks. Nobody chased it.") fades in (desktop: left of the card, vertically centred on it, max-w 18rem, 18px `text-fg-2`; phone: under the card, centred, 15px).

#### Desktop and tablet layout (≥ md, 768px+)

```
┌──────────────────────────── stage (100svh − 72px), content centred ───────────────────────────┐
│   [■]Meeting      [■]Research     [■]Analyst      [■]Product      [■]Roadmap     [■]Execution │  stations row
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━───────────────────────────────────────────────●    │  rail (fill scrubbed)
│        │  ← notch (moves with s)                                                              │
│  ┌─────┴──────────────┐                                                                       │
│  │ A Atlas · Work item   [In review]                                                         │
│  │ Onboarding is losing people      │                                     (endLine appears   │
│  │ DECISION                         │                                      here at shipped)  │
│  │ ship the shorter onboarding flow │                                                        │
│  │ …six rows…                       │                                                        │
│  └──────────────────────────────────┘  → translates right station by station                 │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Stations row**: `grid grid-cols-6`, full width of the 1120 track. Each station centred: icon tile 44px (radius 12, `border-line bg-ink/[0.03] text-brand-300`), name below (Inter 13px `text-fg-2`, "Agent" dropped below `lg`), state line (12px, fixed 16px height): idle = small `bg-ink/20` dot + nothing; working = `live-dot` + "Working"; done = `Check` 12px `text-brand-300`. Tile fill for working/done is a pre-rendered overlay (`bg-brand-500`, white icon) at `opacity` 1 for working, 0.9 for done; idle 0.
- **Rail**: 1px line at the icon tiles' vertical centre, running from station 1's centre to station 6's centre (`left: 1/12, right: 1/12` of the track). Base `bg-ink/[0.1]`; fill layer `bg-brand-400` with `transform: scaleX(s/5)`, `transform-origin: left`. Station tiles sit above the rail (z-index).
- **Card**: width 360 (`md`: 320). It lives in a track the full width of the stations row. Card centre target for station *i*: `x_i = (i + 0.5)/6 × W`, clamped to `[cardW/2, W − cardW/2]`; for fractional `s`, interpolate between neighbouring clamped targets. Applied as `transform: translate3d(x − cardW/2, 0, 0)`.
- **Notch**: a 1px × 32px vertical line (`bg-brand-400/60`) with a 6px brand dot at its top, from the rail down to the card's top edge. Its x is the **unclamped** station centre interpolated with `s`, so it always points exactly at the active station even when the card is clamped at the ends. Separate element, same transform approach.
- Gap stations→card: 32px. Short viewports (`@media (max-height: 760px)`): rows 44px, header 68px, station tiles 36px.
- `W` and `cardW` measured with a `ResizeObserver` on the track and cached; never read layout inside the scroll callback.

#### Phone layout (< md, 390px reference): the vertical relay

The card *is* the relay line. No horizontal travel: the work moves **down** the team.

```
┌ stage (100svh − 72px), card centred vertically ┐
│ ┌──────────────────────────────────────────┐   │
│ │ A Atlas · Work item          [In review] │   │
│ │ Onboarding is losing people              │   │
│ ├─[■]┬─────────────────────────────────────┤   │
│ │ ┃  │ MEETING · DECISION                  │   │  node + row
│ │ ●  │ ship the shorter onboarding flow    │   │  ● = token, moves down with s
│ ├─[■]┼─────────────────────────────────────┤   │
│ │ ┆  │ RESEARCH · EVIDENCE        ▣▣▣      │   │
│ │ …  │ ▬▬▬▬▬▬ (empty)                       │   │
│ └──────────────────────────────────────────┘   │
│      From one meeting to 14 tasks. …           │  endLine at shipped
└────────────────────────────────────────────────┘
```

- Card full width (358px). Rows 52px (two lines, as desktop). Each row gets a **left node column** 40px wide: the agent's icon tile at 28px (same idle/working/done overlays as desktop stations).
- Because stations aren't shown separately, row line 1 reads `<short agent name> · <tag>` (e.g. "MEETING · DECISION"), agent name from `name` minus " Agent".
- **Rail**: 1px vertical line through the node centres (first to last). Fill layer `scaleY(s/5)`, origin top.
- **Token**: an 8px brand dot with a soft glow sitting on the rail, `translate3d(0, y(s), 0)` where `y` interpolates the measured node centres. It replaces the moving card: the work visibly passes down the team.
- Height: header ~76 + 6 × 52 + 16 ≈ 404px; fits a 667px-tall phone (stage ≈ 595) with the end line. If the stage is < 520px tall (landscape phones), `StickyScene` falls back to static (see §5.2 `minStageHeight`).

#### Static frame (reduced motion, no JS, landscape phones)

`p = 1`: all six stations done, rail fully filled, card at the last station (desktop) / token at the last node (phone), all rows landed, chip **Shipped**, lit layer and glow on, `14 of 14`, end line visible. No pinning, no extra scroll length: the section reads as a finished diagram. For assistive tech, the stage has an `sr-only` ordered list: "{name}: {handoff}" × 6, then the end line. The visual stage is `aria-hidden`.

### 3.3 Index ("the team")

- Header: `SectionHeader num="02" label="The team"` with **Index.headline**; no lead. `id="team"`.
- **`RelayStrip`** (≥ lg only, hidden below): the relay line in miniature, centred, max-w 720px, 40px under the header. Six 8px dots on a 1px `bg-ink/[0.1]` line, the agent name without "Agent" 12px `text-fg-3` under each. Fully "done" (dots `bg-ink/30`). When a card is hovered or keyboard-focused, its dot gets a brand overlay (`opacity`) and `scale(1.6)`, its label turns `text-fg` (200ms). This is the "hovering lights its station in the relay line" from the plan; the real relay is off-screen by now, so the strip stands in for it.
- **Grid**: `RelatedCards variant="large"` with the six agents, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3`, 48px under the strip. `onActive(i | null)` drives the strip.
- Card content (see §5.3): icon, corner `status` (12px `text-fg-3` with a `bg-ink/20` dot), `name`, `line`, footer label **Produces** + `produces`, link text **Index.linkText** → `/agents/${slug}`.
- Reveal: cards `data-reveal` staggered 60ms.

### 3.4 Context ("one product's context")

- Header centred: `SectionHeader num="03" label="Context" align="center"` + **Context.headline**, **Context.line**. `id="context"`.
- **Diagram** 56px below, `ContextBoundary` ×2:
  - Desktop (≥ lg): two boundaries side by side, `grid-cols-[1.4fr_1fr] gap-6`, max-w 1040 centred, items aligned centre.
  - Tablet/phone: stacked, Atlas first, Beacon below at full width, gap 16.
- **Atlas (active)**: `.window` panel, radius 24, p-6.
  - Top row: product chip (20px `bg-brand-500` "A") + "Atlas" 15px `text-fg`; right, `.tag` with `Lock` + **Isolated** in the brand tint (exact classes from `Products.tsx`).
  - Middle: `Orb size={56}` centred with six 36px agent icon tiles on a ring (radius 112 desktop, 92 phone) at 60° steps starting at −90° (Meeting on top, clockwise in hand-off order). 1px spokes from orb to each tile (`bg-ink/[0.08]`, drawn as rotated divs, not SVG draw).
  - Bottom: the six memory chips from copy (Meetings · Research · Data · Decisions · Roadmap · Tasks) as `.tag`s, wrapping, centred.
- **Beacon (greyed)**: same structure, smaller ring (radius 84), `opacity: 0.5` statically. No brand colour: its chip is `bg-ink/[0.14]` "B", its tag is neutral `.tag` with `Lock` + **Separate memory**, and under the ring its note **Context.greyedNote** (13px `text-fg-3`) instead of chips. Not interactive.
- **Motion** (`useSequence`, plays once per entry, no loop): spokes `line-in` all at once (400ms), then Atlas tiles fade/scale in (`.st`, 60ms stagger), then chips (40ms stagger), then hold. Beacon only reveals (`data-reveal`, delay 200ms). Reduced motion: everything shown. The Orb keeps its existing breathe.

### 3.5 CTA

`<CTASection title={CTA.headline} line={CTA.line} />` (§5.4). It holds `ConversationCTA variant="site"`, the page's one primary action.

---

## 4. Light and dark

- All surfaces are tokens: card/boundaries use `.window`/`.card`; rails and empty bars use `bg-ink/[x]`; lit states use the brand ramp (`brand-400/500`, `brand-*-rgb`). No hex, no `white/` utilities (white text only on `bg-brand-500` fills, same as home).
- The Orb stays dark in both schemes (existing `.orb`).
- **Light**: the card's lit overlay (`card-lit`) and the shipped glow use `--brand-glow-rgb` at the same alpha as home; check the glow doesn't muddy the `bg-panel` white. If it does, halve the glow alpha under `:root[data-scheme="light"]` (only scheme-specific rule on this page).
- Beacon's 0.5 opacity reads as "greyed" in both schemes; do not use `filter: grayscale` (costly, and not needed since it has no colour).
- The site's active theme may be mono (`ACTIVE_THEME`): nothing here hard-codes crimson, so the relay works in any theme.

---

## 5. Shared components (build here, reuse everywhere)

Put them in `components/site/` (not `landing/`, which stays the home page).

### 5.1 `PageHero`

```ts
type PageHeroProps = {
  eyebrow: string;            // shown in the .pill
  live?: boolean;             // live-dot in the pill (default true)
  title: ReactNode;           // h1, Satoshi Light
  line?: ReactNode;           // one sentence
  visual?: ReactNode;         // the page's signature visual
  after?: ReactNode;          // e.g. scroll hint
  align?: "center" | "left";  // default center
  fill?: boolean;             // min-h calc(100svh - 4.5rem) on md+, content centred
};
```

Look: `.pill` eyebrow → h1 `font-display font-light text-[clamp(2.75rem,6.4vw,5.75rem)] leading-[0.95] tracking-[-0.05em] text-balance` → line 18/20px `text-fg-2 max-w-[38rem]` → visual (mt-14, full container width) → `after` (mt-8). Load reveal uses the existing `.reveal` + `d()` delays: pill 60, h1 140, line 220, visual 320, after 420. Soft rings/glow behind (the home hero's ring layer, minus the horizon glow) as an optional `rings` boolean, default true. Reused by every page (§9).

### 5.2 `StickyScene` (the important one)

**Purpose.** A section that pins its stage for a set scroll distance and tells its children how far through they are (0→1). Used by: Agents hub relay, Meeting timeline, Roadmap horizontal board, Research board.

**API**

```tsx
<StickyScene
  id="relay"
  length={3.4}            // pinned scroll distance, in viewport heights (svh)
  top="4.5rem"            // pin offset = nav height (default)
  minStageHeight={520}    // below this stage height → static fallback (default 520)
  label="…"               // aria-label for the section
  className?              // on the stage
>
  {children}
</StickyScene>

// inside children:
useSceneProgress((p: number) => void)      // imperative; called at most once per frame
useSceneBeat(thresholds: number[]): number // count of thresholds ≤ p; state changes only on crossing
useSceneStill(): boolean                   // true in static mode → render the finished frame
// helpers (same module): seg(p, a, b) = clamp01((p - a) / (b - a)); smoothstep(t)
```

**DOM and CSS** (add a "Scroll scenes" block to `app/globals.css`):

```html
<section class="scene" style="--scene-len: 3.4" aria-label="…">
  <div class="scene-stage"> …children… </div>
</section>
```

```css
/* Static by default: no JS, reduced motion, or tiny viewports read as a normal section. */
.scene { position: relative; }
.scene-stage { position: relative; }

:root[data-motion="on"] .scene[data-live] {
  height: calc(100svh - var(--scene-top, 4.5rem) + var(--scene-len) * 100svh);
}
:root[data-motion="on"] .scene[data-live] .scene-stage {
  position: sticky;
  top: var(--scene-top, 4.5rem);
  height: calc(100svh - var(--scene-top, 4.5rem));
  overflow: clip;
}
```

- **`data-motion="on"`** is set on `<html>` **before first paint** by extending the existing inline script in `app/layout.tsx` (`applySavedScheme`): `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.motion="on"`. So the tall, pinned layout is decided before paint (no layout jump at hydration) and never applies without JS or with reduced motion.
- **`data-live`** is rendered by the server (so the height is right from the first paint). The component removes it on mount only if the stage would be shorter than `minStageHeight` (landscape phones), and re-checks on resize. That's the only runtime layout switch and it happens at mount/resize, never mid-scroll.
- Use `svh`, not `vh`/`dvh`: the scene length must not change when the mobile URL bar shows/hides, or progress jumps.

**How progress is computed**

```
on mount + ResizeObserver(section) + window resize:
  topPx   = parseFloat(getComputedStyle(stage).top)          // 72
  start   = section.getBoundingClientRect().top + scrollY - topPx
  range   = section.offsetHeight - stage.offsetHeight         // = length × 100svh
per frame (only while active):
  p = clamp01((window.scrollY - start) / range)
```

- **Source of scroll:** Lenis scrolls the real window (`window.scrollTo` each frame), so a plain passive `window` `scroll` listener sees every smoothed position. Don't create another Lenis or reach into its instance; anchors, keyboard and touch all work the same.
- **Throttle:** the scroll listener only sets a `pending` flag and requests one `requestAnimationFrame`; the rAF reads `scrollY` (no layout read), computes `p`, and notifies subscribers **only if `|p − last| > 0.0005`** or `p` hit 0/1. At most one computation per frame; zero work when idle.
- **Activity gate:** an `IntersectionObserver` (rootMargin `50% 0px`) attaches the scroll listener when the section is near the viewport and detaches it when far. On detach, snap `p` to 0 or 1 (whichever side the section left from) so a fast scroll or anchor jump never leaves the scene mid-beat.
- **Delivery (no React re-render per frame):**
  1. `useSceneProgress(cb)`: subscribers are plain callbacks held in a ref-based store (`useSyncExternalStore`-style subscribe, but callbacks, not state). Children write `el.style.transform` directly from `cb`. Transforms only, `translate3d`/`scale`.
  2. `useSceneBeat(thresholds)`: a subscriber that computes the beat index and calls `setState` only when it changes (13 state changes across the whole relay).
  3. The stage also carries `--p` (set in the same rAF via `stage.style.setProperty`) for CSS-only children; use sparingly, since it restyles the stage subtree each frame.
- **`will-change: transform`** is added to moving elements only while the scene is active (attach) and removed on detach.
- **Still mode:** `useSceneStill()` is `true` during SSR and whenever motion is off (`data-motion` absent or `data-live` removed). In still mode progress is fixed at **1** and beats at their max, so the server HTML and the fallback both show the finished frame. On mount with motion on, the first progress is computed in a layout effect so the correct frame appears before paint.
- **Children map progress to beats** with the two tools above: continuous things (travel, fills, camera pans) through `useSceneProgress` + `seg`/`smoothstep`; discrete things (a row appears, a chip changes) through `useSceneBeat` thresholds, with the visual change done by a short CSS transition. Rule of thumb: **scrub position, step content.**
- Never animate layout inside a scene. All content is present at its final size from the start; states change `opacity`/`transform` only.
- Content inside the stage should not use `data-reveal` (the scene controls its own entrance).

### 5.3 `RelatedCards`

```ts
type RelatedItem = {
  href: string;
  title: string;
  body: string;                              // one line
  icon?: LucideIcon | ReactNode;             // brand marks allowed for integrations
  corner?: string;                           // e.g. agent status
  meta?: { label: string; value: string };   // e.g. Produces — …
  linkText?: string;                         // default "Learn more"
};
type RelatedCardsProps = {
  items: RelatedItem[];
  variant?: "compact" | "large";             // default compact
  heading?: ReactNode;                       // optional small eyebrow-style heading
  onActive?: (index: number | null) => void; // hover/focus, used by the hub strip
};
```

- **large** (hub Index): `.card` link, p-7, min-h 260, flex column. Top: 44px icon tile (as home Agents) + `corner`. Title 20px `text-fg` weight 500, body 15px `text-fg-3`, pushed-down footer `border-t border-line pt-4`: `meta.label` 11px uppercase `text-fg-3`, `meta.value` 14px `text-fg-2`; `linkText` as `.link-arrow`.
- **compact** (detail pages' "Related"): 2–3 up, p-5, 36px icon, title 16px, body 14px one line, arrow icon top-right.
- Hover/focus-visible: a pre-rendered lit layer (`card-lit` look) fades to `opacity:1`, icon tile fills brand, arrow `translateX(3px)`. 200ms. Whole card is one `<a>`; focus ring = `outline 2px brand-400/60 offset 2`.

### 5.4 `CTASection`

```ts
type CTASectionProps = { title: ReactNode; line?: ReactNode; label?: string /* "Get started" */ };
```

Centred, `py-28 sm:py-36`. Background: the FinalCTA ring layer (radial glow, solid ring, `spin-slow` dashed ring), no scraps, no tumbling letters (those stay the home page's signature). `Orb size={64}` → h2 Satoshi Light lowercase `clamp(2.5rem,5.6vw,4.75rem)` `tracking-[-0.05em]` → line 18px `text-fg-2` → `ConversationCTA variant="site"` (mt-12). All `data-reveal`, delays 0/80/160/240. Used at the end of every page.

---

## 6. Acceptance checklist (Reviewer)

**Relay**
- [ ] Scrolling pins the stage under the nav; the section header scrolls away above it; the stage unpins with the finished card after ~3.4 viewports.
- [ ] Beats land at the progress values in §3.2 (log `p` in dev); scrolling back un-lands rows in reverse, and chips go back.
- [ ] Desktop: card travels left→right, the notch always points at the active station, the rail fill tracks the card. Card clamps inside the track at both ends.
- [ ] Phone 390×844: vertical relay (token down the rail, rows filling), nothing overflows horizontally, card + end line fit the stage. Landscape phone falls back to static.
- [ ] Card height never changes; nothing reflows during the scene (DevTools Performance: no Layout in scroll frames, only Composite/Paint of small layers).
- [ ] Only `transform`/`opacity` change while scrolling. No `backdrop-filter`, no stroke-dashoffset, no width/height/top/left animation inside the scene.
- [ ] One progress computation per frame max; idle when the scene is off-screen. Lenis still feels identical above and below the scene.
- [ ] Anchor link to `#relay` and fast scrolls past the scene leave it in the correct end state (0 or 1).
- [ ] Reduced motion / JS disabled: no pinning, no extra scroll, finished frame (Shipped, 14 of 14, end line) shown.
- [ ] Screen reader gets the six hand-offs as a list.

**Page**
- [ ] Hero fits one screen at 1440×900 and 1280×720 (arc included); arc line draws once on load; loop holds ~3s.
- [ ] Index: hovering or focusing a card lights its dot in the strip (≥ lg); cards link to `/agents/[slug]`.
- [ ] Context: Atlas lit with "Isolated", Beacon greyed with "Separate memory"; no copy implies shared memory across products.
- [ ] Ends with `CTASection` holding `ConversationCTA variant="site"`; no other primary button on the page.
- [ ] Light and dark both checked; no hard-coded hex or `white/` utilities; works in mono theme.
- [ ] Headlines Satoshi Light, everything else Inter, nothing above 500.
- [ ] Only sample product names (Atlas, Beacon); no invented proof.

---

## 7. Open decisions for the user

1. **Does the card end "Shipped"?** The plan says it "arrives as a shipped task"; the Writer's chips end at *In progress* ("0 of 14 done"). This spec adds a final **Shipped** beat (0.94) where the count reaches 14 of 14, which is the stronger ending. Needs two strings from the Writer ("Shipped", "14 of 14 done"). If you'd rather keep it honest to "tasks created", drop beat 7 and end on *In progress*.
2. **Index links before detail pages exist.** Cards link to `/agents/[slug]`, which 404 until those pages ship. Either ship the hub with links (detail pages follow next) or link to `#relay` until each page exists.
