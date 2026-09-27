"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/landing/ui";
import { AGENT_ICONS, agentHref, agentShortName } from "@/components/site/agents";
import { RelatedCards, type RelatedItem } from "@/components/site/RelatedCards";
import { AGENTS } from "@/lib/content/agents";
import { HUB_COPY } from "./copy";

const C = HUB_COPY.index;

const ITEMS: RelatedItem[] = AGENTS.map((a) => ({
  href: agentHref(a.slug),
  title: a.name,
  body: a.line,
  icon: AGENT_ICONS[a.icon],
  corner: a.status,
  meta: { label: C.producesLabel, value: a.produces },
  linkText: C.linkText,
}));

/** The relay line in miniature: hovering or focusing a card lights its station (≥ lg). */
function RelayStrip({ active }: { active: number | null }) {
  return (
    <div data-reveal aria-hidden="true" className="relative mx-auto mt-10 hidden max-w-[720px] lg:block">
      <div className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[3.5px] h-px bg-ink/[0.1]" />
      <ol className="relative grid grid-cols-6">
        {AGENTS.map((agent, i) => {
          const on = active === i;
          return (
            <li key={agent.slug} className="flex flex-col items-center gap-3">
              <span
                className={`relative h-2 w-2 rounded-full bg-ink/30 transition-transform duration-200 ${on ? "scale-[1.6]" : ""}`}
              >
                <span className={`absolute inset-0 rounded-full bg-brand-400 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} />
              </span>
              <span className={`text-[0.75rem] transition-colors duration-200 ${on ? "text-fg" : "text-fg-3"}`}>{agentShortName(agent)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function TeamIndex() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="team" className="relative py-24 sm:py-32">
      <SectionHeader num="02" label={C.label} title={C.headline} />
      <RelayStrip active={active} />
      <RelatedCards items={ITEMS} variant="large" onActive={setActive} className="mt-12" />
    </section>
  );
}
