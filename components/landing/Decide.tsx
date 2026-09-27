"use client";

import { ArrowRight, ArrowUp, Command, FileText, Sparkles, TrendingDown } from "lucide-react";
import { Count, Stage, Typed } from "./demo";
import { Orb, Section, SectionHeader, WindowBar, d } from "./ui";
import { useSequence } from "./useSequence";

const QUESTION = "What should we build next?";

const WHY = [
  { value: 4, label: "customer conversations" },
  { value: 8, suffix: "%", label: "drop in activation", down: true },
  { value: 7, label: "related feedback points" },
  { value: 3, label: "competitor examples" },
];

const PLAN = [
  { title: "Opportunity", body: "New workspaces stall at the integrations step. 38% never finish setup." },
  { title: "Recommendation", body: "Ship a shorter first-run flow and ask for integrations after the first project." },
  { title: "Impact", body: "Recovers most of the activation drop within two release cycles." },
  { title: "Next steps", body: "Draft the requirement, size it with engineering, review on Thursday." },
];

// reset, type, send + think, answer, each "why", each plan cell, hold on the action
const SCRIPT = [350, 1100, 800, 800, ...WHY.map(() => 250), ...PLAN.map(() => 280), 3500];
const TYPE = 1;
const SENT = 2;
const ANSWER = 3;
const WHY_AT = 4;
const PLAN_AT = WHY_AT + WHY.length;
const ACT = PLAN_AT + PLAN.length;

export function Decide() {
  const { ref, step, still } = useSequence(SCRIPT);

  return (
    <Section id="decide">
      <SectionHeader
        num="05"
        label="Cursor for product managers"
        align="center"
        className="mx-auto"
        title={
          <>
            Don&rsquo;t just ask. <span className="text-brand-gradient">Work.</span>
          </>
        }
      />

      <div ref={ref} data-reveal style={d(120)} className="window mx-auto mt-14 max-w-[60rem] lg:mt-16">
        <WindowBar>Ask Selixa</WindowBar>

        {/* Command bar: the question is typed here, then answered below */}
        <div className="border-b border-line p-3 sm:p-4">
          <div
            className={`flex items-center gap-3 rounded-[14px] border bg-well py-2 pl-4 pr-2 transition-colors duration-500 ${
              !still && step === TYPE ? "border-brand-400/50" : "border-line"
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[1rem]">
              {!still && step === 0 ? (
                <span className="text-fg-3">Ask anything about your product…</span>
              ) : (
                <span className="text-fg">
                  <Typed text={QUESTION} on={step >= TYPE} still={still} cps={40} />
                </span>
              )}
            </span>
            <span className="hidden items-center gap-1 rounded-md border border-line px-1.5 py-1 text-[0.6875rem] text-fg-3 sm:flex">
              <Command className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />K
            </span>
            <span
              className={`grid h-8 w-8 place-items-center rounded-full transition-colors duration-300 ${
                !still && step === TYPE ? "bg-brand-500 text-white" : "bg-ink/[0.08] text-fg-2"
              }`}
              aria-hidden="true"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="min-h-[29rem] p-5 sm:p-8">
          <Stage on={step >= SENT} className="flex gap-4">
            <Orb size={36} className="hidden shrink-0 sm:grid" />
            <div className="min-w-0 flex-1">
              {!still && step === SENT ? (
                <span className="thinking mt-3" aria-label="Thinking">
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                <div className="text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-fg">
                  <Typed text="I’d prioritize onboarding." on={step >= ANSWER} still={still} cps={45} />
                </div>
              )}

              <p
                className={`mt-6 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3 transition-opacity duration-500 ${
                  step >= WHY_AT ? "opacity-100" : "opacity-0"
                }`}
              >
                Why
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-4">
                {WHY.map((w, i) => (
                  <Stage as="li" key={w.label} on={step >= WHY_AT + i} className="card px-4 py-3.5">
                    <span className="flex items-center gap-1.5 font-display text-[1.75rem] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
                      {w.down && <TrendingDown className="h-5 w-5 text-brand-400" strokeWidth={1.75} aria-label="down" />}
                      <Count to={w.value} on={step >= WHY_AT + i} still={still} ms={600} />
                      {w.suffix}
                    </span>
                    <span className="mt-2 block text-[0.8125rem] leading-snug text-fg-3">{w.label}</span>
                  </Stage>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {PLAN.map((p, i) => (
                  <Stage key={p.title} on={step >= PLAN_AT + i} className="card p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-[0.8125rem] text-brand-300">
                      <span className="tabular-nums text-fg-3">0{i + 1}</span>
                      {p.title}
                    </p>
                    <p className="mt-2 text-[0.9375rem] leading-[1.55] text-fg-2">{p.body}</p>
                  </Stage>
                ))}
              </div>

              <Stage on={step >= ACT} className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#execution"
                  className={`btn-primary w-auto rounded-full px-5 py-3 text-[0.9375rem] ${!still && step >= ACT ? "ring-4 ring-brand-500/20" : ""}`}
                >
                  Create roadmap item
                  <ArrowRight className="arrow h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
                </a>
                <span className="btn-ghost">
                  <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Draft PRD
                </span>
              </Stage>
            </div>
          </Stage>
        </div>
      </div>
    </Section>
  );
}
