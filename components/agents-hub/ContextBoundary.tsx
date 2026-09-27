"use client";

import { Lock } from "lucide-react";
import type { CSSProperties } from "react";
import { Stage } from "@/components/landing/demo";
import { Orb, SectionHeader, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { AGENT_ICONS } from "@/components/site/agents";
import { AGENTS } from "@/lib/content/agents";
import { HUB_COPY } from "./copy";

const C = HUB_COPY.context;

// Plays once per visit: wait, spokes, tiles, chips, then hold (well within setTimeout's limit).
const SCRIPT = [300, 400, 600, 2_000_000_000];
const SPOKES = 1;
const TILES = 2;
const CHIPS = 3;

/**
 * Six agents on a ring around the orb. Placed with transforms from the centre and a
 * CSS radius (--r), so one set of markup serves every breakpoint.
 */
function Ring({ step, still, dim }: { step: number; still: boolean; dim?: boolean }) {
  const spokes = still || step >= SPOKES;
  const tiles = still || step >= TILES;
  return (
    <div className="relative mx-auto aspect-square w-[calc(2*var(--r)+3rem)]">
      <div className="absolute left-1/2 top-1/2">
        {AGENTS.map((agent, i) => (
          <span
            key={agent.slug}
            className="line-in absolute bottom-0 left-0 h-[var(--r)] w-px origin-bottom bg-ink/[0.08]"
            data-on={spokes}
            style={{ transform: `rotate(${i * 60}deg)` }}
          />
        ))}
        {AGENTS.map((agent, i) => {
          const Icon = AGENT_ICONS[agent.icon];
          const turn = { "--a": `${i * 60}deg` } as CSSProperties;
          return (
            <span
              key={agent.slug}
              className="absolute left-0 top-0 [transform:rotate(var(--a))_translateY(calc(-1*var(--r)))_rotate(calc(-1*var(--a)))]"
              style={turn}
            >
              <Stage as="span" on={tiles} className="block" style={{ transitionDelay: tiles && !still ? `${i * 60}ms` : "0ms" }}>
                <span
                  className={`grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[10px] border border-line bg-panel ${
                    dim ? "text-fg-3" : "text-brand-300"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                </span>
              </Stage>
            </span>
          );
        })}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Orb size={56} />
      </div>
    </div>
  );
}

function Chip({ mark, name, lit }: { mark: string; name: string; lit?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`grid h-5 w-5 place-items-center rounded-[6px] text-[0.6875rem] ${lit ? "bg-brand-500 text-white" : "bg-ink/[0.14] text-fg-2"}`}
        aria-hidden="true"
      >
        {mark}
      </span>
      <span className="text-[0.9375rem] text-fg">{name}</span>
    </span>
  );
}

export function ContextSection() {
  const { ref, step, still } = useSequence(SCRIPT);
  const chips = still || step >= CHIPS;

  return (
    <section id="context" className="relative py-24 sm:py-32">
      <SectionHeader num="03" label={C.label} title={C.headline} lead={C.line} align="center" />

      <div className="mx-auto mt-14 grid max-w-[1040px] grid-cols-1 items-center gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        {/* Atlas: the active product, lit */}
        <div ref={ref} data-reveal className="window rounded-[24px]! p-6 [--r:92px] sm:[--r:112px]">
          <div className="flex items-center justify-between gap-3">
            <Chip mark="A" name={C.active} lit />
            <span className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">
              <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              {C.activeTag}
            </span>
          </div>
          <div className="mt-6" aria-hidden="true">
            <Ring step={step} still={still} />
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label={`${C.active} context`}>
            {C.memory.map((m, i) => (
              <Stage key={m} as="li" on={chips} className="tag" style={{ transitionDelay: chips && !still ? `${i * 40}ms` : "0ms" }}>
                {m}
              </Stage>
            ))}
          </ul>
        </div>

        {/* Beacon: another product, greyed. Same team, its own memory. */}
        <div data-reveal style={d(200)}>
          <div className="window rounded-[24px]! p-6 opacity-50 [--r:84px]">
            <div className="flex items-center justify-between gap-3">
              <Chip mark="B" name={C.greyed} />
              <span className="tag">
                <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                {C.greyedTag}
              </span>
            </div>
            <div className="mt-6" aria-hidden="true">
              <Ring step={0} still dim />
            </div>
            <p className="mt-6 text-center text-[0.8125rem] text-fg-3">{C.greyedNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
