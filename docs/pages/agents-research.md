# `/agents/research`: the investigation board (design spec)

Plan: `docs/SITE_PLAN.md` §3.3. Copy: `docs/pages/agents-research.copy.md` (sections **Hero, Board, Brief, Sources, Related, CTA**; slot names below match it). Data: `agentBySlug("research")`.
Shared (hub spec §5): `PageHero` (title block only, see 3.1), `StickyScene` + hooks + `seg` / `smoothstep` / `useMeasure`, `RelatedCards`, `CTASection`. Shared from the Meeting spec: **`ToolStrip`**, **`SourceChip`**. New shared here: **`PinCard`** and **`Sparkline`** (Sparkline is specified in the Analyst spec §5.2; the Market cluster uses it).

---

## 1. Concept

**A pin board of evidence you pan across.** The page opens on a huge board of pinned and taped scraps (customer quotes, tickets, abstract competitor screenshots, market notes) tied together with thread. The headline sits on the board. Scrolling moves a camera: it glides in to the *Customers* cluster, across to *Competitors*, down to *Market*, then pulls back as every thread lights and runs into one card, the Research brief.

Why it can't be mistaken for another page:
- It's the **only free-form 2-D canvas** on the site, and the only scene where the camera moves (pan + zoom) instead of the content.
- It's the only **tactile** page: paper cards, slight rotations, pins and tape, a dot-grid surface, string threads. Meeting is a dark screen, Analyst a precise grid, the hub a clean line of stations.
- The hero *is* the scene's first frame: no separate hero visual.

---

## 2. Page structure

Shell as the hub. No `<Background>`.

| # | Section | Copy section | Component | Motion |
|---|---|---|---|---|
| 1–3 | Hero → Board → Brief | Hero, Board, Brief | `StickyScene` + `EvidenceBoard` (page-local) + `PageHero` title block + `BriefCard` (page-local) | **scroll-scrubbed camera** (the only one) |
| 4 | Sources | Sources | `ToolStrip` | reveal, marks light in view |
| 5 | Related | Related | `RelatedCards variant="compact"` | reveal |
| 6 | CTA | CTA | `CTASection` | reveal |

Anchors: `#board` (the scene), `#sources`, `#related`. Eyebrows: the hero pill carries **Hero.eyebrow**; `01 Sources`, `02 Where the brief goes`.

The scene starts at the very top of `main`, so p = 0 at page load (the hero frame).

---

## 3. The scene: hero, board, brief

`<StickyScene id="board" length={4.6} label={Hero.headline}>`. Stage `calc(100svh - 4.5rem)`, full container width (1280, `px-5 sm:px-8` as usual; the board itself bleeds to the stage edges: stage `overflow: clip`, board layer `inset-0` of the stage with negative side margins equal to the container padding so it looks full-bleed).

### 3.1 Layers in the stage (bottom → top)

1. **Board** (`EvidenceBoard`): a world-sized `div`, absolutely positioned at stage `(0,0)` with `transform-origin: 0 0`, moved only by `transform: translate3d(tx, ty, 0) scale(s)`. Contains the surface, threads SVG, cluster labels, cards, the in-world brief placeholder. `contain: layout paint`.
2. **Hero scrim** (desktop): static `linear-gradient(90deg, var(--color-bg) 0%, color-mix(in srgb, var(--color-bg) 85%, transparent) 30%, transparent 55%)`, full stage. Phone: same gradient top→bottom, 0–45%. Its `opacity` is scrubbed with the title block.
3. **Title block**: the `PageHero` look without its own section: `.pill` with `live-dot` **Hero.eyebrow**; H1 **Hero.headline** (`clamp(2.75rem,6.4vw,5.75rem)`, Satoshi Light, lowercase, `tracking-[-0.05em]`); **Hero.line** (data). Desktop: left aligned, vertically centred, `max-w-[30rem]`, at the stage's left padding. Phone: top of the stage, `pt-8`, full width, H1 ~2.75rem on two lines. Build as `PageHero align="left" rings={false}` rendered inside the stage, or extract its title block as `PageHeroTitle` so both share one source (Builder's call; the look must be identical).
4. **Status tag** (top-right of the stage, 16px inset): `.tag` with `live-dot` + **Hero.status** (data `status`, "Tracking 6 competitors"). Scrubs out with the title block.
5. **Caption bar** (bottom-left, 24px inset; phone: bottom, full width minus 16px): a `.card` pill (radius 9999 desktop, 14 phone), px-4 py-2.5: numbered `01`/`02`/`03` in 12px `tabular-nums text-brand-300`, then the stop's **Board.stops[i].caption** 14px `text-fg`. All three captions stacked in one grid cell; the current one at `opacity:1` (200ms cross-fade, 6px rise). Hidden (opacity 0) when no stop is active.
6. **Stop dots** (right edge, vertically centred, desktop only): three 6px dots + labels "Customers / Competitors / Market" (12px `text-fg-3`), the active one brand + label `text-fg` (opacity swaps). A minimap of where the camera is. Hidden on phone.
7. **Brief overlay**: **Brief.headline** (h2 size `clamp(1.75rem,3vw,2.5rem)`, Satoshi Light lowercase, centred) above `BriefCard`, both centred in the stage. Hidden until the brief beat.

