"use client";

import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import type { CSSProperties } from "react";
import { BrandMark } from "@/components/landing/BrandMark";
import type { BrandLogo } from "@/components/landing/logos";
import { Orb, d } from "@/components/landing/ui";
import { AGENT_ICONS, agentShortName } from "../agents";
import { useInView } from "../useInView";
import type { Agent } from "@/lib/content/agents";

type DataFlowProps = {
  product: { initial: string; name: string; tag: string };
  tools: BrandLogo[];
  agents: Agent[];
  contextItems: string[];
  greyed: { initial: string; name: string; tag: string; note: string; tools: BrandLogo[] };
  labels: { tools: string; agents: string; reads: string; writes: string };
  /** Screen-reader summary of the picture. */
  summary: string;
};

/** Two lanes: reads flow one way, writes come back. Packets are CSS (transform/opacity) and run only in view. */
function Lanes({ vertical, labels, offset = 0 }: { vertical?: boolean; labels?: { reads: string; writes: string }; offset?: number }) {
  const lane = (dir: "out" | "back", delay: number) => (
    <span className={`relative block bg-ink/[0.12] ${vertical ? "h-full w-px" : "h-px w-full"}`}>
      <span
        className="lane-packet absolute -left-[2.5px] -top-[2.5px] block h-[5px] w-[5px] rounded-full bg-brand-400 shadow-[0_0_8px_rgb(var(--brand-glow-rgb)/0.6)]"
        data-dir={dir}
        data-axis={vertical ? "y" : "x"}
        style={{ "--lane-delay": `${delay + offset}s`, "--lane": vertical ? "56px" : "calc(5rem - 12px)" } as CSSProperties}
      />
      {vertical ? null : dir === "out" ? (
        <ChevronRight className="absolute -right-1.5 -top-[5px] h-2.5 w-2.5 text-fg-3" strokeWidth={2} />
      ) : (
        <ChevronLeft className="absolute -left-1.5 -top-[5px] h-2.5 w-2.5 text-fg-3" strokeWidth={2} />
      )}
    </span>
  );
  if (vertical)
    return (
      <div className="relative flex h-14 justify-center gap-2.5" aria-hidden="true">
        {labels && <span className="absolute right-[calc(50%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.6875rem] text-fg-3">{labels.reads}</span>}
        {lane("out", 0)}
        {lane("back", 0.9)}
        {labels && <span className="absolute left-[calc(50%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.6875rem] text-fg-3">{labels.writes}</span>}
      </div>
    );
  return (
    <div className="relative flex flex-col gap-2.5 px-1.5" aria-hidden="true">
      {labels && <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6875rem] text-fg-3">{labels.reads}</span>}
      {lane("out", 0)}
      {lane("back", 0.9)}
      {labels && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6875rem] text-fg-3">{labels.writes}</span>}
    </div>
  );
}

function Chip({ initial, lit }: { initial: string; lit?: boolean }) {
  return (
    <span className={`grid h-5 w-5 place-items-center rounded-[6px] text-[0.6875rem] ${lit ? "bg-brand-500 text-[var(--brand-on)]" : "bg-ink/[0.14] text-fg-2"}`} aria-hidden="true">
      {initial}
    </span>
  );
}

/**
 * How data flows: your tools → one product's isolated context → its agents, and back. A second,
 * greyed product sits below a dashed line with a lock: nothing crosses. Tool marks stay unlit.
 */
