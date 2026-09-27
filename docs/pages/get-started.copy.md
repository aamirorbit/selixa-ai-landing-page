# /get-started — copy sheet

Every visible string on the onboarding "interview" (SITE_PLAN §6). No Designer spec yet (`docs/pages/get-started.md`), so sections are keyed to the five steps: Rail, Step 1 Site, Step 2 Tools, Step 3 Pains, Step 4 About you, Step 5 Done.

Strings marked *(reuse)* already exist in code and must stay identical: `components/ConversationCTA.tsx`, `components/InquiryForm.tsx`, `app/actions.ts`. Integration names come from `components/landing/logos.ts` *(data)*.

---

## Page metadata

- **`<title>`:** Get started — Selixa
- **Meta description:** Tell Selixa about your product in five quick steps: your site, your tools, what's on fire, and who you are. The team takes it from there.
- **OG title:** Get started with Selixa
- **OG description:** Five steps to your AI Product Manager.

---

## Rail (progress, top of every step)

- **Step labels:** Website · Tools · Pains · You · Done
- **Counter (screen readers and small screens):** Step {n} of 5
- **Progress bar aria-label:** Setup progress

## Buttons (shared)

- **Back:** Back
- **Continue:** Continue
- **Submit (step 4):** Request access *(reuse: `submitLabel` in ConversationCTA)*
- **Submitting:** Sending *(reuse)*
- **Skip (step 2 and 3 only, optional):** Skip

---

## Step 1: Site

- **Headline:** what are you building?
- **Line:** Start with your product's website.
- **Field placeholder:** Enter your product’s website *(reuse)*
- **Field label (screen readers):** Your product’s website *(reuse)*
- **Validation:** That doesn’t look like a website. Try something like acme.com. *(reuse)*
- **Pre-filled note (when arriving from a CTA with a site):** From your last visit. Change it if you like.

---

## Step 2: Tools

- **Headline:** what do you use?
- **Line:** Tap the tools your team works in.
- **Logo grid (multi-select, order from `logos.ts`)** *(data)*: Slack · Notion · Google Drive · Linear · Jira · GitHub · Zoom · Google Meet · Intercom · PostHog · Mixpanel
- **Selected count:** {n} selected
- **None selected hint:** Pick any, or skip.
- **Other (optional free-text chip):** Something else
- **Other field placeholder:** Which tool?

TODO(owner): if some integrations are "coming soon" (SITE_PLAN §11 Q1), say which. Until then, no live/soon badges in this grid.

---

## Step 3: Pains

- **Headline:** what’s on fire?
- **Line:** Pick up to three.
- **Chips (multi-select, max 3):**
  1. Priorities
  2. Meeting follow-up
  3. Customer feedback
  4. Roadmap drift
  5. Lost decisions
  6. Scattered docs
  7. Metrics nobody reads
  8. Specs and tickets
- **Counter:** {n} of 3
- **At the limit (when a 4th is tapped):** Three is plenty. Unpick one to swap.

---

## Step 4: About you

- **Headline:** last thing: you.
- **Line:** So the team knows who to reply to.
- **Name field:** Full Name *(reuse)*
- **Email field:** Work Email *(reuse)*
- **Role field label:** Your role
- **Role options:**
  - Founder
  - Product manager
  - Engineering
  - Design
  - Other
- **Field errors:**
  - Name: Enter your full name. *(reuse)*
  - Email: Enter a valid work email. *(reuse)*
  - Role: Pick the closest role.
- **Form error summary:** One field needs attention. / A couple of fields need attention. *(reuse)*
- **Save failure:** We couldn't save that just now. Try again in a moment, or email hello@selixa.ai. *(reuse)*
- **Privacy line:** We respect your privacy. No spam. Ever. *(reuse)*

---

## Step 5: Done

- **Headline:** Selixa will start by learning {domain}.
- **Headline, if no site was given:** You're on the list, {first name}.
- **Line:** Your note is with the team. If there’s a fit, you’ll hear from us within two business days. *(reuse: InquiryForm success)*
- **What happens next (3 short rows, no dates beyond the line above):**
  1. The team reads what you sent.
  2. We reply by email to set up your first product.
  3. Selixa starts with {domain} and the tools you picked.
- **Row 3, if no site or tools given:** Selixa starts with your product and your tools.
- **Summary card (echo of their answers):**
  - Website: {domain}
  - Tools: {tool list} / None picked
  - On fire: {pain list} / None picked
- **Link:** Back to home

Do not show any "analyzing your site…" state or results. Nothing is analyzed yet (SITE_PLAN §11 Q7).

---

## Notes for Designer / Builder

- `InquiryForm` requires "What are you building?" (min 12 chars). This flow doesn't ask it; the server action needs a variant that accepts `site`, `tools`, `pains`, `role` without `building`, or step 1's site stands in for company.
- "Full Name" / "Work Email" are Title Case in the existing form. Kept identical for consistency; if the owner wants sentence case, change both places.