### 3.2 The board, desktop world (≥ md): 2400 × 1500 world px

Surface: `bg-bg` with a static dot grid `radial-gradient(rgb(var(--ink-rgb)/0.07) 1px, transparent 1.3px) 0 0 / 28px 28px`. No border, it bleeds past every edge (world larger than any stage).

Cards (centre x, y · width · rotation). All sizes native at scale 1; the camera never scales above 1, so text is never upscaled.

| Cluster (knot) | Card | Slot | Kind | Pos | W | Rot |
|---|---|---|---|---|---|---|
| **Customers** (560, 560) | label "01 Customers" at (250, 250) | — | cluster label | | | |
| | cluster chip at (560, 250) | Board.stops[0].chip | chip | | | |
| | Maya interview quote | cards[0] | quote, pinned | (400, 390) | 300 | −2° |
| | Customer call quote | cards[1] | quote, pinned | (730, 370) | 280 | 1.5° |
| | Ticket #4127 | cards[2] | ticket, taped | (390, 650) | 250 | 1° |
| | Ticket #4133 | cards[3] | ticket, taped | (690, 670) | 250 | −1.5° |
| | 7 related notes | cards[4] | count, pinned | (550, 860) | 260 | 0.5° |
| **Competitors** (1840, 540) | label "02 Competitors" at (1540, 250) | | | | | |
| | cluster chip at (1850, 250) | Board.stops[1].chip | chip | | | |
| | Competitor A | cards[0] | screenshot, taped | (1660, 440) | 300 | −1.5° |
| | Competitor B | cards[1] | screenshot, taped | (2010, 410) | 300 | 2° |
| | Competitor C | cards[2] | screenshot, taped | (1840, 740) | 300 | −0.5° |
| **Market** (1180, 1200) | label "03 Market" at (860, 1030) | | | | | |
| | Market note 1 | cards[0] | note, pinned | (990, 1150) | 270 | 1° |
| | Market note 2 | cards[1] | note, pinned | (1380, 1130) | 270 | −2° |
| | Analyst note | cards[2] | note + `Sparkline` (dip), pinned | (1180, 1350) | 290 | 0.5° |
| **Brief placeholder** | (1200, 650), 420 × 240, rot 0 | — | in-world "Research brief · drafting" card with `.thinking` dots | | | |

Cluster labels: "0N" in 14px `tabular-nums text-brand-300`, name in Satoshi Light 44px `tracking-[-0.03em] text-fg-3`. Cluster chips: `.tag` brand tint, 13px.

**Threads**: one `<svg>` at world size, under the cards. Each card's pin → its cluster knot; each knot → the brief placeholder's top-centre. Paths are gentle string sags: quadratic Bézier with the control point at the midpoint + 40px down (knot→brief threads: + 80px). `vector-effect: non-scaling-stroke` so they stay 1px at any zoom.
- Base: stroke `rgb(var(--ink-rgb)/0.18)`, 1px.
- Lit: a duplicate path, `rgb(var(--brand-400-rgb)/0.75)`, 1.25px, `opacity` 0 → 1 (400ms CSS) on its beat. No dash-offset drawing.
- Knots: 12px circle, 1px `border-line-strong`, `bg-panel`; lit overlay brand fill.
- **Thread labels** (copy: supports · contradicts · same theme): 11px `text-fg-3` on a `bg-bg` pill, at path midpoints. Place: "supports" on Customers→brief and Competitors→brief; "same theme" on a thread from cards[4] (7 notes) to Market note 2; **"contradicts"** on a thread from Market note 1 to Competitor C, drawn in the base colour with a 4-2 dash (static `stroke-dasharray`, never animated) and its label in `text-brand-300`.

