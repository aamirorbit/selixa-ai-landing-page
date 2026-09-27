# `/contact` — the form as a page (design spec)

Plan: `docs/SITE_PLAN.md` §8. Copy: `docs/pages/contact.copy.md` (sections: **Hero, Form, Other ways to reach us**). Reuses `components/InquiryForm.tsx`; the value-retention fix from `docs/pages/get-started.md` §6 applies.

---

## 1. Concept

**A quiet page with one form on it.** For direct links, email signatures and people who'd rather skip a modal. It deliberately has no signature animation: the form *is* the page, and the only thing that moves is the form's own feedback. It should feel like the modal, opened flat on the page.

Why it can't be mistaken for another page: it's the only page with a form as its hero, and it has no demo, no scroll story and no `CTASection` (the form already is the site's primary action; a second one would compete).

---

## 2. Layout

Shell: `<Nav />`, `<main className="relative flex-1 overflow-x-clip">`, `<Footer />`, `<ScrollReveal />`. No `<Background>`.

One section, `min-h-[calc(100svh-4.5rem)]`, content vertically centred on ≥ lg, `py-16 lg:py-20`.

### Desktop (≥ lg)

```
┌ nav ───────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  [● Contact]                          ┌ .panel (modal-panel look) ────────┐ │
│                                       │ Get started with Selixa           │ │
│  talk to us.                          │                                   │ │
│                                       │ [Full Name]      [Work Email]     │ │
│  Tell us what you're building.        │ [Company / Project]               │ │
│  We'll take it from there.            │ [What are you building?      ]    │ │
│                                       │ [What problem…]                   │ │
│  ─────                                │ [ Request access ↗ ]              │ │
│  PREFER EMAIL?                        │ 🔒 We respect your privacy…        │ │
│  hello@selixa.ai   (only if confirmed)└───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

- `grid lg:grid-cols-12 gap-12 items-center`, max-w 1120 centred.
- **Left, `lg:col-span-5`:** `PageHero align="left"` without `visual`, `rings={false}`: eyebrow **Hero.eyebrow** ("Contact", `live-dot`), H1 **Hero.headline** ("talk to us.") at `clamp(2.75rem,5.4vw,4.75rem)` (a notch smaller than the default PageHero, since it shares the row), line **Hero.line**, `max-w-[26rem]`.
  - Under it (mt-12), the **Other ways** block, rendered only when the owner has confirmed the address: a 48px `bg-ink/[0.12]` rule, then **Label** ("Prefer email?", 11px uppercase tracking 0.12em `text-fg-3`, mt-6), then the address as a `mailto:` link, 17px `text-fg`, `underline underline-offset-4 decoration-ink/30 hover:decoration-brand-400`. Until confirmed, render nothing (no empty space reserved).
- **Right, `lg:col-span-7`:** the form in a panel with the **same look as `.modal-panel`** (radius, border, `bg-panel`, inner glow) but static: no close button, no backdrop. Max-w 36rem, `justify-self-end`. Padding as the modal panel (p-8 desktop).
  - `<InquiryForm heading="Get started with Selixa" submitLabel="Request access" titleId=… />` with **no intro**: the hero line already says "Tell us what you're building", so the intro would repeat it (the copy sheet allows this). Builder: make `intro` optional in `InquiryForm`, and render nothing (not an empty `<p>`) when it's absent.
  - Not `compact`: success state uses the taller `min-h-[32rem]`, so the panel keeps its height when the form turns into the thank-you and the page doesn't jump.
- Soft glow behind the panel: one radial `rgb(var(--brand-glow-rgb)/0.08)` circle, `aria-hidden`, static. No rings, no orb.

### Tablet (md–lg)

Single column, max-w 36rem centred: hero (left-aligned) then the panel, gap 40. Other-ways block moves **under** the panel (mt-10) so the form is reached first.

### Phone (< md, 390px)

- Single column, 16px gutters (358px content). Hero: H1 bottoms at 2.75rem; line 17px.
- Panel full width, p-5, radius 20. Name/email stack (`InquiryForm` already switches `sm:grid-cols-2`).
- Other-ways block under the panel.
- No sticky elements; the submit button is inside the flow.
- Inputs 16px (no iOS zoom), tap targets ≥ 44px.

---

## 3. Behaviour

- **Source:** add a hidden `source` input with value `contact`; the server maps an allowlist (`landing` → `selixa.ai/landing` for the modal, `contact` → `selixa.ai/contact`) and ignores anything else. `/admin` shows it as the small source tag (see `get-started.md` §11).
- **Value retention (hard requirement):** apply `get-started.md` §6 points 3–4 to `InquiryForm`: submit via `onSubmit` + `startTransition(formAction)` so React doesn't reset the form, and make fields controlled (or keep uncontrolled but never remount) so every typed value survives validation and server errors. The page must not remount the form on error (no `key` changes).
- **Errors:** existing inline errors + summary; focus moves to the first invalid field (existing effect). Error colour moves to the `--color-danger` token (`get-started.md` §9) so it reads in light.
- **Success:** existing `Success` state inside the panel. Then focus moves to the success heading (`tabIndex={-1}`), so screen readers hear "Thanks, {name}." Add this to `InquiryForm` generally.
- **Pre-fill (optional):** `?topic=` is not supported; the page takes no params. (The integrations "Request one" flow pre-fills the modal, not this page.)
- **Footer:** the footer's "Contact" item becomes a link to `/contact` (today it opens the modal).
- **Metadata:** from the copy sheet; `robots` index true.

---

## 4. Motion

Load reveal only (existing `.reveal` + `d()`): pill 60, h1 140, line 220, panel 300 (opacity + `translateY(8px)`), other-ways 380. No loops, nothing scroll-linked. Reduced motion: no transforms.

---

## 5. Light and dark

- Panel uses the modal panel tokens (check its light-scheme look on a plain `bg-bg` page, since in the modal it sits on a dimmed backdrop: it may need `border-line-strong` instead of `border-line` on light to hold its edge).
- Glow uses `--brand-glow-rgb` (works in mono).
- Danger token for errors.

---

## 6. New shared pieces

- None new. Changes to existing: `InquiryForm` (`intro` optional, hidden `source`, no-reset submit, focus success heading, danger token). `PageHero` needs the `rings` prop and the smaller title size option: add `size?: "default" | "compact"` (compact = `clamp(2.75rem,5.4vw,4.75rem)`).

---

## 7. Acceptance checklist (Reviewer)

- [ ] 1440×900 and 1280×720: hero and form side by side, everything above the fold; submit visible without scrolling at 1280×720.
- [ ] Phone 390: hero, full-width panel, other-ways (if confirmed) under it; no horizontal scroll; inputs don't zoom.
- [ ] Form heading "Get started with Selixa", no repeated intro line; submit "Request access".
- [ ] Validation error and forced server error: **every typed value stays**; focus goes to the first invalid field.
- [ ] Success: thank-you replaces the form inside the panel without the page jumping; focus on "Thanks, {name}."
- [ ] Row saved with `source = selixa.ai/contact`; modal submissions still `selixa.ai/landing`.
- [ ] "Prefer email?" row absent until the address is confirmed.
- [ ] Footer "Contact" links here.
- [ ] No `CTASection`, no demo, no other primary button.
- [ ] Light and dark checked (panel edge in light, error colour), mono theme fine.

---

## 8. Open decisions for the user

1. **Support email** to list under "Prefer email?" (hello@selixa.ai or another). Hidden until confirmed.
2. **No `CTASection` on this page** (the form is the primary action), an intentional exception to "every page ends with the website CTA".
