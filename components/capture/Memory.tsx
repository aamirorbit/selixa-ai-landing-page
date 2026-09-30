"use client";

import { Eye, Lightbulb, PencilLine, ShieldCheck } from "lucide-react";
import { Stage } from "@/components/landing/demo";
import { Orb, Section, SectionHeader, d } from "@/components/landing/ui";
import { useScrollSequence } from "@/components/landing/useScrollSequence";
import { CAPTURE_COPY } from "./copy";

const C = CAPTURE_COPY.memory;

// Sample person. Every fact below came from conversations she was part of, shared with consent.
const FACTS: { k: string; v: string[] }[] = [
  { k: "First met", v: ["Token2049"] },
  { k: "Conversations", v: ["7"] },
  { k: "Topics", v: ["Product prioritization", "Customer feedback", "AI PM", "Analytics"] },
  { k: "Recurring problems", v: ["Customer requests", "Prioritization", "Feedback fragmentation"] },
  { k: "Latest conversation", v: ["Sept 30, 2026"] },
];

// Seven conversations over five months; four of them raised the same problem (lit).
const TIMELINE = [
  { when: "May", what: "Token2049", lit: false },
  { when: "Jun", what: "Customer call", lit: true },
  { when: "Jul", what: "Telegram", lit: false },
  { when: "Jul", what: "Voice note", lit: true },
  { when: "Aug", what: "Interview", lit: false },
  { when: "Sep", what: "Telegram", lit: true },
  { when: "Sep", what: "Customer call", lit: true },
];

/** The profile: facts land one by one. */
function Profile() {
  const { ref, step, still } = useScrollSequence([400, ...FACTS.map(() => 320), 5600]);
  return (
    <div ref={ref} data-reveal className="window p-6 sm:p-7">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-line-strong bg-ink/[0.05] font-display text-[1.375rem] font-light text-fg" aria-hidden="true">
          S
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.75rem] uppercase tracking-[0.2em] text-fg">Sarah</p>
          <p className="mt-1 text-[0.9375rem] text-fg-2">Head of Product · Acme</p>
        </div>
        <span className="tag hidden sm:inline-flex">
          <Eye className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
          Visible to product team
        </span>
      </div>

      <dl className="mt-6 flex flex-col">
        {FACTS.map((f, i) => (
          <Stage key={f.k} on={still || step > i} className="grid grid-cols-[9.5rem_minmax(0,1fr)] items-start gap-3 border-t border-line py-3">
            <dt className="pt-1 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{f.k}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {f.v.length > 1 ? (
                f.v.map((v) => (
                  <span key={v} className={`tag ${f.k === "Recurring problems" && v === "Customer requests" ? "border-brand-400/40 text-fg" : ""}`}>
                    {v}
                  </span>
                ))
              ) : (
                <span className="text-[0.9375rem] text-fg">{f.v[0]}</span>
              )}
            </dd>
          </Stage>
        ))}
      </dl>
    </div>
  );
}

/** Seven conversations on a line; the four about the same problem light up. */
function Timeline() {
  const { ref, step, still } = useScrollSequence([400, ...TIMELINE.map(() => 300), 5600]);
  return (
    <div ref={ref} data-reveal className="window p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">Conversations with Sarah</p>
        <p className="text-[0.75rem] text-fg-3">
          <span className="text-brand-300">●</span> about customer requests
        </p>
      </div>
      <ol className="relative mt-8 grid grid-cols-7 gap-1">
        <span aria-hidden="true" className="absolute inset-x-[7%] top-[0.4375rem] h-px bg-line" />
        {TIMELINE.map((t, i) => {
          const on = still || step > i;
          return (
            <li key={i} className="relative flex flex-col items-center gap-2.5 text-center">
              <span
                className={`h-3.5 w-3.5 rounded-full border-2 transition-[background-color,border-color,opacity,transform] duration-500 ${
                  on ? (t.lit ? "scale-100 border-brand-400 bg-brand-400 shadow-[0_0_16px_rgb(var(--brand-glow-rgb)/0.6)]" : "scale-100 border-line-strong bg-panel") : "scale-50 border-line opacity-0"
                }`}
                aria-hidden="true"
              />
              <span className="text-[0.75rem] tabular-nums text-fg-2">{t.when}</span>
              <span className={`hidden text-[0.6875rem] leading-tight sm:block ${t.lit ? "text-fg-2" : "text-fg-3"}`}>{t.what}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** What Selixa noticed across them. */
function Pattern() {
  const { ref, step, still } = useScrollSequence([900, 5600]);
  return (
    <div ref={ref}>
      <Stage on={still || step >= 1} className={`card card-lit flex items-start gap-4 p-6 ${!still && step === 1 ? "is-live" : ""}`}>
        <Orb size={40} className="shrink-0" />
        <div>
          <p className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-brand-300">
            <Lightbulb className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
            Pattern
          </p>
          <p className="mt-2 text-[1.1875rem] leading-[1.4] tracking-[-0.01em] text-fg">
            Sarah has mentioned customer-request prioritization in 4 separate conversations.
          </p>
        </div>
      </Stage>
    </div>
  );
}

export function Memory() {
  return (
    <Section id="memory">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
        {/* Large screens: the words stay pinned (vertically centred under the nav) while the profile scrolls past. */}
        <div className="lg:sticky lg:top-[max(7rem,calc(50svh-12rem))]">
          <SectionHeader num="02" label={C.label} title={C.headline} lead={C.line} />
          {/* The controls that come with it */}
          <ul data-reveal style={d(240)} className="mt-10 flex flex-col gap-3 text-[0.9375rem] text-fg-2">
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.6} aria-hidden="true" />
              Shared with consent
            </li>
            <li className="flex items-center gap-3">
              <Eye className="h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.6} aria-hidden="true" />
              You choose who sees it
            </li>
            <li className="flex items-center gap-3">
              <PencilLine className="h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.6} aria-hidden="true" />
              Edit or remove anytime
            </li>
          </ul>
        </div>

        {/* Three cards scroll past the pinned words, each playing as it arrives */}
        <div className="flex flex-col gap-6 lg:gap-24 lg:py-[12svh]">
          <Profile />
          <Timeline />
          <Pattern />
        </div>
      </div>
    </Section>
  );
}
