"use client";

import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Stage } from "@/components/landing/demo";
import { Orb } from "@/components/landing/ui";
import { StickyScene, seg, smoothstep, useMeasure, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { SIGNAL_COPY } from "./copy";

/*
 * "Your market is talking." A pinned scene: while it holds, scrolling rolls the five lines
 * through a counter window on the left, one at a time, and lights the matching stream on
 * the right. Then the closing sentence, Selixa Signal lights, the opportunities come out,
 * and the page moves on. Scrub position (the counter's translateY), step content (the rest).
 */

const C = SIGNAL_COPY.listen;
const LINES = C.lines;

// Six streams of raw activity, each a lane of fragments drifting toward Selixa. Illustrative.
const STREAMS: { label: string; bits: string[]; ms: number }[] = [
  { label: "Search", bits: ["“games for long distance couples”", "“couple games online”", "“apps to play with bf over facetime”"], ms: 38000 },
  { label: "Social", bits: ["#couplesgames", "“we need a Wordle for two”", "Thread: 1.2K reposts"], ms: 46000 },
  { label: "Communities", bits: ["r/LongDistance", "“what do you play on calls?”", "Discord: 3 new servers"], ms: 42000 },
  { label: "Competitors", bits: ["Launched: co-op mode", "Pricing page changed", "Hiring: multiplayer lead"], ms: 50000 },
  { label: "Trends", bits: ["Up 38% year on year", "Peaks on Sunday nights", "Rising in 14 countries"], ms: 44000 },
  { label: "Audience", bits: ["“runs out too fast”", "“we live 6 hours apart”", "Top question: free options?"], ms: 40000 },
];

// Which streams each line is about: searching → Search, asking → Audience, and so on.
const LIGHTS: string[][] = [["Search"], ["Audience"], ["Competitors"], ["Communities", "Social"], ["Trends"]];

const OPPORTUNITIES = [
  { title: "Multiplayer play for long-distance couples", meta: "Demand rising · 14 signals" },
  { title: "Daily game ritual for two", meta: "Emerging · 6 signals" },
  { title: "Gap: free couples games with depth", meta: "Underserved · 9 signals" },
];

// Lines 2…5 arrive at these points; each rolls in over the 0.06 before its beat, then rests.
const LINE_BEATS = [0.14, 0.28, 0.42, 0.56];
// Then: the closing sentence, Selixa lights, the three opportunities.
const AFTER_BEATS = [0.68, 0.76, 0.84, 0.89, 0.94];
const BEATS = [...LINE_BEATS, ...AFTER_BEATS];
const AFTER = LINE_BEATS.length + 1;
const LIT = AFTER + 1;
const OUT = LIT + 1;

/** Counter position, 0 … 4: glides into each line just before its beat, holds between. */
const lineAt = (p: number) => LINE_BEATS.reduce((r, b) => r + smoothstep(seg(p, b - 0.06, b)), 0);

/** A lane: the fragments twice over, sliding right on a loop (transform only). */
function Lane({ bits, ms }: { bits: string[]; ms: number }) {
  const row = [...bits, ...bits, ...bits];
  return (
    <div className="signal-lane-mask relative h-8 min-w-0 flex-1 overflow-hidden">
      <div className="signal-lane flex w-max gap-2" style={{ animationDuration: `${ms}ms` }}>
        {[...row, ...row].map((b, i) => (
          <span key={i} className="tag shrink-0 bg-panel" aria-hidden={i >= row.length || undefined}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The counter: the lines stacked in a window three rows tall. The track slides up one row
 * per line; the line in the middle row is bright, its neighbours fade, the rest are gone.
 */
function Counter() {
  // Scrubbed: the track's translateY and each row's opacity. The row height is cached on
  // resize, never read while scrolling.
  const track = useRef<HTMLDivElement>(null);
  const rowH = useRef(0);
  const last = useRef(0);
  const place = (p: number) => {
    last.current = p;
    const el = track.current;
    if (!el || !rowH.current) return;
    const at = lineAt(p);
    el.style.transform = `translate3d(0,${Math.round(-at * rowH.current * 100) / 100}px,0)`;
    Array.from(el.children).forEach((child, i) => {
      (child as HTMLElement).style.opacity = String(Math.max(0, 1 - Math.abs(i - at) * 0.78));
    });
  };
  const frame = useMeasure<HTMLDivElement>(() => {
    rowH.current = (track.current?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
    place(last.current);
  });
  useSceneProgress(place);

  return (
    // Window: the middle row is the counter's reading; masks fade the rows above and below.
    <div ref={frame} className="signal-counter relative h-[calc(var(--row)*3)] overflow-hidden [--row:clamp(2.75rem,4.4vw,3.75rem)]" aria-hidden="true">
      <div ref={track} data-scrub className="absolute inset-x-0 top-[var(--row)]">
        {LINES.map((line, i) => (
          <p
            key={line}
            className="flex h-[var(--row)] items-center whitespace-nowrap text-[clamp(1.625rem,3vw,2.5rem)] tracking-[-0.03em] text-fg"
            style={{ opacity: i === 0 ? 1 : i === 1 ? 0.22 : 0 }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

/** The right side: streams → Selixa Signal → opportunities. `beat` drives what's lit. */
function Flow({ beat, still }: { beat: number; still: boolean }) {
  const line = Math.min(beat, LINES.length - 1);
  const lit = still || beat >= AFTER ? new Set<string>() : new Set(LIGHTS[line]);

  return (
    <div className="flex flex-col gap-4">
      <div className="window p-4 sm:p-5">
        <ul className="flex flex-col gap-2.5">
          {STREAMS.map((s) => {
            const on = lit.has(s.label);
            return (
              <li key={s.label} className={`flex items-center gap-3 transition-opacity duration-500 ${lit.size && !on ? "opacity-45" : ""}`}>
                <span className={`w-[6.5rem] shrink-0 text-[0.6875rem] uppercase tracking-[0.16em] transition-colors duration-500 ${on ? "text-brand-300" : "text-fg-3"}`}>
                  {s.label}
                </span>
                <Lane bits={s.bits} ms={s.ms} />
                <ArrowRight className={`hidden h-3.5 w-3.5 shrink-0 sm:block ${on ? "text-brand-300" : "text-brand-400/50"}`} strokeWidth={1.75} aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      </div>

      <ArrowDown className="mx-auto h-4 w-4 text-brand-400" strokeWidth={1.5} aria-hidden="true" />

      <div className={`card flex items-center gap-4 p-4 transition-[border-color,box-shadow] duration-500 ${beat >= LIT ? "card-lit" : ""} ${!still && beat === LIT ? "is-live" : ""}`}>
        <Orb size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-brand-300">Selixa Signal</p>
          <p className="mt-1 text-[0.9375rem] text-fg">Connects the streams, removes the noise, finds what&rsquo;s changing.</p>
        </div>
      </div>

      <ArrowDown className="mx-auto h-4 w-4 text-brand-400" strokeWidth={1.5} aria-hidden="true" />

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OPPORTUNITIES.map((o, i) => (
          <Stage as="li" key={o.title} on={beat >= OUT + i} className="card flex flex-col gap-2.5 p-4">
            <span className="flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-[0.16em] text-brand-300">
              <Sparkles className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
              Opportunity
            </span>
            <span className="text-[0.9375rem] leading-[1.35] text-fg">{o.title}</span>
            <span className="mt-auto text-[0.75rem] text-fg-3">{o.meta}</span>
          </Stage>
        ))}
      </ul>
    </div>
  );
}

function Scene() {
  const beat = useSceneBeat(BEATS);
  const still = useSceneStill();

  return (
    <div className="grid w-full grid-cols-1 gap-10 py-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
      <div>
        <p className="eyebrow">
          <span className="num">01</span>
          <span className="rule" aria-hidden="true" />
          {C.label}
        </p>
        <h2 className="mt-6 max-w-[16ch] text-[clamp(2.25rem,4.4vw,3.75rem)] font-normal leading-[1.04] tracking-[-0.035em] text-fg text-balance">
          {C.headline}
        </h2>

        {/* Pinned: the rolling counter. Static: the plain list. CSS picks one before paint. */}
        <div className="scene-live-only mt-8">
          <Counter />
        </div>
        <div aria-hidden="true" className="scene-still-only">
          <ul className="mt-8 flex flex-col gap-1.5">
            {LINES.map((line) => (
              <li key={line} className="text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.35] tracking-[-0.02em] text-fg">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <ul className="sr-only">
          {LINES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <Stage as="p" on={still || beat >= AFTER} className="mt-6 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-fg-2 text-pretty">
          {C.after}
        </Stage>
      </div>

      {/* Phones get the flow after the scene (below), so the pinned stage stays one screen. */}
      <div className="hidden lg:block">
        <Flow beat={beat} still={still} />
      </div>
    </div>
  );
}

export function Listening() {
  return (
    <>
      <StickyScene id="how" length={2.4} label={C.headline} minStageHeight={560} className="flex items-center">
        <Scene />
      </StickyScene>
      <div className="pb-8 pt-4 lg:hidden">
        <Flow beat={BEATS.length} still />
      </div>
    </>
  );
}
