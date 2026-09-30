"use client";

import { Orb } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { SIGNAL_SOURCES, SourceMark } from "./sources";

// One sample signal per source, all on the page's one story (couples games). Illustrative.
const OBSERVED: Record<string, { what: string; meta: string }> = {
  Google: { what: "“games for long distance couples”", meta: "Searches up 84%" },
  YouTube: { what: "“couples game night ideas”", meta: "Views up 2.1×" },
  Reddit: { what: "r/LongDistance: “what do you play on video calls?”", meta: "312 comments" },
  X: { what: "“someone make a daily game for couples”", meta: "4.1K likes" },
  LinkedIn: { what: "A competitor is hiring for multiplayer", meta: "Posted 2d ago" },
  "Product Hunt": { what: "New launch: a co-op quiz for couples", meta: "#3 of the day" },
  Amazon: { what: "Couples card games: “runs out too fast”", meta: "128 reviews" },
  TikTok: { what: "#couplesgames", meta: "Views up 3×" },
};

// Places without a mark, on the inner ring.
const OTHERS = ["App stores", "Forums", "News", "Reviews"];

const N = SIGNAL_SOURCES.length;
// Ring positions in % of the field, starting top-left and going clockwise.
const place = (i: number, n: number, rx: number, ry: number, offset = -0.7) => {
  const a = offset * Math.PI + (i / n) * 2 * Math.PI;
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return { x: r2(50 + rx * Math.cos(a)), y: r2(50 + ry * Math.sin(a)) };
};
const OUTER = SIGNAL_SOURCES.map((_, i) => place(i, N, 45, 42));
const INNER = OTHERS.map((_, i) => place(i, OTHERS.length, 24, 25, -0.45));

// Each source takes a turn: it lights, its line carries the signal in, the ticker reads it.
const SCRIPT = SIGNAL_SOURCES.map(() => 2400);

/**
 * The hero's visual: Selixa at the centre of the public internet, the sources on a ring,
 * each connected by a line whose dashes flow inward. One source at a time lights up and
 * the ticker under the orb reads what it just saw. Reduced motion shows the last one.
 */
export function SignalField() {
  const { ref, step, still } = useSequence(SCRIPT);
  const active = SIGNAL_SOURCES[step];
  const seen = OBSERVED[active.name];

  return (
    <div ref={ref} className="relative mx-auto aspect-[4/5] w-full max-w-[68rem] sm:aspect-[16/9] lg:aspect-[21/9]">
      {/* Soft glow and rings behind the orb */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="absolute h-[70%] w-[46%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--brand-glow-rgb)/0.16),transparent)]" />
        <div className="absolute h-[84%] w-[90%] rounded-[50%] border border-ink/[0.06]" />
        <div className="absolute h-[50%] w-[48%] rounded-[50%] border border-dashed border-ink/[0.08]" />
      </div>

      {/* Lines from each source to the centre; dashes flow inward */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
        {OUTER.map((p, i) => {
          const on = i === step;
          return (
            <g key={SIGNAL_SOURCES[i].name}>
              <line x1={p.x} y1={p.y} x2="50" y2="50" stroke="rgb(var(--ink-rgb))" strokeOpacity="0.08" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line
                x1={p.x}
                y1={p.y}
                x2="50"
                y2="50"
                className={still ? "" : "flow"}
                stroke="rgb(var(--brand-400-rgb))"
                strokeOpacity={on ? 0.85 : 0.18}
                strokeWidth={on ? 1.5 : 1}
                vectorEffect="non-scaling-stroke"
                style={{ transition: "stroke-opacity 500ms" }}
              />
            </g>
          );
        })}
      </svg>

      {/* The marked sources */}
      {SIGNAL_SOURCES.map((s, i) => {
        const on = i === step;
        return (
          <span
            key={s.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${OUTER[i].x}%`, top: `${OUTER[i].y}%` }}
          >
            <span
              className={`flex items-center gap-2 rounded-full border bg-panel py-1.5 pl-1.5 pr-1.5 transition-[border-color,box-shadow,color] duration-500 sm:pr-3.5 ${
                on ? "is-live border-brand-400/50 text-fg" : "border-line text-fg-3"
              }`}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/[0.04]">
                <SourceMark source={s} className="h-3.5 w-3.5" />
              </span>
              <span className="hidden text-[0.8125rem] sm:inline">{s.name}</span>
            </span>
          </span>
        );
      })}

      {/* Everything else it reads, on the inner ring */}
      {OTHERS.map((name, i) => (
        <span
          key={name}
          className="absolute hidden -translate-x-1/2 -translate-y-1/2 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3/80 md:block"
          style={{ left: `${INNER[i].x}%`, top: `${INNER[i].y}%` }}
        >
          {name}
        </span>
      ))}

      {/* Selixa, and what it just noticed */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <Orb size={76} />
      </div>
      <div className="absolute left-1/2 top-[calc(50%+3.25rem)] w-[min(22rem,78vw)] -translate-x-1/2 text-center" aria-live="off">
        <p key={step} className={`${still ? "" : "pop-in"} text-[0.6875rem] uppercase tracking-[0.16em] text-brand-300`}>
          {active.name} · {seen.meta}
        </p>
        <p key={`w${step}`} className={`${still ? "" : "appear"} mt-1.5 truncate text-[0.875rem] text-fg-2`}>
          {seen.what}
        </p>
      </div>
      <p className="sr-only">
        Selixa Signal watches public activity on {SIGNAL_SOURCES.map((s) => s.name).join(", ")}, {OTHERS.join(", ").toLowerCase()} and more.
      </p>
    </div>
  );
}
