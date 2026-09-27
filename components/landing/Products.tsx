"use client";

import { Check, ChevronsUpDown, Lock, Plus } from "lucide-react";
import { useState } from "react";
import { Section, SectionHeader, WindowBar, d } from "./ui";
import { useSequence } from "./useSequence";

type Product = {
  name: string;
  mark: string;
  meetings: number;
  feedback: number;
  roadmap: number;
  metric: string;
  decisions: number;
};

// Sample products with illustrative counts. Each keeps its own, separate context.
const PRODUCTS: Product[] = [
  { name: "Atlas", mark: "A", meetings: 38, feedback: 412, roadmap: 17, metric: "+4.2%", decisions: 26 },
  { name: "Beacon", mark: "B", meetings: 21, feedback: 156, roadmap: 11, metric: "+1.8%", decisions: 14 },
  { name: "Cove", mark: "C", meetings: 44, feedback: 289, roadmap: 23, metric: "+0.9%", decisions: 31 },
  { name: "Drift", mark: "D", meetings: 17, feedback: 97, roadmap: 9, metric: "+2.9%", decisions: 12 },
];

const SHADES = ["bg-ink/[0.14]", "bg-ink/[0.09]", "bg-ink/[0.2]", "bg-ink/[0.06]"];

export function Products() {
  // Cycles through the products on its own until someone picks one.
  const { ref, step } = useSequence(PRODUCTS.map(() => 2600));
  const [picked, setPicked] = useState<number | null>(null);
  const active = picked ?? step;
  const setActive = setPicked;
  const p = PRODUCTS[active];

  const stats = [
    { label: "Meetings", value: p.meetings, note: "this quarter" },
    { label: "Feedback", value: p.feedback, note: "notes" },
    { label: "Roadmap", value: p.roadmap, note: "items" },
    { label: "Analytics", value: p.metric, note: "activation, 30d" },
    { label: "Decisions", value: p.decisions, note: "on record" },
  ];

  return (
    <Section id="products">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <SectionHeader
            num="07"
            label="Multiple products"
            title="Every product gets its own context."
            lead="Run all your products in one workspace. Their meetings, feedback and decisions never mix."
          />
        </div>

        <div ref={ref} data-reveal style={d(120)} className="window">
          <WindowBar>Workspace</WindowBar>
          <div className="grid grid-cols-1 sm:grid-cols-[13rem_minmax(0,1fr)]">
            <div className="border-b border-line p-3 sm:border-b-0 sm:border-r">
              <p className="flex items-center justify-between px-2 pb-2 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">
                Products
                <ChevronsUpDown className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              </p>
              <ul role="listbox" aria-label="Products" className="flex flex-col gap-0.5">
                {PRODUCTS.map((item, i) => (
                  <li key={item.name} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className={`flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left text-[0.875rem] transition-colors duration-200 ${
                        i === active ? "bg-ink/[0.07] text-fg" : "text-fg-2 hover:bg-ink/[0.03] hover:text-fg"
                      }`}
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-[8px] text-[0.75rem] font-medium text-fg transition-colors duration-500 ${
                          i === active ? "bg-brand-500 text-white" : SHADES[i]
                        }`}
                        aria-hidden="true"
                      >
                        {item.mark}
                      </span>
                      <span className="flex-1 truncate">{item.name}</span>
                      {i === active && <Check className="h-3.5 w-3.5 text-brand-300" strokeWidth={2} aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-1 flex items-center gap-3 rounded-[10px] px-2 py-2 text-[0.875rem] text-fg-3">
                <span className="grid h-7 w-7 place-items-center rounded-[8px] border border-dashed border-line-strong" aria-hidden="true">
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                New product
              </p>
            </div>

            <div className="p-5 sm:p-6" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.75rem] text-fg-3">Context for</p>
                  <p key={p.name} className="reveal mt-1 text-[1.5rem] tracking-[-0.025em] text-fg">
                    {p.name}
                  </p>
                </div>
                <span className="tag mt-1 border-brand-400/30 bg-brand-500/10 text-brand-200">
                  <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                  Isolated
                </span>
              </div>
              <ul key={`${p.name}-stats`} className="mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-3">
                {stats.map((s, i) => (
                  <li key={s.label} className="reveal card px-4 py-3.5" style={d(i * 50)}>
                    <p className="text-[0.75rem] text-fg-3">{s.label}</p>
                    <p className="mt-2 font-display text-[1.625rem] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
                      {s.value}
                    </p>
                    <p className="mt-1.5 text-[0.6875rem] text-fg-3">{s.note}</p>
                  </li>
                ))}
                <li className="reveal card card-lit flex flex-col justify-center px-4 py-3.5" style={d(250)}>
                  <p className="flex items-center gap-1.5 text-[0.75rem] text-brand-300">
                    <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                    Separate memory
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] leading-snug text-fg-2">Nothing shared with other products</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
