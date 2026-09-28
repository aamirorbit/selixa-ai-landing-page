# Selixa — site plan

Every page beyond the home page: what it's for, how it's laid out, and the one idea that makes it feel different from the rest. Written to build from, in order.

The home page (`/`) already exists and sets the rules below. This plan extends them; it doesn't restart them.

---

## 1. Rules every page follows

These come from decisions already made on the home page. Break one only on purpose.

**Positioning**
- Selixa is an **AI Product Manager**. Headline promise: *stop building in chaos* (lowercase, as on the home page).
- Selixa supports many products, but **each product has its own, isolated context**. Never say "one brain" or imply memory is shared across products.
- **No real product names** from the brief anywhere on the site. Mock-ups use the sample products *Atlas, Beacon, Cove, Drift*.
- **Nothing invented presented as real**: no made-up testimonials, customer logos, user counts, certifications or pricing. Where a page needs one of these, it's listed under *Open questions* and stays out until you supply it.

**Look and feel**
- Show, don't explain. Each page carries **one signature "video"**: scripted, looping product UI (`useSequence` + `Stage` / `Typed` / `Count`). Text is a headline plus at most one short line per section.
- Crimson accent, light and dark schemes from the tokens in `app/globals.css`. Use `bg-panel`, `bg-well`, `bg-ink/[x]`, `border-line`. Never hard-code dark hex values or `white/` utilities, or light mode breaks.
- Satoshi Light for page headlines; Inter for everything else; no bold (500 max).
- The Selixa orb is the recurring brand object. It stays dark in both schemes.

**Motion and performance** (Lenis smooth scroll is on site-wide)
- Animate only `opacity` and `transform` while the page scrolls. Never animate width, height, padding, top/left or radius during scroll, and no `backdrop-filter`. Both caused the jank we removed from the header.
- Demos play only while on screen, and render their finished frame for reduced motion and before JavaScript loads.
- Scroll-driven sections (scrubbed by scroll position) use `position: sticky` plus transforms, and must still read correctly as a static page.

**Every page ends with the website CTA**: *Enter your product's website* → opens the form pre-filled (`ConversationCTA variant="site"`). Keep one primary action per page.

---

## 2. Sitemap

| Route | Page | Template or bespoke | Status |
|---|---|---|---|
| `/` | Home | Bespoke | Built |
| `/product` | Product hub (all six areas) | Bespoke | Planned |
| `/product/meetings` | Meetings | Bespoke | Planned |
| `/product/research` | Research | Bespoke | Planned |
| `/product/analytics` | Analytics | Bespoke | Planned |
| `/product/priorities` | Priorities | Bespoke | Planned |
| `/product/roadmap` | Roadmap | Bespoke | Planned |
| `/product/tasks` | Tasks | Bespoke | Planned |
| `/integrations` | Integrations directory | Bespoke | Planned |
| `/integrations/[slug]` | One per tool (11) | Template, brand-tinted | Planned |
| `/use-cases` | Use cases | Bespoke | Planned |
| `/use-cases/[slug]` | One per audience (12) | Template, 3 variants | Planned |
| `/get-started` | Onboarding | Bespoke | Planned |
| `/blog` | Blog index | Bespoke | Placeholder exists |
| `/blog/[slug]` | Post | Template | Planned |
| `/security` | Trust centre | Bespoke | Planned, needs facts |
| `/about` | Manifesto | Bespoke | Planned |
| `/changelog` | What's new | Template list | Planned |
| `/privacy`, `/terms` | Legal | Plain document | Needed before launch |
| `/404` | Not found | Bespoke | Planned |

Header stays **Product · Integrations · Use cases · Blog** (the Product menu was "Agents" until Sep 2026; see `docs/archive/agents-framing.md`). The mega-menu items link to these pages instead of home-page anchors once the pages exist. The footer gains Company (About, Security, Changelog, Contact) and Legal.

