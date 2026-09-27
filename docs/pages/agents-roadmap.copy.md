# /agents/roadmap — copy sheet

Every visible string on the Roadmap Agent page (SITE_PLAN §3.6). Sections: Hero, Board (horizontal Now / Next / Later), Why it moved, Per product, Related, CTA.

Name, line, `status`, `doing` from `lib/content/agents.ts` *(data)*. Demo content is illustrative and continues the story: the Sep 24 decision moves **Onboarding v2** from Next to Now.

---

## Page metadata

- **`<title>`:** Roadmap Agent — Selixa
- **Meta description:** Selixa turns product decisions into a roadmap that updates itself. Every move links back to the decision and meeting behind it.
- **OG title:** A roadmap that keeps up — Selixa
- **OG description:** Decided in the meeting. On the roadmap before it ends, with the reason attached.

---

## Hero

- **Eyebrow:** Roadmap Agent
- **Headline:** a roadmap that keeps up.
- **Line:** `line` *(data)*: Turns decisions into an evolving roadmap.
- **Status chip (optional):** `status` *(data)*: Updated 2h ago

---

## Board

Pinned; vertical scroll moves the board sideways. Cards move between columns when a decision toast appears.

- **Section eyebrow:** Atlas roadmap
- **Column headers:** Now · Next · Later

**Starting state**

| Now | Next | Later |
|---|---|---|
| Billing page fixes | Onboarding v2 | Mobile app |
| Faster search | Saved views for teams | Public API v2 |
| | Import from CSV · Blocked | SSO |
| | Mobile app beta | |

**Card anatomy:** title · owner avatar · small tag (e.g. “Q4”, “Blocked”)
- Owners: Onboarding v2 — Sara Kim · Saved views for teams — Maya Chen · Import from CSV — Dev Patel · Billing page fixes — Dev Patel · Faster search — Dev Patel · Mobile app beta — Maya Chen

**Moves, in scroll order (toast text → what moves)**
1. **Decision captured:** Ship the shorter onboarding flow → *Onboarding v2* jumps Next → Now. Card tag changes to “Oct 14”.
2. **Decision captured:** Pause mobile until Q1 → *Mobile app beta* moves Next → Later.
3. **Shipped:** Billing page fixes → card fades from Now with a “Shipped” tag.
4. **Dependency:** *Import from CSV* is blocked by *Import API* (Later → line draws between them). Blocked tag: Blocked by Import API

**Toast source line (small, under each toast):** From Product review · Sep 24

**Static / reduced-motion fallback:** the end state (Onboarding v2 in Now, Mobile app beta in Later, dependency line drawn), same headline.

- **Section headline (above or under the pinned board):** decisions move the cards.
- **Line:** none

---

## Why it moved

Drawer opens from the Onboarding v2 card.

- **Section headline:** every move has a reason.
- **Line:** Tap a card to see the decision behind it.

**Drawer**
- **Drawer title:** Onboarding v2
- **Move row:** Next → Now · Sep 24
- **Decision:** Ship the shorter onboarding flow on Oct 14
- **Decided by:** Sara Kim
- **From:** Product review · Sep 24 · 11:04 (link text: Open meeting)
- **Why:** Activation −8% since the Aug 12 release · 3 competitors with shorter onboarding
- **Recommendation:** Prioritize onboarding (link text: Open memo)
- **Close:** Close

---

## Per product

Product switcher; each tab shows that product’s own board (Now column only is enough).

- **Section headline:** every product, its own roadmap.
- **Line:** Separate decisions. Separate context.
- **Tabs:** Atlas · Beacon · Cove · Drift

| Product | Now | Updated |
|---|---|---|
| Atlas | Onboarding v2 · Faster search | Updated 2h ago |
| Beacon | Usage alerts · Team billing | Updated yesterday |
| Cove | Offline mode · Sharing links | Updated 3d ago |
| Drift | Dashboard redesign · Slack digest | Updated 5h ago |

- **Footer chip on each board:** Isolated (lock icon, as on the home page)

---

## Related

- **Section headline:** before and after the roadmap.
- **Cards** (from data, link text “See how it works →”)
  - **Meeting Agent** — where the decisions come from.
  - **Execution Agent** — turns Now into tasks.

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Keep your roadmap as current as your last meeting.
- **Primary action:** `ConversationCTA variant="site"`.

---

## TODO(owner)

- None required for this page.
