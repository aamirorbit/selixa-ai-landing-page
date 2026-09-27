# `/integrations/[slug]`: one template, eleven faces (design spec)

Plan: `docs/SITE_PLAN.md` §4.2. Copy: `docs/pages/integrations-template.copy.md`. Data: `lib/content/integrations.ts` (`Integration`, `DemoScript`), marks from `components/landing/logos.ts` (join by `name`), agents from `lib/content/agents.ts`.
Reuses: **`PageHero`, `RelatedCards`, `CTASection`** (agents-hub §5), **`IntegrationTile`, `useInquiry`** (integrations-hub §5). New shared pieces in §5.

Route: `app/integrations/[slug]/page.tsx`, `generateStaticParams` from `INTEGRATIONS`, `const { slug } = await params`, `notFound()` for unknown slugs, `generateMetadata` from the copy sheet pattern.

---

## 1. Concept

**Each page is lit by the tool's own brand colour, in the hero only.** The top of the page wears a soft wash of Slack blue, Linear indigo, Zoom blue; the tool's mark and the Selixa orb sit side by side with two lanes of traffic between them. Scroll past the hero and it's plain Selixa again: the tool colour never leaks into cards, buttons, demos or the CTA. The contrast is the idea: *your tool, then Selixa's way of working with it.*

Why it differs from other pages: it's the only template whose hero colour isn't Selixa's. The eleven pages share a skeleton but each looks like it belongs to its tool, and the one bespoke element per page is a small demo in the tool's native shape (thread, doc, issue, call, chart).

---

## 2. Page structure

Shell as the agents hub (`Nav`, `main.overflow-x-clip`, 1280 container, `Footer`, `ScrollReveal`).

| # | Section | Component | Motion |
|---|---|---|---|
| 1 | Hero | `PageHero` + `ToolWash` + `ToolConnector` (shared, new) | load reveal; lane packets loop |
| 2 | Reads / writes | `FlowColumns` (page-local) | reveal |
| 3 | Demo | `IntegrationDemo` → one of 5 demos (shared, new) | in-view loop, holds 3s |
| 4 | Permissions | `PermissionsPanel` (page-local) | reveal |
| 5 | Setup | `SetupSteps` (page-local) | reveal |
| 6 | Related agents | `RelatedCards variant="compact"` | reveal |
| 7 | CTA | `CTASection` | reveal |

Order follows the copy sheet (Hero, Flow, Demo, Permissions, Setup, Related, CTA). Eyebrows: `01 Flow`, `02 In {name}`, `03 Permissions`, `04 Setup`, `05 Related`. Anchors `#flow`, `#demo`, `#permissions`, `#setup`.

---

## 3. Sections

### 3.1 Hero

`PageHero align="center"` (not `fill`), `rings` **off** (the wash replaces them), wrapped in `ToolWash` (§5.1). Top padding `pt-16 sm:pt-24`, bottom `pb-20 sm:pb-28`.

- **Breadcrumb eyebrow**: the `.pill` reads **Hero.eyebrow** "Integrations · {category}" where "Integrations" is a link to `/integrations` (`hover:text-fg`, underline on focus-visible) and "· {category}" is `text-fg-3`. No live-dot on this page.
- **Visual first, then headline** (this page only; set `visual` above the H1 via a `visualPosition="top"` prop on `PageHero`): the connector reads as the page's subject, the headline as its caption.
- **`ToolConnector`** (§5.2): tool tile ↔ orb, with **Hero.connectorLabel** "{name} ↔ Selixa" under it (13px `text-fg-3`, 14px gap).
- H1 **Hero.headline**: `job` with first letter lowercased ("threads and decisions."). Standard `PageHero` H1 size; always one line at ≥ md (jobs are ≤ 27 chars).
- Line **Hero.line**.
- Reveal delays: pill 60 · connector 140 · H1 220 · line 300. Packets start after 700ms.