Why the 7 agent pages are bespoke but integrations and use cases are templates: there are only six agents and each is a different *kind* of work, so each earns its own interface metaphor. There are 11 integrations and 12 use cases, which are the same *kind* of page repeated, so a strong template (varied by brand colour or persona) reads better than 23 one-offs and is far easier to keep current.

---

## 3. Agents

### 3.1 `/agents`: the relay

**Job:** show that six specialists share one product's context and hand work to each other.

**Signature idea: one piece of work travels the whole team.** A single card ("Onboarding is losing people") moves across the page from agent to agent. Each one adds something, and it arrives as a shipped task.

**Layout**
1. **Hero:** "your product team, in AI." Six agent tiles in an arc around the orb; a thin crimson line connects them in hand-off order.
2. **The relay (sticky, scroll-scrubbed):** the page pins while you scroll. The work card travels left to right across six stations. At each stop the agent's contribution stacks onto the card: *Meeting* adds a decision, *Research* adds 3 competitor examples, *Analyst* adds the −8% chart, *Product* adds a recommendation, *Roadmap* moves it to "Now", *Execution* splits it into 14 tasks. It unpins when the card is done.
3. **Agent index:** six large cards (icon, one line, "what it produces"), each linking to its page. Hovering one lights its station in the relay line above.
4. **"One product's context":** a small diagram of all six agents inside one product boundary (the 🔒 *Isolated* motif from the home page), with a second product greyed beside it: same team, separate memory.
5. CTA.

**Motion:** the relay is the only scroll-scrubbed element; everything else fades in.

### 3.2 `/agents/meeting`: the live call

**Signature idea: the page is a meeting, and scrolling is the meeting happening.**

1. **Hero:** full-bleed call window. Four participant tiles, one of them Selixa (orb, "Listening"). Headline over it: "it's already in the room."
2. **Scroll-scrubbed timeline:** a vertical track on the left with timestamps (00:00 → 24:18). As you scroll, transcript lines stream in on the right. At the right moments, capture chips pop onto the timeline: *Decision*, *Action item*, *Open question*, *Insight*. Scrolling back rewinds.
3. **The recap:** the call ends and the page cuts to the email/Slack recap Selixa sends: decisions, owners, follow-ups. It looks like a real message, not a feature list.
4. **Works where you meet:** Zoom and Google Meet marks, and "joins as a participant; everyone sees it's there" (consent line, see Open questions).
5. **Related:** Execution Agent (what happens to the action items), Roadmap Agent.
6. CTA.

**Feel:** dark, cinematic, video-call UI; the only page where the whole hero is a "screen".

### 3.3 `/agents/research`: the investigation board

**Signature idea: a pin board of evidence you pan across.**

1. **Hero:** "it finds the signal." Behind the headline, a large canvas of pinned cards: customer quotes, competitor screenshots (abstract, not real brands), market notes, support tickets, connected by thin threads.
2. **Pan and zoom on scroll:** the camera (a CSS transform on the board) drifts across the board as you scroll, stopping on three clusters, one per research source: *customers*, *competitors*, *market*. Each stop shows one caption line.
3. **The synthesis:** the threads converge into one "Research brief" card: the finding, the evidence count and sources.
4. **Sources it reads:** Intercom, Slack, Notion, Google Drive marks.
5. CTA.

**Feel:** editorial and tactile. Cards slightly rotated, paper-like panels, the only page with a free-form canvas.

### 3.4 `/agents/analyst`: the chart that explains itself

**Signature idea: one big chart, annotated live.**

1. **Hero:** a full-width line chart of activation. The line draws in, then dips 8% at a marked point.
2. **Annotations appear:** as you scroll, callouts attach to the dip: *Aug 12 release*, *integrations step added*, *4 customer calls*, *7 feedback notes*. Each links a number to a cause.
3. **Ask a number:** an input "Why did retention change in May?" types itself; the answer comes back as a short sentence with a mini chart and source chips (PostHog, Mixpanel).
4. **Metrics it watches:** a dense tabular grid (monospace numerals) of example metrics with sparklines.
5. CTA.

