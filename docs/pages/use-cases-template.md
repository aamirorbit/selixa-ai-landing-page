# `/use-cases/[slug]`: a day with Selixa (design spec)

Plan: `docs/SITE_PLAN.md` §5.2. Copy: `docs/pages/use-cases-template.copy.md`. Data: `lib/content/use-cases.ts` (`UseCase`: `without`/`with` paired by index, `day` ×4, `agents`, `integrations` by name, `variant`), agents from `lib/content/agents.ts`, integrations joined by `name` to `lib/content/integrations.ts` + `logos.ts`.
Reuses: **`PageHero`, `RelatedCards`, `CTASection`** (agents-hub §5), **`IntegrationTile size="sm"`** (integrations-hub §5.1). New shared pieces: **`SplitCompare`**, **`DayTimeline`** (§5).

Route: `app/use-cases/[slug]/page.tsx`, `generateStaticParams` from `USE_CASES`, `const { slug } = await params`, `notFound()` for unknown slugs, `generateMetadata` per the copy pattern.

---

## 1. Concept

**A before/after split you drag.** The hero is one frame showing the same day twice: on the left, *without Selixa* (tabs, scraps, a stale card, unread pings, all slightly askew); on the right, *with Selixa* (the same four things, resolved, in tidy rows). Each chaotic scrap sits on exactly the same row as its fix, so dragging the divider across *clears the chaos* row by row. On touch it's a two-state toggle that wipes between them.

Why it's unlike other pages: it's the only interaction on the site where the visitor *controls a comparison*. The rest of the page is a calm day timeline, whose layout rotates across three variants so neighbouring use cases don't look cloned.

---

## 2. Page structure

Shell as the agents hub.

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero + split | `PageHero` + `SplitCompare` (shared, new) + `DayScraps` / `DayResolved` (page-local content) | load reveal; one intro nudge; drag/keys/toggle |
| 2 | Timeline | `DayTimeline variant={A \| B \| C}` (shared, new) | reveal; A: active moment follows reading; B: rail fills once; C: cards stack (CSS sticky) |
| 3 | Agents | `RelatedCards variant="compact"` | reveal |
| 4 | Tools | `IntegrationTile size="sm"` row | reveal; lit on hover/focus only |
| 5 | CTA | `CTASection` | reveal |

Eyebrows: `01 The day`, `02 Agents`, `03 Tools`. Anchors `#day`, `#agents`, `#tools`.

**Variants only change section 2's layout** (defined exactly in §3.2). Hero, agents, tools and CTA are identical on all 12 pages, which keeps the template maintainable while the middle of each page looks different. Data already rotates `variant` so that within each hub group no two neighbours share one.

---

## 3. Sections

### 3.1 Hero

`PageHero align="center"`, not `fill`, `rings` on, `pt-16 sm:pt-24`.
- Eyebrow **Hero.eyebrow** "Use cases · {title}" ("Use cases" links to `/use-cases`).
- H1 **Hero.headline**: `line` with its first letter lowercased ("less time collecting context."). One line at ≥ lg; two max on phone.
- Line **Hero.line** = `pain`, `max-w-[40rem]`.
- Visual (mt-12): `SplitCompare` full container width, `max-w-[1120px]`.
- Reveal delays: pill 60 · H1 140 · line 220 · split 320.

**Fold target**: at 1280×720, the split's top edge and its labels are visible (≈ y 480); at 1440×900, at least 60% of the split.

#### 3.1.1 The split frame

- `.window` (no bar), radius 24, `overflow: hidden` (safe: nothing sticky inside).
- Height: `h-[440px]` at ≥ lg, `h-[420px]` md, `h-[480px]` phone. `@media (max-height: 800px) and (min-width: 1024px)`: `h-[380px]`.
- Two layers of **identical size and identical row geometry**:

```
┌───────────────────────────────────────────┬───────────────────────────────────────────┐
│ [Without Selixa]                          ┃                           [◉ With Selixa] │  labels, 20px from top
│                                           ┃                                           │
│  ╭─tab─╮╭─tab─╮╭─12 tabs of research─╮    ┃   ✓  Evidence in one place                │  row 1
│    ┌──────────────────────┐               ┃   ─────────────────────────────────────── │
│    │ Call notes nobody … │ ← rotated -2° ◀▶   ✓  Decisions from every call            │  row 2 (knob)
│  ┌─────────────────────────────┐          ┃   ─────────────────────────────────────── │
│  │ ⚠ A stale roadmap  (struck) │          ┃   ✓  A roadmap that stays current         │  row 3
│      💬 Status updates by hand  •         ┃   ─────────────────────────────────────── │
│                                           ┃   ✓  Updates written for you              │  row 4
└───────────────────────────────────────────┴───────────────────────────────────────────┘
```

