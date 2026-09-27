# `/about` — the manifesto (design spec)

Plan: `docs/SITE_PLAN.md` §8. Copy: `docs/pages/about.copy.md`. Shared: `CTASection` (`docs/pages/agents-hub.md` §5.4), plus two new shared pieces extracted from the home page's close: **`ChaosToOrder`** and **`TumbleWord`** (§5).

---

## 1. Concept

**Chaos to order, stretched across the whole page.** The page opens full-screen on the home page's closing animation: scraps of product work drifting around the orb, then pulled into it, while the last word of the first statement, *scattered.*, tumbles and settles. Then the page goes quiet: **one statement per screen**, large Satoshi Light type on an empty background. It ends where the home page ends, on *stop building in chaos.*, with the letters of *chaos.* falling into place, and the site CTA under it.

Why it can't be mistaken for another page: it's the only page with **no product UI at all** (no windows, no cards, no demos). Every other page shows Selixa working; this page says what we believe. The only moving things are the opening and the closing word.

No team photos, investor logos, founding story, dates or numbers (per the copy sheet) unless supplied.

---

## 2. Page structure

Shell: `<Nav />`, `<main className="relative flex-1 overflow-x-clip">`, `<Footer />`, `<ScrollReveal />`. No `<Background>`.

Copy map (`about.copy.md`): **Opening** (eyebrow, scroll hint), **Statements 1–7**, **CTA** (site CTA, no extra copy).

| # | Section | Component | Copy | Motion |
|---|---|---|---|---|
| 1 | Opening | `ChaosToOrder size="screen"` | Opening.eyebrow, Statement 1, Opening.scrollHint | on load, plays **once**, holds |
| 2–6 | Statements | `Statement` (page-local) ×5 | Statements 2–6 | reveal on enter |
| 7 | Close | `CTASection` with a `TumbleWord` title | Statement 7 + site CTA | word settles once on enter |

Headings: a visually-hidden `h1` "About Selixa" (per the sheet) as the first element of `main`. Statements 1–7 are each an `h2`, so heading navigation reads the manifesto in order. That also covers the sheet's screen-reader fallback (the seven statements, in order) without a duplicate list.

