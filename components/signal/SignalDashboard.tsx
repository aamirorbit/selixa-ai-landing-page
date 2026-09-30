"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Crosshair,
  Globe,
  ListChecks,
  Map as MapIcon,
  Radar,
  Search,
  Telescope,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Count, Stage, Typed } from "@/components/landing/demo";
import { Orb, Section, SectionHeader, WindowBar } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { ChartLine } from "@/components/site/ChartLine";
import { Sparkline } from "@/components/site/Sparkline";
import { SIGNAL_COPY } from "./copy";

const C = SIGNAL_COPY.dashboard;
const QUERY = "couples games";

// Monthly searches (K), every two weeks for a year: 178K → 246K (+38%), accelerating from May.
const TREND = [178, 181, 176, 183, 186, 182, 188, 191, 187, 193, 196, 194, 199, 204, 201, 209, 214, 212, 221, 226, 231, 236, 241, 246];
const ACCEL = 15;

const RELATED = [
  { topic: "Long distance couples games", volume: "40.5K", share: 1, growth: "+84%" },
  { topic: "Couple games online", volume: "33.1K", share: 0.82, growth: "+42%" },
  { topic: "Romantic couple games", volume: "18.1K", share: 0.45, growth: "+36%" },
  { topic: "Adult couple games", volume: "27.1K", share: 0.67, growth: "+12%" },
];

const EMERGING = [
  { topic: "Long-distance couples games", growth: 84, from: "Search · Reddit · TikTok", data: [10, 11, 10, 12, 13, 15, 17, 21, 26, 31] },
  { topic: "Couples games online", growth: 42, from: "Search · YouTube", data: [20, 21, 21, 22, 23, 23, 25, 26, 27, 28] },
  { topic: "Romantic couple games", growth: 36, from: "Search · Pinterest", data: [14, 14, 15, 15, 15, 16, 17, 17, 18, 19] },
];

const NAV: { group: string; items: { label: string; icon: LucideIcon; active?: boolean; badge?: string }[] }[] = [
  {
    group: "Signal",
    items: [
      { label: "Explore", icon: Search, active: true },
      { label: "Trends", icon: TrendingUp },
      { label: "Audience", icon: UsersRound },
      { label: "Competitors", icon: Crosshair },
      { label: "Opportunities", icon: Radar, badge: "3" },
    ],
  },
  {
    group: "Selixa",
    items: [
      { label: "Research", icon: Telescope },
      { label: "Priorities", icon: Compass },
      { label: "Roadmap", icon: MapIcon },
      { label: "Tasks", icon: ListChecks },
    ],
  },
];

// reset, type the query, numbers count, the trend draws, related topics, emerging signals one by one, Selixa's read, hold
const SCRIPT = [400, 1500, 1000, 1500, 700, ...EMERGING.map(() => 380), 700, 5600];
const TYPED = 1;
const NUMBERS = 2;
const CHART = 3;
const RELATED_AT = 4;
const EMERGE = 5;
const READ = EMERGE + EMERGING.length;

function Metric({ label, children, note, lit }: { label: string; children: ReactNode; note: string; lit?: boolean }) {
  return (
    <div className={`card flex flex-col gap-3 p-4 ${lit ? "card-lit" : ""}`}>
      <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{label}</span>
      <span className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
        {children}
      </span>
      <span className={`text-[0.75rem] ${lit ? "text-brand-300" : "text-fg-3"}`}>{note}</span>
    </div>
  );
}

