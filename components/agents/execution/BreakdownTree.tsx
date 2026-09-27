"use client";

import { Video } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { BrandMark } from "@/components/landing/BrandMark";
import { LOGOS } from "@/components/landing/logos";
import { Initials } from "@/components/site/Initials";
import { StickyScene, useMeasure, useSceneBeat, useSceneStill } from "@/components/site/StickyScene";
import { EXECUTION_COPY, OWNERS } from "./copy";

/*
 * The breakdown (spec §3.2): one decision grows into a requirement, 14 tasks and three owners
 * as the page scrolls. Every piece steps in on a beat (opacity + a small slide); connectors
 * are measured once per resize and only fade. The server renders the p = 0 frame; CSS shows
 * the finished tree whenever the scene is static ([data-scene-show]).
 */

const T = EXECUTION_COPY.breakdown;
const LINEAR = LOGOS.find((l) => l.name === "Linear")!;

const TASKS_FROM = 0.34;
const TASK_STEP = 0.022;
const BEATS = [0.06, 0.14, 0.18, 0.26, ...Array.from({ length: 14 }, (_, i) => Math.round((TASKS_FROM + i * TASK_STEP) * 1000) / 1000), 0.7, 0.86];
const OWNERS_BEAT = 19;
const LIT = 20;
/** Tasks in tree order (grouped by owner), with their beat. */
const ORDERED = OWNERS.flatMap((o) => o.tasks);

const stepIn = (on: boolean, delay = 0): { className: string; style: CSSProperties } => ({
  className: `transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0"}`,
  style: { transitionDelay: on ? `${delay}ms` : "0ms" },
});

type Paths = { base: string[]; w: number; h: number };

