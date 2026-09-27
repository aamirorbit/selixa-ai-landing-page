# `/agents/product` — the memo that writes itself (design spec)

Plan: `docs/SITE_PLAN.md` §3.5. Copy: `docs/pages/agents-product.copy.md` (slot names below in **Bold.dotted** form). Data: `agentBySlug("product")` from `lib/content/agents.ts`.
Shared components from the hub spec (`docs/pages/agents-hub.md` §5): `PageHero`, `RelatedCards`, `CTASection`. **No `StickyScene` on this page** (see §1).
New shared component defined here: **`DocSurface`** (§5), reused by the blog post template.

---

## 1. Concept

**The page is a document being written.** One wide sheet of paper starts in the hero and runs down the page. Its title types in; then, as each section scrolls into view, Selixa writes it: heading first, then the body in quick sentence-by-sentence fades, with a caret riding the end of whatever is being written. Citations sit inline and open to show their source. In the right margin, teammates push back and Selixa answers, taking a position. The doc ends in a hand-off bar that sends the work to the Roadmap and Execution agents.

Why it can't be mistaken for another page:
- It is the **only page with no pinned scene and no board or canvas**. The motion is *writing*, triggered by reading position, never scrubbed. Hub = a card through stations, Meeting = a scrubbed timeline, Research = a pannable canvas, Analyst = a chart, Roadmap = a sideways board, Execution = a kanban. Product = paper.
- It is the **lightest page on the site in both schemes**: the sheet is a light "paper" surface even in dark mode (§4), with generous white space and one reading column.
- The typing idea exists on home (`Decide`) as a chat answer. Here it's a long-form document with structure, sources and dissent, so the two never read the same.

Everything outside the sheet is quiet: the hero text reveals, Related and CTA fade in.

---

## 2. Page structure

Same shell as the hub: `<Nav />`, `<main className="relative flex-1 overflow-x-clip">` with the `max-w-[1280px] px-5 sm:px-8` container, `<Footer />`, `<ScrollReveal />`. No `<Background>` image.

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero | `PageHero` (no visual) + the top of `DocSurface` directly under it | load reveal; doc title types on load |
| 2 | Memo | `DocSurface tone="paper"` with six `DocSection`s, `Cite`s, `MarginNote`s | each section **writes on enter** (once) |
| 3 | Hand-off bar | `DocSurface`'s `footer` slot (`HandoffBar`, page-local) | sticky within the sheet; state flips when the memo is done |
| 4 | Related | `RelatedCards variant="compact"` | reveal |
| 5 | CTA | `CTASection` | reveal |

Sections 1–3 are **one continuous sheet**: the hero headline sits above it, and the sheet's top edge (doc header + typed title) is visible in the first screen at 1440×900 and 1280×720.

Anchors: `#memo` (sheet), `#related`. No numbered eyebrows on this page: the doc's own section numbers (01–06) do that job, and a second numbering would compete.

Section names for the Writer: **Hero, Memo** (with sub-slots **Memo.header**, **Memo.title**, **Memo.meta**, **Memo.problem**, **Memo.evidence**, **Memo.options**, **Memo.recommendation**, **Memo.impact**, **Memo.next**), **Margin notes** (threads), **Hand-off**, **Related**, **CTA** — matching `agents-product.copy.md`. Where the copy sheet gives the words, they're quoted below; slot names are for the Builder's content object.

---

## 3. Sections, top to bottom

### 3.1 Hero

- `PageHero align="center"`, **not** `fill` (the sheet must peek into the first screen). `rings={false}`: rings behind a sheet of paper read as noise; this is the one page without them.
- Pill: **Hero.eyebrow** (e.g. "Product Agent"), `live` on.
- H1: **Hero.headline**, standard PageHero size, lowercase.
- Line: **Hero.line**.
- No `visual` prop. The sheet (§3.2) starts **48px** under the line (`mt-12`; phone `mt-10`), so the hero's visual *is* the document.
- Top padding: PageHero default. Check at 1280×720 that the sheet's header row and the first line of the doc title are above the fold; if not, reduce PageHero top padding for this page only (`className` override), never the H1 size.

### 3.2 The sheet (`DocSurface tone="paper"`)

**Geometry**

