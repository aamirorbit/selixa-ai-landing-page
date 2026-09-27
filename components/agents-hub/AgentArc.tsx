"use client";

import type { CSSProperties } from "react";
import { Orb } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { AGENT_ICONS, agentShortName } from "@/components/site/agents";
import { AGENTS } from "@/lib/content/agents";

// Hero visual: the six agents on an arc over the orb, in hand-off order, joined by one line.
// The loop lights each agent in turn, then the orb, then holds (about 5.4s).
const STEPS = [...AGENTS.map(() => 320), 450, 3000];
const ORB_STEP = AGENTS.length;
const ANGLES = [180, 144, 108, 72, 36, 0];

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Points on the upper half of an ellipse, as % of a w × h box (rounded: no hydration drift). */
function arc(w: number, h: number, cx: number, cy: number, rx: number, ry: number) {
  return ANGLES.map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { left: `${r2(((cx + rx * Math.cos(a)) / w) * 100)}%`, top: `${r2(((cy - ry * Math.sin(a)) / h) * 100)}%` };
  });
}

const DESKTOP = arc(1000, 300, 500, 270, 430, 210);
const PHONE = arc(358, 220, 179, 193.6, 150, 150);

// Drawn once on load, 300ms after the headline has risen in (140ms delay + 700ms).
const DRAW = { "--d": "1140ms", stroke: "rgb(var(--brand-400-rgb) / 0.55)" } as CSSProperties;

function Line({ d, box }: { d: string; box: string }) {
  return (
    <svg viewBox={box} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
      <path d={d} pathLength={1} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className="draw-once" style={DRAW} />
    </svg>
  );
}

function OrbGlow({ on }: { on: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute inset-[-90%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.5),transparent_62%)] transition-opacity duration-500 ${
        on ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

/** A 6px brand dot on the tile's corner once that agent has handed off. */
function DoneDot({ on }: { on: boolean }) {
  return (
    <span
      className={`absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-brand-400 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}
    />
  );
}

export function AgentArc() {
  const { ref, step, still } = useSequence(STEPS);
  const live = (i: number) => !still && step === i;
  const done = (i: number) => still || step >= ORB_STEP || i < step;
  const glow = !still && step === ORB_STEP;

  return (
    <div ref={ref} aria-hidden="true">
      {/* Desktop: named pills on a 1000 × 300 arc; narrows on short screens so the hero fits one screen */}
      <div
        className="relative mx-auto hidden aspect-[10/3] md:block"
        style={{ width: "min(100%, 1000px, calc((100svh - 30rem) * 10 / 3))" }}
      >
        <Line box="0 0 1000 300" d="M70 270 A430 210 0 0 1 930 270" />
        <div className="absolute left-1/2 top-[90%] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-1/2 aspect-square w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/[0.05]" />
          <div className="relative">
            <OrbGlow on={glow} />
            <Orb size={88} />
          </div>
        </div>
        {AGENTS.map((agent, i) => {
          const Icon = AGENT_ICONS[agent.icon];
          return (
            <div key={agent.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={DESKTOP[i]}>
              <div
                className={`card relative flex h-11 items-center gap-2.5 rounded-full bg-panel pl-2 pr-3.5 transition-[border-color,box-shadow] duration-300 ${
                  live(i) ? "is-live" : ""
                }`}
              >
                <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-[8px] border border-line bg-ink/[0.03] text-brand-300">
                  <span className={`absolute inset-0 bg-brand-500 transition-opacity duration-300 ${live(i) ? "opacity-100" : "opacity-0"}`} />
                  <Icon
                    className={`relative h-3.5 w-3.5 transition-colors duration-300 ${live(i) ? "text-white" : ""}`}
                    strokeWidth={1.75}
                  />
                </span>
                <span className="whitespace-nowrap text-[0.875rem] text-fg-2">{agentShortName(agent)}</span>
                <DoneDot on={done(i)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Phone: icon-only tiles on a 358 × 220 arc */}
      <div className="relative mx-auto aspect-[358/220] w-full max-w-[358px] md:hidden">
        <Line box="0 0 358 220" d="M29 193.6 A150 150 0 0 1 329 193.6" />
        <div className="absolute left-1/2 top-[88%] -translate-x-1/2 -translate-y-1/2">
          <OrbGlow on={glow} />
          <Orb size={64} />
        </div>
        {AGENTS.map((agent, i) => {
          const Icon = AGENT_ICONS[agent.icon];
          return (
            <div key={agent.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={PHONE[i]}>
              <span
                className={`card relative grid h-10 w-10 place-items-center rounded-[11px] bg-panel text-brand-300 transition-[border-color,box-shadow] duration-300 ${
                  live(i) ? "is-live" : ""
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-[10px] bg-brand-500 transition-opacity duration-300 ${live(i) ? "opacity-100" : "opacity-0"}`}
                />
                <Icon className={`relative h-4 w-4 transition-colors duration-300 ${live(i) ? "text-white" : ""}`} strokeWidth={1.75} />
                <DoneDot on={done(i)} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
