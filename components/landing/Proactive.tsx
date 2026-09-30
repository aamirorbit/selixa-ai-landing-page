"use client";

import { ArrowDown, Bell, ChartLine, MessageSquare, Video, type LucideIcon } from "lucide-react";
import { Stage } from "./demo";
import { Orb, Section, SectionHeader, d } from "./ui";
import { useScrollSequence } from "./useScrollSequence";

type Signal = { label: string; value: string; icon: LucideIcon; points: string };

// Sparkline points in a 100×28 box, oldest first.
const SIGNALS: Signal[] = [
  { label: "Team discussions", value: "Onboarding raised in 4 meetings", icon: Video, points: "0,24 20,22 40,23 55,16 70,14 85,8 100,5" },
  { label: "Customer complaints", value: "Up 60% in two weeks", icon: MessageSquare, points: "0,22 18,23 36,20 52,18 68,12 84,9 100,4" },
  { label: "Activation", value: "Down 8% since Aug 12", icon: ChartLine, points: "0,6 18,5 34,7 50,9 64,16 82,20 100,23" },
];

// reset, each signal lights, the threads converge, Selixa speaks up, hold
const SCRIPT = [300, ...SIGNALS.map(() => 350), 450, 400, 4000];
const CONVERGE = 1 + SIGNALS.length;
const NOTICE = CONVERGE + 1;
const ASK = NOTICE + 1;

function Sparkline({ points, on }: { points: string; on: boolean }) {
  return (
    <svg viewBox="0 0 100 28" aria-hidden="true" className="h-7 w-24 shrink-0 overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="rgb(var(--brand-400-rgb))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        data-on={on}
        className="draw"
      />
    </svg>
  );
}

export function Proactive() {
  const { ref, step, still } = useScrollSequence(SCRIPT);

  return (
    <Section id="proactive">
      <SectionHeader
        num="09"
        label="Proactive intelligence"
        align="center"
        className="mx-auto"
        title="It doesn’t wait for you to ask."
      />

      <div
        ref={ref}
        className="mx-auto mt-14 grid max-w-[64rem] grid-cols-1 items-center gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] lg:gap-0"
      >
        <ul className="flex flex-col gap-3">
          {SIGNALS.map(({ label, value, icon: Icon, points }, i) => {
            const on = step > i;
            return (
              <li
                key={label}
                data-reveal
                style={d(i * 90)}
                className={`card flex items-center gap-4 p-4 transition-[border-color,box-shadow,opacity] duration-500 ${
                  on ? (!still && step === i + 1 ? "is-live" : "") : "opacity-75"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border transition-colors duration-500 ${
                    on ? "border-brand-400/40 bg-brand-500/15 text-brand-300" : "border-line bg-ink/[0.03] text-fg-3"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[0.75rem] text-fg-3">{label}</span>
                  <span className="text-[0.9375rem] text-fg">{value}</span>
                </span>
                <Sparkline points={points} on={on} />
              </li>
            );
          })}
        </ul>

        {/* Three signals converging into one */}
        <svg viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden="true" className="hidden h-full min-h-[15rem] w-full lg:block">
          {[50, 150, 250].map((y) => (
            <g key={y}>
              <path
                d={`M0 ${y} C 55 ${y}, 45 150, 100 150`}
                fill="none"
                data-on={step >= CONVERGE}
                className="line-in"
                stroke="rgb(var(--brand-400-rgb))"
                strokeOpacity="0.6"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {step >= CONVERGE && (
                <path
                  d={`M0 ${y} C 55 ${y}, 45 150, 100 150`}
                  fill="none"
                  className="flow"
                  stroke="rgb(var(--brand-300-rgb))"
                  strokeOpacity="0.7"
                  strokeWidth="1.25"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </g>
          ))}
        </svg>
        <ArrowDown className="mx-auto h-5 w-5 text-brand-400 lg:hidden" strokeWidth={1.5} aria-hidden="true" />

        <Stage on={step >= NOTICE} className={`card card-lit p-6 sm:p-7 ${!still && step >= NOTICE ? "is-live" : ""}`}>
          <div className="flex items-center gap-3">
            <Orb size={36} />
            <p className="text-[1.0625rem] text-fg">Selixa noticed something.</p>
            <Bell
              className={`ml-auto h-4 w-4 text-brand-300 ${!still && step === NOTICE ? "bell-ring" : ""}`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
          <ul className="mt-5 flex flex-col gap-2 text-[0.9375rem] leading-[1.5] text-fg-2">
            <li>Your team has discussed onboarding 4 times.</li>
            <li>Customer complaints increased.</li>
            <li>Activation dropped.</li>
          </ul>
          <Stage on={step >= ASK} className="mt-5 border-t border-line pt-5">
            <p className="text-[1.25rem] tracking-[-0.02em] text-fg">This may need attention.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="btn-ghost btn-ghost-sm border-brand-400/40 text-fg">Investigate</span>
              <span className="btn-ghost btn-ghost-sm">Add to review agenda</span>
            </div>
          </Stage>
        </Stage>
      </div>
    </Section>
  );
}
