import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { isRange, loadClickMap, loadReport, RANGES, type Count, type RangeKey, type SessionRow } from "@/lib/analytics";
import { ClickMap } from "./ClickMap";
import { DailyChart } from "./DailyChart";

export const metadata: Metadata = {
  title: "Analytics — Selixa admin",
  robots: { index: false, follow: false },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminAnalytics(props: PageProps<"/admin/analytics">) {
  await requireAdmin();
  const params = await props.searchParams;
  const rawRange = first(params.range);
  const range: RangeKey = isRange(rawRange) ? rawRange : "7";
  const report = await loadReport(range);

  if (!report) {
    return (
      <div className="flex flex-1 flex-col pb-16 pt-12">
        <Header range={range} />
        <p className="mt-6 rounded-[12px] border border-amber-400/25 bg-amber-400/5 px-4 py-3 text-[0.9rem] leading-[1.55] text-amber-200/90">
          No database is configured, so nothing is being recorded. Set <code>DATABASE_URL</code> and redeploy.
        </p>
      </div>
    );
  }

  const mapPath = first(params.map) ?? report.mapPages[0] ?? "";
  const points = mapPath ? await loadClickMap(range, mapPath) : [];
  const s = report.summary;
  const href = (patch: Record<string, string>) => `/admin/analytics?${new URLSearchParams({ range, ...(mapPath ? { map: mapPath } : {}), ...patch })}`;

  return (
    <div className="flex flex-1 flex-col pb-16 pt-12">
      <Header range={range} />

      <section aria-label="Totals" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Visitors" value={fmt(s.visitors)} hint="Unique per day, summed" />
        <Stat label="Sessions" value={fmt(s.sessions)} />
        <Stat label="Page views" value={fmt(s.pageviews)} />
        <Stat label="Bounce rate" value={pct(s.bounceRate)} hint="One page, no clicks" />
        <Stat label="Avg engaged time" value={duration(s.avgEngagedMs)} hint="Tab visible, per session" />
        <Stat label="Conversions" value={fmt(s.conversions)} hint={s.sessions ? `${pct(s.conversions / s.sessions)} of sessions` : undefined} />
      </section>

      <Card title="Sessions per day" className="mt-4">
        <DailyChart data={report.daily} />
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Where people drop off" note="Sessions reaching each step of /get-started">
          <Funnel steps={report.funnel} />
        </Card>
        <Card title="Last page before leaving" note="Sessions that didn't convert">
          <BarList rows={report.exits} empty="No exits yet." />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Sources" note="Campaign tag, else referring site">
          <BarList rows={report.sources} />
        </Card>
        <Card title="Countries">
          <BarList rows={report.countries.map((c) => ({ ...c, key: countryLabel(c.key) }))} />
        </Card>
        <Card title="Cities">
          <BarList rows={report.cities} empty="City appears once deployed on Vercel." />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Devices">
          <BarList rows={report.devices} />
        </Card>
        <Card title="Browsers">
          <BarList rows={report.browsers} />
        </Card>
        <Card title="Operating systems">
          <BarList rows={report.oses} />
        </Card>
        <Card title="Campaigns" note="utm_campaign">
          <BarList rows={report.campaigns} empty="No tagged links yet." />
        </Card>
      </div>

      <Card title="Pages" className="mt-4" flush>
        <Table
          head={["Page", "Views", "Visitors", "Avg scroll", "Avg time", "Exits"]}
          rows={report.pages.map((p) => [<code key="p">{p.path}</code>, fmt(p.views), fmt(p.visitors), `${Math.round(p.avgScroll)}%`, duration(p.avgEngagedMs), fmt(p.exits)])}
          empty="No page views yet."
        />
      </Card>

      <Card title="What people click" className="mt-4" flush>
        <Table
          head={["Clicked", "Goes to", "On page", "Clicks"]}
          rows={report.clicks.map((c) => [c.label || <span className="text-fg-3">—</span>, c.href ? <code>{c.href}</code> : <span className="text-fg-3">—</span>, <code key="p">{c.path}</code>, fmt(c.count)])}
          empty="No clicks yet."
        />
      </Card>

      <Card title="Click map" note="Desktop clicks, drawn on the live page. Positions are approximate." className="mt-4">
        {report.mapPages.length === 0 ? (
          <p className="py-10 text-center text-[0.9375rem] text-fg-3">No desktop clicks yet.</p>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {report.mapPages.map((p) => (
                <Link key={p} href={href({ map: p })} scroll={false} aria-current={p === mapPath ? "page" : undefined} className={`tab py-1 text-[0.8125rem] ${p === mapPath ? "tab-active" : ""}`}>
                  {p}
                </Link>
              ))}
            </div>
            <ClickMap key={`${mapPath}-${range}`} path={mapPath} points={points} />
          </>
        )}
      </Card>

      <Card title="Recent sessions" note="Newest first. Open one to see the journey." className="mt-4" flush>
        {report.sessions.length === 0 ? (
          <p className="px-6 py-10 text-center text-[0.9375rem] text-fg-3">No sessions yet.</p>
        ) : (
          <ul>
            {report.sessions.map((x) => (
              <Session key={x.sid} session={x} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Header({ range }: { range: RangeKey }) {
  return (
    <>
      <div>
        <h1 className="font-display text-[2.5rem] font-light leading-none tracking-[-0.04em] text-fg sm:text-[3rem]">Analytics</h1>
        <p className="mt-3 max-w-[44rem] text-[1rem] text-fg-2">
          First-party and cookieless. No IPs or personal details are stored; a visitor can&apos;t be followed across days.
        </p>
      </div>
      <nav aria-label="Time range" className="mt-8 flex flex-wrap gap-2">
        {(Object.keys(RANGES) as RangeKey[]).map((k) => (
          <Link key={k} href={`/admin/analytics?range=${k}`} aria-current={k === range ? "page" : undefined} className={`tab ${k === range ? "tab-active" : ""}`}>
            {RANGES[k]}
          </Link>
        ))}
      </nav>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="panel rounded-[16px] px-5 py-4 before:hidden">
      <div className="text-[0.75rem] tracking-[0.06em] text-fg-3 uppercase">{label}</div>
      <div className="mt-2 text-[1.75rem] leading-none tracking-[-0.02em] text-fg tabular-nums">{value}</div>
      {hint && <div className="mt-1.5 text-[0.75rem] text-fg-3">{hint}</div>}
    </div>
  );
}

function Card({ title, note, className = "", flush, children }: { title: string; note?: string; className?: string; flush?: boolean; children: React.ReactNode }) {
  return (
    <section className={`panel overflow-hidden rounded-[16px] before:hidden ${className}`}>
      <header className="px-6 pt-5">
        <h2 className="text-[1rem] font-medium text-fg">{title}</h2>
        {note && <p className="mt-0.5 text-[0.8125rem] text-fg-3">{note}</p>}
      </header>
      <div className={flush ? "mt-3" : "px-6 pb-6 pt-4"}>{children}</div>
    </section>
  );
}

/** Ranked counts with a share bar (one hue: magnitude only). */
function BarList({ rows, empty = "Nothing yet." }: { rows: Count[]; empty?: string }) {
  if (!rows.length) return <p className="py-6 text-center text-[0.875rem] text-fg-3">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.count), 1);
  const total = rows.reduce((a, r) => a + r.count, 0);
  return (
    <ul className="flex flex-col gap-1.5">
      {rows.map((r) => (
        <li key={r.key} className="relative flex items-center justify-between gap-3 rounded-[6px] px-2.5 py-1.5 text-[0.875rem]" title={`${r.key || "Unknown"}: ${r.count} (${pct(r.count / total)})`}>
          <span aria-hidden="true" className="absolute inset-y-0 left-0 rounded-[6px] bg-brand-400/15" style={{ width: `${(r.count / max) * 100}%` }} />
          <span className="relative truncate text-fg-2">{r.key || "Unknown"}</span>
          <span className="relative tabular-nums text-fg">{fmt(r.count)}</span>
        </li>
      ))}
    </ul>
  );
}

function Funnel({ steps }: { steps: { label: string; sessions: number }[] }) {
  const top = Math.max(steps[0]?.sessions ?? 0, 1);
  return (
    <ol className="flex flex-col gap-2.5">
      {steps.map((st, i) => {
        const prev = i > 0 ? steps[i - 1].sessions : null;
        const kept = prev ? st.sessions / prev : null;
        return (
          <li key={st.label}>
            <div className="flex items-baseline justify-between gap-3 text-[0.875rem]">
              <span className="text-fg-2">{st.label}</span>
              <span className="tabular-nums text-fg">
                {fmt(st.sessions)}
                {kept !== null && prev ? <span className="ml-2 text-[0.75rem] text-fg-3">{pct(kept)} kept</span> : null}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-[rgb(var(--ink-rgb)/0.06)]">
              <div className="h-full rounded-full bg-brand-400" style={{ width: `${(st.sessions / top) * 100}%` }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (!rows.length) return <p className="px-6 pb-8 pt-4 text-center text-[0.9375rem] text-fg-3">{empty}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-[0.875rem]">
        <thead>
          <tr className="text-[0.75rem] tracking-[0.06em] text-fg-3 uppercase">
            {head.map((h, i) => (
              <th key={h} className={`th ${i > 0 && i === head.length - 1 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="row">
              {r.map((c, j) => (
                <td key={j} className={`td text-fg-2 ${j > 0 && j === r.length - 1 ? "text-right tabular-nums text-fg" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Session({ session: x }: { session: SessionRow }) {
  const t0 = x.started.getTime();
  const place = [x.city, countryLabel(x.country)].filter(Boolean).join(", ") || "Unknown place";
  return (
    <li className="border-t border-line">
      <details className="group">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-5 gap-y-1 px-6 py-3.5 text-[0.875rem] marker:content-none hover:bg-[rgb(var(--ink-rgb)/0.025)]">
          <time dateTime={x.started.toISOString()} className="w-28 text-fg" title={x.started.toLocaleString("en-GB")}>
            {x.started.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </time>
          <span className="min-w-40 text-fg-2">{place}</span>
          <span className="text-fg-3">
            {x.device} · {x.browser} · {x.os}
          </span>
          <span className="text-fg-3">from {x.source}</span>
          <span className="text-fg-3">
            {x.pageviews} page{x.pageviews === 1 ? "" : "s"} · {x.clicks} click{x.clicks === 1 ? "" : "s"} · {duration(x.engagedMs)}
          </span>
          {x.converted && <span className="status status-contacted">converted</span>}
        </summary>
        <ol className="flex flex-col gap-1 px-6 pb-4 pl-10 text-[0.8125rem]">
          {x.events.map((e, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-14 shrink-0 tabular-nums text-fg-3">+{duration(e.ts.getTime() - t0)}</span>
              <span className="text-fg-2">{eventText(e)}</span>
            </li>
          ))}
        </ol>
      </details>
    </li>
  );
}

function eventText(e: SessionRow["events"][number]): string {
  switch (e.type) {
    case "pageview":
      return `Opened ${e.path}`;
    case "click":
      return `Clicked “${e.label || "(unlabeled)"}”${e.href ? ` → ${e.href}` : ""} on ${e.path}`;
    case "leave":
      return `Left ${e.path} after ${duration(e.ms ?? 0)}, scrolled ${e.num ?? 0}%`;
    case "step":
      return `Reached step “${e.label}” on ${e.path}`;
    case "convert":
      return `Converted: ${e.label}`;
  }
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
function countryLabel(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return code ? code : "Unknown";
  const flag = String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
  let name = code;
  try {
    name = regionNames.of(code) ?? code;
  } catch {}
  return `${flag} ${name}`;
}

const fmt = (v: number) => v.toLocaleString("en-US");
const pct = (v: number) => `${Math.round(v * 100)}%`;
function duration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