| | ≥ lg (1024+) | md (768–1023) | phone (< md, 390 ref) |
|---|---|---|---|
| Sheet width | `max-w-[1160px]`, centred | full container | full container (358 at 390) |
| Padding | `px-[72px] pt-14 pb-0` | `px-12 pt-12` | `px-5 pt-8` |
| Radius | 24 | 20 | 16 |
| Grid | `grid-cols-[minmax(0,680px)_280px] gap-x-14` (reading column + margin) | one column, max 680, notes inline | one column, notes inline |
| Body type | Inter 17px / 1.7, `text-fg-2` | 17 / 1.7 | 16 / 1.65 |

The sheet is **not** a `.window` (that class has `overflow: hidden`, which would break the sticky hand-off bar and clip citation popovers). `DocSurface` has its own class `.doc` with `overflow: visible` (§5).

**Doc header row** (h 56, `border-b border-line`, spans both grid columns, `-mx` to the sheet edges with the same inner padding):
- Left: breadcrumb **Memo.header.crumbs** (copy: "Atlas / Memos") 13px `text-fg-3`, with a 16px product chip (`bg-brand-500 text-white` "A") first. Truncates on phone to the last crumb.
- Right: collaborator avatars (SK, DP, MC; `Avatar` 22px, overlapped −6px, hidden < sm), then the **state tag** (`.tag`): two labels stacked in one grid cell, **Memo.header.draft** (copy: "Draft", with `live-dot` while writing) and **Memo.header.review** (copy: "In review", with `Check` 12px), cross-fading (200ms opacity). It flips when the margin threads resolve (§4.2). Width is the widest label; never resizes.

**Title block** (pt-12, phone pt-8):
- Doc title **Memo.title** (copy: "Prioritize onboarding", US spelling, no period), Satoshi Light 300, `clamp(2.25rem, 4.2vw, 3.5rem)`, `leading-[1.02] tracking-[-0.04em] text-fg`. Types in with `Typed` (cps 32) — the only character-typed long line on the page.
- Meta line **Memo.meta** (copy: "Drafted by Selixa · Sep 25 · 3 min read"), 13px `text-fg-3`, a 20px `Orb` before it. Fades in after the title.
- A 1px `border-line` rule, then the six sections, each `pt-14` (phone `pt-10`).

### 3.3 The six sections (`DocSection`)

Every section: number (`01`…`06`, 13px tabular `text-fg-3`) on the same baseline as the heading; heading Inter 22px weight 500 `tracking-[-0.02em] text-fg` (phone 19px); body below `mt-4`. Margin notes, where present, sit in the right column top-aligned to the section's first body block (≥ lg), or inline after their anchor block (< lg, see §3.4).

| # | Section | Slots | Contents and one special beat |
|---|---|---|---|
| 01 | Problem | **Memo.problem.heading**, **.body**, **.stat** | One paragraph. The stat phrase inside it (copy: "38% never finish setup") gets a **brand underline**: a 2px `bg-brand-400/70` bar under the phrase, `transform: scaleX(0→1)`, origin left, 300ms, 150ms after the paragraph lands. |
| 02 | Evidence | **Memo.evidence.heading**, **.items[4]** (value, label, cite) | A 4-row list (copy gives four sentences, each starting with a number: the leading number is the **value**, the rest the **label**; e.g. "4" + "customer calls name the integrations step."). Row: value (Satoshi Light 30px `tabular-nums text-fg`, `Count` 500ms; row 4 "9%" has `TrendingDown` 18px `text-brand-400`) · label 15px `text-fg-2` · `Cite n` chip at the end. Rows `border-t border-line py-3`. Desktop: value column 88px fixed. Phone: same, value 26px. **Beat:** after the last row, `Cite 1` opens by itself for 2400ms, then closes (§3.5). |
| 03 | Options considered | **Memo.options.heading**, **.items[3]** (title, verdict, reason) | Three option rows, `1`/`2`/`3` in a 24px circle (`border-line`, 12px). Title 15px `text-fg`; verdict `.tag` right-aligned: 1 = **Recommended** (brand tint: `border-brand-400/30 bg-brand-500/10 text-brand-200`), 2 = **Later** (+ its reason line), 3 = **Rejected**. **Beat:** option 3's title is struck through: a 1px `bg-fg-3` line across the title text, `scaleX(0→1)` origin left, 400ms, then its reason fades in under it (14px `text-fg-3`, copy starts "Rejected: …"). Title text turns `text-fg-3` at the same time (colour transition on text is fine: it happens once, off-scroll, on a single line; if the Reviewer sees paint cost, use a stacked twin at `opacity`). |
| 04 | Recommendation | **Memo.recommendation.heading**, **.statement** | The statement in a quote-like block: `pl-6`, a 2px `bg-brand-400` bar on the left (pre-rendered, `scaleY(0→1)` origin top, 300ms), text Inter 24px/1.35 `text-fg tracking-[-0.02em]` (phone 20px). This is the doc's one moment of emphasis. |
| 05 | Impact | **Memo.impact.heading**, **.body** | One sentence (copy: "Recovers most of the activation drop within two release cycles. Measured weekly."). "Measured weekly" is followed by a small inline `.tag` link **"Analyst Agent"** with `ChartLine` 12px → `/agents/analyst` (optional; drop if the Writer prefers plain text). No invented numbers here: the numbers live in Evidence. |
| 06 | Next steps | **Memo.next.heading**, **.items[3]** | The copy sentence split at its commas into a 3-item checklist ("Draft the requirement" · "Size it with engineering" · "Review on Thursday"): 16px empty square (`border-line-strong`, radius 4), text 15px `text-fg`. **Unchecked** on purpose: finishing is the Execution Agent's job. |

