"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Orb, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { TumbleWord } from "./TumbleWord";

export type Scrap = {
  text: string;
  /** Position in % of the stage. */
  x: number;
  y: number;
  /** Static rotation (deg). */
  r: number;
  /** Hidden below md. */
  wide?: boolean;
  /** Phone position (top/bottom bands), used when the scrap is one of the first `phoneScraps`. */
  phone?: { x: number; y: number };
};

/** Scraps of product work, scattered around the orb (the home page's close). */
export const HOME_SCRAPS: Scrap[] = [
  { text: "#product-feedback", x: 12, y: 8, r: -8, phone: { x: 22, y: 6 } },
  { text: "PR #482 merged", x: 80, y: 4, r: 6, phone: { x: 76, y: 12 } },
  { text: "Activation −8%", x: 86, y: 34, r: -5, phone: { x: 70, y: 90 } },
  { text: "Pricing?", x: 11, y: 38, r: 7, phone: { x: 18, y: 18 } },
  { text: "Q4 roadmap · 3 blocked", x: 80, y: 62, r: 4, wide: true },
  { text: "Churn risk · Acme", x: 13, y: 72, r: -6, phone: { x: 28, y: 94 } },
  { text: "Onboarding PRD v3", x: 20, y: 92, r: 5, wide: true },
  { text: "32 new notes", x: 84, y: 88, r: -7, phone: { x: 80, y: 82 } },
  { text: "Weekly sync", x: 24, y: 20, r: 9, wide: true },
  { text: "Sprint 42", x: 70, y: 16, r: -9, wide: true },
  { text: "Interview · Maya", x: 66, y: 96, r: 7, wide: true },
  { text: "Ship on the 14th?", x: 30, y: 58, r: -4, wide: true },
];

type ChaosToOrderProps = {
  /** Rendered as is, before the tumbling word (home: "stop building" <br/> "in"). */
  lead: ReactNode;
  /** The word that tumbles into place. */
  word: string;
  /** The full sentence, for the heading's aria-label. */
  label: string;
  as?: "h1" | "h2";
  /** Above the orb (e.g. an eyebrow pill). */
  eyebrow?: ReactNode;
  /** "section": the home close; "screen": fills the first screen, content centred. */
  size?: "section" | "screen";
  scraps?: Scrap[];
  /** How many scraps show below sm (at their `phone` positions). Home 0. */
  phoneScraps?: number;
  /** Loop the whole sequence (home) or play once and hold (about). Default true. */
  loop?: boolean;
  orbSize?: number;
  /** Classes for the heading (size, leading). */
  titleClassName?: string;
  /** Under the heading; a function gets the sequence state (e.g. to pulse the CTA on the hold). */
  after?: ReactNode | ((state: { done: boolean; still: boolean }) => ReactNode);
  /** ms before the chaos starts (when on screen at load). */
  delayStart?: number;
  /** Marks this section as where the header tucks away (see components/Nav.tsx). */
  hidesNav?: boolean;
};

/**
 * Chaos to order: scraps of product work drift around the orb, get pulled into it, and the last
 * word of the headline tumbles into place. Scraps move by transform only (a stage-sized layer
 * translated toward the orb), with no backdrop blur. The server renders the settled frame.
 */
