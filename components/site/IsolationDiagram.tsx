"use client";

import { Brain, CircleCheck, FileText, Lock, Video, X, type LucideIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Orb } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";

const ROW_ICONS: LucideIcon[] = [Video, FileText, CircleCheck, Brain];
const show = (on: boolean) => (on ? "opacity-100" : "opacity-0");

type SealedContainerProps = {
  name: string;
  letter: string;
  active: boolean;
  /** Row labels (Meetings, Docs, Decisions, Memory). */
  rows: string[];
  /** The bottom slot (e.g. the agent chip), always reserved. */
  slot?: ReactNode;
  /** Something drawn from the Memory row outwards (the blocked path). */
  memoryExtra?: ReactNode;
  compact?: boolean;
};

/**
 * One product as a sealed container: its chip, a lock, its own rows, and a bottom slot. When
 * active: lit layer, seal ring, brand chip and icons (all pre-rendered layers, opacity only).
 */
export function SealedContainer({ name, letter, active, rows, slot, memoryExtra, compact }: SealedContainerProps) {
  return (
    <div className={`window relative flex flex-col overflow-visible! rounded-[20px]! ${compact ? "h-[232px] p-3.5" : "h-[232px] p-3.5 md:h-[280px] md:p-5 lg:h-[300px]"}`}>
      <span aria-hidden="true" className={`card-lit pointer-events-none absolute inset-0 rounded-[20px] border transition-opacity duration-[240ms] ${show(active)}`} />
      <span className="seal-ring [--seal-r:20px]" data-on={active} />
      <div className="relative flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className="relative grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] bg-ink/[0.08] text-[0.6875rem] text-fg-2">
            {letter}
            <span className={`absolute inset-0 grid place-items-center rounded-[6px] bg-brand-500 text-[var(--brand-on)] transition-opacity duration-200 ${show(active)}`}>{letter}</span>
          </span>
          <span className="truncate text-[0.875rem] text-fg md:text-[0.9375rem]">{name}</span>
        </span>
        <span className="relative grid h-3.5 w-3.5 [&>*]:col-start-1 [&>*]:row-start-1">
          <Lock className={`h-3.5 w-3.5 text-fg-3 transition-opacity duration-200 ${show(!active)}`} strokeWidth={2} />
          <Lock className={`h-3.5 w-3.5 text-brand-300 transition-opacity duration-200 ${show(active)}`} strokeWidth={2} />
        </span>
      </div>
      <ul className="relative mt-3 flex flex-col md:mt-4">
        {rows.map((r, k) => {
          const Icon = ROW_ICONS[k % ROW_ICONS.length];
          return (
            <li key={r} className="relative flex h-[30px] items-center gap-2.5 text-[0.78125rem] text-fg-2 md:h-9 md:text-[0.84375rem]">
              <span className="relative grid h-3.5 w-3.5 shrink-0 md:h-4 md:w-4 [&>*]:col-start-1 [&>*]:row-start-1">
                <Icon className={`h-full w-full text-fg-3 transition-opacity duration-200 ${show(!active)}`} strokeWidth={1.75} />
                <Icon
                  className={`h-full w-full text-brand-300 transition-opacity duration-200 ${show(active)}`}
                  strokeWidth={1.75}
                  style={{ transitionDelay: active ? `${k * 60}ms` : "0ms" }}
                />
              </span>
              <span className="truncate">{r}</span>
              {k === rows.length - 1 && memoryExtra}
            </li>
          );
        })}
      </ul>
      <div className="relative mt-auto grid h-10 place-items-center">{slot}</div>
    </div>
  );
}

type IsolationDiagramProps = {
  /** Default Atlas, Beacon, Cove, Drift. */
  products?: string[];
  contents: string[];
  /** The agent's chip, with {product} filled in: "Selixa, working in {product}". */
  agentLabel: string;
  wallLabel: string;
  blockedLabel: string;
  /** Two containers, no loop: the still frame (Atlas active, blocked path shown). */
  compact?: boolean;
};

// Beacon, Cove, Drift, Atlas, then the blocked path and a hold.
const SCRIPT = [1000, 1000, 1000, 800, 3200];
const BLOCKED = 4;

function WallBadge({ small, pulse }: { small?: boolean; pulse?: boolean }) {
  return (
    <span
      className={`relative z-10 grid place-items-center rounded-full border border-line bg-panel transition-transform duration-300 ${small ? "h-6 w-6" : "h-7 w-7"} ${pulse ? "scale-110" : "scale-100"}`}
    >
      <Lock className={`h-3 w-3 transition-colors duration-300 ${pulse ? "text-brand-300" : "text-fg-3"}`} strokeWidth={2} />
    </span>
  );
}

