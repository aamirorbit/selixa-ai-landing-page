"use client";

import { ArrowRight, AtSign, ChevronDown, FileText, Hash, Plus, Search, SendHorizontal, Smile, TrendingDown, Users } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { LOGOS } from "./logos";
import { Count, Stage, Typed } from "./demo";
import { Avatar, Orb, Section, SectionHeader, WindowBar, d } from "./ui";
import { useScrollSequence } from "./useScrollSequence";

const QUESTION = "What should we build next?";
const SLACK = LOGOS.find((l) => l.name === "Slack")!;

// A Slack-like channel list for the sample workspace; #product is open.
const CHANNELS = [
  { name: "general" },
  { name: "product", active: true },
  { name: "standup" },
  { name: "feedback", unread: true },
  { name: "releases" },
];
const REACTIONS = [
  { emoji: "👍", count: 4, mine: true },
  { emoji: "🎯", count: 2 },
  { emoji: "👀", count: 1 },
];

const WHY = [
  { value: 4, label: "customer conversations" },
  { value: 8, suffix: "%", label: "drop in activation", down: true },
  { value: 7, label: "related feedback points" },
  { value: 3, label: "competitor examples" },
];

const PLAN = [
  { title: "Opportunity", body: "New workspaces stall at the integrations step. 38% never finish setup." },
  { title: "Recommendation", body: "Ship a shorter first-run flow and ask for integrations after the first project." },
  { title: "Impact", body: "Recovers most of the activation drop within two release cycles." },
  { title: "Next steps", body: "Draft the requirement, size it with engineering, review on Thursday." },
];

// reset, type, send + think, answer, each "why", each plan cell, hold on the action
const SCRIPT = [350, 1100, 800, 800, ...WHY.map(() => 250), ...PLAN.map(() => 280), 3500];
const TYPE = 1;
const SENT = 2;
const ANSWER = 3;
const WHY_AT = 4;
const PLAN_AT = WHY_AT + WHY.length;
const ACT = PLAN_AT + PLAN.length;

