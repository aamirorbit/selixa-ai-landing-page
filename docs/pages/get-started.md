# `/get-started` — the interview (design spec)

Plan: `docs/SITE_PLAN.md` §6. Copy: `docs/pages/get-started.copy.md` (slot names below map to its sections: **Rail, Buttons, Step 1 Site, Step 2 Tools, Step 3 Pains, Step 4 About you, Step 5 Done**; strings the sheet doesn't have yet are listed in §15). Shared components from `docs/pages/agents-hub.md` §5 (`components/site/`).
Data: new `lib/content/onboarding.ts` (tools, pains, roles), the inquiry record (`lib/inquiries.ts`, `lib/db.ts`, `app/actions.ts`, `/admin`).

---

## 1. Concept

**Selixa starts getting to know your product in front of you.** Each answer lands on a **product brief card** that builds beside the questions: the site becomes the card's title, tapped tools appear as their marks, pains become tags, and at the end the card seals with the **Isolated** lock, the same visual language as the home page's multi-product section. Nothing is invented: the card only ever shows what the visitor typed or tapped. No fake "analysing your site…" (plan §6).

Why it can't be mistaken for another page: it's the only page that is **a conversation with one input at a time**, and the only page whose signature visual is built by the visitor, not scripted. No scroll story, no loop. Quiet, focused, fast.

**Hard requirement (user): the form never clears a typed value.** Not on a validation error, not on a server error, not on Back, not on a step change, not on a reload of the tab. See §6.

---

## 2. Page structure

Shell: `<Nav />` + `<main className="relative flex-1 overflow-x-clip">` with the `max-w-[1280px] px-5 sm:px-8` container, `<Footer />`. No `<Background>`, no `ScrollReveal` sections below the flow. **No `CTASection`**: this page *is* the site CTA's destination; a second site input would be a second primary action (exception to §1 "every page ends with the CTA", recorded in Open decisions).

| # | Region | Component |
|---|---|---|
| 1 | Flow header (eyebrow + progress rail) | `OnboardingRail` (page-local) |
| 2 | Question column | `OnboardingFlow` (page-local, client) — one `<form>`, four step panels + done panel |
| 3 | Brief column | `BriefCard` (page-local) |

Files: `app/get-started/page.tsx` (server: reads `searchParams`, metadata, renders `<OnboardingFlow initialSite={…} />`), `app/get-started/OnboardingFlow.tsx` (client). `robots: index true` (it's a real landing target).

---

## 3. Layout

### Desktop (≥ lg, 1024px+)

```
┌ nav ───────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  [● Get started]                                             Step 2 of 5       │  flow header
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━───────────────── │  rail
│  Website ✓     Tools ●      Pains       You        Done                        │
│                                                                                 │
│  ┌ question column (7/12) ─────────────────┐   ┌ brief column (5/12) ─────────┐ │
│  │ what do you use?                         │   │  ┌ BriefCard ──────────────┐ │ │
│  │ Tap the tools your team works in.        │   │  │ [a] acme.com   [Draft]  │ │ │
│  │                                          │   │  │ TOOLS  ◼ ◼ ◼            │ │ │
│  │  ┌──┐ ┌──┐ ┌──┐ ┌──┐                     │   │  │ ON FIRE  — — —          │ │ │
│  │  └──┘ └──┘ └──┘ └──┘   tool tiles 4-up   │   │  │ YOU      —              │ │ │
│  │  …                                       │   │  └─────────────────────────┘ │ │
│  │                                          │   │  caption (fg-3, 13px)        │ │
│  │  [← Back]                  [Continue →]  │   └──────────────────────────────┘ │
│  └──────────────────────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

- Whole flow region: `min-h-[calc(100svh-4.5rem)]`, `pt-10 lg:pt-14 pb-20`. Grid `lg:grid-cols-12 gap-12`; question column `lg:col-span-7`, brief column `lg:col-span-5`, brief is `lg:sticky lg:top-[calc(4.5rem+2.5rem)]` (plain CSS sticky, no scroll scripting) and `self-start`.
- Question column max width 40rem. Step heading: Satoshi Light, lowercase, `clamp(2.25rem,4vw,3.5rem)`, `leading-[1] tracking-[-0.045em]`. Step line below it: 17/18px Inter `text-fg-2`, mt-4. Controls start mt-10.
- Action row: mt-10, `flex justify-between items-center`. Left: **Back** (`btn-ghost`, `ArrowLeft` 16px; Buttons.back) on steps 2–4, nothing on step 1. Right: primary **Continue** (`btn-primary`, `ArrowRight`; Buttons.continue) on steps 1–3, **Request access** (`btn-primary`, `ArrowUpRight`; Buttons.submit) on step 4. On steps 2 and 3, while nothing is selected, the primary button reads **Skip** (Buttons.skip) instead of Continue: same action, same position, the two labels stacked in one grid cell so the button never changes width.

### Tablet (md–lg)

Single column, max-w 40rem centred. BriefCard moves **above** the question as the compact strip (below).

### Phone (< md, 390px reference)

```
┌ 390 ──────────────────────────────┐
│ [● Get started]  Step 2 of 5      │  12px, one line
│ ━━━━━━━━━━━━━━━━━━──────────────  │  rail (no labels)
│ ┌ brief strip ──────────────────┐ │  56px tall, .card
│ │ [a] acme.com   ◼◼◼ +2   0/3   │ │
│ └───────────────────────────────┘ │
│ what do you use?                  │  clamp → 2.25rem
│ Tap the tools your team works in. │
│ ┌────┐┌────┐┌────┐                │  tool tiles 3-up
│ …                                 │
│                                   │
│ ┌ sticky action bar ────────────┐ │  bottom: 0, bg-bg, border-t
│ │ [←]              [Continue →] │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

- Container `px-4` (16px gutter; the site's `px-5` is fine too: pick one and keep it; 358px content at `px-4`).
- Rail: no step labels, just the bar + the Rail counter ("Step 2 of 5") right-aligned in the header row.
- **Brief strip** (`BriefCard compact`): one 56px row, `.card` radius 14, px-3: domain chip + domain (truncate), tool marks (max 3 at 16px, then `+n` 12px `text-fg-3`), pains count `n/3` as a `.tag`. It is decorative-plus: `aria-hidden` (the answers are already in the form).
- **Action bar**: `position: sticky; bottom: 0` inside the form column (not `fixed`, so it never covers the footer), `bg-bg` with `border-t border-line`, `py-3`, `pb-[max(0.75rem,env(safe-area-inset-bottom))]`. Back is icon-only 44×44 (`aria-label` = Buttons.back), Continue/Skip full remaining width.
- Tool tiles 3-up, pain chips wrap, role chips wrap. Every tap target ≥ 44px tall.
- iOS zoom: all inputs ≥ 16px font (existing `.field` is 1rem: keep).

---

## 4. Steps

One `<form>` wraps all four question panels plus the hidden honeypot. Only the current panel is shown; the others carry the `hidden` attribute (so they're out of the a11y tree and tab order) **but stay mounted**, so their inputs keep their values and are included in `FormData` on submit. Never unmount a panel.

Step keys (used in URL, state, errors): `site`, `tools`, `pains`, `you`, then `done`. Each step's headline renders as the page `h1` (only the visible one is in the a11y tree).

### Step 1 — `site` (copy: Step 1 Site)

- Slots: headline, line, field placeholder *(reuse)*, field label (sr-only) *(reuse)*, validation *(reuse)*, pre-filled note, and **skip link** (missing from the sheet, §15).
- Control: the **same pill as the site CTA** (`.site-cta` look, 64px), without the round go-chip (Continue is the action): `Globe` icon left, input `name="site"` `type="text" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false}`. Width 100% of the column (max 34rem).
- **Pre-filled note:** when the value came from `?site=` or the CTA and hasn't been edited, a 13px `text-fg-3` line under the pill shows the pre-filled note. It disappears (opacity) on the first edit. Its height is reserved (one 20px line under the pill is always there, holding either this note, the error, or nothing), so nothing jumps.
- **Skip link** (quiet text button, 14px `text-fg-3 hover:underline underline-offset-4`, below the reserved line): sets `noSite` (hidden input `noSite=1`) and advances. Clears nothing: if they typed something, it's still there if they come back. The brief card then shows its no-site title. This is what makes the sheet's "if no site was given" Done variant reachable.
- Validation (client, on Continue/Enter): empty or `toDomain(value) === ""` → the reused validation line, shown in the reserved line. Valid → the input keeps **exactly what was typed** (never rewrite `https://www.Acme.com/pricing` to `acme.com` in the field); the normalized domain is what the brief card shows and what the server stores.
- Live: while typing, the brief card title shows the normalized domain as soon as it parses (debounce 150ms), else its placeholder bar.

### Step 2 — `tools` (copy: Step 2 Tools)

- Slots: headline, line, logo grid names *(data)*, selected count, none-selected hint, "Something else" tile, other-field placeholder.
- Control: `<fieldset>` with `<legend class="sr-only">` = headline. Tiles for the **11 tools in `LOGOS` order** (`components/landing/logos.ts`), then a 12th text tile **Something else**. 12 tiles = clean 4×3 (desktop) and 3×4 (phone) grids.
- Tile = `<label>` wrapping a visually-hidden native `<input type="checkbox" name="tools" value={slug}>` + visual. Visual: `.card`, radius 14, h-[88px] (phone h-[76px]), mark centred at 24px, name 13px `text-fg-2` under it (`kind` not shown). The "Something else" tile shows a 24px `Plus` in `text-fg-3` instead of a mark.
  - Unchecked: `BrandMark lit={false}` (monochrome).
  - Checked: `BrandMark lit`, tile border `border-brand-400/50`, a pre-rendered lit layer (`card-lit` look) at opacity 1, and a 16px round `bg-brand-500` check badge top-right (`Check` 10px white) scaling `0.6→1` + opacity, 160ms.
  - Focus-visible: `outline 2px rgb(var(--brand-400-rgb)/0.6) offset 2` on the tile (`:has(:focus-visible)`).
- Grid: `grid-cols-4 gap-2.5` (≥ sm), `grid-cols-3 gap-2` (< sm).
- **Status row under the grid** (fixed 52px tall, always present, so the grid never shifts):
  - Nothing selected: the none-selected hint, 14px `text-fg-3`.
  - Tools selected, "Something else" not: the selected count, 14px `text-fg-2`, tabular.
  - "Something else" selected: a `.field` input (`name="toolsOther"`, placeholder = other-field placeholder, max 60 chars, `autoComplete="off"`), 44px tall, full width, and the count moves to the right end of the headline row as a `.tag`. Focus moves into it when the tile is checked by pointer (not by keyboard Space, to keep keyboard users in the grid). Unchecking the tile hides the input but **keeps its value** in state; it's only sent if the tile is checked.
- Validation: none (optional). With nothing selected the primary button reads Skip.
- Slugs = kebab of `LOGOS[].name` (`slack`, `notion`, `google-drive`, `linear`, `jira`, `github`, `zoom`, `google-meet`, `intercom`, `posthog`, `mixpanel`) + `other`. Defined once in `lib/content/onboarding.ts` as `TOOL_OPTIONS`; the server allowlists from it.
- No live/coming-soon badges until SITE_PLAN §11 Q1 is answered (per the sheet).

### Step 3 — `pains` (copy: Step 3 Pains)

- Slots: headline, line ("Pick up to three."), 8 chips, counter ("{n} of 3"), at-the-limit message.
- Keys (stable, stored), in the sheet's order: `priorities`, `meeting-follow-up`, `customer-feedback`, `roadmap-drift`, `lost-decisions`, `scattered-docs`, `unread-metrics`, `specs-and-tickets`. Labels from the sheet; keys + labels live in `lib/content/onboarding.ts` as `PAIN_OPTIONS`.
- Control: `<fieldset>` + sr-only legend; chips = `<label>` + hidden `<input type="checkbox" name="pains" value={key}>`. Chip: pill h-11, px-4, `border-line bg-ink/[0.03]`, 15px `text-fg-2`; checked: brand tint (`border-brand-400/40 bg-brand-500/10 text-fg`) with a leading 14px `Check` that fades/scales in. The icon slot is always reserved (14px, opacity 0 when unchecked), so chips never change width.
- Counter: `.tag` with the counter string, right end of the headline row (desktop) / under the line (phone), tabular.
- **Limit:** at 3 checked, unchecked chips get `aria-disabled="true"` and `opacity: 0.45` but stay focusable. Activating one does **not** check it; the counter tag nudges (`translateX` ±3px, 240ms, skipped for reduced motion) and the polite live region reads the at-the-limit message; the same message shows for 2.5s in the 20px line under the chips (reserved, like step 1). Unchecking one re-enables the rest.
- Validation: optional (the sheet offers Skip). With none picked, the primary button reads Skip. See Open decision 2.
- Layout: `flex flex-wrap gap-2`, no grid.

### Step 4 — `you` (copy: Step 4 About you)

- Slots: headline, line, name field *(reuse)*, email field *(reuse)*, role label, 5 role options, field errors (2 reused + role), error summary *(reuse)*, save failure *(reuse)*, privacy line *(reuse)*.
- Fields: exactly `InquiryForm`'s `Field` look (placeholder-as-label + `aria-label`, `User` / `Mail` icons), in a `sm:grid-cols-2 gap-2.5` row: `name` (autoComplete `name`), `email` (`type="email" autoComplete="email" inputMode="email"`). Builder: export `Field` from `InquiryForm.tsx` and reuse it, don't re-create it.
- Role: `<fieldset>` with a visible legend (role label, 13px `text-fg-2`, mt-6 mb-2.5), radio chips (pains chip look, single-select, `name="role"`). Keys: `founder`, `product-manager`, `engineering`, `design`, `other`. Native radios: arrow keys move within the group.
- Privacy line under the action row: `Lock` + privacy line, as `InquiryForm`.
- Validation: name ≥ 2 chars, email matches `EMAIL_RE`, role required. Personal email is allowed (flagged as today: `personalEmail`).
- Submit pending state: "Sending" *(reuse)* + `Loader2` spin; the button is `disabled` only while pending. Inputs are **never** disabled or reset while pending.

### Step 5 — `done` (copy: Step 5 Done)

- Slots: headline (with `{domain}`) or the no-site headline (with `{first name}`), line *(reuse)*, 3 next-step rows (row 3 has a no-site/no-tools variant), summary labels (Website / Tools / On fire, with "None picked"), link "Back to home".
- The form panels are replaced by the done panel (the form can unmount now: the record is saved). Rail: all five cells done, fill complete.
- Question column: headline (Satoshi, step-heading size; `{domain}` in `text-fg`, rest the same), line, then an `<ol>` of the three rows: each 48px, number in a 24px circle `border-line text-fg-3 text-[12px]`, text 15px `text-fg-2`. Then "Back to home" as `.link-arrow` → `/`.
- **The summary card is the BriefCard**, now sealed (§5). Its row labels are the sheet's summary labels, so the echo the Writer asked for is already on screen; don't render a second summary. On phone the compact strip expands into the full BriefCard under the next-step rows on done (it's the one moment the full card shows on phone).
- No second CTA, no confetti.

---

## 5. `BriefCard` (the signature visual)

A `.window` panel (no window bar), radius 20, p-6, width 100% of the brief column (max 26rem). Height fixed from the start: every row is always present, empty rows show placeholders, so nothing ever reflows.

```
┌──────────────────────────────────────┐
│ [a]  acme.com                [Draft] │  header row (h 44)
│      WEBSITE                         │  11px uppercase fg-3 (summary label)
├──────────────────────────────────────┤
│ TOOLS                                │  11px uppercase fg-3 tracking .12em
│ ◼ ◼ ◼ ◼ ◼ ▢ ▢                       │  row h 40: up to 7 marks, then +n
├──────────────────────────────────────┤
│ ON FIRE                              │
│ [priorities] [roadmap drift] [▬▬]    │  row h 72: 3 slots (tags, or bars)
├──────────────────────────────────────┤
│ YOU                                  │
│ Maya Chen · Product manager          │  row h 40
└──────────────────────────────────────┘
  caption, 13px fg-3 (Brief caption, §15)
```

- **Header:** a 28px product chip (radius 8, `bg-ink/[0.06] text-fg-2`, first letter of the domain, uppercase) + domain 17px `text-fg` (truncate). Right: state tag. While the site is empty, the domain spot is a 55%-wide 8px `bg-ink/[0.07]` bar and the chip shows a `Globe` 14px.
- **Row labels** are the Done section's summary labels (Website, Tools, On fire) plus a **You** label (§15); empty-row text "None picked" is used only after a step was skipped, otherwise the placeholder shapes show.
- **State tag** (all labels stacked in one grid cell, only the current at opacity 1, so no width change): *Draft* (neutral `.tag`) during steps 1–4 → *Isolated* with `Lock` in the brand tint on done (exact classes and the existing "Isolated" string from `Products.tsx`). "Draft" is a new string (§15).
- **Tools row:** 24px marks, gap 8, lit (brand colour) in the order tapped. Always 7 slots: unused slots are 24px squares `border border-dashed border-line` radius 6. Beyond 7 selections, the 7th slot becomes `+n` (12px `text-fg-3`). "Something else" shows as a 24px `bg-ink/[0.06]` square with `Plus` 12px (its typed name is not shown on the card). If the step was skipped with nothing picked, the row shows "None picked" in 13px `text-fg-3` instead of slots.
- **On fire row:** a `flex flex-wrap gap-1.5` inside a **fixed 72px-tall** box with `overflow: clip`; empty slots are 88×26 `bg-ink/[0.05]` rounded-full bars. Filled slots: `.tag` with the brand tint, label from the pains chips. (Box height is fixed, so the card never grows.)
- **You row:** name + " · " + role label (no-site Done headline uses the first name; the card shows the full name), 15px `text-fg-2`; empty → 40%-wide bar. Email is never shown on the card.
- **Entry of a value (any row):** new mark/tag fades in with `opacity 0→1, translateY(4px→0), scale(0.96→1)`, 220ms `--ease-out-expo`. Removal: reverse, 160ms. Not scroll-linked; the card is only sticky, so this is safe with Lenis.
- **Seal (on done):** 0ms state tag cross-fades to Isolated (200ms); 120ms a lit layer (`card-lit` look, `inset-0 rounded-[20px]`) fades to 1 (400ms); 200ms a 1px ring (`border-brand-400/40`, radius 24, `inset-[-6px]`) scales `0.98→1` + opacity 0→1 (500ms) and stays. That ring is the "sealed container", the same metaphor as `/security`. Caption swaps to the done caption (§15).
- **Compact variant** (phone/tablet strip): see §3. Same data, one row, entries fade the same way, and on done it shows the Lock tag.
- **Accessibility:** the whole card is `aria-hidden="true"`. The form is the accessible source of truth; the card is a mirror.
- **No-JS / before hydration:** the card renders its empty frame (or the pre-filled site). Motion off: values appear/disappear instantly, seal is instant.

---

## 6. Value retention (hard requirement)

Rule: **a value the visitor typed or tapped is never cleared by the system.** How the Builder guarantees it:

1. **One client state object is the source of truth.** `answers = { site, noSite, tools: string[], toolsOther, pains: string[], name, email, role }` in a `useReducer`. Every input is **controlled** from it. The brief card reads it too.
2. **Panels never unmount** until success (§4). Step changes only toggle `hidden`.
3. **Don't let React reset the form.** A `<form action={fn}>` is auto-reset by React after the action. Instead use `onSubmit={e => { e.preventDefault(); … startTransition(() => formAction(new FormData(e.currentTarget))) }}` with `useActionState`. Controlled inputs make a reset harmless anyway, but do both.
4. **Server echoes values.** The action's error state returns `values` (including `tools` and `pains` arrays) and `step` (the first step with an error). On error the client **keeps its own state** (it's already correct) and only uses `values` if its state is empty (e.g. after a reload). It never overwrites non-empty client state with server values.
5. **Survives reload and Back/Forward.** Mirror `answers` to `sessionStorage` key `selixa.onboarding.v1` on change (debounced 250ms, try/catch, silent failure), restore on mount **before** first interaction (in a layout effect, so no flash of empty fields on a warm reload). Clear it only on success. Email/name in sessionStorage is same-tab only and cleared on success; acceptable, but see Open decision 3.
6. **Pre-fill never overwrites.** `?site=` (§7) fills `site` only if the restored state's `site` is empty.
7. **Server errors that aren't field errors** (DB down, webhook down) keep the visitor on step 4 with everything intact and show the message in the form's `role="alert"` area. Submit becomes available again.
8. **Browser autofill** is respected (controlled inputs must read `onChange`, and on mount read the DOM value once in case autofill ran before hydration: `if (input.value && !state.x) dispatch(...)`).

Apply points 3–4 to the existing `InquiryForm` too (the modal and `/contact`), so the requirement holds site-wide. Today it relies on `defaultValue` from the echoed values, which works only for validation errors and loses values if the component remounts.

---

## 7. How the site CTA reaches this page (recommendation)

**Recommendation: the site CTA navigates here; the modal stays for everything else.**

- `ConversationCTA variant="site"` (home hero, FinalCTA, every page's `CTASection`): on submit, validate as today (`toDomain`; the inline error stays in place). If valid → `router.push('/get-started?site=' + encodeURIComponent(domain))`. If empty → `router.push('/get-started')`. The input value is kept in the pill (navigating away clears nothing the visitor can't see again, and Back returns to a pill with their text via the browser's form restore; also store it in the same `sessionStorage` key so step 1 has it even without the param).
- `variant="premium" | "compact" | "link"` (nav "Get started", footer links, blog) **keep opening the modal**: a quick form for people who don't want a flow. Footer "Contact" becomes a link to `/contact`.
- Why: the plan calls this page the full-page version of the website CTA; a visitor who has just typed their site has already committed to the flow, and the interview captures much richer leads than the modal. The modal remains the zero-navigation path from the header. (This changes home behaviour; it's Open decision 1.)
- `toDomain` moves from `ConversationCTA.tsx` to `lib/site.ts` (shared by the CTA, the page, and the server action).

**Arriving with `?site=`:**
- `page.tsx` awaits `searchParams`, takes the first `site` value, runs `toDomain`. Valid → pass `initialSite`. Invalid or absent → no pre-fill (no error shown for a bad param).
- With a valid `initialSite`, the flow **opens on step 2 (`tools`)** with step 1 marked done in the rail and the brief card header already showing the domain. Step 1 stays reachable (rail click or Back) and shows the domain in the input. Focus lands on the step 2 heading.
- Page title/heading does not change for pre-fill; the brief card is where the domain shows.

**Step in the URL:** each step change does `history.pushState({}, '', '?step=tools')` (keeping `site` in the URL on the first entry only, then dropping it so a copied URL doesn't re-prefill stale values). `popstate` moves to that step (never forward past the first incomplete step). Browser Back therefore walks back through steps without leaving the page or losing answers. On load, `?step=` is honoured only if all earlier steps are valid in the restored state; otherwise start at the first incomplete step.

---

## 8. Progress rail (`OnboardingRail`)

Five cells, matching the sheet's Rail labels: **Website · Tools · Pains · You · Done**.

- Header row: `.pill` eyebrow with `live-dot` reading "Get started" (existing CTA label, reused); right side the counter "Step {n} of 5", 13px `text-fg-3`, tabular. On done it reads "Step 5 of 5".
- Bar: spans all 12 columns on desktop, 2px tall, radius 1. Base `bg-ink/[0.1]`; fill `bg-brand-400` with `transform: scaleX(i/4)` where i = current step index 0…4 (Website 0, Done 4 = full), `transform-origin: left`, 400ms `--ease-out-expo`. `aria-hidden` (the list below carries the meaning).
- Labels (≥ md): five equal cells under the bar, 13px. Current: `text-fg` + 6px brand dot; completed: `text-fg-2` + 12px `Check` `text-brand-300`, rendered as a `<button type="button">` that jumps back to that step (skipped steps count as completed); future: `text-fg-3` `<span>`, not interactive. Done is never a button. After success no cell is a button.
- Markup: `<nav aria-label="Setup progress"><ol>…</ol></nav>` (sheet: progress bar aria-label); current item `aria-current="step"`; completed buttons get a visually-hidden suffix ", completed" (new string, §15).
- Phone: bar + counter only; no labels. Back covers navigation.

---

## 9. Keyboard, focus, screen reader

- **Enter** in any single-line input or on a focused tile/chip submits the current step (the form's `onSubmit` handler checks the current step: steps 1–3 validate and advance; step 4 submits). Space toggles tiles/chips/radios (native).
- Tab order per step: heading is not a tab stop (`tabIndex={-1}` for programmatic focus only) → controls → Back → Continue.
- **On step change** (forward, back, rail, popstate): move focus to the new step's `<h1>` (steps 1–4 each render their heading as the page `h1`; only the visible one exists in the a11y tree because of `hidden`). Scroll: `scrollIntoView({block:'start'})` is not needed on desktop; on phone, scroll the flow top to just under the nav (via Lenis-compatible `window.scrollTo`, instant) if the heading is above the viewport.
- On step 1 initial load (no pre-fill): autofocus the site input (desktop only; not on touch, to avoid the keyboard jumping up before they read).
- **Live region:** one `aria-live="polite"` visually-hidden element at the form's top for: step announcements are handled by focus, so use it only for the pains at-the-limit message and the tools "{n} selected" / pains "{n} of 3" counts (debounced 500ms).
- **Errors:** per step, an error summary `<p role="alert">` above the action row with the message, plus the field's own inline message (`aria-describedby`) and `aria-invalid="true"`. Focus moves to the first invalid control. For fieldsets (pains, role) the error id goes on the `<fieldset aria-describedby>` and focus goes to the first chip.
- Reduced motion: no transitions on rail, card, chips; focus behaviour identical.
- Error colour: current `text-red-300/90` is too light on the light scheme. Add a `--color-danger` token (dark: current red-300 look; light: a red around `#b42318`) and use `text-danger` / `border-danger/55` everywhere a field errs (this page, `InquiryForm`, `.field[aria-invalid]`, `.site-cta[data-error]`).

---

## 10. Validation summary

| Step | Client rule (on Continue/Enter) | Server rule (on submit, re-checks all) | Error copy | On server error, jump to |
|---|---|---|---|---|
| site | `toDomain(value)` ≠ "" — unless `noSite` | same; store normalized domain, or "" when `noSite` | Step 1 validation *(reuse)* | `site` |
| tools | none | drop values not in `TOOL_OPTIONS`; `toolsOther` trimmed to 60 chars, kept only if `other` is checked | — | — |
| pains | ≤ 3 (enforced by the UI) | filter to `PAIN_OPTIONS`, keep the first 3 | — | — |
| you | name ≥ 2; `EMAIL_RE`; role set | same + role in `ROLE_OPTIONS`; all strings ≤ 4000 | name/email *(reuse)*, role (sheet), summary *(reuse)* | `you` |

Server returns the **earliest** failing step. Client validation of a step runs only when leaving it forward; going Back never validates. An error clears as soon as that control changes.

Honeypot: keep the hidden `website` input exactly as `InquiryForm` has it. **The real field is `site`, never `website`**, or every visitor becomes a bot.

---

## 11. Data contract (Builder)

### `lib/content/onboarding.ts` (new)

```ts
export const TOOL_OPTIONS = [/* { slug: "slack", logo: "Slack" }, … 11 in LOGOS order …, { slug: "other", label: "Something else" } */] as const;
export const PAIN_OPTIONS = ["priorities","meeting-follow-up","customer-feedback","roadmap-drift","lost-decisions","scattered-docs","unread-metrics","specs-and-tickets"] as const;
export const ROLE_OPTIONS = ["founder","product-manager","engineering","design","other"] as const;
export type ToolSlug = (typeof TOOL_OPTIONS)[number]["slug"];
export type PainKey = (typeof PAIN_OPTIONS)[number];
export type RoleKey = (typeof ROLE_OPTIONS)[number];
// Labels: from the copy sheet, kept here as `label` maps so /admin can show them.
```

### Inquiry record (`lib/inquiries.ts`, `lib/db.ts`)

```ts
export type Inquiry = {
  // existing
  id; createdAt; name; email; company; building; problem; personalEmail; source; status;
  // new
  site: string;        // normalized domain "acme.com", or "" (none given / modal leads)
  tools: string[];     // ToolSlug[]; [] when skipped. "Something else" is stored as "other:<typed name>" (≤ 60 chars) or "other"
  pains: string[];     // PainKey[], 0–3
  role: string;        // RoleKey or "" (modal/contact leads)
};
```

- Schema: add to `SCHEMA` in `lib/db.ts` (idempotent, runs on connect):
  `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT ''`,
  `… ADD COLUMN IF NOT EXISTS tools text[] NOT NULL DEFAULT '{}'`,
  `… ADD COLUMN IF NOT EXISTS pains text[] NOT NULL DEFAULT '{}'`,
  `… ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT ''`.
  One statement each. Works on Postgres and PGlite.
- `COLUMNS`, `InquiryRow`, `fromRow`, `saveInquiry` extend accordingly (`tools`/`pains` passed as JS arrays).
- Existing rows read as `site ""`, `tools []`, `pains []`, `role ""`.

### Server action (`app/actions.ts`)

- New `submitOnboarding(prev: OnboardingState, formData): Promise<OnboardingState>`; keep `submitInquiry` for the modal/contact. Share `EMAIL_RE`, `FREE_MAIL`, honeypot and the save/webhook block through a private `record(payload)` helper.
- Reads: `site`, `noSite`, `formData.getAll("tools")`, `toolsOther`, `formData.getAll("pains")`, `name`, `email`, `role`, honeypot `website`.
- Error messages reuse the existing strings ("One field needs attention." / save failure).
- Stores: `company = site` (so the existing Company column is useful), `building = ""`, `problem = ""` (the modal keeps its rules; for onboarding these are not asked), `source = "selixa.ai/get-started"`. Relax `building` validation only in the onboarding path; DB column stays `NOT NULL` with `''`.
- State:
  ```ts
  type OnboardingValues = { site: string; noSite: boolean; tools: string[]; toolsOther: string; pains: string[]; name: string; email: string; role: string };
  type OnboardingState =
    | { status: "idle" }
    | { status: "error"; step: "site" | "you"; message: string; fields?: Partial<Record<"site"|"name"|"email"|"role", string>>; values: OnboardingValues }
    | { status: "success"; name: string; site: string };
  ```
- Webhook payload gains `site`, `tools`, `pains`, `role` (plus labels, for readability in Slack).
- Also set `source` distinctly for the modal (`selixa.ai/landing` as today) and `/contact` (`selixa.ai/contact`, via a hidden `source` input checked against an allowlist).

### `/admin` table

- Contact cell: under the email, the **role** label (12px `text-fg-3`) when present.
- Company cell becomes **Product**: `site` as a link (`https://{site}`, `target=_blank rel=noopener`), else `company`, else "—".
- New **Context** column (between Product and Building, `w-[18%]`): tool marks row (`BrandMark lit={false}` 14px, gap 6, `title` = tool name; "other:<name>" as a small `.tag` with the typed name, bare "other" as "+"), then pains as small `.tag`s (labels), wrapping. "—" when both empty.
- Building/Problem show "—" when empty (they will be for onboarding leads).
- A small **source** tag in the Received cell (`get-started`, `modal`, `contact`), 11px `text-fg-3`.
- Table `min-w` grows to `72rem`.

---

## 12. Motion script

| Event | What moves | Duration |
|---|---|---|
| Page load | rail 60, h1 140, line 220, controls 300, brief card 360 (existing `.reveal` + `d()`) | 500ms each |
| Step forward | outgoing panel `opacity 1→0, translateX(0→-12px)` 160ms, then `hidden`; incoming `opacity 0→1, translateX(12px→0)` 240ms | ~400ms total |
| Step back | same, mirrored (x signs flipped) | ~400ms |
| Rail fill | `scaleX` | 400ms |
| Tile/chip check | lit layer opacity, check badge `scale(0.6→1)` | 160ms |
| Brief entry / removal | §5 | 220 / 160ms |
| Seal on done | §5 | ~700ms |

Panel transitions: during the 160ms out-phase, the incoming panel is not yet shown, so the column height changes once, between frames, when the panel swaps (not animated; that's allowed since it isn't scroll-linked). Keep step panels roughly the same height (min-h 26rem desktop) to avoid footer jumps.

Reduced motion / before JS: no transitions; server HTML shows step 1 (or step 2 when `?site=` pre-fills, since the server knows it) with the brief card's frame. Without JS only the first visible step renders and can't advance; acceptable (the modal needs JS too), but add a `<noscript>` line pointing to `/contact` (new string, §15).

---

## 13. Light and dark

- All surfaces tokens: `.window`, `.card`, `.field`, `.tag`, `bg-ink/[x]`. Lit brand marks use `logo.color`; black-brand marks (Slack, Notion, GitHub, PostHog) already use `var(--color-fg)`, so they work in both schemes. **Check Intercom** (`#6AFDEF`, pale cyan): on the light scheme's white panel it is too faint; in tiles and the brief card use a darker Intercom tone on light (or `var(--color-fg)`), via a scheme-aware override in `BrandMark`.
- Danger token per §9.
- Lit layer and seal ring use brand tokens; works in the mono theme.

---

## 14. Acceptance checklist (Reviewer)

**Flow**
- [ ] Four question steps + done; five rail cells, fill and "Step n of 5" track the current step; completed steps are clickable, future steps and Done are not.
- [ ] Enter advances steps 1–3 and submits step 4. Back never validates. Browser Back/Forward walks steps without leaving the page.
- [ ] `?site=acme.com` opens on Tools with the domain on the brief card and in step 1's input; `?site=garbage` opens on step 1, empty, no error.
- [ ] From the home hero, typing a site and pressing the chip lands on `/get-started?site=…` (if Open decision 1 is accepted); nav "Get started" still opens the modal.
- [ ] Tools: 11 marks + Something else (4×3 / 3×4 grid); Something else reveals the "Which tool?" field in the reserved row without shifting the grid; nothing selected shows Skip.
- [ ] Pains: a 4th pick is refused, announced ("Three is plenty…"), and the counter nudges; none picked shows Skip.
- [ ] Role is a 5-option radio group (arrow keys work).
- [ ] Pre-filled note shows under the site pill until the value is edited.

**Never clears (hard requirement)**
- [ ] Trigger each client error: every typed value stays.
- [ ] Force a server error (bad email via devtools, or DB down): lands on the right step, all values on all steps intact, including tool and pain selections.
- [ ] Back to step 1 and forward again: everything intact.
- [ ] Reload mid-flow: values restored from sessionStorage, on the same step. After success, reload shows a fresh flow.
- [ ] Autofilled name/email are captured.
- [ ] Modal form and `/contact`: a validation error keeps every value (same fix applied).

**Data**
- [ ] A submission creates one row with `site`, `tools[]`, `pains[]`, `role`, `source = selixa.ai/get-started`, `company = site`.
- [ ] Unknown tool/pain/role values posted by hand are dropped / rejected server-side.
- [ ] `/admin` shows Product link, Context column (marks + pain tags), role under the contact, source tag. Old rows render with "—".
- [ ] Honeypot still named `website`; the real field is `site`.

**Look**
- [ ] Brief card never changes height; entries fade in, seal plays once on done with the Isolated lock.
- [ ] Phone 390×844: brief strip on top, 3-up tiles, sticky action bar clears the home indicator, no horizontal scroll, inputs don't zoom.
- [ ] Light and dark both checked; errors readable in light; black brand marks and Intercom visible in light; mono theme fine.
- [ ] Satoshi Light headings, Inter elsewhere, nothing above 500. No invented proof, no fake analysis.
- [ ] Reduced motion: all state changes instant, nothing breaks.

---

## 15. Strings the copy sheet still needs (Writer)

| Slot | Where | Suggested |
|---|---|---|
| Step 1 skip link | under the site pill | "No site yet? Skip" |
| Brief "You" row label | BriefCard | "You" |
| Brief state "Draft" | BriefCard tag (steps 1–4) | "Draft" (done state reuses "Isolated" from home) |
| Brief caption / done caption | under BriefCard | e.g. "Only what you tell us." / "Sealed to {domain}." |
| Rail "completed" suffix (sr-only) | rail buttons | ", completed" |
| No-JS line | `<noscript>` | "This form needs JavaScript. Use the contact page instead." |
| Pre-filled note wording | step 1 | The sheet says "From your last visit…", but the value comes from the CTA they just used. Suggest "From the site you entered. Change it if you like." |

The sheet's "Step {n} of 5" and five rail labels are adopted as written. The sheet's Done summary card is not a separate block: the sealed BriefCard shows it (§4 step 5).

---

## 16. Open decisions for the user

1. **Site CTA → this page (recommended) or keep the modal?** Recommended: the site input everywhere navigates to `/get-started?site=…`; the header/footer "Get started" buttons keep the quick modal. This changes the home flow you approved (hero + modal). Alternative: the site CTA keeps opening the modal and `/get-started` is reached only by direct link.
2. **Pains optional?** Spec follows the copy sheet: Skip allowed on Tools and Pains. If you want every lead to name at least one pain, make it required (one error string needed).
3. **sessionStorage for name/email.** Needed to survive a reload; same-tab only, cleared on success. If you'd rather keep no personal data in the browser, persist only site/tools/pains/role and accept that a reload loses name/email.
4. **No `CTASection` at the end** (this page is the CTA's destination). Same for `/contact`.
