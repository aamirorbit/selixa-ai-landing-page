# /agents/execution — copy sheet

Every visible string on the Execution Agent page (SITE_PLAN §3.7). Sections: Hero, Breakdown, Nudges, Sync, Outcome, Related, CTA.

Name, line, `status`, `doing` from `lib/content/agents.ts` *(data)*. Demo content is illustrative and matches the home page’s Execution section: Decision “Shorten onboarding” → requirement “Onboarding v2” → 14 tasks, synced to Linear → owners Sara Kim, Dev Patel, Maya Chen → outcome “Activation back up”.

---

## Page metadata

- **`<title>`:** Execution Agent — Selixa
- **Meta description:** Selixa turns decisions into tasks with owners, syncs them to Linear, Jira or GitHub, and follows up until the work ships.
- **OG title:** From decision to done — Selixa
- **OG description:** One decision, 14 tasks, three owners, no chasing.

---

## Hero

- **Eyebrow:** Execution Agent
- **Headline:** from decision to done.
- **Line:** `line` *(data)*: Turns plans into tasks and follows progress.

**Kanban**
- **Board title:** Onboarding v2
- **Columns:** To do · In progress · Done
- **Progress ring label:** 9 of 14 (counts up to 14 of 14 over the loop; ring end state: Done)
- **Cards:** use the task list below (show 6–8 at a time; tracker ID · title · owner avatar)

---

## Breakdown

Tree grows on scroll: one decision → one requirement → 14 tasks → 3 owners.

- **Section headline:** one decision, fourteen tasks.
- **Line:** Every task has an owner before the meeting ends.
- **Level labels:** Decision · Requirement · Tasks · Owners
- **Decision node:** Shorten onboarding
- **Requirement node:** Onboarding v2 · Ship Oct 14
- **Tasks node header:** 14 tasks · Synced to Linear

**The 14 tasks** (ID · title · owner)

| ID | Task | Owner |
|---|---|---|
| ATL-212 | Move Slack connect after first project | Dev Patel |
| ATL-213 | Replace product tour with 3-step checklist | Maya Chen |
| ATL-214 | Empty states for new workspaces | Maya Chen |
| ATL-215 | Checklist copy | Maya Chen |
| ATL-216 | Defer integrations prompt | Dev Patel |
| ATL-217 | Auth for deferred Slack connect | Dev Patel |
| ATL-218 | Setup events in analytics | Dev Patel |
| ATL-219 | Feature flag and rollout plan | Dev Patel |
| ATL-220 | QA: new workspace flow | Dev Patel |
| ATL-221 | Design review | Maya Chen |
| ATL-222 | Weekly activation report | Sara Kim |
| ATL-223 | Update onboarding help guide | Sara Kim |
| ATL-224 | Brief customer success | Sara Kim |
| ATL-225 | Email existing trial users | Sara Kim |

- **Owners node:** Sara Kim · 4 · Dev Patel · 6 · Maya Chen · 4

---

## Nudges

Stack of notifications from Selixa, arriving one by one.

- **Section headline:** it follows up, so you don’t.
- **Line:** none

| Nudge title | Body | Sent to |
|---|---|---|
| Blocked for 2 days: auth dependency | ATL-217 is waiting on the auth review. Want me to ask Dev? | Sara Kim |
| Due tomorrow | ATL-214 Empty states for new workspaces | Maya Chen |
| Unassigned for 1 day | ATL-225 Email existing trial users needs an owner. | Sara Kim |
| PR #482 merged | ATL-212 moved to Done. | #atlas-product |
| On track for Oct 14 | 12 of 14 done. 2 in review. | #atlas-product |

- **Notification sender label:** Selixa · now

---

## Sync

- **Section headline:** stays in sync with your tracker.
- **Line:** Status changes flow both ways.
- **Marks:** Linear · Jira · GitHub (use `components/landing/logos.ts`)
- **Sync line labels:** Tasks out → · ← Status back
- **Sample synced issue:** ATL-212 · Move Slack connect after first project · In progress

---

## Outcome

Closes on the metric the work was for; ties back to the Analyst Agent.

- **Section headline:** done means the number moved.
- **Line:** Selixa measures the outcome, not just the tasks.
- **Metric card title:** Activation · Atlas
- **Value:** 35.0% → 37.4%
- **Change label:** Back up since Oct 14
- **Sub label:** Measured weekly
- **Link:** See how the Analyst Agent tracks it →

---

## Related

- **Section headline:** before and after the tasks.
- **Cards** (from data, link text “See how it works →”)
  - **Analyst Agent** — measures whether the work paid off.
  - **Roadmap Agent** — where the plan came from.

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Stop chasing tasks. Start shipping them.
- **Primary action:** `ConversationCTA variant="site"`.

---

## TODO(owner)

1. **Linear / Jira / GitHub status** (SITE_PLAN §11.1): live or coming soon? And is sync genuinely two-way today? If not, drop “Status changes flow both ways.” and the “← Status back” label.
