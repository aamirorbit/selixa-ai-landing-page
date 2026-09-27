# /agents/product — copy sheet

Every visible string on the Product Agent page (SITE_PLAN §3.5). Sections: Hero, Memo (Problem, Evidence, Options considered, Recommendation, Impact, Next steps), Margin notes, Hand-off, Related, CTA.

Name, line, `status`, `doing` from `lib/content/agents.ts` *(data)*. The memo reuses the home page’s Decide section wording (Opportunity / Recommendation / Impact / Next steps). US spelling: **Prioritize** (the plan says “Prioritise”; the site uses US).

---

## Page metadata

- **`<title>`:** Product Agent — Selixa
- **Meta description:** Selixa weighs your meetings, customer evidence and data, and writes the recommendation: problem, options, impact and next steps, with sources cited.
- **OG title:** It takes a position — Selixa
- **OG description:** A product memo that writes itself, cites its evidence and defends its call.

---

## Hero

- **Eyebrow:** Product Agent
- **Headline:** it takes a position.
- **Line:** `line` *(data)*: Turns context into priorities and product decisions.

**Document header**
- **Doc breadcrumb:** Atlas / Memos
- **Doc title (types in):** Prioritize onboarding
- **Meta row:** Drafted by Selixa · Sep 25 · 3 min read
- **Status chip:** Draft → In review (flips when margin notes resolve)

---

## Memo

Sections fill as you scroll. Section labels are the H2s in the document.

### Problem
New workspaces stall at the integrations step. 38% never finish setup, and activation is down 8% since the Aug 12 release.

### Evidence
Each item ends with a citation marker; tapping it opens a source card.

- 4 customer calls name the integrations step. **[1]**
- 7 feedback notes say onboarding takes too long. **[2]**
- 3 competitors ask for integrations after the first project. **[3]**
- Setup completion fell 9% the week of the release. **[4]**

**Citation cards (popover: source label · excerpt · link text)**
- [1] Product review · Sep 24 · 02:41 — “People still stall at the integrations step.” — Open in Meeting Agent
- [2] Intercom · 7 notes — “Onboarding takes too long.” — Open in Research Agent
- [3] Research brief · Onboarding — “3 of 6 competitors ask for integrations later.” — Open in Research Agent
- [4] PostHog · Setup completion — “62%, down 9% since Aug 12.” — Open in Analyst Agent

### Options considered
1. **Shorter first-run flow, integrations after the first project.** Recommended.
2. **Guided setup call for every new workspace.** Later: worth testing once v2 ships.
3. ~~Revert the Aug 12 integrations step.~~ Rejected: teams that connect tools early retain better. Reverting fixes setup and hurts retention.

### Recommendation
Ship a shorter first-run flow and ask for integrations after the first project.

### Impact
Recovers most of the activation drop within two release cycles. Measured weekly.

### Next steps
Draft the requirement, size it with engineering, review on Thursday.

---

## Margin notes

Comments in the right margin, attached to highlighted text. Selixa replies and holds its position.

- **Section headline (above the doc or in the scroll caption):** and it defends it.
- **Line:** none

| Anchored to | Author | Comment |
|---|---|---|
| Option 3 | Dev Patel | Why not just revert? It’s the fastest fix. |
| Option 3 | Selixa | Faster, but it drops integrations for everyone. Teams that connect Slack in week one retain better. Deferring keeps both. |
| Recommendation | Maya Chen | Can we keep the product tour? |
| Recommendation | Selixa | All 4 customer calls skipped it [1]. I’d replace it with a 3-step checklist. |
| Next steps | Sara Kim | Agreed. Taking this to Thursday’s review. |

- **Resolved state label:** Resolved

---

## Hand-off

Bar at the bottom of the document.

- **Button 1:** Create roadmap item → links to `/agents/roadmap`
- **Button 2:** Draft PRD → links to `/agents/execution`
- **Bar label (left):** Recommendation: prioritize onboarding *(matches `handoff` in data)*

---

## Related

- **Section headline:** where the decision goes.
- **Cards** (from data, link text “See how it works →”)
  - **Roadmap Agent** — puts Onboarding v2 in Now.
  - **Execution Agent** — turns the plan into 14 tasks.

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Get a recommendation you can argue with.
- **Primary action:** `ConversationCTA variant="site"`.

---

## TODO(owner)

- None required for this page.
