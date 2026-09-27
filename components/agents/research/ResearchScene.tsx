"use client";

import { useRef, type CSSProperties } from "react";
import { PageHeroTitle } from "@/components/site/PageHero";
import { StickyScene, seg, smoothstep, useMeasure, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { agentBySlug } from "@/lib/content/agents";
import { BoardWorld } from "./BoardWorld";
import { BriefCard } from "./BriefCard";
import { CARDS, DESKTOP_WORLD, PHONE_WORLD, RESEARCH_COPY, type World } from "./copy";

/*
 * The investigation board (spec §3): the hero is the scene's first frame. Scrolling moves a
 * camera across a 2-D board of evidence (Customers → Competitors → Market), then pulls back
 * as every thread runs into one brief. Scrub the camera (one transform per frame), step the
 * content (lit threads, captions, the brief) on beats.
 *
 * The static frame (reduced motion, no JS, short viewports) is a different layout, so both
 * render and CSS picks one before paint (.scene-live-only / .scene-still-only).
 */

const C = RESEARCH_COPY;
const agent = agentBySlug("research")!;

const BEATS = [0.24, 0.34, 0.46, 0.56, 0.68, 0.76, 0.84, 0.9];
const CONVERGE = 7;
const BRIEF = 8;
/** Camera moves: [from p, to p], from stop i to stop i + 1. */
const MOVES: [number, number][] = [
  [0.08, 0.24],
  [0.34, 0.46],
  [0.56, 0.68],
  [0.76, 0.86],
];

type Cam = { cx: number; cy: number; s: number };

/** Camera at each stop for a stage of W × H: a world rect fitted at 90% × 82%, never above 1. */
function stops(world: World, W: number, H: number, phone: boolean): Cam[] {
  return world.stops.map(([x, y, w, h], i) => {
    const s = Math.min(1, (W * 0.9) / w, (H * 0.82) / h);
    let cx = x + w / 2;
    let cy = y + h / 2;
    if (i === 0 && !phone) cx = 1000; // the board sits right of the title
    if (i === 0 && phone) cy = world.h / 2 - (0.225 * H) / s; // the board fills the lower part
    return { cx, cy, s };
  });
}

function cameraAt(p: number, cams: Cam[]): { cam: Cam; moving: boolean } {
  let from = 0;
  for (let i = 0; i < MOVES.length; i++) {
    const [a, b] = MOVES[i];
    if (p < a) break;
    if (p < b) {
      const t = smoothstep(seg(p, a, b));
      const A = cams[i];
      const B = cams[i + 1];
      // Zoom interpolates in log space so it feels even.
      const s = Math.exp(Math.log(A.s) + (Math.log(B.s) - Math.log(A.s)) * t);
      return { cam: { cx: A.cx + (B.cx - A.cx) * t, cy: A.cy + (B.cy - A.cy) * t, s }, moving: true };
    }
    from = i + 1;
  }
  return { cam: cams[from], moving: false };
}

/** Per cluster: unlit, visited (0.6) or lit; everything lights at the converge beat. */
function litLevels(b: number): [number, number, number] {
  return [0, 1, 2].map((k) => (b >= CONVERGE ? 1 : b === 2 * k + 1 ? 1 : b > 2 * k + 1 ? 0.6 : 0)) as [number, number, number];
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** One board (desktop or phone world) with its camera. */
function LiveBoard({ world, phone, b }: { world: World; phone: boolean; b: number }) {
  const board = useRef<HTMLDivElement>(null);
  const size = useRef({ W: 0, H: 0 });
  const last = useRef(0);
  const moving = useRef<boolean | null>(null);

  const place = (p: number) => {
    last.current = p;
    const el = board.current;
    const { W, H } = size.current;
    if (!el || !W || !H) return;
    const { cam, moving: m } = cameraAt(p, stops(world, W, H, phone));
    const tx = W / 2 - cam.cx * cam.s;
    const ty = H / 2 - cam.cy * cam.s;
    el.style.transform = `translate3d(${r2(tx)}px,${r2(ty)}px,0) scale(${Math.round(cam.s * 10000) / 10000})`;
    // A will-change layer keeps its raster scale; drop it at rest so text re-rasters crisply.
    if (m !== moving.current) {
      moving.current = m;
      el.style.willChange = m ? "transform" : "auto";
    }
  };
  const frame = useMeasure<HTMLDivElement>((el) => {
    size.current = { W: el.clientWidth, H: el.clientHeight };
    place(last.current);
  });
  useSceneProgress(place);

  // Before hydration: an overview of the world (CSS fit), replaced on mount.
  const fit = phone ? 0.3 : 0.4;
  const initial: CSSProperties = {
    transform: `translate3d(calc(50vw - ${world.w / 2}px * ${fit}), calc((100svh - 4.5rem) / 2 - ${world.h / 2}px * ${fit}), 0) scale(${fit})`,
  };

  return (
    <div ref={frame} className={`absolute inset-0 ${phone ? "md:hidden" : "hidden md:block"}`}>
      <div className={`absolute inset-0 transition-opacity duration-[400ms] ${b >= BRIEF ? "opacity-[0.28]" : "opacity-100"}`}>
        <BoardWorld ref={board} world={world} lit={litLevels(b)} converge={b >= CONVERGE} style={initial} />
      </div>
    </div>
  );
}

function LiveScene() {
  const bRaw = useSceneBeat(BEATS);
  const still = useSceneStill();
  // Server HTML (still) for the live layout is the first frame, p = 0.
  const b = still ? 0 : bRaw;

  const intro = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  useSceneProgress((p) => {
    const t = seg(p, 0.05, 0.14);
    const o = String(r2(1 - t));
    if (intro.current) {
      intro.current.style.opacity = o;
      intro.current.style.transform = `translate3d(0,${r2(-24 * t)}px,0)`;
    }
    if (scrim.current) scrim.current.style.opacity = o;
  });

  const caption = b >= 1 && b <= 5 && b % 2 === 1 ? (b - 1) / 2 : null;
  const visited = (k: number) => b >= 2 * k + 1;

  return (
    <div className="relative h-full">
      <LiveBoard world={DESKTOP_WORLD} phone={false} b={b} />
      <LiveBoard world={PHONE_WORLD} phone b={b} />

      {/* Hero scrim: the title reads over the board; fades with it */}
      <div ref={scrim} data-scrub aria-hidden="true" className="research-scrim pointer-events-none absolute inset-0" />

      {/* Title block + status, scrubbed out as the camera starts */}
      <div ref={intro} data-scrub className="pointer-events-none absolute inset-0">
        <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col px-5 pt-8 sm:px-8 md:justify-center md:pt-0">
          <PageHeroTitle eyebrow={C.hero.eyebrow} title={agent.headline} line={agent.line} align="left" className="max-w-[30rem] md:[&_h1]:max-w-[30rem]" />
        </div>
        <span className="tag absolute right-4 top-4">
          <span className="live-dot" aria-hidden="true" />
          {agent.status}
        </span>
      </div>

      {/* Caption bar */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 bottom-4 md:inset-x-auto md:bottom-6 md:left-6">
        <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
          {C.stops.map((s, k) => (
            <p
              key={s.name}
              className={`card flex items-center gap-3 rounded-[14px]! bg-panel px-4 py-2.5 transition-[opacity,transform] duration-200 md:rounded-full! ${
                caption === k ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
              }`}
            >
              <span className="text-[0.75rem] tabular-nums text-brand-300">0{k + 1}</span>
              <span className="text-[0.875rem] text-fg">{s.caption}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Stop dots: a minimap of where the camera is (desktop) */}
      <ol aria-hidden="true" className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 rounded-[16px] bg-bg/80 px-3.5 py-3 md:flex">
        {C.stops.map((s, k) => {
          const on = visited(k);
          return (
            <li key={s.name} className="flex items-center justify-end gap-2.5 text-[0.75rem]">
              <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
                <span className={`text-fg-3 transition-opacity duration-200 ${on ? "opacity-0" : "opacity-100"}`}>{s.name}</span>
                <span className={`text-fg transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`}>{s.name}</span>
              </span>
              <span className="relative h-1.5 w-1.5 rounded-full bg-ink/25">
                <span className={`absolute inset-0 rounded-full bg-brand-400 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} />
              </span>
            </li>
          );
        })}
      </ol>

      {/* The brief lands in the centre */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-4 transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          b >= BRIEF ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-[0.97] opacity-0"
        }`}
      >
        <p aria-hidden="true" className="text-center font-display text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-[1.05] tracking-[-0.04em] text-fg">
          {C.brief.headline}
        </p>
        <div aria-hidden="true" className="mt-6 w-[min(540px,100%)]">
          <BriefCard on={b >= BRIEF} still={false} />
        </div>
      </div>
    </div>
  );
}

/** The static frame: the title, the board as a figure, the three captions, the brief. */
function StillScene() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-8 sm:py-16">
      <div className="flex flex-col items-start gap-5">
        <PageHeroTitle eyebrow={C.hero.eyebrow} title={agent.headline} line={agent.line} align="left" />
        <span className="tag">
          <span className="live-dot" aria-hidden="true" />
          {agent.status}
        </span>
      </div>
      <div aria-hidden="true" className="relative mt-12 aspect-[8/5] w-full overflow-hidden [--board-fit:0.15] md:[--board-fit:0.3] lg:[--board-fit:0.4] xl:[--board-fit:0.5]">
        <BoardWorld
          world={DESKTOP_WORLD}
          lit={[1, 1, 1]}
          converge
          placeholder={false}
          style={{ left: "50%", top: "50%", transformOrigin: "center", transform: "translate(-50%, -50%) scale(var(--board-fit))" }}
        />
      </div>
      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {C.stops.map((s, k) => (
          <li key={s.name} className="card flex gap-3 px-4 py-3">
            <span className="text-[0.75rem] tabular-nums text-brand-300">0{k + 1}</span>
            <span className="text-[0.875rem] text-fg">{s.caption}</span>
          </li>
        ))}
      </ol>
      <div className="mx-auto mt-16 flex max-w-[540px] flex-col items-center">
        <p className="text-center font-display text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-[1.05] tracking-[-0.04em] text-fg">
          {C.brief.headline}
        </p>
        <div className="mt-6 w-full">
          <BriefCard on still />
        </div>
      </div>
    </div>
  );
}

/** For assistive tech in both modes: each stop's caption and cards, then the brief. */
function ScreenReaderBoard() {
  return (
    <div className="sr-only">
      {C.stops.map((s, k) => (
        <section key={s.name} aria-label={s.name}>
          <p>{s.caption}</p>
          {s.chip && <p>{s.chip}</p>}
          <ul>
            {CARDS.filter((c) => c.cluster === k).map((c) => (
              <li key={c.id}>
                {c.tag}: {c.text}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section aria-label={C.brief.label}>
        <p>{C.brief.headline}</p>
        <p>
          {C.brief.title}. {C.brief.finding} {C.brief.evidence} {C.brief.evidenceLabel}:{" "}
          {C.brief.breakdown.map((s) => `${s.n} ${s.label}`).join(", ")}. {C.brief.confidence}. {C.brief.sources.join(", ")}. {C.brief.footer}.
        </p>
      </section>
    </div>
  );
}

export function ResearchScene() {
  return (
    <StickyScene id="board" length={4.6} label={agent.headline}>
      <ScreenReaderBoard />
      <div className="scene-live-only h-full">
        <LiveScene />
      </div>
      <div className="scene-still-only">
        <StillScene />
      </div>
    </StickyScene>
  );
}
