"use client";

import { Check } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Count } from "@/components/landing/demo";
import { AGENT_ICONS, agentShortName } from "@/components/site/agents";
import { Sparkline } from "@/components/site/Sparkline";
import { StickyScene, seg, smoothstep, useMeasure, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { AGENTS, type Agent } from "@/lib/content/agents";
import { HUB_COPY } from "./copy";

/*
 * The relay: one work card travels the six agents as the page scrolls (spec §3.2).
 * Scrub position, step content: the card, notch, token and rail fills follow progress
 * directly (transform writes, no React state); rows, chips and station states change on
 * beats, with short CSS transitions.
 */

const C = HUB_COPY.relay;
const LAST = AGENTS.length - 1;

// Working / landed for each station (0.15 windows from 0.04), then Shipped at 0.94.
const BEATS = [0.04, 0.08, 0.21, 0.25, 0.36, 0.4, 0.51, 0.55, 0.66, 0.7, 0.81, 0.85, 0.94];
const SHIPPED = BEATS.length;
// Start of each 0.05-long move to the next station.
const TRAVEL = [0.19, 0.34, 0.49, 0.64, 0.79];

/** Continuous station position, 0 … 5. */
const stationAt = (p: number) => TRAVEL.reduce((s, t) => s + smoothstep(seg(p, t, t + 0.05)), 0);

type Station = "idle" | "working" | "done";
const stationState = (b: number, i: number): Station => (b >= 2 * i + 2 ? "done" : b === 2 * i + 1 ? "working" : "idle");

/** Chip index after each beat: New, In review, Prioritized, Now, In progress, Shipped. */
const chipAt = (b: number) => (b >= 13 ? 5 : b >= 12 ? 4 : b >= 10 ? 3 : b >= 8 ? 2 : b >= 2 ? 1 : 0);

/** "Decision: ship the shorter onboarding flow" → "ship the shorter onboarding flow" (the tag says it). */
const rowText = (a: Agent) => a.handoff.replace(/^[A-Z][a-z]+:\s*/, "");

const r2 = (n: number) => Math.round(n * 100) / 100;
/** Activation, flat then the dip (the Analyst row's mini chart). */
const ACTIVATION_DIP = [38.1, 37.9, 38.3, 38.0, 38.2, 38.0, 38.0, 36.4, 35.3, 35.1, 34.9, 35.0];
const show = (on: boolean) => (on ? "opacity-100" : "opacity-0");

/* ---------- Pieces shared by both layouts ---------- */

/** Station icon tile; the brand fill is a pre-rendered overlay, so only opacity changes. */
function StationTile({ agent, state, className }: { agent: Agent; state: Station; className: string }) {
  const Icon = AGENT_ICONS[agent.icon];
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden border border-line bg-panel text-brand-300 ${className}`}>
      <span className="absolute inset-0 bg-ink/[0.03]" />
      <Icon className="relative h-[42%] w-[42%]" strokeWidth={1.6} />
      <span
        className="absolute inset-0 grid place-items-center bg-brand-500 text-white transition-opacity duration-[400ms]"
        style={{ opacity: state === "working" ? 1 : state === "done" ? 0.9 : 0 }}
      >
        <Icon className="h-[42%] w-[42%]" strokeWidth={1.6} />
      </span>
    </span>
  );
}

/** Stack of layers in one grid cell: the cell is as big as the biggest, so nothing reflows. */
function Stack({ className = "", children }: { className?: string; children: ReactNode }) {
  return <span className={`grid [&>*]:col-start-1 [&>*]:row-start-1 ${className}`}>{children}</span>;
}

function StateChip({ b }: { b: number }) {
  const current = chipAt(b);
  return (
    <Stack className="justify-items-end">
      {C.states.map((label, i) => (
        <span
          key={label}
          className={`tag transition-opacity duration-200 ${i >= 2 ? "border-brand-400/30 bg-brand-500/10 text-brand-200" : ""} ${show(i === current)}`}
        >
          {i === C.states.length - 1 && <Check className="h-3 w-3" strokeWidth={2} />}
          {label}
        </span>
      ))}
    </Stack>
  );
}

function Roadmap({ on }: { on: boolean }) {
  return (
    <span className="relative flex h-4 items-center rounded-full border border-line text-[0.5625rem] leading-none text-fg-3">
      {["L", "N", "Now"].map((cell, i) => (
        <span key={cell} className={`grid h-full place-items-center ${i === 2 ? "w-[26px]" : "w-[22px]"} ${i > 0 ? "border-l border-line" : ""} ${i === 2 && on ? "text-fg" : ""}`}>
          {cell}
        </span>
      ))}
      {/* The item moves from Later to Now */}
      <span
        className="absolute -top-[3px] left-[8px] h-1.5 w-1.5 rounded-full bg-brand-400 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: on ? "translateX(46px)" : "none", transitionDelay: on ? "200ms" : "0ms" }}
      />
    </span>
  );
}

function Tasks({ shipped, still, phone }: { shipped: boolean; still: boolean; phone?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      {/* Phones drop the owners: the row's tag line is too narrow for both */}
      <span className={phone ? "hidden" : "flex"}>
        {C.owners.map((name, i) => (
          <span
            key={name}
            className={`grid h-5 w-5 place-items-center rounded-full border border-line-strong bg-panel text-[0.5rem] text-fg-2 ${i ? "-ml-1.5" : ""}`}
          >
            {name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
        ))}
      </span>
      <span className="text-[0.75rem] tabular-nums text-fg-2">
        <span className="inline-block w-[2ch] text-right">{still ? C.tasksTotal : <Count to={C.tasksTotal} on={shipped} ms={500} />}</span> of{" "}
        {C.tasksTotal} {C.tasksDone}
      </span>
    </span>
  );
}

function Mini({ i, landed, shipped, still, phone }: { i: number; landed: boolean; shipped: boolean; still: boolean; phone?: boolean }) {
  let visual: ReactNode = null;
  if (i === 1)
    visual = (
      <span className="flex">
        {["bg-ink/[0.14]", "bg-ink/[0.09]", "bg-ink/[0.2]"].map((shade, k) => (
          <span key={shade} className={`grid h-4 w-4 place-items-center rounded-[5px] border border-line text-[0.5625rem] text-fg-2 ${shade} ${k ? "-ml-1" : ""}`}>
            {"ABC"[k]}
          </span>
        ))}
      </span>
    );
  if (i === 2) visual = <Sparkline data={ACTIVATION_DIP} width={56} height={16} highlightFrom={6} />;
  if (i === 4) visual = <Roadmap on={landed} />;
  if (i === 5) visual = <Tasks shipped={shipped} still={still} phone={phone} />;
  if (!visual) return null;
  return (
    <span
      className={`flex shrink-0 items-center transition-[opacity,transform] duration-300 ${landed ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
      style={{ transitionDelay: landed ? "80ms" : "0ms" }}
    >
      {visual}
    </span>
  );
}

/** One row of the card: tag line (+ mini visual), then the hand-off, the "working" dots, or an empty bar. */
function Row({ agent, i, state, shipped, still, phone }: { agent: Agent; i: number; state: Station; shipped: boolean; still: boolean; phone?: boolean }) {
  const landed = state === "done";
  // Phones prefix the agent; once only where they're the same word ("Roadmap").
  const short = agentShortName(agent);
  const tag = phone && short !== C.tags[i] ? `${short} · ${C.tags[i]}` : C.tags[i];
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col justify-center ${
        phone ? "h-[52px] pr-4" : "h-12 px-5 [@media(max-height:760px)]:h-11"
      }`}
    >
      <div className="flex h-4 items-center justify-between gap-3">
        <span
          className={`truncate text-[0.6875rem] uppercase tracking-[0.12em] transition-colors duration-300 ${landed ? "text-fg-3" : "text-fg-3/60"}`}
        >
          {tag}
        </span>
        <Mini i={i} landed={landed} shipped={shipped} still={still} phone={phone} />
      </div>
      <Stack className="mt-1 h-[18px] items-center">
        <span className={`h-1.5 w-3/5 rounded-full bg-ink/[0.06] transition-opacity duration-200 ${show(state === "idle")}`} />
        <span className={`thinking transition-opacity duration-200 ${show(state === "working")}`}>
          <i />
          <i />
          <i />
        </span>
        <span
          className={`truncate text-[0.84375rem] text-fg transition-[opacity,transform] duration-[320ms] ${
            landed ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
          }`}
        >
          {rowText(agent)}
        </span>
      </Stack>
    </div>
  );
}

/** The work card's frame: header, chip, lit layer. Height is fixed from the start (all rows present). */
function WorkCard({ b, children }: { b: number; children: ReactNode }) {
  return (
    <div className="window">
      {/* Lit from the Product Agent's recommendation on */}
      <span className={`card-lit pointer-events-none absolute inset-0 rounded-[18px] border transition-opacity duration-[400ms] ${show(b >= 8)}`} />
      <div className="relative flex h-[76px] flex-col justify-center gap-1.5 px-5 [@media(max-height:760px)]:h-[68px]">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[0.75rem] text-fg-3">
            <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-brand-500 text-[0.6875rem] text-white">A</span>
            {C.cardLabel}
          </span>
          <StateChip b={b} />
        </div>
        <p className="truncate text-[1.0625rem] tracking-[-0.015em] text-fg">{C.cardTitle}</p>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/** Brand glow under the card once it ships. */
function ShippedGlow({ on }: { on: boolean }) {
  return (
    <span
      className={`relay-glow pointer-events-none absolute -inset-10 -z-10 rounded-[48px] transition-opacity duration-500 ${show(on)}`}
    />
  );
}

/* ---------- Desktop and tablet (≥ md): the card travels left → right ---------- */

function DesktopRelay({ b, still }: { b: number; still: boolean }) {
  const shipped = b >= SHIPPED;
  const size = useRef({ w: 0, card: 0 });
  const last = useRef(1);
  const card = useRef<HTMLDivElement>(null);
  const notch = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  const place = (p: number) => {
    last.current = p;
    const { w, card: cw } = size.current;
    if (!w || !card.current || !notch.current || !fill.current) return;
    const s = stationAt(p);
    const i0 = Math.min(Math.floor(s), LAST);
    const i1 = Math.min(i0 + 1, LAST);
    const f = s - i0;
    const centre = (i: number) => ((i + 0.5) / AGENTS.length) * w;
    const clamped = (i: number) => Math.min(Math.max(centre(i), cw / 2), w - cw / 2);
    const cardX = clamped(i0) + (clamped(i1) - clamped(i0)) * f - cw / 2;
    const notchX = centre(i0) + (centre(i1) - centre(i0)) * f;
    card.current.style.transform = `translate3d(${r2(cardX)}px,0,0)`;
    notch.current.style.transform = `translate3d(${r2(notchX)}px,0,0)`;
    fill.current.style.transform = `scaleX(${r2((s / LAST) * 100) / 100})`;
  };

  // Sizes are cached by a ResizeObserver; the scroll path never reads layout.
  const track = useMeasure<HTMLDivElement>((el) => {
    size.current = { w: el.offsetWidth, card: card.current?.firstElementChild instanceof HTMLElement ? card.current.firstElementChild.offsetWidth : 0 };
    place(last.current);
  });
  useSceneProgress(place);

  return (
    <div ref={track} className="relative [--card-w:320px] lg:[--card-w:360px]">
      {/* Stations */}
      <div className="relative grid grid-cols-6">
        <div className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[22px] h-px bg-ink/[0.1] [@media(max-height:760px)]:top-[18px]">
          <div ref={fill} data-scrub className="h-full origin-left bg-brand-400" style={{ transform: "scaleX(1)" }} />
        </div>
        {AGENTS.map((agent, i) => {
          const state = stationState(b, i);
          return (
            <div key={agent.slug} className="relative flex flex-col items-center">
              <StationTile agent={agent} state={state} className="h-11 w-11 rounded-[12px] [@media(max-height:760px)]:h-9 [@media(max-height:760px)]:w-9 [@media(max-height:760px)]:rounded-[10px]" />
              <span className="mt-2.5 whitespace-nowrap text-[0.8125rem] text-fg-2">
                {agentShortName(agent)}
                <span className="hidden lg:inline"> Agent</span>
              </span>
              <Stack className="mt-1 h-4 place-items-center text-[0.75rem]">
                <span className={`h-1.5 w-1.5 rounded-full bg-ink/20 transition-opacity duration-200 ${show(state === "idle")}`} />
                <span className={`flex items-center gap-1.5 text-brand-300 transition-opacity duration-200 ${show(state === "working")}`}>
                  <span className="live-dot" />
                  Working
                </span>
                <Check className={`h-3 w-3 text-brand-300 transition-opacity duration-200 ${show(state === "done")}`} strokeWidth={2.25} />
              </Stack>
            </div>
          );
        })}
      </div>

      {/* Notch: points at the active station, even when the card is clamped at an end */}
      <div className="relative h-8">
        <div
          ref={notch}
          data-scrub
          className="absolute inset-y-0 left-0 w-full"
          // Before JS: at the last station (a % of its own, track-wide, box). Then written per frame.
          style={{ transform: `translate3d(${r2(((LAST + 0.5) / AGENTS.length) * 100)}%,0,0)` }}
        >
          <span className="absolute -left-[3px] top-0.5 h-1.5 w-1.5 rounded-full bg-brand-400" />
          <span className="absolute left-0 top-0.5 h-full w-px bg-brand-400/60" />
        </div>
      </div>

      {/* The card, and the end line that appears to its left once it has shipped */}
      <div className="relative">
        <p
          className={`absolute left-0 top-1/2 max-w-[18rem] -translate-y-1/2 text-[1.125rem] leading-[1.45] text-fg-2 text-pretty transition-opacity duration-500 ${show(shipped)}`}
        >
          {C.endLine}
        </p>
        <div ref={card} data-scrub style={{ transform: "translate3d(calc(100% - var(--card-w)),0,0)" }}>
          <div
            className={`relative isolate w-[var(--card-w)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${shipped ? "-translate-y-1" : ""}`}
          >
            <ShippedGlow on={shipped} />
            <WorkCard b={b}>
              {AGENTS.map((agent, i) => (
                <div key={agent.slug} className="flex border-t border-line">
                  <Row agent={agent} i={i} state={stationState(b, i)} shipped={shipped} still={still} />
                </div>
              ))}
            </WorkCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Phone (< md): the card is the relay line; a token moves down the team ---------- */

function PhoneRelay({ b, still }: { b: number; still: boolean }) {
  const shipped = b >= SHIPPED;
  const centres = useRef<number[]>([]);
  const last = useRef(1);
  const token = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const rail = useRef<HTMLSpanElement>(null);

  const place = (p: number) => {
    last.current = p;
    const ys = centres.current;
    if (ys.length !== AGENTS.length || !token.current || !fill.current) return;
    const s = stationAt(p);
    const i0 = Math.min(Math.floor(s), LAST);
    const i1 = Math.min(i0 + 1, LAST);
    const y = ys[i0] + (ys[i1] - ys[i0]) * (s - i0) - ys[0];
    token.current.style.transform = `translate3d(0,${r2(y)}px,0)`;
    fill.current.style.transform = `scaleY(${r2((s / LAST) * 100) / 100})`;
  };

  const rows = useMeasure<HTMLDivElement>((el) => {
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
    centres.current = nodes.map((n) => n.offsetTop + n.offsetHeight / 2);
    if (rail.current && centres.current.length) {
      const [first] = centres.current;
      rail.current.style.top = `${first}px`;
      rail.current.style.height = `${centres.current[centres.current.length - 1] - first}px`;
      if (token.current) token.current.style.top = `${first}px`;
    }
    place(last.current);
  });
  useSceneProgress(place);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative isolate w-full transition-transform duration-300 ${shipped ? "-translate-y-1" : ""}`}>
        <ShippedGlow on={shipped} />
        <WorkCard b={b}>
          <div ref={rows} className="relative">
            {/* Rail through the node centres (placed at measure time, not during scroll) */}
            <span ref={rail} className="absolute left-[33.5px] top-[26px] h-[calc(100%-52px)] w-px bg-ink/[0.1]">
              <span ref={fill} data-scrub className="absolute inset-0 origin-top bg-brand-400" style={{ transform: "scaleY(1)" }} />
            </span>
            {/* The token: a lit ring framing the active station's tile, in its own layer above
                the tiles (inside the rail it sat under them). Moves by translateY only; its
                top is placed at measure time. */}
            <span
              ref={token}
              data-scrub
              aria-hidden="true"
              className="pointer-events-none absolute left-[34px] top-[26px] z-20 -ml-[18px] -mt-[18px] h-9 w-9 rounded-[10px] ring-1 ring-brand-400 shadow-[0_0_14px_1px_rgb(var(--brand-glow-rgb)/0.5)]"
              style={{ transform: "translate3d(0,calc(5 * 52px),0)" }}
            />
            {AGENTS.map((agent, i) => {
              const state = stationState(b, i);
              return (
                <div key={agent.slug} className="flex items-center gap-3 border-t border-line pl-5">
                  <span data-node className="relative z-10 grid w-7 place-items-center">
                    <StationTile agent={agent} state={state} className="h-7 w-7 rounded-[8px]" />
                  </span>
                  <Row agent={agent} i={i} state={state} shipped={shipped} still={still} phone />
                </div>
              );
            })}
          </div>
        </WorkCard>
      </div>
      <p className={`mt-6 max-w-[20rem] text-center text-[0.9375rem] leading-[1.5] text-fg-2 transition-opacity duration-500 ${show(shipped)}`}>
        {C.endLine}
      </p>
    </div>
  );
}

/* ---------- The scene ---------- */

function RelayStage() {
  const b = useSceneBeat(BEATS);
  const still = useSceneStill();
  return (
    <>
      {/* Assistive tech gets the hand-offs as a list; the moving picture is decorative. */}
      <div className="sr-only">
        <ol>
          {AGENTS.map((a) => (
            <li key={a.slug}>
              {a.name}: {a.handoff}
            </li>
          ))}
        </ol>
        <p>{C.endLine}</p>
      </div>
      <div aria-hidden="true" className="mx-auto w-full max-w-[1120px] py-10">
        <div className="hidden md:block">
          <DesktopRelay b={b} still={still} />
        </div>
        <div className="md:hidden">
          <PhoneRelay b={b} still={still} />
        </div>
      </div>
    </>
  );
}

export function Relay() {
  return (
    <StickyScene id="relay" length={3.4} label={C.headline} className="flex flex-col justify-center">
      <RelayStage />
    </StickyScene>
  );
}
