"use server";

import { saveInquiry, type NewInquiry } from "@/lib/inquiries";
import { PAIN_KEYS, ROLE_KEYS, SOURCES, TOOL_SLUGS, painLabel, roleLabel } from "@/lib/onboarding";
import { toDomain } from "@/lib/site";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Partial<Record<FieldName, string>>; values?: Record<FieldName, string> }
  | { status: "success"; name: string };

export type FieldName = "name" | "email" | "company" | "building" | "problem";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|icloud|proton|protonmail|aol)\./i;
const SAVE_FAILED = "We couldn't save that just now. Try again in a moment, or email hello@selixa.ai.";
const SEND_FAILED = "We couldn't send that just now. Try again in a moment, or email hello@selixa.ai.";
const summary = (n: number) => (n === 1 ? "One field needs attention." : "A couple of fields need attention.");

/** Stores an inquiry and notifies the webhook. Returns an error message, or null on success. */
async function record(inquiry: NewInquiry, extra: Record<string, unknown> = {}): Promise<string | null> {
  const payload = { ...inquiry, ...extra, receivedAt: new Date().toISOString() };

  // 1) Record it. This is the source of truth for the admin page.
  let stored = false;
  try {
    stored = (await saveInquiry(inquiry)) !== null;
  } catch (err) {
    console.error("[inquiry] database write failed", err);
    return SAVE_FAILED;
  }

  // 2) Optionally notify somewhere else (Slack, Zapier, your API...).
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[inquiry] webhook delivery failed", err);
      if (!stored) return SEND_FAILED;
    }
  }

  if (!stored && !webhook) console.log("[inquiry] (no database configured)", JSON.stringify(payload, null, 2));
  return null;
}

/** The modal and /contact. */
export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const raw = (key: string) => String(formData.get(key) ?? "");

  // Honeypot: bots fill hidden fields. Pretend it worked, drop it.
  if (raw("website").trim()) return { status: "success", name: raw("name").trim() || "there" };

  // Values echoed back exactly as typed (e.g. a prefilled "Integration request: " keeps its
  // trailing space); trimmed copies are what's validated and stored.
  const typed = { name: raw("name"), email: raw("email"), company: raw("company"), building: raw("building"), problem: raw("problem") };
  const data = Object.fromEntries(Object.entries(typed).map(([k, v]) => [k, v.trim()])) as typeof typed;

  const fields: Partial<Record<FieldName, string>> = {};
  if (data.name.length < 2) fields.name = "Enter your full name.";
  if (!EMAIL_RE.test(data.email)) fields.email = "Enter a valid work email.";
  if (data.building.length < 12) fields.building = "Tell us a little more about what you're building.";
  for (const [key, value] of Object.entries(data)) {
    if (value.length > 4000) fields[key as FieldName] = "Keep this under 4,000 characters.";
  }

  if (Object.keys(fields).length) {
    return { status: "error", message: summary(Object.keys(fields).length), fields, values: typed };
  }

  // The page it came from (allowlisted); anything else counts as the modal.
  const source = raw("source") === "contact" ? SOURCES.contact : SOURCES.modal;
  const failed = await record({ ...data, personalEmail: FREE_MAIL.test(data.email), source, site: "", tools: [], pains: [], role: "" });
  if (failed) return { status: "error", message: failed, values: typed };

  return { status: "success", name: data.name.split(" ")[0] };
}

/* ---------- /get-started ---------- */

export type OnboardingValues = {
  site: string;
  noSite: boolean;
  tools: string[];
  toolsOther: string;
  pains: string[];
  name: string;
  email: string;
  role: string;
};
export type OnboardingField = "site" | "name" | "email" | "role";
export type OnboardingState =
  | { status: "idle" }
  | { status: "error"; step: "site" | "you"; message: string; fields?: Partial<Record<OnboardingField, string>>; values: OnboardingValues }
  | { status: "success"; name: string; site: string };

/** The interview: site, tools, pains, you. "What are you building?" isn't asked here. */
export async function submitOnboarding(_prev: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const raw = (key: string) => String(formData.get(key) ?? "");
  if (raw("website").trim()) return { status: "success", name: raw("name").trim() || "there", site: "" };

  const values: OnboardingValues = {
    site: raw("site"),
    noSite: raw("noSite") === "1",
    tools: formData.getAll("tools").map(String),
    toolsOther: raw("toolsOther"),
    pains: formData.getAll("pains").map(String),
    name: raw("name"),
    email: raw("email"),
    role: raw("role"),
  };

  const domain = values.noSite ? "" : toDomain(values.site);
  const name = values.name.trim();
  const email = values.email.trim();
  const fields: Partial<Record<OnboardingField, string>> = {};
  if (!values.noSite && !domain) fields.site = "That doesn’t look like a website. Try something like acme.com.";
  if (name.length < 2 || name.length > 4000) fields.name = "Enter your full name.";
  if (!EMAIL_RE.test(email) || email.length > 4000) fields.email = "Enter a valid work email.";
  if (!ROLE_KEYS.has(values.role)) fields.role = "Pick the closest role.";
  if (Object.keys(fields).length) {
    return { status: "error", step: fields.site ? "site" : "you", message: summary(Object.keys(fields).length), fields, values };
  }

  // Allowlists: unknown tools/pains dropped, pains capped at three.
  const other = values.toolsOther.trim().slice(0, 60);
  const tools = values.tools.filter((t) => TOOL_SLUGS.has(t)).map((t) => (t === "other" && other ? `other:${other}` : t));
  const pains = values.pains.filter((p) => PAIN_KEYS.has(p)).slice(0, 3);

  const failed = await record(
    {
      name,
      email,
      company: domain,
      building: "",
      problem: "",
      personalEmail: FREE_MAIL.test(email),
      source: SOURCES["get-started"],
      site: domain,
      tools,
      pains,
      role: values.role,
    },
    // Readable labels for Slack and friends
    { painLabels: pains.map(painLabel), roleLabel: roleLabel(values.role) },
  );
  if (failed) return { status: "error", step: "you", message: failed, values };

  return { status: "success", name: name.split(" ")[0], site: domain };
}
