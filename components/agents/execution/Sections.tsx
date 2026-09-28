"use client";

import { ArrowRight, Check, GitMerge, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/landing/BrandMark";
import { LOGOS } from "@/components/landing/logos";
import { Orb, SectionHeader, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { Initials } from "@/components/site/Initials";
import { EXECUTION_COPY } from "./copy";

const logo = (name: string) => LOGOS.find((l) => l.name === name)!;
const show = (on: boolean) => (on ? "opacity-100" : "opacity-0");

/* ---------- Nudges ---------- */

const NU = EXECUTION_COPY.nudges;
const NUDGE_SCRIPT = [300, 1200, 1200, 1200, 1200, 1200, 3000];
const SLOT = 126;

/** Selixa follows up: notifications stacking, newest on top, three at most. */
export function NudgeStack() {
  const { ref, step, still } = useSequence(NUDGE_SCRIPT);
  // Still frame: the calm ending on top, the blocked one visible below it (5, 4, 1).
  const slotOf = (i: number): number | null => {
    if (still) return i === 4 ? 0 : i === 3 ? 1 : i === 0 ? 2 : null;
    const arrived = Math.min(step, NU.list.length);
    if (i >= arrived) return null;
    const s = arrived - 1 - i;
    return s <= 2 ? s : 3; // 3 = pushed past the stack
  };
  const newest = still ? 4 : Math.min(step, NU.list.length) - 1;

  return (
    <section id="nudges" className="relative py-24 sm:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
        <SectionHeader num="02" label={NU.label} title={NU.headline} />
        <div
          ref={ref}
          data-reveal
          style={d(120)}
          className={`relative h-[400px] w-full overflow-clip rounded-[24px] bg-well p-5 lg:h-[440px] ${!still && step === 0 ? "[&>*]:opacity-0" : ""}`}
        >
          <ul>
            {NU.list.map((n, i) => {
              const slot = slotOf(i);
              const visible = slot !== null && slot <= 2;
              return (
                <li
                  key={n.title}
                  aria-hidden={!visible}
                  className="card absolute inset-x-5 top-5 h-[116px] rounded-[16px]! bg-panel p-4 transition-[transform,opacity] duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: slot === null ? "translate3d(0,-16px,0)" : `translate3d(0,${Math.min(slot, 3) * SLOT}px,0)`,
                    opacity: slot === null || slot > 2 ? 0 : [1, 0.8, 0.6][slot],
                    zIndex: 10 - (slot ?? 5),
                  }}
                >
                  <p className="flex items-center gap-2 text-[0.75rem] text-fg-3">
                    <Orb size={20} />
                    {NU.sender}
                    <span className="ml-auto flex items-center gap-1.5">
                      <BrandMark logo={logo("Slack")} lit={i === newest} className="h-3 w-3" />
                      {n.to}
                    </span>
                  </p>
                  <p className="mt-2.5 flex items-center gap-2 text-[0.875rem] font-medium text-fg">
                    {"blocked" in n && n.blocked && <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />}
                    {n.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[0.84375rem] leading-[1.45] text-fg-2">{n.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Sync (one way: Selixa → tracker) ---------- */

const SY = EXECUTION_COPY.sync;
//                 shown  out  item  done  hold
const SYNC_SCRIPT = [300, 600, 400, 800, 2200];

export function TrackerSync() {
  const { ref, step, still } = useSequence(SYNC_SCRIPT);
  const [auto, setAuto] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  // Advance the tracker each time the loop comes round, until a tab is picked.
  const [prevStep, setPrevStep] = useState(step);
  if (prevStep !== step) {
    setPrevStep(step);
    if (step === 0 && prevStep === SYNC_SCRIPT.length - 1 && picked === null) setAuto((a) => (a + 1) % SY.trackers.length);
  }
  const active = picked ?? auto;
  const tracker = SY.trackers[active];
  const f = still ? SYNC_SCRIPT.length - 1 : step;
  const github = tracker === "GitHub";
  const doneState = f >= 3;

  return (
    <section id="sync" className="relative py-24 sm:py-32">
      <SectionHeader num="03" label={SY.label} title={SY.headline} align="center" className="mx-auto" />
      <div ref={ref} data-reveal style={d(120)} className="mt-10">
        <div role="tablist" aria-label={SY.label} className="flex justify-center gap-2">
          {SY.trackers.map((t, i) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`sync-tab-${i}`}
              aria-selected={i === active}
              aria-controls="sync-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setPicked(i)}
              onKeyDown={(e) => {
                const n = SY.trackers.length;
                const next =
                  e.key === "ArrowRight" ? (active + 1) % n : e.key === "ArrowLeft" ? (active + n - 1) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
                if (next < 0) return;
                e.preventDefault();
                setPicked(next);
                (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
              }}
              className={`flex h-10 items-center gap-2 rounded-full border px-4 text-[0.875rem] transition-colors ${
                i === active ? "border-line-strong bg-ink/[0.05] text-fg" : "border-line text-fg-3 hover:text-fg"
              }`}
            >
              <BrandMark logo={logo(t)} lit={i === active} className="h-[18px] w-[18px]" />
              {t}
            </button>
          ))}
        </div>

        <div
          id="sync-panel"
          role="tabpanel"
          aria-labelledby={`sync-tab-${active}`}
          className="mx-auto mt-10 grid max-w-[820px] grid-cols-1 items-center gap-4 md:grid-cols-[300px_180px_320px] md:justify-center md:gap-0"
        >
          {/* The Selixa task */}
          <div className="card p-4">
            <p className="flex items-center gap-2 text-[0.75rem] text-fg-3">
              <Orb size={18} />
              {SY.selixa}
            </p>
            <p className="mt-2.5 text-[0.875rem] text-fg">
              {SY.task.id} · {SY.task.title}
            </p>
            <p className="mt-3 flex items-center justify-between">
              <Initials name={SY.task.owner} size={20} />
              <span className="tag">{SY.status.open}</span>
            </p>
          </div>

          {/* One way out: tasks go to the tracker */}
          <div aria-hidden="true" className="relative mx-auto h-16 w-px md:h-auto md:w-full md:px-3">
            <p className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.6875rem] text-fg-3 md:static md:mb-2 md:translate-y-0 md:text-center">{SY.out}</p>
            <div className="relative h-full w-px bg-ink/[0.12] md:h-px md:w-full">
              <span
                // Travels out on step 1, then fades where it arrived (opacity only); it goes back to
                // the start invisibly at the loop's reset.
                className={`absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[var(--progress)] shadow-[0_0_10px_rgb(var(--brand-glow-rgb)/0.6)] ${
                  f === 1
                    ? "opacity-100 transition-[transform,opacity] duration-[600ms] [transform:var(--to)]"
                    : f > 1
                      ? "opacity-0 transition-opacity duration-150 [transform:var(--to)]"
                      : "opacity-0 transition-none [transform:none]"
                } left-0 top-0 [--to:translate3d(0,64px,0)] md:[--to:translate3d(156px,0,0)]`}
              />
            </div>
          </div>

          {/* The tracker's item */}
          <div className={`st card relative p-4 ${f >= 2 ? "" : ""}`} data-on={f >= 2}>
            <span aria-hidden="true" className={`card-lit pointer-events-none absolute inset-0 rounded-[14px] border transition-opacity duration-[400ms] ${show(!still && f === 3)}`} />
            <p className="relative flex items-center gap-2 text-[0.75rem] text-fg-3">
              <BrandMark logo={logo(tracker)} lit className="h-4 w-4" />
              {tracker}
            </p>
            <p className="relative mt-2.5 text-[0.875rem] text-fg">
              {github ? `${SY.github.id} · ${SY.task.id} · ${SY.task.title}` : `${SY.task.id} · ${SY.task.title}`}
            </p>
            <p className="relative mt-3 flex justify-end">
              <span className="grid justify-items-end [&>*]:col-start-1 [&>*]:row-start-1">
                <span className={`tag transition-opacity duration-200 ${show(!doneState)}`}>{github ? SY.github.open : SY.status.open}</span>
                <span className={`tag border-brand-400/30 bg-brand-500/10 text-brand-200 transition-opacity duration-200 ${show(doneState)}`}>
                  {github ? <GitMerge className="h-3 w-3" strokeWidth={2} aria-hidden="true" /> : <Check className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />}
                  {github ? SY.github.done : SY.status.done}
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Outcome ---------- */

const OC = EXECUTION_COPY.outcome;
const FROM = 350;
const TO = Math.round(OC.to * 10);

/** Counts tenths from 35.0 to 37.4 once, when `on`. */
function useTenths(on: boolean, still: boolean) {
  const [v, setV] = useState(FROM);
  useEffect(() => {
    if (!on || still) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 600);
      setV(Math.round(FROM + (TO - FROM) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, still]);
  return ((still ? TO : v) / 10).toFixed(1);
}

export function OutcomeClose() {
  const { ref, step, still } = useSequence([200, 2_000_000_000]);
  const on = still || step >= 1;
  const value = useTenths(on, still);
  // Line: flat, a dip at ~40%, back up after Oct 14 (~65%). SVG space 1000 × 150.
  const before = "M0 60 L120 58 L240 62 L330 60 L400 96 L480 104 L560 100 L650 98";
  const after = "M650 98 L740 80 L830 60 L920 50 L1000 44";

  return (
    <section id="outcome" className="relative py-24 sm:py-32">
      <SectionHeader num="04" label={OC.label} title={OC.headline} lead={OC.line} align="center" className="mx-auto" />
      <div ref={ref} data-reveal style={d(120)} className="window mx-auto mt-14 max-w-[880px] p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.8125rem] text-fg-3">{OC.title}</p>
            <p className="mt-2 flex items-center gap-3">
              <span className="text-[1.5rem] tabular-nums text-fg-3">{OC.from}</span>
              <ArrowRight className="h-4 w-4 text-fg-3" strokeWidth={2} aria-hidden="true" />
              <span className="font-display text-[2.5rem] font-light leading-none tabular-nums text-fg sm:text-[3.5rem]">{value}%</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-[0.875rem] text-brand-300">
              <TrendingUp className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {OC.change}
            </p>
            <p className="mt-1 text-[0.75rem] text-fg-3">{OC.sub}</p>
          </div>
        </div>

        <div className="relative mt-8 h-[110px] sm:h-[150px]">
          {/* The work (14 of 14) and the number turning are the same moment: a rule links them */}
          <span
            className={`tag absolute -top-12 -translate-x-1/2 border-brand-400/30 bg-brand-500/10 text-brand-200 transition-[opacity,transform] duration-300 ${on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"}`}
            style={{ left: "65%", transitionDelay: on && !still ? "900ms" : "0ms" }}
          >
            <Check className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
            14 {EXECUTION_COPY.hero.of} 14
          </span>
          <span aria-hidden="true" className="absolute -top-4 bottom-0 w-px bg-brand-400/40" style={{ left: "65%" }} />
          <svg viewBox="0 0 1000 150" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
            <line x1="0" y1="120" x2="1000" y2="120" stroke="rgb(var(--ink-rgb) / 0.14)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
            <path d={before} pathLength={1} className="draw stroke-fg-3" data-on={on} strokeWidth={1.5} vectorEffect="non-scaling-stroke" style={{ transitionDuration: "900ms" }} />
            <path
              d={after}
              stroke="var(--color-brand-400)"
              strokeWidth={1.75}
              vectorEffect="non-scaling-stroke"
              className={`transition-opacity duration-300 ${show(on)}`}
              style={{ transitionDelay: on && !still ? "700ms" : "0ms" }}
            />
          </svg>
          <span
            className={`absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-brand-400 transition-opacity duration-300 ${show(on)}`}
            style={{ left: "65%", top: `${(98 / 150) * 100}%`, transitionDelay: on && !still ? "600ms" : "0ms" }}
          />
          <span
            className={`absolute left-[65%] ml-2 text-[0.6875rem] text-brand-300 transition-opacity duration-300 ${show(on)}`}
            style={{ top: `calc(${(98 / 150) * 100}% + 6px)`, transitionDelay: on && !still ? "600ms" : "0ms" }}
          >
            {OC.marker}
          </span>
          <span
            className={`absolute right-0 -mr-1 -mt-1 h-2 w-2 rounded-full bg-brand-400 transition-opacity duration-300 ${show(on)}`}
            style={{ top: `${(44 / 150) * 100}%`, transitionDelay: on && !still ? "900ms" : "0ms" }}
          />
        </div>

        <Link href="/product/analytics" className="link-arrow mt-8 text-[0.875rem]">
          {OC.link}
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
