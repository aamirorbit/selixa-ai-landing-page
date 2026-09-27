"use client";

import { RelatedCards } from "@/components/site/RelatedCards";
import { iconForUseCase } from "@/components/site/useCaseIcons";
import { USE_CASE_GROUPS, USE_CASES } from "@/lib/content/use-cases";

/** Every role, in three labelled groups of compact cards (rows on phones). */
export function UseCaseGroups({ cardLink }: { cardLink: string }) {
  return (
    <div className="mt-14">
      {USE_CASE_GROUPS.map((g) => {
        const list = USE_CASES.filter((u) => u.group === g);
        return (
          <div key={g} className="grid grid-cols-1 items-start gap-4 border-t border-line py-8 lg:grid-cols-[13rem_1fr] lg:gap-8">
            <p data-reveal className="flex items-baseline gap-2 text-[0.8125rem] uppercase tracking-[0.14em] text-fg-3">
              {g}
              <span className="tabular-nums text-fg-3/70">{list.length}</span>
            </p>
            <RelatedCards
              columns={2}
              className="lg:[&_ul]:grid-cols-4"
              items={list.map((u) => ({ href: `/use-cases/${u.slug}`, title: u.title, body: u.line, icon: iconForUseCase(u.slug), linkText: cardLink }))}
            />
          </div>
        );
      })}
    </div>
  );
}
