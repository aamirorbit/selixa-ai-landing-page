# `/agents/analyst`: the chart that explains itself (design spec)

Plan: `docs/SITE_PLAN.md` §3.4. Copy: `docs/pages/agents-analyst.copy.md` (sections **Hero, Annotations, Ask a number, Metrics, Related, CTA**; slot names below match it). Data: `agentBySlug("analyst")`.
Shared (hub spec §5): `PageHero`, `StickyScene` + hooks + `seg` / `smoothstep` / `useMeasure`, `RelatedCards`, `CTASection`. From the Meeting spec: **`SourceChip`**. New shared here: **`ChartLine`** (plan §9) and **`Sparkline`**.

---

## 1. Concept

**One big chart, annotated live.** The page opens on a wide, quiet activation chart that draws itself and then drops 8% at Aug 12. As you scroll, the chart pins and a thin read-cursor travels along the line; each time it reaches a cause, a callout snaps onto the chart with its number and its source. By the end the dip is fully explained. Below, you can "ask a number", and a dense table shows everything else it watches.

Why it can't be mistaken for another page:
- It's the **data-grade** page: hairline grid, axes, tabular numerals, almost no colour. Crimson appears **only on the anomaly** (the dip, its callouts' anchors, two table rows).
- The scene doesn't move the content (hub), the tape (Meeting) or a camera (Research): the chart stays put and a **cursor reads it**, attaching annotations. Hero text is ordinary flow; only the chart pins.

---

## 2. Page structure

Shell as the hub. No `<Background>`.

| # | Section | Copy section | Component | Motion |
|---|---|---|---|---|
| 1 | Hero | Hero | `PageHero align="left"` (compact, no visual) | load reveal |
| 2 | Chart + annotations | Hero chart, Annotations | `StickyScene` + `ActivationChart` (page-local, built on `ChartLine`) | load draw, then **scroll-scrubbed cursor** + stepped callouts (the only scrubbed thing) |
| 3 | Ask a number | Ask a number | `AskNumber` (page-local) | in-view loop |
| 4 | Metrics | Metrics | `MetricsTable` (page-local) + `Sparkline` | reveal |
| 5 | Related | Related | `RelatedCards variant="compact"` | reveal |
| 6 | CTA | CTA | `CTASection` | reveal |

Anchors: `#chart`, `#ask`, `#metrics`, `#related`. Eyebrows: `01 Why it moved` (label for Annotations; *Writer may rename*), `02 Ask a number`, `03 Metrics`, `04 Where the numbers go`.

**First screen = hero text + the chart.** The hero is compact (not `fill`) and the chart stage follows immediately, top-aligned, so both fit one screen at 1440×900 and 1280×720 (budget below).

---

## 3. Sections, top to bottom

### 3.1 Hero

`PageHero align="left" rings={false}` with no `visual`: **Hero.eyebrow** (pill + `live-dot`), **Hero.headline**, **Hero.line** (data). Top padding `pt-10 sm:pt-14`, bottom 0. H1 on one line at ≥ md. Height budget ≈ 240px desktop, ≈ 250px phone (H1 wraps to 2 lines).

### 3.2 Chart + annotations (the signature)

`<StickyScene id="chart" length={2.6} label={Annotations.headline}>`. Stage `calc(100svh - 4.5rem)`, content **top-aligned** (`pt-6`), full container width.

The hero text sits in normal flow above the scene, so it simply scrolls away; the chart pins when the stage reaches the nav. No scrubbing is needed for that hand-off.

#### Stage layout, desktop (≥ md)

```
┌ stage ────────────────────────────────────────────────────────────────────────┐
│ Activation · Atlas   [Last 12 weeks]            ── Activation rate, weekly    │ chart head (32)
│ 40% ┼┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┊┈┈┈[2 Setup completion −9%]┈┈[4 7 feedback notes] │
│     │ [1 Aug 12 release]    ┊ ╲                                               │
│     │─────────────────────── ●  ╲___●________●_______                         │ line: fg-2 → brand after Aug 12
│ 35% ┼┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  (−8%)                       │
│     │                        ┊        [3 4 customer calls]                    │
│ 30% ┼┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈     │
│     Jul 1  Jul 15  Jul 29  Aug 12  Aug 26  Sep 9  Sep 23                      │
│ ───────────────────────────────────────────────────────────────────────────── │
│ it tells you why.                        ◆ Activation −8% since the Aug 12…   │ foot row (summary at the end)
│ Every callout links to its source.                                            │
└───────────────────────────────────────────────────────────────────────────────┘
```