Desktop (1440×900): pill ~150, connector 190–290, label 310, H1 360–450, line 480. Hero ends ~ 600. Phone (390): connector scales down (§5.2), H1 wraps to 2 lines max.

### 3.2 What flows in / what comes back (`#flow`)

No `SectionHeader` headline (the copy has none; the two column headings do the job). Just the eyebrow `01 Flow` (`.eyebrow`, centred, `data-reveal`) 40px above the columns. Section padding `py-20 sm:py-28`.

Desktop (≥ md): `grid grid-cols-[1fr_auto_1fr] gap-6 items-stretch`, max-w 960 centred.

```
┌─ ↙ What Selixa reads ──────────┐          ┌─ ↗ What comes back ────────────┐
│ ─────────────────────────────  │   (orb)  │ ─────────────────────────────  │
│ Channels you choose            │  ──▸──   │ Meeting recaps                 │
│ Threads and replies            │  ──◂──   │ Answers in the thread          │
│ Decisions made in chat         │          │ Nudges on blocked work         │
└────────────────────────────────┘          └────────────────────────────────┘
```

- Each column: `.card` radius 20, p-7. Heading row: 32px icon tile (`border-line bg-ink/[0.03]`, radius 10) with lucide `ArrowDownLeft` (reads) / `ArrowUpRight` (writes), 16px `text-brand-300`; then **Flow.leftHeading** / **Flow.rightHeading**, 15px `text-fg` weight 500. Items: `reads` / `writes` from data, each a row `border-t border-line py-3.5`, 15px `text-fg-2`, first row has `mt-5`. Rows are text only (no per-row icons or marks).
- Centre spine (`auto`, 72px wide): `Orb size={40}` vertically centred, with two 1px lanes (`bg-ink/[0.12]`) running from each card edge into the orb, chevrons pointing inward on the left (reads come in) and outward on the right (writes go out). Static. It echoes the hero connector without repeating its motion.
- Columns are equal height (`items-stretch`); 3 vs 2 items leaves the shorter column with empty space at the bottom, which is fine.
- **Read-only guard**: if `writes` is ever empty, the right card shows one row in `text-fg-3`: "Read-only. Selixa doesn't write to {name}." (Writer to confirm the string; no tool is read-only today.)
- Phone: stacked, reads first; the spine becomes a 40px-tall vertical join between the cards with a 28px orb.
- Reveal: left 0, spine 80, right 160.

### 3.3 Demo (`#demo`)

`SectionHeader num="02" label="In {name}" align="center"` + **Demo.headline** ("see it in {name}."). Demo 48px below, centred, `w-full max-w-[680px]`.

`<IntegrationDemo integration={i} />` switches on `demoScript.kind` (§5.3). Every demo:
- lives in `DemoWindow`: `.window` radius 18; `WindowBar` holding the tool mark **lit** at 14px and the place/title text (`text-fg-3`, 13px, truncate). The mark is identification, not tint; it's the only tool colour below the hero.
- has a **fixed body height** at each breakpoint (listed per demo) so nothing reflows between steps: every element is in the DOM from the start and steps toggle `opacity`/`transform` (`Stage`, `.st`, `Typed`).
- is driven by `useSequence(SCRIPT)`: plays only while in view, loops, holds the final frame 3000ms. Reduced motion and before JS: the final frame (reply sent, section written, issue created, recap sent, annotation shown).
- speaks as Selixa with `Orb` avatars (sizes per demo) and the name **Demo.selixaName**.
- has an `sr-only` transcript of the final frame; the visual body is `aria-hidden`.

Beat tables below list the step durations (ms) in order; the last one is the hold.

### 3.4 Permissions and data (`#permissions`)

`SectionHeader num="03" label="Permissions" align="center"` + **Permissions.headline** ("permissions and data.").

