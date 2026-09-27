# `/integrations`: the directory (design spec)

Plan: `docs/SITE_PLAN.md` §4.1. Copy: `docs/pages/integrations-hub.copy.md`. Data: `lib/content/integrations.ts` (`INTEGRATIONS`, `CATEGORIES`) joined to `components/landing/logos.ts` (`LOGOS`) by `name`.
Reuses from `docs/pages/agents-hub.md` §5: **`PageHero`, `CTASection`** (in `components/site/`). New shared pieces are in §5.

---

## 1. Concept

**A command palette you can actually type in.** The hero *is* a search field. Typing filters the logo grid right under it, keystroke by keystroke, and ⌘K / Ctrl K / `/` jump into it from anywhere on the page. Arrow keys walk the results, Enter opens one.

Why no other page looks like this: it's the only page whose hero is a working input rather than a demo. The rest of the site shows Selixa working; this page lets the visitor work. Everything else on the page is quiet so the field reads as the one thing to touch.

**Hard rules for this page**
- **No automatic lighting.** Marks are monochrome at rest and light only under the visitor's pointer, focus, or as the top result of *their* query. Nothing cycles, nothing lights one-by-one on a timer (the user explicitly dislikes it). The flow diagram's marks stay unlit.
- **No status tags** (Live / Coming soon) anywhere. Open question §11.1 in the plan.
- One primary action: the closing `CTASection`. "Request an integration" is a quiet secondary button.

---

## 2. Page structure

Shell as `app/page.tsx`: `<Nav />`, `<main className="relative flex-1 overflow-x-clip">`, container `mx-auto max-w-[1280px] px-5 sm:px-8`, `<Footer />`, `<ScrollReveal />`.

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero + search + chips | `PageHero` + `IntegrationSearch` (shared, new) | load reveal; field idle caret |
| 2 | Grid (results) | part of `IntegrationSearch` → `IntegrationTile` (shared, new) | instant filter; tile fade-in 160ms |
| 3 | How data flows | `DataFlow` (shared, new) | reveal; packets travel while in view |
| 4 | Request one | page-local band | reveal |
| 5 | CTA | `CTASection` | reveal |

Anchors: `#all` (grid), `#flow`, `#request`. Numbered eyebrows for sections 3–4: `01 How it flows`, `02 Request`.

Hero and grid are **one component** (`IntegrationSearch`) because the field, chips and grid share state; `PageHero` supplies eyebrow/H1/line and takes it as `visual`.

---

## 3. Sections, top to bottom

### 3.1 Hero

`PageHero align="center"` (not `fill`), `rings` on, top padding `pt-20 sm:pt-28`, visual gap `mt-10` (tighter than the default `mt-14`, so the grid starts inside the first screen).

- Eyebrow **Hero.eyebrow** · H1 **Hero.headline** ("connect what you already use.", one line on ≥ lg) · line **Hero.line**.
- Visual slot: the search field (§3.1.1), then the chips (§3.1.2) 20px below, then the grid (§3.2) 40px below.

**Fold budget.** At 1440×900 and 1280×720 the first grid row must be visible without scrolling (the whole point: type, see results). Measured target at 1280×720: nav 72 · pill ~176 · H1 ends ~300 · line ends ~345 · field 385–449 · chips 469–505 · grid row 1 at ~545–633. If the H1 wraps at 1280, drop its clamp max to `5rem` on this page only.

#### 3.1.1 The search field

```
┌──────────────────────────────────────────────────────────────┐
│  ⌕   |Search integrations…                          [ ⌘K ]   │   h 64, max-w 640, centred
└──────────────────────────────────────────────────────────────┘
```

