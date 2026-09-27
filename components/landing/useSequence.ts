"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drives a looping, scripted product demo: `step` walks 0 → durations.length - 1,
 * holding each step for its duration, then starts over. It only runs while the
 * element is on screen.
 *
 * The server renders the finished frame, so without JavaScript (or with reduced
 * motion) the demo simply shows its end state.
 */
export function useSequence<T extends HTMLElement = HTMLDivElement>(durations: number[]) {
  const ref = useRef<T>(null);
  const last = durations.length - 1;
  const [step, setStep] = useState(last);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(true);
  const timings = durations.join(",");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStill(false);
    setStep(0);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (still || !visible) return;
    const holds = timings.split(",").map(Number);
    const t = window.setTimeout(() => setStep((s) => (s >= last ? 0 : s + 1)), holds[step]);
    return () => window.clearTimeout(t);
  }, [still, visible, step, last, timings]);

  return { ref, step, still };
}
