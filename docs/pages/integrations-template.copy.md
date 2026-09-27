# /integrations/[slug] — copy sheet (template)

Shared strings for the 11 tool pages (SITE_PLAN §4.2). Per-tool strings live in `lib/content/integrations.ts`; `{name}`, `{job}` etc. below mean that entry's field. Section names follow the plan: Hero, Flow, Demo, Permissions, Setup, Related, CTA.

---

## Page metadata

- **`<title>`:** {name} integration — Selixa
  - e.g. "Slack integration — Selixa"
- **Meta description:** `metaDescription` *(data)*, unique per tool.
- **OG title:** {name} + Selixa
- **OG description:** `job` *(data)*, e.g. "Threads and decisions."

---

## Hero

- **Eyebrow:** Integrations · {category}
  - "Integrations" links back to `/integrations`
- **Connector label (between the marks):** {name} ↔ Selixa
- **Headline:** `job` with the first letter lowercased, as with other page headlines
  - e.g. "threads and decisions." / "numbers with a cause."
  - All 11 jobs start with a common word, so lowercasing is safe.
- **Line:** Connected to one product. Its context stays there.

---

## Flow

Two columns.

- **Left heading:** What Selixa reads
- **Left items:** `reads` *(data)*, 3 bullets
- **Right heading:** What comes back
- **Right items:** `writes` *(data)*, 2–3 bullets

---

## Demo

The small per-tool demo; its strings are `demoScript` *(data)*. The component picks the layout from `demo` (`thread` | `doc` | `issue` | `call` | `chart`).

- **Section headline:** see it in {name}.
- **Line:** none.

Shared labels inside the demos:
- **Selixa's name on messages, tiles and bylines:** Selixa
- **thread:** reply tag defaults to none; Intercom uses `replyTag` "Internal note" *(data)*
- **issue:** label above the decision: "From a decision"
- **call:** Selixa's tile shows the orb and `statuses` in order *(data)*; captured chips appear under the call
- **chart:** annotation card heading: "Selixa"; `sources` render as plain chips *(data)*

Static / reduced-motion fallback: the finished frame (reply sent, section written, issue created, recap sent, annotation shown). No extra copy.

---

## Permissions

- **Section headline:** permissions and data.
- **Full content:** TODO(owner). Per tool, needed: what access Selixa requests, where the data is stored, how long it's kept, how to disconnect. Data field `permissions` is `null` for every tool until supplied.

**What shows until then** (same on every page; the isolation principle is the only claim):
- **Line:** Everything {name} shares goes into one product's context. No other product can see it.
- **Small print:** Details on access and storage are coming soon.
- **Link:** Questions? Talk to us → (opens the form)

Do not add scopes, regions, encryption, retention or certification wording until confirmed.

---

## Setup

- **Section headline:** set up in 3 steps.
- **Steps:** `setup` *(data)*, numbered 1 · 2 · 3
  - e.g. "Connect Slack to Atlas." → "Pick the channels Selixa can read." → "Mention Selixa in any thread."

---

## Related

- **Section headline:** related agents.
- **Cards:** agents from `agents` *(data)*, rendered with `name` and `line` from `lib/content/agents.ts`
- **Card link text:** See how it works →
- **Secondary link under the cards:** All integrations →

---

## CTA

- **Headline:** stop building in chaos.
- **Line:** Connect {name} to your product.
- **Primary action:** `ConversationCTA variant="site"`. Placeholder stays "Enter your product's website" (from the component; do not override).

---

## TODO(owner)

- **Permissions and data per tool** (access requested, storage, retention, disconnect). Section shows the placeholder above until then.
- **Status per tool** (Live / Coming soon), SITE_PLAN §11.1. No status tag on the hero until answered.
- **Setup steps:** written to a plausible connect flow (connect to a product → choose sources → it works). Confirm they match the real product before launch.
- **Meeting consent** (Zoom, Google Meet), SITE_PLAN §11.2. The call demo doesn't claim how Selixa announces itself; add a line once decided.