- New class `.search-field` (globals.css, "Search" block), modelled on `.site-cta`: `h-16` (phone `h-14`), `max-w-[40rem] w-full`, radius full, same border/background/shadow tokens as `.site-cta`, same `:focus-within` ring (brand border 0.55 + 4px brand-500/0.14 halo + deeper glow). Transitions: `border-color`, `box-shadow` only (focus is not during scroll; fine).
- Left: lucide `Search` 20px `text-fg-3`, `ml-5`. On focus it turns `text-fg-2` (200ms color).
- Input: `flex-1 bg-transparent px-3 text-[1.0625rem] text-fg placeholder:text-fg-3 outline-none`, `type="search"` with the native clear button hidden (`appearance:none` on `::-webkit-search-cancel-button`). Placeholder **Hero.searchPlaceholder**. `aria-label` **Hero.searchLabel**. `autoComplete="off" spellCheck={false} enterKeyHint="go"`.
- **Idle caret (the "focused" look without stealing focus).** A decorative `.caret` (existing class, blinks 900ms, static in reduced motion) sits at the input's text start, before the placeholder, only while the field is empty and not focused: `.search-field:has(input:placeholder-shown):not(:focus-within) .search-caret { opacity: 1 }` else 0. It says "type here" without auto-focusing. **We do not autofocus**: on phones it would pop the keyboard, and on desktop it would swallow Space/arrow scrolling (Lenis keyboard scroll) for people who just want to scroll. See open decision 1.
- **Right slot** (fixed `w-[4.5rem]`, content right-aligned, `mr-4`), three states stacked in one grid cell (`grid [&>*]:col-start-1 [&>*]:row-start-1`), cross-faded with opacity 150ms so the input never changes width:
  1. Empty: shortcut hint `<Kbd>` with **Hero.shortcutHint**: "⌘K" on Mac/iOS, "Ctrl K" elsewhere. Server renders "⌘K"; the client swaps the text in a layout effect (both strings fit the fixed slot). Hidden on `(pointer: coarse)` (no keyboard shortcut on phones).
  2. Has text: clear button, lucide `X` 16px in a 28px round hit area (`hover:bg-ink/[0.06]`), `aria-label="Clear search"`. Clears, keeps focus.
  3. Has text and at least one result, while focused, on fine pointers: `<Kbd>↵</Kbd>` to the **left** of the clear button (both fit the slot: 24 + 8 + 28). Tells people Enter opens the top result.
- `<Kbd>` (new tiny primitive in `components/site/Kbd.tsx`): `inline-grid h-6 min-w-6 place-items-center rounded-[6px] border border-line bg-ink/[0.04] px-1.5 text-[0.75rem] font-medium text-fg-3 tabular-nums`.
- Live region (`sr-only`, `aria-live="polite"`): **Hero.resultCount** ("{n} integrations" / "1 integration"), updated 300ms after the last keystroke or chip change.

**Keyboard map** (all handled by `IntegrationSearch`; listeners on `window` attach on mount, detach on unmount)

| Key | Where | Does |
|---|---|---|
| ⌘K (Mac) / Ctrl+K (others) | anywhere on the page | `preventDefault`, focus the field, select its text. If the field is below/above the viewport, first scroll it to ~96px from the top with `window.scrollTo({ top, behavior: "smooth" })` (Lenis picks this up), then focus with `{ preventScroll: true }`. |
| `/` | anywhere, unless focus is in an input/textarea/select/contenteditable or a modifier is held | same as above (and the `/` is not typed into the field) |
| ↓ | in the field | move focus to the **first visible tile** (the top result). |
| Enter | in the field | open the top result (`router.push`). No results + non-empty query → open the request form (§3.4 behaviour, prefilled with the query). |
| Esc | in the field | text present → clear it; empty → blur. |
| ← → ↑ ↓ | on a tile | roving focus through the **visible** tiles in 2-D: columns read from a cached `columns` value (ResizeObserver on the grid, `getComputedStyle(grid).gridTemplateColumns.split(" ").length`). ↑ from the first row returns focus to the field (caret at end). No wrap at row ends. |
| Home / End | on a tile | first / last visible tile |
| Enter / Space | on a tile | native link (tiles are `<a>`) |
| any printable key | on a tile | focus the field and append the character (type-to-search keeps working) |
| Esc | on a tile | focus the field |
| Tab | anywhere | normal order: field → clear → chips → tiles → rest. Tiles are ordinary tabbable links. |