Anchor: `#manifesto` on statement 2 (the scroll hint's target).

---

## 3. Sections

### 3.1 Opening (`ChaosToOrder size="screen"`)

- Height `min-h-[calc(100svh-4.5rem)]`, content centred both ways. Background ring layer as `FinalCTA` (radial glow, solid ring, dashed `spin-slow` ring).
- Content, centred: `.pill` eyebrow **Opening.eyebrow** ("About", with `live-dot`) → `Orb size={80}` (phone 64), mt-10 → **Statement 1** as the display line, mt-10 → scroll hint at the bottom of the stage (absolute `bottom-8`): **Opening.scrollHint** ("Scroll") 13px `text-fg-3` + 12px `ChevronDown` bobbing 4px (2.4s CSS keyframe, transform only), links to `#manifesto`.
- Statement 1 ("Product work is scattered."): `lead` = "Product work is", `word` = "scattered." (the last word always tumbles). Satoshi Light `clamp(3rem, 8vw, 7.25rem)`, `leading-[0.95] tracking-[-0.055em]`, lead `text-fg`, word in the chaos ramp (`ink="chaos"`, mapped across 10 letters). Break after the lead on all widths (two lines). `h2` with `aria-label` = the full sentence.
- Scraps: 12 on desktop (the home `FRAGMENTS`), 8 on md (hide the `wide` ones, as home), **6 on phone** (unlike home, which hides them: here there's no button for them to cover; on phone they sit only in the top and bottom bands, see §5.1).

**Sequence** (`useSequence(SCRIPT, { loop: false })`, starts 250ms after first paint since it's on screen at load):

| Step | ms | Frame |
|---|---|---|
| 0 chaos | 1100 | scraps drifting at their positions (`.drift`); letters of *scattered.* scattered |
| 1 pull | 700 | scraps travel into the orb (transform only, 25ms stagger), shrink to 0.2 and fade; orb `scale(1.2)`, glow layer to 1 |
| 2 settle | 500 | letters settle (existing overshoot curve, 30ms stagger); orb back to 1; glow fades |
| 3 hold | — | scroll hint fades up (300ms); holds forever, no loop |

Total ≈ 2.3s. Reduced motion / before JS: step 3 frame (scraps gone, word settled, hint visible). The server renders the settled frame, so there's no flash of chaos without JS.

Short viewports (`max-height: 700px`): orb 56, display clamp max 5.5rem, scroll hint hidden.

### 3.2 Statements 2–6

Five sections, one statement each:

- `min-h-[88svh]` (the next statement never peeks in, but it doesn't feel like a slog on tall screens), content vertically centred, `py-24`. Phone: `min-h-[80svh] py-20`.
- Alignment alternates, like turning pages, with no effect: statements 2, 4, 6 **left** (container left edge, `max-w-[16ch]`); 3 and 5 **right block** (`lg:ml-auto lg:max-w-[16ch]`, text left-aligned inside). Phone: all left.
- A small counter above each (`02` … `06`), `.eyebrow .num` style, 12px `text-fg-3` tabular, 24px above the text. No labels, no rules, no images, no icons.
- Type: Satoshi Light, `clamp(2.25rem, 5.4vw, 4.75rem)`, `leading-[1.02] tracking-[-0.045em]`, `text-fg`, written exactly as the sheet has it (sentence case).
- **Two-sentence statements** (4: "Priorities drift. Roadmaps go stale."): the second sentence is its own span, starts on a new line (`<br>` on ≥ md), and reveals 160ms after the first. Same colour. Single-sentence statements reveal as one.
- Statement 6 ("So we built an AI Product Manager.") gets the site's one inline accent: "AI Product Manager" in `text-brand-gradient`. It's the turn of the manifesto; nothing else on the page is coloured until the close.

**Reveal:** existing `data-reveal` + `ScrollReveal` (opacity + `translateY`, ~500ms): counter 0ms, statement 80ms, second sentence 240ms. That's the only motion between opening and close.

### 3.3 Close (Statement 7 + CTA)

`CTASection` (agents-hub §5.4) with:
- `title` = Statement 7 "stop building in chaos." set exactly like home: "stop building" / line break / "in" in `--chaos-in` + `TumbleWord text="chaos." ink="chaos"`. `aria-label` on the `h2` = the plain sentence.
- no `line` (the sheet has none), `ConversationCTA variant="site"` as always.
- The word settles when the section enters view (IntersectionObserver threshold 0.4), **once**, 300ms after entry; `still` → settled. No scraps here (the opening already had them), no loop.
- `CTASection` needs one addition: `title` accepts a render function `({ inView, still }) => ReactNode`, or the Builder wraps the title in a small client component that owns its own observer. Prefer the wrapper (`<SettlingHeadline>` page-local); keep `CTASection` server-renderable.

---

## 4. Light and dark

- Opening uses the same tokens as `FinalCTA` (`--chaos-*` ramps already defined for both schemes; orb stays dark).
- Scraps: **solid `bg-panel` with `border-line`** instead of home's `bg-bg/80 backdrop-blur` (see §5.1): the blur is a `backdrop-filter`, not allowed on a page you scroll straight out of.
- Statements: all `text-fg` (counters `text-fg-3`, 12px: check they stay legible in light).
- `text-brand-gradient` on statement 6 and the chaos ramps at the ends are theme tokens; in the mono theme they render in the mono ramp, which is fine.

---

## 5. New shared components (`components/site/`)

### 5.1 `ChaosToOrder`

Extracted from `components/landing/FinalCTA.tsx`. **FinalCTA is refactored to use it** (visual result on home unchanged, except the two performance fixes below).

```ts
type Scrap = { text: string; x: number; y: number; r: number; wide?: boolean; phone?: { x: number; y: number } };
type ChaosToOrderProps = {
  lead: ReactNode;                 // home: "stop building" <br/> "in"; about: "Product work is" — rendered still
  word: string;                    // home: "chaos."; about: "scattered." — tumbles (via TumbleWord)
  label: string;                   // plain full sentence for aria-label
  as?: "h1" | "h2";                // default h2
  eyebrow?: ReactNode;             // about: the "About" pill above the orb
  size?: "section" | "screen";     // section = home close (py-28…44); screen = min-h 100svh − nav, centred
  scraps?: Scrap[];                // default: the home FRAGMENTS
  phoneScraps?: number;            // how many scraps show < sm (home 0, about 6)
  loop?: boolean;                  // default true (home); about passes false
  orbSize?: number;                // default 72
  after?: ReactNode | ((state: { done: boolean; still: boolean }) => ReactNode);
                                   // home passes the site CTA with cta-live on done
  delayStart?: number;             // ms before step 0 when on screen at load (about: 250)
};
```

Internals and two required fixes versus today's `FinalCTA`:

1. **Scraps move with transforms only.** Today they animate `left`/`top`. New structure per scrap:
   ```html
   <span class="scrap-layer" style="position:absolute; inset:0; transform: translate(var(--tx), var(--ty))">
     <span style="position:absolute; left:{x}%; top:{y}%; transform: translate(-50%,-50%) scale(var(--s))">
       <span class="drift tag …">{text}</span>
     </span>
   </span>
   ```
   The layer is the size of the stage, so percentage translates on it are percentages of the stage. Pulled state: `--tx: {50 - x}%`, `--ty: {Oy - y}%` where `Oy` is the orb centre in % of the stage (measured once on mount/resize with a `ResizeObserver`, stored as a CSS variable on the stage; SSR default = the section's known layout value), `--s: 0.2`, opacity 0. Transition `transform 750ms cubic-bezier(0.7,0,0.2,1), opacity 750ms`, stagger via `transitionDelay`. Same look, no layout work.
2. **No `backdrop-blur` on scraps.** Solid `bg-panel` + `border-line` (the `.tag` border). Visually equivalent over the empty ring background.

Other behaviour kept: `.drift` idle motion, orb scale on pull, glow layer, `TumbleWord` for the word, `useSequence` gating (only while on screen), still frame = settled.

Phone positions: when `phoneScraps > 0`, the first *n* scraps use their `phone` coordinates (Builder: add them to the data), placed in the top band (y 4–20%) and bottom band (y 80–96%), x 8–92%, so none overlaps the headline.

`useSequence` gains an options arg `{ loop?: boolean }` (default true). With `loop: false` the step stops at the last index and the timer ends.

**Reused by:** Home close (`FinalCTA`), About opening. Not by `CTASection` (the agents-hub spec keeps CTASection calm: rings only).

### 5.2 `TumbleWord`

The letters-only part, usable anywhere a word should fall into place.

```ts
type TumbleWordProps = {
  text: string;             // "chaos.", "not found."
  settled: boolean;         // false = scattered, true = in place
  still?: boolean;          // skip transitions (reduced motion / SSR)
  ink?: "chaos" | "fg";     // chaos = crimson ramp across letters (home); fg = text-fg
  stagger?: number;         // ms between letters, default 30
  seed?: number;            // picks the scatter table, default 0
};
```

- Each character is an `inline-block` span; spaces render as ` ` spans that never move.
- Scatter per letter: the existing `SCATTER` table for the first 6 letters; for longer words, a deterministic table generated from `seed` (no `Math.random` at render, so SSR and client match): x ∈ ±0.14em, y ∈ ±0.3em, rotation ∈ ±20°, alternating signs.
- Chaos ink across *n* letters: map letter index to `--chaos-0…5` by `round(i × 5 / (n − 1))`.
- Settle transition: `transform 550ms cubic-bezier(0.34,1.56,0.64,1)`, delay `i × stagger`. Transform only.
- `aria-hidden` on the letters; the parent heading carries the accessible text.

**Reused by:** `ChaosToOrder` (home, about), 404 page.

---

## 6. Motion and scroll safety

- The opening runs on load and never re-runs; nothing is scroll-scrubbed on this page. No `StickyScene`.
- During scroll only `ScrollReveal`'s opacity/transform and the idle `.drift` transforms run.
- Reduced motion: opening shows the settled frame; statements appear without movement (existing `.reveal` reduced-motion rule).

---

## 7. Acceptance checklist (Reviewer)

- [ ] Opening fills one screen at 1440×900, 1280×720 and 390×844: "About" pill, orb, "Product work is scattered."; scraps pull into the orb once, *scattered.* settles, "Scroll" hint appears; no loop.
- [ ] Home close still looks and behaves the same after the refactor (loops, CTA pulses on hold).
- [ ] Scraps animate transform/opacity only (Performance panel: no Layout during the pull); no `backdrop-filter` anywhere on the page.
- [ ] Statements 2–6: one per screen, counters 02–06, alternating left/right on desktop, all left on phone; statement 4's second sentence arrives just after the first; "AI Product Manager" in statement 6 is the only accent.
- [ ] Close: "stop building in chaos." with *chaos.* settling once on enter, then the site CTA; no other primary action on the page.
- [ ] Headings: hidden h1 "About Selixa", seven h2 statements in order.
- [ ] Phone: 6 scraps in the top/bottom bands, none over the text; no horizontal scroll.
- [ ] Reduced motion / no JS: settled frames, everything visible, no pinning.
- [ ] No photos, logos, team names, numbers or claims.
- [ ] Light and dark checked, mono theme fine.

---

## 8. Open decisions for the user

1. **Anything real to add?** Founders' names, a signature or a photo would make the manifesto land harder. Nothing goes in until supplied.
