"use client";

import { ConversationCTA } from "@/components/ConversationCTA";
import { Orb, d } from "./ui";
import { useSequence } from "./useSequence";

/** Scraps of product work, scattered around the close. `x`/`y` are % of the stage. */
const FRAGMENTS = [
  { text: "#product-feedback", x: 12, y: 8, r: -8 },
  { text: "PR #482 merged", x: 80, y: 4, r: 6 },
  { text: "Activation −8%", x: 86, y: 34, r: -5 },
  { text: "Pricing?", x: 11, y: 38, r: 7 },
  { text: "Q4 roadmap · 3 blocked", x: 80, y: 62, r: 4, wide: true },
  { text: "Churn risk · Acme", x: 13, y: 72, r: -6 },
  { text: "Onboarding PRD v3", x: 20, y: 92, r: 5, wide: true },
  { text: "32 new notes", x: 84, y: 88, r: -7 },
  { text: "Weekly sync", x: 24, y: 20, r: 9, wide: true },
  { text: "Sprint 42", x: 70, y: 16, r: -9, wide: true },
  { text: "Interview · Maya", x: 66, y: 96, r: 7, wide: true },
  { text: "Ship on the 14th?", x: 30, y: 58, r: -4, wide: true },
];

/** Where each letter of "chaos." sits while it's still chaos: [x em, y em, deg]. */
const SCATTER: [number, number, number][] = [
  [0.1, -0.18, -14],
  [0.05, 0.22, 11],
  [-0.04, -0.3, -9],
  [0.1, 0.16, 16],
  [-0.08, -0.12, -12],
  [0.14, 0.26, 20],
];
// Left to right through the crimson ramp, so the settled word reads as one gradient.
const INK = [0, 1, 2, 3, 4, 5].map((i) => `var(--chaos-${i})`);

//             chaos  pull  settle  hold
const SCRIPT = [1300, 800, 500, 4000];
const PULL = 1;
const SETTLE = 2;
const DONE = SCRIPT.length - 1;

export function FinalCTA() {
  const { ref, step, still } = useSequence<HTMLElement>(SCRIPT);
  const pulled = still || step >= PULL;
  const ordered = still || step >= SETTLE;

  return (
    <section ref={ref} className="relative overflow-hidden py-28 sm:py-36 lg:py-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="aspect-square w-[min(110vw,60rem)] rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.1),transparent_65%)]" />
        <div className="absolute aspect-square w-[min(90vw,44rem)] rounded-full border border-ink/[0.05]" />
        <div className="spin-slow absolute aspect-square w-[min(70vw,34rem)] rounded-full border border-dashed border-ink/[0.06]" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        {/* The chaos: scraps drifting around, pulled into Selixa */}
        {/* Phones keep only the tumbling letters; the scraps would sit on the button. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -inset-y-16 hidden sm:block">
          {FRAGMENTS.map((f, i) => (
            <span
              key={f.text}
              className={`absolute transition-[left,top,opacity,transform] duration-[750ms] ease-[cubic-bezier(0.7,0,0.2,1)] ${
                f.wide ? "hidden md:block" : ""
              }`}
              style={{
                left: pulled ? "50%" : `${f.x}%`,
                top: pulled ? "calc(2.5rem + 36px)" : `${f.y}%`,
                opacity: pulled ? 0 : 1,
                transform: `translate(-50%, -50%) scale(${pulled ? 0.2 : 1})`,
                transitionDelay: pulled && !still ? `${i * 25}ms` : "0ms",
              }}
            >
              <span
                className="drift tag block bg-bg/80 font-mono text-[0.75rem] text-fg-3 backdrop-blur"
                style={{ rotate: `${f.r}deg`, animationDelay: `${-i * 0.7}s`, animationDuration: `${6 + (i % 4)}s` }}
              >
                {f.text}
              </span>
            </span>
          ))}
        </div>

        <div data-reveal className="relative">
          <div className={`transition-transform duration-700 ${!still && step === PULL ? "scale-125" : "scale-100"}`}>
            <Orb size={72} />
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-[-120%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.55),transparent_60%)] transition-opacity duration-700 ${
              !still && (step === PULL || step === SETTLE) ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <h2
          data-reveal
          style={d(80)}
          className="relative mt-10 font-display text-[clamp(3rem,7.4vw,6.5rem)] font-light leading-[0.95] tracking-[-0.055em] text-fg"
          aria-label="stop building in chaos."
        >
          <span aria-hidden="true">
            stop building
            <br />
            <span style={{ color: "var(--chaos-in)" }}>{"in\u00a0"}</span>
            {"chaos.".split("").map((ch, i) => {
              const [x, y, deg] = SCATTER[i];
              return (
                <span
                  key={i}
                  className="inline-block transition-transform duration-[550ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    color: INK[i],
                    transform: ordered ? "none" : `translate(${x}em, ${y}em) rotate(${deg}deg)`,
                    transitionDelay: ordered && !still ? `${i * 30}ms` : "0ms",
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        </h2>


        <div data-reveal style={d(160)} className="relative mt-14 flex w-full justify-center">
          <ConversationCTA variant="site" label="Get started" className={!still && step === DONE ? "cta-live" : ""} />
        </div>
      </div>
    </section>
  );
}