Why roving focus on real links instead of `aria-activedescendant` on a listbox: tiles must stay real, tabbable links for people who never touch the search, and a `role="option"` can't contain a link. The field gets `aria-controls="integrations-grid"` and `aria-describedby` pointing at a `sr-only` hint: "Type to filter. Press down arrow to move into the results."

#### 3.1.2 Category chips

- One row, centred, `gap-2`: **All** + `CATEGORIES` in data order (Chat · Docs · Issues · Code · Meetings · Feedback · Analytics).
- Chip: `button` with `aria-pressed`, `h-9 px-3.5 rounded-full border border-line bg-ink/[0.02] text-[0.875rem] text-fg-2`, then a count in `text-fg-3 tabular-nums ml-1.5` (All 11, Chat 1, Docs 2, Issues 2, Code 1, Meetings 2, Feedback 1, Analytics 2; computed from data, never typed). Hover: `border-line-strong text-fg`. Pressed: `border-brand-400/40 bg-brand-500/10 text-fg` and the count `text-brand-300`. Transitions: color/border/background 200ms.
- Single select. Pressing the pressed chip returns to All. Chips AND the query.
- Group wrapper `role="group" aria-label="Filter by category"`.
- **Desktop/tablet:** fits one line at ≥ 768 (≈ 690px total). Centred.
- **Phone:** one horizontally scrolling line, `overflow-x-auto snap-x scroll-px-5`, chips `snap-start`, `-mx-5 px-5` so it bleeds to the screen edges; scrollbar hidden; static edge fade via `mask-image: linear-gradient(90deg, transparent, #000 20px, #000 calc(100% - 20px), transparent)` (the `#000` is a mask alpha, not a colour). This scroller is never an ancestor of a sticky element.

**URL state.** `?q=` and `?category=` (lowercase category) mirror the state with `history.replaceState`, debounced 300ms; read once on mount (so `/integrations?q=zoom` from the 404 page lands filtered). No navigation, no scroll.

### 3.2 The grid (results)