- **Chart head** (h 32): **Hero.chartTitle** ("Activation · Atlas") 14px `text-fg`; **Hero.rangeChip** as `.tag`; right, legend: 16px line swatch `bg-fg-2` + **Hero.legend** 12px `text-fg-3`.
- **Plot**: `ChartLine`, width 100%, height **`min(48svh, 460px)`** (never changes after first paint). Insets: left 44 (y labels), bottom 28 (x labels), top 12, right 16.
  - Data (13 weekly points, Jul 1 → Sep 23; x labels every other week per copy):
    `[37.8, 38.2, 37.9, 38.3, 38.1, 38.0, 38.0, 36.4, 35.3, 35.1, 34.9, 35.0, 35.0]` — index 6 = Aug 12. 38.0 → 35.0 = −7.9%, shown as **−8%**.
  - Y domain 29–42, ticks **Hero.yAxis** (30%, 35%, 40%) with 1px `bg-ink/[0.06]` hairlines (dashed 2-3, static); x baseline 1px `bg-ink/[0.14]`. Labels 12px `tabular-nums text-fg-3`.
  - Line: 1.5px `stroke: var(--color-fg-2)` to index 6; from index 6 on, 1.75px `var(--color-brand-400)`. Soft area under the brand segment only: `rgb(var(--brand-500-rgb)/0.08)` → transparent (static gradient).
  - **Release marker** at index 6: 1px vertical `bg-ink/[0.25]` dashed line, full plot height, 11px label "**Hero.markedPoint**" (Aug 12) at its foot above the axis.
  - **Dip badge**: `.tag` brand tint "**Hero.dipLabel**" (−8%) placed at index 9.5, 14px under the line. Hover/focus on the badge shows **Hero.dipTooltip** ("38.0% → 35.0% · since Aug 12") in a small `bg-panel-2 border-line` tooltip above it (desktop pointer only; static text in the sr summary).
