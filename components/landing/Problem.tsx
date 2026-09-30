"use client";

import { ArrowUp, ChartLine, FileText, GitPullRequest, Hash, Map as MapIcon, MessageSquare, Phone, Search, Video, type LucideIcon } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { StickyScene, seg, smoothstep, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { Stage, Typed } from "./demo";
import { Orb, SectionHeader } from "./ui";

/*
 * "Your product lives everywhere." A pinned scene, driven by scroll:
 *   1. the words stay on the left while each scattered source is pulled into the orb;
 *   2. the camera zooms into the orb as the words fade, and "Nothing gets lost anymore."
 *      lands word by word; under it a question is asked, answered, and the sources come
 *      back as its citations;
 *   3. it holds, then eases back out as the page moves on.
 * Scrub position (transforms and opacity, written per frame), step content (linked sources).
 */

type Source = { label: string; meta: string; icon: LucideIcon; deg: number; r: number; tilt: number };

/** Scattered on purpose: uneven angles and distances read as mess, not a diagram. */
const SOURCES: Source[] = [
  { label: "Meetings", meta: "Weekly product sync", icon: Video, deg: -78, r: 40, tilt: -7 },
  { label: "Slack", meta: "#product-feedback", icon: Hash, deg: -28, r: 43, tilt: 5 },
  { label: "Customer calls", meta: "Churn risk · Acme", icon: Phone, deg: 14, r: 36, tilt: -4 },
  { label: "Docs", meta: "Onboarding PRD v3", icon: FileText, deg: 58, r: 42, tilt: 8 },
  { label: "Analytics", meta: "Activation −8%", icon: ChartLine, deg: 104, r: 38, tilt: -6 },
  { label: "Feedback", meta: "32 new notes", icon: MessageSquare, deg: 150, r: 43, tilt: 6 },
  { label: "Roadmaps", meta: "Q4 plan, 3 blocked", icon: MapIcon, deg: 196, r: 37, tilt: -5 },
  { label: "GitHub", meta: "PR #482 merged", icon: GitPullRequest, deg: 238, r: 42, tilt: 7 },
];

// Source i links at 0.05 + 0.038i (0.05 … 0.32); the orb lights at 0.36.
const BEATS = [...SOURCES.map((_, i) => Math.round((0.05 + 0.038 * i) * 1000) / 1000), 0.36];
const DONE = SOURCES.length + 1;
// The zoom into the orb, then the ease back out at the end.
const ZOOM: [number, number] = [0.4, 0.58];
const OUT: [number, number] = [0.95, 1];

// The relief after "the decisions are somewhere", landing a word at a time, each zooming
// down from large into place.
const WORDS = [
  { text: "Nothing", tone: "text-fg" },
  { text: "gets", tone: "text-fg" },
  { text: "lost", tone: "text-fg" },
  { text: "anymore.", tone: "text-brand-gradient" },
];
const WORD_AT = (k: number) => 0.54 + k * 0.035;
const WORD_LEN = 0.05;

// Then the proof: a question typed, the decision answered, and the scattered sources
// coming back as its citations, one by one.
const QUESTION = "What did we decide about pricing?";
const ANSWER = "Annual plans only, with a 20% discount. Decided Sep 12, confirmed with 3 customers.";
const CITED: { kind: string; ref: string; icon: LucideIcon }[] = [
  { kind: "Meeting", ref: "Pricing review · Sep 12", icon: Video },
  { kind: "Slack", ref: "#pricing thread", icon: Hash },
  { kind: "Doc", ref: "Pricing v3", icon: FileText },
  { kind: "Analytics", ref: "Plan mix, 30 days", icon: ChartLine },
];
// The search appears, then the camera moves in on it (SEARCH_ZOOM) before the answer and its
// sources arrive.
const ASK_BEATS = [0.71, 0.84, ...CITED.map((_, i) => Math.round((0.86 + 0.02 * i) * 100) / 100)];
const SEARCH_ZOOM: [number, number] = [0.74, 0.82];
const ASKED = 1;
const ANSWERED = 2;
const CITE = 3;

// Rounded, because server and browser trig can differ in the last digit and break hydration.
const round = (n: number) => Math.round(n * 100) / 100;
const at = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: round(50 + r * Math.cos(a)), y: round(50 + r * Math.sin(a)) };
};

