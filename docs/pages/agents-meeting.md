# `/agents/meeting`: the live call (design spec)

Plan: `docs/SITE_PLAN.md` §3.2. Copy: `docs/pages/agents-meeting.copy.md` (sections **Hero, Timeline, Recap, Where you meet, Related, CTA**; slot names below match it). Data: `agentBySlug("meeting")` from `lib/content/agents.ts`.
Shared components from the hub spec (`docs/pages/agents-hub.md` §5): `PageHero` (not used for the hero here, see 3.1), `StickyScene` + `useSceneProgress` / `useSceneBeat` / `useSceneStill` / `seg` / `smoothstep` / `useMeasure`, `RelatedCards`, `CTASection`. New shared pieces: **`ToolStrip`**, **`SourceChip`**, and the **`.scheme-dark`** CSS scope (§5).

---

## 1. Concept

**The page is a meeting, and scrolling is the meeting happening.** The hero is a call screen edge to edge. Then the page becomes the call's tape: a timestamp track runs down the left with a fixed red playhead; as you scroll, the tape slides up under the playhead, each line of the transcript arrives at "now", and capture chips pop onto the track. Scroll back and the call rewinds. When the tape hits 24:18 the call ends and the page cuts to the recap message.

Why it can't be mistaken for another page:
- It's the **only page whose hero is a screen** (full-bleed, dark in both schemes, like the orb).
- It's the **only vertical, time-based scene**: a teleprompter under a playhead. The hub moves a card sideways across stations, Research pans a 2-D canvas, Analyst annotates a fixed chart, Roadmap scrolls sideways.
- Its motion vocabulary is broadcast, not diagram: REC dot, timecode, speaking indicators, lower-third captions.

---

## 2. Page structure

Same shell as the hub: `<Nav />`, `<main className="relative flex-1 overflow-x-clip">`, `<Footer />`, `<ScrollReveal />`. No `<Background>`. The hero breaks out of the `max-w-[1280px]` container (see 3.1); everything else uses it.

| # | Section | Copy section | Component | Motion |
|---|---|---|---|---|
| 1 | Hero | Hero | `CallScreen` (page-local) | load reveal + in-view loop |
| 2 | Timeline | Timeline | section header + `StickyScene` + `CallTape` (page-local) | **scroll-scrubbed** (the only one) |
| 3 | Recap | Recap | `RecapMessage` (page-local) | in-view sequence, plays once |
| 4 | Where you meet | Where you meet | `ToolStrip` (new shared) + `ParticipantPanel` (page-local) | reveal + one in-view beat |
| 5 | Related | Related | `RelatedCards variant="compact"` | reveal |
| 6 | CTA | CTA | `CTASection` | reveal |

Anchors: `#call`, `#recap`, `#where`, `#related`. Eyebrows (numbered like home): `01 The call`, `02 The recap`, `03 Where you meet`, `04 What happens next` (label words from copy where given).

---

## 3. Sections, top to bottom

### 3.1 Hero: the call screen

Not `PageHero` (its layout is text above a visual; here the text sits **on** the visual). `CallScreen` reuses `PageHero`'s type scale and reveal delays so it still feels like the family.

**Frame.** A `<section>` directly inside `main`, *outside* the 1280 container:
- ≥ md: `mx-3 mt-2` (12px gutters), height `calc(100svh - 4.5rem - 0.75rem)`, min 600px, radius 24, class `.window` + `.scheme-dark`. Max width none (true full-bleed feel on wide screens); content inside is centred at max 1440.
- < md (390): `mx-0 mt-0`, radius 0, no side border, height `calc(100svh - 4.5rem)`, min 560px.
- The window is always dark (`.scheme-dark`, §5.3): the "screen" is a brand object like the orb.