- **Callouts** (4): `.card` w 232, p-3, radius 12. Row 1: index `1`–`4` 11px `tabular-nums text-brand-300` + **Annotations.items[i].title** 14px `text-fg`. Row 2: **.detail** 12.5px `text-fg-3`. Row 3: `SourceChip size="sm"` **.source** (GitHub mark for "GitHub · PR #451", PostHog mark, `Video` icon for "Meeting Agent", Intercom mark). Height ≈ 92.
  - **Anchors** (on the line) and **placement** (callout top-left, in plot % so it's SSR-safe):

    | # | Anchor (index, value) | Callout box (left %, top %) | Leader |
    |---|---|---|---|
    | 1 Aug 12 release | marker top (6, 42) | right edge at the marker: left `calc(x6 − 232px − 12px)`, top 2% | horizontal, 12px |
    | 2 Setup completion −9% | (7, 36.4) | left = x7 + 2%, top 4% | down-left to anchor |
    | 3 4 customer calls | (8, 35.3) | left = x8 + 3%, top 70% (below the line) | up-left |
    | 4 7 feedback notes | (10, 34.9) | left = x10 + 1%, top 12%; clamp right edge inside the plot | down |
  - **Leader**: a 1px `bg-brand-400/60` div from the callout's nearest edge to the anchor; length/angle computed with `useMeasure` on resize (never during scroll); shown by `opacity` + `scaleX(0→1)` with `transform-origin` at the anchor end.
  - **Anchor**: 8px ring (`border-2 border-brand-400 bg-bg`), pops with `scale(.4→1)` + opacity.
- **Read-cursor** (scrubbed): a 1px `bg-ink/[0.3]` vertical hairline spanning the plot, plus a 7px `bg-fg` dot riding the line. Moved only by `transform: translate3d(x, 0, 0)` (hairline) and `translate3d(x, y, 0)` (dot). Hidden (opacity 0) before 0.08 and after 0.86.
- **Foot row** (below the plot, `mt-8 border-t border-line pt-6`, `grid-cols-[1fr_auto] items-end`): left, **Annotations.headline** (Satoshi Light, `clamp(1.75rem,3vw,2.5rem)`, lowercase) + **Annotations.line** 15px `text-fg-2`; right, the **summary** pill: `.tag` brand tint, 14px, `ChartLine` icon + **Annotations.summary** ("Activation −8% since the Aug 12 release."). The foot row is below the fold at load and is revealed by pinning; its header fades in on beat 1.

**Height budget** (1280×720: nav 72, content 648): hero 240 → stage starts at 240. Stage pt 24 + head 32 + plot min(48svh=346, 460) = 402 → chart ends at 642 < 648. At 1440×900: 240 + 24 + 32 + 432 = 728 < 828. The foot row and summary live below and appear once pinned.

#### Motion script

**On load (time-based, in view; not scroll):**

| t (ms) | What |
|---|---|
| 0 | axes, grid, labels fade in (300ms) with the hero reveal (`d(320)`) |
| 350 → 1550 | **line reveal**, left to right, 1200ms `--ease-out-expo`, by the transform-only wipe (§5.1 `reveal="wipe"`); the brand segment is part of the same reveal so the colour change appears as it's drawn |
| 1100 | release marker + "Aug 12" label fade (opacity 300ms) as the wipe passes index 6 |
| 1650 | −8% badge pops (`scale(.92→1)` + opacity, 240ms) |

Plays once, no loop (a chart that keeps redrawing is noise). Reduced motion / before JS: fully drawn, marker and badge shown.

**On scroll (StickyScene, p 0 → 1):**

```ts
const BEATS = [0.08, 0.20, 0.36, 0.52, 0.68, 0.86];
const b = useSceneBeat(BEATS);
// b≥1: foot-row header + cursor visible ; b≥2: callout 1 ; b≥3: callout 2 ; b≥4: callout 3 ; b≥5: callout 4 ; b≥6: summary, cursor hidden
// cursor position (scrubbed): x reaches each anchor exactly at its beat
const KEYS = [[0.08, 0], [0.20, 6], [0.36, 7], [0.52, 8], [0.68, 10], [0.86, 12]]; // [p, data index]
xIndex = piecewise-linear(KEYS, p) with smoothstep inside each segment
x = plotX(xIndex); y = plotY(interp(data, xIndex))   // cached plot mapping from useMeasure
```

- **Scrubbed**: cursor hairline and dot transforms only.
- **Stepped** (CSS transitions, reverse on scroll up): callout `opacity 0→1` + `translateY(6px)→0` 280ms; its anchor pops at +0ms, leader grows at +80ms (200ms), card at +140ms. Summary pill: 300ms fade + rise. The dim: when a callout lands, the previous callouts drop to `opacity: 0.72` (200ms) so the newest reads first; at the summary beat all return to 1.
- Budget: 2.6 viewports, ~0.4 viewport per callout.

#### Phone layout (< md, 390)

The plot has no room for floating callouts. They become **numbered pins on the chart + a list under it**.

```
┌ stage ───────────────────────────┐
│ Activation · Atlas   [12 wks]    │
│ 40 ┼┈┈┈┈┈┈┈┊┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈   │
│    │───────①╲_②__③____④___       │  plot 358 × 220
│ 30 ┼┈┈┈┈┈┈┈┊┈┈┈┈┈┈┈┈ (−8%)        │
│    Jul 1   Aug 12   Sep 23       │  3 x labels only
│ ① Aug 12 release       GitHub    │  list rows, 56px each
│   Integrations step added…       │
│ ② Setup completion −9%  PostHog  │
│ ③ …                              │
│ ④ …                              │
│ ◆ Activation −8% since Aug 12.   │  summary
└──────────────────────────────────┘
```

- Chart head: title 13px, range chip, no legend. Plot height **220px**, insets left 32, bottom 24. X labels: Jul 1, Aug 12, Sep 23 only. Y labels 30/35/40 at 11px.
- Pins: 16px circles on the anchors, `bg-bg border border-brand-400`, digit 10px `tabular-nums text-brand-300`; pin 1 sits at the marker's top.
- **List**: 4 rows × 56px, `border-t border-line`: pin digit · title 14px `text-fg` + detail 12px `text-fg-3` (one line, truncate) · `SourceChip size="sm"` right (mark only, label hidden < 360px).
- Foot: the Annotations header is **not** in the stage on phone; it renders in normal flow **above the scene** (under the hero), as `SectionHeader` compact. Summary pill below the list, full width.
- Beats identical; pin + row land together. Cursor kept (hairline + dot on the 220px plot).
- Budget (390×844, stage 772): head 28 + plot 220 + 16 + list 224 + summary 52 ≈ 540. At 667 tall (stage 595) fits; below 520 → static.
- First screen on phone: hero ~250 + stage head + plot 248 = ~500 < 772. The chart is visible at load.

#### Static frame (reduced motion, no JS, landscape phone)

p = 1: line drawn, all four callouts/pins and leaders shown at full opacity, summary shown, cursor hidden, foot header shown. No pinning. The plot has `role="img"` with an `aria-label` summarising the series ("Activation, weekly, Jul 1 to Sep 23: about 38% until Aug 12, then 35%."); callouts are real text in an `<ol>` in DOM order 1–4 in both modes.

### 3.3 Ask a number

`id="ask"`. `SectionHeader num="02" label="Ask a number" align="center"` + **Ask.headline**. Demo 56px below, centred, `max-w-[760px]`.

**`AskNumber`**: one `.window` (radius 20, no dots bar):
1. **Query row** (h 56, `border-b border-line`, px-5): a `Search` 16px `text-fg-3` icon, then the query: **Ask.placeholder** ("Ask about a metric…") in `text-fg-3` when empty; the typed **Ask.question** in 16px `text-fg` (`Typed`, cps 34). Right: a `⏎` key cap (`.tag` 11px) that lights (brand tint, opacity overlay) on submit.
2. **Answer** (p-5 sm:p-6): `Orb size={24}` + "Selixa" 12px `text-fg-3` line with `.thinking` while thinking; then **Ask.answer** 17px `leading-[1.55] text-fg`, as two sentences, each a `Stage` (fade + rise), not typed.
3. **Mini chart** (mt-4): `.card` p-4: **Ask.chartTitle** 12px `text-fg-3`; `ChartLine` height 140 (phone 120), 13 weekly points Apr → Jun, data `[41, 41.2, 40.8, 41.1, 41.0, 43.2, 44.6, 45.4, 45.8, 46.1, 46.0, 46.2, 46.3]` (index 5 = May 6), no y labels, 3 x labels (Apr, May, Jun), line `fg-2` all the way (this isn't an anomaly), marker at May 6: dashed hairline + label **Ask.marker** ("May 6 · Saved views") 11px `text-brand-300`. `reveal="wipe"` 600ms.
4. **Sources** (mt-4): two `SourceChip`s (PostHog, Mixpanel), `lit`.
5. **Follow-ups** (mt-3): **Ask.followUps** as neutral `.tag`s, `text-fg-3`, plain spans (not buttons, not focusable).

The window's height is fixed at the finished frame (everything in the DOM from the start; `Typed` and `Stage` never reflow).

Loop (`useSequence`, in view only):

| Step | ms | Frame |
|---|---|---|
| 0 | 400 | reset: empty query (placeholder), answer area empty |
| 1 | 1100 | question types |
| 2 | 250 | ⏎ lights |
| 3 | 700 | thinking dots |
| 4 | 350 | sentence 1 |
| 5 | 350 | sentence 2 |
| 6 | 650 | mini chart wipes in, marker label fades at the end |
| 7 | 300 | source chips (60ms stagger, marks go lit) |
| 8 | 250 | follow-up chips |
| 9 | 3000 | hold |

≈ 7.4s. Reduced motion / before JS: step 9 frame.

**Phone:** window full width; query 15px (may wrap to 2 lines; query row min-h 56, fixed at the two-line height on phone); answer 16px; chart 120.

### 3.4 Metrics

`id="metrics"`. `SectionHeader num="03" label="Metrics"` + **Metrics.headline**.

**`MetricsTable`**: one `.window` (radius 18) with `WindowBar` "Atlas" + product chip, then the table, then a footer row **Metrics.footer** ("Atlas · Updated 2h ago") 12px `text-fg-3`, `border-t`.

- **≥ lg**: the 12 metrics in **two side-by-side tables** (rows 1–6 left, 7–12 right), `grid-cols-2`, a 1px `bg-line` divider between. Each table: column header row (h 36, 11px uppercase tracking 0.12em `text-fg-3`): **Metrics.columns** Metric · Now · Change · Last 12 weeks. Columns `grid-cols-[minmax(0,1.5fr)_5.5rem_4.5rem_8rem]`. Rows h 48, `border-t border-line`, px-5.
- **md–lg**: one table, 12 rows, same columns.
- Cells: Metric 14px `text-fg`; **Now** 15px `tabular-nums text-fg` right-aligned; **Change** 13px `tabular-nums` right-aligned, `text-fg-2`, preceded by a 10px `ArrowUp`/`ArrowDown`/`Minus` in `text-fg-3` (direction only, **no green/red**); **Last 12 weeks** `Sparkline` 128×24, stroke `fg-3` 1.25px, end dot `fg-2`.
- **Anomalies** (Activation, Setup completion): Change in `text-brand-300`, sparkline segment after the release in `brand-400` with brand end dot, a 2px `bg-brand-500` bar on the row's left edge, and a `live-dot` after the metric name on Activation. Nothing else on the page is crimson here.
- Numerals: Inter with `tabular-nums` (`font-variant-numeric: tabular-nums`) throughout the table. (The plan says "monospace numerals"; tabular Inter gives fixed-width digits without adding a font. See open decision 2.)
- **Sparkline data** (12 points each; put in the page's data file):

  | Metric | Points | Highlight from |
  |---|---|---|
  | Activation | 38.1 37.9 38.3 38.0 38.2 38.0 36.4 35.3 35.1 34.9 35.0 35.0 | 5 |
  | Setup completion | 68 69 68 68 69 68 64 62 62 61 62 62 | 5 |
  | Time to first project | 1.7 1.7 1.6 1.7 1.7 1.7 2.1 2.3 2.4 2.4 2.4 2.4 | — |
  | Week-4 retention | 43 43 44 44 44 45 45 45 46 46 46 46 | — |
  | Weekly active teams | 1240 1248 1251 1255 1262 1260 1266 1270 1271 1276 1280 1284 | — |
  | Projects created | 3820 3790 3850 3840 3870 3860 3880 3875 3890 3900 3905 3912 | — |
  | Invites sent per team | 2.7 2.6 2.7 2.7 2.8 2.7 2.7 2.6 2.7 2.7 2.7 2.7 | — |
  | Integrations connected | 2.0 2.0 2.0 1.9 2.0 2.0 1.9 1.9 1.9 1.9 1.9 1.9 | — |
  | Trial to paid | 13.8 13.9 13.8 14.0 13.9 13.9 14.0 14.0 13.9 14.0 14.1 14.0 | — |
  | Support tickets | 178 181 176 180 179 184 205 214 210 212 209 212 | — |
  | Feature adoption · Saved views | 25 26 27 27 28 28 29 29 30 30 31 31 | — |
  | Churned teams | 24 23 25 24 23 24 23 24 23 23 24 23 | — |

- **Motion**: the window reveals (`data-reveal`); rows fade in with 25ms stagger (`data-reveal` + `d()`), sparklines appear whole with their row (no draw). No loop; this section is meant to be still and dense.

**Phone (390):** one list, 12 rows × 64px. Row = `grid-cols-[1fr_auto]`, two lines: line 1 Metric 14px (truncate) · Now 15px right; line 2 `Sparkline` 96×18 · Change 12px right. Column header row hidden; the window bar reads "Atlas · Last 12 weeks" instead.

### 3.5 Related

`id="related"`. `SectionHeader num="04" label="Where the numbers go"` + **Related.headline**. `RelatedCards variant="compact"`: Research Agent, Product Agent, `body` = copy reasons, `linkText` = **Related.linkText**. `sm:grid-cols-2`, max-w 880.

### 3.6 CTA

`<CTASection title={CTA.headline} line={CTA.line} />`.

---

## 4. Light and dark

- The chart sits directly on `bg-bg` (no card) so it reads as the page's main surface in both schemes. Grid hairlines `ink/0.06` and dashed release marker `ink/0.25` are token-based and work in both.
- **Light**: the brand segment `brand-400` on `#f7f7f5` is fine in crimson; in mono light, `brand-400` is a light grey — check contrast of the dip segment and callout anchors against `bg-bg`; if too faint, use `brand-500` for the segment under `:root[data-scheme="light"]` (only scheme rule on this page).
- Brand area fill under the dip at 0.08 alpha: halve it in light if it looks pink-muddy.
- `Ask a number` window and the metrics table use `.window` (token surfaces).

---

## 5. New shared components

### 5.1 `ChartLine` (`components/site/ChartLine.tsx`)

SVG line chart with an overlay layer for HTML annotations. Plan §9.

```ts
type ChartLineProps = {
  data: number[];                          // evenly spaced points
  yDomain: [number, number];
  yTicks?: { value: number; label: string }[];
  xTicks?: { index: number; label: string }[];
  height: number | string;                 // fixed; never animated
  highlightFrom?: number;                  // index where the line switches to the brand stroke
  area?: "highlight" | "none";             // soft brand area under the highlighted part
  markers?: { index: number; label?: string; tone?: "neutral" | "brand" }[]; // dashed verticals
  reveal?: "wipe" | "none";                // "wipe": transform-only left→right reveal
  revealMs?: number;                       // default 1200
  on?: boolean;                            // plays the reveal when it turns true
  still?: boolean;                         // finished frame
  insets?: { top: number; right: number; bottom: number; left: number };
  ariaLabel: string;
  children?: ReactNode;                    // overlay layer (absolute, same box as the plot)
};
// For overlays: useChartScale() inside children → { x(index): percent, y(value): percent, px: { x(i), y(v) } (from a ResizeObserver) }
```

- Drawing: `<svg viewBox="0 0 1000 400" preserveAspectRatio="none">` with `vector-effect: non-scaling-stroke` on every stroke, so it's SSR-correct at any width without measuring. Labels and overlays are HTML positioned in %, never inside the scaled SVG (no stretched text).
- **Wipe reveal (transform only)**: the line group sits in a clip wrapper `overflow: clip` whose `transform` goes `translateX(-100%) → 0` while an inner wrapper goes `translateX(100%) → 0` in the same timing. The line appears stationary and is revealed left to right. No `stroke-dashoffset`, no `clip-path` animation, no cover colour (so it works on any surface).
- **Reused by:** Analyst hero + Ask a number, PostHog / Mixpanel integration pages ("a chart with Selixa's annotation"), Execution Agent outcome (activation recovering), blog embeds.

### 5.2 `Sparkline` (`components/site/Sparkline.tsx`)

```ts
type SparklineProps = {
  data: number[];
  width?: number; height?: number;         // default 96 × 24
  highlightFrom?: number;                  // brand segment + brand end dot from this index
  endDot?: boolean;                        // default true
  tone?: "muted" | "default";              // stroke fg-3 (muted) or fg-2
  className?: string;
};
```

`preserveAspectRatio="none"` SVG, non-scaling 1.25px stroke, `aria-hidden` (the row's numbers carry the meaning). No draw animation; appears with its container.
**Reused by:** Analyst metrics and hero tooltip, Research board (analyst note card), hub relay card's Analyst row (replace its bespoke 56×16 sparkline), Execution outcome, integration pages.

### 5.3 From other specs

`SourceChip` (Meeting spec §5.2).

Page-local: `ActivationChart` (ChartLine + callouts + cursor + phone pins/list), `AskNumber`, `MetricsTable`, `analyst-data.ts` (series + table rows).

---

## 6. Acceptance checklist (Reviewer)

**Chart scene**
- [ ] First screen at 1440×900, 1280×720 and 390×844 shows the headline and the whole plot; the line wipes in once on load (transform-only), then the −8% badge appears.
- [ ] Scrolling pins the chart; the read-cursor travels along the line and each callout attaches as the cursor reaches its anchor (Aug 12 → setup → calls → notes), then the summary.
- [ ] Scrolling up detaches callouts in reverse; the cursor goes back.
- [ ] Only the cursor's `transform` and callouts' `opacity`/`transform` change during scroll. Chart size never changes. No stroke-dashoffset, no clip-path animation.
- [ ] Callouts never overlap the line or each other at 1024, 1280, 1440 widths.
- [ ] Phone: numbered pins + list, 3 x labels, summary visible; landscape phone static.
- [ ] Reduced motion / no JS: drawn chart, all callouts and summary, no pinning.
- [ ] Crimson appears only on the dip segment, its anchors/badge/summary, and the two anomaly rows.

**Page**
- [ ] Ask a number: question types, answer fades in two sentences, mini chart with the May 6 marker, PostHog and Mixpanel chips; holds ~3s; window never changes height.
- [ ] Metrics: 12 rows exactly as copy, tabular numerals aligned in columns, sparklines per row; two tables side by side ≥ lg, stacked rows on phone; no green/red.
- [ ] Related: Research and Product. Ends with `CTASection`; no other primary button.
- [ ] Light and dark; mono theme contrast of the dip checked; tokens only; Satoshi Light headlines; nothing above 500.

---

## 7. Open decisions

1. **Annotations header placement.** Desktop puts **Annotations.headline/line** in the pinned stage's foot row (so hero + chart own the first screen); phone renders it above the scene. Alternative: skip that header entirely and let the callouts speak (the plan has no header for this step).
2. **"Monospace numerals"** (plan) vs Inter `tabular-nums` (spec). Tabular Inter keeps the site to two typefaces; a true mono (e.g. `ui-monospace`) only in the metrics table would be more "terminal". Recommend tabular Inter.
3. **Eyebrow label** "Why it moved" for the Annotations section is the Designer's wording; Writer to confirm or replace.
4. Integration status for PostHog / Mixpanel / Intercom / GitHub (copy TODO 1) — chips show marks only, no status.