**Until `permissions` is supplied (all tools today):** a single `.window` panel, max-w 720 centred, radius 20, p-8 (phone p-6):
- Left: 44px icon tile (`border-brand-400/30 bg-brand-500/10 text-brand-300`, radius 12) with lucide `Lock` 18px.
- Right: **Permissions.line** (17px `text-fg`, "Everything {name} shares goes into one product's context. No other product can see it.") → **Permissions.smallPrint** (14px `text-fg-3`, mt-2) → **Permissions.link** "Questions? Talk to us →" as `.link-arrow` button, mt-5: `openInquiry({ defaults: { problem: "Question about the {name} integration: " }, focus: "problem" })`.
- Phone: icon tile above the text.
- **Dev-only marker**: when `process.env.NODE_ENV !== "production"`, render under the panel a dashed box (`border border-dashed border-line-strong rounded-[14px] p-4 text-[0.8125rem] text-fg-3 font-mono`) listing `TODO(owner): permissions for {slug}: access requested · storage · retention · disconnect`. Never in production builds.

**Once `permissions` exists** (shape for the Writer/owner to fill later; propose in `integrations.ts`):

```ts
permissions: {
  access: string[];      // scopes in plain words
  storage: string;       // where it lives (inside that product's isolated context)
  retention?: string;
  disconnect: string;
} | null;
```

Layout then: same panel, three rows (`border-t border-line py-4`, label 11px uppercase `text-fg-3` w-40 left, value 15px `text-fg-2`): Access (bulleted), Stored, Retention (if present), Disconnect. The isolation line stays as the panel's first sentence.

### 3.5 Setup (`#setup`)

`SectionHeader num="04" label="Setup" align="center"` + **Setup.headline** ("set up in 3 steps."). Steps 48px below, max-w 960.

- Desktop (≥ md): `grid grid-cols-3 gap-3`. Each step `.card` radius 16, p-6, min-h 148: number badge (28px circle, `border border-line-strong text-[0.8125rem] text-fg-2 tabular-nums`, "1"/"2"/"3") → step text (`setup[i]`, 16px `text-fg`, `text-pretty`, mt-6).
- Step 1 badge area also shows the mini pair "tool mark (16px, lit) → orb (16px)" to the right of the number, joined by a 16px 1px line, as a tiny echo of the hero. Steps 2–3 have none.
- Between cards (desktop only): a 12px `ChevronRight` `text-fg-3` centred in the gap, absolutely positioned so it takes no layout.
- Phone: vertical list; cards full width with a 1px `bg-ink/[0.1]` rail joining the number badges (left 20px + 14px), chevrons hidden.
- Reveal stagger 80ms. No demo: setup is honest and plain (open decision 3).

### 3.6 Related agents

`SectionHeader num="05" label="Related"` + **Related.headline** ("related agents."), left aligned.
- `RelatedCards variant="compact"` with `agents` (2 or 3) → items `{ href: "/agents/{slug}", title: name, body: line, icon: agent icon, linkText: Related.cardLink }`. Grid: 3 items → `md:grid-cols-3`; 2 items → `md:grid-cols-2 max-w-[760px]`.
- Under the cards (mt-8): **Related.allLink** "All integrations →" as `.link-arrow` to `/integrations`.

### 3.7 CTA

`<CTASection title={CTA.headline} line={CTA.line /* "Connect {name} to your product." */} />`.

---

## 4. The five demos (exact)

All widths refer to the 680px window; phone = 358px. Text sizes are Inter. People and products come from `demoScript` (sample names only).

### 4.1 `thread` (Slack, Intercom)

Body: desktop 300px, phone 360px. `px-5 py-4`, rows stacked from the top, `gap-4`.

- **Message row** × `messages.length` (1–2): 32px `Avatar name={from}`; for `from === "Customer"` use a neutral avatar with lucide `User` 14px. Right: name 13.5px `text-fg` weight 500 · text 14.5px `text-fg-2` leading 1.5.
- **Selixa row**: `Orb size={32}`; name "Selixa" + optional `replyTag` as `.tag` (Intercom: "Internal note", with lucide `StickyNote` 12px) on the same line; text = `Typed text={reply} cps={70}`.
  - Intercom-style note (when `replyTag` is set): the whole Selixa row sits in `rounded-[12px] bg-ink/[0.035] border border-line p-3`, left inner edge `2px` brand-400/50 bar (pseudo-element). Slack-style (no tag): plain row, a thread-reply indent of 12px and a 1px `bg-ink/[0.1]` thread line on the left from the last message.
