"use client";

import { useSequence } from "@/components/landing/useSequence";
import { ROADMAP_COPY } from "./copy";
import { RoadmapCardView, boardState, cardById } from "./RoadmapCard";

// Hero loop: rest → toast → Onboarding v2 jumps to Now → Mobile app beta to Later → hold → reset.
const SCRIPT = [700, 450, 560, 560, 3000, 300];
const TOAST = 1;
const JUMP = 2;
const PUSH = 3;
const RESET = 5;
const X = [1 / 6, 3 / 6, 5 / 6];

/** The roadmap in miniature: Now · Next · Later, and two cards that move on a decision. */
export function RoadmapRibbon() {
  const { ref, step, still } = useSequence(SCRIPT);
  const f = still ? 4 : step;
  const aIn = f >= JUMP && f < RESET ? 0 : 1; // column index
  const bIn = f >= PUSH && f < RESET ? 2 : 1;
  const state = { ...boardState(0), onboarding: aIn === 0 };
  const cols = ["now", "next", "later"] as const;

  const card = (id: "onboarding" | "beta", col: number, row: number, jump: boolean) => (
    <div
      className="absolute left-0 top-0 h-12 w-[120px] transition-transform duration-[560ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:h-14 md:w-[224px]"
      style={{ transform: `translate3d(calc(${X[col]} * 100cqw - 50%), ${row}px, 0)` }}
    >
      <div className={`h-full transition-opacity duration-300 ${f === RESET ? "opacity-0" : "opacity-100"} ${jump ? "slot-jump" : ""}`}>
        <RoadmapCardView card={cardById(id)} state={state} layout="row" className="max-md:[&>span:last-child]:hidden" />
      </div>
    </div>
  );

  return (
    <div ref={ref} aria-hidden="true" className="relative mx-auto h-[150px] w-full max-w-[358px] [container-type:inline-size] md:h-[180px] md:max-w-[960px]">
      {/* Column labels, and the rail with a dot per column */}
      {cols.map((c, i) => (
        <span
          key={c}
          className={`absolute top-0 -translate-x-1/2 text-[0.75rem] uppercase tracking-[0.14em] ${i === 0 ? "text-brand-300" : "text-fg-3"}`}
          style={{ left: `${X[i] * 100}%` }}
        >
          {ROADMAP_COPY.columns[c]}
        </span>
      ))}
      <div className="absolute inset-x-0 top-8 h-px bg-ink/[0.1]" />
      {cols.map((c, i) => (
        <span key={c} className="absolute top-8 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-ink/25" style={{ left: `${X[i] * 100}%` }}>
          {i === 0 && <span className={`absolute inset-0 rounded-full bg-brand-500 transition-opacity duration-300 ${aIn === 0 ? "opacity-100" : "opacity-0"}`} />}
        </span>
      ))}
      {/* The toast, above Next */}
      <span
        className={`tag absolute -top-9 -translate-x-1/2 transition-[opacity,transform] duration-200 ${f >= TOAST && f < RESET && !still ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"}`}
        style={{ left: "50%" }}
      >
        <span className="live-dot" />
        {ROADMAP_COPY.hero.toast}
      </span>
      <div className="absolute inset-x-0 top-14">
        {card("onboarding", aIn, 0, !still && f === JUMP)}
        {card("beta", bIn, 64, !still && f === PUSH)}
      </div>
    </div>
  );
}
