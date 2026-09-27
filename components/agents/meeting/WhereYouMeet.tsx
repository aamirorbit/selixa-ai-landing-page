"use client";

import { LOGOS } from "@/components/landing/logos";
import { Orb, SectionHeader, WindowBar, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { Initials } from "@/components/site/Initials";
import { ToolStrip } from "@/components/site/ToolStrip";
import { MEETING_COPY } from "./copy";

const W = MEETING_COPY.where;
const TOOLS = ["Zoom", "Google Meet"].map((n) => ({ logo: LOGOS.find((l) => l.name === n)! }));
// Selixa's row lights once, shortly after the panel reveals.
const SCRIPT = [600, 2_000_000_000];

/** Where you meet: the call tools, and Selixa as one of the people in the call. */
export function WhereYouMeet() {
  const { ref, step, still } = useSequence(SCRIPT);
  const lit = still || step >= 1;
  const people = MEETING_COPY.hero.tiles;

  return (
    <section id="where" className="relative py-24 sm:py-32">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          {/* The consent line waits for the owner's answer (copy TODO 1), so no lead here. */}
          <SectionHeader num="03" label={W.label} title={W.headline} />
          <div data-reveal style={d(200)} className="mt-10">
            <ToolStrip tools={TOOLS} size="lg" className="max-lg:justify-center lg:justify-start" />
          </div>
        </div>

        <div ref={ref} data-reveal style={d(120)} className="window mx-auto w-full max-w-[440px]">
          <WindowBar>
            {W.panelTitle} ({people.length + 1})
          </WindowBar>
          <ul>
            {people.map((p, i) => (
              <li key={p.name} className={`flex h-[52px] items-center gap-3 px-4 ${i ? "border-t border-line" : ""}`}>
                <Initials name={p.name} size={28} />
                <span className="flex-1 text-[0.875rem] text-fg">{p.name}</span>
                <span className="text-[0.75rem] text-fg-3">{p.role}</span>
              </li>
            ))}
            <li className="relative flex h-[52px] items-center gap-3 border-t border-line px-4">
              <span
                aria-hidden="true"
                className={`card-lit pointer-events-none absolute inset-0 border-0 transition-opacity duration-300 ${lit ? "opacity-100" : "opacity-0"}`}
              />
              <span className="relative">
                <Orb size={28} />
              </span>
              <span className="relative flex-1 text-[0.875rem] text-fg">{MEETING_COPY.hero.selixa}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