- **Typing indicator** before the reply: `.thinking` next to the Orb in the reply row's text slot (reply text is invisible underneath, reserving its height).
- **Sent tick** after typing: `Check` 12px `text-brand-300` after the name line, `opacity` in.

| Step | ms | Frame |
|---|---|---|
| 0 | 250 | reset: rows hidden (`Stage on=false`) |
| 1 | 380 | message 1 in |
| 2 | 380 | message 2 in (skip = 0ms if only one message) |
| 3 | 650 | Selixa row in, `.thinking` |
| 4 | `reply.length / 70 × 1000 + 250` (≈1.8s) | reply types |
| 5 | 250 | sent tick |
| 6 | 3000 | hold |

### 4.2 `doc` (Notion, Google Drive)

Body: desktop 320, phone 380. A document page: `px-8 pt-7` (phone `px-5 pt-5`), `bg-panel` (lighter than the window gradient: this is paper).

- `title`: 22px `text-fg` weight 500, `tracking-[-0.02em]`.
- `existing` lines: 15px `text-fg-2`, mt-3; then two static skeleton bars (`h-2 rounded-full bg-ink/[0.06]`, 92% and 64% wide, mt-3/mt-2) standing for the rest of the page.
- **Selixa's section** (mt-6), with a 2px brand bar on its left (`bg-brand-400/70`, `left:-12px`, full section height) that reveals with `transform: scaleY(0 → 1)`, origin top, 420ms:
  - heading: `Typed text={section.heading} cps={45}`, 16px `text-fg` weight 500;
  - lines: `section.lines`, each 14.5px `text-fg-2` with an 6px `bg-ink/30` bullet dot, `Stage` in one by one;
  - byline: `Orb size={16}` + `byline` 12px `text-fg-3`, mt-3.
- A `.caret` rides at the end of the last visible line while writing (placed in the active element), gone at hold.

| Step | ms | Frame |
|---|---|---|
| 0 | 250 | reset: section hidden |
| 1 | 400 | brand bar scales in, caret at end of `existing` |
| 2 | `heading.length / 45 × 1000 + 150` | heading types |
| 3–5 | 320 each | lines 1–3 in (per line count) |
| 6 | 300 | byline in, caret gone |
| 7 | 3000 | hold |

### 4.3 `issue` (Linear, Jira, GitHub)

Body: desktop 320, phone 400. Two parts joined by a line, `px-6 py-5`.

- **From a decision** (top): label **Demo.issueFromLabel** "From a decision" 11px uppercase `tracking-[0.12em] text-fg-3`; card `rounded-[12px] border border-line bg-ink/[0.025] px-4 py-3`: lucide `Video` 14px `text-fg-3` + `decision` 14px `text-fg`, one line (`truncate` on phone, 2 lines allowed there).
- **Join**: 1px × 20px vertical line `bg-brand-400/60`, centred-left (x = 28px), `scaleY(0 → 1)` origin top, 300ms.
- **Issue card**: `rounded-[14px] border border-line-strong bg-panel p-4` with the `.is-live` glow while being created (removed at hold):
  - row 1: `key` 12px `text-fg-3 tabular-nums` + a 14px status circle (Linear-style ring, `border-[1.5px] border-fg-3` round; neutral in every tool, no tool colour);
  - `title` 16px `text-fg` weight 500 via `Typed cps={60}`;
  - `fields` (3) as a 2-col grid `grid-cols-[88px_1fr] gap-y-2 mt-3`: label 12px `text-fg-3`, value 13.5px `text-fg-2`; if the label is "Assignee", prefix the value with a 20px `Avatar`.
  - footer strip `border-t border-line mt-3 pt-3`: `Check` 14px `text-brand-300` + `footer` 13px `text-fg-2`.