export function DataFlow({ product, tools, agents, contextItems, greyed, labels, summary }: DataFlowProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const half = Math.ceil(contextItems.length / 2);

  const boundary = (
    <div className="window rounded-[24px]! p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5">
          <Chip initial={product.initial} lit />
          <span className="text-[0.9375rem] text-fg">{product.name}</span>
        </span>
        <span className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">
          <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          {product.tag}
        </span>
      </div>
      <div className="mt-5 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {contextItems.slice(0, half).map((c) => (
            <span key={c} className="tag">
              {c}
            </span>
          ))}
        </div>
        <Orb size={56} />
        <div className="flex flex-wrap justify-center gap-2">
          {contextItems.slice(half).map((c) => (
            <span key={c} className="tag">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const toolTiles = (size: string, mark: string) =>
    tools.map((t) => (
      <span key={t.name} className={`grid place-items-center rounded-[12px] border border-line bg-ink/[0.025] ${size}`} title={t.name}>
        <BrandMark logo={t} lit={false} className={mark} />
      </span>
    ));

  const label = (text: string) => <p className="mb-3 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{text}</p>;

  return (
    <div ref={ref} data-inview={inView ? "" : undefined} className="mx-auto max-w-[1040px]">
      <p className="sr-only">{summary}</p>
      <ul className="sr-only">
        {tools.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>

      <div aria-hidden="true">
        {/* md+: one row, left to right */}
        <div className="hidden grid-cols-[minmax(0,10rem)_5rem_minmax(0,1fr)_5rem_minmax(0,7rem)] items-center md:grid lg:grid-cols-[minmax(0,15rem)_5rem_minmax(0,1fr)_5rem_minmax(0,11rem)]">
          <div data-reveal>
            {label(labels.tools)}
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">{toolTiles("h-10 w-10 lg:h-11 lg:w-11", "h-5 w-5")}</div>
          </div>
          <Lanes labels={{ reads: labels.reads, writes: labels.writes }} />
          <div data-reveal style={d(120)}>
            {boundary}
          </div>
          <Lanes offset={0.45} />
          <div data-reveal style={d(240)}>
            {label(labels.agents)}
            <ul className="flex flex-col gap-2">
              {agents.map((a) => {
                const Icon = AGENT_ICONS[a.icon];
                return (
                  <li key={a.slug} className="flex items-center gap-2.5 text-[0.875rem] text-fg-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] border border-line bg-ink/[0.03] text-brand-300">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                    <span className="hidden lg:inline">{agentShortName(a)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Phone: top to bottom */}
        <div className="mx-auto flex max-w-[358px] flex-col items-center md:hidden">
          {label(labels.tools)}
          <div className="flex flex-wrap justify-center gap-2">{toolTiles("h-9 w-9", "h-4 w-4")}</div>
          <div className="my-3 w-full">
            <Lanes vertical labels={{ reads: labels.reads, writes: labels.writes }} />
          </div>
          <div className="w-full">{boundary}</div>
          <div className="my-3 w-full">
            <Lanes vertical offset={0.45} />
          </div>
          {label(labels.agents)}
          <ul className="grid grid-cols-3 gap-3">
            {agents.map((a) => {
              const Icon = AGENT_ICONS[a.icon];
              return (
                <li key={a.slug} className="flex flex-col items-center gap-1.5 text-[0.75rem] text-fg-2">
                  <span className="grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-ink/[0.03] text-brand-300">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  {agentShortName(a)}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Nothing crosses: a dashed rule with a lock, then the other product, greyed */}
        <div data-reveal style={d(360)} className="mx-auto mt-10 max-w-[560px]">
          <div className="relative border-t border-dashed border-line-strong">
            <span className="absolute left-1/2 top-0 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg text-fg-3">
              <Lock className="h-3 w-3" strokeWidth={2} />
            </span>
          </div>
          <div className="card mt-10 rounded-[20px]! p-5 opacity-50">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <Chip initial={greyed.initial} />
                <span className="text-[0.9375rem] text-fg">{greyed.name}</span>
              </span>
              <span className="tag">
                <Lock className="h-3 w-3" strokeWidth={2} />
                {greyed.tag}
              </span>
            </div>
            <div className="mt-4 hidden items-center justify-center gap-3 sm:flex">
              {greyed.tools.map((t) => (
                <span key={t.name} className="grid h-7 w-7 place-items-center rounded-[8px] border border-line bg-ink/[0.025]">
                  <BrandMark logo={t} lit={false} className="h-3.5 w-3.5" />
                </span>
              ))}
              <span className="h-px w-8 bg-ink/[0.12]" />
              <Orb size={28} />
              <span className="h-px w-8 bg-ink/[0.12]" />
              {agents.slice(0, 3).map((a) => {
                const Icon = AGENT_ICONS[a.icon];
                return (
                  <span key={a.slug} className="grid h-7 w-7 place-items-center rounded-[8px] border border-line bg-ink/[0.03] text-fg-3">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[0.8125rem] text-fg-3">{greyed.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
