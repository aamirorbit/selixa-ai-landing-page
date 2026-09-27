import { Check, CircleAlert, MessageSquare } from "lucide-react";
import type { CSSProperties } from "react";

/*
 * The two faces of the hero split. Both layers share one row grid, so each scrap on the left
 * sits on exactly the same row as its fix on the right: dragging the divider clears the day
 * row by row. Rotations and offsets are static.
 */

const rows = (n: number): CSSProperties => ({ gridTemplateRows: `repeat(${n}, minmax(0, 1fr))` });

/** Without Selixa: tabs, a loose note, a stale card, an unread ping. */
export function DayScraps({ items }: { items: string[] }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-panel">
      {/* A faint mess of outlines behind */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[
          "left-[6%] top-[14%] h-24 w-40 -rotate-[4deg]",
          "left-[30%] top-[58%] h-20 w-52 rotate-[3deg]",
          "-left-6 top-[70%] h-28 w-36 rotate-[2deg]",
          "left-[40%] -top-4 h-16 w-44 -rotate-[2deg]",
          "left-[18%] top-[38%] h-14 w-28 rotate-[1deg]",
        ].map((c) => (
          <span key={c} className={`absolute rounded-[10px] border border-line ${c}`} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-8 top-16 grid px-4 md:px-8" style={rows(items.length)}>
        {items.map((t, i) => (
          <div key={t} className="flex min-w-0 items-center">
            <div className="max-w-[80%] md:max-w-[40%]">{scrap(i, t)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function scrap(i: number, text: string) {
  if (i === 0)
    return (
      <div className="translate-x-2">
        <div className="flex items-end gap-1">
          {[0, 1].map((k) => (
            <span key={k} className={`flex h-8 w-16 items-center rounded-t-[8px] border border-b-0 border-line bg-ink/[0.03] px-2.5 ${k ? "max-md:hidden" : "max-md:w-8"}`}>
              <span className="h-1.5 w-full rounded-full bg-ink/[0.08]" />
            </span>
          ))}
          <span className="flex h-8 min-w-0 items-center rounded-t-[8px] border border-b-0 border-line bg-ink/[0.03] px-3 text-[0.8125rem] text-fg-2">
            <span className="truncate">{text}</span>
          </span>
        </div>
        <div className="h-px bg-line" />
      </div>
    );
  if (i === 1)
    return (
      <div className="relative translate-x-7 -rotate-2 rounded-[6px] border border-line bg-panel-2 px-3 py-2 text-[0.84375rem] text-fg-2 shadow-sm">
        <span className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ink/20" />
        {text}
      </div>
    );
  if (i === 2)
    return (
      <div className="card flex rotate-1 items-center gap-2 px-3 py-2 text-[0.84375rem] text-fg-3">
        <CircleAlert className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <span className="line-through decoration-ink/30">{text}</span>
      </div>
    );
  return (
    <div className="relative flex translate-x-[18px] -rotate-1 items-center gap-2 rounded-[14px] rounded-bl-[4px] bg-ink/[0.05] px-3 py-2 text-[0.84375rem] text-fg-2">
      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
      {text}
      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand-400" />
    </div>
  );
}

/** With Selixa: the same rows, resolved, straight and calm. */
export function DayResolved({ items }: { items: string[] }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-panel bg-[radial-gradient(70%_60%_at_85%_20%,rgb(var(--brand-500-rgb)/0.08),transparent_70%)]">
      <div className="absolute inset-x-0 bottom-8 top-16 grid px-4 md:px-8" style={rows(items.length)}>
        {items.map((t, i) => (
          <div key={t} className="flex min-w-0 items-center justify-end">
            <div className={`flex w-[min(26rem,78%)] items-center gap-3 self-stretch md:w-[min(26rem,46%)] ${i ? "border-t border-line" : ""}`}>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-brand-400/30 bg-brand-500/15 text-brand-300">
                <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="text-[0.9375rem] text-fg">{t}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