export function ChaosToOrder({
  lead,
  word,
  label,
  as: H = "h2",
  eyebrow,
  size = "section",
  scraps = HOME_SCRAPS,
  phoneScraps = 0,
  loop = true,
  orbSize = 72,
  titleClassName = "text-[clamp(3rem,7.4vw,6.5rem)] leading-[0.95] tracking-[-0.055em]",
  after,
  delayStart = 0,
  hidesNav = false,
}: ChaosToOrderProps) {
  const lead0 = delayStart ? 1 : 0;
  //                       [wait]        chaos pull settle hold
  const script = [...(delayStart ? [delayStart] : []), 1300, 800, 500, 4000];
  const PULL = lead0 + 1;
  const SETTLE = lead0 + 2;
  const DONE = lead0 + 3;
  const { ref, step, still } = useSequence<HTMLElement>(script, { loop });
  const pulled = still || step >= PULL;
  const ordered = still || step >= SETTLE;
  const done = still || step === DONE;

  // Where the orb's centre sits in the scrap stage (px from its top), so pulled scraps land on it.
  const stage = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const s = stage.current;
    const o = orb.current;
    if (!s || !o) return;
    const ro = new ResizeObserver(() => {
      const sr = s.getBoundingClientRect();
      const or = o.getBoundingClientRect();
      s.style.setProperty("--oy", `${Math.round(or.top + or.height / 2 - sr.top)}px`);
    });
    ro.observe(s);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-hide-nav={hidesNav || undefined}
      className={`relative overflow-hidden ${size === "screen" ? "flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-20" : "py-28 sm:py-36 lg:py-44"}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="aspect-square w-[min(110vw,60rem)] rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.1),transparent_65%)]" />
        <div className="absolute aspect-square w-[min(90vw,44rem)] rounded-full border border-ink/[0.05]" />
        <div className="spin-slow absolute aspect-square w-[min(70vw,34rem)] rounded-full border border-dashed border-ink/[0.06]" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        {/* The scraps: a stage the size of the content (plus bands above and below) */}
        <div ref={stage} aria-hidden="true" className="pointer-events-none absolute inset-x-0 -inset-y-16" style={{ "--oy": "100px" } as CSSProperties}>
          {scraps.map((f, i) => {
            const onPhone = i < phoneScraps && f.phone;
            const vars = {
              "--x": `${f.x}%`,
              "--y": `${f.y}%`,
              "--px": `${onPhone ? f.phone!.x : f.x}%`,
              "--py": `${onPhone ? f.phone!.y : f.y}%`,
              transform: pulled ? "translate(calc(50% - var(--sx)), calc(var(--oy) - var(--sy)))" : "none",
              transitionDelay: pulled && !still ? `${i * 25}ms` : "0ms",
            } as CSSProperties;
            return (
              <span
                key={f.text}
                className={`scrap absolute inset-0 transition-transform duration-[750ms] ease-[cubic-bezier(0.7,0,0.2,1)] ${
                  f.wide ? "max-md:hidden" : ""
                } ${onPhone ? "" : "max-sm:hidden"}`}
                style={vars}
              >
                <span
                  className="absolute transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(0.7,0,0.2,1)]"
                  style={{
                    left: "var(--sx)",
                    top: "var(--sy)",
                    opacity: pulled ? 0 : 1,
                    transform: `translate(-50%, -50%) scale(${pulled ? 0.2 : 1})`,
                    transitionDelay: pulled && !still ? `${i * 25}ms` : "0ms",
                  }}
                >
                  <span
                    className="drift tag block bg-panel font-mono text-[0.75rem] text-fg-3"
                    style={{ rotate: `${f.r}deg`, animationDelay: `${-i * 0.7}s`, animationDuration: `${6 + (i % 4)}s` }}
                  >
                    {f.text}
                  </span>
                </span>
              </span>
            );
          })}
        </div>

        {eyebrow}

        <div ref={orb} data-reveal className={`relative ${eyebrow ? "mt-10" : ""}`}>
          <div className={`transition-transform duration-700 ${!still && step === PULL ? "scale-125" : "scale-100"}`}>
            <span className="max-sm:hidden">
              <Orb size={orbSize} />
            </span>
            <span className="sm:hidden">
              <Orb size={Math.round(orbSize * 0.8)} />
            </span>
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-[-120%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.55),transparent_60%)] transition-opacity duration-700 ${
              !still && (step === PULL || step === SETTLE) ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <H data-reveal style={d(80)} className={`relative mt-10 font-display font-light text-fg ${titleClassName}`} aria-label={label}>
          <span aria-hidden="true">
            {lead}
            <TumbleWord text={word} settled={ordered} still={still} ink="chaos" />
          </span>
        </H>

        {typeof after === "function" ? after({ done, still }) : after}
      </div>
    </section>
  );
}