**Sources for citations** (copy: **Memo.sources[4]** = label, excerpt, link text). Popover footer link text is a **real link** to the agent that owns the source.

| n | Source (copy) | Icon | Footer link → |
|---|---|---|---|
| 1 | Product review · Sep 24 · 02:41 | lucide `Video` in a 20px tile | "Open in Meeting Agent" → `/agents/meeting` |
| 2 | Intercom · 7 notes | `BrandMark` Intercom 16px, **unlit** (its cyan fails contrast on paper) | "Open in Research Agent" → `/agents/research` |
| 3 | Research brief · Onboarding | lucide `Telescope` in a 20px tile | "Open in Research Agent" → `/agents/research` |
| 4 | PostHog · Setup completion | `BrandMark` PostHog 16px (fg colour) | "Open in Analyst Agent" → `/agents/analyst` |

### 3.4 Margin notes (**Margin notes**)

Three threads, from the copy's table. Selixa holds its position in the first two; the third is a teammate agreeing, which resolves the doc.

| Thread | Anchored to | Messages |
|---|---|---|
| 1 | Section 03, option 3's title | Dev Patel → Selixa |
| 2 | Section 04, the statement | Maya Chen → Selixa (with an inline `Cite 1` chip in the reply) |
| 3 | Section 06, the checklist | Sara Kim (single note) |

**Caption** (≥ lg only): **Margin notes.headline** (copy: "and it defends it.") in Satoshi Light 22px `text-fg-2`, lowercase, at the top of the margin column level with section 01's heading. It reveals with the first thread. Below lg it's omitted visually (kept `sr-only` before thread 1).

**Resolved state**: after thread 3 appears, each thread's header shows a small **Resolved** `.tag` (copy: "Resolved", `Check` 11px), fading in 120ms apart, and the doc header chip flips **Draft → In review**.
**Note card** (`MarginNote`): width 280 (≥ lg), `.card` radius 12, p-4, `bg-panel`. Header row reserves 20px on the right for the Resolved tag. Message: author row (`Avatar` 20px or `Orb size={20}` for Selixa, name 12.5px `text-fg` weight 500, time 12px `text-fg-3`), text 13.5px/1.55 `text-fg-2`. Selixa's messages sit indented 12px with a 1px `bg-brand-400/40` rule on their left: visually "the answer". Messages divided by `border-t border-line pt-3 mt-3`.

**Anchor highlight**: the anchored phrase has a pre-rendered highlight layer (`bg-brand-500/[0.08]` + 1px bottom border `brand-400/40`), `opacity 0→1` when the thread appears. Hovering/focusing a thread raises its highlight to `bg-brand-500/[0.14]` (opacity swap between two layers).

