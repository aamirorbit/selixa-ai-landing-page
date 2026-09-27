import { ArrowRight, Compass } from "lucide-react";
import { Count } from "@/components/landing/demo";
import { LOGOS } from "@/components/landing/logos";
import { SourceChip } from "@/components/site/SourceChip";
import { RESEARCH_COPY } from "./copy";

const B = RESEARCH_COPY.brief;

/** The synthesis: every thread runs into this one pinned brief. */
export function BriefCard({ on, still }: { on: boolean; still: boolean }) {
  return (
    <div className="window relative w-full overflow-visible! rounded-[20px]! text-left">
      {/* The last thing pinned to the board */}
      <span aria-hidden="true" className="absolute -top-[5px] left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brand-500 shadow-[0_2px_4px_rgb(var(--shadow-rgb)/0.3)]" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[0.75rem] text-fg-3">
            <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-brand-500 text-[0.6875rem] text-[var(--brand-on)]" aria-hidden="true">
              A
            </span>
            {B.label}
          </span>
          <span className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">{B.confidence}</span>
        </div>
        <p className="mt-4 text-[1.3125rem] tracking-[-0.015em] text-fg">{B.title}</p>
        <p className="mt-2 text-[0.9375rem] leading-[1.55] text-fg-2">{B.finding}</p>

        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="flex items-end gap-2.5">
            <span className="font-display text-[2.75rem] font-light leading-none text-fg">
              {still ? B.evidence : <Count to={B.evidence} on={on} ms={500} />}
            </span>
            <span className="pb-1 text-[0.8125rem] text-fg-3">{B.evidenceLabel}</span>
          </p>
          <ul className="grid grid-cols-4 divide-x divide-line">
            {B.breakdown.map((s) => (
              <li key={s.label} className="flex flex-col px-3 first:pl-0 last:pr-0">
                <span className="text-[0.9375rem] tabular-nums text-fg">{s.n}</span>
                <span className="text-[0.6875rem] leading-tight text-fg-3">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {B.sources.map((name, i) => (
            <li key={name} className="transition-opacity" style={{ transitionDelay: `${i * 60}ms` }}>
              <SourceChip logo={LOGOS.find((l) => l.name === name)!} label={name} size="sm" lit={on || still} />
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="flex h-11 items-center gap-2 border-t border-line px-5 text-[0.8125rem] text-fg-2 sm:px-6">
        <Compass className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.75} />
        {B.footer}
        <ArrowRight className="ml-auto h-3.5 w-3.5 text-fg-3" strokeWidth={2} />
      </div>
    </div>
  );
}