**Feel:** data-grade: grid lines, tabular numbers, restrained colour (crimson only on the anomaly).

### 3.5 `/agents/product`: the memo that writes itself

**Signature idea: the page is a document being written.**

1. **Hero:** a clean, wide document page (like a PRD). Title types in: "Prioritise onboarding." A blinking caret moves through it.
2. **Sections fill as you scroll:** *Problem*, *Evidence* (with inline citations that open to show the source), *Options considered* (three, one struck through with a reason), *Recommendation*, *Impact*, *Next steps*.
3. **Margin notes:** comments in the right margin from teammates (sample names) and Selixa's replies, showing it takes a position and defends it.
4. **Hand-off bar:** "Create roadmap item" and "Draft PRD" buttons, linking to the Roadmap and Execution agents.
5. CTA.

**Feel:** editorial, typographic, lots of white space; the lightest page on the site even in dark mode.

### 3.6 `/agents/roadmap`: the horizontal roadmap

**Signature idea: the page scrolls sideways through Now / Next / Later.**

1. **Hero:** "a roadmap that keeps up."
2. **Horizontal scroll section (sticky, scrubbed):** vertical scrolling moves a wide board horizontally through three columns. As it moves, cards slide between columns in response to decisions ("Decision captured: ship shorter onboarding" → the card jumps to *Now*). Dependency lines draw between blocked items.
3. **Why it moved:** tapping any card opens a small drawer with the decision and meeting it came from.
4. **Per product:** a product switcher (Atlas / Beacon / Cove / Drift) showing each keeps its own roadmap.
5. CTA.

**Feel:** spatial and planar; the only horizontally moving page.

### 3.7 `/agents/execution`: from decision to done

**Signature idea: a board that empties.**

1. **Hero:** a kanban with *To do / In progress / Done*. Tasks glide rightward on their own; a progress ring in the corner fills.
2. **The breakdown:** one decision fans out into a requirement, then 14 tasks, then owners (avatars), shown as a tree that grows on scroll.
3. **Follows up for you:** a stack of nudges Selixa sends ("Blocked for 2 days: auth dependency") appearing like notifications.
4. **Syncs to your tracker:** Linear, Jira, GitHub marks with a two-way sync line.
5. **Outcome:** the page closes on the metric the work was for (activation recovering), tying back to the Analyst Agent.
6. CTA.

**Feel:** operational, crisp, satisfying: things visibly get finished.

---

## 4. Integrations

### 4.1 `/integrations`: the directory

**Signature idea: a command palette you can actually type in.**

1. **Hero:** a large ⌘K-style search field, focused, with the placeholder "Search integrations…". Typing filters the grid live. Below it, category chips: *Chat · Docs · Issues · Code · Meetings · Feedback · Analytics*.
2. **Grid:** logo tiles as on the home page: monochrome at rest, brand colour on hover. Each links to its page. A *Status* tag per tool (Live / Coming soon), depending on the Open questions answer.
3. **How data flows:** a compact diagram of tools → one product's context → agents, with the 🔒 per-product boundary.
4. **Request one:** "Don't see yours?" opens the form with the problem field pre-filled "Integration request: …".
5. CTA.

### 4.2 `/integrations/[slug]`: one template, eleven faces

**Signature idea: each page is lit by the tool's own brand colour.** The crimson accent is swapped for a soft wash of the tool's colour in the hero only; the rest of the page stays Selixa.

1. **Hero:** the tool's mark and the Selixa orb side by side, joined by an animated connector ("Slack ↔ Selixa"). Headline is the one-line job ("Threads and decisions").
2. **What flows in / what comes back:** two columns. Left: what Selixa reads (e.g. Slack: channels you choose, threads, decisions). Right: what Selixa writes back (recaps, answers, nudges).
3. **Signature demo, per tool** (the one bespoke bit per page, small):
   - Slack / Intercom: a message thread where Selixa replies.
   - Notion / Google Drive: a doc gaining a Selixa-written section.
   - Linear / Jira / GitHub: an issue created from a decision.
   - Zoom / Google Meet: Selixa joining a call.
   - PostHog / Mixpanel: a chart with Selixa's annotation.