| Step | ms | Frame |
|---|---|---|
| 0 | 250 | reset |
| 1 | 380 | decision card in |
| 2 | 300 | join line grows |
| 3 | 280 | issue card in (empty title), `.is-live` |
| 4 | `title.length / 60 × 1000 + 150` | title types |
| 5–7 | 200 each | fields 1–3 in |
| 8 | 350 | footer in, `.is-live` off |
| 9 | 3000 | hold |

### 4.4 `call` (Zoom, Google Meet)

Body: desktop 380, phone 440. `p-4`.

- **Tiles**: `grid grid-cols-2 gap-2` (phone the same, tiles smaller), each tile `aspect-[16/10] rounded-[12px] bg-well border border-line`, content centred: 40px `Avatar` (phone 32), name bottom-left 12px `text-fg-2` in a `bg-ink/[0.06]` pill. Tiles 1–3 = `participants`; tile 4 = Selixa.
- **Selixa tile**: before joining, a dashed-border empty tile (`border-dashed border-line-strong`, no content). Joined: `Orb size={44}` (phone 36), name "Selixa", and under the orb the **status line**: all `statuses` stacked in one grid cell, current one at `opacity:1`, 11px `text-fg-3`, "Listening" gets a `live-dot` before it.
- **Speaking**: the speaking participant's tile shows the existing `.eq` bars next to their name and gets a 1px `border-ink/25` ring. Speaker rotates Maya → Dev → Sara with the steps (not tool-coloured).
- **Captured** row under the grid (mt-3): `captured` chips as `.tag`, each landing with `Check` 12px and the brand tint (`border-brand-400/30 bg-brand-500/10 text-brand-200`).
- **Footer** (mt-2): lucide `Send` 13px `text-fg-3` + `footer` 13px `text-fg-2`.
- Consent: the demo makes no claim about how Selixa announces itself (plan §11.2). Selixa's tile is visibly labelled "Selixa", which is honest either way.

| Step | ms | Frame |
|---|---|---|
| 0 | 250 | reset: Selixa tile empty, chips/footer hidden, Maya speaking |
| 1 | 600 | Selixa joins: tile content in, status "Joining" |
| 2 | 500 | status "Listening" |
| 3 | 550 | Dev speaking, chip 1 lands |
| 4 | 550 | Sara speaking, chip 2 lands |
| 5 | 550 | Maya speaking, chip 3 lands |
| 6 | 700 | nobody speaking, status "Writing recap" |
| 7 | 350 | footer in |
| 8 | 3000 | hold |

### 4.5 `chart` (PostHog, Mixpanel)

Body: desktop 340, phone 460. `px-6 pt-5`. Uses the shared `ChartLine` (§5.4).

- **Header row**: `metric` 13px `text-fg-3`; right, `change` as `.tag` with the brand tint and lucide `TrendingDown` 12px.
- **Chart**: `ChartLine` 632×180 (phone 326×150), fixed illustrative series (24 points, gently rising, then a drop of ~8% starting at index 15, flat after; same series on both tools). 3 horizontal gridlines `stroke: rgb(var(--ink-rgb)/0.07)`. Line 1.5px `text-fg-2` (`currentColor`); the segment from the marker onward 2px `brand-400`. End dot 5px brand.
- **Marker**: at index 15, a vertical 1px dashed line (`stroke: rgb(var(--ink-rgb)/0.25)`, `stroke-dasharray: 3 4`, static) full chart height, and a label chip `marker` (11px `.tag`) at its top.
- **Dip ring**: 14px ring (`border-brand-400/60`) around the lowest point after the marker; scales `0.6 → 1`, opacity in, 300ms.
- **Annotation card** (desktop): `.card` 250px wide, p-3.5, positioned right of the dip, under the line, with a 1px leader (`bg-ink/25`) from the ring to the card's top-left corner (drawn as a rotated div, static). Heading **Demo.chartAnnotationHeading**: `Orb size={16}` + "Selixa" 12px `text-fg` weight 500; `annotation` 13.5px `text-fg-2` leading 1.45; `sources` as small `.tag`s (11px) in a wrapping row, mt-2.
- Phone: card below the chart, full width, no leader; ring stays.
- **Line reveal without stroke animation**: the whole line group is covered by a rect in the body's own background (`fill: var(--color-panel)`) that moves off with `transform: translateX(0 → 101%)` in 900ms `ease-out-expo`. Transform only; no dash-offset. The gridlines sit above the cover so they're always visible.