**Inside, top to bottom** (absolute layers in the frame):
1. **Window bar** (`WindowBar`, h 44): left, REC presence badge: 8px `bg-brand-500` dot with glow (as home `Meeting.tsx`) + **Hero.presenceBadge** ("Selixa is in this call"; hidden if the consent TODO says drop). Centre, **Hero.windowTitle** ("Atlas · Product review"), 13px `text-fg-2`. Right, **Hero.timer** in `tabular-nums` 13px `text-fg-2`, fixed width box `w-[5ch]`.
2. **Tile grid**: `grid grid-cols-2 grid-rows-2 gap-2 p-2` filling the rest (≥ md `gap-3 p-3`). Four `CallTile`s in copy order: Sara Kim, Dev Patel, Maya Chen, Selixa (bottom-right).
   - `CallTile`: radius 16, `border-line`, background `bg-ink/[0.025]` with a static radial vignette (`radial-gradient(80% 70% at 50% 40%, rgb(var(--ink-rgb)/0.04), transparent)`). Avatar (`Avatar`, 72px ≥ md / 52px phone, text 20/16px) positioned at **38% from the top**, horizontally centred, so it sits clear of the centred headline. Lower-left name label 13px `text-fg-2` + `eq` bars when speaking; lower-right role 12px `text-fg-3` (hidden < sm).
   - Selixa tile: `card-lit` look, `Orb size={64}` (48 phone) at the same 38% position; label "Selixa"; lower-right status stack (see loop) with `live-dot`, 12px `text-brand-300`.
   - Speaking state: pre-rendered `.is-live` ring layer inside the tile (absolute `inset-0 rounded-[16px]`), toggled by `opacity` (not the class switch home uses, so no box-shadow transition): 250ms.
3. **Scrim**: one static layer, `radial-gradient(46% 38% at 50% 54%, var(--color-bg) 0%, color-mix(in srgb, var(--color-bg) 70%, transparent) 45%, transparent 100%)`. It darkens the grid's centre crossing so the headline reads. Static, never animated.
4. **Title block** (absolute, centred at 54% height, `max-w-[44rem] px-5 text-center`):
   - `.pill` with `live-dot`: **Hero.eyebrow** ("Meeting Agent").
   - H1 **Hero.headline**, Satoshi Light lowercase, `clamp(2.5rem,6vw,5.5rem)` `leading-[0.95] tracking-[-0.05em] text-fg text-balance`.
   - **Hero.line** (from data), 18px ≥ sm / 16px phone, `text-fg-2`.
   - Reveal: `.reveal` with `d()` 60 / 140 / 220; the tile grid itself reveals at 0 (opacity only, 500ms) so the screen is there first.
5. **Lower third** (≥ md only): a live caption strip bottom-centre, 24px above the frame bottom, `max-w-[36rem]`, `rounded-full border-line bg-well px-4 py-2`, 13px `text-fg-2`: shows the current speaker's first transcript line (copy Timeline rows 1–3). Hidden on phone (no room; the tiles carry it).
6. **Scroll cue** (below the frame, in normal flow, centred, mt-6): **Hero.scrollHint** — *not in the copy sheet; Writer to add* (suggested: "Scroll to play the call") — 13px `text-fg-3` link to `#call` + `ChevronDown` bob (as hub).

**Hero loop** (`useSequence`, in view only; plays over the call screen, not the text):

| Step | ms | Frame |
|---|---|---|
| 0 | 300 | reset: nobody speaking, status "Listening", timer running |
| 1 | 1400 | Sara speaking (ring + eq), caption = Timeline row 1 |
| 2 | 1400 | Maya speaking, caption = row 2 |
| 3 | 1400 | Sara speaking, caption = row 5 ("Let's do that…") |
| 4 | 700 | Selixa tile status cross-fades to **Hero.selixaStatus[1]** ("Noting a decision"), a `.tag` chip "Decision" (`Scale` icon, brand tint) pops above the status (opacity + `scale(.92→1)`, 240ms) |
| 5 | 3000 | hold; status back to "Listening", chip stays |

Timer: ticks once a second from 00:00 while in view (text swap inside the fixed-width box; the only text change, not scroll-linked). Status stack: the two statuses are stacked in one grid cell and cross-fade (no width change).

Reduced motion / before JS: step 5 frame, timer shows **24:18**, caption shows row 5, nobody speaking, chip visible.

