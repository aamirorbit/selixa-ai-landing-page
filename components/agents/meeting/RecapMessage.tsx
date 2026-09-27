"use client";

import { Check, CircleHelp, Hash, Lightbulb, ListChecks, Scale, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Stage } from "@/components/landing/demo";
import { LOGOS } from "@/components/landing/logos";
import { Orb, SectionHeader, WindowBar, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { Initials } from "@/components/site/Initials";
import { SourceChip } from "@/components/site/SourceChip";
import { MEETING_COPY } from "./copy";

const R = MEETING_COPY.recap;
const SLACK = LOGOS.find((l) => l.name === "Slack")!;

// Plays once when it comes into view: header, first line, decisions, action rows, questions,
// insight, buttons, reactions. The last step holds (well inside setTimeout's limit).
//          start header first dec  act×5              qs   ins  btns reac hold
const SCRIPT = [120, 80, 100, 120, 70, 70, 70, 70, 120, 140, 160, 120, 150, 2_000_000_000];
const AT = { header: 1, first: 2, decisions: 3, actions: 4, questions: 9, insight: 10, buttons: 11, reactions: 12 };

function Block({ icon: Icon, label, on, children }: { icon: LucideIcon; label: string; on: boolean; children: ReactNode }) {
  return (
    <Stage on={on} className="mt-4">
      <p className="flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.12em] text-fg-3">
        <Icon className="h-3 w-3 text-brand-300" strokeWidth={2} aria-hidden="true" />
        {label}
      </p>
      {children}
    </Stage>
  );
}

/** The recap Selixa posts as the call ends: a chat message in the product's channel. */
export function RecapMessage() {
  const { ref, step, still } = useSequence(SCRIPT);
  const at = (n: number) => still || step >= n;

  return (
    <section id="recap" className="relative pb-24 pt-12 sm:pb-32">
      <SectionHeader num="02" label={R.eyebrow} title={R.headline} align="center" className="mx-auto" />

      <div ref={ref} data-reveal style={d(120)} className="window mx-auto mt-14 max-w-[680px]">
        <WindowBar>
          <span className="flex items-center gap-1.5 text-fg-2">
            <Hash className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {R.channel.replace(/^#/, "")}
          </span>
          <SourceChip logo={SLACK} label="Slack" size="sm" className="ml-auto" />
        </WindowBar>

        <div className="p-5 sm:p-6">
          <Stage on={at(AT.header)} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="sm:hidden">
              <Orb size={32} />
            </span>
            <span className="hidden sm:block">
              <Orb size={36} />
            </span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[0.875rem] text-fg">{R.sender}</span>
              <span className="tag px-1.5 py-0 text-[0.625rem]">{R.appTag}</span>
              <span className="text-[0.75rem] text-fg-3">{R.time}</span>
            </span>
          </Stage>

          <div className="mt-2 sm:pl-12">
            <Stage on={at(AT.first)} as="p" className="text-[0.875rem] text-fg-2">
              {R.firstLine}
            </Stage>

            <Block icon={Scale} label={R.labels.decisions} on={at(AT.decisions)}>
              <ul className="mt-2 flex flex-col gap-1.5">
                {R.decisions.map((t) => (
                  <li key={t} className="flex items-baseline gap-2.5 text-[0.9375rem] text-fg">
                    <span className="h-1.5 w-1.5 shrink-0 -translate-y-[2px] rounded-full bg-brand-500" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </Block>

            <Stage on={at(AT.actions)} className="mt-4">
              <p className="flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.12em] text-fg-3">
                <ListChecks className="h-3 w-3 text-brand-300" strokeWidth={2} aria-hidden="true" />
                {R.labels.actions}
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {R.actions.map((a, i) => (
                  <Stage
                    key={a.task}
                    as="li"
                    on={at(AT.actions + i)}
                    className="flex items-start gap-2.5 text-[0.875rem] text-fg"
                  >
                    <Initials name={a.who} size={20} className="mt-px" />
                    <span className="min-w-0 flex-1">
                      {a.who} · {a.task}
                    </span>
                    <span className="mt-[3px] h-3.5 w-3.5 shrink-0 rounded-[4px] border border-line-strong" aria-hidden="true" />
                  </Stage>
                ))}
              </ul>
            </Stage>

            <Block icon={CircleHelp} label={R.labels.questions} on={at(AT.questions)}>
              <ul className="mt-2 flex flex-col gap-1.5">
                {R.questions.map((q) => (
                  <li key={q} className="flex items-start gap-2 text-[0.875rem] text-fg-2">
                    <CircleHelp className="mt-[3px] h-3.5 w-3.5 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
                    {q}
                  </li>
                ))}
              </ul>
            </Block>

            <Block icon={Lightbulb} label={R.labels.insight} on={at(AT.insight)}>
              <p className="card mt-2 overflow-hidden rounded-[10px]! p-3 text-[0.9375rem] text-fg">
                <span
                  aria-hidden="true"
                  className={`card-lit pointer-events-none absolute inset-0 rounded-[10px] border transition-opacity duration-500 ${at(AT.insight) ? "opacity-100" : "opacity-0"}`}
                />
                <span className="relative">{R.insight}</span>
              </p>
            </Block>

            {/* Message buttons: part of the picture, not actions (the page keeps one primary action) */}
            <div aria-hidden="true">
              <Stage on={at(AT.buttons)} className="mt-5 grid grid-cols-2 gap-2 sm:flex">
                {R.buttons.map((label) => (
                  <span key={label} className="btn-ghost btn-ghost-sm pointer-events-none justify-center">
                    {label}
                  </span>
                ))}
              </Stage>
            </div>

            <Stage on={at(AT.reactions)} className="mt-3">
              <span className="tag gap-1.5 px-2 py-0.5">
                <span className="grid h-3.5 w-3.5 place-items-center rounded-[4px] bg-brand-500 text-[var(--brand-on)]" aria-hidden="true">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span className="tabular-nums">{R.reactions}</span>
              </span>
            </Stage>
          </div>
        </div>
      </div>
    </section>
  );
}
