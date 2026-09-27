"use client";

import { Lock } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { SectionHeader, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { ROADMAP_COPY } from "./copy";

const P = ROADMAP_COPY.products;
const N = P.list.length;

/** Every product keeps its own roadmap: four boards stacked like sheets; one in front. */
export function ProductDeck() {
  // Auto-advances while in view, until the visitor picks a tab.
  const { ref, step } = useSequence(P.list.map(() => 3200));
  const [picked, setPicked] = useState<number | null>(null);
  const active = picked ?? step % N;

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : N - 1)) % N;
    setPicked(next);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <section id="products" className="relative py-24 sm:py-32">
      <SectionHeader num="03" label={P.label} title={P.headline} lead={P.line} align="center" className="mx-auto" />

      <div ref={ref} data-reveal style={d(120)} className="mt-12">
        <div role="tablist" aria-label={P.label} className="flex justify-center gap-1 sm:gap-2">
          {P.list.map((prod, i) => (
            <button
              key={prod.name}
              type="button"
              role="tab"
              id={`deck-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`deck-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setPicked(i)}
              onFocus={() => picked === null && setPicked(active)}
              onKeyDown={onKey}
              className={`tab gap-2 max-sm:gap-1.5 max-sm:px-2.5 ${i === active ? "tab-active" : ""}`}
            >
              <span
                className={`grid h-[18px] w-[18px] place-items-center rounded-[5px] text-[0.625rem] transition-colors ${
                  i === active ? "bg-brand-500 text-[var(--brand-on)]" : "bg-ink/[0.14] text-fg-2"
                }`}
                aria-hidden="true"
              >
                {prod.mark}
              </span>
              {prod.name}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mt-8 h-[260px] max-w-[560px] md:h-[248px]">
          {P.list.map((prod, i) => {
            const k = (i - active + N) % N; // depth: 0 in front
            const front = k === 0;
            return (
              <div
                key={prod.name}
                id={`deck-panel-${i}`}
                role="tabpanel"
                aria-labelledby={`deck-tab-${i}`}
                aria-hidden={!front}
                className="window absolute inset-x-0 top-0 h-full origin-top p-5 transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] [--lift:8px] md:[--lift:14px]"
                style={{
                  transform: `translateY(calc(var(--lift) * ${-k})) scale(${1 - 0.04 * k})`,
                  opacity: 1 - 0.24 * k,
                  zIndex: N - k,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-[6px] text-[0.6875rem] ${front ? "bg-brand-500 text-[var(--brand-on)]" : "bg-ink/[0.14] text-fg-2"}`}
                      aria-hidden="true"
                    >
                      {prod.mark}
                    </span>
                    <span className="text-[0.9375rem] text-fg">{prod.name}</span>
                  </span>
                  <span className="text-[0.75rem] text-fg-3">{prod.updated}</span>
                </div>
                <p className="mt-5 text-[0.6875rem] uppercase tracking-[0.14em] text-brand-300">{ROADMAP_COPY.columns.now}</p>
                <ul className="mt-2 flex flex-col gap-2">
                  {prod.now.map((t) => (
                    <li key={t} className="card flex h-12 items-center rounded-[12px]! bg-panel px-3.5 text-[0.875rem] text-fg">
                      {t}
                    </li>
                  ))}
                </ul>
                <span className={`tag mt-4 ${front ? "border-brand-400/30 bg-brand-500/10 text-brand-200" : ""}`}>
                  <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                  {P.isolated}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
