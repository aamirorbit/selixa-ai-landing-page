"use client";

import { useState } from "react";
import type { Daily } from "@/lib/analytics";

const label = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Sessions per day as bars; hover (or focus) a day for its numbers. */
export function DailyChart({ data }: { data: Daily[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.sessions), 1);
  const shown = active ?? data.length - 1;
  const d = data[shown];

  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3 text-[0.875rem]" aria-live="polite">
        <span className="text-fg">{d ? label(d.day) : ""}</span>
        <span className="tabular-nums text-fg-2">
          {d?.sessions ?? 0} session{d?.sessions === 1 ? "" : "s"} · {d?.pageviews ?? 0} page view{d?.pageviews === 1 ? "" : "s"}
        </span>
      </div>
      <div className="relative h-40 border-b border-line" onMouseLeave={() => setActive(null)}>
        <span className="absolute -top-1 left-0 text-[0.6875rem] tabular-nums text-fg-3">{max}</span>
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-line" aria-hidden="true" />
        <div className="flex h-full items-end gap-[2px] pl-8">
          {data.map((x, i) => (
            <button
              key={x.day}
              type="button"
              aria-label={`${label(x.day)}: ${x.sessions} sessions, ${x.pageviews} page views`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex h-full flex-1 items-end justify-center"
            >
              <span
                className={`block w-full max-w-12 rounded-t-[4px] transition-colors ${i === shown ? "bg-brand-400" : "bg-brand-400/45 group-hover:bg-brand-400/70"}`}
                style={{ height: x.sessions ? `max(2px, ${(x.sessions / max) * 100}%)` : "0" }}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-1.5 flex justify-between pl-8 text-[0.6875rem] text-fg-3">
        <span>{data[0] ? label(data[0].day) : ""}</span>
        <span>{data.at(-1) ? label(data.at(-1)!.day) : ""}</span>
      </div>
    </div>
  );
}