/**
 * The isolation diagram: products as sealed containers side by side, walls between them with a
 * lock. A Selixa agent works inside one container at a time (it never crosses a wall); then a
 * dashed path from Atlas's memory stops dead at the wall: "Not shared".
 */
export function IsolationDiagram({ products = ["Atlas", "Beacon", "Cove", "Drift"], contents, agentLabel, wallLabel, blockedLabel, compact }: IsolationDiagramProps) {
  const list = compact ? products.slice(0, 2) : products;
  const agentFor = (p: string) => agentLabel.replace("{product}", p);
  const { ref, step, still } = useSequence(SCRIPT);
  const frame = still || compact ? BLOCKED : step;
  // Step 0 Beacon, 1 Cove, 2 Drift, 3–4 Atlas.
  const activeName = frame >= 3 ? list[0] : list[(frame + 1) % list.length];
  const blocked = frame === BLOCKED;

  const chip = (p: string, on: boolean) => (
    <>
      <span
        className={`hidden h-8 max-w-full items-center gap-2 rounded-full border border-line bg-panel-2 px-2.5 text-[0.75rem] text-fg-2 transition-[opacity,transform] duration-200 md:flex ${
          on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
        style={{ transitionDelay: on ? "120ms" : "0ms" }}
      >
        <Orb size={18} />
        <span className="truncate">{agentFor(p)}</span>
      </span>
      <span className={`transition-opacity duration-200 md:hidden ${show(on)}`} style={{ transitionDelay: on ? "120ms" : "0ms" }}>
        <Orb size={22} />
      </span>
    </>
  );

  const path = (
    <span aria-hidden="true" className="pointer-events-none absolute left-full top-1/2 z-20 flex -translate-y-1/2 items-center">
      <span className={`h-0 w-[calc(var(--wall)/2+1.25rem)] origin-left border-t border-dashed border-brand-400/60 transition-transform duration-[400ms] ${blocked ? "scale-x-100" : "scale-x-0"}`} />
      <X className={`-ml-1 h-2.5 w-2.5 text-brand-300 transition-opacity duration-200 ${show(blocked)}`} strokeWidth={2.5} style={{ transitionDelay: blocked ? "380ms" : "0ms" }} />
      <span
        className={`absolute -top-5 left-0 hidden whitespace-nowrap text-[0.6875rem] text-brand-200 transition-opacity duration-200 md:block ${show(blocked)}`}
        style={{ transitionDelay: blocked ? "420ms" : "0ms" }}
      >
        {blockedLabel}
      </span>
    </span>
  );

  const cols = compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4";

  return (
    <div ref={ref} className="mx-auto w-full max-w-[1120px]">
      <div aria-hidden="true" className={`relative grid gap-x-4 gap-y-4 [--wall:1rem] md:gap-x-8 md:gap-y-8 md:[--wall:2rem] lg:gap-x-10 lg:[--wall:2.5rem] ${cols}`}>
        {list.map((p, i) => (
          <Fragment key={p}>
            <div className="relative">
              <SealedContainer
                name={p}
                letter={p[0]}
                active={p === activeName}
                rows={contents}
                slot={chip(p, p === activeName)}
                memoryExtra={i === 0 ? path : undefined}
                compact={compact}
              />
              {/* The wall to the right of this container (between columns only) */}
              {i < list.length - 1 && (i % 2 === 0 || !compact) && (
                <span
                  className={`absolute inset-y-0 left-full flex w-[var(--wall)] flex-col items-center justify-center ${i % 2 === 1 ? "max-lg:hidden" : ""}`}
                >
                  <span className="absolute inset-y-0 left-1/2 w-[5px] -translate-x-1/2 border-x border-ink/[0.1]" />
                  <WallBadge small={compact} pulse={i === 0 && blocked} />
                  {i === 0 && <span className="relative mt-2 hidden bg-bg text-[0.5625rem] uppercase tracking-[0.06em] text-fg-3 lg:block">{wallLabel}</span>}
                </span>
              )}
            </div>
          </Fragment>
        ))}
      </div>
      {/* Phones: the agent's line under the grid (the token in the container has no text) */}
      <div aria-hidden="true" className="mt-4 grid text-center text-[0.8125rem] text-fg-2 md:hidden [&>*]:col-start-1 [&>*]:row-start-1">
        {list.map((p) => (
          <span key={p} className={`transition-opacity duration-200 ${show(p === activeName)}`}>
            {agentFor(p)}
          </span>
        ))}
      </div>
      <p aria-hidden="true" className={`mt-1 text-center text-[0.6875rem] text-brand-200 transition-opacity duration-200 md:hidden ${show(blocked)}`}>
        {blockedLabel}
      </p>
    </div>
  );
}
