# /agents/research — copy sheet

Every visible string on the Research Agent page (SITE_PLAN §3.3). Sections: Hero, Board (three stops: Customers, Competitors, Market), Brief, Sources, Related, CTA.

Name, line, `status`, `doing` from `lib/content/agents.ts` *(data)*. Demo content is illustrative. **No real brands:** competitors are Competitor A / B / C. Numbers follow the home page: 4 customer calls, 7 feedback notes, 3 competitor examples, complaints up 60% in two weeks.

---

## Page metadata

- **`<title>`:** Research Agent — Selixa
- **Meta description:** Selixa reads customer calls, support tickets, competitors and market notes, and turns them into a research brief with every source attached.
- **OG title:** It finds the signal — Selixa
- **OG description:** Customer quotes, competitors and market notes, pulled into one brief.

---

## Hero

- **Eyebrow:** Research Agent
- **Headline:** it finds the signal.
- **Line:** `line` *(data)*: Finds customer, market and competitor signals.
- **Board corner status (optional):** `status` *(data)*: Tracking 6 competitors

---

## Board

Pinned canvas; the camera pans to three clusters. One caption per stop. Card tag in small caps above each card text.

### Stop 1 — Customers

- **Caption:** Customers: 4 calls and 7 notes say the same thing.
- **Cards**
  - Call · Interview · Maya — “I gave up at the integrations screen. I just wanted to see my project.”
  - Call · Customer call · Sep 18 — “We needed our Slack admin before we could even start.”
  - Ticket · #4127 — Can’t finish setup without admin access
  - Ticket · #4133 — Skipped setup, now the workspace is empty
  - Feedback · 7 related notes — Onboarding takes too long
  - Chip on the cluster: Complaints up 60% in two weeks

### Stop 2 — Competitors

Abstract screenshots (grey UI blocks, no logos).

- **Caption:** Competitors: 3 of 6 ask for integrations later.
- **Cards**
  - Competitor A — 3-step setup. Integrations after the first project.
  - Competitor B — Starts with sample data. Connect tools later.
  - Competitor C — One screen to first value.
  - Chip on the cluster: 3 competitors with shorter onboarding *(matches `handoff` in data)*

### Stop 3 — Market

- **Caption:** Market: buyers judge a tool in the first session.
- **Cards**
  - Market note — Self-serve trials are decided in the first session.
  - Market note — Teams expect value before setup.
  - Analyst note (from Analyst Agent) — Activation −8% since the Aug 12 release

**Thread labels (optional, tiny, on the threads between clusters):** supports · contradicts · same theme
- Use “contradicts” once, e.g. between a market note and Competitor C, to show it doesn’t only collect agreement.

---

## Brief

The threads converge into one card.

- **Section headline:** one brief. every source attached.
- **Line:** none

**Research brief card**
- **Card label:** Atlas · Research brief
- **Title:** Onboarding asks too much, too early
- **Finding:** New users stall when asked to connect tools before they see value. 3 competitors ask later.
- **Evidence count:** 16 pieces of evidence
- **Breakdown row:** 4 customer calls · 7 feedback notes · 3 competitors · 2 market notes
- **Confidence:** High
- **Source chips:** Intercom · Slack · Notion · Google Drive
- **Footer:** Sent to Product Agent

---

## Sources

- **Section headline:** reads where your evidence lives.
- **Line:** none
- **Marks:** Intercom · Slack · Notion · Google Drive (use `components/landing/logos.ts`)

---

## Related

- **Section headline:** where the brief goes.
- **Cards** (from data, link text “See how it works →”)
  - **Analyst Agent** — checks the brief against the numbers.
  - **Product Agent** — turns the brief into a recommendation.

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Let Selixa read what your customers are saying.
- **Primary action:** `ConversationCTA variant="site"`.

---

## TODO(owner)

1. **Intercom / Slack / Notion / Google Drive status** (SITE_PLAN §11.1): live or coming soon?
2. **“Tracking 6 competitors”**: how competitors are tracked (public sites, user-provided lists?) is unconfirmed. Copy only shows it as demo state; don’t add a claim about sources beyond the four marks until confirmed.