function SourceChip({ s, linked }: { s: Source; linked: boolean }) {
  const Icon = s.icon;
  return (
    <div
      className={`card flex items-center gap-2.5 rounded-[12px] bg-bg py-2 pl-2 pr-3.5 transition-[border-color,box-shadow,opacity] duration-700 ${
        linked ? "" : "opacity-75"
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border transition-colors duration-700 ${
          linked ? "border-brand-400/40 bg-brand-500/15 text-brand-300" : "border-line bg-ink/[0.03] text-fg-3"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[0.8125rem] leading-tight text-fg">{s.label}</span>
        <span className="truncate text-[0.6875rem] leading-tight text-fg-3">{s.meta}</span>
      </span>
    </div>
  );
}

function Scene() {
  const beat = useSceneBeat(BEATS);
  const still = useSceneStill();
  const ask = useSceneBeat(ASK_BEATS);
  const linked = (i: number) => beat > i;
  const done = beat >= DONE;

  // Scrubbed layers. `stillRef` lets the per-frame writer leave a static scene alone.
  const words = useRef<HTMLDivElement>(null);
  const diagram = useRef<HTMLDivElement>(null);
  const statement = useRef<HTMLDivElement>(null);
  const wordEls = useRef<(HTMLSpanElement | null)[]>([]);
  const headline = useRef<HTMLParagraphElement>(null);
  const proof = useRef<HTMLDivElement>(null);
  const stillRef = useRef(still);
  // A static scene (reduced motion, short screen) keeps its normal layout: clear what the scrub wrote.
  useLayoutEffect(() => {
    stillRef.current = still;
    if (!still) return;
    for (const el of [words.current, diagram.current, statement.current]) {
      if (el) el.style.opacity = el.style.transform = "";
    }
  }, [still]);

  useSceneProgress((p) => {
    const w = words.current;
    const g = diagram.current;
    const t = statement.current;
    if (!w || !g || !t || stillRef.current) return;
    const z = smoothstep(seg(p, ...ZOOM));
    const o = smoothstep(seg(p, ...OUT));
    // Words drift left and fade as the camera moves in.
    w.style.opacity = String(1 - seg(p, ZOOM[0], ZOOM[0] + 0.1));
    w.style.transform = `translate3d(${(-z * 60).toFixed(1)}px,0,0)`;
    // The diagram zooms toward its centre (the orb) and fades once it fills the view.
    g.style.transform = `scale(${(1 + z * 3.2).toFixed(3)})`;
    g.style.opacity = String(1 - seg(p, ZOOM[0] + 0.04, ZOOM[0] + 0.15));
    // The statement layer shows once the orb has filled the view, then eases back out at the end.
    t.style.opacity = String(seg(p, ZOOM[0] + 0.1, ZOOM[0] + 0.14));
    t.style.transform = `scale(${(1 - o * 0.12).toFixed(3)})`;
    // Each word zooms down from large into place, in turn.
    wordEls.current.forEach((el, k) => {
      if (!el) return;
      const w = smoothstep(seg(p, WORD_AT(k), WORD_AT(k) + WORD_LEN));
      el.style.opacity = String(w);
      el.style.transform = `translate3d(0,${((1 - w) * 18).toFixed(1)}px,0) scale(${(1.5 - 0.5 * w).toFixed(3)})`;
    });
    // Then the camera moves in on the search: the headline lifts away, the search rises to the
    // centre and grows. (offsetHeight is unaffected by transforms, so this read never thrashes.)
    const h = headline.current;
    const q = proof.current;
    if (h && q) {
      const sz = smoothstep(seg(p, ...SEARCH_ZOOM));
      h.style.opacity = String(1 - sz);
      h.style.transform = `translate3d(0,${(-60 * sz).toFixed(1)}px,0) scale(${(1 - 0.08 * sz).toFixed(3)})`;
      const rise = (h.offsetHeight + 40) / 2;
      // Grow up to a third larger, but never wider than the screen (phones get little or no zoom).
      const grow = Math.max(0, Math.min(0.32, (window.innerWidth - 32) / Math.max(1, q.offsetWidth) - 1));
      q.style.transform = `translate3d(0,${(-rise * sz).toFixed(1)}px,0) scale(${(1 + grow * sz).toFixed(3)})`;
    }
  });

  return (
    <div className="relative h-full w-full">
      <div className="grid h-full grid-cols-1 content-center items-center gap-10 py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        {/* Left: stays put while the sources come in */}
        <div ref={words} data-scrub>
          <SectionHeader num="02" label="The problem" title="Your product lives everywhere." />
          <p className="mt-6 text-[1.25rem] leading-[1.4] tracking-[-0.01em] text-fg-2 sm:mt-8 sm:text-[1.5rem]">
            The context is everywhere.
            <br />
            <span className="text-fg-3">The decisions are somewhere.</span>
          </p>
        </div>

        {/* Right: the sources pulled into the orb */}
        <div ref={diagram} data-scrub className="relative origin-center">
          {/* Tablet and up: scattered around the orb */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-[min(38rem,68svh)] sm:block">
            <div aria-hidden="true" className="absolute inset-[14%] rounded-full border border-dashed border-ink/[0.07]" />
            <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
              {SOURCES.map((s, i) => {
                const pt = at(s.deg, s.r);
                return (
                  <g key={s.label}>
                    <line x1={pt.x} y1={pt.y} x2={50} y2={50} data-on={linked(i)} className="line-in" stroke="rgb(var(--brand-400-rgb))" strokeOpacity="0.5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    {linked(i) && !still && (
                      <line x1={pt.x} y1={pt.y} x2={50} y2={50} className="flow" stroke="rgb(var(--brand-300-rgb))" strokeOpacity="0.8" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className={`transition-transform duration-700 ${done ? "scale-110" : "scale-100"}`}>
                <Orb size={108} />
              </div>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-[-60%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.45),transparent_62%)] transition-opacity duration-1000 ${
                  done ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            {SOURCES.map((s, i) => {
              const on = linked(i);
              const pt = at(s.deg, s.r);
              // Unlinked, a chip sits a little further out and askew (transform only; no layout moves).
              const a = (s.deg * Math.PI) / 180;
              const push = on ? 0 : 1;
              return (
                <div
                  key={s.label}
                  className="absolute transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    left: `${pt.x}%`,
                    top: `${pt.y}%`,
                    transform: `translate(-50%, -50%) translate(${round(Math.cos(a) * 28 * push)}px, ${round(Math.sin(a) * 28 * push)}px) rotate(${on ? 0 : s.tilt}deg)`,
                  }}
                >
                  <SourceChip s={s} linked={on} />
                </div>
              );
            })}
          </div>

          {/* Phones: the same sources, lighting up in turn */}
          <div className="flex flex-col items-center gap-5 sm:hidden">
            <Orb size={72} />
            <div className="grid w-full grid-cols-2 gap-2">
              {SOURCES.map((s, i) => (
                <SourceChip key={s.label} s={s} linked={linked(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Static: the closing line under the diagram. Pinned: it fills the screen instead (below). */}
      <div className="scene-still-only">
        <p className="pb-16 pt-12 text-center text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.15] tracking-[-0.03em] text-fg">
          Nothing gets lost <span className="text-brand-gradient">anymore.</span>
        </p>
      </div>
      <p className="sr-only">
        Nothing gets lost anymore. Ask “{QUESTION}” and Selixa answers: {ANSWER} Sources: {CITED.map((c) => `${c.kind}, ${c.ref}`).join("; ")}.
      </p>

      {/* Pinned: the line that fills the screen, then the proof under it. Full-bleed. */}
      <div aria-hidden="true" className="scene-live-only pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2">
        <div ref={statement} data-scrub className="relative h-full origin-center opacity-0">
          <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.14),transparent_65%)]" />
          <div className="relative flex h-full flex-col items-center justify-center px-6">
            <p ref={headline} className="text-center font-display text-[clamp(2.75rem,7vw,6.5rem)] font-light leading-[1] tracking-[-0.055em]">
              {WORDS.map((w, k) => (
                <span key={w.text}>
                  <span
                    ref={(el) => {
                      wordEls.current[k] = el;
                    }}
                    // The bottom padding keeps descenders inside a gradient word's clipped box.
                    className={`inline-block origin-[50%_80%] pb-[0.12em] ${w.tone}`}
                    style={{ opacity: 0 }}
                  >
                    {w.text}
                  </span>
                  {k === 1 ? <br /> : k < WORDS.length - 1 ? " " : null}
                </span>
              ))}
            </p>

            {/* The proof: ask, answer, sources */}
            <div ref={proof} className="mt-10 w-full max-w-[36rem] origin-top text-left">
              <Stage on={ask >= ASKED} className="flex items-center gap-3 rounded-[14px] border border-line bg-panel py-2.5 pl-4 pr-2.5 shadow-[0_20px_60px_-30px_rgb(var(--shadow-rgb)/calc(0.6*var(--shadow-k)))]">
                <Search className="h-4 w-4 shrink-0 text-fg-3" strokeWidth={2} />
                <span className="min-w-0 flex-1 text-[1rem] text-fg">
                  <Typed text={QUESTION} on={ask >= ASKED} still={false} cps={34} />
                </span>
                <span className={`grid h-8 w-8 place-items-center rounded-full ${ask >= ANSWERED ? "bg-ink/[0.08] text-fg-2" : "bg-brand-500 text-white"}`}>
                  <ArrowUp className="h-4 w-4" strokeWidth={2} />
                </span>
              </Stage>
              <Stage on={ask >= ANSWERED} className="mt-4 flex gap-3 px-1">
                <Orb size={28} className="shrink-0" />
                <p className="pt-0.5 text-[0.9375rem] leading-[1.55] text-fg-2">{ANSWER}</p>
              </Stage>
              <ul className="mt-4 flex flex-wrap gap-2 pl-11">
                {CITED.map((c, i) => (
                  <Stage as="li" key={c.ref} on={ask >= CITE + i} className="tag bg-panel">
                    <c.icon className="h-3 w-3 text-brand-400" strokeWidth={1.75} />
                    <span className="text-brand-300">{c.kind}</span>
                    {c.ref}
                  </Stage>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Problem() {
  return (
    // Full-bleed, so the zoom can fill the whole screen; the content is re-centred inside.
    <StickyScene
      id="product"
      length={3.6}
      label="Your product lives everywhere. Nothing gets lost anymore."
      minStageHeight={600}
      sectionClassName="ml-[calc(50%-50vw)] w-screen"
    >
      <div className="mx-auto h-full w-full max-w-[1280px] px-5 sm:px-8">
        <Scene />
      </div>
    </StickyScene>
  );
}