export function SignalDashboard() {
  const { ref, step, still } = useSequence(SCRIPT);
  const counting = step >= NUMBERS;

  return (
    <Section id="dashboard">
      <SectionHeader num="02" label={C.label} title={C.headline} align="center" className="mx-auto" />

      <div className="relative mt-16">
        {/* Soft glow behind the product */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] top-[8%] h-[70%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--brand-glow-rgb)/0.16),transparent)] blur-2xl" />

        {/* One hand-drawn note, pointing at the fastest riser */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-14 right-[2%] hidden items-end gap-1 xl:flex">
          <span className="mb-7 max-w-[11rem] rotate-[-4deg] text-right text-[0.875rem] italic leading-snug text-fg-3">
            the question behind the query is changing
          </span>
          <svg viewBox="0 0 80 70" className="h-[4.5rem] w-20 text-brand-400" fill="none">
            <path
              d="M6 8 C 38 2, 66 18, 58 58"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength={1}
              className="draw"
              data-on={still || step >= EMERGE}
            />
            <path d="M50 50 L58 60 L64 49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div ref={ref} data-reveal className="window relative">
          <WindowBar>
            <span className="flex items-center gap-2 text-fg-2">
              <Radar className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.75} aria-hidden="true" />
              Selixa · Signal
            </span>
            <span className="ml-auto rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-fg-3">Sample data</span>
          </WindowBar>

          <div className="grid grid-cols-1 lg:grid-cols-[12.5rem_minmax(0,1fr)]">
            {/* Sidebar */}
            <aside className="hidden border-r border-line p-3 lg:block" aria-hidden="true">
              {NAV.map((g) => (
                <div key={g.group} className="mb-5">
                  <p className="px-2.5 pb-2 pt-1 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{g.group}</p>
                  <ul className="flex flex-col gap-0.5">
                    {g.items.map(({ label, icon: Icon, active, badge }) => (
                      <li
                        key={label}
                        className={`flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[0.8125rem] ${
                          active ? "bg-ink/[0.06] text-fg" : "text-fg-3"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${active ? "text-brand-300" : ""}`} strokeWidth={1.75} />
                        {label}
                        {badge && (
                          <span className="ml-auto rounded-full bg-brand-500/15 px-1.5 text-[0.6875rem] tabular-nums text-brand-300">{badge}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>

            <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-6">
              {/* The question */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 flex-1 basis-full items-center gap-3 rounded-[12px] border border-line bg-well px-4 py-3 sm:basis-auto">
                  <Search className="h-4 w-4 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
                  <span className="min-w-0 flex-1 text-[1rem] text-fg">
                    <Typed text={QUERY} on={step >= TYPED} still={still} cps={16} />
                  </span>
                </div>
                <span className="tag">
                  <Globe className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                  Worldwide
                </span>
                <span className="tag">Last 12 months</span>
              </div>

              {/* The numbers */}
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Metric label="Search volume" note="Monthly, all sources">
                  <Count to={246} on={counting} still={still} />K
                </Metric>
                <Metric label="Traffic potential" note="Reachable demand">
                  <Count to={198} on={counting} still={still} />K
                </Metric>
                <Metric label="Growth" note="↑ Year on year" lit>
                  +<Count to={38} on={counting} still={still} />%
                </Metric>
                <Metric label="Commercial intent" note="People ready to pay">
                  <span className="flex items-center gap-3">
                    High
                    <span className="flex items-end gap-[3px]" aria-hidden="true">
                      {[0.4, 0.6, 0.8, 1].map((h, i) => (
                        <i
                          key={h}
                          className={`block w-[5px] rounded-full transition-opacity duration-500 ${i < 3 ? "bg-brand-400" : "bg-ink/20"} ${counting || still ? "opacity-100" : "opacity-0"}`}
                          style={{ height: `${h * 1.25}rem`, transitionDelay: `${i * 90}ms` }}
                        />
                      ))}
                    </span>
                  </span>
                </Metric>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                {/* Left: trend and related topics */}
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="card p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <p className="text-[0.875rem] text-fg">Search trend</p>
                      <span className="ml-auto flex items-center gap-1.5 text-[0.75rem] text-fg-3">
                        <i className="block h-[2px] w-3 rounded-full bg-fg-3" aria-hidden="true" />
                        Steady
                      </span>
                      <span className="flex items-center gap-1.5 text-[0.75rem] text-fg-3">
                        <i className="block h-[2px] w-3 rounded-full bg-brand-400" aria-hidden="true" />
                        Accelerating
                      </span>
                    </div>
                    <ChartLine
                      className="mt-4"
                      data={TREND}
                      yDomain={[165, 255]}
                      yTicks={[
                        { value: 180, label: "180K" },
                        { value: 210, label: "210K" },
                        { value: 240, label: "240K" },
                      ]}
                      xTicks={[
                        { index: 0, label: "Oct" },
                        { index: 8, label: "Feb" },
                        { index: 16, label: "Jun" },
                        { index: TREND.length - 1, label: "Sep" },
                      ]}
                      height="clamp(11rem, 22vw, 15rem)"
                      highlightFrom={ACCEL}
                      area="highlight"
                      markers={[{ index: ACCEL, label: "Demand accelerates", labelAt: "top", tone: "brand" }]}
                      reveal="wipe"
                      on={step >= CHART}
                      still={still}
                      insets={{ left: 40, right: 8 }}
                      labelSize={11}
                      ariaLabel="Monthly searches for couples games rose from 178K to 246K over twelve months, accelerating from May."
                    />
                  </div>

                  <div className="card p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[0.875rem] text-fg">Related topics</p>
                      <span className="text-[0.75rem] text-fg-3">Volume · growth</span>
                    </div>
                    <ul className="mt-3 flex flex-col">
                      {RELATED.map((r, i) => (
                        <li key={r.topic} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-4 border-t border-line py-2.5 first:border-t-0">
                          <span className="min-w-0">
                            <span className="block truncate text-[0.875rem] text-fg-2">{r.topic}</span>
                            <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-ink/[0.06]">
                              <span
                                className="block h-full origin-left rounded-full bg-fg-3 transition-transform duration-700 ease-[var(--ease-out-expo)]"
                                style={{
                                  transform: `scaleX(${still || step >= RELATED_AT ? r.share : 0})`,
                                  transitionDelay: `${i * 80}ms`,
                                  background: i === 0 ? "var(--color-brand-400)" : undefined,
                                }}
                              />
                            </span>
                          </span>
                          <span className="text-[0.8125rem] tabular-nums text-fg-3">{r.volume}</span>
                          <span className={`w-11 text-right text-[0.8125rem] tabular-nums ${i === 0 ? "text-brand-300" : "text-fg-2"}`}>{r.growth}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: emerging signals and Selixa's read */}
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="card p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                      <span className="live-dot" aria-hidden="true" />
                      <p className="text-[0.875rem] text-fg">Emerging signals</p>
                      <span className="ml-auto text-[0.75rem] text-fg-3">90 days</span>
                    </div>
                    <ul className="mt-3 flex flex-col gap-2">
                      {EMERGING.map((e, i) => (
                        <Stage
                          as="li"
                          key={e.topic}
                          on={step >= EMERGE + i}
                          className={`flex items-center gap-3 rounded-[12px] border border-line bg-ink/[0.015] p-3 ${!still && step === EMERGE + i ? "is-live" : ""}`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-[0.875rem] leading-snug text-fg">&ldquo;{e.topic}&rdquo;</span>
                            <span className="mt-0.5 block truncate text-[0.6875rem] text-fg-3">{e.from}</span>
                          </span>
                          <Sparkline data={e.data} width={56} height={22} highlightFrom={i === 0 ? 5 : undefined} tone="default" />
                          <span className={`flex w-14 items-center justify-end gap-0.5 text-[0.9375rem] tabular-nums ${i === 0 ? "text-brand-300" : "text-fg"}`}>
                            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />+{e.growth}%
                          </span>
                        </Stage>
                      ))}
                    </ul>
                  </div>

                  <Stage on={step >= READ} className={`card card-lit flex flex-1 flex-col p-4 sm:p-5 ${!still && step === READ ? "is-live" : ""}`}>
                    <div className="flex items-center gap-2.5">
                      <Orb size={28} />
                      <p className="text-[0.75rem] uppercase tracking-[0.14em] text-brand-300">Selixa&rsquo;s read</p>
                    </div>
                    <p className="mt-3 text-[0.9375rem] leading-[1.55] text-fg">
                      Demand is shifting toward long-distance play.
                    </p>
                    <a href="#opportunity" className="link-arrow mt-auto pt-4 text-[0.875rem]">
                      Explore opportunity
                      <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    </a>
                  </Stage>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">
        Example: for “couples games”, 246K monthly searches, 198K traffic potential, 38% growth, high commercial intent.
      </p>
    </Section>
  );
}
