# `/agents/roadmap` — the horizontal roadmap (design spec)

Plan: `docs/SITE_PLAN.md` §3.6. Copy: `docs/pages/agents-roadmap.copy.md` (sections **Hero, Board, Why it moved, Per product, Related, CTA**; strings quoted below come from it). Data: `agentBySlug("roadmap")`.
Shared components: `PageHero`, `StickyScene` (+ `useSceneProgress`, `useSceneBeat`, `useSceneStill`, `seg`, `smoothstep`), `RelatedCards`, `CTASection` (hub spec §5), and **`SlotBoard`** (defined in `docs/pages/agents-execution.md` §6; Execution is built first per the plan's order).
No new shared component is introduced by this page.

---

## 1. Concept

**The page scrolls sideways through Now / Next / Later.** A wide roadmap board is pinned under the nav, and scrolling down pans it left to right. The camera rests twice; at each rest a decision toast arrives and cards respond: one **jumps up to Now**, one ships and leaves, one is **pushed back to Later**, and a dependency line appears. After the scene, the board holds still so you can open a card's drawer and see *why it moved*; then four products' boards sit stacked like separate sheets, proving each keeps its own roadmap.

Why it can't be mistaken for another page:
- It's the **only horizontally moving page**. The hub's card moves sideways through six fixed stations; here the *whole plane* moves and the cards move within it.
- Cards moving between columns is the Execution page's language too, so the two are kept apart deliberately: Execution columns are *states of work*, cards only move rightward and the board **empties** into a pile; Roadmap columns are *time horizons* on a wide plane, cards move **both ways** (to Now and back to Later), and every move carries a reason.
- Feel: spatial and planar. Very wide columns with cards laid out two-up like tiles on a plane, thin column rules, lots of air; not a tracker.

---

## 2. Page structure

Shell as the hub (`<Nav />`, `main.overflow-x-clip`, container `max-w-[1280px] px-5 sm:px-8`, `<Footer />`, `<ScrollReveal />`).

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero | `PageHero` + `RoadmapRibbon` (page-local) | load reveal + short loop |
| 2 | Board (the signature) | header + `StickyScene` + `RoadmapPlane` (page-local, uses `SlotBoard`) | **scroll-scrubbed pan**, beat-stepped moves |
| 3 | Why it moved | `WhyMoved` (page-local): still board + drawer | reveal; drawer opens once in view; interactive |
| 4 | Per product | `ProductDeck` (page-local) | reveal; auto-rotates in view until touched |
| 5 | Related | `RelatedCards variant="compact"` | reveal |
| 6 | CTA | `CTASection` | reveal |

Anchors `#board`, `#why`, `#products`. Section eyebrows: `01 Atlas roadmap` (copy's Board eyebrow), `02 Why it moved`, `03 Per product`.

---

## 3. Board data (used by §4.1–4.3)

From the copy. **Card anatomy:** title · owner avatar · small tag.

| Now (start) | Next (start) | Later (start) |
|---|---|---|
| Billing page fixes (DP) | **Onboarding v2** (SK) | Mobile app |
| Faster search (DP) | Saved views for teams (MC) | Public API v2 |
| | Import from CSV (DP) · tag **Blocked** | SSO |
| | **Mobile app beta** (MC) | **Import API** ⚠ |

⚠ The copy's dependency names *Import API* (in Later), which isn't in its Later list. Spec adds it as a 4th Later card; the Writer confirms (or renames the dependency to "Public API v2").

Cards without an owner in the copy show no avatar (only the tag slot). Tags per copy ("Q4", "Blocked", "Oct 14"); cards with no tag show none.

**Moves** (copy order 1–4; the scene plays them grouped by camera stop, see §4.2):

| # | Toast (copy) | What happens |
|---|---|---|
| 1 | **Decision captured:** Ship the shorter onboarding flow | *Onboarding v2* jumps Next → **Now**; its tag becomes **Oct 14** |
| 3 | **Shipped:** Billing page fixes | *Billing page fixes* gets a **Shipped** tag and fades out of Now |
| 2 | **Decision captured:** Pause mobile until Q1 | *Mobile app beta* moves Next → **Later** |
| 4 | **Dependency:** Import from CSV blocked by Import API | dashed line from *Import API* (Later) to *Import from CSV* (Next); its tag reads **Blocked by Import API** |

Every toast has the source line **"From Product review · Sep 24"** under it.

---

## 4. Sections, top to bottom

### 4.1 Hero

- `PageHero align="center" fill` (hero + ribbon fit one screen on ≥ md). Pill **Hero.eyebrow** ("Roadmap Agent"); H1 **Hero.headline** ("a roadmap that keeps up."); line **Hero.line** (data `line`).
- `after`: the optional **Hero.status** chip (`status` data, "Updated 2h ago") as a `.tag` with `live-dot`, then a small `ArrowRight` 12px that bobs **horizontally** 4px on a 2.4s CSS keyframe: the only hint that this page moves sideways. No extra words.
- Visual: **`RoadmapRibbon`**, `max-w-[960px] w-full`, h 180 (phone 358 × 150).
  - Column labels **Now · Next · Later** (12px uppercase tracking 0.14em; Now `text-brand-300`, others `text-fg-3`) at 1/6, 3/6, 5/6 of the width.
  - Under them a 1px rail `bg-ink/[0.1]` with three 6px dots at the same x.
  - Two cards (roadmap card look §4.2, 200×56; phone 104×48 title-only): A "Onboarding v2" starts in **Next**, B "Mobile app beta" starts in **Next** (below A).
  - Toast pill above the rail (`.tag` + `live-dot`): "Decision captured".

| Step | ms | Frame |
|---|---|---|
| 0 | 700 | rest: A and B in Next |
| 1 | 450 | toast fades up above Next |
| 2 | 560 | A jumps Next → Now (jump arc, §5.3); Now dot fills brand; A's tag cross-fades to "Oct 14" |
| 3 | 560 | B moves Next → Later |
| 4 | 3000 | hold |
| 5 | 300 | reset: cards cross-fade back to their start slots (opacity; no reverse travel) |

Reduced motion / before JS: step 4 frame (A in Now, B in Later, no toast).

### 4.2 Board (the signature scene)

**Header** (normal flow, scrolls away): `SectionHeader num="01" label="Atlas roadmap"` + **Board.headline** ("decisions move the cards."). No lead line. `pt-24 sm:pt-32`.

**Scene:** `<StickyScene id="board" length={4} label={Board.headline}>`. The scene is **full-bleed**: the section breaks out of the container with `mx-[calc(50%-50vw)]` (margins, not a transform; `main` already clips x). Its fixed chrome keeps container alignment.

#### Stage layout (≥ md)

```
┌──────────── stage: 100svh − 72px ─────────────────────────────────────────────────────────────┐
│ [A] Atlas   Updated 2h ago                  [● Decision captured: Ship the shorter …]         │  chrome row (fixed), h 48
│                                             [  From Product review · Sep 24         ]         │
│ ────────────────────────────────────────────────────────────────────────────────────────────── │
│ NOW                                │ NEXT                                │ LATER               │  column heads (pan with plane)
│ ┌────────────┐ ┌────────────┐      │ ┌────────────┐ ┌────────────┐       │ ┌────────────┐      │
│ │Billing page│ │Faster      │      │ │Onboarding  │ │Saved views │       │ │Mobile app  │ …    │  cards two-up, 3 rows
│ └────────────┘ └────────────┘      │ └────────────┘ └────────────┘       │ └────────────┘      │
│                                    │ ┌────────────┐ ┌────────────┐       │                     │
│                                    │ │Import CSV ⛔│ │Mobile beta │       │                     │
│                                                                                                │
│                 ( Now ────●──────── Next ─────────────── Later )                               │  pan indicator (fixed)
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Chrome row** (does not pan): left, product chip `bg-brand-500 text-white` "A" + "Atlas" 14px `text-fg` + `status` ("Updated 2h ago") 12px `text-fg-3`. Right: the **toast slot**, max-w 480, right-aligned; all toasts pre-rendered in one grid cell, one visible at a time. A toast = `.tag`-like pill, h auto, px-3.5 py-2, `live-dot` + bold-free label ("Decision captured:" in `text-fg`, rest `text-fg-2`, 13px), with the source line under it (11.5px `text-fg-3`).
- **The plane** (pans): `transform: translate3d(x, 0, 0)` from `useSceneProgress`. Geometry measured once per resize (`ResizeObserver` on the stage):
  - `colW = clamp(560px, 0.62 × stageW, 760px)`; column gap 40 with a 1px `border-line` rule centred in it; plane width `P = 3·colW + 2·40`.
  - At `p`-pan 0 the Now column's left edge sits at the container's content-left; at pan 1 the Later column's right edge sits at the container's content-right. `travel = P − containerContentW` (≈ 1,100px at 1440).
  - Column heads 36px (12px uppercase tracking 0.14em; Now `text-brand-300`, others `text-fg-3`).
  - Cards via **`SlotBoard`** (`axis="x"`, `slotsPerRow={2}`, 3 rows per column = 6 slots): card h 84, width `(colW − 16) / 2`, row gap 12.
- **Pan indicator** (does not pan): at the stage bottom (`bottom-6`), `max-w-[480px]` centred: 1px rail `bg-ink/[0.1]`, three labelled ticks (Now/Next/Later, 11px `text-fg-3`), and an 8px brand dot whose `translateX` follows the pan. It shows that the vertical scroll drives horizontal travel.
- Short viewports (`max-height: 760px`): cards 72px, chrome row 40, pan indicator hidden.

**Roadmap card** (scene, still board, ribbon): `.card` radius 12, p-3.5, h 84 fixed.
- Row 1: title 14.5px `text-fg`, one line, truncate.
- Row 2 (bottom): owner `Avatar` 20px (if any) + tag slot: `.tag` h 20, 11px. Tag states are pre-rendered and cross-faded (opacity), never resized mid-scene: e.g. Onboarding v2 has "Q4" and "Oct 14" stacked in one cell; Import from CSV has "Blocked" and "Blocked by Import API" stacked (cell width = widest; on narrow cards the long one truncates).
- *Moved* marker (top-right, 14px): `ArrowUpRight` (toward Now) or `ArrowDownRight` (toward Later) in `text-brand-300`, and a pre-rendered 2px `bg-brand-400` bar on the card's left edge. `opacity` 0 until the move lands.
- *Shipped*: a `.tag` "Shipped" with `Check` in brand tint, then the whole card fades to `opacity 0` + `scale(0.96)` (400ms). Its slot stays empty (no reflow; Faster search does **not** shift up: the gap reads as "gone").
- *Lit* layer (`card-lit` look, pre-rendered) for the card currently moving.

#### Pan mapping and beats

Scrub the camera, step the cards. Two camera stops with holds:

```ts
// camera: A = Now + left half of Next in view; B = Next + Later in view (pan = 1)
pan(p) = smoothstep(seg(p, 0.34, 0.62));          // A until 0.34, glide to B by 0.62, then hold
x = -travel * pan(p);
const BEATS = [0.05, 0.09, 0.17, 0.21, 0.68, 0.72, 0.80, 0.84];
```

| Beat reached | p | Camera | What happens (time-based CSS, reversible) |
|---|---|---|---|
| 1 | 0.05 | A | Toast 1 in (200ms opacity + `translateY(-6px→0)`) |
| 2 | 0.09 | A | **Move 1**: Onboarding v2 jumps Next → Now slot 2 (the first free Now slot, row 2 left) (560ms jump); tag → "Oct 14"; moved marker 200ms after landing |
| 3 | 0.17 | A | Toast 3 ("Shipped: Billing page fixes") replaces toast 1 |
| 4 | 0.21 | A | Billing page fixes: Shipped tag, then fades out |
| — | 0.34–0.62 | A → B | pan (scrubbed) |
| 5 | 0.68 | B | Toast 2 ("Pause mobile until Q1") in |
| 6 | 0.72 | B | **Move 2**: Mobile app beta Next → Later (next free Later slot); marker `ArrowDownRight`; card settles at `opacity 0.8` (deprioritised) |
| 7 | 0.80 | B | Toast 4 ("Dependency") replaces toast 2 |
| 8 | 0.84 | B | Dependency line fades in (300ms); Import from CSV's tag → "Blocked by Import API" |
| — | 0.84–1 | B | hold on the finished board (last toast stays) |

- The copy lists moves in the order 1, 2, 3, 4; the scene plays **1, 3** at camera A (both in Now) and **2, 4** at camera B (both involve Later), so every move happens where you're looking. Toast texts are unchanged.
- Scrolling back reverses every beat. Beats are a pure function of `p`.
- Moves are **time-based** (560ms) and happen only during holds; nothing moves while the camera pans.
- Scroll budget: 4 viewports; each hold is ~1 viewport, enough to read a toast and watch the move.

#### Dependency line

- One SVG in plane coordinates (`absolute inset-0`, pans with the plane, `pointer-events: none`): an elbow path from *Import API*'s left edge (mid-height) to *Import from CSV*'s right edge, crossing the Next/Later rule. 1px `stroke: rgb(var(--brand-400-rgb)/0.55)`, `stroke-dasharray: 4 4` (static, never animated), `vector-effect: non-scaling-stroke`, 5px dot at the blocked end.
- Path computed from `SlotBoard`'s `slotRect(col, undefined, slot)`, recomputed only on resize. Shown by `opacity` only (the copy says "line draws"; in a scrubbed scene it **fades**, per the hub rule of no stroke-dash animation in scenes).

#### Phone (< md, 390px): the vertical board

Same story and beats, axis turned: the plane is a **tall stack** that pans **up**.

```
┌ stage (100svh − 72px) ────────────────┐
│ [A] Atlas · Updated 2h ago            │  chrome (fixed)
│ [● Decision captured: Ship the …    ] │  toast slot (fixed), h 52, full width
│ ( Now ●───── Next ────── Later )      │  segmented indicator (fixed)
│ ┌───────────────────────────────────┐ │
│ │ NOW                               │ │  plane: translateY(−travel·pan(p))
│ │ Billing page fixes         (DP)   │ │
│ │ Faster search              (DP)   │ │
│ │ ░ free slot                       │ │
│ │ NEXT                              │ │
│ │ Onboarding v2          Q4  (SK)   │ │
│ │ …                                 │ │
└───────────────────────────────────────┘
```

- `SlotBoard axis="y"`, one card per row. Each column is a section: head 28px + slots (Now 3, Next 4, Later 5, so arrivals have room). Card full width, h 56: title 14px left, tag + avatar right.
- Plane height ≈ 3 × 28 + 12 × 64 ≈ 850; `travel = planeH − planeWindowH`.
- Camera A shows Now + the top of Next (move 1 and the ship happen there); camera B shows the bottom of Next + Later (move 2 and the dependency). The Builder verifies at 390×844 and 390×667 that source and target of each move are both visible, and tunes A/B as fractions of `travel` if not (A may be > 0 on short phones).
- Dependency on phone: the line is a short dashed connector down the left edge between *Import from CSV* (Next, last slot) and *Import API* (Later), which are adjacent in the stack by construction; plus the tag.
- Pan indicator is the segmented pill at the top; dot `translateX` from `pan(p)`.
- Landscape phones (stage < 520px): static fallback via `StickyScene`.

#### Static frame (reduced motion, no JS, landscape phones)

`p = 1`, **with the whole board visible**: in still mode the plane isn't translated; columns fit the container (`colW = (containerW − 80)/3`, cards single-column inside each column, h 64). All moves applied (Onboarding v2 in Now with "Oct 14", Billing gone, Mobile app beta in Later, dependency line and "Blocked by Import API" shown). The last toast is hidden; the section header carries the meaning. Phone still: the vertical stack in normal flow. `sr-only` list of the four toasts with their results.

### 4.3 Why it moved

**Header:** `SectionHeader num="02" label="Why it moved"` + **Why.headline** ("every move has a reason."), **Why.line** ("Tap a card to see the decision behind it."). `id="why"`.

**≥ lg:** one `.window` (`WindowBar` with "Atlas"), body h 460, `position: relative`.
- **The still board** fills the window body: the finished frame from §4.2, compact (three columns, cards 64px, single column per board column). Not pinned, not scrubbed.
- **Tappable cards:** the cards with a move (Onboarding v2, Mobile app beta) are `<button>`s with the moved marker; the others are plain (no hover state). The copy supplies drawer content for **Onboarding v2** only; Mobile app beta needs a drawer from the Writer (see Open decisions). Until then only Onboarding v2 is a button.
- **The drawer**: an overlay panel inside the window, anchored right, w 400, full body height, `bg-panel`, `border-l border-line`, shadow `-30px 0 60px -30px rgb(var(--shadow-rgb)/calc(0.5*var(--shadow-k)))`. Closed: `translateX(100%)` + `opacity 0`, `visibility hidden`. Open: none. 320ms `--ease-out-expo`. While open, the board behind gets a `bg-bg/40` scrim layer (opacity), and the selected card keeps its lit layer above the scrim.

**Drawer content** (copy):
1. Header: **Drawer title** ("Onboarding v2") 18px `text-fg` + **Close** (`X` 16px icon button with `aria-label="Close"`; visible text "Close" on phone).
2. **Move row**: `[Next] → [Now]` as two `.tag`s with `ArrowRight` 12px, target tag brand tint, then "· Sep 24" 12px `text-fg-3`.
3. **Decision**: label 11px uppercase `text-fg-3`, value 15px `text-fg` ("Ship the shorter onboarding flow on Oct 14").
4. **Decided by**: `Avatar` 20px + "Sara Kim".
5. **From**: `Video` 14px + "Product review · Sep 24 · 11:04" + `.link-arrow` **"Open meeting"** → `/agents/meeting`.
6. **Why**: two short rows, each with a bullet dot: "Activation −8% since the Aug 12 release" (`TrendingDown` 14px `text-brand-400`), "3 competitors with shorter onboarding" (`Telescope` 14px).
7. **Recommendation**: `Compass` 14px + "Prioritize onboarding" + `.link-arrow` **"Open memo"** → `/agents/product`.
Rows separated by `border-t border-line` with `py-3.5`; rows stagger in (`.st`, 50ms) on open.

**Interaction:** clicking a tappable card opens (or swaps) the drawer; Close, Escape or clicking the scrim closes it; focus moves to the drawer title on open and back to the card on close. It's a non-modal panel (`role="region"`, `aria-labelledby`), no focus trap, no scroll lock.

**Motion (in view, once):** 600ms after the window reveals, the drawer opens on Onboarding v2 by itself (so the idea is visible without a click), with its rows staggering in. Reduced motion / before JS: drawer rendered open on Onboarding v2 (no JS: Close is hidden).

**md (768–1023):** same; drawer w 360.

**Phone:** no window chrome. The still board as the vertical stack (compact, 52px cards, all three columns in normal flow). The drawer becomes a `.card p-5` placed **directly under the Now column** (where Onboarding v2 sits), opened by default, with Close collapsing it (instant, no height animation; a user-initiated change). Tapping Onboarding v2 reopens it. No bottom sheet (no scroll locking under Lenis).

### 4.4 Per product

**Header:** `SectionHeader num="03" label="Per product" align="center"` + **Products.headline** ("every product, its own roadmap."), **Products.line** ("Separate decisions. Separate context."). `id="products"`.

**Tabs:** four product chips centred (`.tab` style): 18px square mark (`A`/`B`/`C`/`D`; active `bg-brand-500 text-white`, idle `bg-ink/[0.14] text-fg-2`) + name. `role="tablist"`, arrow keys move between tabs.

**`ProductDeck`** (≥ md): four mini boards stacked, `max-w-[560px]` centred, h 248, 32px under the tabs. The active board is in front; the others sit behind it at depth `k = 1..3`: `translateY(−14px·k) scale(1 − 0.04k)`, `opacity: 1 − 0.24k`. All four are rendered at full size; switching reorders depths with a 420ms transform/opacity transition (old front sinks, new one rises).

**Mini board** (each, per copy "Now column only"): `.window` without dots, p-5.
- Header: product chip + name 15px `text-fg`; right, **Updated** text 12px `text-fg-3` (copy per product).
- "Now" label (11px uppercase `text-brand-300`) + the two Now cards (roadmap card look, h 56, full width, title only).
- Footer: `.tag` with `Lock` + **Isolated** (copy), brand tint on the front board, neutral on the rest, exactly as on the home page's Products section.

**Motion:** in view, auto-advances Atlas → Beacon → Cove → Drift every **3200ms**, looping, only while visible (`useSequence`, four 3200ms steps). Any tab click or tab focus **stops auto-advance for good**. Reduced motion / before JS: Atlas in front, no auto-advance, tabs work.

**Phone:** tabs in one row (4 × ~84px fit at 358); deck full width, h 260, depth offsets halved (`−8px·k`).

### 4.5 Related

`RelatedCards variant="compact"`, heading **Related.headline** ("before and after the roadmap."). Two items (copy): **Meeting Agent** ("where the decisions come from."), **Execution Agent** ("turns Now into tasks."), link text "See how it works →". `grid-cols-2` ≥ md at `max-w-[880px]` centred; stacked on phone.

### 4.6 CTA

`<CTASection title={CTA.headline} line={CTA.line} />` (copy: "stop building in chaos." / "Keep your roadmap as current as your last meeting.").

---

## 5. Motion details

### 5.1 Scene performance
- Per frame (only while the scene is active): one `translate3d` write to the plane, one to the pan-indicator dot. Nothing else is scrubbed.
- 8 beat state changes across the scene.
- `will-change: transform` on the plane only while active (StickyScene attach/detach).
- Cards are absolutely positioned by `SlotBoard`; a move is a transform transition on one card. No DOM re-parenting.

### 5.2 Toasts
All pre-rendered in one grid cell; in/out by opacity + `translateY(-6px→0)`, 200ms. Cell width = widest toast up to 480px; longer text truncates with ellipsis on the first line (source line never truncates).

### 5.3 The jump
A card's outer wrapper transitions `transform` (560ms, `--ease-out-expo`) to its new slot. Its inner element plays a 560ms keyframe `jump` (`translateY 0 → −10px → 0`, `scale 1 → 1.03 → 1`) and its lit layer runs `opacity 0 → 1 → 0`. It reads as "picked up and placed", not slid. Reduced motion: no keyframe, no transition.

---

## 6. Light and dark

- Plane, rules: `border-line`, `bg-ink/[x]`; cards `.card`; chrome, drawer and deck boards `bg-panel`. No hex, no `white/`.
- Drawer scrim uses `bg-bg/40` so it matches the scheme.
- The dependency line at `brand-400-rgb / 0.55` reads in both schemes; in mono + light scheme (`brand-400 #c4c4cd` on white) contrast is weak: use a scheme-scoped `--dep-line` token (`brand-400/0.55` by default, `fg-3` under light + mono), defined in `globals.css`.
- Deck depth uses opacity and scale, scheme-neutral.

---

## 7. Acceptance checklist (Reviewer)

**Board scene**
- [ ] Pins under the nav; vertical scrolling pans the plane horizontally from Now to Later over ~4 viewports; the header scrolls away above.
- [ ] Camera rests at Now: Onboarding v2 jumps to Now (tag → Oct 14), Billing page fixes ships and leaves an empty slot. Camera glides to Later: Mobile app beta moves to Later, then the dependency line appears with "Blocked by Import API". Each move is preceded by its toast with "From Product review · Sep 24".
- [ ] Nothing moves while the camera pans; moves are ~560ms with a small arc.
- [ ] Scrolling back reverses everything; anchor/fast-scroll past the scene leaves it at 0 or 1.
- [ ] Only `transform`/`opacity` change during scroll; no Layout in scroll frames; the dependency line fades (no stroke drawing).
- [ ] Phone 390×844 and 390×667: the vertical board pans up; both ends of every move are on screen when it happens; no horizontal overflow.
- [ ] Reduced motion / JS off: no pinning; the whole finished board visible at once.

**Page**
- [ ] Hero ribbon loop: Onboarding v2 jumps Next → Now, Mobile app beta Next → Later, hold ~3s; the small arrow bobs sideways.
- [ ] Why it moved: drawer opens by itself once on Onboarding v2; Close/Escape/scrim close it; clicking the card reopens it; "Open meeting" → `/agents/meeting`, "Open memo" → `/agents/product`. Phone: drawer card under Now.
- [ ] Per product: four stacked boards, each with its own Now items and "Isolated" lock tag; auto-advance stops on first interaction; nothing implies shared memory.
- [ ] Related: Meeting, Execution. Ends with `CTASection` as the only primary action.
- [ ] Light and dark, crimson and mono themes; headlines Satoshi Light; nothing above 500; only Atlas/Beacon/Cove/Drift and sample people.

---

## 8. Open decisions for the user (and notes for the Writer)

1. **Move order.** The scene plays the copy's moves as 1, 3 (at Now) then 2, 4 (at Later) so every move happens on screen. Toast texts are unchanged. OK?
2. **"Import API" card** (Writer): the dependency points at *Import API*, which isn't in the Later list. Spec adds it as a Later card; alternatively point the dependency at *Public API v2*.
3. **Drawer for the other moved card** (Writer): the plan says "tapping any card opens a drawer"; the copy has content for Onboarding v2 only. Add a drawer for *Mobile app beta* (Next → Later, "Pause mobile until Q1") so two cards are tappable; unmoved cards stay non-interactive.
4. **Scene length.** 4 viewports (hub relay is 3.4) for two holds and one long pan. If it feels long in review, trim to 3.4 by shortening the holds, not by removing moves.
