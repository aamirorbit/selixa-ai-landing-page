"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Section, SectionHeader, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";

export type TrackStep = {
  label: string;
  /** What exists at this step, in a few words. */
  artifact: string;
  icon: LucideIcon;
  /** Selixa's page for this step, if it has one. */
  href?: string;
  /** Which bracket the step belongs to (index into `groups`). */
  group: number;
};

type Props = {
  id: string;
  num: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  steps: TrackStep[];
  /** Brackets over the track on large screens, left to right, e.g. Signal · Selixa. The first is lit. */
  groups: string[];
};

/**
 * One piece of work carried along a row of steps, each lit in turn (a looping demo), with
 * brackets above naming which part of Selixa does what. Across on large screens, down on
 * small ones (where each step of the first group carries its tag instead).
 */
export function StepTrack({ id, num, label, title, lead, steps, groups }: Props) {
  const n = steps.length;
  const { ref, step, still } = useSequence([400, ...steps.map(() => 520), 4200]);
  // How far along the line the work has travelled, 0 → 1 (transform only).
  const progress = still ? 1 : Math.min(1, Math.max(0, (step - 1) / (n - 1)));
  const spans = groups.map((_, g) => steps.filter((s) => s.group === g).length);

  return (
    <Section id={id}>
      <SectionHeader num={num} label={label} title={title} lead={lead} />

      <div aria-hidden="true" className="mt-16 hidden gap-3 lg:grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {groups.map((g, i) => (
          <p
            key={g}
            style={{ gridColumn: `span ${spans[i]} / span ${spans[i]}` }}
            className={`border-t pt-3 text-center text-[0.6875rem] uppercase tracking-[0.18em] ${
              i === 0 ? "border-brand-400/40 text-brand-300" : "border-line-strong text-fg-3"
            }`}
          >
            {g}
          </p>
        ))}
      </div>

      <div ref={ref} className="relative mt-16 lg:mt-8">
        {/* The line the work travels: across on large screens, down on small */}
        <div
          aria-hidden="true"
          className="absolute top-[1.375rem] hidden h-px bg-line lg:block"
          style={{ left: `calc(100% / ${n * 2})`, right: `calc(100% / ${n * 2})` }}
        >
          <div
            className="h-full origin-left bg-[linear-gradient(90deg,var(--color-brand-400),var(--color-brand-300))] transition-transform duration-500 ease-[var(--ease-out-expo)]"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <div aria-hidden="true" className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-line lg:hidden">
          <div
            className="h-full origin-top bg-brand-400 transition-transform duration-500 ease-[var(--ease-out-expo)]"
            style={{ transform: `scaleY(${progress})` }}
          />
        </div>

        <ol className="relative grid grid-cols-1 gap-6 lg:gap-3 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ "--n": n } as CSSProperties}>
          {steps.map(({ label: stepLabel, artifact, icon: Icon, href, group }, i) => {
            const on = still || step > i;
            const now = !still && step === i + 1;
            const body = (
              <>
                <span
                  className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full border bg-panel transition-[border-color,color,box-shadow] duration-500 ${
                    on ? "border-brand-400/60 text-brand-300" : "border-line text-fg-3"
                  } ${now ? "is-live" : ""}`}
                >
                  <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col lg:mt-4 lg:items-center">
                  <span className="flex items-center gap-2 text-[0.9375rem] text-fg">
                    {stepLabel}
                    {group === 0 && (
                      <span className="rounded-full bg-brand-500/15 px-1.5 py-0.5 text-[0.625rem] uppercase tracking-[0.12em] text-brand-300 lg:hidden">
                        {groups[0]}
                      </span>
                    )}
                  </span>
                  <span className={`mt-1 text-[0.8125rem] transition-colors duration-500 ${on ? "text-fg-2" : "text-fg-3"}`}>{artifact}</span>
                </span>
              </>
            );
            return (
              <li key={stepLabel} data-reveal style={d(i * 50)}>
                {href ? (
                  <Link href={href} className="group flex items-center gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