| Step | ms | Frame |
|---|---|---|
| 0 | 200 | reset: cover over the line, marker/ring/card hidden |
| 1 | 950 | cover slides off: the line draws left to right |
| 2 | 300 | change chip in |
| 3 | 350 | marker + label in |
| 4 | 400 | dip ring in |
| 5 | 400 | annotation card in (`Stage`) |
| 6 | 200 × sources | source chips in |
| 7 | 3000 | hold |

---

## 5. New shared components (`components/site/`)

### 5.1 `ToolWash` and the tool-look table

Presentation data, not content, so it lives beside the components: `components/site/integrations/look.ts`.

```ts
type ToolLook = {
  rgb: string | "ink";        // wash colour as "r g b" channels, or "ink" for near-black brands
  aDark: number;              // wash alpha in the dark scheme
  aLight: number;             // wash alpha in the light scheme
  inverseOnLight?: boolean;   // lit mark needs a dark tile in light (too light to read on white)
};
export const TOOL_LOOK: Record<IntegrationSlug, ToolLook>;
```

| slug | rgb | aDark | aLight | notes |
|---|---|---|---|---|
| slack | `54 197 240` (Slack blue) | 0.22 | 0.14 | multicolour mark; wash picks its blue (open decision 1) |
| notion | `ink` | 0.10 | 0.06 | near-black brand |
| google-drive | `66 133 244` | 0.24 | 0.13 | |
| linear | `94 106 210` | 0.30 | 0.14 | |
| jira | `0 82 204` | 0.34 | 0.13 | deep blue needs more alpha on #050505 |
| github | `ink` | 0.10 | 0.06 | near-black brand |
| zoom | `11 92 255` | 0.30 | 0.13 | |
| google-meet | `0 137 123` | 0.30 | 0.14 | |
| intercom | `106 253 239` | 0.16 | 0.18 | `inverseOnLight: true` |
| posthog | `ink` | 0.10 | 0.06 | mark uses `--color-fg`; see open decision 2 |
| mixpanel | `120 86 255` | 0.26 | 0.13 | |

`<ToolWash look={TOOL_LOOK[slug]}>children</ToolWash>` renders a `relative isolate` wrapper with inline vars `--tool-rgb` (the channels, or `var(--ink-rgb)` for `ink`), `--tool-a-dark`, `--tool-a-light`, and a decorative, `aria-hidden`, `pointer-events-none` background layer (`absolute inset-x-0 -top-[4.5rem] bottom-0 -z-10`, so it runs up under the nav):

```css
.tool-wash { --tool-a: var(--tool-a-dark); }
:root[data-scheme="light"] .tool-wash { --tool-a: var(--tool-a-light); }
@media (prefers-color-scheme: light) { :root:not([data-scheme="dark"]) .tool-wash { --tool-a: var(--tool-a-light); } }

.tool-wash-layer {
  background:
    radial-gradient(60% 55% at 50% 22%, rgb(var(--tool-rgb) / var(--tool-a)), transparent 70%),
    radial-gradient(38% 30% at 50% 30%, rgb(var(--tool-rgb) / calc(var(--tool-a) * 0.6)), transparent 70%);
  mask-image: linear-gradient(180deg, #000 55%, transparent 100%); /* mask alpha; fades into the page */
}
```

