"use client";

import { ArrowDown, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Stage, Typed } from "@/components/landing/demo";
import { Orb, Section, SectionHeader, d } from "@/components/landing/ui";
import { useScrollSequence } from "@/components/landing/useScrollSequence";

export type MergeItem = { label: string; icon: LucideIcon };
export type MergeSide = { tag: string; mark: ReactNode; question: string; items: MergeItem[] };

type Props = {
  id: string;
  num: string;
  label: string;
  title: ReactNode;
  left: MergeSide;
  right: MergeSide;
  center: {
    eyebrow: string;
    question: string;
    /** Typed out as the demo's answer. */
    answer: string;
    /** Small label above the answer, e.g. "High-confidence opportunity". */
    verdict?: string;
    /** Evidence tags; `lit` ones carry the brand colour on their source. */
    evidence: { source: string; text: string; lit?: boolean }[];
  };
};

/**
 * Two kinds of context meeting in one answer: a card each side, threads flowing into a
 * central card where the answer types and its evidence lands. Stacks on small screens,
 * with the answer last.
 */
export function TwoSidesMerge({ id, num, label, title, left, right, center }: Props) {
  const rows = Math.max(left.items.length, right.items.length);
  // both sides light row by row, the threads flow, the answer types, evidence lands, hold
  const { ref, step, still } = useScrollSequence([300, ...Array.from({ length: rows }, () => 260), 600, 1700, ...center.evidence.map(() => 240), 5000]);
  const FLOW = 1 + rows;
  const ANSWERING = FLOW + 1;
  const CITE = ANSWERING + 1;

  const thread = (dPath: string) => (
    <g>
      <path d={dPath} fill="none" data-on={step >= FLOW} className="line-in" stroke="rgb(var(--brand-400-rgb))" strokeOpacity="0.5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {!still && step >= FLOW && (
        <path d={dPath} fill="none" className="flow" stroke="rgb(var(--brand-300-rgb))" strokeOpacity="0.75" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      )}
    </g>
  );
  const threads = (mirror: boolean) => (
    <svg viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true" className={`hidden h-full min-h-[14rem] w-full lg:block ${mirror ? "-scale-x-100" : ""}`}>
      {thread("M0 60 C 50 60, 50 100, 100 100")}
      {thread("M0 140 C 50 140, 50 100, 100 100")}
    </svg>
  );

  return (
    <Section id={id}>
      <SectionHeader num={num} label={label} title={title} align="center" className="mx-auto" />

      <div ref={ref} className="relative mt-16 grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1.15fr)_4rem_minmax(0,1fr)] lg:gap-0">
        <Side side={left} step={step} still={still} align="left" />
        {threads(false)}

        <div className="order-last lg:order-none">
          <ArrowDown className="mx-auto mb-6 h-5 w-5 text-brand-400 lg:hidden" strokeWidth={1.5} aria-hidden="true" />
          <div data-reveal style={d(120)} className={`window card-lit p-6 sm:p-7 ${!still && step >= ANSWERING ? "is-live" : ""}`}>
            <div className="flex flex-col items-center text-center">
              <Orb size={56} />
              <p className="mt-5 text-[0.75rem] uppercase tracking-[0.2em] text-brand-300">{center.eyebrow}</p>
              <p className="mt-2 text-[clamp(1.5rem,2.4vw,1.875rem)] leading-[1.15] tracking-[-0.03em] text-fg">{center.question}</p>
            </div>
            <div className="mt-6 rounded-[14px] border border-line bg-well p-4">
              {center.verdict && (
                <Stage as="p" on={step >= ANSWERING} className="mb-2 flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-brand-300">
                  <span className="live-dot" aria-hidden="true" />
                  {center.verdict}
                </Stage>
              )}
              <p className="text-[1rem] leading-[1.5] text-fg">
                <Typed text={center.answer} on={step >= ANSWERING} still={still} cps={40} />
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {center.evidence.map((e, i) => (
                  <Stage as="li" key={e.text} on={step >= CITE + i} className="tag">
                    <span className={e.lit ? "text-brand-300" : "text-fg"}>{e.source}</span>
                    {e.text}
                  </Stage>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {threads(true)}
        <Side side={right} step={step} still={still} align="right" />
      </div>
    </Section>
  );
}

function Side({ side, step, still, align }: { side: MergeSide; step: number; still: boolean; align: "left" | "right" }) {
  const flip = align === "right" ? "lg:flex-row-reverse" : "";
  return (
    <div data-reveal className="card flex flex-col p-5 sm:p-6">
      <div className={`flex items-center gap-2.5 ${flip}`}>
        {side.mark}
        <span className="text-[0.75rem] uppercase tracking-[0.18em] text-fg">{side.tag}</span>
      </div>
      <p className={`mt-3 text-[1.25rem] tracking-[-0.02em] text-fg ${align === "right" ? "lg:text-right" : ""}`}>{side.question}</p>
      <ul className="mt-5 flex flex-col">
        {side.items.map(({ label, icon: Icon }, i) => {
          const on = still || step > i;
          return (
            <li key={label} className={`flex items-center gap-3 border-t border-line py-2.5 text-[0.9375rem] transition-colors duration-500 ${flip} ${on ? "text-fg" : "text-fg-3"}`}>
              <Icon className={`h-4 w-4 shrink-0 transition-colors duration-500 ${on ? "text-brand-400" : "text-fg-3"}`} strokeWidth={1.6} aria-hidden="true" />
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
