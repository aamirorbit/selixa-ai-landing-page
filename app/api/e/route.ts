import { after, type NextRequest } from "next/server";
import { isBot, recordEvents, type IncomingEvent } from "@/lib/analytics";

const MAX_BODY = 16_000;
const empty = () => new Response(null, { status: 204 });

/**
 * Analytics intake for lib/track.ts. Always answers 204 fast; the write happens after the
 * response. The IP and user agent are used only to derive the day's visitor hash and are
 * never stored. Global Privacy Control and Do Not Track are honored here as well as in the browser.
 */
export async function POST(req: NextRequest) {
  const h = req.headers;
  const origin = h.get("origin");
  if (origin && hostOf(origin) !== h.get("host")) return empty();
  if (h.get("sec-gpc") === "1" || h.get("dnt") === "1") return empty();

  const ua = h.get("user-agent") ?? "";
  if (isBot(ua)) return empty();

  const text = await req.text();
  if (text.length > MAX_BODY) return empty();
  let events: IncomingEvent[];
  try {
    const body = JSON.parse(text) as { e?: unknown };
    if (!Array.isArray(body.e)) return empty();
    events = body.e as IncomingEvent[];
  } catch {
    return empty();
  }

  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  const city = h.get("x-vercel-ip-city") ?? "";
  const ctx = {
    ip,
    ua,
    country: h.get("x-vercel-ip-country") ?? "",
    region: h.get("x-vercel-ip-country-region") ?? "",
    city: safeDecode(city),
  };

  after(() => recordEvents(events, ctx).catch((err) => console.error("[analytics]", err)));
  return empty();
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return "";
  }
}