**Placement**
- ≥ lg: in the margin column, same grid row as the section, `self-start`, `mt-[52px]` so its top meets the first body line. No connector lines (they'd need re-measuring on every resize; the highlight + alignment carries the link).
- < lg: inline, directly after the anchored block, `ml-4 mt-4` (phone `ml-0`), with a 2px `border-l border-brand-400/40 pl-4` treatment instead of a card border; same message layout, text 13.5px.

### 3.5 Citations (`Cite`)

- **Chip**: inline `<button>` after the claim, `[n]` 11px tabular, h-[18px] px-1.5, radius 6, `border-line bg-ink/[0.04] text-fg-2`, vertical-align `0.15em`. Hover/focus: brand tint (`border-brand-400/40 text-brand-300`). `aria-expanded`, `aria-controls`.
- **Popover**: absolutely positioned under the chip's line, `top: calc(100% + 8px)` of the containing block (the block is `relative`); width 320, left-aligned to the chip, clamped to the reading column (compute once on open, not on scroll). `.card` look but solid `bg-panel`, radius 12, p-4, shadow `0 18px 50px -20px rgb(var(--shadow-rgb) / calc(0.6 * var(--shadow-k)))`. Content: source row (icon + **kind** 12px uppercase `text-fg-3` + **meta** right-aligned 12px `text-fg-3`), **title** 14px `text-fg` weight 500, **quote** 14px/1.5 `text-fg-2` (max 3 lines, clamp), footer = the link text from the table above, 12px `text-fg-2` `.link-arrow`, a real link to that agent's page.
- Open/close: `opacity 0→1` + `translateY(4px→0)`, 180ms. One open at a time. Closes on Escape, outside click, or opening another. Focus stays on the chip (it's a disclosure, not a dialog).
- **Phone**: width = reading column (`left-0 right-0` of the block), same content.
- **Auto-open demo** (Evidence beat): `Cite 1` opens for 2400ms after section 02 finishes, only on the first write, and **not** if the visitor has already opened any citation or is scrolling fast (skip if the section left view before the beat). Never auto-opens again.

### 3.6 Hand-off bar (**Hand-off**, the sheet's footer)

- `position: sticky; bottom: 16px` inside the sheet (the sheet is its containing block, so the bar rides the bottom of the viewport while the doc is on screen and settles at the doc's end). `mt-16`, spans both grid columns, `mx-[-40px]` on lg so it's slightly wider than the reading column but inside the sheet edge.
- Bar: h-16 (phone auto, p-3), radius 16, `bg-panel` + `border-line`, shadow as the popover. Solid background (no blur).
- Left: `Orb size={24}` + **Hand-off.label** (copy: "Recommendation: prioritize onboarding", 14px `text-fg`). While the memo is still writing, the label sits at `opacity: 0.45` with `.thinking` dots after it; when section 06 is written the dots fade and the label goes to full opacity.
- Right: two buttons, **Hand-off.button1** ("Create roadmap item", `Map` icon) → `/agents/roadmap`, **Hand-off.button2** ("Draft PRD", `FileText` icon) → `/agents/execution`. Both `.btn-ghost` (never `btn-primary`: the page's one primary action is the CTA). While writing: buttons at `opacity: 0.45`, `aria-disabled` but still links (don't trap people). When ready: opacity 1, the first button gains the brand-tinted border (`border-brand-400/40`) as a hint, a one-time 400ms glow layer pulse (opacity).
- Phone (< sm): label on its own line (truncates), buttons below as a two-up row, each `flex-1`, 14px labels (both fit at 163px; if not, icon + label wraps to two lines, never truncated).
- Under the bar's final resting place, the sheet ends with `pb-10` and its bottom edge; nothing else inside.

### 3.7 Related

`RelatedCards variant="compact"` with heading **Related.headline** (copy: "where the decision goes."). Two items per copy: **Roadmap Agent**, **Execution Agent** (body = the copy's one-liners, link text "See how it works →"). `grid-cols-2` ≥ md, max-w 880 centred so two cards don't look like a gap in a 3-grid; stacked on phone. `pt-28 sm:pt-36`. (See Open decision 3.)

### 3.8 CTA

`<CTASection title={CTA.headline} line={CTA.line} />`.

---

## 4. Motion script

### 4.1 Title (page load)

Starts after PageHero's reveal (h1 at 140ms → title begins at **600ms**).

| Beat | ms | Frame |
|---|---|---|
| 0 | 0 | doc header shown (chip = Draft, live-dot), title empty with caret |
| 1 | ~700 | `Typed` title, cps 32 (22 chars ≈ 690ms) |
| 2 | 200 | meta line fades up (`.st`) |
| 3 | — | caret moves to the end of the meta line, blinks |
| — | — | caret stays until section 01 starts writing |

### 4.2 Sections: write on enter (once)

**Trigger:** one `IntersectionObserver` for all six sections, `rootMargin: "0px 0px -30% 0px"`, threshold 0. A section starts when its top passes 70% of the viewport height. Sections never "unwrite" (documents don't rewind; this deliberately differs from the scrubbed scenes elsewhere).

**Queue:** writes run one at a time in order. If a section enters while an earlier one is unwritten (fast scroll, anchor jump), every earlier section **completes instantly** (jumps to its finished frame, no animation) and only the newest one animates. A fast scroller never waits.

**Before written** (the reserved frame, same size as final, so nothing reflows):
- Number visible, heading replaced by a 40%-wide 10px skeleton bar (`bg-ink/[0.07]`, radius 4).
- Each body block covered by a **skeleton overlay**: an `absolute inset-0` element whose background is a `repeating-linear-gradient` of 8px bars at the block's line-height pitch (`bg-ink/[0.05]`), last bar 60% wide via a mask on the final line (optional). Real text underneath at `opacity: 0`.
- Stats, tags, tiles, checkboxes: `opacity: 0`.

**Writing timeline, per section** (all time-based CSS transitions triggered by a `data-step` attribute; transform/opacity only):

| t (ms) | What |
|---|---|
| 0 | heading skeleton fades (150ms); heading `Typed` cps 55 with caret (≈ 250–450ms) |
| +80 after heading | block 1: skeleton overlay `opacity → 0`, text `opacity → 1` + `translateY(4px→0)`, 280ms |
| +160 per block | next blocks the same (list rows count as blocks) |
| after last block | the section's special beat (§3.3): underline 300 / Count 500 / strike 400 + reason / bar 300 / Count 500 / — |
| +300 | margin thread (if any) starts: first message `.st` in (400ms); anchor highlight on |
| +500 | Selixa: `.thinking` dots shown in its message slot (600ms), then text fades in (280ms) |
| end | section marked written |

Typical section: 1.1–1.6s; with a thread ≈ 2.8s (the thread runs while the next section may already be writing: threads don't block the queue).

**Caret:** one `.caret` element per page is rendered at the end of the block currently being written (it's a child of that block while active). When the queue is idle, it rests at the end of the last written block.

**After section 06:** thread 3 (Sara) appears, then the Resolved tags, then the header chip → **In review**; hand-off bar → ready state (§3.6). Caret removed.

### 4.3 Reduced motion and before JS (finished frame)

Server-rendered HTML is the finished document: title and all sections written, no skeletons, no caret, strike line drawn and reason shown, underline and recommendation bar shown, counts at their final values, all three margin threads complete with highlights and Resolved tags, header chip **In review**, hand-off bar ready. Citations closed (still work as disclosures with JS; without JS the `[n]` chips are plain text with `title` attributes giving the source). Same pattern as `useSequence`: `still = true` until mount; if `prefers-reduced-motion`, it stays still.

For assistive tech the doc is real semantic HTML throughout (`article`, `h2` per section, `ol` for evidence and next steps). Skeleton overlays are `aria-hidden`; text is always in the DOM.

---

## 5. New shared component: `DocSurface`

Put in `components/site/DocSurface.tsx` (plus `Cite`, `MarginNote` exported from the same module). Reused by: this page, **`/blog/[slug]`** (tone `page`, no margin notes, `Cite` for footnotes), later **`/changelog`** entries and the **Notion / Google Drive integration demo** ("a doc gaining a Selixa-written section", §4.2 of the plan).

```ts
type DocSurfaceProps = {
  tone?: "paper" | "page";  // paper = light sheet in both schemes (this page); page = follows the scheme (blog). Default "page".
  header?: ReactNode;       // doc chrome row (breadcrumb, state, avatars); omitted on blog
  margin?: boolean;         // reserve the 280px right margin column at ≥ lg (default false)
  footer?: ReactNode;       // sticky footer bar (HandoffBar here); optional
  as?: "article" | "div";   // default "article"
  className?: string;
  children: ReactNode;      // DocSection[] or MDX content
};

type DocSectionProps = {
  id?: string;
  num?: string;             // "01"
  heading: ReactNode;
  notes?: ReactNode;        // MarginNote(s): margin column ≥ lg, inline after `anchor` block < lg
  written?: boolean;        // false → reserved skeleton frame; true → finished (default true, so blog ignores it)
  step?: number;            // internal write step, exposed as data-step for CSS transitions
  children: ReactNode;
};

type CiteSource = { kind: string; title: string; meta?: string; quote?: string; icon?: LucideIcon; logo?: BrandLogo };
type CiteProps = { n: number; source: CiteSource; defaultOpen?: boolean; open?: boolean; onOpenChange?: (o: boolean) => void };

type MarginNoteProps = {
  anchorId: string;         // id of the highlighted phrase (aria-describedby wiring)
  messages: { author: string; selixa?: boolean; time?: string; body: ReactNode; shown?: boolean; thinking?: boolean }[];
};
```

**CSS** (add a "Documents" block to `app/globals.css`):
- `.doc`: `position: relative; overflow: visible; border-radius: 24px; border: 1px solid var(--color-line); background: var(--color-panel); box-shadow` like `.window` minus the brand glow (a doc isn't lit).
- `.doc-paper`: the **paper scope** (see §6). Applied by `tone="paper"`.
- `.doc-skel`: the repeating-bar overlay; `.doc [data-written="true"] .doc-skel { opacity: 0 }` with a 150ms transition; reduced-motion: no transition.
- `.cite`, `.cite-pop`: chip and popover per §3.5.

The writing choreography (queue, IO, timeline) is **page-local** (`useMemoWriter` in `app/agents/product/`), not part of `DocSurface`: the blog never animates. `DocSurface` only renders `written`/`step` states.

---

## 6. Light and dark

**The paper scope.** In dark mode the sheet is a light, warm sheet on the dark page ("the lightest page on the site even in dark mode"). This is done with tokens, not hard-coded classes:

- `.doc-paper` redeclares the scheme variables to the light scheme's values: `--s-bg`, `--s-panel`, `--s-panel-2`, `--s-well`, `--s-fg`, `--s-fg-2`, `--s-fg-3`, `--ink-rgb`, `--shadow-rgb`, `--shadow-k`, and `color-scheme: light`.
- **Builder gotcha:** the Tailwind colour tokens (`--color-fg: var(--s-fg)`, `--color-panel`, `--color-line`, `--color-ink`, `--color-surface`, `--color-line-strong`, …) are declared on `:root`, so they resolve **there** and won't follow a child's `--s-*`. `.doc-paper` must redeclare those `--color-*` tokens too (same expressions), so `bg-panel`, `text-fg-2`, `border-line`, `bg-ink/[x]` inside the sheet all read as light.
- In dark scheme the paper uses a slightly warm off-white so it doesn't glare: define `--paper-panel` (light scheme: `#ffffff`; dark scheme: `#f3f2ee`) and `--paper-bg` for insets, set inside the token blocks in `globals.css` (hex belongs in token definitions only). In light scheme the paper scope is visually a no-op: a white sheet on `#f7f7f5`, as intended.
- **Accent on paper**: the dark-scheme crimson ramp's light end (`--brand-200 #ffd9d6`) is unreadable on paper. `.doc-paper` redeclares `--brand-200/300/400` and their `-rgb` to the **light-scheme crimson values** (the block at `:root[data-scheme="light"][data-theme="crimson"]`). For **mono** (the currently shipped theme), `.doc-paper[data-theme]`-scoped values map `--brand-200/300/400` to dark greys (e.g. `--brand-200: #1a1a1e; --brand-300: #43434c; --brand-400: #6e6e78`) so tags, chips and the recommendation bar stay visible. Violet/coral get the same treatment if they are ever shipped (use each ramp's 600/700 stops).
- The sheet's shadow in dark mode: use the dark page's shadow (`rgb(0 0 0 / 0.6)`, big and soft) so the paper lifts off the page; redeclare `--doc-shadow` per scheme rather than letting the paper scope's light `--shadow-k` flatten it.
- `Orb` stays dark on paper (existing `.orb`), which is correct: it's Selixa's mark on the page.
- Avatars (`border-line-strong bg-ink/[0.05] text-fg-2`) automatically read light inside the scope.
- The hand-off bar and citation popovers are inside the scope, so they're light too.
- Outside the sheet (hero text, Related, CTA) follows the scheme normally.

Check in both schemes that the transition from dark page to light sheet has a clean edge: 1px `border-line` of the **outer** (dark) scope on the sheet (set the border colour on a wrapper outside the paper scope, or use `rgb(255 255 255 / 0.08)` via a token `--doc-edge` defined per scheme).

---

## 7. Phone (390px) summary

- Hero: standard PageHero phone sizes; sheet starts 40px below the line; the doc header + title + first meta line must be visible at 390×844.
- Sheet: full container width (358), `px-5`, radius 16, one column. Doc title `clamp` floor 2.25rem, wraps to two lines.
- Evidence rows: value 26px, label wraps to two lines max, cite chip stays at the end of the label.
- Options: verdict tags drop below the option line (`flex-wrap`), never overlap.
- Impact: 2-up tiles stay 2-up (each ~163px); "to" value 28px.
- Notes: inline threads with the left rule; no cards.
- Citations: popover spans the reading column.
- Hand-off bar: two rows (state; two buttons `flex-1`), still sticky at `bottom: 12px`.
- No horizontal overflow anywhere; the sheet never exceeds the container.

---

## 8. Acceptance checklist (Reviewer)

**Document**
- [ ] One continuous sheet from under the hero line to the hand-off bar; its header and title are above the fold at 1440×900, 1280×720 and 390×844.
- [ ] Title types on load; then each section writes itself once when its top passes ~70% of the viewport; sections never un-write on scroll up.
- [ ] Fast scroll / anchor jump to `#related`: all passed sections are complete on return, only the latest one animated. No section is ever left half-written.
- [ ] Before a section writes, its final space is already reserved (skeleton bars): **no layout shift** as text appears (DevTools: no Layout events during writing beyond the initial render).
- [ ] Only `opacity`/`transform` animate (underline, strike, recommendation bar use `scale`; no width/height/clip-path animation). No `backdrop-filter`.
- [ ] Citations: `[1]`–`[4]` open a source card on click/Enter, close on Escape/outside click; only one open; popover never overflows the sheet on phone. `[1]` auto-opens once after Evidence, unless the visitor already opened one.
- [ ] Margin threads: ≥ lg in the margin, aligned with their section; < lg inline with a left rule. Anchor phrases highlight. Selixa answers Dev and Maya with a position; Sara's note resolves the threads and flips Draft → In review.
- [ ] Option 3 is struck through with its "Rejected: …" reason; option 1 tagged Recommended, option 2 Later.
- [ ] Hand-off bar is sticky while the sheet is on screen and settles at its end; shows the label dimmed with thinking dots, then full; buttons link to `/agents/roadmap` and `/agents/execution`, both ghost style.

**Page**
- [ ] **Dark scheme: the sheet is light paper** with readable accents (crimson and mono themes both checked); light scheme: white sheet on the off-white page. No hard-coded hex outside token blocks, no `white/` utilities.
- [ ] Reduced motion / JS off: finished document, no skeletons, no caret, threads complete, bar ready.
- [ ] Related shows Roadmap and Execution (2-up); ends with `CTASection` (`ConversationCTA variant="site"`) as the only primary button.
- [ ] Headlines Satoshi Light; doc body Inter; nothing above 500.
- [ ] Only sample names (Atlas; Sara Kim, Dev Patel, Maya Chen) and generic competitors; no invented proof. PostHog/Intercom marks appear only as citation sources.

---

## 9. Open decisions for the user

1. **Paper in dark mode.** This spec makes the sheet genuinely light (warm off-white) in dark mode, per the plan's "lightest page even in dark mode". The alternative is a dark sheet that's merely the lightest *dark* surface (`bg-panel-2`, more white space). Light paper is the stronger, more distinctive choice; it needs the paper token scope in `globals.css`, which the blog can then opt into or not.
2. **Auto-opening citation.** `[1]` opens by itself once to teach the interaction. If you'd rather nothing move without the visitor's input, drop that beat; the chips still pulse once (brand tint, 400ms) when Evidence finishes.
3. **Related duplicates the hand-off.** The copy's Related (Roadmap, Execution) repeats the two hand-off buttons' destinations. Designer's preference: Related = the memo's *inputs* (Meeting, Research, Analyst, "where the evidence comes from"), so the page links both upstream and downstream. Spec follows the copy until you choose.
