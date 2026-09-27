"use client";

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, Section, SectionHeader, d } from "./ui";
import { useSequence } from "./useSequence";

const STEPS: { label: string; body: ReactNode }[] = [
  { label: "Decision", body: <p className="text-fg">Shorten onboarding</p> },
  {
    label: "Product requirement",
    body: (
      <>
        <p className="text-fg">Onboarding v2</p>
        <p className="mt-1 text-fg-3">6 requirements</p>
      </>
    ),
  },
  {
    label: "Tasks",
    body: (
      <>
        <p className="text-fg">14 tasks</p>
        <p className="mt-1 text-fg-3">Synced to Linear</p>
      </>
    ),
  },
  {
    label: "Owners",
    body: (
      <div className="flex -space-x-2">
        {["Sara Kim", "Dev Patel", "Maya Chen"].map((n) => (
          <Avatar key={n} name={n} className="bg-bg" />
        ))}
      </div>
    ),
  },
  {
    label: "Progress",
    body: (
      <>
        <p className="text-fg tabular-nums">64%</p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/[0.08]">
          <div className="exec-bar h-full rounded-full bg-brand-400" />
        </div>
      </>
    ),
  },
  {
    label: "Outcome",
    body: (
      <>
        <p className="text-fg">Activation back up</p>
        <p className="mt-1 text-fg-3">Measured weekly</p>
      </>
    ),
  },
];

// reset, then each stage takes over from the last, then rest on the outcome
const SCRIPT = [300, ...STEPS.map(() => 450), 3000];

export function Execution() {
  const { ref, step, still } = useSequence<HTMLOListElement>(SCRIPT);
  const reached = Math.min(step, STEPS.length); // stages done or in progress

  return (
    <Section id="execution">
      <SectionHeader num="10" label="Execution" title="From decision to done." />

      <div className="relative mt-14">
        {/* The thread under the pipeline, filling as work moves */}
        <div aria-hidden="true" className="absolute inset-x-0 -bottom-6 hidden h-px bg-line lg:block">
          <div
            className="h-full bg-[linear-gradient(90deg,rgb(var(--brand-500-rgb)/0.3),var(--color-brand-400))] shadow-[0_0_12px_rgb(var(--brand-glow-rgb)/0.8)] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${(reached / STEPS.length) * 100}%` }}
          />
        </div>

        <ol ref={ref} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
          {STEPS.map((s, i) => {
            const on = reached > i;
            const outcome = i === STEPS.length - 1;
            const live = !still && on && (reached === i + 1 || outcome);
            return (
              <li
                key={s.label}
                data-reveal
                style={d(i * 70)}
                data-progress={s.label === "Progress" && on}
                className="relative flex lg:pr-6 lg:last:pr-0"
              >
                <div
                  className={`card flex w-full flex-col p-5 text-[0.9375rem] transition-[border-color,box-shadow,opacity] duration-500 ${
                    on ? "" : "opacity-60"
                  } ${outcome && on ? "card-lit" : ""} ${live ? "is-live" : ""}`}
                >
                  <span className="text-[0.75rem] tabular-nums text-fg-3">0{i + 1}</span>
                  <span className="mt-1 text-[0.8125rem] text-brand-300">{s.label}</span>
                  <div className="mt-6 min-h-[3.25rem]">{s.body}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    className={`absolute right-0.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 transition-colors duration-500 lg:block ${
                      reached > i + 1 ? "text-brand-400" : "text-fg-3"
                    }`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <p
        data-reveal
        className="mt-20 max-w-[30ch] text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.25] tracking-[-0.025em] text-fg text-balance"
      >
        Your decisions shouldn&rsquo;t disappear into <span className="text-fg-3">meeting notes.</span>
      </p>
    </Section>
  );
}