**`PinCard` looks** (§5.1): paper panel, radius 6 (paper, not UI), `bg-panel` (dark: `bg-panel-2`), `border-line`, shadow `0 1px 0 rgb(var(--ink-rgb)/0.04), 0 14px 30px -18px rgb(var(--shadow-rgb)/0.55)`. p-4. Tag line on top: 10.5px uppercase tracking 0.12em `text-fg-3` (the copy's "Call · Interview · Maya", "Ticket · #4127", etc.).
- quote: 16px `leading-[1.45] text-fg`, curly quotes; attribution already in the tag line.
- ticket: `#4127` 13px `tabular-nums text-fg-3` + subject 14px `text-fg`, a status dot.
- count: numeral in Satoshi Light 36px `tabular-nums` + text 14px.
- screenshot: 16:9 `bg-well` rounded-[4px] thumbnail of **grey UI blocks** (a top bar, a left rail, 3 bars, a button shape, all `bg-ink/[0.08–0.14]`; each of A/B/C a different arrangement: A = 3-step stepper, B = sample-data table, C = single centred screen) + caption line (name 13px `text-fg`, detail 12px `text-fg-3`). No logos.
- note: 14px `text-fg-2`; analyst note adds a 96×24 `Sparkline` with the dip in brand.
- **Fasteners**: `pinned` = 10px `bg-brand-500` circle with a 3px highlight dot, centred on the top edge (−5px); `taped` = 64×18 strip `bg-ink/[0.07]` rotated −4°, overlapping the top edge. Static.

### 3.3 The board, phone world (< md): 800 × 2000 world px

Same cards, fewer and stacked. Clusters top to bottom, knots on a vertical spine at x = 400; the brief placeholder at the bottom.

| Cluster (knot) | Cards (slot, pos, W 300, rot) |
|---|---|
| Customers (400, 470), label at (70, 120), chip at (70, 170) | cards[0] (380, 330, −2°) · cards[2] (420, 560, 1°) · cards[4] (390, 770, 0.5°) |
| Competitors (400, 1080), label (70, 900), chip (70, 950) | cards[0] (390, 1060, −1.5°) · cards[2] (410, 1280, 1°) (B dropped) |
| Market (400, 1560), label (70, 1420) | cards[0] (380, 1540, 1°) · cards[2] (410, 1720, −1°) |
| Brief placeholder (400, 1920), 340 × 160 | |

Cards on phone: W 300, text sizes as desktop (they're shown at scale ~1). Thread labels: only "contradicts" is kept (Market note 1 → Competitor C).

### 3.4 Camera

Camera state `(cx, cy, s)`: the world point at the stage centre and the scale. Applied as

```ts
tx = W / 2 - cx * s;  ty = H / 2 - cy * s;
board.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
```

`W`, `H` = stage size (`useMeasure`, cached). Stops are defined as a world rect; `s = min(1, (W·0.9)/rectW, (H·0.82)/rectH)`.

| Stop | Desktop rect (x, y, w, h) | Phone rect | Note |
|---|---|---|---|
| S0 hero | whole world, centre shifted: cx = 1000 (so the board sits right of the title) | whole world, cy shifted so the board fills the lower 55% | overview |
| S1 Customers | (200, 220, 760, 760) | (40, 100, 720, 760) | |
| S2 Competitors | (1480, 220, 720, 700) | (40, 880, 720, 520) | |
| S3 Market | (820, 1000, 720, 460) | (40, 1400, 720, 440) | |
| S4 synthesis | whole world, centred | whole world, centred | pull back |

Between stops: `t = smoothstep(seg(p, a, b))`; interpolate `cx`, `cy` linearly and **`s` in log space** (`s = exp(lerp(ln s1, ln s2, t))`) so zooming feels even.

#### Motion script (exact)

| p | What | Kind |
|---|---|---|
| 0.00–0.06 | hero frame (S0), nothing moves | — |
| 0.05–0.14 | title block, scrim, status tag: `opacity 1→0`, title `translateY(0→−24px)` | scrubbed |
| 0.08–0.24 | camera S0 → S1 | scrubbed |
| **0.24** | beat 1: Customers cluster lit (its threads + knot lit layers on, cluster chip `scale .94→1` pop), caption 01 on, stop dot 1 | stepped |
| 0.34 | beat 2: caption off (lit threads stay at 60% opacity: "visited") | stepped |
| 0.34–0.46 | camera S1 → S2 | scrubbed |
| **0.46** | beat 3: Competitors lit, caption 02 | stepped |
| 0.56 | beat 4: caption off | stepped |
| 0.56–0.68 | camera S2 → S3 | scrubbed |
| **0.68** | beat 5: Market lit, caption 03; "contradicts" label brightens | stepped |
| 0.76 | beat 6: caption off | stepped |
| 0.76–0.86 | camera S3 → S4 | scrubbed |
| **0.84** | beat 7: **converge**: the three knot→brief threads light (staggered 0 / 80 / 160ms), brief placeholder's thinking dots on, stop dots all done | stepped |
| **0.90** | beat 8: board `opacity → 0.28` (400ms); brief overlay in: headline then `BriefCard` (`opacity 0→1`, `translateY(16px) scale(.97) → none`, 400ms `--ease-out-expo`), evidence `Count` to 16 (500ms), source chips light 60ms stagger | stepped |
| 0.90–1.00 | hold on the brief | — |

```ts
const BEATS = [0.24, 0.34, 0.46, 0.56, 0.68, 0.76, 0.84, 0.90];
const b = useSceneBeat(BEATS);
// cluster k (0..2) lit ⇔ b ≥ 2k+1 ; caption k shown ⇔ b === 2k+1 ; converge ⇔ b ≥ 7 ; brief ⇔ b ≥ 8
```

Scroll budget: 4.6 viewports; each move ≈ 0.5 viewport, each hold ≈ 0.45 viewport (long enough to read a cluster's cards).

**Raster crispness (important).** Set `will-change: transform` on the board **only while the camera is moving** (p inside a move window) and remove it during holds. Chrome freezes the raster scale of a `will-change` layer; dropping it at rest lets text re-raster crisply at the stop's scale. Toggle it from the progress callback (class toggle only when crossing a window edge, not per frame).

### 3.5 BriefCard (the synthesis)

Stage-space overlay, `w-[min(540px,100%)]`, centred; phone full width minus 0 (inside the 16px gutter).
- Shell: `.window` radius 20 + a brand pin on its top edge (the same fastener as the board: the brief is the last thing pinned).
- Header row: product chip (20px square "A", `bg-brand-500 text-[var(--brand-on)]`) + **Brief.card.label** ("Atlas · Research brief") 12px `text-fg-3`; right, **Brief.card.confidence** as `.tag` brand tint with the label "Confidence · High" (*Writer: confirm label form*).
- **Brief.card.title** 21px Inter 400 `tracking-[-0.015em] text-fg`; **Brief.card.finding** 15px `leading-[1.55] text-fg-2`, mt-2.
- Evidence row (mt-5, `border-t border-line pt-4`): left, `Count` **16** in Satoshi Light 44px `tabular-nums leading-none` + **Brief.card.evidenceLabel** ("pieces of evidence") 13px `text-fg-3`; right (desktop) / below (phone), the **breakdown**: four `tabular-nums` mini stats (4 · 7 · 3 · 2) with 11px labels, separated by 1px `bg-line` dividers, `grid-cols-4`.
- Source chips row: four `SourceChip`s (Intercom, Slack, Notion, Google Drive from `LOGOS`), `lit` on at the brief beat.
- Footer (`border-t border-line`, h 44): `Compass` 14px `text-brand-300` + **Brief.card.footer** ("Sent to Product Agent") 13px `text-fg-2`, `ArrowRight` right-aligned. Decorative (not a link; the Related section links).

Height ≈ 400 desktop, ≈ 470 phone (breakdown wraps to its own row). With the 52px headline above, fits a 595px phone stage.

### 3.6 Static frame (reduced motion, no JS, landscape phone)

In still mode the stage renders as a normal, readable section instead of a camera:
1. The title block as a normal `PageHero align="left"` (no scrim), status tag beside the pill.
2. **The board as a figure**: a `w-full aspect-[8/5]` box (`aria-hidden`) holding the desktop world, scaled to fit with CSS only: world `position:absolute; left:50%; top:50%; transform: translate(-50%,-50%) scale(var(--board-fit))`, `--board-fit` from media queries (≥1280: 0.5, ≥1024: 0.4, ≥768: 0.3, phone: 0.15). All clusters lit, threads lit, placeholder hidden. Decorative texture; not meant to be read at this size.
3. Three captions as a `grid sm:grid-cols-3 gap-4` list under the figure (`01`/`02`/`03` + caption).
4. **Brief.headline** + `BriefCard` centred below, fully populated (16, chips lit).

Also use this CSS-fit transform as the board's **default** style in live mode, so before hydration the stage shows a sensible overview rather than the world's top-left corner; JS replaces it on mount (layout effect, before paint).

Screen readers: the stage visuals are `aria-hidden`; an `sr-only` structure lists each stop (caption + its cards' text) and then the brief, in both modes.

---

## 4. Sources

`id="sources"`. Centred. `SectionHeader num="01" label="Sources" align="center"` + **Sources.headline**. `ToolStrip size="lg" align="center" lit="inView"` with Intercom, Slack, Notion, Google Drive (`LOGOS`), 64px under the header. Optional per-tool `caption` (what it reads) — *not in copy; Writer may add (e.g. "Conversations and tickets")*; if absent, name only. Status tags per plan §11.1 when known.
Phone: 2 × 2 grid of tiles, 72px.

## 5. Related

`id="related"`. `SectionHeader num="02" label="Where the brief goes"` + **Related.headline**. `RelatedCards variant="compact"`: Analyst Agent, Product Agent; `body` = the copy's reason lines; `linkText` = **Related.linkText**. `sm:grid-cols-2`, max-w 880.

## 6. CTA

`<CTASection title={CTA.headline} line={CTA.line} />`.

---

## 7. Light and dark

- **Light**: the board surface is `bg-bg` (warm off-white) with the dot grid; cards `bg-panel` (white) read as paper with the soft shadow. Tape strips `bg-ink/[0.07]`. This is the page's best scheme; check the shadow isn't muddy (`--shadow-rgb` is warm in light, good).
- **Dark**: cards use `bg-panel-2` so they lift off `bg-bg`; shadow alpha is naturally stronger. Dot grid `ink/0.07` reads as faint chalk.
- Pins and lit threads are brand; in mono they're grey with stronger contrast; the "contradicts" label still differs by dash pattern, not only colour.
- No `filter`, no `backdrop-filter` on the board (the dim at the brief beat is `opacity`).

---

## 8. New shared components

### 8.1 `PinCard` (`components/site/PinCard.tsx`)

```ts
type PinCardProps = {
  kind: "quote" | "ticket" | "count" | "screenshot" | "note";
  tag: string;                     // small-caps line
  children: ReactNode;             // body (quote text, subject, etc.)
  fasten?: "pin" | "tape";         // default by kind: screenshot/ticket → tape, else pin
  rotate?: number;                 // degrees, static
  lit?: boolean;                   // brand ring overlay (opacity), for "the one that matters"
  className?: string;
};
```

Paper panel as §3.2. **Reused by:** `/about` manifesto (scraps), use-case "without Selixa" side (scattered notes), Product Agent margin notes (as note cards), `/404` tumbling letters' resting state.

### 8.2 Uses from other specs

`ToolStrip`, `SourceChip` (Meeting spec §5), `Sparkline` (Analyst spec §5.2).

Page-local: `EvidenceBoard` (world, threads, camera), `BriefCard`, board data (`BOARD_DESKTOP`, `BOARD_PHONE` arrays of `{slot, x, y, w, rot, kind}` in the page folder, copy text resolved from the copy sheet strings).

---

## 9. Acceptance checklist (Reviewer)

**Scene**
- [ ] Page loads on the board with the headline over it; the title fades as the camera starts moving. First screen fits at 1440×900, 1280×720, 390×844.
- [ ] Camera stops on Customers, Competitors, Market in that order, one caption per stop, then pulls back; all threads light into the brief, which lands readable in the centre with 16 and four source chips.
- [ ] Scroll up rewinds exactly (brief leaves, threads un-light, camera returns, title comes back at the top).
- [ ] Camera never scales above 1; text at each stop is crisp (will-change toggled off at holds).
- [ ] Only the board's `transform` and layers' `opacity` change while scrolling; no dash-offset, no filter, no layout. One transform write per frame.
- [ ] Phone: vertical world, camera pans down; captions full width at the bottom; nothing overflows; landscape phone static.
- [ ] Reduced motion / no JS: title, board figure, three captions, brief. No pinning.
- [ ] No real brands on the board (Competitor A/B/C are grey UI blocks); "contradicts" appears once.

**Page**
- [ ] Sources: Intercom, Slack, Notion, Google Drive marks via `BrandMark`, lit in view.
- [ ] Related: Analyst and Product. Ends with `CTASection`; no other primary button.
- [ ] Light and dark checked (paper cards read in both); mono theme; tokens only; Satoshi Light headlines, nothing above 500.

---

## 10. Open decisions

1. **Competitor B on phone** is dropped to keep three cards per cluster; the caption still says "3 of 6". Fine, or keep all three competitors (phone cluster gets taller).
2. **Static board figure** (reduced motion) is decorative at ≤ 0.5 scale; if you'd rather it be readable, the alternative is a plain three-column list of the cards (unrotated) — more legible, less "board".
3. **Copy additions** for the Writer: optional per-tool captions in Sources; confidence label form ("Confidence · High").
4. Source status (copy TODO 1) and the "Tracking 6 competitors" claim (copy TODO 2) — shown only as demo state.
