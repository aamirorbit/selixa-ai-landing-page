# `/agents/execution` — a board that empties (design spec)

Plan: `docs/SITE_PLAN.md` §3.7. Copy: `docs/pages/agents-execution.copy.md` (sections **Hero, Breakdown, Nudges, Sync, Outcome, Related, CTA**; strings quoted below come from it). Data: `agentBySlug("execution")`; tracker marks from `components/landing/logos.ts` (`LOGOS` by `name`: "Linear", "Jira", "GitHub", "Slack") rendered with `components/landing/BrandMark.tsx`.
Shared components: `PageHero`, `StickyScene` (+ hooks), `RelatedCards`, `CTASection` (hub spec §5).
New shared component defined here: **`SlotBoard`** (§6), also used by the Roadmap page and later the Linear/Jira/GitHub integration demos.

---

## 1. Concept

**A board that empties.** The page opens on a kanban where tasks glide to *Done* on their own and settle into a neat pile while a progress ring fills; *To do* runs dry. Then the page shows where those tasks came from (one decision growing into a requirement, 14 tasks and three owners, on scroll), how Selixa keeps them moving (nudges), where they live (your tracker, synced both ways), and what they were for (the metric moving).

Why it can't be mistaken for another page:
- It's the only page whose signature is **things getting finished**: motion always ends in *Done*, a filled ring, a pile, a check. The Roadmap page moves cards *between horizons* on a wide plane, both ways, with reasons; here cards move one way only and disappear into a pile.
- The scroll scene is a **tree growing** (branching outward), unlike the hub's travelling card, Meeting's timeline, Roadmap's pan and Research's canvas.
- Feel: operational and crisp. Tight grids, tabular numbers, tracker IDs (`ATL-212`), check marks. The accent is reserved for progress (ring, fills, the blocked nudge).

---

## 2. Page structure

Shell as the hub.

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero | `PageHero` + `KanbanWindow` (page-local, uses `SlotBoard`) | load reveal + loop (the signature "video") |
| 2 | Breakdown | header + `StickyScene` + `BreakdownTree` (page-local) | **scroll-scrubbed** (beats) |
| 3 | Nudges | `NudgeStack` (page-local) | in-view loop |
| 4 | Sync | `TrackerSync` (page-local) | in-view loop, tracker tabs |
| 5 | Outcome | `OutcomeClose` (page-local) | in view, once |
| 6 | Related | `RelatedCards variant="compact"` | reveal |
| 7 | CTA | `CTASection` | reveal |

