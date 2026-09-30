"use client";

import { ArrowDown, AudioLines, Lightbulb, Mic, Phone, Search, Ticket, Video } from "lucide-react";
import type { ReactNode } from "react";
import { Stage } from "@/components/landing/demo";
import { Orb, Section, SectionHeader, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { CAPTURE_COPY } from "./copy";
import { TelegramMark } from "./marks";

const C = CAPTURE_COPY.problem;

const SOURCES: { label: string; icon: ReactNode }[] = [
  { label: "Search", icon: <Search className="h-3.5 w-3.5" strokeWidth={1.75} /> },
  { label: "Conversation", icon: <AudioLines className="h-3.5 w-3.5" strokeWidth={1.75} /> },
  { label: "Meeting", icon: <Video className="h-3.5 w-3.5" strokeWidth={1.75} /> },
  { label: "Telegram", icon: <TelegramMark className="h-3.5 w-3.5" /> },
  { label: "Voice note", icon: <Mic className="h-3.5 w-3.5" strokeWidth={1.75} /> },
  { label: "Customer call", icon: <Phone className="h-3.5 w-3.5" strokeWidth={1.75} /> },
  { label: "Conference", icon: <Ticket className="h-3.5 w-3.5" strokeWidth={1.75} /> },
  { label: "Random idea", icon: <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} /> },
];

const CONTEXT: { label: string; value: number }[] = [
  { label: "People", value: 14 },
  { label: "Problems", value: 7 },
  { label: "Ideas", value: 12 },
  { label: "Decisions", value: 5 },
];

// each source lights, Selixa takes them in, the context appears, hold
const SCRIPT = [300, ...SOURCES.map(() => 260), 700, 700, 4800];
const IN = 1 + SOURCES.length;
const CONTEXT_AT = IN + 1;
// x of each chip's centre in the 0…100 diagram, two rows of four
const X = [12.5, 37.5, 62.5, 87.5];

export function NotOnline() {
  const { ref, step, still } = useSequence(SCRIPT);

  return (
    <Section id="human">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <SectionHeader num="01" label={C.label} title={C.headline} />
          <ul className="mt-10 flex flex-col gap-2">
            {C.lines.map((line, i) => (
              <li
                key={line}
                data-reveal
                style={d(120 + i * 90)}
                className={`text-[clamp(1.125rem,1.8vw,1.375rem)] leading-[1.4] tracking-[-0.015em] ${i === C.lines.length - 1 ? "mt-2 text-fg" : "text-fg-2"}`}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div ref={ref} data-reveal style={d(160)} className="flex flex-col items-center">
          <ul className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4">
            {SOURCES.map((s, i) => {
              const on = still || step > i;
              return (
                <li
                  key={s.label}
                  className={`flex items-center justify-center gap-2 rounded-full border bg-panel px-3 py-2 text-[0.8125rem] transition-[border-color,color,box-shadow] duration-500 ${
                    on ? "border-brand-400/40 text-fg" : "border-line text-fg-3"
                  } ${!still && step === i + 1 ? "is-live" : ""}`}
                >
                  <span className={on ? "text-brand-300" : ""}>{s.icon}</span>
                  {s.label}
                </li>
              );
            })}
          </ul>

          {/* Everything converging on Selixa */}
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" className="hidden h-24 w-full sm:block">
            {X.map((x) => (
              <g key={x}>
                <path d={`M${x} 0 C ${x} 22, 50 18, 50 40`} fill="none" stroke="rgb(var(--brand-400-rgb))" strokeOpacity="0.45" vectorEffect="non-scaling-stroke" data-on={still || step >= IN} className="line-in" />
                {!still && step >= IN && (
                  <path d={`M${x} 0 C ${x} 22, 50 18, 50 40`} fill="none" stroke="rgb(var(--brand-300-rgb))" strokeOpacity="0.7" className="flow" vectorEffect="non-scaling-stroke" />
                )}
              </g>
            ))}
          </svg>
          <ArrowDown className="my-4 h-5 w-5 text-brand-400 sm:hidden" strokeWidth={1.5} aria-hidden="true" />

          <div className="flex flex-col items-center gap-2">
            <Orb size={60} />
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-fg-2">Selixa</p>
          </div>

          <ArrowDown className="my-5 h-5 w-5 text-brand-400" strokeWidth={1.5} aria-hidden="true" />

          <Stage on={still || step >= CONTEXT_AT} className={`card card-lit w-full max-w-[30rem] p-5 ${!still && step === CONTEXT_AT ? "is-live" : ""}`}>
            <p className="text-center text-[0.6875rem] uppercase tracking-[0.2em] text-brand-300">Product context</p>
            <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
              {CONTEXT.map((c) => (
                <div key={c.label} className="flex flex-col-reverse gap-1.5">
                  <dt className="text-[0.75rem] text-fg-3">{c.label}</dt>
                  <dd className="font-display text-[1.75rem] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">{c.value}</dd>
                </div>
              ))}
            </dl>
          </Stage>
        </div>
      </div>
    </Section>
  );
}