- **Row grid** shared by both layers: `absolute inset-x-0 top-16 bottom-8 grid` with `grid-template-rows: repeat(n, 1fr)` (n = 3 or 4), horizontal padding `px-8` (phone `px-4`). Row *i* in each layer is the same box. That's what makes the drag read as "this became that".
- **Without layer** (`DayScraps`, bottom, full frame): background `bg-panel` with a faint mess of decorative outlines (4–5 rectangles `border border-line rounded-[10px]`, rotated −4…+3°, partly off-frame, `aria-hidden`). Scraps, one per `without[i]`, each vertically centred in its row, **type by index**:
  0. **Tab strip**: three browser-tab shapes (`rounded-t-[8px] border border-line border-b-0 bg-ink/[0.03] h-8`), the first two blank (width 64px, a 6px `bg-ink/[0.08]` bar inside), the third wider holding `without[0]` (13px `text-fg-2 truncate`), a 1px baseline under them. Offset `translateX(8px)`.
  1. **Loose note**: `rounded-[6px] bg-panel-2 border border-line px-3 py-2 shadow-sm`, rotated −2°, a 6px `bg-ink/20` pin dot top-centre, text 13.5px `text-fg-2`. Offset `translateX(28px)`.
  2. **Stale card**: `.card` px-3 py-2, lucide `CircleAlert` 14px `text-fg-3`, text 13.5px `text-fg-3 line-through decoration-ink/30`, rotated +1°.
  3. **Ping**: a chat bubble (`rounded-[14px] rounded-bl-[4px] bg-ink/[0.05] px-3 py-2`), lucide `MessageSquare` 13px `text-fg-3`, text 13.5px `text-fg-2`, and an unread dot (8px `bg-brand-400`) at its top-right. Rotated −1°, offset `translateX(18px)`.
  Rotations/offsets are static CSS (no motion). Max scrap width 80% of the layer half at the default split, so text isn't hidden under the divider at 50%.
- **With layer** (`DayResolved`, top): background `bg-panel` plus a soft brand wash (`radial-gradient(70% 60% at 85% 20%, rgb(var(--brand-500-rgb)/0.08), transparent 70%)`). Rows, one per `with[i]`, content **right-aligned block** (`ml-auto w-[min(26rem,46%)]` desktop, so it sits in the right half at 50%), each row: 20px circle `bg-brand-500/15 border border-brand-400/30` with `Check` 12px `text-brand-300`, text 15px `text-fg`, and a `border-t border-line` between rows (not above the first). Straight, aligned, calm: the contrast with the scraps is the message.
  - Multi-product / agencies / venture pages: `with` items speak of separate contexts; don't add product chips here (copy note: never merge products into one container). Plain rows are safe.