4. **Permissions and data:** what access is requested, where it's stored (inside that product's isolated context), how to disconnect. Content from *Open questions*.
5. **Set up in 3 steps**, then related agents.
6. CTA.

Data lives in `lib/content/integrations.ts` (extends `components/landing/logos.ts`): slug, name, kind, reads, writes, demo type, permissions.

---

## 5. Use cases

### 5.1 `/use-cases`: pick your role

**Signature idea: the page reshapes around who you are.**

1. **Hero:** "built for people building products." A single line of role chips: *Solo founder · Startup · PM · Head of product · Engineering lead · Design · Customer success · Product ops · Agencies · Venture studios · Product-led SaaS · Multi-product founder*.
2. **Picking a chip** swaps the preview panel below (a crossfade, no layout jump): that role's biggest pain, the agents they'd lean on, and a mini "day with Selixa". It deep-links to the full page.
3. **Grid of all 12:** grouped into three rows, *Founders*, *Product teams*, *Around the product*, for people who want to browse.
4. CTA.

### 5.2 `/use-cases/[slug]`: a day with Selixa

**Signature idea: a before/after split you drag.**

1. **Hero:** a split screen with a draggable divider. Left, *without Selixa*: scattered tabs, a messy notes doc, a stale roadmap. Right, *with Selixa*: the same day, organised. Dragging reveals more of the right side. On touch it becomes a toggle.
2. **Morning → evening timeline:** four moments in that role's day (e.g. for a PM: standup, customer call, prioritisation, stakeholder update), each showing what Selixa did.
3. **The agents that matter most** for this role (2–3 cards) and **the integrations they usually connect**.
4. CTA.

Three layout variants rotate across the 12 so neighbours don't look identical: **A** timeline on the left, **B** timeline across the top, **C** timeline as stacked cards. Content in `lib/content/use-cases.ts`.

---

## 6. Get started: the "interview"

### `/get-started`

**Signature idea: Selixa starts getting to know your product in front of you.** This is the full-page version of the website CTA, where the "interview" idea lives.

**Steps (one screen each, a progress rail at the top):**
1. **Your product's website.** Pre-filled if they came from a CTA.
2. **What you use:** tap the integrations you have (logo grid, multi-select).
3. **What's on fire:** pick up to three pains (chips: *priorities*, *meeting follow-up*, *customer feedback*, *roadmap drift*, …).
4. **About you:** name, work email, role. Submit.
5. **Done:** "Selixa will start by learning *acme.com*." What happens next, honestly (the team follows up).

All answers go into the existing inquiry record (`lib/inquiries.ts` gains `site`, `tools`, `pains`, `role`), so `/admin` shows richer leads. No fake "analysing your site…" results: if we want real site analysis, that's a separate backend feature (see Open questions).

---

## 7. Blog

### `/blog`: magazine index
- Large featured post (full-width image or generated cover), then a two-column list with category, reading time, date.
- Category filter: *Product management · Building with AI · Selixa updates*.
- Newsletter row only if you want one (Open question).

### `/blog/[slug]`: long read
- Centred reading column (~68ch), Satoshi for the title, Inter body at 18px, generous line height.
- Sticky table of contents on wide screens; a thin crimson reading-progress line under the header.
- Posts in MDX (`content/blog/*.mdx`); see `node_modules/next/dist/docs` → `mdx-components` for this Next version's setup.
- Ends with a related post and the CTA.

Covers: generated per post with `opengraph-image.tsx` (title on the crimson/orb artwork), so there's no stock imagery.

---

## 8. Company and trust

### `/security`: trust centre
**Signature idea: the isolation diagram.** A large visual of products as separate sealed containers, each with its own meetings, docs and memory, and agents working inside one at a time. Then plain sections: data storage and region, encryption, meeting consent (how people know Selixa is in the call), retention and deletion, access controls, subprocessors, how to report an issue.
**Everything here must be factual; see Open questions.** Until confirmed, ship only the isolation principle.

