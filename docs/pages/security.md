# `/security` — trust centre (design spec)

Plan: `docs/SITE_PLAN.md` §8 (and §11 Q2–Q3). Copy: `docs/pages/security.copy.md` (sections: **Hero, Isolation diagram, Principle, Everything else**). Shared: `PageHero`, `CTASection` (`docs/pages/agents-hub.md` §5).

**Ship only the isolation principle.** Every other trust topic stays off the page until the owner confirms it. No certification badges, no "bank-grade", no lock-icon wallpaper.

---

## 1. Concept

**The isolation diagram.** Four sample products, Atlas, Beacon, Cove and Drift, drawn as sealed containers side by side, each holding its own meetings, docs, decisions and memory. A Selixa agent appears inside one container at a time. At the end of each loop, a dashed line tries to reach from Atlas into Beacon and stops dead at the wall: *Not shared*. That one image is the page.

Why it can't be mistaken for another page: it's the only page built from **walls**. Everywhere else the site shows things flowing (relay, hand-offs, tools into context); here the point is that nothing flows across. It's also the most restrained page: one diagram, three rows of text, one honest holding note.

---

## 2. Page structure

Shell: `<Nav />`, `<main className="relative flex-1 overflow-x-clip">`, `<Footer />`, `<ScrollReveal />`.

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero + diagram | `PageHero` with `IsolationDiagram` as `visual` | load reveal, then in-view loop |
| 2 | Principle | three rows (page-local `PrincipleRows`) | reveal |
| 3 | Everything else | `HoldingNote` (page-local) | reveal |
| 4 | CTA | `CTASection` | reveal |

---

## 3. Sections

### 3.1 Hero + diagram

- `PageHero align="center"`, not `fill` (the diagram sets the height). Eyebrow **Hero.eyebrow** ("Security", `live` false: no pulsing dot on a trust page), H1 **Hero.headline** ("every product, sealed."), line **Hero.line**.
- `visual` = `IsolationDiagram` (mt-14), then the **caption** (Isolation diagram → Caption) centred under it, 14px `text-fg-3`, mt-6.
- At 1440×900 the H1, line and the diagram fit one screen; the caption may sit just below the fold.

#### `IsolationDiagram`, desktop (≥ lg)