- **Labels** (inside their layers, so they're clipped with them): **Split.leftLabel** "Without Selixa" `.tag` top-left (20px inset); **Split.rightLabel** "With Selixa" `.tag` top-right with the brand tint and a 12px `Orb`-dot (use a 10px `bg-brand-400` dot, not a real orb, at this size). On fine pointers they're buttons: clicking "Without" animates the divider to 1 (all Without), "With" to 0 (all With).

#### 3.1.2 The divider, drag, keys, toggle

Defined in `SplitCompare` (§5.1). Page-specific content:
- **Drag hint** **Split.dragHint** ("Drag to clear the chaos"): a `.tag` under the knob (knob centre + 36px), with lucide `ChevronsLeftRight` 12px. Fades out (opacity 300ms) after the first drag, click or key move, and stays gone for the page view.
- Slider label **Split.handleLabel**; keyboard hint **Split.keyboardHint** as `aria-describedby` (`sr-only`).
- Touch toggle labels **Split.toggleWithout** "Without", **Split.toggleWith** "With Selixa"; default **Without**.
- Screen readers: both layers are `aria-hidden`; a `sr-only` block renders "Without Selixa: {without joined by '; '}. With Selixa: {with joined by '; '}." so the content is available without dragging.

### 3.2 Timeline (`#day`)

Common to all variants:
- Header: `SectionHeader num="01" label="The day"` + **Timeline.headline** ("a day with Selixa.") + **Timeline.line**.
- **Moment block** (the content unit, same in all variants): time (Inter 300, 32px, `tabular-nums tracking-[-0.02em] text-fg`) with a time-of-day icon before it (lucide, 14px `text-fg-3`, `aria-hidden`: hour < 12 → `Sunrise`, < 17 → `Sun`, else `Sunset`; parse `time` "H:MM"). Then `moment` 17px `text-fg` weight 500, then the Selixa line: `Orb size={18}` + optional label **Timeline.selixaLabel** (12px `text-fg-3`) + `selixa` 15px `text-fg-2 leading-[1.5]`.
- The morning → evening read comes from the times, the icons and order; no gradients or sky colours.
- Timeline has no auto-playing loop. Motion is reveal plus the variant's single idea.

#### Variant A: timeline on the left (sticky index)

Pages: solo-founders, multi-product-founders, design-teams, product-ops.

- **≥ lg**: `grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-16 items-start`.
  - **Left** (`position: sticky; top: 7rem`): the section header, then an **index** 40px below: 4 entries, each `grid grid-cols-[3.5rem_14px_1fr] items-center gap-3 py-2.5`: time 13px `tabular-nums`, node (8px dot), moment 15px. A 1px rail `bg-ink/[0.1]` runs through the nodes; a fill layer `bg-brand-400` over it scales `scaleY(k/3)` (origin top) to the active index *k* with a 400ms transition. Active entry: dot brand + 3px ring `ring-brand-500/20`, text `text-fg`; others `text-fg-3`. Entries are buttons: click → `window.scrollTo({ top: card k top − 120, behavior: "smooth" })` (Lenis glides).
  - **Right**: 4 moment cards stacked `gap-4`, each `.card` radius 20, p-8, `min-h-[220px]`, holding the moment block. The active card shows a pre-rendered `card-lit` layer (`opacity` 0 → 1, 300ms).
  - **Active index**: an `IntersectionObserver` on the 4 cards with `rootMargin: "-45% 0px -45% 0px"`; the last card to intersect that band is active. State changes only when crossing (4 changes total per pass). Not scroll-scrubbed.
  - The sticky column must not have an `overflow` ancestor (the page `main` uses `overflow-x-clip`, which is fine).
- **< lg**: no sticky. Header, then the moments as a vertical list: rail on the left (node column 20px), each moment block beside its node, `gap-8`. First node brand, others neutral; no active tracking.
- Static / reduced motion: index shows moment 1 active, rail fill at 0; cards un-lit except the first. Reads fine.

#### Variant B: timeline across the top

Pages: lean-startups, heads-of-product, product-led-saas, agencies-and-studios.

- **≥ md**: header centred. 48px below, a **horizontal rail** across the container (max-w 1120): `grid grid-cols-4`, each column centred on a stop: time-of-day icon + time (18px `tabular-nums text-fg-2`) above an 10px node; a 1px rail `bg-ink/[0.1]` through the nodes from stop 1 centre to stop 4 centre, with a fill layer `scaleX(0 → 1)` (origin left) that plays **once** when the rail enters view: 900ms `ease-out-expo`; nodes turn brand as the fill passes (staggered 0/300/600/900ms, opacity of a brand overlay). Below each stop a 20px vertical stem (`bg-ink/[0.1]`) into its card.
  - Cards: `grid grid-cols-4 gap-3`, each `.card` radius 18, p-6, `min-h-[200px]`, holding the moment block **without** the time (it's on the rail): moment + Selixa line.
  - md–lg: rail and stops as above but cards `grid-cols-2` (2×2) and the stems hidden; cards repeat the time in 12px `text-fg-3` at their top so the pairing is clear.
- **Phone**: a mini rail (358px wide, 4 stops, time 12px) above a **horizontal carousel** of the four cards: container `flex overflow-x-auto snap-x snap-mandatory gap-3 -mx-5 px-5 scroll-px-5`, cards `w-[85%] shrink-0 snap-center`, scrollbar hidden. The active stop follows the snapped card: a passive `scroll` listener on the carousel, rAF-throttled, `k = round(scrollLeft / (cardWidth + gap))` (card width cached by ResizeObserver), state only on change; the active node gets the brand overlay, the rail fill `scaleX(k/3)` with 300ms transition. Tapping a stop scrolls the carousel to that card (`carousel.scrollTo({ left, behavior: "smooth" })`). Lenis leaves native horizontal touch scrolling in a nested container alone, so no `data-lenis-prevent` is needed; the Builder should confirm a horizontal trackpad swipe over the carousel still scrolls it on desktop-width touch laptops.
- Static / reduced motion: rail fully filled, all nodes brand, carousel still scrollable (native).

#### Variant C: stacked cards

Pages: product-managers, engineering-leads, customer-success, venture-studios.

- Header centred. Below, a single centred column `max-w-[760px]`.
- The 4 moment cards **stack like a deck as you scroll**, using CSS only: each card `position: sticky; top: calc(7rem + i × 14px)`, `margin-bottom: 28vh` (last card: 0), so each new card slides up over the previous one and leaves a 14px edge of it showing. Cards must be **opaque**: `.window` styling (no bar) radius 22, `bg-panel`, p-8, `min-h-[208px]`, `z-index: i + 1`.
- Card layout (≥ md): `grid grid-cols-[9rem_1fr] gap-8`: left, time-of-day icon over the big time; right, moment + Selixa line. The card's top-left shows its index "1/4" 11px `text-fg-3 tabular-nums`.
- Depth cue without animating anything: each card has a static `box-shadow: 0 -18px 40px -24px rgb(var(--shadow-rgb) / calc(0.9 * var(--shadow-k)))` on its top edge, so the overlap reads as a stack.
- After the last card, the section's bottom padding (`pb-40`) lets the deck unstick naturally before Agents.
- **Phone**: same stack with `top: calc(5.5rem + i × 10px)`, `margin-bottom: 22vh`, card p-6, `min-h-[196px]`, layout stacked (time row on top, then moment, then Selixa line).
- No JS, no transforms: position is the browser's sticky; nothing is animated. Static read = four cards in a column. Reduced motion: keep as is (no motion is generated), but drop the `margin-bottom` to 32px so the deck effect (movement tied to scroll) is off: `@media (prefers-reduced-motion: reduce) { .day-deck > * { position: static; margin-bottom: 2rem } }`.

### 3.3 Agents (`#agents`)

`SectionHeader num="02" label="Agents"` + **Agents.headline** ("agents you'll lean on."). `Section` padding reduced to `py-20 sm:py-28`.
- `RelatedCards variant="compact"` with `agents` (2–3) → `{ href: "/agents/{slug}", title: name, body: line, icon, linkText: Agents.cardLink }`. 3 → `md:grid-cols-3`; 2 → `md:grid-cols-2 max-w-[760px]`.
- First card (most important agent) gets no special treatment: order already says it.

### 3.4 Tools (`#tools`)

`SectionHeader num="03" label="Tools"` + **Integrations.headline** ("tools you'll connect.") + **Integrations.line** as lead.
- Row of `IntegrationTile size="sm"` for `integrations` (2–4) → `/integrations/{slug}` (look up slug by name). `grid grid-cols-2 md:grid-cols-4 gap-2.5`, max-w 880. Unlit at rest; lit on hover/focus only (200ms). Never auto-lit.
- **Integrations.link** "All integrations →" `.link-arrow` to `/integrations`, mt-8.

### 3.5 CTA

`<CTASection title={CTA.headline} line={CTA.line} />`.

---

## 4. Light and dark

- Both split layers use `bg-panel`; the With layer's brand wash is subtle in both. The divider line is `bg-ink/[0.35]` (visible on both).
- Scrap "paper" is `bg-panel-2` (off-white in light, slightly lifted in dark). The strikethrough uses `decoration-ink/30`.
- Stacked cards (C) are `bg-panel` + shadow from `--shadow-rgb`/`--shadow-k`, so the stack depth is softer in light, as intended.
- No hex, no `white/`. Works in mono (brand tints become neutral lifts; checks still read because of the circle + icon).

---

## 5. New shared components

### 5.1 `SplitCompare` (`components/site/SplitCompare.tsx`)

```ts
type SplitCompareProps = {
  before: ReactNode;               // left, the "without" layer
  after: ReactNode;                // right, the "with" layer
  initial?: number;                // divider position 0..1 from the left, default 0.5
  label: string;                   // slider aria-label
  describedBy?: string;            // id of the keyboard hint
  hint?: ReactNode;                // shown under the knob until first interaction
  toggle: { before: string; after: string; initial: "before" | "after" }; // touch
  className?: string;              // height etc. on the frame
};
```

**Geometry: transform only.** Position `f` ∈ [0, 1] is the divider's x as a fraction of the frame width `W` (cached by ResizeObserver).

```html
<div class="split" style="--f:.5">                 <!-- the frame, overflow:hidden -->
  <div class="split-before">…before…</div>          <!-- static, full frame -->
  <div class="split-after-clip">                    <!-- full frame, overflow:hidden, translateX(f·W) -->
    <div class="split-after">…after…</div>          <!--   full frame, translateX(−f·W) -->
  </div>
  <div class="split-handle" role="slider" …></div>  <!-- full height, translateX(f·W) -->
</div>
```

The clip wrapper moves right by `f·W` while its content moves left by the same amount, so the After content stays put and only the window onto it slides: After is visible exactly on `[f·W, W]`. Per frame that's **three `translate3d` writes**; no layout, no paint of the heavy mock-ups (the moving layers are composited; `will-change: transform` only while dragging or animating).

**Why not the alternatives**
- *Animating width* of the After layer: triggers layout every frame and, worse, re-wraps the After text as the box narrows, so the "same row, fixed" illusion breaks. Rejected (also violates the site's no-width-animation rule).
- *`clip-path: inset()`*: no reflow, but changing it from JS repaints the clipped layer every frame in Chrome and Safari (only CSS/WAAPI clip-path animations are compositor-accelerated, and only in recent Chrome). With Lenis running, per-frame paints of a full-width mock-up are exactly the jank we removed from the header. Rejected for dragging; acceptable nowhere else here either.
- *Counter-translate* (chosen): compositor-only on every engine. Cost: one extra wrapper and pixel snapping; use `translate3d` with fractional px and keep both transforms written in the same frame so the content never shimmers.

**Initial state without JS flash**: the SSR markup sets transforms from CSS: `transform: translateX(calc(var(--f) * 100%))` on the clip and the handle, `calc(var(--f) * -100%)` on the inner (percent of the frame width, since all three are full-frame boxes). `--f` defaults to `0.5`; `@media (pointer: coarse) { .split { --f: 1 } }` so touch devices start on **Without** (copy default) from the first paint. JS then takes over with pixel values computed from the same `f`. No jump at hydration.

**Pointer (fine pointers only, `(any-pointer: fine)`)**
- `pointerdown` on the handle **or anywhere on the frame**: cache `rect` (the only layout read), `setPointerCapture`, add `data-dragging` (cursor `ew-resize`, `user-select: none`, `will-change` on).
- `pointermove`: store `clientX`; one rAF writes `f = clamp((x − rect.left) / W, 0, 1)` into the three transforms. No React state per frame; the slider's `aria-valuenow` updates on `pointerup` (and throttled to 10 Hz during drag).
- A press that moves < 4px is a **click**: animate to that `f` (add `.split-anim` = `transition: transform 320ms var(--ease-out-expo)` on the three elements for that move, removed on `transitionend`).
- `touch-action: pan-y` on the frame so vertical page scrolling is never blocked.
- The frame's `cursor: ew-resize` on hover (fine pointers) signals it's draggable.

**Keyboard** (handle is `tabIndex=0`, `role="slider"`, `aria-orientation="horizontal"`, `aria-valuemin=0 aria-valuemax=100 aria-valuenow={round(f·100)}`, `aria-valuetext="{100 − n}% with Selixa"`, `aria-label={label}`, `aria-describedby`):
- ← / → : ∓/± 0.05 · Shift+← / → or PageDown / PageUp: ∓/± 0.2 · Home: 0 (all With) · End: 1 (all Without).
- Each key move animates with `.split-anim` at 200ms (none in reduced motion).
- Focus ring on the knob: `outline 2px rgb(var(--brand-400-rgb)/0.6) offset 3px`.

**Handle look**: 1px line `bg-ink/[0.35]` full height; knob 40px circle centred vertically, `bg-panel border border-line-strong`, `box-shadow: 0 6px 20px -6px rgb(var(--shadow-rgb)/calc(0.8*var(--shadow-k)))`, lucide `ChevronsLeftRight` 16px `text-fg-2`; transparent hit area 44px wide around the line. Hover/drag: knob `scale(1.06)` (transform, 200ms).

**Touch (`(pointer: coarse)` and no fine pointer)**: the handle is hidden and removed from tab order; the frame isn't draggable. Under the frame (mt-5, centred): a segmented toggle `role="group" aria-label={label}` of two buttons with `aria-pressed`, pill `h-11 p-1 rounded-full border border-line bg-ink/[0.03]`, each option `h-9 px-5 rounded-full text-[0.9375rem]`; the pressed option has a sliding thumb behind it (`bg-panel border-line-strong`, moved with `translateX`, 300ms). Tapping **With Selixa** animates `f` from 1 → 0 in **600ms** `cubic-bezier(0.65, 0, 0.35, 1)`: the With layer wipes in from the right across all four rows. Tapping **Without** reverses. Reduced motion: instant.

**Intro nudge** (fine pointer, motion allowed, first time ≥ 40% in view, no interaction yet): `f` 0.5 → 0.42 → 0.5, 450ms each way, `ease-in-out`, via `.split-anim`. Once per page view. Says "this moves" without text. None on touch (the toggle is self-explanatory).

**Reduced motion**: no nudge, no transitions; dragging still works (it's direct manipulation). **No JS**: the 50/50 frame (or Without on touch) as a static picture; the toggle buttons render but do nothing, and the `sr-only` text carries the content.

Reused by: none other planned yet; `/about` could use it for "chaos → clarity", and `/changelog` for before/after UI shots.

### 5.2 `DayTimeline` (`components/site/DayTimeline.tsx`)

```ts
type DayTimelineProps = {
  variant: "A" | "B" | "C";
  moments: DayMoment[];              // exactly 4, from use-cases.ts
  header: ReactNode;                 // SectionHeader, placed per variant
  selixaLabel?: string;
};
```

Renders §3.2 exactly. Variant A owns the sticky index + IntersectionObserver; B owns the rail fill (in-view once) and the phone carousel; C is CSS-only. Reuse: the Meeting Agent timeline could start from variant A's index pattern (with `StickyScene` for scrubbing), and `/changelog` from C's card look.

---

## 6. Acceptance checklist (Reviewer)

**Split**
- [ ] Desktop: dragging anywhere on the frame moves the divider; the With content stays still while its window slides; each scrap and its fix share a row.
- [ ] DevTools Performance while dragging: only Composite (no Layout, no large Paint) per frame. No width, left or clip-path changes.
- [ ] Click on the frame animates to that point (320ms); labels "Without"/"With Selixa" jump to 1/0.
- [ ] Keyboard: Tab to the knob, arrows ±5%, Shift/PageUp/PageDown ±20%, Home all With, End all Without; screen reader reads "{n}% with Selixa".
- [ ] Drag hint visible until the first interaction, then gone. Intro nudge plays once, never on touch or reduced motion.
- [ ] Touch (390 phone, and a tablet): no handle; toggle under the frame, default **Without**; tapping wipes to With in 600ms and back. Vertical page scroll over the frame is never blocked.
- [ ] No hydration jump: phone first paint already shows Without; desktop first paint 50/50.
- [ ] Screen reader gets both lists as text.

**Timeline**
- [ ] Each page renders its data `variant`: A (sticky index left, active follows reading), B (rail across the top that fills once; phone carousel with the active stop following), C (cards stacking with 14px edges).
- [ ] A: the index stays pinned while the four cards scroll; clicking an index entry glides to its card. No `overflow` ancestor breaks sticky.
- [ ] C: cards are opaque; reduced motion turns the stack into a plain list.
- [ ] Times parse into the right icon (Sunrise/Sun/Sunset); morning → evening reads left→right (B) or top→bottom (A, C).

**Page**
- [ ] Headline is `line` lowercased at the first letter; line is `pain`.
- [ ] Agents: 2–3 compact cards → `/agents/{slug}`. Tools: 2–4 tiles → `/integrations/{slug}`, unlit until hovered/focused.
- [ ] Multi-product, agencies and venture pages never show two products in one container.
- [ ] Ends with `CTASection`; one primary action; no invented proof.
- [ ] Light/dark, mono/crimson, phone 390 (no horizontal page scroll; the B carousel scrolls inside itself only).

---

## 7. Open decisions

1. **Variants change only the timeline.** The plan says three layout variants; this spec varies the timeline (the page's middle) and keeps hero, agents and tools identical for maintainability. If you want stronger differences, the next lever is the hero split's orientation (label positions and scrap styles per variant), not new sections.
2. **Drag anywhere vs. handle only (desktop).** Dragging anywhere on the frame is friendlier but means clicks on the frame move the divider. Handle-only is stricter. Spec: anywhere.
3. **Toggle default "Without" on touch** (copy's call) means phone visitors first see only the mess until they tap. The alternative is starting at "With" and letting them tap back to the mess.