- **Near-black (`ink`) tools** (Notion, GitHub, PostHog): the wash becomes a neutral spotlight: white-ish haze in dark, soft grey in light, both from `--ink-rgb`, so it never paints a black blob on a black page or a grey smear that reads as dirt on white. Their mark tile uses `bg-panel-2 border-line-strong` so the `--color-fg` mark (white in dark, near-black in light) always has contrast. Verified combos to check: Notion/GitHub/PostHog × dark/light.
- The wash is static (no animation), painted once. No `backdrop-filter`, no `filter`.
- **Tool colour appears only inside `ToolWash`** (wash, the mark tile's rim/glow, the reads lane packet). Everything below uses Selixa tokens. The only exception is the 14px lit mark in a demo window bar and the 16px mark in setup step 1 (identification, not tint).

### 5.2 `ToolConnector`

`<ToolConnector logo={BrandLogo} look={ToolLook} label={string} />`

```
   ┌────────┐                              ╭──────╮
   │  mark  │  ─ • ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ▸   │ ORB  │
   │  lit   │  ◂ ─ ─ ─ ─ ─ ─ ─ ─ ─ • ─ ─   ╰──────╯
   └────────┘
            Slack ↔ Selixa
```

- Tool tile 96px (phone 72), radius 24 (phone 20), `border` + background: coloured tools `border-[rgb(var(--tool-rgb)/0.35)] bg-panel` with `box-shadow: 0 20px 60px -24px rgb(var(--tool-rgb)/0.7), inset 0 1px 0 rgb(var(--ink-rgb)/0.06)`; `ink` tools `bg-panel-2 border-line-strong` with the same shadow built from `--ink-rgb` at 0.25. Mark 48px (phone 36), `BrandMark lit`. `inverseOnLight` tools in light: tile `bg-fg border-transparent`.
- Orb: `Orb size={96}` (phone 72).
- Lanes: width 200 (md 160, phone 96), two 1px lines 10px apart, centred vertically between tile and orb, `bg-ink/[0.14]`; chevron heads (8px) pointing right on the top lane, left on the bottom.
- Packets: 6px dots. Top lane (reads, tool → orb) in `rgb(var(--tool-rgb))` (for `ink`, `var(--color-fg)`), bottom lane (writes, orb → tool) in `brand-400`, each with a 10px soft glow in its own colour. CSS keyframes on `transform: translateX()` across the lane width (a lane-width wrapper; the dot moves 0 → 100% of it), opacity 0 → 1 → 1 → 0 at 0/12/88/100%. 2.2s linear infinite; bottom lane delayed 1.1s. Paused (`animation-play-state`) until the hero reveal ends and whenever the hero is out of view (IntersectionObserver sets `data-inview`).
- Label under the whole group: **Hero.connectorLabel**, 13px `text-fg-3`.
- Reduced motion / before JS: packets hidden, chevrons carry the direction.
- `aria-hidden` on the graphic; the label is real text.
- Reuse: the Meeting and Execution agent pages' "works with" rows can reuse it with smaller sizes.

### 5.3 Demos: `DemoWindow` + `ThreadDemo`, `DocDemo`, `IssueDemo`, `CallDemo`, `ChartDemo`

In `components/site/demos/`. Each takes its script type from `lib/content/integrations.ts` (`ThreadScript`, …) plus `logo` for the window bar, and owns its `useSequence`. `IntegrationDemo` is the switch. The Meeting Agent page can reuse `CallDemo`, the Analyst page `ChartDemo`, the Product page `DocDemo`, Execution `IssueDemo`, all with their own scripts.

`DemoWindow` props: `{ logo?: BrandLogo; place: string; heights: { base: number; md: number }; children }`. Fixed body height via `h-[var(--h)] md:h-[var(--h-md)]`.

### 5.4 `ChartLine`

`<ChartLine points={number[]} width height marker?={{ index, label }} highlightFrom?={number} reveal={boolean /* cover slid off */} ring={boolean} still />`: SVG with `viewBox` in chart units, `preserveAspectRatio="none"` for the line group only (text/labels are HTML overlays positioned by percentage, so they don't stretch). `vector-effect: non-scaling-stroke` on strokes. Returns the dip point's percentage position so the annotation card and ring can be placed. Listed in plan §9; the Analyst Agent page extends it with scroll-attached annotations.

---

## 6. Light and dark

- Wash alpha per scheme from the table; check each of the 11 heroes in both schemes (22 screenshots). Coloured washes should read as "a hint of the brand", never as a coloured block: if any wash is still strong on white, lower its `aLight` only.
- Near-black tools: neutral spotlight + `bg-panel-2` tile (see §5.1). The lit mark flips via `--color-fg`.
- Intercom in light: inverse tile (`bg-fg`) so the cyan mark reads. Its wash stays cyan at 0.18.
- Mixpanel's wash is violet. It's the tool's colour in its own hero, not Selixa's accent (the user's "no purple" rule is about Selixa's theme). Everything below its hero is Selixa crimson/mono.
- Orb stays dark in both schemes. Demo windows use `.window` (panel token) and flip automatically; the doc demo's paper is `bg-panel`.
- No `white/` utilities; the only literal colours are the wash channel values in `look.ts` (not dark UI hex) and mask alphas.

---

## 7. Acceptance checklist (Reviewer)

- [ ] All 11 slugs build statically; unknown slug → 404; titles/descriptions per the copy pattern.
- [ ] Hero: tool colour wash visible behind the connector, fading out before the Flow section; **no tool colour below the hero** except the tiny marks in the demo bar and setup step 1.
- [ ] Notion, GitHub, PostHog: neutral spotlight, mark tile readable, in dark **and** light. Intercom readable in light (inverse tile). Jira/Zoom washes visible in dark.
- [ ] Connector: reads packet in tool colour flows tool → orb, writes packet in brand colour flows back; packets pause off-screen; static chevrons in reduced motion.
- [ ] Headline is `job` with a lowercase first letter; one line at ≥ md.
- [ ] Reads/writes: two equal-height columns with the orb spine (desktop), stacked on phone.
- [ ] Each demo kind plays its beat table while in view, holds ~3s, loops; body height never changes between steps; final frame shown with reduced motion and before JS. Check one tool per kind: Slack (thread), Intercom (thread with Internal note), Notion (doc), Linear (issue), GitHub (issue, "#142"), Zoom (call), PostHog (chart).
- [ ] Chart line reveals by a sliding cover (transform), not stroke-dashoffset.
- [ ] Permissions: isolation line + "coming soon" small print + "Talk to us" opens the form with the problem prefilled; **no** scopes/regions/retention claims; the dev-only TODO box is absent in `next build` output.
- [ ] Setup: three numbered steps from data; phone vertical rail.
- [ ] Related: 2–3 agent cards to `/agents/{slug}`, plus "All integrations →".
- [ ] Ends with `CTASection`; one primary action; no status tag anywhere.
- [ ] Phone 390: connector 72/96/72, demo bodies at their phone heights, nothing overflows horizontally.
- [ ] Only `transform`/`opacity` animate; nothing scroll-driven on this page.

---

## 8. Open decisions

1. **Slack's wash colour.** Slack's mark is four colours; the table uses its blue. Alternatives: aubergine (reads as near-black, would use the `ink` treatment) or a two-stop blue→yellow wash.
2. **PostHog's colour.** `logos.ts` lights PostHog in the text colour, so it's treated as near-black. PostHog's logo also has blue/orange/yellow; say if you want a coloured wash (orange would sit close to crimson).
3. **Setup has no demo.** Kept static and honest until the real connect flow is confirmed (copy TODO). If it's confirmed, step 1 could show the real OAuth moment.
4. **Headline source.** Google Meet and Zoom share the headline "calls into decisions."; PostHog and Mixpanel share "numbers with a cause." Fine for a template, but if you want every page unique, the Writer needs four new `job`s.
