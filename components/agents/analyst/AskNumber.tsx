"use client";

import { Search } from "lucide-react";
import { Stage, Typed } from "@/components/landing/demo";
import { LOGOS } from "@/components/landing/logos";
import { Orb, SectionHeader, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { ChartLine } from "@/components/site/ChartLine";
import { SourceChip } from "@/components/site/SourceChip";
import { ANALYST_COPY, RETENTION } from "./copy";

const Q = ANALYST_COPY.ask;

//             reset type  enter think s1   s2   chart srcs follow hold
const SCRIPT = [400, 1100, 250, 700, 350, 350, 650, 300, 250, 3000];
const S = { type: 1, enter: 2, think: 3, s1: 4, s2: 5, chart: 6, sources: 7, follow: 8 };

/** Ask a number: a question types, Selixa answers with a chart and its sources. */
export function AskNumber() {
  const { ref, step, still } = useSequence(SCRIPT);
  const at = (n: number) => still || step >= n;
  const typing = !still && step >= S.type;
  const thinking = !still && step === S.think;

  return (
    <section id="ask" className="relative py-24 sm:py-32">
      <SectionHeader num="02" label={Q.label} title={Q.headline} align="center" className="mx-auto" />

      {/* Everything is in the DOM from the start, so the window never changes height. */}
      <div ref={ref} data-reveal style={d(120)} className="window mx-auto mt-14 max-w-[760px] rounded-[20px]!">
        <div className="flex min-h-14 items-start gap-3 border-b border-line px-5 py-3 sm:items-center">
          {/* Aligned to the first line when the question wraps on phones */}
          <Search className="mt-[4px] h-4 w-4 shrink-0 text-fg-3 sm:mt-0" strokeWidth={1.75} aria-hidden="true" />
          <span className="relative min-w-0 flex-1 text-[0.9375rem] sm:text-[1rem]">
            {/* Reserve the question's full height (it may wrap on phones) */}
            <span className="invisible block" aria-hidden="true">
              {Q.question}
            </span>
            <span className="absolute inset-0">
              {typing || still ? (
                <span className="text-fg">
                  <Typed text={Q.question} on={typing} still={still} cps={34} />
                </span>
              ) : (
                <span className="text-fg-3">{Q.placeholder}</span>
              )}
            </span>
          </span>
          <span className="relative grid" aria-hidden="true">
            <span className="tag px-2 py-0.5 text-[0.6875rem]">⏎</span>
            <span
              className={`tag absolute inset-0 justify-center border-brand-400/40 bg-brand-500/15 px-2 py-0.5 text-[0.6875rem] text-brand-200 transition-opacity duration-200 ${
                !still && step === S.enter ? "opacity-100" : "opacity-0"
              }`}
            >
              ⏎
            </span>
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <p className="flex items-center gap-2 text-[0.75rem] text-fg-3">
            <Orb size={24} />
            {Q.sender}
            <span className={`thinking ml-1 transition-opacity duration-200 ${thinking ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </p>
          <p className="mt-3 text-[1rem] leading-[1.55] text-fg sm:text-[1.0625rem]">
            <Stage as="span" on={at(S.s1)}>
              {Q.answer[0]}
            </Stage>{" "}
            <Stage as="span" on={at(S.s2)}>
              {Q.answer[1]}
            </Stage>
          </p>

          <div className="card mt-4 p-4">
            <p className="text-[0.75rem] text-fg-3">{Q.chartTitle}</p>
            <div className="mt-3 h-[120px] sm:h-[140px]">
              <ChartLine
                data={RETENTION}
                yDomain={[39, 48]}
                xTicks={[
                  { index: 0, label: "Apr" },
                  { index: 5, label: "May" },
                  { index: 12, label: "Jun" },
                ]}
                height="100%"
                markers={[{ index: 5, label: Q.marker, tone: "brand", className: `transition-opacity duration-300 ${at(S.chart) ? "opacity-100" : "opacity-0"}`, style: { transitionDelay: at(S.chart) && !still ? "550ms" : "0ms" } }]}
                reveal="wipe"
                revealMs={600}
                on={at(S.chart)}
                still={still}
                insets={{ top: 6, right: 6, bottom: 22, left: 6 }}
                labelSize={11}
                ariaLabel="Week-4 retention, weekly, April to June: about 41% until May 6, then rising to 46%."
              />
            </div>
          </div>

          <ul className="mt-4 flex flex-wrap gap-2">
            {Q.sources.map((name, i) => (
              <Stage key={name} as="li" on={at(S.sources)} style={{ transitionDelay: at(S.sources) && !still ? `${i * 60}ms` : "0ms" }}>
                <SourceChip logo={LOGOS.find((l) => l.name === name)!} label={name} lit={at(S.sources)} />
              </Stage>
            ))}
          </ul>
          <Stage on={at(S.follow)} className="mt-3 flex flex-wrap gap-2">
            {Q.followUps.map((f) => (
              <span key={f} className="tag text-fg-3">
                {f}
              </span>
            ))}
          </Stage>
        </div>
      </div>
    </section>
  );
}
