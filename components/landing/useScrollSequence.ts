"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useSequence's scroll twin: same script, same `{ ref, step, still }`, but `step` follows
 * the scroll position instead of a clock. The demo starts as the element's top passes 90%
 * of the viewport and reaches its last step after another `distance` viewports (default
 * 0.5), so it finishes while the element is in full view. Scrolling back rewinds it.
 * Each step's share of that distance is its duration's share of the script, so the pacing
 * matches the timed version; the last duration (the hold) only marks the end.
 *
 * A fast scroll doesn't skip frames: the shown step walks toward the scrolled-to one a step
 * at a time (STEP_MS apart), so every beat of the demo still plays.
 *
 * The server renders the finished frame, and reduced motion keeps it.
 */
const STEP_MS = 110;

export function useScrollSequence<T extends HTMLElement = HTMLDivElement>(durations: number[], opts: { distance?: number } = {}) {
  const distance = opts.distance ?? 0.5;
  const ref = useRef<T>(null);
  const last = durations.length - 1;
  const [step, setStep] = useState(last);
  const [still, setStill] = useState(true);
  const timings = durations.join(",");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Where each step starts, as a fraction 0…1 of the scroll distance.
    const holds = timings.split(",").map(Number).slice(0, -1);
    const total = holds.reduce((a, b) => a + b, 0) || 1;
    const starts: number[] = [];
    holds.reduce((acc, h) => (starts.push(acc / total), acc + h), 0);
    starts.push(1);

    // `shown` walks toward `target` one step per STEP_MS.
    let target = 0;
    let shown = -1;
    let timer = 0;
    const walk = () => {
      timer = 0;
      if (shown === target) return;
      shown += Math.sign(target - shown);
      setStep(shown);
      if (shown !== target) timer = window.setTimeout(walk, STEP_MS);
    };
    const measure = () => {
      const vh = window.innerHeight;
      const p = (vh * 0.9 - el.getBoundingClientRect().top) / (vh * distance);
      let s = 0;
      while (s < last && p >= starts[s + 1]) s++;
      target = p < 0 ? 0 : s;
      if (shown < 0) {
        // First measure: start where the page already is.
        shown = target;
        setStep(shown);
      } else if (!timer && shown !== target) walk();
    };

    setStill(false);
    measure();
    // Only listen while the element is near the viewport.
    let on = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !on) {
          on = true;
          window.addEventListener("scroll", measure, { passive: true });
          measure();
        } else if (!e.isIntersecting && on) {
          on = false;
          window.removeEventListener("scroll", measure);
          measure();
        }
      },
      { rootMargin: "25% 0px" },
    );
    io.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [timings, last, distance]);

  return { ref, step, still };
}
