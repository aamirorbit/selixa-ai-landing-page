"use client";

import { ArrowDown, ArrowRight, ArrowUpRight, Crosshair, MessageSquare, Search, TrendingUp, UsersRound, type LucideIcon } from "lucide-react";
import { Stage } from "@/components/landing/demo";
import { Orb, SectionHeader } from "@/components/landing/ui";
import { StickyScene, useSceneBeat, useSceneStill } from "@/components/site/StickyScene";
import { SIGNAL_COPY } from "./copy";

const C = SIGNAL_COPY.opportunity;

// Four from outside, one from inside the product: the point is that they meet. Illustrative.
const EVIDENCE: { label: string; value: string; icon: LucideIcon; where: "Outside" | "Inside" }[] = [
  { label: "Search demand", value: "+84% in 90 days", icon: Search, where: "Outside" },
  { label: "Customer conversations", value: "Raised on 5 calls this month", icon: MessageSquare, where: "Inside" },
  { label: "Competitor activity", value: "2 launches, 1 new hire", icon: Crosshair, where: "Outside" },
  { label: "Community discussions", value: "3× more threads", icon: UsersRound, where: "Outside" },
  { label: "Market trend", value: "Rising in 14 countries", icon: TrendingUp, where: "Outside" },
];

// Scroll, not time: while the section is pinned, each piece of evidence lights in turn, then
// the threads converge, the opportunity appears, then its detail. `step` counts beats passed.
const BEATS = [0.06, 0.15, 0.24, 0.33, 0.42, 0.54, 0.66, 0.78];
const CONVERGE = 1 + EVIDENCE.length;
const FOUND = CONVERGE + 1;
const DETAIL = FOUND + 1;
const YS = EVIDENCE.map((_, i) => 30 + i * 60);

export function Opportunity() {
  return (
    <StickyScene id="opportunity" length={2} label={C.headline} minStageHeight={700} className="flex items-center">
      <Scene />
    </StickyScene>
  );
}

function Scene() {
  const step = useSceneBeat(BEATS);
  const still = useSceneStill();

  return (
    <div className="w-full py-8">
      <SectionHeader num="02" label={C.label} title={C.headline} align="center" className="mx-auto" />

      <div
        className="mx-auto mt-12 grid max-w-[68rem] grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,0.9fr)_7rem_minmax(0,1.1fr)] lg:gap-0"
      >
        <ul className="flex flex-col gap-3">
          {EVIDENCE.map(({ label, value, icon: Icon, where }, i) => {
            const on = step > i;
            return (
              <li
                key={label}
                className={`card flex items-center gap-4 p-3.5 transition-[border-color,box-shadow,opacity] duration-500 ${
                  on ? (!still && step === i + 1 ? "is-live" : "") : "opacity-60"
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
                  <span className="flex items-center gap-2 text-[0.9375rem] text-fg">
                    {label}
                    <ArrowUpRight className="h-3.5 w-3.5 text-brand-300" strokeWidth={2} aria-label="up" />
                  </span>
                  <span className="truncate text-[0.8125rem] text-fg-3">{value}</span>
                </span>
                <span className={`tag hidden sm:inline-flex ${where === "Inside" ? "border-brand-400/30 text-brand-300" : ""}`}>{where}</span>
              </li>
            );
          })}
        </ul>

        {/* Five threads converging into one */}
        <svg viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden="true" className="hidden h-full min-h-[18rem] w-full lg:block">
          {YS.map((y) => (
            <g key={y}>
              <path
                d={`M0 ${y} C 55 ${y}, 45 150, 100 150`}
                fill="none"
                data-on={step >= CONVERGE}
                className="line-in"
                stroke="rgb(var(--brand-400-rgb))"
                strokeOpacity="0.55"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {!still && step >= CONVERGE && (
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

        <Stage on={step >= FOUND} className={`card card-lit p-6 sm:p-8 ${!still && step >= FOUND ? "is-live" : ""}`}>
          <div className="flex items-center gap-3">
            <Orb size={36} />
            <span className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.18em] text-brand-300">
              <span className="live-dot" aria-hidden="true" />
              Opportunity detected
            </span>
          </div>
          <p className="mt-6 text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.25] tracking-[-0.025em] text-fg text-balance">
            Growing demand for multiplayer experiences for long-distance couples.
          </p>

          <Stage on={step >= DETAIL} className="mt-6 grid grid-cols-1 gap-5 border-t border-line pt-6 sm:grid-cols-[9rem_minmax(0,1fr)]">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">Confidence</p>
              <p className="mt-2 text-[1.0625rem] text-fg">High</p>
              <span className="mt-2 flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <i key={i} className={`block h-1.5 w-5 rounded-full ${i < 4 ? "bg-brand-400" : "bg-ink/15"}`} />
                ))}
              </span>
            </div>
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">Why it matters</p>
              <p className="mt-2 text-[0.9375rem] leading-[1.6] text-fg-2">
                Demand is accelerating and today’s options leave gaps.
              </p>
            </div>
          </Stage>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#connect" className="btn-ghost border-brand-400/40 text-fg">
              Explore opportunity
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </a>
            <span className="text-[0.8125rem] text-fg-3">14 signals · 5 sources</span>
          </div>
        </Stage>
      </div>
    </div>
  );
}
