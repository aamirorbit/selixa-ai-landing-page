"use client";

import { ChartLine, FileText, GitPullRequest, Hash, Map as MapIcon, MessageSquare, Phone, Video, type LucideIcon } from "lucide-react";
import { Orb, Section, SectionHeader, d } from "./ui";
import { useSequence } from "./useSequence";

type Source = { label: string; meta: string; icon: LucideIcon; deg: number; r: number; tilt: number };

/** Scattered on purpose: uneven angles and distances read as mess, not a diagram. */
const SOURCES: Source[] = [
  { label: "Meetings", meta: "Weekly product sync", icon: Video, deg: -78, r: 40, tilt: -7 },
  { label: "Slack", meta: "#product-feedback", icon: Hash, deg: -28, r: 43, tilt: 5 },
  { label: "Customer calls", meta: "Churn risk · Acme", icon: Phone, deg: 14, r: 36, tilt: -4 },
  { label: "Docs", meta: "Onboarding PRD v3", icon: FileText, deg: 58, r: 42, tilt: 8 },
  { label: "Analytics", meta: "Activation −8%", icon: ChartLine, deg: 104, r: 38, tilt: -6 },
  { label: "Feedback", meta: "32 new notes", icon: MessageSquare, deg: 150, r: 43, tilt: 6 },
  { label: "Roadmaps", meta: "Q4 plan, 3 blocked", icon: MapIcon, deg: 196, r: 37, tilt: -5 },
  { label: "GitHub", meta: "PR #482 merged", icon: GitPullRequest, deg: 238, r: 42, tilt: 7 },
];

// Hold the mess, pull each source in, then rest on the connected picture.
const SCRIPT = [900, ...SOURCES.map(() => 220), 2600];
const DONE = SCRIPT.length - 1;

// Rounded, because server and browser trig can differ in the last digit and break hydration.
const round = (n: number) => Math.round(n * 100) / 100;
const at = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: round(50 + r * Math.cos(a)), y: round(50 + r * Math.sin(a)) };
};

function SourceChip({ s, linked }: { s: Source; linked: boolean }) {
  const Icon = s.icon;
  return (
    <div
      className={`card flex items-center gap-2.5 rounded-[12px] bg-bg py-2 pl-2 pr-3.5 transition-[border-color,box-shadow] duration-700 ${
        linked ? "" : "opacity-75"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border transition-colors duration-700 ${
          linked ? "border-brand-400/40 bg-brand-500/15 text-brand-300" : "border-line bg-ink/[0.03] text-fg-3"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[0.8125rem] leading-tight text-fg">{s.label}</span>
        <span className="truncate text-[0.6875rem] leading-tight text-fg-3">{s.meta}</span>
      </span>
    </div>
  );
}

export function Problem() {
  const { ref, step } = useSequence(SCRIPT);
  const linked = (i: number) => step > i;
  const done = step === DONE;

  return (
    <Section id="product">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        <div>
          <SectionHeader num="02" label="The problem" title="Your product lives everywhere." />
          <p data-reveal style={d(200)} className="mt-8 text-[1.375rem] leading-[1.4] tracking-[-0.01em] text-fg-2 sm:text-[1.5rem]">
            The context is everywhere.
            <br />
            <span className="text-fg-3">The decisions are somewhere.</span>
          </p>
        </div>

        <div ref={ref} data-reveal style={d(120)}>
          {/* Tablet and up: sources scattered around the orb, pulled in one by one */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-[38rem] sm:block">
            <div aria-hidden="true" className="absolute inset-[14%] rounded-full border border-dashed border-ink/[0.07]" />
            <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
              {SOURCES.map((s, i) => {
                const p = at(s.deg, s.r);
                return (
                  <g key={s.label}>
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={50}
                      y2={50}
                      data-on={linked(i)}
                      className="line-in"
                      stroke="rgb(var(--brand-400-rgb))"
                      strokeOpacity="0.5"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                    {linked(i) && (
                      <line
                        x1={p.x}
                        y1={p.y}
                        x2={50}
                        y2={50}
                        className="flow"
                        stroke="rgb(var(--brand-300-rgb))"
                        strokeOpacity="0.8"
                        strokeWidth="1.25"
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className={`transition-transform duration-700 ${done ? "scale-110" : "scale-100"}`}>
                <Orb size={108} />
              </div>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-[-60%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.45),transparent_62%)] transition-opacity duration-1000 ${
                  done ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            {SOURCES.map((s, i) => {
              const on = linked(i);
              const p = at(s.deg, on ? s.r : s.r + 6);
              return (
                <div
                  key={s.label}
                  className="absolute transition-[left,top,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: `translate(-50%, -50%) rotate(${on ? 0 : s.tilt}deg)`,
                  }}
                >
                  <SourceChip s={s} linked={on} />
                </div>
              );
            })}
          </div>

          {/* Phones: the same sources, lighting up in turn */}
          <div className="flex flex-col items-center gap-6 sm:hidden">
            <Orb size={88} />
            <div className="grid w-full grid-cols-2 gap-2.5">
              {SOURCES.map((s, i) => (
                <SourceChip key={s.label} s={s} linked={linked(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p
        data-reveal
        className="mt-20 text-center text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.15] tracking-[-0.03em] text-fg lg:mt-24"
      >
        Selixa <span className="text-brand-gradient">connects the dots.</span>
      </p>
    </Section>
  );
}
