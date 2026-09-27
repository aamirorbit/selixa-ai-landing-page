"use client";

import {
  ArrowRight,
  ChevronsUpDown,
  House,
  Lightbulb,
  ListChecks,
  Map as MapIcon,
  MessageSquare,
  Scale,
  Search,
  Sparkles,
  Telescope,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Stage, Typed } from "./demo";
import { Orb, Section, SectionHeader, WindowBar, d } from "./ui";
import { useSequence } from "./useSequence";

const NAV: { label: string; icon: LucideIcon; badge?: number }[] = [
  { label: "Home", icon: House },
  { label: "Ask Selixa", icon: Sparkles },
  { label: "Meetings", icon: Video, badge: 2 },
  { label: "Insights", icon: Lightbulb, badge: 4 },
  { label: "Decisions", icon: Scale },
  { label: "Roadmap", icon: MapIcon },
  { label: "Tasks", icon: ListChecks },
  { label: "Research", icon: Telescope },
];

const ATTENTION: { kind: string; icon: LucideIcon; text: string; action: string; lit?: boolean }[] = [
  { kind: "Customer signal", icon: MessageSquare, text: "Onboarding mentioned 4× this week.", action: "See conversations", lit: true },
  { kind: "Decision", icon: Scale, text: "Pricing discussion needs resolution.", action: "Open thread" },
  { kind: "Roadmap", icon: MapIcon, text: "3 items blocked by the same dependency.", action: "View items" },
  { kind: "Meeting", icon: Video, text: "Tomorrow’s product review needs preparation.", action: "Prepare brief" },
];

// reset, greet, ask, each card lands, then the most urgent one lights
const SCRIPT = [300, 400, 900, ...ATTENTION.map(() => 250), 3500];
const CARDS_AT = 3;
const FOCUS = CARDS_AT + ATTENTION.length;

export function Workspace() {
  const { ref, step, still } = useSequence(SCRIPT);

  return (
    <Section id="workspace">
      <SectionHeader
        num="08"
        label="The workspace"
        align="center"
        className="mx-auto"
        title="Everything product work needs."
      />

      <div ref={ref} data-reveal style={d(120)} className="window mt-14 lg:mt-16">
        <WindowBar>
          <span className="mx-auto hidden items-center gap-2 rounded-md border border-line bg-well px-3 py-1 text-[0.75rem] sm:flex">
            <Search className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
            app.selixa.ai
          </span>
        </WindowBar>

        <div className="grid grid-cols-1 md:grid-cols-[14.5rem_minmax(0,1fr)]">
          <aside className="hidden border-r border-line p-3 md:block">
            <div className="flex items-center gap-2.5 rounded-[10px] border border-line bg-ink/[0.03] px-2.5 py-2">
              <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-ink/[0.14] text-[0.6875rem] font-medium" aria-hidden="true">
                A
              </span>
              <span className="flex-1 text-[0.875rem] text-fg">Atlas</span>
              <ChevronsUpDown className="h-3.5 w-3.5 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <ul className="mt-4 flex flex-col gap-0.5">
              {NAV.map(({ label, icon: Icon, badge }, i) => (
                <li
                  key={label}
                  className={`flex items-center gap-3 rounded-[9px] px-2.5 py-2 text-[0.875rem] ${
                    i === 0 ? "bg-ink/[0.07] text-fg" : "text-fg-3"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {badge && <span className="text-[0.6875rem] tabular-nums text-fg-3">{badge}</span>}
                </li>
              ))}
            </ul>
          </aside>

          <div className="p-5 sm:p-8 lg:p-10">
            <Stage on={step >= 1} className="flex items-center gap-3">
              <Orb size={30} />
              <p className="text-[0.875rem] text-fg-3">Good morning, Sara</p>
            </Stage>
            <div className="mt-5 text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.15] tracking-[-0.03em] text-fg">
              <Typed text="What needs your attention?" on={step >= 2} still={still} cps={36} />
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ATTENTION.map(({ kind, icon: Icon, text, action, lit }, i) => (
                <Stage
                  as="li"
                  key={kind}
                  on={step >= CARDS_AT + i}
                  className={`card flex flex-col p-5 ${lit ? "card-lit" : ""} ${lit && !still && step >= FOCUS ? "is-live" : ""}`}
                >
                  <p className="flex items-center gap-2 text-[0.75rem] text-brand-300">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    {kind}
                  </p>
                  <p className="mt-3 flex-1 text-[1.0625rem] leading-[1.45] tracking-[-0.01em] text-fg">{text}</p>
                  <p className="mt-5 flex items-center gap-1.5 text-[0.8125rem] text-fg-2">
                    {action}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  </p>
                </Stage>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
