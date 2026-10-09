import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { getDb, type Db } from "./db";

/*
 * First-party, cookieless analytics. The browser sends events (lib/track.ts → /api/e); the
 * server never stores an IP address or user agent. A visitor is sha256(daily salt + IP + UA),
 * and each day's salt is deleted the next day, so yesterday's visitors can't be re-identified
 * or linked to today's. Country/region/city come from Vercel's edge geolocation headers.
 * Raw events are kept for 13 months. What is collected is disclosed on /privacy.
 */

export const EVENT_TYPES = ["pageview", "click", "leave", "step", "convert"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** One event as the browser sends it. Everything is optional and clamped on the way in. */
export type IncomingEvent = {
  t: EventType;
  p?: string; // path
  r?: string; // referrer host (first pageview only)
  us?: string; // utm_source
  um?: string; // utm_medium
  uc?: string; // utm_campaign
  l?: string; // click label / step name / conversion name
  h?: string; // click target: internal path or external host
  x?: number; // click x as a fraction of viewport width
  y?: number; // click y in page pixels
  vw?: number; // viewport width
  n?: number; // scroll depth % (leave) or step index
  ms?: number; // engaged time (leave)
};

export type RequestContext = { ip: string; ua: string; country: string; region: string; city: string };

const RETENTION = "13 months";
const MAX_EVENTS = 25;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const num = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null;

export function isEventType(v: unknown): v is EventType {
  return typeof v === "string" && (EVENT_TYPES as readonly string[]).includes(v);
}

const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|uptime|curl|wget|python|axios|node-fetch|go-http|java\/|facebookexternalhit|embedly|vercel/i;
export const isBot = (ua: string) => !ua || BOT_RE.test(ua);

/** Coarse device facts from the UA; the UA itself is never stored. */
function describe(ua: string): { device: string; browser: string; os: string } {
  const device = /ipad|tablet|(android(?!.*mobile))/i.test(ua) ? "Tablet" : /mobi|iphone|android/i.test(ua) ? "Mobile" : "Desktop";
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /opr\/|opera/i.test(ua)
      ? "Opera"
      : /samsungbrowser/i.test(ua)
        ? "Samsung Internet"
        : /firefox|fxios/i.test(ua)
          ? "Firefox"
          : /chrome|crios|chromium/i.test(ua)
            ? "Chrome"
            : /safari/i.test(ua)
              ? "Safari"
              : "Other";
  const os = /windows/i.test(ua)
    ? "Windows"
    : /iphone|ipad|ipod/i.test(ua)
      ? "iOS"
      : /mac os/i.test(ua)
        ? "macOS"
        : /android/i.test(ua)
          ? "Android"
          : /cros/i.test(ua)
            ? "ChromeOS"
            : /linux/i.test(ua)
              ? "Linux"
              : "Other";
  return { device, browser, os };
}

let saltCache: { day: string; salt: string } | undefined;

/** Today's salt (UTC). The first request of a day creates it, drops older salts and expires old events. */
async function dailySalt(db: Db): Promise<string> {
  const day = new Date().toISOString().slice(0, 10);
  if (saltCache?.day === day) return saltCache.salt;
  await db.query(`INSERT INTO analytics_salts (day, salt) VALUES ($1, $2) ON CONFLICT (day) DO NOTHING`, [day, randomBytes(32).toString("hex")]);
  const [row] = await db.query<{ salt: string }>(`SELECT salt FROM analytics_salts WHERE day = $1`, [day]);
  await db.query(`DELETE FROM analytics_salts WHERE day < $1`, [day]);
  await db.query(`DELETE FROM events WHERE ts < now() - interval '${RETENTION}'`);
  saltCache = { day, salt: row.salt };
  return row.salt;
}

export async function recordEvents(events: IncomingEvent[], ctx: RequestContext): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const salt = await dailySalt(db);
  const visitor = createHash("sha256").update(`${salt}|${ctx.ip}|${ctx.ua}`).digest("hex").slice(0, 16);
  const { device, browser, os } = describe(ctx.ua);

  for (const e of events.slice(0, MAX_EVENTS)) {
    if (!isEventType(e.t)) continue;
    const path = str(e.p, 300);
    if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) continue;
    await db.query(
      `INSERT INTO events (visitor, type, path, ref, utm_source, utm_medium, utm_campaign, country, region, city, device, browser, os, label, href, x, y, vw, num, ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
      [
        visitor,
        e.t,
        path,
        str(e.r, 200),
        str(e.us, 100),
        str(e.um, 100),
        str(e.uc, 100),
        ctx.country.slice(0, 2),
        ctx.region.slice(0, 10),
        ctx.city.slice(0, 80),
        device,
        browser,
        os,
        str(e.l, 120),
        str(e.h, 300),
        num(e.x, 0, 1),
        num(e.y, 0, 200_000),
        num(e.vw, 0, 10_000) === null ? null : Math.round(num(e.vw, 0, 10_000)!),
        num(e.n, 0, 100) === null ? null : Math.round(num(e.n, 0, 100)!),
        num(e.ms, 0, 6 * 60 * 60 * 1000) === null ? null : Math.round(num(e.ms, 0, 6 * 60 * 60 * 1000)!),
      ],
    );
  }
}

/* ---------------------------------------------------------------- reading */

export const RANGES = { "1": "24 hours", "7": "7 days", "30": "30 days", "90": "90 days" } as const;
export type RangeKey = keyof typeof RANGES;
export const isRange = (v: unknown): v is RangeKey => typeof v === "string" && v in RANGES;

/**
 * Events in range, grouped into sessions: a visitor's events with no gap over 30 minutes.
 * Used as a CTE by every report below; $1 is the number of days.
 */
const SESSIONIZED = `
  e AS (
    SELECT *, CASE WHEN ts - lag(ts) OVER (PARTITION BY visitor ORDER BY ts, id) <= interval '30 minutes' THEN 0 ELSE 1 END AS starts
    FROM events WHERE ts >= now() - make_interval(days => $1::int)
  ),
  ev AS (
    SELECT *, visitor || ':' || sum(starts) OVER (PARTITION BY visitor ORDER BY ts, id) AS sid FROM e
  ),
  s AS (
    SELECT sid,
      min(visitor) AS visitor,
      min(ts) AS started,
      max(ts) AS ended,
      count(*) FILTER (WHERE type = 'pageview')::int AS pageviews,
      count(*) FILTER (WHERE type = 'click')::int AS clicks,
      coalesce(sum(ms) FILTER (WHERE type = 'leave'), 0)::int AS engaged_ms,
      (array_agg(path ORDER BY ts, id) FILTER (WHERE type = 'pageview'))[1] AS landing,
      (array_agg(path ORDER BY ts DESC, id DESC) FILTER (WHERE type = 'pageview'))[1] AS exit,
      (array_agg(ref ORDER BY ts, id))[1] AS ref,
      (array_agg(utm_source ORDER BY ts, id))[1] AS utm_source,
      (array_agg(utm_campaign ORDER BY ts, id))[1] AS utm_campaign,
      (array_agg(country ORDER BY ts, id))[1] AS country,
      (array_agg(city ORDER BY ts, id))[1] AS city,
      (array_agg(device ORDER BY ts, id))[1] AS device,
      (array_agg(browser ORDER BY ts, id))[1] AS browser,
      (array_agg(os ORDER BY ts, id))[1] AS os,
      bool_or(type = 'convert') AS converted
    FROM ev GROUP BY sid
  )`;

type N = number | string | null;
const n = (v: N) => Number(v ?? 0);

export type Summary = { visitors: number; sessions: number; pageviews: number; bounceRate: number; avgEngagedMs: number; conversions: number };
export type Daily = { day: string; sessions: number; pageviews: number };
export type Count = { key: string; count: number };
export type PageRow = { path: string; views: number; visitors: number; avgScroll: number; avgEngagedMs: number; exits: number };
export type ClickRow = { label: string; href: string; path: string; count: number };
export type FunnelStep = { label: string; sessions: number };
export type SessionRow = {
  sid: string;
  started: Date;
  durationMs: number;
  engagedMs: number;
  pageviews: number;
  clicks: number;
  source: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  converted: boolean;
  events: { ts: Date; type: EventType; path: string; label: string; href: string; num: number | null; ms: number | null }[];
};

export type Report = {
  summary: Summary;
  daily: Daily[];
  pages: PageRow[];
  sources: Count[];
  campaigns: Count[];
  countries: Count[];
  cities: Count[];
  devices: Count[];
  browsers: Count[];
  oses: Count[];
  clicks: ClickRow[];
  funnel: FunnelStep[];
  exits: Count[];
  sessions: SessionRow[];
  mapPages: string[];
};

/** Session source: campaign tag first, then the referring site, else Direct. */
const SOURCE = `coalesce(nullif(utm_source, ''), nullif(ref, ''), 'Direct')`;

export async function loadReport(range: RangeKey): Promise<Report | null> {
  const db = await getDb();
  if (!db) return null;
  const days = Number(range);
  const q = <T,>(body: string, extra: unknown[] = []) => db.query<T>(`WITH ${SESSIONIZED} ${body}`, [days, ...extra]);
  const counts = async (expr: string, limit = 10, where = "true") =>
    (await q<{ key: string; count: N }>(`SELECT ${expr} AS key, count(*) AS count FROM s WHERE ${where} GROUP BY 1 ORDER BY 2 DESC LIMIT ${limit}`)).map(
      (r) => ({ key: r.key ?? "", count: n(r.count) }),
    );

  const [summary] = await q<Record<string, N>>(`
    SELECT count(DISTINCT visitor) AS visitors, count(*) AS sessions, coalesce(sum(pageviews), 0) AS pageviews,
      count(*) FILTER (WHERE pageviews <= 1 AND clicks = 0) AS bounces,
      coalesce(avg(engaged_ms), 0) AS engaged, count(*) FILTER (WHERE converted) AS conversions
    FROM s WHERE pageviews > 0`);

  const daily = await q<{ day: string; sessions: N; pageviews: N }>(`
    SELECT to_char(d, 'YYYY-MM-DD') AS day, count(s.sid) AS sessions, coalesce(sum(s.pageviews), 0) AS pageviews
    FROM generate_series(date_trunc('day', now() - make_interval(days => $1::int - 1)), date_trunc('day', now()), interval '1 day') d
    LEFT JOIN s ON date_trunc('day', s.started) = d AND s.pageviews > 0
    GROUP BY d ORDER BY d`);

  const pages = await q<Record<string, N> & { path: string }>(`
    SELECT p.path, p.views, p.visitors, coalesce(l.scroll, 0) AS scroll, coalesce(l.engaged, 0) AS engaged, coalesce(x.exits, 0) AS exits
    FROM (SELECT path, count(*) AS views, count(DISTINCT visitor) AS visitors FROM ev WHERE type = 'pageview' GROUP BY path) p
    LEFT JOIN (
      -- A page can report several times (each time its tab is hidden): deepest scroll, total time, per session.
      SELECT path, avg(scroll) AS scroll, avg(engaged) AS engaged
      FROM (SELECT sid, path, max(num) AS scroll, sum(ms) AS engaged FROM ev WHERE type = 'leave' GROUP BY sid, path) per
      GROUP BY path
    ) l USING (path)
    LEFT JOIN (SELECT exit AS path, count(*) AS exits FROM s GROUP BY exit) x USING (path)
    ORDER BY p.views DESC LIMIT 25`);

  const clicks = await q<{ label: string; href: string; path: string; count: N }>(`
    SELECT label, href, path, count(*) AS count FROM ev WHERE type = 'click' AND (label <> '' OR href <> '')
    GROUP BY 1, 2, 3 ORDER BY 4 DESC LIMIT 25`);

  // The /get-started interview, then the modal form, as session counts.
  const [f] = await q<Record<string, N>>(`
    SELECT count(*) FILTER (WHERE pageviews > 0) AS all_sessions,
      count(*) FILTER (WHERE sid IN (SELECT sid FROM ev WHERE type = 'pageview' AND path = '/get-started')) AS gs,
      count(*) FILTER (WHERE sid IN (SELECT sid FROM ev WHERE type = 'step' AND label = 'tools')) AS tools,
      count(*) FILTER (WHERE sid IN (SELECT sid FROM ev WHERE type = 'step' AND label = 'pains')) AS pains,
      count(*) FILTER (WHERE sid IN (SELECT sid FROM ev WHERE type = 'step' AND label = 'you')) AS you,
      count(*) FILTER (WHERE sid IN (SELECT sid FROM ev WHERE type = 'convert' AND label = 'get-started')) AS done,
      count(*) FILTER (WHERE sid IN (SELECT sid FROM ev WHERE type = 'convert' AND label = 'inquiry')) AS inquiry
    FROM s`);
  const funnel: FunnelStep[] = [
    { label: "Visited the site", sessions: n(f.all_sessions) },
    { label: "Opened Get started", sessions: n(f.gs) },
    { label: "Gave a website", sessions: n(f.tools) },
    { label: "Picked tools", sessions: n(f.pains) },
    { label: "Picked problems", sessions: n(f.you) },
    { label: "Sent the brief", sessions: n(f.done) },
  ];
  if (n(f.inquiry) > 0) funnel.push({ label: "Sent the contact form", sessions: n(f.inquiry) });

  const recent = await q<Record<string, unknown>>(`
    SELECT sid, started, ended, engaged_ms, pageviews, clicks, ${SOURCE} AS source, country, city, device, browser, os, converted
    FROM s WHERE pageviews > 0 ORDER BY started DESC LIMIT 40`);
  const sids = recent.map((r) => r.sid as string);
  const timeline = sids.length
    ? await q<{ sid: string; ts: string | Date; type: EventType; path: string; label: string; href: string; num: number | null; ms: number | null }>(
        `SELECT sid, ts, type, path, label, href, num, ms FROM ev WHERE sid = ANY($2::text[]) ORDER BY ts, id`,
        [sids],
      )
    : [];

  const mapPages = await q<{ path: string }>(
    `SELECT path FROM ev WHERE type = 'click' AND vw >= 1024 AND y IS NOT NULL GROUP BY path ORDER BY count(*) DESC LIMIT 20`,
  );

  return {
    summary: {
      visitors: n(summary.visitors),
      sessions: n(summary.sessions),
      pageviews: n(summary.pageviews),
      bounceRate: n(summary.sessions) ? n(summary.bounces) / n(summary.sessions) : 0,
      avgEngagedMs: n(summary.engaged),
      conversions: n(summary.conversions),
    },
    daily: daily.map((r) => ({ day: r.day, sessions: n(r.sessions), pageviews: n(r.pageviews) })),
    pages: pages.map((r) => ({
      path: r.path,
      views: n(r.views),
      visitors: n(r.visitors),
      avgScroll: n(r.scroll),
      avgEngagedMs: n(r.engaged),
      exits: n(r.exits),
    })),
    sources: await counts(SOURCE),
    campaigns: await counts(`utm_campaign`, 10, `utm_campaign <> ''`),
    countries: await counts(`country`, 15, `pageviews > 0`),
    cities: await counts(`concat_ws(', ', nullif(city, ''), nullif(country, ''))`, 15, `pageviews > 0 AND city <> ''`),
    devices: await counts(`device`, 5, `pageviews > 0`),
    browsers: await counts(`browser`, 8, `pageviews > 0`),
    oses: await counts(`os`, 8, `pageviews > 0`),
    exits: await counts(`exit`, 10, `pageviews > 0 AND NOT converted`),
    clicks: clicks.map((r) => ({ label: r.label, href: r.href, path: r.path, count: n(r.count) })),
    funnel,
    sessions: recent.map((r) => ({
      sid: r.sid as string,
      started: new Date(r.started as string),
      durationMs: new Date(r.ended as string).getTime() - new Date(r.started as string).getTime(),
      engagedMs: n(r.engaged_ms as N),
      pageviews: n(r.pageviews as N),
      clicks: n(r.clicks as N),
      source: r.source as string,
      country: r.country as string,
      city: r.city as string,
      device: r.device as string,
      browser: r.browser as string,
      os: r.os as string,
      converted: Boolean(r.converted),
      events: timeline
        .filter((t) => t.sid === r.sid)
        .slice(0, 200)
        .map((t) => ({ ts: new Date(t.ts), type: t.type, path: t.path, label: t.label, href: t.href, num: t.num, ms: t.ms })),
    })),
    mapPages: mapPages.map((r) => r.path),
  };
}

export type ClickPoint = { x: number; y: number; vw: number };

/** Desktop clicks on one page, for the click map. */
export async function loadClickMap(range: RangeKey, path: string): Promise<ClickPoint[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.query<{ x: number; y: number; vw: number }>(
    `SELECT x, y, vw FROM events WHERE type = 'click' AND path = $2 AND vw >= 1024 AND x IS NOT NULL AND y IS NOT NULL
     AND ts >= now() - make_interval(days => $1::int) ORDER BY ts DESC LIMIT 3000`,
    [Number(range), path],
  );
  return rows.map((r) => ({ x: Number(r.x), y: Number(r.y), vw: Number(r.vw) }));
}