**Phone (390).** Frame edge to edge, 2×2 portrait tiles (~185 × 250 each at 844 tall), avatars 52px at 38%, name labels 12px, roles hidden, no lower third. Title block centred, H1 ~2.5rem wraps to two lines, line 16px, `px-6`. Window bar keeps REC dot + timer; the title text truncates.

### 3.2 Timeline (the signature)

**Header (normal flow, scrolls away).** `SectionHeader num="01" label={Timeline.eyebrow}` + **Timeline.headline** + **Timeline.line**, left aligned, `pt-24 sm:pt-32`, `id="call"`.

**Scene.** `<StickyScene id="call-tape" length={4.2} label={Timeline.headline}>`. Stage `calc(100svh - 4.5rem)`, content max-w 960 centred. The stage is `.scheme-dark`? **No**: the tape is on the page (it's the transcript, not the screen); normal scheme.

#### Stage layout, desktop (≥ md)

```
┌ stage ───────────────────────────────────────────────────────────────┐
│ ● Atlas · Product review            3 decisions · 5 action items ·   │ header row (56)
│                                     2 open questions · 1 insight     │
│ ─────────────────────────────────────────────────────────────────────│
│  00:00 ┊  Sara Kim                                                    │  ↑ past rows (fade out under top mask)
│        ┊  Let's start with onboarding. Maya, what did testing show?   │
│  02:41 ◆ [✦ Insight]   Maya Chen                                      │
│        ┊               The new setup flow tested well, but …          │
│ [05:12]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│ ← PLAYHEAD at 44% of stage (fixed)
│        ┊  Sara Kim                                                    │   current row centred on it
│        ┊  And activation's down 8% since the Aug 12 release.          │
│                                                                       │  (future rows: in DOM, opacity 0)
└───────────────────────────────────────────────────────────────────────┘
```

- **Header row** (fixed in the stage, h 56, `border-b border-line`): left, REC dot (brand, pulses via existing `live-dot` while live) + **Hero.windowTitle**; right, the **tally**: four counters from **Timeline.counter** ("3 decisions · 5 action items · 2 open questions · 1 insight"). Each number is a fixed-width `tabular-nums` cell (`w-[1ch]`), label never changes width (use the plural label always; "1 insight" is singular in copy so it's fine). Numbers step with beats (`Count` with `ms=300` from previous value is overkill: just swap the digit with a 160ms opacity cross-fade of stacked digits 0–5). On phone the tally becomes four icon counters (see phone).
- **Tape viewport**: the area below the header, `overflow: clip`, with a **static** top mask `mask-image: linear-gradient(to bottom, transparent 0, #000 22%, #000 100%)` so past rows dissolve toward the top. (Static mask: allowed; it never animates.)
- **Tape**: one absolutely positioned column containing all **14 rows** (13 transcript rows + the end marker) at fixed height. Moved only by `transform: translate3d(0, y, 0)`.
  - Row height: **H = 104px** desktop (short viewports `max-height: 760px`: 92px). Each row: grid `[88px_20px_148px_1fr]` = timestamp · rail · chip lane · transcript.
  - **Timestamp** (row's `Time`), 12px `tabular-nums text-fg-3`, top-aligned to the speaker line. Current row's timestamp `text-fg` (opacity swap of two stacked copies).
  - **Rail**: a 1px `bg-ink/[0.12]` vertical line through all rows (one element spanning the tape). On it, per row, a 7px node: plain rows `bg-ink/25`; captured rows a 9px diamond (rotated square) in `bg-brand-500` once the chip lands, else `bg-ink/25`.
  - **Chip lane**: the capture chip for the row (`.tag`, icon + **Timeline.rows[i].chip** label: `Scale` Decision, `ListChecks` Action item, `CircleHelp` Open question, `Lightbulb` Insight). Brand tint for Decision and Insight (`border-brand-400/40 bg-brand-500/15 text-brand-200`), neutral `.tag` with `text-brand-300` icon for Action item and Open question (keeps crimson rare). Under it, 12px `text-fg-3` two-line clamp: **Timeline.rows[i].chipText**. Lane width fixed; long chip text clamps.
  - **Transcript**: speaker (`Avatar` 24px + name 12px `text-fg-3`), then the line 16px `leading-[1.5] text-fg-2` (current row `text-fg`), max two lines, `line-clamp-2` (copy lines all fit two lines at 620px).
  - **End row** (row 14): no speaker; a centred `.tag` "**Timeline.endMarker**" ("Call ended · 24:18") with a `PhoneOff` 12px icon, and below it 13px `text-fg-3` link "Recap sent ↓" (*Writer to add*, suggested "See the recap") to `#recap`.
- **Playhead** (fixed in the stage, not in the tape): a 1px `bg-brand-400/70` horizontal line across the full stage width at **44% of the tape viewport height**, with a timecode badge on the timestamp column: `rounded-md bg-brand-500 text-[var(--brand-on)] px-1.5 text-[12px] tabular-nums` showing the **current row's time**. The badge holds all 14 times stacked in one grid cell; only the current one is `opacity:1` (120ms swap). At the end beat the line and badge turn neutral (`bg-ink/30`, `bg-ink/[0.08] text-fg-2`), overlay swap, and the header REC dot goes grey.

#### Motion script (exact)

Beats: row *k* (0-based, k = 0…12) arrives at `B_k = 0.03 + 0.07·k` → 0.03, 0.10, 0.17, … 0.87. End row at **0.93**.

```ts
const B = [0.03,0.10,0.17,0.24,0.31,0.38,0.45,0.52,0.59,0.66,0.73,0.80,0.87,0.93]; // 14 beats
const b = useSceneBeat(B);   // 0…14; rows 0..b-1 are "arrived"; row b-1 is current; b===14 ⇒ ended
// continuous tape position r ∈ [0,13] (scrubbed, never React state):
r = Σ_{k=1..13} smoothstep(seg(p, B[k] - 0.035, B[k]))
y = playheadY - (r * H + H/2)      // current row centred on the playhead
tape.style.transform = `translate3d(0, ${y}px, 0)`
```

- **Scrubbed** (`useSceneProgress`): tape `translateY` only. It glides over the 0.035 before each beat and rests between beats, so each line sits still under the playhead long enough to read (~0.035 × 4.2 ≈ 0.15 viewport glide, ~0.15 viewport rest).
- **Stepped** (beat → CSS transition, time-based, reverse cleanly):
  - Row arrives (`k < b`): row opacity 0 → 1 over 200ms. The transcript line of the **newest** row types with `Typed` at `cps={90}` (all copy lines < 90 chars, so ≤ 1s). Rows arriving in a jump of ≥ 2 beats (fast scroll, anchor) render `still` (no typing). Rewind: row goes back to opacity 0 and `Typed` resets (its `on=false` path).
  - Current row emphasis: timestamp + text colour swap (stacked copies, 200ms opacity).
  - Chip lands 180ms after its row arrives (`transition-delay`): `opacity 0→1`, `transform: translateX(-6px) scale(.94) → none`, 260ms `--ease-out-expo`; rail node swaps to the brand diamond (opacity) at the same time. Tally digit for that chip type advances.
  - End beat (b = 14): playhead neutral, REC dot grey, end row shows; tally complete.
- Future rows (below the playhead) stay in the DOM at `opacity:0` so the tape's height never changes.
- Scroll budget: 4.2 viewports for 14 beats ≈ 0.3 viewport per line. Matches the hub's pace ("snappy").

#### Phone layout (< md, 390)

- **Header row** (h 48): REC dot + title (truncate) on the left; the tally becomes **four icon counters** on the right: `Scale 3`, `ListChecks 5`, `CircleHelp 2`, `Lightbulb 1` (icon 12px `text-brand-300`, digit 12px `tabular-nums text-fg-2`, 8px apart). Screen-reader text keeps the full counter string.
- **Row**: height **H = 132px**; grid `[44px_14px_1fr]` = timestamp (11px) · rail · content. The chip lane collapses into the content column: speaker line, transcript (15px, `line-clamp-3`), then the chip (`.tag`, label only, no chip text) on its own line below. Chip text hidden on phone (the recap carries it).
- Playhead at 40% of the tape viewport; timecode badge sits over the timestamp column (44px wide, fits "24:18" at 11px).
- Budget: 48 header + tape viewport ~547 at 844 tall; shows ~2 past rows, the current, 1 future slot. At 667 tall (stage 595) still shows past + current. Stage below 520 → static (StickyScene `minStageHeight`).

#### Static frame (reduced motion, no JS, landscape phone)

The tape stops being a tape: rows render in normal flow as a **complete transcript** (all 14, all chips landed, all nodes on, no mask, no playhead), header shows the full tally and a neutral "Call ended · 24:18" tag replaces the REC dot. `useSceneStill()` → render the tape with `position: static; transform: none`. Reads as the meeting's notes. The stage has `aria-hidden` on decorative parts only; the transcript is a real `<ol aria-label="Transcript">` in both modes (each `<li>`: time, speaker, line, chip label + text), so assistive tech always gets the whole call.

### 3.3 Recap

`id="recap"`. The cut from the ended call: 48px after the scene, no transition beyond the normal reveal.

- Header: `SectionHeader num="02" label={Recap.eyebrow} align="center"` + **Recap.headline**. No line.
- **`RecapMessage`**, 56px below, centred, `max-w-[680px]`. Looks like a real chat message in a channel, not a feature card:
  - Outer: `.window` radius 18. **Window bar**: `#` glyph + **Recap.channel** ("#atlas-product") 13px `text-fg-2`; right, a `SourceChip` with the Slack mark (unlit, mono) "Slack" — tells the viewer where this landed without branding the UI as Slack.
  - **Message** (p-5 sm:p-6): row = `Orb size={36}` (the sender avatar) + header line "**Recap.sender**" → "Selixa" 14px `text-fg` + `.tag` "App" (10px, *Writer to confirm label*) + "just now" 12px `text-fg-3`.
  - Body, indented 48px (aligned under the name; phone indent 0, the orb sits above):
    1. **Recap.firstLine** 14px `text-fg-2` ("Product review · Sep 24 · 24 min · Sara, Dev, Maya").
    2. Four blocks, 16px apart, each a label line (12px uppercase tracking 0.12em `text-fg-3` with its lucide icon 12px `text-brand-300`) and a list:
       - **Decisions** (3): 15px `text-fg`, bullet = 6px brand dot.
       - **Action items** (5): each row `Avatar` 20px + "Name · task" 14px `text-fg`; right side a 14px empty checkbox square (`border-line-strong`) → decorative.
       - **Open questions** (2): 14px `text-fg-2`, `CircleHelp` bullet.
       - **Insight** (1): a quoted line in a `card-lit` inset panel (p-3, radius 10), 15px `text-fg`.
    3. **Message buttons**: **Recap.buttons** ("Create 5 tasks", "Open notes") as `btn-ghost-sm`-looking spans, **not interactive** (`aria-hidden`, no tab stop): the page keeps one primary action.
    4. **Reactions** (optional copy): a small pill "✅ 3" in `.tag`. Use a lucide `Check` in a 14px brand square instead of the emoji (no emoji in UI).
- **Motion** (`useSequence`, in view, plays once, no loop): message shell 0 → header 120 → first line 200 → Decisions block 300 → each action row 70ms stagger → questions → insight panel (lit layer fades in) → buttons → reactions. Each piece `Stage` (opacity + 10px rise). Total ≈ 1.8s. Reduced motion: all shown.
- **Desktop extra (≥ lg)**: a second, smaller "email" card peeks behind the message, offset `translate(28px, 22px)`, `bg-panel-2 border-line` radius 18, opacity 0.6, showing only a subject line placeholder bar and "To: Sara, Dev, Maya" — *optional; Writer slot Recap.emailPeek if kept*. Static (no animation). Drop it if it reads as clutter at review.

**Phone (390):** message full width; orb 32 above the name line; body indent 0; action rows wrap task text to 2 lines; buttons stack side by side at 100% width (two equal columns).

### 3.4 Where you meet

`id="where"`. Two columns on ≥ lg (`grid-cols-[1fr_1.1fr] gap-16 items-center`), stacked below.

- **Left**: `SectionHeader num="03" label="Where you meet"` + **Where.headline** + **Where.line** (the consent line: render **only if** the TODO(owner) is resolved; otherwise omit the `lead` entirely, no placeholder text). Under it, **`ToolStrip`** (§5.1) with `LOGOS` Zoom + Google Meet, `size="lg"`: two 88×88 tiles, marks lit (brand colour) when in view. If integration status is "coming soon" (plan §11.1), `ToolStrip` shows its `status` tag under the name.
- **Right**: **`ParticipantPanel`**, a `.window` (w 100%, max 440, radius 18) styled as a call's "People" side panel: window bar "People (4)" (*Writer slot Where.panelTitle*), then four rows (h 52): `Avatar` + name + role for Sara, Dev, Maya; the fourth row is Selixa: `Orb size={28}`, "Selixa", and a `.tag` in brand tint "**Where.selixaTag**" (*Writer to add*, suggested "AI · visible to everyone"; only if consent confirmed, else "Notetaker"). Row 4 carries the `card-lit` overlay.
- Motion: panel reveals (`data-reveal`, d 120); when in view, Selixa's row lit overlay fades in 300ms after the reveal (one `useSequence` step, no loop).

Phone: header, strip (tiles 72×72, side by side, centred), panel full width below, 40px gap.

### 3.5 Related

`id="related"`. `SectionHeader num="04" label="What happens next"` + **Related.headline** ("what happens next."). `RelatedCards variant="compact"`, `grid-cols-1 sm:grid-cols-2 gap-3 max-w-[880px]`: Execution Agent, Roadmap Agent. `title` = `name`, `body` = **Related.cards[i].reason** (copy's reason line, not `line`), `icon` from the agent icon map, `linkText` = **Related.linkText** ("See how it works"). Reveal stagger 60ms.

### 3.6 CTA

`<CTASection title={CTA.headline} line={CTA.line} />`.

---

## 4. Light and dark

- **Hero screen is `.scheme-dark` in both schemes.** In light mode the page is light, the call window is a dark screen set into it (like a video player). The scrim, tiles, text inside all resolve from the dark tokens via the scope, so no hex in components. The frame gets an extra soft outer shadow in light mode only: `0 30px 80px -30px rgb(var(--shadow-rgb) / 0.35)` under `:root[data-scheme="light"]` (and the prefers-color-scheme mirror).
- The tape, recap and participant panel follow the page scheme.
- Timecode badge text uses `var(--brand-on)` (works in mono, where brand-500 is grey and `--brand-on` is near-black). Don't use `text-white`.
- Mono theme: the playhead and chips are grey-scale; the Decision/Insight brand tint still reads as "lit" through contrast. Check chips have enough contrast against `bg-bg` in mono light.

---

## 5. New shared components

### 5.1 `ToolStrip` (`components/site/ToolStrip.tsx`)

A row of integration marks with names, lit by brand colour.

```ts
type ToolStripProps = {
  tools: { logo: BrandLogo; caption?: string; status?: string; href?: string }[];
  size?: "md" | "lg";              // md 64px tiles (default), lg 88px
  lit?: "always" | "inView" | "hover"; // default "inView": marks go brand-coloured once the strip is on screen
  align?: "left" | "center";
};
```

Tile: `.card` square, radius 16, mark centred (`BrandMark`, 40% of tile), name under the tile 13px `text-fg-2`, optional `caption` 12px `text-fg-3` (one line, what Selixa reads/writes), optional `status` `.tag` (Coming soon). Lit uses `BrandMark lit` (its 700ms colour transition is time-based, fine). Links to `/integrations/[slug]` once those exist (`href`).
**Reused by:** Meeting (Where you meet), Research (Sources), Analyst (none; uses `SourceChip`), Execution (Syncs to your tracker), integration pages' related tools, `/get-started` step 2 (as a basis for the multi-select grid).

### 5.2 `SourceChip` (`components/site/SourceChip.tsx`)

A small chip naming where something came from.

```ts
type SourceChipProps = { logo?: BrandLogo; icon?: LucideIcon; label: string; lit?: boolean; size?: "sm" | "md" };
```

`.tag` with a 12px mark (`BrandMark`, `lit` default false = mono) or lucide icon, then the label. `sm` = 11px text, h 22. Used for non-brand sources too (e.g. "Meeting Agent" with the `Video` icon, "GitHub · PR #451").
**Reused by:** Meeting recap window bar, Research brief, Analyst callouts and Ask a number, Product Agent citations, integration pages.

### 5.3 `.scheme-dark` (CSS scope in `app/globals.css`)

A class that re-declares the **dark** scheme tokens (`--s-bg … --s-fg-3`, `--ink-rgb`, `--shadow-rgb`, `--shadow-k`) and the dark `--brand-200/300/400` (+ rgb) values, so any subtree renders dark regardless of the page scheme. Values are copied from the existing dark `:root` block (it's a token definition, not hard-coded colour in a component). Must also set `color: var(--color-fg)` and `color-scheme: dark`.
**Reused by:** this hero; any future "screen" object (404 animation, integration pages' Zoom/Meet demo).

Page-local (in `app/agents/meeting/_components/` or `components/agents/meeting/`): `CallScreen`, `CallTile`, `CallTape`, `RecapMessage`, `ParticipantPanel`.

---

## 6. Acceptance checklist (Reviewer)

**Hero**
- [ ] Call screen fills the first screen under the nav at 1440×900, 1280×720 and 390×844; edge to edge on phone; dark in both schemes.
- [ ] Headline is readable over the tile grid (scrim), avatars don't collide with the title block at any of those sizes.
- [ ] Loop: speakers rotate, Selixa notes a decision, holds ~3s; timer ticks only while on screen. Reduced motion shows 24:18 and the decision chip.

**Timeline**
- [ ] Header scrolls away; stage pins; the tape moves up under a fixed playhead; each line rests under it before the next glides in.
- [ ] 13 lines at the copy's timestamps, chips on exactly the rows the copy marks; tally ends at 3 · 5 · 2 · 1.
- [ ] Scrolling up rewinds: lines and chips disappear in reverse, tally counts down, playhead timecode goes back.
- [ ] Fast scroll / anchor past the scene lands on the ended state (or the start), never mid-beat; skipped lines appear whole, not typing.
- [ ] Only `transform` (tape) and `opacity` change during scroll. Tape height never changes. No Layout in scroll frames.
- [ ] Phone: icon tally, chips inline under the line, no horizontal overflow; landscape phone is static.
- [ ] Reduced motion / no JS: a full, readable transcript with all chips, no pinning, no extra scroll.

**Page**
- [ ] Recap reads as a chat message (channel, sender, time), counts match the call (3 / 5 / 2 / 1); its buttons are not focusable.
- [ ] Zoom and Meet marks from `logos.ts` via `BrandMark`; consent line absent unless confirmed.
- [ ] Related: Execution and Roadmap compact cards with the copy's reasons.
- [ ] Ends with `CTASection`; no other primary button. Headlines Satoshi Light; nothing above 500; tokens only; mono theme checked.

---

## 7. Open decisions

1. **Dark hero in light mode.** Spec keeps the call screen dark in both schemes (the "screen" is a brand object, like the orb). Alternative: follow the scheme (a light call UI), which is calmer but loses the cinematic feel the plan asks for. Needs the new `.scheme-dark` scope either way for consistency.
2. **Consent** (plan §11.2, copy TODO 1) gates three strings: hero presence badge, Where-you-meet line, Selixa's tag in the participant panel.
3. **Recap email peek** behind the chat message (≥ lg): keep or drop at review.
4. **Missing copy slots** for the Writer: Hero.scrollHint, Timeline "see the recap" link under the end marker, Recap "App" tag label, Where.panelTitle, Where.selixaTag.