### `/about`: the manifesto
Typographic scroll story built on the chaos idea. The home page's closing animation (scraps pulled into the orb) runs full-screen, then short statements reveal one per screen: *Product work is scattered. Decisions get lost. We think product managers should…*. No team photos or investor logos unless supplied.

### `/changelog`
A vertical timeline, newest first. Each entry has a date, a title, a short note and optionally a small demo or screenshot. MDX files in `content/changelog/`.

### `/contact`
The inquiry form as a full page (for direct links and people who hate modals), plus any support email you want listed.

### `/privacy`, `/terms`
Plain, readable legal pages (long-read template, no motion). **Needed before launch**, since the form collects personal data and Selixa joins meetings. Content must come from you or counsel.

### `404`
The closing-section animation in miniature: the letters of "not found" tumble, then settle, with a link home and the search from `/integrations`.

---

## 9. Shared building blocks

New components, so the pages above don't each reinvent them:

| Component | Used by |
|---|---|
| `PageHero`: eyebrow, headline, one line, slot for the signature visual | Every page |
| `StickyScene`: pinned section with scroll progress 0→1, static fallback | Agents hub relay, Meeting timeline, Roadmap horizontal, Research board |
| `SplitCompare`: draggable before/after | Use-case pages |
| `DocSurface`: document-styled panel with inline citations | Product Agent, blog |
| `ChartLine`: SVG line chart with annotations | Analyst Agent, PostHog/Mixpanel pages |
| `RelatedCards`: agents / integrations / use cases cross-links | Most detail pages |
| `CTASection`: closing site CTA with the orb | Every page |

**Content lives in typed data files**, not in JSX: `lib/content/agents.ts`, `integrations.ts`, `use-cases.ts`. The header menus, footer and pages all read from them, so adding an integration is one entry.

**Routing (this Next.js version):** dynamic pages use `generateStaticParams` and read `params` as a Promise (`const { slug } = await params`); `generateMetadata` per page; `app/sitemap.ts` and `app/robots.ts`; `opengraph-image.tsx` per section. Check `node_modules/next/dist/docs/01-app/03-api-reference/` before building each piece.

**SEO:** each page gets a unique title/description; agents and integrations get `SoftwareApplication` / `FAQPage` JSON-LD only where the content is real.

---

## 10. Build order

1. **Foundations:** `lib/content/*`, `PageHero`, `CTASection`, `RelatedCards`, sitemap/robots, header and footer linking to real routes.
2. **Agents:** hub, then Meeting (highest intent), Product, Execution, Roadmap, Analyst, Research. Build `StickyScene` with the hub.
3. **Integrations:** directory, then the template with all 11 demos.
4. **Get started:** extend the inquiry model and `/admin` columns.
5. **Use cases:** hub, then the template with variants A/B/C.
6. **Trust and company:** Security (once facts are in), About, Contact, Legal, 404.
7. **Blog and changelog:** MDX setup, index, post template, OG covers.

Each step ships with light and dark checked, reduced motion checked, phone width checked, and a smooth-scroll check (no layout animation during scroll).

---

## 11. Open questions (needed from you)

1. **Integration status:** which of the 11 are live today and which are "coming soon"?
2. **Meeting consent:** how does Selixa announce itself in calls, and can hosts remove it?
3. **Security facts:** data region, encryption, retention, subprocessors, any certifications (or "in progress"). Nothing goes on `/security` until confirmed.
4. **Pricing:** public pricing page or "talk to us" for now? (Not in the nav today.)
5. **Legal:** who provides the privacy policy and terms?
6. **Blog:** who writes, and do you want a newsletter signup?
7. **Real site analysis:** should `/get-started` actually read the visitor's website (needs a backend, e.g. Claude API), or keep capturing the URL for your team?
8. **Proof:** once you have real customer quotes or logos, where should they go (agents hub and use-case pages are the natural homes)?
