"use client";

import { ChartLine, Compass, ListChecks, Map as MapIcon, Telescope, Video, type LucideIcon } from "lucide-react";
import { Typed } from "./demo";
import { Orb, Section, SectionHeader, d } from "./ui";
import { useSequence } from "./useSequence";

type Agent = { name: string; body: string; status: string; doing: string; icon: LucideIcon };

// Ordered as a hand-off: each area picks up where the last one left off.
const AGENTS: Agent[] = [
  { name: "Meetings", body: "Joins meetings, captures decisions and follow-ups.", status: "In 2 calls today", doing: "Captured 3 decisions from Product review", icon: Video },
  { name: "Research", body: "Finds customer, market and competitor signals.", status: "Tracking 6 competitors", doing: "Found 3 competitors with shorter onboarding", icon: Telescope },
  { name: "Analytics", body: "Connects product data to what’s happening.", status: "Watching 12 metrics", doing: "Linked the activation drop to the Aug 12 release", icon: ChartLine },
  { name: "Priorities", body: "Turns context into priorities and product decisions.", status: "3 recommendations", doing: "Recommended: prioritize onboarding", icon: Compass },
  { name: "Roadmap", body: "Turns decisions into an evolving roadmap.", status: "Updated 2h ago", doing: "Moved Onboarding v2 to Now", icon: MapIcon },
  { name: "Tasks", body: "Turns plans into tasks and follows progress.", status: "14 tasks in flight", doing: "Created 14 tasks in Linear", icon: ListChecks },
];

const HOLD = 1600;

export function Agents() {
  const { ref, step, still } = useSequence<HTMLUListElement>(AGENTS.map(() => HOLD));

  return (
    <Section id="agents">
      <SectionHeader num="06" label="What it does" title="The whole job, in one AI." />

      <ul ref={ref} className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map(({ name, body, status, doing, icon: Icon }, i) => {
          const live = !still && step === i;
          return (
            <li
              key={name}
              data-reveal
              style={d(i * 60)}
              className={`card relative flex flex-col overflow-hidden p-6 transition-[border-color,box-shadow] duration-500 ${live ? "is-live" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-[11px] border transition-colors duration-500 ${
                    live ? "border-brand-400/50 bg-brand-500 text-white" : "border-line bg-ink/[0.03] text-brand-300"
                  }`}
                >
                  <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="flex items-center gap-2 text-[0.75rem] text-fg-3">
                  {live ? <span className="live-dot" aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-ink/20" aria-hidden="true" />}
                  {live ? "Working" : status}
                </span>
              </div>
              <h3 className="mt-8 text-[1.1875rem] font-medium tracking-[-0.015em] text-fg">{name}</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.55] text-fg-3">{body}</p>
              <div className="mt-5 border-t border-line pt-4 text-[0.8125rem] text-fg-2">
                {live || still ? (
                  <Typed text={doing} on still={still} cps={60} />
                ) : (
                  <span className="invisible block truncate" aria-hidden="true">
                    {doing}
                  </span>
                )}
              </div>
              {live && (
                <span
                  aria-hidden="true"
                  className="agent-progress absolute inset-x-0 bottom-0 h-px bg-brand-400"
                  style={{ animationDuration: `${HOLD}ms` }}
                />
              )}
            </li>
          );
        })}
      </ul>

      <div data-reveal className="mt-12 flex flex-col items-center gap-5">
        <div aria-hidden="true" className="h-12 w-px bg-[linear-gradient(180deg,transparent,rgb(var(--brand-400-rgb)/0.7))]" />
        <Orb size={56} />
        <p className="text-center text-[1.125rem] leading-[1.5] text-fg">
          One product’s context. <span className="text-fg-3">Selixa knows all of it.</span>
        </p>
      </div>
    </Section>
  );
}
