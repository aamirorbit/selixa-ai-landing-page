import { Crosshair, Radar, ScanSearch, SquareDashed, TrendingUp, UsersRound, type LucideIcon } from "lucide-react";
import { Section, SectionHeader, d } from "@/components/landing/ui";
import { SIGNAL_COPY } from "./copy";

const C = SIGNAL_COPY.capabilities;

// A small, true-to-the-demo reading in each card's corner, so the grid shows data, not adjectives.
const FEATURES: { title: string; icon: LucideIcon; reading: string }[] = [
  {
    title: "Search intelligence",
    icon: ScanSearch,
    reading: "246K monthly searches",
  },
  { title: "Trend detection", icon: TrendingUp, reading: "+84% in 90 days" },
  {
    title: "Audience insights",
    icon: UsersRound,
    reading: "Top question: free options?",
  },
  {
    title: "Competitor intelligence",
    icon: Crosshair,
    reading: "2 launches this month",
  },
  {
    title: "Market gaps",
    icon: SquareDashed,
    reading: "3 needs underserved",
  },
  {
    title: "Opportunity detection",
    icon: Radar,
    reading: "14 signals, 1 opportunity",
  },
];

export function Capabilities() {
  return (
    <Section id="capabilities">
      <SectionHeader num="02" label={C.label} title={C.headline} />
      <ul className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ title, icon: Icon, reading }, i) => (
          <li key={title} data-reveal style={d(i * 60)} className="flex">
            <div className="card signal-card group flex w-full flex-col p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-line bg-ink/[0.03] text-brand-300 transition-colors duration-300 group-hover:border-brand-400/40">
                  <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="pt-2 text-right text-[0.75rem] tabular-nums text-fg-3 transition-colors duration-300 group-hover:text-brand-300">
                  {reading}
                </span>
              </div>
              <h3 className="mt-8 text-[1.1875rem] font-medium leading-[1.3] tracking-[-0.015em] text-fg">{title}</h3>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
