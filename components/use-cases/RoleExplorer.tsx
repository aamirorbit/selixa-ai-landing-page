"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { Orb } from "@/components/landing/ui";
import { AGENT_ICONS, agentShortName } from "@/components/site/agents";
import { RoleTabs } from "@/components/site/RoleTabs";
import { AGENTS } from "@/lib/content/agents";
import { USE_CASES, type UseCase } from "@/lib/content/use-cases";
import { DEFAULT_ROLE, HUB_COPY, ROLE_CHIPS } from "./copy";

const P = HUB_COPY.preview;
const ITEMS = ROLE_CHIPS.map((c) => ({ id: c.slug, label: c.label }));

/**
 * Pick your role: chips (tabs) over one large preview panel. All twelve previews are stacked in
 * one grid cell, so the panel is always the tallest one's height and never jumps; picking
 * cross-fades in place. ?role=<slug> opens that role; picking updates it (no history entries).
 * Nothing changes unless the visitor picks.
 */
export function RoleExplorer() {
  const [role, setRole] = useState(DEFAULT_ROLE);

  // Deep link: read ?role= once.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const r = new URLSearchParams(window.location.search).get("role");
      if (r && USE_CASES.some((u) => u.slug === r)) setRole(r);
    });
    return () => window.clearTimeout(t);
  }, []);

  const pick = (id: string) => {
    setRole(id);
    const url = new URL(window.location.href);
    url.searchParams.set("role", id);
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <div className="flex flex-col items-center">
      <RoleTabs items={ITEMS} value={role} onChange={pick} label={HUB_COPY.chipsLabel} idPrefix="role" className="w-[calc(100%+2.5rem)] md:w-auto md:max-w-[60rem]" />
      <div id="roles" className="window mt-7 grid w-full max-w-[1040px] rounded-[24px]! text-left [&>*]:col-start-1 [&>*]:row-start-1">
        {ROLE_CHIPS.map((c) => {
          const u = USE_CASES.find((x) => x.slug === c.slug)!;
          return <Preview key={u.slug} u={u} active={u.slug === role} />;
        })}
      </div>
    </div>
  );
}

const rise = (on: boolean, d: number): { className: string; style: CSSProperties } => ({
  className: `transition-[opacity,transform] duration-[280ms] motion-reduce:transition-none ${on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"}`,
  style: { transitionDelay: on ? `${60 + d}ms` : "0ms" },
});

function Preview({ u, active }: { u: UseCase; active: boolean }) {
  const r = (d: number) => rise(active, d);
  return (
    <div
      role="tabpanel"
      id={`role-panel-${u.slug}`}
      aria-labelledby={`role-tab-${u.slug}`}
      aria-hidden={!active}
      inert={!active}
      className={`grid grid-cols-1 gap-8 p-5 transition-[opacity,visibility] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10 md:p-8 lg:p-10 motion-reduce:transition-none ${
        active ? "visible opacity-100 duration-[280ms]" : "invisible opacity-0 duration-[180ms]"
      }`}
      style={{ transitionDelay: active ? "60ms, 0ms" : "0ms, 180ms" }}
    >
      {/* Left: who, the pain, the agents */}
      <div className="flex flex-col">
        <div {...r(0)}>
          <p className="text-[1.5rem] tracking-[-0.02em] text-fg md:text-[1.75rem]">{u.title}</p>
          <p className="mt-1 text-[0.9375rem] text-fg-3">{u.line}</p>
        </div>
        <div {...r(40)}>
          <p className="mt-8 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{P.pain}</p>
          <p className="mt-2 max-w-[30ch] text-[1.0625rem] leading-[1.45] text-fg-2 text-pretty md:text-[1.25rem]">{u.pain}</p>
        </div>
        <div {...r(80)}>
          <p className="mt-7 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{P.agents}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {u.agents.map((s) => {
              const a = AGENTS.find((x) => x.slug === s)!;
              const Icon = AGENT_ICONS[a.icon];
              return (
                <li key={s} className="tag">
                  <Icon className="h-3 w-3 text-brand-300" strokeWidth={2} aria-hidden="true" />
                  {agentShortName(a)}
                </li>
              );
            })}
          </ul>
        </div>
        <div className={`mt-auto hidden pt-8 md:block ${r(300).className}`} style={r(300).style}>
          <Link href={`/use-cases/${u.slug}`} className="link-arrow" tabIndex={active ? 0 : -1}>
            {P.link}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Right: a day with Selixa */}
      <div>
        <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{P.day}</p>
        <ol className="relative mt-3 rounded-[18px] border border-line bg-well p-4 md:p-5">
          <span aria-hidden="true" className="absolute bottom-9 left-[calc(1rem+2.75rem+0.75rem+6px)] top-9 w-px bg-ink/[0.1] md:left-[calc(1.25rem+3.25rem+0.75rem+6.5px)]" />
          {u.day.map((m, k) => {
            const s = r(120 + k * 50);
            return (
              <li key={m.time} className={`relative grid min-h-[52px] grid-cols-[2.75rem_12px_1fr] gap-x-3 py-2.5 md:min-h-[64px] md:grid-cols-[3.25rem_14px_1fr] ${s.className}`} style={s.style}>
                <span className="pt-0.5 text-[0.75rem] tabular-nums text-fg-3">{m.time}</span>
                <span className="relative flex justify-center pt-1.5" aria-hidden="true">
                  <span className="h-[7px] w-[7px] rounded-full bg-ink/25" />
                  {k === 0 && (
                    <span
                      className={`absolute top-1.5 h-[7px] w-[7px] rounded-full bg-brand-400 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
                      style={{ transitionDelay: active ? "320ms" : "0ms" }}
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="max-md:sr-only block text-[0.875rem] text-fg">{m.moment}</span>
                  <span className="flex items-start gap-1.5 text-[0.8125rem] text-fg-2 md:mt-1">
                    <span className="mt-[3px] shrink-0">
                      <Orb size={12} />
                    </span>
                    <span className="line-clamp-2">{m.selixa}</span>
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <div className={`mt-6 md:hidden ${r(300).className}`} style={r(300).style}>
          <Link href={`/use-cases/${u.slug}`} className="link-arrow" tabIndex={active ? 0 : -1}>
            {P.link}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
