import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { WindowBar, d } from "@/components/landing/ui";
import { Sparkline } from "@/components/site/Sparkline";
import { SectionHeader } from "@/components/landing/ui";
import { ANALYST_COPY, METRICS, type Metric } from "./copy";

const M = ANALYST_COPY.metrics;
const DIR = { up: ArrowUp, down: ArrowDown, flat: Minus };
const COLS = "grid-cols-[minmax(0,1.5fr)_5.5rem_4.5rem_8rem]";

function Change({ m, className = "" }: { m: Metric; className?: string }) {
  const Icon = DIR[m.dir];
  return (
    <span className={`flex items-center justify-end gap-1 tabular-nums ${m.anomaly ? "text-brand-300" : "text-fg-2"} ${className}`}>
      <Icon className={`h-2.5 w-2.5 ${m.anomaly ? "" : "text-fg-3"}`} strokeWidth={2.25} aria-hidden="true" />
      {m.change}
    </span>
  );
}

function Name({ m }: { m: Metric }) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-[0.875rem] text-fg">
      <span className="truncate">{m.name}</span>
      {m.name === "Activation" && <span className="live-dot shrink-0" aria-hidden="true" />}
    </span>
  );
}

/** Anomalies carry a 2px brand bar on their left edge; nothing else is crimson here. */
const Bar = ({ m }: { m: Metric }) => (m.anomaly ? <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-brand-500" /> : null);

function Table({ rows, start }: { rows: Metric[]; start: number }) {
  return (
    <div role="table" aria-label={M.headline} className="min-w-0">
      <div role="row" className={`grid h-9 items-center px-5 text-[0.6875rem] uppercase tracking-[0.12em] text-fg-3 ${COLS}`}>
        {M.columns.map((c, i) => (
          <span key={c} role="columnheader" className={i === 0 ? "" : "text-right"}>
            {c}
          </span>
        ))}
      </div>
      {rows.map((m, i) => (
        <div
          key={m.name}
          role="row"
          data-reveal
          style={d((start + i) * 25)}
          className={`relative grid h-12 items-center border-t border-line px-5 ${COLS}`}
        >
          <Bar m={m} />
          <span role="cell">
            <Name m={m} />
          </span>
          <span role="cell" className="text-right text-[0.9375rem] tabular-nums text-fg">
            {m.now}
          </span>
          <span role="cell" className="text-[0.8125rem]">
            <Change m={m} />
          </span>
          <span role="cell" className="flex justify-end">
            <Sparkline data={m.points} width={112} height={24} highlightFrom={m.anomaly ? 5 : undefined} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Everything else it watches: a dense, still table. Tabular Inter numerals, no green/red. */
export function MetricsTable() {
  return (
    <section id="metrics" className="relative py-24 sm:py-32">
      <SectionHeader num="03" label={M.label} title={M.headline} />
      <div data-reveal className="window mt-14">
        <WindowBar>
          <span className="flex items-center gap-2 text-fg-2">
            <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-brand-500 text-[0.6875rem] text-[var(--brand-on)]" aria-hidden="true">
              A
            </span>
            <span className="hidden md:inline">{M.product}</span>
            <span className="md:hidden">{M.phoneBar}</span>
          </span>
        </WindowBar>

        {/* md+: one table (md–lg) or two side by side (lg+) */}
        <div className="hidden md:block lg:hidden">
          <Table rows={METRICS} start={0} />
        </div>
        <div className="hidden grid-cols-2 divide-x divide-line lg:grid">
          <Table rows={METRICS.slice(0, 6)} start={0} />
          <Table rows={METRICS.slice(6)} start={6} />
        </div>

        {/* Phone: two-line rows */}
        <ul className="md:hidden">
          {METRICS.map((m, i) => (
            <li key={m.name} data-reveal style={d(i * 25)} className={`relative grid h-16 grid-cols-[1fr_auto] content-center gap-x-4 gap-y-1.5 px-4 ${i ? "border-t border-line" : ""}`}>
              <Bar m={m} />
              <Name m={m} />
              <span className="text-right text-[0.9375rem] tabular-nums text-fg">{m.now}</span>
              <Sparkline data={m.points} width={96} height={18} highlightFrom={m.anomaly ? 5 : undefined} />
              <Change m={m} className="text-[0.75rem]" />
            </li>
          ))}
        </ul>

        <p className="border-t border-line px-5 py-3 text-[0.75rem] text-fg-3">{M.footer}</p>
      </div>
    </section>
  );
}