```
          ┌──────────────┐ ‖ ┌──────────────┐ ‖ ┌──────────────┐ ‖ ┌──────────────┐
          │ [A] Atlas  🔒│ ‖ │ [B] Beacon 🔒│ ‖ │ [C] Cove   🔒│ ‖ │ [D] Drift  🔒│
          │              │ ‖ │              │ ‖ │              │ ‖ │              │
          │ ▢ Meetings   │ 🔒│ ▢ Meetings   │ 🔒│ ▢ Meetings   │ 🔒│ ▢ Meetings   │   walls: lock badge
          │ ▢ Docs       │ ‖ │ ▢ Docs       │ ‖ │ ▢ Docs       │ ‖ │ ▢ Docs       │   centred in each gap
          │ ▢ Decisions  │ ‖ │ ▢ Decisions  │ ‖ │ ▢ Decisions  │ ‖ │ ▢ Decisions  │
          │ ▢ Memory ┄┄┄┄┼┄✕ │ ▢ Memory     │ ‖ │ ▢ Memory     │ ‖ │ ▢ Memory     │   blocked path (end beat)
          │              │ SEALED           │   │              │   │              │
          │ (◉ Selixa agent, working in Atlas)                                        agent chip slot
          └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

- Box: max-w 1120, `grid grid-cols-4 gap-10` (the 40px gaps are the walls).
- **Container** (`SealedContainer`): `.window` panel, radius 20, p-5, h-[300px], `flex flex-col`.
  - Header: 22px product chip (radius 6, `bg-ink/[0.08] text-fg-2`, letter A/B/C/D; the active container's chip swaps to `bg-brand-500 text-white` via a stacked overlay at opacity 1) + product name 15px `text-fg`; right, a 14px `Lock` in `text-fg-3` (active: `text-brand-300`, cross-fade).
  - Contents: four rows (Isolation diagram → Contents label: Meetings, Docs, Decisions, Memory), each 36px: 16px icon (`Video`, `FileText`, `CircleCheck`, `Brain` from lucide) in `text-fg-3` + label 13.5px `text-fg-2`. Active container: the rows' icon overlay turns `text-brand-300` with a 60ms stagger (opacity cross-fade of two stacked icons).
  - **Agent slot** (bottom, h-10, always reserved): holds the agent chip when this container is active, else empty.
  - Active container also gets a pre-rendered lit layer (`card-lit` look, `inset-0 rounded-[20px]`) at opacity 1 and a 1px ring (`border-brand-400/35`, `inset-[-5px]`, radius 24) at opacity 1: the same "seal ring" as the `/get-started` brief card.
- **Walls:** in each gap, a vertical pair of 1px lines 4px apart (`bg-ink/[0.1]`), running the container height, and a 28px round **lock badge** centred on them (`bg-panel border border-line`, `Lock` 13px `text-fg-3`). Under the first wall's badge only, the wall label **"Sealed"** (Isolation diagram → Wall label), 10px uppercase tracking 0.14em `text-fg-3`. Don't repeat it on every wall.
- **Agent chip:** pill, h-8, px-2.5, `border-line bg-panel-2`, `Orb size={18}` + text **Agent chip** with `{product}` filled ("Selixa agent, working in Atlas"), 12px `text-fg-2`, `truncate` (the container is ~250px wide, the text fits at 12px; the product name must never be cut, so if the Writer's string grows, the fallback is "Working in {product}"). One chip element per container, only the active one visible: it does **not** travel across walls; it leaves one container and appears in another. That is the message.
- **Blocked path** (end beat): a 1px dashed line (`border-t border-dashed border-brand-400/60`) from the right edge of Atlas's Memory row to the first wall, `transform-origin: left`, grows `scaleX(0→1)`; its end meets the lock badge, which does one `scale(1→1.12→1)` (300ms) and turns `text-brand-300`; a small ✕ (`X` 10px `text-brand-300`) sits at the line's end; the label **"Not shared"** (Blocked-path label) appears under the line, 11px `text-brand-200`, left-aligned to the line start. Line position: the Memory row's vertical centre, measured by layout (it's a fixed row height, so compute: header 22 + gap + 3.5 × 36 → Builder places it with the same grid, not by measuring at runtime).

#### Tablet (md–lg)

`grid-cols-2 gap-8` (2×2). Walls: only the vertical gap draws the double line + lock badge (one badge per row); the horizontal gap is plain space. Container height 280.

#### Phone (< md, 390px reference)

```
┌ 358 ─────────────────────────────┐
│ ┌─────────────┐ ‖ ┌─────────────┐│
│ │[A] Atlas  🔒│ 🔒│[B] Beacon 🔒││   171px each, gap 16
│ │ ▢ Meetings  │ ‖ │ ▢ Meetings  ││
│ │ ▢ Docs      │ ‖ │ ▢ Docs      ││
│ │ ▢ Decisions │ ‖ │ ▢ Decisions ││
│ │ ▢ Memory ┄┄┄┼✕  │ ▢ Memory    ││
│ │     (◉)     │   │             ││   agent token only
│ └─────────────┘   └─────────────┘│
│ ┌─────────────┐ ‖ ┌─────────────┐│
│ │[C] Cove  …  │ 🔒│[D] Drift …  ││
│ └─────────────┘   └─────────────┘│
│ Selixa agent, working in Atlas   │   live status line, 13px fg-2, centred
│ Agents work inside one product…  │   caption
└──────────────────────────────────┘
```

- `grid-cols-2 gap-x-4 gap-y-4`, containers h-[232px], p-3.5, content rows 30px with 14px icons and 12.5px labels.
- Walls: vertical double line + 24px lock badge in the column gap, one per row. "Sealed" label hidden on phone (the lock says it).
- The agent chip becomes a **token**: `Orb size={22}` centred in the slot, no text. The full agent string shows once, **under the grid** as a status line (13px `text-fg-2`, centred, height reserved), cross-fading when the active product changes. (Desktop doesn't need this line.)
- Blocked path: from Atlas's Memory row to the vertical wall (16px + half badge), then ✕ and the lock pulse; "Not shared" sits under the status line instead of under the path (no room), same beat.

#### Loop (`useSequence`, in view only)

| Step | ms | Frame |
|---|---|---|
| 0 | 1000 | **Beacon** active (lit layer, seal ring, chip/token, icons lit); others idle |
| 1 | 1000 | **Cove** active |
| 2 | 1000 | **Drift** active |
| 3 | 800 | **Atlas** active |
| 4 | 3200 | blocked path grows (400ms), lock pulses, ✕ and "Not shared" fade in; **hold** |

- Changing the active container: outgoing chip `opacity 1→0, translateY(0→4px)` 180ms and its lit layer/ring fade out (240ms); incoming chip `opacity 0→1, translateY(-4px→0)` 220ms, 120ms later; its icons light with 60ms stagger. Transform/opacity only.
- Leaving step 4 (loop restart): path, ✕ and label fade out (200ms) before Beacon lights.
- Loop ≈ 7s. **Still frame** (reduced motion, before JS, off-screen at SSR): step 4: Atlas active with the blocked path and "Not shared" visible.
- Accessibility: the diagram is `aria-hidden="true"`; an `sr-only` paragraph directly before it describes it (string needed from the Writer, §7). The phone status line is `aria-hidden` too (it changes every second; not for a live region).

### 3.2 Principle

- 96px under the caption (`mt-24`), max-w 1040 centred. No section header (the hero already titled the page).
- Desktop: `grid grid-cols-3 gap-10`. Each row: number `01`/`02`/`03` (`.eyebrow .num` style, 12px `text-fg-3`), then title (Principle → bold part, e.g. "Its own context.") 18px `text-fg` weight 500, then body (the rest of the line) 15px `text-fg-2` leading-[1.6], mt-2. A 1px `border-t border-line` above each row, pt-6.
- Phone: stacked, same row anatomy, gap 32.
- `data-reveal`, 60ms stagger. No icons.

### 3.3 Everything else (`HoldingNote`)

- mt-28, centred block, max-w 40rem, **no card or panel** (a card would make it look like a feature). Just type, set apart by a 1px `bg-ink/[0.1]` rule 64px wide above it (mb-10, centred).
- Headline (Everything else → Headline "more details soon."): Satoshi Light lowercase, `clamp(1.75rem,3vw,2.25rem)`, `tracking-[-0.035em]`, `text-fg`.
- Line + contact, one paragraph: line (16px `text-fg-2`, mt-4) ending in the email as a `mailto:` link (`text-fg underline underline-offset-4 decoration-ink/30 hover:decoration-brand-400`). The email shows only once the owner confirms it (copy TODO); until then the line ends with a link to `/contact` using the same styling, text = the Writer's fallback (§7).
- No list of pending topics, no "Coming soon" tags per topic, no dates.

**Later, when topics are confirmed** (so the Builder can leave room): each confirmed topic becomes a row in a `TrustTopics` list placed between Principle and the holding note: `grid-cols-[1fr_2fr]` rows with `border-t border-line py-8`: headline left (18px `text-fg`), one line right (16px `text-fg-2`). Phone: stacked. The holding note then names only what's still pending. Build the list component now but render it only when it has items.

### 3.4 CTA

`CTASection` with the page's CTA strings (needed, §7) and `ConversationCTA variant="site"`. The only primary action on the page.

---

## 4. Light and dark

- Containers `.window`; lit layer and seal ring use brand tokens; lock badges `bg-panel border-line`; wall lines `bg-ink/[0.1]`. No hex, no `white/` (white only on the brand-filled product chip).
- Idle containers in light scheme: check the four `.window`s don't read as heavy grey blocks; if so, drop idle container shadow (the `.window` shadow) under `:root[data-scheme="light"]` for this component only.
- The orb in the agent chip stays dark in both schemes (existing `.orb`).
- Works in the mono theme (no hard-coded crimson).

---

## 5. Shared components

| Component | Where | Props | Reused by |
|---|---|---|---|
| `IsolationDiagram` | `components/site/` | `products?: string[]` (default Atlas, Beacon, Cove, Drift), `contents: string[]`, `agentLabel: (product) => string`, `wallLabel`, `blockedLabel`, `compact?: boolean` | `/security` (full); `/integrations` §4.1 "how data flows" and the use-case "multi-product" variants can use `compact` (2 containers, no loop, still frame only) |
| `SealedContainer` | `components/site/` | `name`, `letter`, `active`, `rows`, `slot?: ReactNode` | `IsolationDiagram`; the agents hub `ContextBoundary` could adopt it later (same seal ring) |

The **seal ring** (1px brand ring at `inset-[-5px]`, radius +4 of the panel, opacity 0→1) should be one CSS class, `.seal-ring`, in `app/globals.css`, used here and by the `/get-started` BriefCard.

---

## 6. Acceptance checklist (Reviewer)

- [ ] Only the isolation principle, three principle rows and the holding note. No storage, encryption, retention, subprocessor or certification claims anywhere, including metadata and JSON-LD.
- [ ] Diagram: four sealed containers, lock badges on the walls, "Sealed" once; the agent appears inside one container at a time and never visibly crosses a wall; final beat shows the dashed path stopping at the wall with "Not shared".
- [ ] Still frame (reduced motion / no JS) = Atlas active + blocked path + "Not shared".
- [ ] Loop only runs in view; transform/opacity only (no dash-offset, no width animation: the path grows by `scaleX`).
- [ ] 1440×900: headline, line and diagram in one screen. Tablet 2×2. Phone 390: 2×2 containers, token-only agent, status line under the grid, nothing overflows horizontally.
- [ ] Holding note: plain type, no card; email link only if confirmed, else a link to `/contact`.
- [ ] Screen reader: sr-only description before the diagram; principles and holding note read normally.
- [ ] Ends with `CTASection` (site CTA), the only primary action.
- [ ] Light and dark checked, mono theme fine; Satoshi Light headlines, nothing above 500.

---

## 7. Strings the copy sheet still needs (Writer)

| Slot | Where |
|---|---|
| Diagram sr-only description | before the diagram (one or two sentences: four products, each sealed with its own meetings, docs, decisions and memory; the agent works inside one at a time; nothing is shared) |
| CTA headline and line | `CTASection` |
| Holding-note fallback link text | used until the email is confirmed (e.g. "Get in touch") |
| Short agent label (fallback) | "Working in {product}", only if the full chip label grows past ~32 characters |

---

## 8. Open decisions for the user

1. **Security facts** (§11 Q2–Q3): storage/region, encryption, meeting consent, retention/deletion, access, subprocessors (incl. AI model providers and whether data trains models), certifications, how to report an issue. Each confirmed item becomes one `TrustTopics` row.
2. **Contact address for security questions:** confirm hello@selixa.ai or supply security@.
