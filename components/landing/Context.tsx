"use client";

import { ArrowUp, BookOpen, ChartLine, Check, CircleDot, FileText, Map as MapIcon, MessageSquare, Telescope, Video, type LucideIcon } from "lucide-react";
import { Stage, Typed } from "./demo";
import { Orb, Section, SectionHeader, WindowBar, d } from "./ui";
import { useScrollSequence } from "./useScrollSequence";

const KNOWS: { label: string; meta: string; icon: LucideIcon }[] = [
  { label: "Meetings", meta: "148 conversations", icon: Video },
  { label: "Customer feedback", meta: "1,204 notes", icon: MessageSquare },
  { label: "Analytics", meta: "Funnels and retention", icon: ChartLine },
  { label: "Roadmap", meta: "Now, next, later", icon: MapIcon },
  { label: "Issues", meta: "Linear, Jira, GitHub", icon: CircleDot },
  { label: "Research", meta: "Interviews, market notes", icon: Telescope },
  { label: "Docs", meta: "PRDs, specs, strategy", icon: FileText },
];

const SOURCES = [
  { kind: "Meeting", ref: "Product review · Sep 24" },
  { kind: "Analytics", ref: "Activation funnel" },
  { kind: "Feedback", ref: "7 related notes" },
  { kind: "Doc", ref: "Onboarding PRD v3" },
];

const QUESTION = "Why did activation drop in August?";
const ANSWER =
  "Activation fell 8% after the August 12 release added a required integrations step. New workspaces now stall there, and 4 customers raised it on calls in the last two weeks. The team discussed deferring the step in last week’s review but didn’t decide.";

const K = KNOWS.length;
// reset, index each source, ask, think, answer, cite each source, hold
const SCRIPT = [350, ...KNOWS.map(() => 160), 1100, 700, 2200, ...SOURCES.map(() => 220), 3200];
const ASK = K + 1;
const THINK = ASK + 1;
const ANSWERING = THINK + 1;
const CITE = ANSWERING + 1;

export function Context() {
  const { ref, step, still } = useScrollSequence(SCRIPT);

  return (
    <Section id="context">
      <div ref={ref} className="grid grid-cols-1 items-stretch gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <SectionHeader num="04" label="Context" title="It knows your product." />
          <ul data-reveal style={d(160)} className="mt-10 flex flex-col">
            {KNOWS.map(({ label, meta, icon: Icon }, i) => {
              const indexed = step > i;
              return (
                <li key={label} className="flex items-center gap-3.5 border-t border-line py-3 last:border-b">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors duration-500 ${indexed ? "text-brand-400" : "text-fg-3"}`}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <span className={`flex-1 text-[0.9375rem] transition-colors duration-500 ${indexed ? "text-fg" : "text-fg-3"}`}>
                    {label}
                  </span>
                  <span className="hidden text-[0.8125rem] text-fg-3 sm:inline">{meta}</span>
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full transition-all duration-500 ${
                      indexed ? "scale-100 bg-brand-500 text-white opacity-100" : "scale-50 opacity-0"
                    }`}
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div data-reveal style={d(160)} className="window flex flex-col">
          <WindowBar>
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Ask Selixa
          </WindowBar>
          <div className="flex min-h-[24rem] flex-1 flex-col gap-5 p-5 sm:p-7">
            <Stage
              on={step >= ASK}
              as="p"
              className="ml-auto max-w-[85%] rounded-[14px] rounded-br-[4px] border border-line bg-ink/[0.04] px-4 py-3 text-[0.9375rem] text-fg"
            >
              {QUESTION}
            </Stage>
            <Stage on={step >= THINK} className="flex gap-3.5">
              <Orb size={32} className="shrink-0" />
              <div className="min-w-0 flex-1 pt-1">
                {!still && step === THINK ? (
                  <span className="thinking mt-2" aria-label="Thinking">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  <div className="text-[0.9375rem] leading-[1.65] text-fg-2">
                    <Typed text={ANSWER} on={step >= ANSWERING} still={still} cps={150} />
                  </div>
                )}
                <p
                  className={`mt-5 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3 transition-opacity duration-500 ${
                    step >= CITE ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Sources
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {SOURCES.map((s, i) => (
                    <Stage as="li" key={s.ref} on={step >= CITE + i} className="tag">
                      <span className="text-brand-300">{s.kind}</span>
                      {s.ref}
                    </Stage>
                  ))}
                </ul>
              </div>
            </Stage>

            <div className="mt-auto flex items-center gap-3 rounded-[14px] border border-line bg-well py-2 pl-4 pr-2">
              <span className="flex-1 truncate text-[0.9375rem] text-fg-3">Ask a follow-up…</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/[0.08] text-fg-2" aria-hidden="true">
                <ArrowUp className="h-4 w-4" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <p
        data-reveal
        className="mx-auto mt-20 max-w-[34ch] text-center text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.25] tracking-[-0.025em] text-fg text-balance lg:mt-24"
      >
        Every answer is grounded in your product&rsquo;s <span className="text-brand-gradient">actual context.</span>
      </p>
    </Section>
  );
}