/** Desktop / tablet: four levels, left → right. */
function Tree({ b }: { b: number }) {
  const [paths, setPaths] = useState<Paths>({ base: [], w: 0, h: 0 });

  // Connectors from measured node boxes, once per resize (never during scroll).
  const grid = useMeasure<HTMLDivElement>((el) => {
    const box = el.getBoundingClientRect();
    const r = (sel: string) => {
      const n = el.querySelector<HTMLElement>(sel);
      if (!n) return null;
      const q = n.getBoundingClientRect();
      return { l: q.left - box.left, r: q.right - box.left, t: q.top - box.top, b: q.bottom - box.top, m: (q.top + q.bottom) / 2 - box.top };
    };
    const dec = r("[data-node=decision]");
    const req = r("[data-node=requirement]");
    const first = r("[data-pill]:first-of-type");
    const pills = Array.from(el.querySelectorAll<HTMLElement>("[data-group]"));
    if (!dec || !req || !first || !pills.length) return;
    const base: string[] = [];
    base.push(`M${dec.r} ${dec.m} H${req.l}`);
    const groups = pills.map((g) => {
      const q = g.getBoundingClientRect();
      return { l: q.left - box.left, r: q.right - box.left, t: q.top - box.top, b: q.bottom - box.top };
    });
    const bx = groups[0].l - 16;
    base.push(`M${req.r} ${req.m} H${bx} M${bx} ${groups[0].t + 13} V${groups[groups.length - 1].b - 13}`);
    groups.forEach((g, i) => {
      base.push(`M${bx} ${(g.t + g.b) / 2} H${g.l - 4}`);
      const owner = r(`[data-owner="${i}"]`);
      if (!owner) return;
      const ox = g.r + 14;
      base.push(`M${ox - 6} ${g.t + 6} H${ox} V${g.b - 6} H${ox - 6} M${ox} ${(g.t + g.b) / 2} H${owner.l - 6}`);
    });
    setPaths({ base, w: box.width, h: box.height });
  });

  const lit = b >= LIT;
  return (
    <div ref={grid} className="relative grid grid-cols-[160px_180px_minmax(0,1fr)_120px] gap-x-8 lg:grid-cols-[200px_220px_minmax(0,1fr)_180px] lg:gap-x-12">
      {/* Connectors: a base layer and a brand layer that fades in at the end */}
      <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 overflow-visible" width={paths.w} height={paths.h} fill="none">
        {paths.base.map((d, i) => {
          const on = i === 0 ? b >= 2 : i === 1 ? b >= 4 : b >= OWNERS_BEAT;
          return (
            <g key={i} data-scene-show className={`transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`}>
              <path d={d} stroke="rgb(var(--ink-rgb) / 0.14)" strokeWidth={1} />
              <path d={d} stroke="rgb(var(--brand-400-rgb) / 0.6)" strokeWidth={1} className={`transition-opacity duration-300 ${lit ? "opacity-100" : "opacity-0"}`} data-scene-show />
            </g>
          );
        })}
      </svg>

      {/* Level labels */}
      {T.levels.map((l, i) => (
        <p key={l} className="flex items-center gap-2 pb-5 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">
          {l}
          {i === 2 && (
            <span data-scene-show {...stepIn(b >= 4)} >
              <span className="flex items-center gap-1.5 normal-case tracking-normal text-fg-2">
                · {T.tasksHeader}
                <BrandMark logo={LINEAR} lit className="h-3 w-3" />
                {T.tasksTool}
              </span>
            </span>
          )}
        </p>
      ))}

      {/* Decision */}
      <div className="flex items-center">
        <div data-node="decision" data-scene-show className={`card relative w-full p-4 ${stepIn(b >= 1).className}`}>
          <span aria-hidden="true" className={`card-lit pointer-events-none absolute inset-0 rounded-[14px] border transition-opacity duration-300 ${lit ? "opacity-100" : "opacity-0"}`} data-scene-show />
          <p className="relative flex items-center gap-1.5 text-[0.6875rem] text-fg-3">
            <Video className="h-3 w-3 text-brand-300" strokeWidth={2} aria-hidden="true" />
            {T.decisionSource}
          </p>
          <p className="relative mt-1.5 text-[0.9375rem] text-fg">{T.decision}</p>
        </div>
      </div>

      {/* Requirement */}
      <div className="flex items-center">
        <div data-node="requirement" data-scene-show className={`card w-full p-4 ${stepIn(b >= 3).className}`}>
          <p className="text-[0.9375rem] text-fg">{T.requirement}</p>
          <p className="mt-1 text-[0.78125rem] text-fg-3">{T.requirementDate}</p>
        </div>
      </div>

      {/* Tasks, grouped by owner */}
      <div className="flex min-w-0 flex-col gap-[18px]">
        {OWNERS.map((o) => (
          <ul key={o.name} data-group className="flex flex-col gap-1.5">
            {o.tasks.map((t) => {
              const g = ORDERED.indexOf(t);
              const s = stepIn(b >= 5 + g);
              return (
                <li key={t.id} data-pill data-scene-show className={`flex h-[26px] min-w-0 items-center gap-2 ${s.className}`}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-[3px] border border-line-strong" aria-hidden="true" />
                  <span className="shrink-0 text-[0.6875rem] tabular-nums text-fg-3">{t.id}</span>
                  <span className="truncate text-[0.78125rem] text-fg-2">{t.title}</span>
                </li>
              );
            })}
          </ul>
        ))}
      </div>

      {/* Owners, each centred on its group */}
      <div className="flex flex-col gap-[18px]">
        {OWNERS.map((o, i) => {
          const s = stepIn(b >= OWNERS_BEAT, i * 80);
          return (
            <div key={o.name} className="flex items-center" style={{ height: o.tasks.length * 26 + (o.tasks.length - 1) * 6 }}>
              <div data-owner={i} data-scene-show className={`flex items-center gap-2.5 ${s.className}`} style={s.style}>
                <Initials name={o.name} size={32} />
                <span className="flex flex-col">
                  <span className="hidden text-[0.8125rem] text-fg lg:inline">{o.name}</span>
                  <span className="text-[0.75rem] tabular-nums text-fg-3">
                    <span className="lg:hidden">{o.name.split(" ")[0]} · </span>
                    {o.tasks.length}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Phone: a vertical outline; each owner's ticks fill as their tasks land. */
function Outline({ b }: { b: number }) {
  return (
    <div className="flex flex-col">
      <div data-scene-show className={`card relative p-4 ${stepIn(b >= 1).className}`}>
        <span aria-hidden="true" className={`card-lit pointer-events-none absolute inset-0 rounded-[14px] border transition-opacity duration-300 ${b >= LIT ? "opacity-100" : "opacity-0"}`} data-scene-show />
        <p className="relative text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{T.levels[0]}</p>
        <p className="relative mt-1 text-[0.9375rem] text-fg">{T.decision}</p>
      </div>
      <span aria-hidden="true" className="ml-8 h-5 w-px bg-ink/[0.14]" />
      <div data-scene-show className={`card p-4 ${stepIn(b >= 3).className}`}>
        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{T.levels[1]}</p>
        <p className="mt-1 text-[0.9375rem] text-fg">
          {T.requirement} <span className="text-fg-3">· {T.requirementDate}</span>
        </p>
      </div>
      <span aria-hidden="true" className="ml-8 h-5 w-px bg-ink/[0.14]" />
      <p data-scene-show className={`flex items-center gap-1.5 text-[0.8125rem] text-fg-2 ${stepIn(b >= 4).className}`}>
        {T.tasksHeader}
        <BrandMark logo={LINEAR} lit className="h-3 w-3" />
        {T.tasksTool}
      </p>
      <ul className="ml-8 mt-2 border-l border-ink/[0.14]">
        {OWNERS.map((o) => (
          <li key={o.name} data-scene-show className={`flex h-[52px] items-center gap-3 pl-4 ${stepIn(b >= 4).className}`}>
            <Initials name={o.name} size={28} />
            <span className="flex-1 truncate text-[0.875rem] text-fg">{o.name}</span>
            <span className="flex gap-1" aria-hidden="true">
              {o.tasks.map((t) => {
                const on = b >= 5 + ORDERED.indexOf(t);
                return (
                  <span key={t.id} className="relative h-4 w-4 rounded-[4px] border border-line-strong">
                    <span data-scene-show className={`absolute -inset-px rounded-[4px] bg-[var(--progress)] transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} />
                  </span>
                );
              })}
            </span>
            <span className="w-3 text-right text-[0.75rem] tabular-nums text-fg-3">{o.tasks.length}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TreeStage() {
  const beat = useSceneBeat(BEATS);
  const still = useSceneStill();
  const b = still ? 0 : beat;
  return (
    <div className="mx-auto flex h-full w-full max-w-[1120px] flex-col justify-center py-8">
      {/* For assistive tech: decision → requirement → owners → their tasks */}
      <div className="sr-only">
        <p>
          {T.levels[0]}: {T.decision}. {T.levels[1]}: {T.requirement}, {T.requirementDate}. {T.tasksHeader} {T.tasksTool}.
        </p>
        <ul>
          {OWNERS.map((o) => (
            <li key={o.name}>
              {o.name} · {o.tasks.length}
              <ul>
                {o.tasks.map((t) => (
                  <li key={t.id}>
                    {t.id} {t.title}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="hidden md:block">
        <Tree b={b} />
      </div>
      <div aria-hidden="true" className="md:hidden">
        <Outline b={b} />
      </div>
    </div>
  );
}

export function BreakdownTree() {
  return (
    <StickyScene id="breakdown" length={2.4} label={T.headline}>
      <TreeStage />
    </StickyScene>
  );
}
