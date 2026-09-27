"use client";

import { ArrowRight, CircleHelp, Lightbulb, ListChecks, Scale, Send, type LucideIcon } from "lucide-react";
import { Count, Stage, Typed } from "./demo";
import { Avatar, Orb, Section, SectionHeader, WindowBar, d } from "./ui";
import { useSequence } from "./useSequence";

const PEOPLE = [
  { name: "Maya Chen", role: "Design" },
  { name: "Dev Patel", role: "Engineering" },
  { name: "Sara Kim", role: "Product" },
];

// Who speaks at which step of the script.
const TRANSCRIPT = [
  { who: "Maya Chen", step: 1, text: "The new setup flow tested well, but people still stall at the integrations step." },
  { who: "Dev Patel", step: 2, text: "If we defer the Slack connect, we can ship it this sprint." },
  { who: "Sara Kim", step: 3, text: "Let’s do that. Ship the shorter flow on the 14th." },
];

type Capture = { count: number; label: string; example: string; icon: LucideIcon; step: number };

const CAPTURED: Capture[] = [
  { count: 3, label: "Decisions", example: "Ship the shorter onboarding flow on Oct 14", icon: Scale, step: 4 },
  { count: 5, label: "Action items", example: "Dev · Move Slack connect after first project", icon: ListChecks, step: 5 },
  { count: 2, label: "Open questions", example: "Should imports stay behind the trial?", icon: CircleHelp, step: 6 },
  { count: 1, label: "Product insight", example: "Onboarding friction is a recurring theme", icon: Lightbulb, step: 7 },
];

//             reset Maya  Dev   Sara  dec  act  q    ins  card  hold
const SCRIPT = [400, 2000, 1500, 1300, 700, 400, 400, 400, 700, 3500];

export function Meeting() {
  const { ref, step, still } = useSequence(SCRIPT);
  const speaking = TRANSCRIPT.find((t) => t.step === Math.min(step, 3))?.who;

  return (
    <Section id="demo">
      <SectionHeader
        num="03"
        label="The core experience"
        align="center"
        className="mx-auto"
        title="Your AI Product Manager is already in the room."
      />

      <div ref={ref} data-reveal style={d(120)} className="window mt-14 lg:mt-16">
        <WindowBar>
          <span className="flex items-center gap-2 text-fg-2">
            <span className="h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_10px_rgb(var(--brand-glow-rgb)/0.8)]" aria-hidden="true" />
            Product review
          </span>
          <span className="ml-auto tabular-nums">24:18</span>
        </WindowBar>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* The call */}
          <div className="border-line p-4 sm:p-6 lg:border-r">
            <div className="grid grid-cols-2 gap-3">
              {PEOPLE.map((p) => {
                const talking = !still && speaking === p.name;
                return (
                  <div
                    key={p.name}
                    className={`relative flex aspect-[4/3] flex-col sm:aspect-[16/9] items-center justify-center rounded-[12px] border bg-ink/[0.02] transition-[border-color,box-shadow] duration-500 ${
                      talking ? "is-live" : "border-line"
                    }`}
                  >
                    <Avatar name={p.name} className="h-12 w-12 text-[0.9375rem]" />
                    <span className="absolute bottom-2.5 left-3 flex items-center gap-2 text-[0.75rem] text-fg-2">
                      {p.name}
                      {talking && (
                        <span className="eq text-brand-400" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                    </span>
                    <span className="absolute bottom-2.5 right-3 hidden text-[0.6875rem] text-fg-3 sm:inline">{p.role}</span>
                  </div>
                );
              })}
              <div className="card-lit relative flex aspect-[4/3] flex-col sm:aspect-[16/9] items-center justify-center rounded-[12px] border">
                <Orb size={48} />
                <span className="absolute bottom-2.5 left-3 text-[0.75rem] text-fg">Selixa</span>
                <span className="absolute bottom-2.5 right-3 flex items-center gap-1.5 text-[0.6875rem] text-brand-300">
                  <span className="live-dot" aria-hidden="true" />
                  Listening
                </span>
              </div>
            </div>

            <ol className="mt-5 flex min-h-[13.5rem] flex-col gap-3.5" aria-label="Live transcript">
              {TRANSCRIPT.map((t) => (
                <Stage as="li" key={t.text} on={step >= t.step} className="flex gap-3">
                  <Avatar name={t.who} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.75rem] text-fg-3">{t.who}</p>
                    <div className="mt-0.5 text-[0.9375rem] leading-[1.5] text-fg">
                      <Typed text={t.text} on={step >= t.step} still={still} cps={62} />
                    </div>
                    {t.step === 3 && (
                      <Stage
                        as="span"
                        on={step >= 4}
                        className="tag mt-2 border-brand-400/40 bg-brand-500/15 text-brand-200"
                      >
                        <Scale className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                        Decision captured
                      </Stage>
                    )}
                  </div>
                </Stage>
              ))}
            </ol>
          </div>

          {/* What Selixa took away */}
          <div className="flex flex-col gap-4 border-t border-line p-4 sm:p-6 lg:border-t-0">
            <p className="flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.14em] text-fg-3">
              Captured by Selixa
              {!still && step > 0 && step < 8 && (
                <span className="thinking ml-1" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </p>
            <ul className="flex flex-col divide-y divide-line rounded-[14px] border border-line">
              {CAPTURED.map(({ count, label, example, icon: Icon, step: at }) => (
                <li key={label} className="relative flex items-start gap-4 px-4 py-3.5">
                  {!still && step < at && (
                    <span aria-hidden="true" className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center gap-4">
                      <span className="skeleton h-6 w-6 rounded-md" />
                      <span className="flex flex-1 flex-col gap-2">
                        <span className="skeleton h-2.5 w-24 rounded-full" />
                        <span className="skeleton h-2 w-2/3 rounded-full" />
                      </span>
                    </span>
                  )}
                  <Stage on={step >= at} as="span" className="w-7 font-display text-[1.75rem] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
                    <Count to={count} on={step >= at} still={still} ms={500} />
                  </Stage>
                  <Stage on={step >= at} className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[0.875rem] text-fg">
                      <Icon className="h-3.5 w-3.5 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
                      {label}
                    </p>
                    <p className="mt-1 text-[0.8125rem] text-fg-3 lg:truncate">{example}</p>
                  </Stage>
                </li>
              ))}
            </ul>

            <Stage on={step >= 8} className="card card-lit p-5">
              <p className="flex items-center gap-2 text-[0.75rem] text-brand-300">
                <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                Insight
              </p>
              <p className="mt-3 text-[1.125rem] leading-[1.45] tracking-[-0.01em] text-fg">
                &ldquo;Onboarding has come up in three customer conversations this week.&rdquo;
              </p>
              <a href="#decide" className="link-arrow mt-4">
                Explore insight
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </a>
            </Stage>

            <Stage on={step >= 9} as="p" className="mt-auto flex items-start gap-2 pt-2 text-[0.8125rem] leading-snug text-fg-3">
              <Send className="mt-px h-3.5 w-3.5 shrink-0 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
              Summary posted to #product · 5 tasks synced to Linear
            </Stage>
          </div>
        </div>
      </div>
    </Section>
  );
}
