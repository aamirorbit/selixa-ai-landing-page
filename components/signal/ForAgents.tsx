"use client";

import { Check, CornerDownRight, Cpu, Radar, Sparkles, Waypoints, Zap, type LucideIcon } from "lucide-react";
import { Stage, Typed } from "@/components/landing/demo";
import { Section, SectionHeader, WindowBar, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { SIGNAL_COPY } from "./copy";

const C = SIGNAL_COPY.agents;

const CHAIN: { label: string; icon: LucideIcon; note: string }[] = [
  { label: "Your agent", icon: Cpu, note: "Asks a market question" },
  { label: "Selixa Signal", icon: Radar, note: "Over API or MCP" },
  { label: "Market intelligence", icon: Waypoints, note: "Demand, trends, competitors" },
  { label: "Opportunity", icon: Sparkles, note: "Ranked, with evidence" },
  { label: "Action", icon: Zap, note: "Brief, priority or task" },
];

const ASK = "Find demand we aren’t serving in couples games.";

// reset, the ask types, then each step of the session, hold
const SCRIPT = [400, 1600, 700, 800, 800, 800, 5000];
const ASKED = 1;
const CALL = 2;
const RESULT = 3;
const OPP = 4;
const ACTION = 5;

export function ForAgents() {
  const { ref, step, still } = useSequence(SCRIPT);
  // Which link of the chain is lit, following the session on the right.
  const lit = still ? CHAIN.length : [0, 1, 2, 3, 4, 5, 5][step] ?? 5;

  return (
    <Section id="agents">
      <div ref={ref} className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeader num="07" label={C.label} title={C.headline} lead={C.line} />

          {/* Agent → Signal → intelligence → opportunity → action */}
          <ol data-reveal style={d(200)} className="mt-10 flex flex-col">
            {CHAIN.map(({ label, icon: Icon }, i) => {
              const on = i < lit;
              return (
                <li key={label} className="relative flex items-center gap-4 pb-4 last:pb-0">
                  {i < CHAIN.length - 1 && (
                    <span aria-hidden="true" className="absolute left-[1.0625rem] top-9 h-[calc(100%-2.25rem)] w-px bg-line">
                      <span
                        className="block h-full origin-top bg-brand-400 transition-transform duration-500"
                        style={{ transform: `scaleY(${i + 1 < lit ? 1 : 0})` }}
                      />
                    </span>
                  )}
                  <span
                    className={`grid h-[2.125rem] w-[2.125rem] shrink-0 place-items-center rounded-full border bg-panel transition-colors duration-500 ${
                      on ? "border-brand-400/60 text-brand-300" : "border-line text-fg-3"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className={`text-[0.9375rem] transition-colors duration-500 ${on ? "text-fg" : "text-fg-3"}`}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* An agent's session, in plain words */}
        <div data-reveal style={d(160)} className="window">
          <WindowBar>
            <span className="text-fg-2">Agent session</span>
            <span className="ml-auto flex items-center gap-2">
              <span className="tag">MCP</span>
              <span className="tag">API</span>
            </span>
          </WindowBar>
          <div className="flex min-h-[24rem] flex-col gap-4 p-5 text-[0.9375rem] sm:p-7">
            <Stage on={step >= ASKED} className="rounded-[12px] border border-line bg-ink/[0.03] px-4 py-3 text-fg">
              <span className="mb-1 block text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">Your agent</span>
              <Typed text={ASK} on={step >= ASKED} still={still} cps={45} />
            </Stage>

            <Stage on={step >= CALL} className="flex items-center gap-2.5 font-mono text-[0.8125rem] text-fg-2">
              <CornerDownRight className="h-4 w-4 shrink-0 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
              <span className="truncate">
                <span className="text-brand-300">signal.find_opportunities</span>(market: &ldquo;couples games&rdquo;)
              </span>
            </Stage>

            <Stage on={step >= RESULT} className="rounded-[12px] border border-line bg-well p-4">
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">Selixa Signal</p>
              <ul className="mt-2.5 flex flex-col gap-1.5 text-[0.875rem] text-fg-2">
                <li className="flex justify-between gap-4">
                  <span>Signals read</span>
                  <span className="tabular-nums text-fg">14 across 5 sources</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Demand</span>
                  <span className="tabular-nums text-fg">246K / month, +38%</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Opportunities</span>
                  <span className="tabular-nums text-fg">3, ranked</span>
                </li>
              </ul>
            </Stage>

            <Stage on={step >= OPP} className="card card-lit p-4">
              <span className="flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.14em] text-brand-300">
                <Sparkles className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                Top opportunity · High confidence
              </span>
              <p className="mt-2 text-fg">Multiplayer experiences for long-distance couples</p>
            </Stage>

            <Stage on={step >= ACTION} className="mt-auto flex items-center gap-2.5 text-[0.875rem] text-fg-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white">
                <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
              </span>
              Research brief opened in Selixa for the team
            </Stage>
          </div>
        </div>
      </div>
    </Section>
  );
}