`<ul id="integrations-grid">` inside `IntegrationSearch`. Tiles are **separate cards** (not the home page's `gap-px bg-line` sheet: filtering leaves partial rows and the sheet would show solid line-colour holes).

- Columns: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, `gap-2.5 sm:gap-3`, `max-w-[64rem] mx-auto`.
- Order at rest: `INTEGRATIONS` data order, then the **request tile** last (so 12 cells: 3 full rows at lg).
- Each tile: `IntegrationTile size="md"` (§5.1) → `/integrations/{slug}`, accessible name **Grid.tileLabel** ("{name} integration").

**Filtering**
- Haystack per tool (built once): `name`, `category`, `job`, `reads`, `writes`, joined, lowercased, diacritics stripped (`normalize("NFD").replace(/\p{M}/gu, "")`). Query split on whitespace; **every** token must be a substring. So "calls" → Zoom, Meet; "meet" → Google Meet, Zoom ("Meetings"); "tickets" → Jira; "pr" → GitHub ("pull requests").
- Rank matches (ties keep data order): 1 name starts with query · 2 a word in name starts with query · 3 category starts with query · 4 anything else. **Visible tiles render in rank order**, so the top result is always first (top-left) and it's what Enter opens.
- Non-matches are removed (`hidden`), not dimmed. The request tile is hidden while a query or category is active.
- **The grid wrapper never shrinks while filtering**: it gets `min-height` = the unfiltered grid's height, cached by a ResizeObserver whenever no filter is active (updates on width change). So the sections below never jump as you type. Everything happens on keystrokes, never during scroll.
- **Top result is lit** while the query is non-empty (its `lit` prop true, with the tile's lit layer). This is the visitor's own action, not auto-lighting. When a tile is hovered or focused, that tile is lit instead (only one lit tile at a time; last interaction wins).
- Tiles that (re)appear fade in: `opacity 0 → 1`, 160ms, no translate (keeps typing feeling instant). No FLIP/position animation. Reduced motion: none.

**Empty state** (query/category gives zero tools). Inside the reserved min-height, centred: lucide `SearchX` 20px `text-fg-3` → **Empty.line** ("No match for "{query}".", 16px `text-fg-2`, query in `text-fg`) → **Empty.link** as `.link-arrow` button: opens the inquiry dialog (§5.4) with `problem: "Integration request: {query}"`. Enter in the field does the same.

### 3.3 How data flows (`#flow`)

Header centred: `SectionHeader num="01" label="How it flows" align="center"` + **Flow.headline** ("one product, one context.") + **Flow.line**. `Section` padding. Diagram 56px below, max-w 1040 centred. Component: `DataFlow` (§5.3).

**Desktop (≥ lg)**

```
 YOUR TOOLS               ┌─ A  Atlas ─────────────── 🔒 Isolated ─┐              AGENTS
 ┌──┬──┬──┐   reads →     │                                        │   ─ ─ ─ ▸   ▣ Meeting
 │▫ │▫ │▫ │  ─•─ ─ ─ ─▸   │   Conversations   Docs      Meetings   │             ▣ Research
 ├──┼──┼──┤               │               ( ORB )                  │             ▣ Analyst
 │▫ │▫ │▫ │  ◂─ ─ ─ ─•─   │   Issues          Feedback  Data       │   ◂ ─ ─ ─   ▣ Product
 ├──┼──┼──┤  ← writes back│                                        │             ▣ Roadmap
 │▫ │▫ │  │               └────────────────────────────────────────┘             ▣ Execution
 └──┴──┴──┘
                  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  🔒  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─          (nothing crosses)
                         ┌─ B  Beacon ── Separate context ─┐   (opacity .5)
                         │  ▫ ▫ ▫   →   ( orb )   →   ▣ ▣ ▣  │
                         │  Its own tools. Its own memory.  │
                         └──────────────────────────────────┘
```

- Grid: `grid-cols-[minmax(0,15rem)_5rem_minmax(0,1fr)_5rem_minmax(0,11rem)] items-center`.
- **Your tools** (label **Flow.toolsLabel**, 11px uppercase `tracking-[0.14em] text-fg-3`): the 11 marks in a 3-column grid of 44px tiles (`rounded-[12px] border border-line bg-ink/[0.025]`, mark 20px), **unlit** (`BrandMark lit={false}`), `aria-hidden`; a `sr-only` list of names follows.
- **Connectors** (5rem columns): two lanes, 10px apart, each a 1px line `bg-ink/[0.12]` with a 5px chevron head (lucide `ChevronRight`/`ChevronLeft` 10px `text-fg-3`). Top lane **Flow.readsLabel** ("reads →") flows right; bottom lane **Flow.writesLabel** ("← writes back") flows left. Labels 11px `text-fg-3` above/below the lanes. The left connector links tools ↔ boundary; the right links boundary ↔ agents (same two lanes, no labels).
- **Packets**: one 5px dot per lane (`bg-brand-400`, `box-shadow: 0 0 8px rgb(var(--brand-glow-rgb)/0.6)`), moving along the lane with a CSS keyframe on `transform: translateX(0 → 100%)` of a lane-width wrapper, `opacity` 0 → 1 → 1 → 0 at 0/15/85/100%. Duration 1.8s linear, infinite. Reads lane starts at 0s, writes lane at 0.9s; right connector offset by +0.45s so packets appear to pass *through* the boundary. `animation-play-state: paused` unless the diagram is in view (`data-inview` set by an IntersectionObserver). Only transform/opacity.
- **Atlas boundary**: `.window` (no bar), radius 24, p-6, min-h 260. Header: product chip (20px `bg-brand-500 text-white` square "A", as agents hub) + **Flow.boundaryLabel** "Atlas" 15px `text-fg`; right, `.tag` with `Lock` + **Flow.boundaryTag** "Isolated", brand tint classes exactly as `Products.tsx` (`border-brand-400/30 bg-brand-500/10 text-brand-200`). Body: `Orb size={56}` centred; the six context chips (**Flow.contextItems**, `.tag`) in two rows of three, above and below the orb, centred.
- **Agents** (label **Flow.agentsLabel**): six rows, 28px icon tile (`border-line bg-ink/[0.03] text-brand-300`, radius 8) + name without "Agent", 14px `text-fg-2`. Icon map from the agents hub.
- **Beacon (greyed)**, 40px below Atlas, max-w 560, centred under the boundary column, `opacity: 0.5` statically: a single-row `.card` radius 20, p-5: chip `bg-ink/[0.14]` "B" + "Beacon" + neutral `.tag` `Lock` **Flow.greyedTag** "Separate context"; a row of 3 unlit 28px mark tiles (Notion, Linear, Zoom), a static 1px lane with chevron, `Orb size={28}`, static lane, 3 agent icon tiles; **Flow.greyedNote** 13px `text-fg-3` underneath. No packets (it's someone else's product; nothing moves toward Atlas).
- **The divider** between Atlas and Beacon: a 1px dashed rule (`border-t border-dashed border-line-strong`) the width of the boundary column, with a 24px circle (`bg-bg border-line`) holding `Lock` 12px `text-fg-3` at its centre. It states "nothing crosses" visually. No copy.
- Reveal (`data-reveal`): tools column 0 · Atlas 120 · agents 240 · Beacon + divider 360. Packets start after the Atlas reveal (add `data-inview` only after 600ms in view).

**Tablet (md–lg)**: same row but tools grid becomes 2 columns of 40px tiles and agents show icons only (names in `sr-only`); boundary chips wrap 3 + 3.

**Phone (< md, 390)**: vertical flow, all centred, max-w 358.
1. **Your tools** label, marks as a wrapping row of 36px tiles (6 + 5).
2. Vertical connector 56px tall: two lanes side by side (10px apart), down lane (reads, packet moves `translateY` down) and up lane (writes back, moves up); labels to the left/right of the lanes, 11px.
3. Atlas boundary full width, orb 48, chips wrap (2 + 2 + 2 around the orb: 2 above, 4 below is fine; keep centred).
4. Connector as 2.
5. **Agents**: 3 × 2 grid of 40px icon tiles with the short name under each, 12px.
6. Divider, then Beacon as a compact card (chip + tags + note; the mini lane hidden).

**Static frame** (reduced motion, before JS): lanes and chevrons visible, packets hidden (`display:none` under `prefers-reduced-motion`), everything else as drawn. The diagram is `aria-hidden` except a `sr-only` paragraph: "{Flow.line} Your tools feed Atlas's isolated context; its six agents work there and write back to your tools. Beacon has its own tools and its own memory."

### 3.4 Request one (`#request`)

A slim centred band, `py-20 sm:py-24`, max-w 40rem.
- `SectionHeader num="02" label="Request" align="center"` with **Request.headline** ("don't see yours?") at the section-header size and **Request.line** as lead.
- Button 28px below: `.btn-quiet` with the `.play` circle holding lucide `Plus` 18px, label **Request.button** ("Request an integration").
- Click → inquiry dialog (§5.4) with `defaults.problem = "Integration request: "`, focus goes to the **problem** field with the caret at the end, so they just type the tool name. Heading stays the default form heading.
- Background: nothing (no rings, no card). It's a pause before the CTA.

The grid's last cell (request tile, §5.1 `variant="request"`) links to `#request` (Lenis anchor glide) and is the discoverable path for browsers; the empty state and Enter-with-no-results open the dialog directly with the query.

### 3.5 CTA

`<CTASection title={CTA.headline} line={CTA.line} />`. Holds `ConversationCTA variant="site"`.

---

## 4. Light and dark

- All tokens. Search field, chips, tiles, boundary use `.site-cta`-style tokens / `.card` / `.window` / `bg-ink/[x]` / `border-line`. No hex except the `#000` alpha inside the chip-row mask.
- **Marks on tiles.** Lit colours come from `LOGOS[].color`. Notion, GitHub, PostHog and Slack's cut-outs already use `var(--color-fg)` so they flip with the scheme; nothing to do.
- **Intercom in light**: its lit colour `#6AFDEF` is near-invisible on the white lit tile. Rule (in `IntegrationTile`, driven by the `inverseOnLight` flag in the tool-look table, integrations-template §5.1): in the light scheme, when lit, the mark's 48px tile background becomes `bg-fg` (the near-black text token) with border `border-transparent`, so the cyan sits on dark. Dark scheme unchanged.
- The tile's lit wash is the brand ramp (`brand-500-rgb`), as home. It works in mono and crimson themes.
- Focus rings: `outline: 2px solid rgb(var(--brand-400-rgb)/0.6); outline-offset: 2px` on tiles and chips (visible in both schemes; in mono, brand-400 is a mid grey, which still clears 3:1 on both backgrounds).

---

## 5. New shared components (`components/site/`)

### 5.1 `IntegrationTile`

```ts
type IntegrationTileProps =
  | { variant?: "tool"; integration: Integration; logo: BrandLogo; size?: "sm" | "md";
      lit?: boolean;                 // controlled (search top result); otherwise hover/focus lights it
      subline?: "category" | "job";  // default "category", swaps to job while lit (copy: Grid)
      id?: string; onFocus?: () => void; }
  | { variant: "request"; href: string; title: string; body: string };
```

- **md** (hub grid): `<a>` `.card` `rounded-[16px] p-4 sm:p-5`, height fixed `h-[88px]` (phone: `h-[124px]`, vertical layout: tile top-left, text below).
  - Mark tile 48px (phone 40), `rounded-[14px] border border-line bg-ink/[0.025]`, `BrandMark` 24px (phone 20).
  - Name 16px `text-fg tracking-[-0.01em] truncate`; sub-line 12px `text-fg-3`: `category` and `job` **stacked in one grid cell**, cross-fading on lit (150ms), so nothing reflows; `job` is `truncate`.
  - `ArrowUpRight` 14px top-right, `text-fg-3`, `opacity-0 → 1` + `translate(-2px,2px) → 0` when lit.
- **Lit state** (hover, `:focus-visible`, or `lit` prop): a pre-rendered lit layer (`absolute inset-0 rounded-[inherit]` with the `.card-lit` look) fades to `opacity:1`; mark tile gets `border-ink/20 bg-ink/[0.06]` + `shadow-[0_10px_30px_-12px_rgb(var(--brand-glow-rgb)/0.6)]`; `BrandMark lit`. **All 200ms** (home's 700ms is too slow for a search). `BrandMark` gets an optional `duration` prop (default 700 to keep home unchanged; tiles pass 200).
- **sm** (use-case template tools row, 404): `h-[64px] p-3`, mark tile 40, name 15px, sub-line hidden.
- **request** variant: same card, `border-dashed border-line-strong` and no fill; lucide `Plus` in the mark tile `text-fg-3`; title/body from copy (use the Nav's "More on the way" / "Tell us what you use." pair unless the Writer adds hub-specific strings; see §7.3).
- Used by: `/integrations` grid, use-case template tools row, 404 search results, later `/get-started` step 2 (multi-select variant can extend it).

### 5.2 `IntegrationSearch`

`<IntegrationSearch initialQuery? initialCategory? compact? />`: the field, the chips (hidden when `compact`), the grid, the empty state, the keyboard map, URL sync. `compact` = the 404 page (field + top 4 results, `size="sm"`, no chips, no URL sync, no reserved height). A `shortcuts` prop (default true) attaches the global ⌘K / `/` listeners; only one `IntegrationSearch` per page may have it on.

### 5.3 `DataFlow`

`<DataFlow product={{ initial: "A", name: "Atlas" }} tools={BrandLogo[]} agents={Agent[]} contextItems={string[]} greyed={{ initial, name, tag, note }} labels={…} />`. As §3.3. Reused by `/security` (the isolation diagram can start from it) and `/get-started` step 5 if wanted.

### 5.4 Inquiry dialog with prefilled fields (`useInquiry`)

Today `ConversationCTA` owns its own `<dialog>` and can only prefill `company`. Needed here: open the same form with `problem` prefilled and focus on a chosen field.

- New `components/site/InquiryProvider.tsx`: mounts **one** `<dialog class="modal">` with `InquiryForm` (moved out of `ConversationCTA`), provided in `app/layout.tsx`. Hook: `const { openInquiry } = useInquiry(); openInquiry({ defaults?: Partial<Record<FieldName,string>>, heading?, intro?, focus?: FieldName })`.
- `ConversationCTA` keeps its API and markup but calls `openInquiry(...)` instead of its own dialog (same heading/intro logic for `site`). The form's value-retention on validation errors stays exactly as is (`key` on the form changes when the defaults change).
- Focus: `focus` field gets focus in the next frame; for textareas set the caret to the end (`setSelectionRange(len, len)`).
- Used by: this page (request button, empty state, Enter with no results), integrations template (permissions "Talk to us"), contact page, 404.

### 5.5 `Kbd`

§3.1.1. Also used by the Nav later if a global ⌘K is ever added.

---

## 6. Acceptance checklist (Reviewer)

**Search**
- [ ] At 1280×720 and 1440×900, the first grid row is visible on load with the field above it.
- [ ] Field is **not** focused on load; the idle caret blinks (static with reduced motion) and disappears on focus or when there's text.
- [ ] ⌘K (Mac) / Ctrl+K (Win/Linux) and `/` focus the field from anywhere on the page, scrolling up to it smoothly first when it's off-screen; `/` inside another input types a slash as normal.
- [ ] Typing filters live: "calls" → Zoom, Google Meet; "tickets" → Jira; "pr" → GitHub; "figma" → empty state with "Request it". Top result is first and lit; Enter opens it.
- [ ] ↓ from the field enters the grid; arrows move in 2-D over visible tiles; ↑ from row 1 returns to the field; typing on a tile continues the query; Esc clears, then blurs.
- [ ] Chips filter and combine with the query; counts match the data; pressing the active chip resets to All; phone chips scroll sideways, nothing else does.
- [ ] Filtering never moves the sections below (grid keeps its full height).
- [ ] Screen reader: field has a label and description; result count is announced politely; tiles are links named "{name} integration".
- [ ] `/integrations?q=zoom&category=meetings` loads filtered; typing updates the URL without adding history entries.
- [ ] No mark lights unless pointed at, focused, or the top result of a typed query. Nothing cycles. No status tags.

**Page**
- [ ] Flow diagram: packets travel only while in view; tool marks stay monochrome; Atlas shows "Isolated", Beacon greyed with "Separate context"; nothing connects the two; no copy implies shared memory.
- [ ] "Request an integration" opens the form with "Integration request: " in the problem field, caret at the end; empty-state link pre-fills the typed query.
- [ ] Ends with `CTASection` (`ConversationCTA variant="site"`); no other primary button.
- [ ] Light and dark: Intercom's mark readable when lit in light (inverse tile); Notion/GitHub/PostHog flip correctly; works in mono and crimson themes; no hard-coded dark hex or `white/`.
- [ ] Phone 390: no horizontal page scroll; tiles 2-up with vertical layout; diagram vertical; field 56px tall; no ⌘K hint shown on touch.
- [ ] Only `transform`/`opacity` animate; nothing animates during scroll except the in-view packets (transform).

---

## 7. Open decisions

1. **Autofocus.** The plan says the field is "focused". This spec shows a focused *look* (idle caret, lit ring on ⌘K/`/`) but doesn't autofocus, to avoid popping phone keyboards and hijacking keyboard scrolling. If you want real autofocus on desktop only (`(pointer: fine)`), it's a one-line change; phones should never autofocus.
2. **⌘K is page-local.** It only works on `/integrations` (and 404). A site-wide ⌘K palette (agents, use cases, integrations) would be a nice later addition to the Nav, but it's a separate feature.
3. **Request tile copy.** The grid's last cell needs a title and one line; this spec borrows the Nav's "More on the way" / "Tell us what you use." Writer to confirm or supply hub-specific strings.
4. **Chip counts** ("Docs 2") are derived from data, not in the copy sheet. Drop them if you prefer bare labels.