export function Decide() {
  const { ref, step, still } = useScrollSequence(SCRIPT);

  return (
    <Section id="decide">
      <SectionHeader
        num="05"
        label="Cursor for product managers"
        align="center"
        className="mx-auto"
        title={
          <>
            Don&rsquo;t just ask. <span className="text-brand-gradient">Work.</span>
          </>
        }
      />

      {/* The question is asked where the team already talks: a Slack channel. */}
      <div ref={ref} data-reveal style={d(120)} className="window mx-auto mt-14 max-w-[68rem] lg:mt-16">
        <WindowBar>
          <span className="flex items-center gap-2 text-fg-2">
            <BrandMark logo={SLACK} lit className="h-3.5 w-3.5" />
            Atlas
          </span>
          <span className="mx-auto hidden w-[min(22rem,40%)] items-center gap-2 rounded-[8px] border border-line bg-well px-3 py-1 text-[0.75rem] text-fg-3 sm:flex">
            <Search className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            Search Atlas
          </span>
        </WindowBar>

        <div className="grid grid-cols-1 md:grid-cols-[13.5rem_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="hidden border-r border-line bg-ink/[0.025] px-2.5 py-4 md:block" aria-hidden="true">
            <p className="px-2.5 text-[0.9375rem] text-fg">Atlas</p>
            <p className="mt-5 flex items-center gap-1.5 px-2.5 text-[0.75rem] text-fg-3">
              <ChevronDown className="h-3 w-3" strokeWidth={2} />
              Channels
            </p>
            <ul className="mt-1.5 flex flex-col gap-px text-[0.875rem]">
              {CHANNELS.map((c) => (
                <li
                  key={c.name}
                  className={`flex items-center gap-2 rounded-[6px] px-2.5 py-1 ${
                    c.active ? "bg-brand-500/15 text-fg" : c.unread ? "text-fg" : "text-fg-3"
                  }`}
                >
                  <Hash className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  <span className={c.unread ? "font-medium" : ""}>{c.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-center gap-1.5 px-2.5 text-[0.75rem] text-fg-3">
              <ChevronDown className="h-3 w-3" strokeWidth={2} />
              Direct messages
            </p>
            <ul className="mt-1.5 flex flex-col gap-px text-[0.875rem] text-fg-3">
              {["Maya Chen", "Dev Patel"].map((n) => (
                <li key={n} className="flex items-center gap-2 rounded-[6px] px-2.5 py-1">
                  <Avatar name={n} className="h-5 w-5 rounded-[5px]! text-[0.5625rem]" />
                  {n}
                </li>
              ))}
              <li className="flex items-center gap-2 rounded-[6px] px-2.5 py-1">
                <Orb size={20} />
                Selixa
                <span className="rounded-[3px] bg-ink/[0.08] px-1 text-[0.5625rem] tracking-[0.06em] text-fg-3">APP</span>
              </li>
            </ul>
          </aside>

          {/* Channel */}
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-3 border-b border-line px-5 py-3">
              <span className="flex items-center gap-1 text-[0.9375rem] text-fg">
                <Hash className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                product
              </span>
              <span className="hidden truncate text-[0.8125rem] text-fg-3 sm:inline">Priorities, roadmap and launches</span>
              <span className="ml-auto flex items-center gap-1.5 text-[0.75rem] text-fg-3">
                <Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                12
              </span>
            </div>

            <div className="flex min-h-[31rem] flex-col gap-5 px-5 py-5">
              {/* Sara asks */}
              <Stage on={still || step >= TYPE} className="flex gap-3">
                <Avatar name="Sara Kim" className="h-9 w-9 rounded-[8px]! text-[0.75rem]" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline gap-2">
                    <span className="text-[0.9375rem] text-fg">Sara Kim</span>
                    <span className="text-[0.75rem] text-fg-3">9:41 AM</span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-baseline gap-1 text-[0.9375rem] leading-[1.5] text-fg-2">
                    <span className="rounded-[4px] bg-brand-500/15 px-1 text-brand-300">@Selixa</span>
                    <span className="min-w-0 flex-1">
                      <Typed text={QUESTION.toLowerCase()} on={step >= TYPE} still={still} cps={40} />
                    </span>
                  </p>
                </div>
              </Stage>

              {/* Selixa answers */}
              <Stage on={step >= SENT} className="flex gap-3">
                <Orb size={36} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline gap-2">
                    <span className="text-[0.9375rem] text-fg">Selixa</span>
                    <span className="rounded-[3px] bg-ink/[0.08] px-1 text-[0.625rem] tracking-[0.06em] text-fg-3">APP</span>
                    <span className="text-[0.75rem] text-fg-3">9:41 AM</span>
                  </p>
                  {!still && step === SENT ? (
                    <span className="thinking mt-2.5" aria-label="Thinking">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <p className="mt-0.5 text-[1.0625rem] leading-[1.5] text-fg">
                      <Typed text="I’d prioritize onboarding. Here’s why:" on={step >= ANSWER} still={still} cps={45} />
                    </p>
                  )}

                  {/* Why, as an attachment with the side bar */}
                  <div className={`mt-3 border-l-[3px] border-brand-400/70 pl-4 transition-opacity duration-500 ${step >= WHY_AT ? "opacity-100" : "opacity-0"}`}>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
                      {WHY.map((w, i) => (
                        <Stage as="li" key={w.label} on={step >= WHY_AT + i}>
                          <span className="flex items-center gap-1.5 font-display text-[1.5rem] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
                            {w.down && <TrendingDown className="h-4 w-4 text-brand-400" strokeWidth={1.75} aria-label="down" />}
                            <Count to={w.value} on={step >= WHY_AT + i} still={still} ms={600} />
                            {w.suffix}
                          </span>
                          <span className="mt-1.5 block text-[0.8125rem] leading-snug text-fg-3">{w.label}</span>
                        </Stage>
                      ))}
                    </ul>
                  </div>

                  {/* The plan, same attachment style */}
                  <div className={`mt-4 border-l-[3px] border-line-strong pl-4 transition-opacity duration-500 ${step >= PLAN_AT ? "opacity-100" : "opacity-0"}`}>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                      {PLAN.map((p, i) => (
                        <Stage key={p.title} on={step >= PLAN_AT + i}>
                          <dt className="text-[0.8125rem] text-brand-300">{p.title}</dt>
                          <dd className="mt-0.5 text-[0.875rem] leading-[1.5] text-fg-2">{p.body}</dd>
                        </Stage>
                      ))}
                    </dl>
                  </div>

                  {/* Buttons, then the team's reactions */}
                  <Stage on={step >= ACT} className="mt-4 flex flex-wrap items-center gap-2">
                    <a
                      href="#execution"
                      className={`inline-flex items-center gap-1.5 rounded-[6px] bg-[linear-gradient(180deg,var(--brand-cta),var(--brand-cta-2))] px-3.5 py-1.5 text-[0.8125rem] font-medium text-[var(--brand-on)] ${
                        !still && step >= ACT ? "ring-4 ring-brand-500/20" : ""
                      }`}
                    >
                      Create roadmap item
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
                    </a>
                    <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-line-strong px-3.5 py-1.5 text-[0.8125rem] text-fg-2">
                      <FileText className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      Draft PRD
                    </span>
                  </Stage>
                  <Stage on={step >= ACT} className="mt-3 flex flex-wrap items-center gap-1.5">
                    {REACTIONS.map((r) => (
                      <span
                        key={r.emoji}
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.75rem] ${
                          r.mine ? "border-brand-400/50 bg-brand-500/10 text-fg" : "border-line text-fg-2"
                        }`}
                      >
                        <span aria-hidden="true">{r.emoji}</span>
                        <span className="tabular-nums">{r.count}</span>
                      </span>
                    ))}
                    <span className="ml-2 flex items-center gap-1.5 text-[0.75rem] text-brand-300">
                      <span className="flex -space-x-1">
                        <Avatar name="Maya Chen" className="h-4 w-4 rounded-[4px]! text-[0.4375rem]" />
                        <Avatar name="Dev Patel" className="h-4 w-4 rounded-[4px]! text-[0.4375rem]" />
                      </span>
                      2 replies
                    </span>
                  </Stage>
                </div>
              </Stage>
            </div>

            {/* Composer */}
            <div className="mx-5 mb-5 mt-auto rounded-[10px] border border-line-strong">
              <p className="px-3.5 pt-3 text-[0.875rem] text-fg-3">Message #product</p>
              <div className="flex items-center gap-3 px-3 pb-2 pt-3 text-fg-3" aria-hidden="true">
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                <Smile className="h-4 w-4" strokeWidth={1.75} />
                <AtSign className="h-4 w-4" strokeWidth={1.75} />
                <span className="ml-auto grid h-7 w-7 place-items-center rounded-[6px] bg-ink/[0.06]">
                  <SendHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
