"use server";

import { saveInquiry } from "@/lib/inquiries";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Partial<Record<FieldName, string>>; values?: Record<FieldName, string> }
  | { status: "success"; name: string };

export type FieldName = "name" | "email" | "company" | "building" | "problem";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|icloud|proton|protonmail|aol)\./i;

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const read = (key: string) => String(formData.get(key) ?? "").trim();

  // Honeypot: bots fill hidden fields. Pretend it worked, drop it.
  if (read("website")) return { status: "success", name: read("name") || "there" };

  const data = {
    name: read("name"),
    email: read("email"),
    company: read("company"),
    building: read("building"),
    problem: read("problem"),
  };

  const fields: Partial<Record<FieldName, string>> = {};
  if (data.name.length < 2) fields.name = "Enter your full name.";
  if (!EMAIL_RE.test(data.email)) fields.email = "Enter a valid work email.";
  if (data.building.length < 12) fields.building = "Tell us a little more about what you're building.";
  for (const [key, value] of Object.entries(data)) {
    if (value.length > 4000) fields[key as FieldName] = "Keep this under 4,000 characters.";
  }

  if (Object.keys(fields).length) {
    const missing = Object.keys(fields).length;
    return {
      status: "error",
      message: missing === 1 ? "One field needs attention." : "A couple of fields need attention.",
      fields,
      values: data,
    };
  }

  const payload = {
    ...data,
    personalEmail: FREE_MAIL.test(data.email),
    receivedAt: new Date().toISOString(),
    source: "selixa.ai/landing",
  };

  // 1) Record it. This is the source of truth for the admin page.
  let stored = false;
  try {
    stored = (await saveInquiry(payload)) !== null;
  } catch (err) {
    console.error("[inquiry] database write failed", err);
    return {
      status: "error",
      message: "We couldn't save that just now. Try again in a moment, or email hello@selixa.ai.",
      values: data,
    };
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
      if (!stored) {
        return {
          status: "error",
          message: "We couldn't send that just now. Try again in a moment, or email hello@selixa.ai.",
          values: data,
        };
      }
    }
  }

  if (!stored && !webhook) console.log("[inquiry] (no database configured)", JSON.stringify(payload, null, 2));

  return { status: "success", name: data.name.split(" ")[0] };
}
