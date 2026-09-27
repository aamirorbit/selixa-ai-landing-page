# 404 — not found (design spec)

Plan: `docs/SITE_PLAN.md` §8. Copy: `docs/pages/not-found.copy.md` (section: **Content**). Shared: `TumbleWord` (defined in `docs/pages/about.md` §5.2), `IntegrationSearch compact` (from the `/integrations` build, SITE_PLAN §4.1).

File: `app/not-found.tsx` (the root one handles every unmatched URL in this Next version; one root layout, so `global-not-found` isn't needed). `export const metadata = { title: "Not found — Selixa" }`; Next injects `noindex` for 404 responses automatically, so the copy sheet's noindex is covered.

---

## 1. Concept

**The home page's close in miniature, one screen.** A small orb, and the words *not found.* with every letter out of place. After a beat they tumble into line. The page tells you something went wrong, then shows order being restored, then gives you two ways back.

Why it can't be mistaken for another page: it's the only page where the headline is the animation, and the only one-screen page with nothing to scroll.

---

## 2. Layout

Shell: `<Nav />`, `<main>`, `<Footer />`. Content section `min-h-[calc(100svh-4.5rem)]`, centred both ways, `py-16`.

```
┌ nav ──────────────────────────────────────────────┐
│                                                   │
│                        (◉)                        │  Orb 56 (phone 44)
│                                                   │
│               n o t   f o u n d .                 │  TumbleWord, h1
│                                                   │
│     This page wandered off. Let's get you back.   │  line
│                                                   │
│        ┌ 🔍 Search integrations ──────────┐       │  IntegrationSearch compact
│        └──────────────────────────────────┘       │
│                  Back to home →                   │  link-arrow
│                                                   │
└ footer ───────────────────────────────────────────┘
```

- Background: the `FinalCTA` ring layer (radial glow, solid ring, dashed `spin-slow` ring), sized `w-[min(90vw,40rem)]`.
- `Orb size={56}` (phone 44), then **Tumbling word** as the `h1`, mt-8: Satoshi Light `clamp(3.5rem, 13vw, 10rem)`, `leading-[0.9] tracking-[-0.055em]`, **one line at every width** (at 390px, 13vw ≈ 51px; "not found." fits in 358px). `TumbleWord text="not found." ink="chaos"` (crimson ramp mapped across the letters, the space never moves). The `h1` carries `aria-label` = the screen-reader label from the sheet ("not found.").
- **Line**, mt-6: 18px `text-fg-2` (phone 16px), max 28rem, centred.
- **Search**, mt-10: `IntegrationSearch variant="compact"`: the `/integrations` field at h-12, max-w 26rem, placeholder "Search integrations" (sheet), sr-only label the same. Typing shows up to **5** matches in a dropdown panel (`.window`, radius 14, absolute under the field so the page never reflows), each row: 20px `BrandMark` (monochrome, lit on hover/active) + name + `kind` (12px `text-fg-3`), linking to `/integrations/[slug]`. No match: the sheet's empty state ("No tools match "{query}"."). Arrow keys move through results, Enter opens, Esc closes the list and keeps the query. The listbox follows the combobox pattern (`role="combobox"`, `aria-expanded`, `aria-activedescendant`).
  - If `/integrations` hasn't shipped when the 404 is built, replace the field with the sheet's **"Search integrations"** link (`.link-arrow`, → `/integrations`) and don't render a search that goes nowhere.
- **Back to home**, mt-6: `.link-arrow` → `/` (sheet: "Back to home"). This is a link, not a button-styled primary: the page has no primary CTA (§6).
- Phone 390: same stack, 16px gutters, search full width (358px), dropdown full width.
- Short viewports (`max-height: 640px`): orb hidden, word clamp max 7rem.

---

## 3. Motion script

`TumbleWord` driven by a tiny one-shot sequence (`useSequence([700, 0], { loop: false })` or a single timeout):

| Beat | ms | Frame |
|---|---|---|
| 0 | 0–700 | letters scattered (their `TumbleWord` scatter), orb glow layer at 0.6 |
| 1 | 700 → | letters settle, 40ms stagger, 550ms overshoot curve; glow fades (500ms) |

- Plays once, on load (the section is always on screen). Total ≈ 1.6s. Transform/opacity only.
- **Replay on hover** (desktop only, `hover: hover`): pointer entering the word re-scatters it for 400ms, then it settles again; throttled to once per 2s. A small reward for people who landed here by mistake; skipped entirely with reduced motion. (Drop it if it feels like too much in review.)
- Reduced motion / before JS: settled word, no glow. The server renders the settled frame.

---

## 4. Light and dark

- The chaos ramp (`--chaos-*`) already has light-scheme values; orb stays dark.
- Search field and dropdown use the `/integrations` tokens; `BrandMark` lit colours per `get-started.md` §13 (Intercom on light).
- `not-found` renders inside the root layout, so the scheme script and fonts apply (no separate theming needed).

---

## 5. Shared components used

- `TumbleWord` (new, `components/site/`, spec in `about.md` §5.2).
- `IntegrationSearch` with a `compact` variant (from the `/integrations` build): field + dropdown results instead of filtering a grid. Its data comes from `lib/content/integrations.ts`.

---

## 6. Acceptance checklist (Reviewer)

- [ ] Visiting any unknown URL (e.g. `/nope`, `/agents/nope`) shows this page with HTTP 404 and `noindex`; title "Not found — Selixa".
- [ ] "not found." starts scattered and tumbles into place once; one line at 390px and at 1440px; reduced motion shows it settled.
- [ ] Screen reader hears "not found." as the h1, then the line, the search combobox and the home link.
- [ ] Search: typing filters to ≤ 5 integrations, arrow keys + Enter work, empty state shows the sheet's message, dropdown overlays without moving the page. (Or, pre-`/integrations`, a plain link.)
- [ ] "Back to home" goes to `/`.
- [ ] Fits one screen at 1280×720 and 390×844 (no scroll needed to reach the home link).
- [ ] Light and dark checked, mono theme fine; Satoshi Light word, nothing above 500.

---

## 7. Open decisions for the user

1. **No site CTA on the 404.** The rule is "every page ends with the website CTA", but this page's job is recovery: search and home. Adding the site pill would make three actions on one small screen. Recommended: leave it out. If you want it, it goes under the home link as the standard `ConversationCTA variant="site"`, and the search drops to a link.
2. **Hover replay** of the tumble: keep or drop.
