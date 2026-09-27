# /agents/analyst — copy sheet

Every visible string on the Analyst Agent page (SITE_PLAN §3.4). Sections: Hero, Annotations, Ask a number, Metrics, Related, CTA.

Name, line, `status`, `doing` from `lib/content/agents.ts` *(data)*. Demo numbers are illustrative. **The −8% is relative:** activation goes 38.0% → 35.0%. Use “−8%” everywhere; show the rates only in the tooltip/grid.

---

## Page metadata

- **`<title>`:** Analyst Agent — Selixa
- **Meta description:** Selixa watches your product metrics, explains why they moved, and answers questions about any number with the sources behind it.
- **OG title:** Numbers, with a cause — Selixa
- **OG description:** Activation fell 8%. Selixa found the release, the step and the calls behind it.

---

## Hero

- **Eyebrow:** Analyst Agent
- **Headline:** numbers, with a cause.
- **Line:** `line` *(data)*: Connects product data to what’s happening.

**Chart**
- **Chart title:** Activation · Atlas
- **Range chip:** Last 12 weeks
- **Y axis:** 30% · 35% · 40%
- **X axis (weekly):** Jul 1 · Jul 15 · Jul 29 · Aug 12 · Aug 26 · Sep 9 · Sep 23
- **Marked point (the dip):** Aug 12
- **Dip label (crimson):** −8%
- **Tooltip on the dip:** 38.0% → 35.0% · since Aug 12
- **Legend (optional):** Activation rate, weekly

---

## Annotations

Callouts attach to the dip one at a time on scroll. Each links a number to a cause.

- **Section headline:** it tells you why.
- **Line:** Every callout links to its source.

| # | Callout title | Detail | Source chip |
|---|---|---|---|
| 1 | Aug 12 release | Integrations step added to setup | GitHub · PR #451 |
| 2 | Setup completion −9% | 38% never finish setup | PostHog |
| 3 | 4 customer calls | All mention the integrations step | Meeting Agent |
| 4 | 7 feedback notes | “Onboarding takes too long” | Intercom |

**Summary line under the chart when all four are shown:** Activation −8% since the Aug 12 release. *(matches `handoff` in data)*

---

## Ask a number

- **Section headline:** ask any number.
- **Line:** none

**Demo**
- **Input placeholder:** Ask about a metric…
- **Typed question:** Why did retention change in May?
- **Answer:** Week-4 retention rose 5% in May, after saved views shipped on May 6. Teams that used saved views drove most of it.
- **Mini chart title:** Week-4 retention · Apr–Jun
- **Mini chart marker:** May 6 · Saved views
- **Source chips:** PostHog · Mixpanel
- **Follow-up chips (optional, not clickable):** Break down by plan · Compare to last year

---

## Metrics

Dense grid, monospace numerals, sparkline per row. Crimson only on the anomaly (Activation, Setup completion).

- **Section headline:** watching 12 metrics, so you don’t have to.
- **Line:** none
- **Column headers:** Metric · Now · Change · Last 12 weeks

| Metric | Now | Change |
|---|---|---|
| Activation | 35.0% | −8% |
| Setup completion | 62% | −9% |
| Time to first project | 2.4 days | +41% |
| Week-4 retention | 46% | +5% |
| Weekly active teams | 1,284 | +3% |
| Projects created | 3,912 | +2% |
| Invites sent per team | 2.7 | 0% |
| Integrations connected | 1.9 | −4% |
| Trial to paid | 14% | +1% |
| Support tickets | 212 | +18% |
| Feature adoption · Saved views | 31% | +6% |
| Churned teams | 23 | −2% |

- **Grid footer:** Atlas · Updated 2h ago

---

## Related

- **Section headline:** where the numbers go.
- **Cards** (from data, link text “See how it works →”)
  - **Research Agent** — finds what customers say about the same drop.
  - **Product Agent** — decides what to do about it.

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Find out why your numbers moved.
- **Primary action:** `ConversationCTA variant="site"`.

---

## TODO(owner)

1. **PostHog / Mixpanel / Intercom / GitHub status** (SITE_PLAN §11.1): live or coming soon?
