"use client";

import { useRef } from "react";
import { Orb } from "@/components/landing/ui";
import { StickyScene, seg, smoothstep, useMeasure, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { CAPTURE_COPY } from "./copy";

/*
 * "Selixa stays with you." A pinned scene: the orb travels a founder's day from a
 * conference to the build, one stop per bit of scroll, and the caption tells that moment.
 * Scrub position (the orb's translateX), step content (lit stops, caption).
 */

const C = CAPTURE_COPY.stays;

// Three chapters: out in the world, captured, then the rest of Selixa. Sample story.
const STOPS: { label: string; story: string; chapter: 0 | 1 | 2 }[] = [
  { label: "Conference", story: "You’re at Token2049.", chapter: 0 },
  { label: "Meet someone", story: "You meet Sarah from Acme.", chapter: 0 },
  { label: "Conversation", story: "Ten minutes of talking.", chapter: 0 },
  { label: "Hear a problem", story: "“We can’t tell which requests are worth building.”", chapter: 0 },
  { label: "Capture", story: "A quick voice note.", chapter: 1 },
  { label: "Person + problem", story: "Selixa keeps who, what and why.", chapter: 1 },
  { label: "Selixa", story: "It matches three other conversations.", chapter: 2 },
  { label: "Research", story: "A research brief opens.", chapter: 2 },
  { label: "Priority", story: "#2 priority this quarter.", chapter: 2 },
  { label: "Roadmap", story: "It moves to Now.", chapter: 2 },
  { label: "Build", story: "Your team starts building.", chapter: 2 },
];
const CHAPTERS = ["In the world", "Capture", "Selixa"];
const N = STOPS.length;

// Stop k (k ≥ 1) is reached at 0.06 + 0.085k, gliding over the 0.05 before it.
const BEATS = STOPS.slice(1).map((_, i) => Math.round((0.06 + 0.085 * (i + 1)) * 1000) / 1000);
const stopAt = (p: number) => BEATS.reduce((r, b) => r + smoothstep(seg(p, b - 0.05, b)), 0);

function Track() {
  const still = useSceneStill();
  const beat = useSceneBeat(BEATS);
  const reached = still ? N - 1 : beat;

  // Scrubbed: the orb's translateX along the track; the track width is cached on resize.
  const orb = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const width = useRef(0);
  const last = useRef(0);
  const place = (p: number) => {
    last.current = p;
    const at = stopAt(p) / (N - 1);
    if (orb.current) orb.current.style.transform = `translate3d(${Math.round(at * width.current * 100) / 100}px,0,0)`;
    if (fill.current) fill.current.style.transform = `scaleX(${at.toFixed(4)})`;
  };
  const track = useMeasure<HTMLDivElement>((el) => {
    width.current = el.clientWidth;
    place(last.current);
  });
  useSceneProgress(place);

  return (
    <div className="w-full">
      {/* Chapters over the stops (large screens) */}
      <div aria-hidden="true" className="mb-6 hidden grid-cols-11 gap-2 lg:grid">
        {CHAPTERS.map((c, i) => {
          const span = STOPS.filter((s) => s.chapter === i).length;
          const on = STOPS.findIndex((s) => s.chapter === i) <= reached;
          return (
            <p
              key={c}
              style={{ gridColumn: `span ${span} / span ${span}` }}
              className={`border-t pt-3 text-center text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-500 ${
                on ? "border-brand-400/50 text-brand-300" : "border-line text-fg-3"
              }`}
            >
              {c}
            </p>
          );
        })}
      </div>

      {/* The line, the stops and the orb travelling it */}
      <div className="relative px-[max(1.75rem,calc(100%/22))]">
        <div ref={track} className="relative h-12">
          <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
          <span
            ref={fill}
            data-scrub
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-[linear-gradient(90deg,var(--color-brand-400),var(--color-brand-300))]"
            style={{ transform: `scaleX(${still ? 1 : 0})` }}
          />
          {STOPS.map((s, i) => (
            <span
              key={s.label}
              aria-hidden="true"
              className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500 ${
                i <= reached ? "border-brand-400 bg-brand-400" : "border-line-strong bg-bg"
              }`}
              style={{ left: `${(i / (N - 1)) * 100}%` }}
            />
          ))}
          {/* place() moves it; a static scene gets p = 1, so it parks at the last stop. */}
          <span ref={orb} data-scrub className="absolute left-0 top-1/2 -ml-6 -mt-6">
            <Orb size={48} />
          </span>
        </div>
      </div>

      {/* Stop labels (large screens) */}
      <ol className="mt-4 hidden grid-cols-11 gap-2 lg:grid">
        {STOPS.map((s, i) => (
          <li key={s.label} className={`text-center text-[0.8125rem] leading-snug transition-colors duration-500 ${i === reached ? "text-fg" : i < reached ? "text-fg-2" : "text-fg-3"}`}>
            {s.label}
          </li>
        ))}
      </ol>

      {/* The moment, told */}
      <div className="relative mx-auto mt-12 grid max-w-[40rem] text-center [&>*]:col-start-1 [&>*]:row-start-1" aria-live="off">
        {STOPS.map((s, i) => (
          <div
            key={s.label}
            aria-hidden={i !== reached}
            className={`transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] ${i === reached ? "opacity-100" : i < reached ? "-translate-y-3 opacity-0" : "translate-y-3 opacity-0"}`}
          >
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-brand-300">
              {String(i + 1).padStart(2, "0")} · {s.label}
            </p>
            <p className="mt-3 text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.3] tracking-[-0.02em] text-fg text-balance">{s.story}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StaysWithYou() {
  return (
    <StickyScene id="stays" length={2.6} label={C.headline} minStageHeight={560} className="flex items-center">
      <div className="relative flex w-full flex-col items-center py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[20%] top-0 h-[60%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--brand-glow-rgb)/0.14),transparent)] blur-2xl" />
        <p className="eyebrow relative">
          <span className="num">03</span>
          <span className="rule" aria-hidden="true" />
          {C.label}
        </p>
        <h2 className="relative mt-6 text-center font-display text-[clamp(2.75rem,6.4vw,5.5rem)] font-light leading-[0.95] tracking-[-0.05em] text-fg">
          {C.headline}
        </h2>
        <p className="relative mt-5 max-w-[34rem] text-center text-[1.125rem] leading-[1.6] text-fg-2 text-pretty">{C.line}</p>
        <div className="relative mt-14 w-full">
          <Track />
        </div>
        <ol className="sr-only">
          {STOPS.map((s) => (
            <li key={s.label}>
              {s.label}: {s.story}
            </li>
          ))}
        </ol>
      </div>
    </StickyScene>
  );
}
