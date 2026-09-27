"use client";

import { Scale } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Orb, WindowBar, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { Initials } from "@/components/site/Initials";
import { agentBySlug } from "@/lib/content/agents";
import { MEETING_COPY } from "./copy";

const C = MEETING_COPY.hero;
const ROWS = MEETING_COPY.timeline.rows;

// The hero loop: nobody → Sara → Maya → Sara ("Let's do that…") → Selixa notes a decision → hold.
const SCRIPT = [300, 1400, 1400, 1400, 700, 3000];
const NOTE = 4;
const LAST = SCRIPT.length - 1;
/** Speaker (tile index) and caption (transcript row) per step. */
const SPEAKER: (number | null)[] = [null, 0, 2, 0, null, null];
const CAPTION: (number | null)[] = [null, 0, 1, 4, 4, 4];

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (s: number) => `${pad(Math.floor(s / 60) % 100)}:${pad(s % 60)}`;

/** Ticks once a second from 00:00 while on screen; the finished call's length otherwise. */
function useCallTimer(target: React.RefObject<HTMLElement | null>) {
  const [seconds, setSeconds] = useState<number | null>(null);
  useEffect(() => {
    const el = target.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id);
      if (!e.isIntersecting) return;
      setSeconds((s) => s ?? 0);
      id = window.setInterval(() => setSeconds((s) => (s ?? 0) + 1), 1000);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [target]);
  return seconds === null ? C.endTime : clock(seconds);
}

/** Top-row tiles carry their labels at the top, so the headline over the grid's centre never covers them. */
function CallTile({ name, role, speaking, top }: { name: string; role: string; speaking: boolean; top?: boolean }) {
  return (
    <div className="call-tile relative overflow-hidden rounded-[16px] border border-line">
      <span className={`is-live pointer-events-none absolute inset-0 rounded-[16px] border transition-opacity duration-[250ms] ${speaking ? "opacity-100" : "opacity-0"}`} />
      <span
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 ${top ? "top-[38%]" : "top-[62%] [@media(max-height:700px)]:hidden"}`}
      >
        <Initials name={name} size={72} className="hidden md:grid" />
        <Initials name={name} size={52} className="md:hidden" />
      </span>
      <span className={`absolute left-3.5 flex items-center gap-2 text-[0.75rem] text-fg-2 md:text-[0.8125rem] ${top ? "top-3" : "bottom-3"}`}>
        {name}
        <span className={`eq text-brand-400 transition-opacity duration-200 ${speaking ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className={`absolute right-3.5 hidden text-[0.75rem] text-fg-3 sm:inline ${top ? "top-3" : "bottom-3"}`}>{role}</span>
    </div>
  );
}

function SelixaTile({ noting, chip }: { noting: boolean; chip: boolean }) {
  return (
    <div className="call-tile card-lit relative overflow-hidden rounded-[16px] border">
      <span className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 [@media(max-height:700px)]:hidden">
        <Orb size={64} className="hidden md:grid" />
        <Orb size={48} className="md:hidden" />
      </span>
      <span className="absolute bottom-3 left-3.5 text-[0.75rem] text-fg-2 md:text-[0.8125rem]">{C.selixa}</span>
      <span className="absolute bottom-3 right-3.5 flex flex-col items-end gap-2">
        <span
          className={`tag border-brand-400/40 bg-brand-500/15 text-brand-200 transition-[opacity,transform] duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            chip ? "scale-100 opacity-100" : "scale-[0.92] opacity-0"
          }`}
        >
          <Scale className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          {MEETING_COPY.timeline.chips.decision.label}
        </span>
        <span className="grid justify-items-end text-[0.75rem] text-brand-300 [&>*]:col-start-1 [&>*]:row-start-1">
          {C.selixaStatus.map((s, i) => (
            <span key={s} className={`flex items-center gap-2 transition-opacity duration-200 ${(i === 1) === noting ? "opacity-100" : "opacity-0"}`}>
              <span className="live-dot" aria-hidden="true" />
              {s}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

/** The hero: a call screen, edge to edge, dark in both schemes, with the headline set on it. */
export function CallScreen() {
  const agent = agentBySlug("meeting")!;
  const { ref, step, still } = useSequence<HTMLElement>(SCRIPT);
  const frame = still ? LAST : step;
  const speaker = still ? null : SPEAKER[frame];
  const caption = CAPTION[frame];
  const timerRef = useRef<HTMLElement>(null);
  const time = useCallTimer(timerRef);

  return (
    <section
      ref={(el) => {
        ref.current = el;
        timerRef.current = el;
      }}
      aria-label={C.windowTitle}
      className="call-frame window scheme-dark relative flex h-[calc(100svh-4.5rem)] min-h-[560px] flex-col rounded-none! border-x-0 md:mx-3 md:mt-2 md:h-[calc(100svh-5.25rem)] md:min-h-[600px] md:rounded-[24px]! md:border-x"
    >
      <WindowBar>
        <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500 shadow-[0_0_10px_rgb(var(--brand-glow-rgb)/0.8)]" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-center text-fg-2">{C.windowTitle}</span>
        <span className="w-[5ch] text-right tabular-nums text-fg-2" aria-hidden="true">
          {time}
        </span>
      </WindowBar>

      {/* Tiles: Sara, Dev, Maya, Selixa */}
      <div aria-hidden="true" className="reveal relative grid flex-1 grid-cols-2 grid-rows-2 gap-2 p-2 md:gap-3 md:p-3" style={d(0)}>
        {C.tiles.map((t, i) => (
          <CallTile key={t.name} name={t.name} role={t.role} speaking={speaker === i} top={i < 2} />
        ))}
        <SelixaTile noting={!still && frame === NOTE} chip={frame >= NOTE} />
      </div>

      {/* Scrim: darkens the grid's centre so the headline reads (static) */}
      <div aria-hidden="true" className="call-scrim pointer-events-none absolute inset-0" />

      {/* Title block, set on the screen */}
      <div className="pointer-events-none absolute inset-x-0 top-[54%] flex -translate-y-1/2 justify-center px-6 md:px-5">
        <div className="flex max-w-[44rem] flex-col items-center text-center">
          <span className="reveal pill gap-2.5 px-4 py-3" style={d(60)}>
            <span className="live-dot" aria-hidden="true" />
            {C.eyebrow}
          </span>
          <h1
            className="reveal mt-7 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.05em] text-fg text-balance"
            style={d(140)}
          >
            {agent.headline}
          </h1>
          <p className="reveal mt-6 max-w-[34rem] text-[1rem] leading-[1.6] text-fg-2 text-pretty sm:text-[1.125rem]" style={d(220)}>
            {agent.line}
          </p>
        </div>
      </div>

      {/* Lower third: the live caption (desktop) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center px-6 md:flex">
        <div className="grid max-w-[36rem] [&>*]:col-start-1 [&>*]:row-start-1">
          {[0, 1, 4].map((r) => (
            <p
              key={r}
              className={`justify-self-center truncate rounded-full border border-line bg-well px-4 py-2 text-[0.8125rem] text-fg-2 transition-opacity duration-300 ${
                caption === r ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-fg-3">{ROWS[r].who.split(" ")[0]}:</span> {ROWS[r].line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