Anchors `#breakdown`, `#nudges`, `#sync`, `#outcome`. Eyebrows `01 Breakdown`, `02 Follow-up`, `03 Sync`, `04 Outcome` (label words are the Writer's to change).

**Task data** (copy table, one list shared by hero, tree and sync): 14 tasks `ATL-212`…`ATL-225`, each with title and owner. Owners: **Dev Patel 6, Maya Chen 4, Sara Kim 4**. Put it in a page-local `tasks.ts` (typed), not JSX.

---

## 3. Sections, top to bottom

### 3.1 Hero

- `PageHero align="center"` (not `fill`: the kanban is tall). Pill **Hero.eyebrow** ("Execution Agent"); H1 **Hero.headline** ("from decision to done."); line **Hero.line** (data `line`).
- Visual: **`KanbanWindow`**, `.window`, `max-w-[1040px]` centred.

**Window bar** (`WindowBar`): **board title** ("Onboarding v2") 13px `text-fg-2` with a 16px product chip "A" before it. Right side: Linear `BrandMark` 14px (lit) · the **progress label** + **ring**.

**Progress label + ring.** Label (12px tabular `text-fg-2`): "{n} of 14" (copy), counting up as tasks land; at 14 it cross-fades to **Done** (copy's ring end state). Ring: 28px SVG right of the label, track `stroke: rgb(var(--ink-rgb)/0.1)`, arc `stroke: var(--progress)` (token, §4), 3px, round caps, `pathLength="100"`, rotated −90°. The arc fills by a `stroke-dashoffset` transition (300ms per step): time-based and tiny, **not** scroll-driven, so it's allowed here (it's the only stroke animation on the page besides the Outcome line). At 14 the ring's centre shows a `Check` 12px (opacity) and a glow layer behind it pulses once (opacity 0 → 1 → 0.4, 500ms).

**Board** (≥ md): three columns `grid-cols-3 gap-3 p-4`, each a `bg-well` rounded-[14px] p-3 column, fixed height 392.
- Column head (h 32): name (copy: "To do", "In progress", "Done") 12.5px `text-fg-2` + count pill (11px tabular, `bg-ink/[0.06]`). When To do reaches 0 its body shows a 1px dashed `border-line` empty outline in slot 0 (static, `opacity` in) — the board has visibly emptied; no extra words.
- Cards via **`SlotBoard`** (§6), `axis="x"`, slot height 60, gap 8:
  - **To do**: 5 visible slots. The 14 tasks queue here; when the top card leaves, the rest shift up one slot (transform) and the next queued task fades into slot 4.
  - **In progress**: 2 slots.
  - **Done**: a **pile**: each arriving card lands on top at slot 0; older ones sit `translateY(6px·k) scale(1 − 0.03k)`, fading out beyond k = 3. Done never overflows and visibly *fills* while To do *empties*. Up to 8 cards are visible at once, as the copy asks (6–8).
- **Task card** (h 60, `.card` radius 10, px-3 py-2.5): row 1 tracker ID (11px tabular `text-fg-3`) + owner `Avatar` 18px right; row 2 title 13.5px `text-fg` truncate. In Done: a 12px `CheckCircle2` `text-brand-300` before the ID (opacity), title dims via a stacked `text-fg-2` twin (opacity).

**Hero loop** (`useSequence`, in view only):

| Step | ms | Frame |
|---|---|---|
| 0 | 400 | reset: 14 in To do (5 visible), In progress empty, Done empty, "0 of 14", ring 0 |
| 1 | 280 | ATL-212 → In progress |
| 2 | 280 | ATL-213 → In progress |
| 3…15 | 280 each | the older In-progress card → Done (pile, label +1, ring +1); next To do card → In progress |
| 16 | 280 | last card → Done (14 of 14) |
| 17 | 600 | label → **Done**, ring check + glow; To do empty outline |
| 18 | 3000 | hold |

≈ 8.5s per loop. Cards glide with a `transform` transition of 480ms (`--ease-out-expo`), longer than the 280ms beat, so the board reads as one continuous flow. Reset (step 0) cross-fades the card layer (opacity 300ms); cards never glide backwards.

Reduced motion / before JS: step 18 frame (To do empty, Done pile, "Done", full ring with check).

**Phone (< md): the vertical kanban.** The three columns become stacked **lanes**; work flows **down**:
- Each lane: head (name + count) on top, 12px; then a single row of cards.
- To do: 2 cards (w 140, h 52, ID + title 12.5px, one line each) + a "+12" count chip. In progress: 1 card. Done: the pile, offset sideways (`translateX(6px·k)`).
- `SlotBoard axis="y"`; cards move `translateY` between lanes (480ms). Window ≈ 44 (bar) + 3 × 88 + padding ≈ 330px. Label + ring stay in the bar (label shortens to "{n}/14" below 360px if needed).

### 3.2 Breakdown (the scroll scene)

**Header** (scrolls away): `SectionHeader num="01" label="Breakdown"` + **Breakdown.headline** ("one decision, fourteen tasks."), **Breakdown.line** ("Every task has an owner before the meeting ends."). `pt-24 sm:pt-32`.

**Scene:** `<StickyScene id="breakdown" length={2.4} label={Breakdown.headline}>`. Content max-w 1120, centred vertically in the stage.

**Desktop tree (≥ lg), four levels left → right** (copy level labels: Decision · Requirement · Tasks · Owners):

```
DECISION              REQUIREMENT              TASKS  14 tasks · Synced to [Linear]       OWNERS
                                            ┌─ ATL-212 Move Slack connect after first…  ┐
                                            │  ATL-216 Defer integrations prompt         │
┌─────────────┐      ┌──────────────────┐   │  … Dev's 6 tasks                           ├──▶ (DP) Dev Patel · 6
│ Shorten     │─────▶│ Onboarding v2    │───┤                                            ┘
│ onboarding  │      │ Ship Oct 14      │   ├─ ATL-213 Replace product tour…            ┐
└─────────────┘      └──────────────────┘   │  … Maya's 4 tasks                          ├──▶ (MC) Maya Chen · 4
                                            │                                            ┘
                                            └─ ATL-222 Weekly activation report         ┐
                                               … Sara's 4 tasks                          ├──▶ (SK) Sara Kim · 4
                                                                                         ┘
```

- Grid `grid-cols-[200px_220px_minmax(0,1fr)_180px] gap-x-12`. Level labels 11px uppercase tracking 0.14em `text-fg-3` on the top row. The Tasks label is followed by the copy's **Tasks node header** ("14 tasks · Synced to Linear") with a Linear `BrandMark` 12px.
- **Decision node** (`.card` p-4, vertically centred on the tree): `Video` 12px + "Product review" 11px `text-fg-3` above the title **"Shorten onboarding"** 15px `text-fg`. Gains a `card-lit` overlay (opacity) at the final beat.
- **Requirement node** (`.card` p-4, centred): "Onboarding v2" 15px `text-fg`, "Ship Oct 14" 12.5px `text-fg-3`.
- **Task pills** (×14), **grouped by owner** (Dev 6, Maya 4, Sara 4; the copy table's order within each owner), h 26, gap 6, 18px between groups (≈ 14·26 + 11·6 + 2·18 = 466px). Pill: 10px empty square (`border-line-strong`) + ID 11px tabular `text-fg-3` + title 12.5px `text-fg-2` truncate.
- **Owner nodes** (×3), each vertically centred on its group: `Avatar` 32px + name 13px `text-fg` + count 12px tabular `text-fg-3` (copy: "Sara Kim · 4" etc.).
- **Connectors** (one SVG behind the grid; paths from measured node positions **once per resize**, never per frame): decision → requirement (straight), requirement → a bracket spanning all 14 pills, each owner group → its owner node (a bracket + short arrow). Stroke 1px `rgb(var(--ink-rgb)/0.14)`; a second pre-rendered layer at `rgb(var(--brand-400-rgb)/0.6)` fades in at the final beat. Shown by `opacity` (200ms). **No stroke drawing** in the scene.

**Beats** (`useSceneBeat`; each crossing sets `data-on` on the element → `.st`-style transition, 280ms opacity + `translateX(-6px→0)`):

```ts
const TASKS_FROM = 0.34, TASK_STEP = 0.022;          // 14 tasks: 0.34 … 0.626
const BEATS = [
  0.06,                                              // 1  decision node
  0.14,                                              // 2  connector → requirement
  0.18,                                              // 3  requirement node
  0.26,                                              // 4  bracket → tasks + "14 tasks · Synced to Linear" header
  ...Array.from({ length: 14 }, (_, i) => TASKS_FROM + i * TASK_STEP), // 5–18 one pill each (a quick cascade)
  0.70,                                              // 19 owner brackets + owner nodes (CSS stagger 80ms)
  0.86,                                              // 20 decision lit + brand connector layer
];
```

Scroll budget 2.4 viewports: ~0.05 viewport per task (a cascade, not a slog), longer holds on the decision and on the finished tree.

**Tablet (md–lg):** `grid-cols-[160px_180px_minmax(0,1fr)_120px] gap-x-8`; task titles truncate harder; owner names hidden (avatar + count).

**Phone (< md): the vertical outline.** Branches grow **downward**; tasks become ticks grouped by owner.

```
┌ stage ─────────────────────────────┐
│ ┌ Decision ──────────────────────┐ │
│ │ Shorten onboarding             │ │
│ └──────────────┬─────────────────┘ │
│ ┌ Requirement ─┴─────────────────┐ │
│ │ Onboarding v2 · Ship Oct 14    │ │
│ └──────────────┬─────────────────┘ │
│  14 tasks · Synced to [Linear]     │
│   ├─ (DP) Dev Patel      ■■■■■■ 6  │  ■ = task tick, fills as its task lands
│   ├─ (MC) Maya Chen      ■■■■   4  │
│   └─ (SK) Sara Kim       ■■■■   4  │
└────────────────────────────────────┘
```

- Decision and requirement cards full width (h 64 each), a 1px spine between them and down into the owner rows.
- Owner rows (h 52): `Avatar` 28px + name 14px, and on the right a row of 16px ticks (radius 4, `border-line-strong`) that fill (`bg-[var(--progress)]` overlay at opacity) one per task beat, in the same order as desktop; count text after. Owners are visible from beat 4 (names are needed to hold the ticks); on desktop they arrive at beat 19.
- Height ≈ 64 + 24 + 64 + 36 + 3 × 60 ≈ 370: fits a 390×667 stage.
- Landscape phone: static fallback.

**Static frame (reduced motion, no JS):** everything present, decision lit, connectors tinted, all ticks filled. `sr-only` nested list: decision → requirement → owners → their tasks.

### 3.3 Nudges

**Layout ≥ lg:** `grid grid-cols-[minmax(0,1fr)_460px] gap-16 items-center`. Left: `SectionHeader num="02" label="Follow-up"` + **Nudges.headline** ("it follows up, so you don't."), no line. Right: the stack. `id="nudges"`.
**< lg:** header on top, stack below at `max-w-[460px]` (phone full width).

**`NudgeStack`**: a `bg-well` panel, radius 24, p-5, fixed h 440 (phone 400), `overflow: clip`. Up to 3 nudges visible, newest on top.

**Nudge card** (`.card` `bg-panel`, radius 16, p-4, h 116 fixed):
- Row 1: `Orb size={20}` + sender label (copy: "Selixa · now") 12px `text-fg-3`; right, Slack `BrandMark` 12px (lit on the newest card only) + recipient ("Sara Kim", "#atlas-product") 12px `text-fg-3`.
- Row 2: **title** 14px `text-fg` weight 500. The first nudge ("Blocked for 2 days: auth dependency") gets a 6px `bg-brand-400` dot before the title.
- Row 3: **body** 13.5px/1.45 `text-fg-2`, 2 lines max (clamp).

Five nudges (copy order). The last ("On track for Oct 14 · 12 of 14 done. 2 in review.") is the calm ending.

**Loop** (`useSequence`, in view):

| Step | ms | Frame |
|---|---|---|
| 0 | 300 | empty panel |
| 1–5 | 1200 each | nudge *i* enters at top: `translateY(-16px→0)` + opacity, 360ms; older nudges move down one slot (`translateY(slot × 126px)`) and dim (`opacity` 1 → 0.8 → 0.6); the one pushed past slot 2 fades out |
| 6 | 3000 | hold (nudges 5, 4, 3 visible) |

Cards are absolutely positioned; slots are transforms; nothing reflows. Reset = panel content cross-fade (300ms).

Reduced motion / before JS: nudges **5, 4 and 1** stacked (the calm ending on top, the blocked one visible below), so the still frame still tells "it chases, then it's on track".

### 3.4 Sync

**Header:** `SectionHeader num="03" label="Sync" align="center"` + **Sync.headline** ("stays in sync with your tracker."), **Sync.line** ("Status changes flow both ways."). `id="sync"`.

**Tracker tabs:** three buttons centred, h 40: `BrandMark` 18px + name (Linear, Jira, GitHub). Active: `border-line-strong bg-ink/[0.05]`, mark `lit`; idle: mark at rest (monochrome), name `text-fg-3`. `role="tablist"`.

**`TrackerSync`** (≥ md): `grid grid-cols-[300px_180px_320px] justify-center items-center`, 40px under the tabs.
- **Left: the Selixa task** (`.card` p-4): `Orb` 18px + "Selixa · Atlas" 12px `text-fg-3`; ID + title (copy's sample: "ATL-212 · Move Slack connect after first project") 14px `text-fg`; owner `Avatar` DP 20px; status `.tag` with stacked labels "In progress" / "Done" cross-fading.
- **Middle: the two-way line.** Two 1px rails (`bg-ink/[0.12]`) 14px apart, each labelled above/below in 11px `text-fg-3` (copy: **"Tasks out →"** on the top rail, **"← Status back"** on the bottom). A 6px brand dot with a soft glow travels a rail with a `translateX` transition (0 → 168px, 600ms) when its beat fires, then fades (150ms) and resets invisibly.
- **Right: the tracker item** (`.card` p-4): header row with the tracker's `BrandMark` 16px lit + tracker name 12px `text-fg-3`; body per tracker, no fake app chrome:
  - Linear / Jira: "ATL-212" + title; status `.tag` "In progress" → "Done".
  - GitHub: "PR #482" + "ATL-212 · Move Slack connect after first project"; state `.tag` "Open" → "Merged" (`GitMerge` 12px) — matches the nudge copy "PR #482 merged".

**Loop per tracker** (`useSequence`, in view):

| Step | ms | Frame |
|---|---|---|
| 0 | 300 | Selixa task shown, "In progress"; tracker item hidden |
| 1 | 600 | dot travels out along "Tasks out →" |
| 2 | 400 | tracker item appears (`.st`), status "In progress" / "Open" |
| 3 | 800 | tracker status → "Done" / "Merged" (cross-fade), a 400ms lit pulse on the tracker card |
| 4 | 600 | dot travels back along "← Status back" |
| 5 | 500 | Selixa status → "Done" (cross-fade + `Check`) |
| 6 | 2200 | hold |

After step 6 the active tab advances Linear → Jira → GitHub → Linear. Clicking a tab stops auto-advance for good and loops the chosen tracker. Reduced motion / before JS: Linear, step 6 frame; tabs swap to each tracker's final frame.

**Phone:** vertical: Selixa task card (full width), then the rails turned vertical (h 64, side by side 14px apart, labels beside them, dots `translateY`), then the tracker card. Tabs stay one row (3 × ~112px).

### 3.5 Outcome

Closes the loop from the work back to the number, and hands over to the Analyst Agent. **Header:** `SectionHeader num="04" label="Outcome" align="center"` + **Outcome.headline** ("done means the number moved."), **Outcome.line** ("Selixa measures the outcome, not just the tasks."). `id="outcome"`.

**`OutcomeClose`** (max-w 880, centred), a `.window` without dots, p-8 (phone p-5):
- Top row: left, **metric card title** ("Activation · Atlas", 13px `text-fg-3`), then the **value** (copy: "35.0% → 37.4%"): "35.0%" 24px `text-fg-3` tabular, `ArrowRight` 16px, "37.4%" in Satoshi Light 56px (phone 40px) `tabular-nums text-fg` counting up with `Count` (tenths: count 350 → 374 and format). Under it the **change label** ("Back up since Oct 14") 14px `text-brand-300` with `TrendingUp` 16px, and the **sub label** ("Measured weekly") 12px `text-fg-3`.
- Right: a chip `.tag` brand tint with `Check`: **"14 of 14"** (reuses the hero's label string) — the work.
- Chart: 100% × 150px (phone 110) SVG line: dashed baseline 1px `rgb(var(--ink-rgb)/0.14)`; the line in `text-fg-3` dips around 40% of the width, then after the **Oct 14** marker at ~65% (brand dot + "Oct 14" 11px `text-brand-300`) its segment turns `brand-400` and ends above the baseline with an end dot. No axes, no other labels.
- A 1px `bg-brand-400/40` vertical rule links the "14 of 14" chip down to the Oct 14 marker (static): the work shipping and the number turning are the same moment.
- Footer: **link** ("See how the Analyst Agent tracks it →", `.link-arrow`) → `/agents/analyst`.

**Motion** (in view, once): the line draws with the existing `.draw` (time-based 900ms; outside any scroll scene), the Oct 14 marker fades at 600ms, the brand segment at 700ms, the value counts (600ms) and the chip lands at 900ms. Reduced motion: final frame.

Deliberately small (one line, one marker, no axes) so it doesn't pre-empt the Analyst page's big annotated chart.

### 3.6 Related

`RelatedCards variant="compact"`, heading **Related.headline** ("before and after the tasks."). Two items (copy): **Analyst Agent** ("measures whether the work paid off."), **Roadmap Agent** ("where the plan came from."), link text "See how it works →". `grid-cols-2` ≥ md at `max-w-[880px]` centred; stacked on phone.

### 3.7 CTA

`<CTASection title={CTA.headline} line={CTA.line} />` (copy: "stop building in chaos." / "Stop chasing tasks. Start shipping them.").

---

## 4. Light and dark

- Board columns `bg-well`, cards `.card`, windows `.window`: all scheme tokens. No hex; no `white/` utilities (white only on `bg-brand-500` fills).
- Brand marks: `BrandMark` handles lit/rest colours; GitHub's lit colour is already `var(--color-fg)` in `logos.ts`. Linear (#5E6AD2) and Jira (#0052CC) lit colours read on both panels.
- **`--progress` token** (new, in `globals.css`): `var(--color-brand-400)` by default; under light scheme + mono theme, `var(--color-fg-2)` (mono's `brand-400 #c4c4cd` is too faint on white). Used by the ring, the phone task ticks and the sync dots.
- Pile depth uses opacity/scale, scheme-neutral.

---

## 5. Phone (390px) summary

- Hero kanban: vertical lanes (To do / In progress / Done), work flows down; the pile goes sideways; label + ring stay in the window bar.
- Breakdown: vertical outline with owner rows of ticks; fits 390×667.
- Nudges: full-width stack, h 400.
- Sync: vertical flow with vertical rails; three tabs in one row.
- Outcome: value 40px; chart 110px; the chip wraps under the value.
- No horizontal overflow anywhere.

---

## 6. New shared component: `SlotBoard`

`components/site/SlotBoard.tsx`. A board whose items are **absolutely positioned by slot** and move between slots with **transform-only** transitions. It exists because three kinds of pages move cards between columns, and doing it with real DOM reflow (re-parenting cards between column `div`s) causes layout work and jank under Lenis.

**Used by:** Execution hero kanban (this page), Roadmap scene, Why-it-moved board and hero ribbon (`agents-roadmap.md`), Linear/Jira/GitHub integration demos (plan §4.2 "an issue created from a decision"), and use-case "with Selixa" boards (plan §5.2).

```ts
type SlotBoardColumn = { id: string; label?: ReactNode; slots: number; pile?: boolean };
type SlotBoardLane = { id: string; label?: ReactNode };

type SlotBoardItem = {
  id: string;
  col: string;            // column id
  lane?: string;          // lane id (roadmap)
  slot: number;           // index within the cell (0 = top/first)
  hidden?: boolean;       // queued / off-board: rendered at opacity 0 in its slot
};

type SlotBoardProps = {
  columns: SlotBoardColumn[];
  lanes?: SlotBoardLane[];          // rows; omitted = one implicit lane
  items: SlotBoardItem[];           // positions; change these to move cards
  axis?: "x" | "y";                 // "x": columns side by side (desktop); "y": columns stacked (phone)
  slotSize: { main: number; cross?: number; gap: number }; // px; cross = card width in a multi-slot cell
  slotsPerRow?: number;             // cards side by side in a cell (roadmap: 2), default 1
  moveMs?: number;                  // default 480
  arc?: boolean;                    // play the "jump" keyframe on the moved item (roadmap)
  pileOffset?: number;              // px per depth in pile columns (default 6)
  pileDepth?: number;               // visible depth before fading (default 3)
  renderItem: (item: SlotBoardItem, s: { moving: boolean; depth: number }) => ReactNode;
  renderColumnHead?: (col: SlotBoardColumn) => ReactNode;
  onGeometry?: (g: { slotRect: (col: string, lane: string | undefined, slot: number) => DOMRect }) => void; // for overlays (dependency lines)
  still?: boolean;                  // no transitions (reduced motion / SSR)
  className?: string;
};
```

**Behaviour**
- Board size is fixed from `columns[].slots × slotSize` (and lanes): **it never changes size** when items move.
- Each item's wrapper is `position: absolute; top: 0; left: 0; transform: translate3d(x, y, 0)` where `(x, y)` comes from `slotRect`. Column/lane geometry measured once via `ResizeObserver` on the board and cached; no layout reads during scroll or transitions.
- Moving an item = changing its `col`/`lane`/`slot`; the wrapper transitions `transform` over `moveMs` (`--ease-out-expo`). Displaced items transition too. `moving` is true for the moved item for `moveMs` (for lit layers and the arc keyframe).
- `hidden` items fade (opacity 200ms) in place, used for queued tasks and resets.
- Pile columns: depth `k` = order of arrival from newest; transform adds `translateY(k·pileOffset) scale(1 − 0.03k)` (axis `y`: `translateX`), `opacity` 0 beyond `pileDepth`; newest has the highest `z-index`.
- `still`: all transitions off; items placed at their positions; the server renders this so no-JS and reduced-motion see a finished board.
- Accessibility: the visual board is `aria-hidden` by default when used as a demo; the page supplies an `sr-only` summary. When items are interactive (Roadmap "Why it moved"), `renderItem` returns buttons and the board is not hidden; DOM order follows column → lane → slot so tab order is logical.

---

## 7. Acceptance checklist (Reviewer)

**Hero**
- [ ] Tasks glide To do → In progress → Done continuously; To do empties (dashed empty outline); Done becomes a neat pile; label counts "n of 14" then reads "Done"; ring fills and shows a check; holds ~3s; resets by cross-fade.
- [ ] 6–8 cards visible at once; IDs `ATL-212`…`ATL-225` with owners from the copy.
- [ ] Phone: vertical lanes, work flows down, fits the window without overflow.
- [ ] Reduced motion / JS off: the emptied board, full ring, "Done".

**Breakdown scene**
- [ ] Pins; Shorten onboarding → Onboarding v2 (Ship Oct 14) → 14 tasks cascading in, grouped by owner → Dev Patel 6, Maya Chen 4, Sara Kim 4; "14 tasks · Synced to Linear" with the Linear mark; decision lights at the end.
- [ ] Scrolling back un-grows the tree in reverse. Only opacity/transform change; connectors are pre-computed and only fade; no Layout in scroll frames.
- [ ] Phone: vertical outline, ticks fill per owner; fits 390×667; landscape falls back to static.

**Rest of page**
- [ ] Nudges stack like notifications, newest on top, max three, five in copy order; still frame shows 5, 4 and 1.
- [ ] Sync: Linear, Jira and GitHub each show a round trip ("Tasks out →", "← Status back"); GitHub shows PR #482 merged; auto-advance stops on click; marks lit only when active.
- [ ] Outcome: "35.0% → 37.4%", "Back up since Oct 14", a small line with the Oct 14 marker linked to "14 of 14"; link to `/agents/analyst`.
- [ ] Related: Analyst, Roadmap (2-up). Ends with `CTASection` as the only primary action (tabs are the only other buttons; nothing else styled primary).
- [ ] Light and dark, crimson and mono themes (ring/ticks contrast on light + mono via `--progress`); no hex or `white/` utilities in components.
- [ ] Headlines Satoshi Light; nothing above 500; only Atlas and sample people; tracker marks shown as integrations, not customer logos.

---

## 8. Open decisions for the user

1. **Jira and GitHub status (and two-way sync).** Same as the copy's TODO and SITE_PLAN §11.1: if Jira/GitHub aren't live, their tabs get a "Coming soon" `.tag` and no loop (Linear only plays); if sync isn't two-way today, drop the "← Status back" rail and the return dot, and the loop ends at the tracker.
2. **Hero start state.** The copy's ring label reads "9 of 14" as an example; the spec starts the loop at 0 so the board visibly empties (the plan's signature). Starting at 9 would make a 3-second loop with only five cards moving: shorter, but the emptying is barely visible.
3. **Nudge channel.** All nudges arrive via Slack (the recipients "#atlas-product" imply it). Keep Slack as the one channel, or mix in email?
