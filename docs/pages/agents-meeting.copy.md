# /agents/meeting — copy sheet

Every visible string on the Meeting Agent page (SITE_PLAN §3.2). Sections: Hero, Timeline, Recap, Where you meet, Related, CTA.

Name, line, `status` and `doing` come from `lib/content/agents.ts` *(data)*. Demo content is illustrative and continues the home page's meeting (Product review · Sep 24): **3 decisions, 5 action items, 2 open questions, 1 product insight**. Keep those counts.

---

## Page metadata

- **`<title>`:** Meeting Agent — Selixa
- **Meta description:** Selixa joins your product meetings, captures decisions, action items and open questions, and sends the recap as the call ends.
- **OG title:** It’s already in the room — Selixa
- **OG description:** A 24-minute product review, captured as 3 decisions and 5 action items.

---

## Hero

- **Eyebrow:** Meeting Agent
- **Headline:** it’s already in the room.
- **Line:** `line` *(data)*: Joins meetings, captures decisions and follow-ups.

**Call window**
- **Window title:** Atlas · Product review
- **Timer:** 00:00 (runs while on screen)
- **Tiles (name · role):**
  - Sara Kim · Product
  - Dev Patel · Engineering
  - Maya Chen · Design
  - Selixa (orb, no role) · status chip: **Listening**
- **Selixa tile status, alternates in the loop:** Listening → Noting a decision → Listening
- **Recording/presence badge top-left of window:** Selixa is in this call  *(see TODO(owner) on consent — keep or drop with that answer)*

---

## Timeline

Scroll-scrubbed. Left: timestamp track 00:00 → 24:18. Right: transcript. Capture chips pop onto the track.

- **Section eyebrow:** The call
- **Section headline:** scroll is the meeting.
- **Line:** Every decision lands on the timeline as it’s said.

**Chip labels (and running counter at the top of the track):** Decision · Action item · Open question · Insight
- **Counter format:** 3 decisions · 5 action items · 2 open questions · 1 insight (each number counts up as chips appear)

**Transcript and chips, in order**

| Time | Speaker | Line | Chip | Chip text |
|---|---|---|---|---|
| 00:00 | Sara Kim | Let’s start with onboarding. Maya, what did testing show? | — | — |
| 02:41 | Maya Chen | The new setup flow tested well, but people still stall at the integrations step. | Insight | Onboarding friction is a recurring theme |
| 05:12 | Sara Kim | And activation’s down 8% since the Aug 12 release. | — | — |
| 08:30 | Dev Patel | If we defer the Slack connect, we can ship it this sprint. | Action item | Dev · Move Slack connect after first project |
| 11:04 | Sara Kim | Let’s do that. Ship the shorter flow on the 14th. | Decision | Ship the shorter onboarding flow on Oct 14 |
| 12:38 | Dev Patel | I’ll size it before Thursday’s review. | Action item | Dev · Size Onboarding v2 before Thursday |
| 13:47 | Maya Chen | Should imports stay behind the trial? | Open question | Should imports stay behind the trial? |
| 16:20 | Sara Kim | Keep a checklist, drop the product tour. | Decision | Replace the product tour with a 3-step checklist |
| 17:55 | Maya Chen | I’ll have the empty states by Friday. | Action item | Maya · Empty-state designs by Friday |
| 19:10 | Maya Chen | And I’ll rewrite the checklist copy. | Action item | Maya · Checklist copy |
| 21:35 | Sara Kim | We watch activation weekly until it’s back. | Decision | Track activation weekly until it recovers |
| 22:40 | Dev Patel | Do we tell existing trial users? | Open question | Do we email existing trial users? |
| 23:30 | Sara Kim | I’ll brief customer success today. | Action item | Sara · Brief customer success |
| 24:18 | — | Call ended | — | — |

**End of track marker:** Call ended · 24:18

**Static / reduced-motion fallback:** full transcript with all chips placed; same headline and line.

---

## Recap

The call ends; the page cuts to the message Selixa sends. Looks like a real Slack message.

- **Section eyebrow:** The recap
- **Section headline:** in everyone’s inbox before they close the tab.
- **Line:** none

**Message**
- **Channel:** #atlas-product
- **Sender:** Selixa · just now
- **First line:** Product review · Sep 24 · 24 min · Sara, Dev, Maya
- **Decisions**
  - Ship the shorter onboarding flow on Oct 14
  - Replace the product tour with a 3-step checklist
  - Track activation weekly until it recovers
- **Action items**
  - Dev Patel · Move Slack connect after first project
  - Dev Patel · Size Onboarding v2 before Thursday
  - Maya Chen · Empty-state designs by Friday
  - Maya Chen · Checklist copy
  - Sara Kim · Brief customer success
- **Open questions**
  - Should imports stay behind the trial?
  - Do we email existing trial users?
- **Insight:** Onboarding has come up in 4 meetings this month.
- **Message buttons:** Create 5 tasks · Open notes
- **Reactions (optional):** ✅ 3

---

## Where you meet

- **Section headline:** works where you meet.
- **Line:** TODO(owner) — consent line. Planned wording, **do not ship until confirmed**: “Joins as a participant. Everyone sees it’s there.”
- **Marks:** Zoom · Google Meet (use `components/landing/logos.ts`)
- **Fallback if consent is unconfirmed at build time:** headline and marks only, no line.

---

## Related

- **Section headline:** what happens next.
- **Cards** (from data: `name`, `line`, link text “See how it works →”)
  - **Execution Agent** — the 5 action items become tasks with owners.
  - **Roadmap Agent** — the decision moves Onboarding v2 to Now.
- **Card note line (optional, under each card title):** use the reason above.

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Bring Selixa to your next product review.
- **Primary action:** `ConversationCTA variant="site"` (placeholder from the component, don’t override).

---

## TODO(owner)

1. **Consent line** (SITE_PLAN §11.2): how Selixa announces itself in calls, and whether hosts can remove it. Affects the Where you meet line and the hero’s “Selixa is in this call” badge.
2. **Zoom / Google Meet status** (SITE_PLAN §11.1): live or coming soon? If coming soon, add a “Coming soon” tag under the marks.
