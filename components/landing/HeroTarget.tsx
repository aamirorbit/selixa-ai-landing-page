"use client";

import { useEffect, useRef } from "react";

/**
 * Tells the hero stage where the full stop of "chaos." sits, as `--tx` / `--ty` in px from
 * the stage's corner, so every fragment flies into the dot. Uses layout offsets, not
 * getBoundingClientRect, so the letters' own settle animation doesn't skew the target.
 * Until it runs, globals.css aims at the headline's rough centre.
 */
export function HeroTarget() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = ref.current?.parentElement;
    const section = stage?.parentElement;
    const dot = section?.querySelector<HTMLElement>("[data-chaos-dot]");
    if (!stage || !section || !dot) return;

    const place = () => {
      // The glyph sits on the baseline, low and a touch right in its box (tight tracking)
      let x = dot.offsetWidth * 0.58;
      let y = dot.offsetHeight * 0.85;
      for (let el: HTMLElement | null = dot; el && el !== section; el = el.offsetParent as HTMLElement | null) {
        x += el.offsetLeft;
        y += el.offsetTop;
      }
      stage.style.setProperty("--tx", `${Math.round(x)}px`);
      stage.style.setProperty("--ty", `${Math.round(y)}px`);
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(section);
    return () => ro.disconnect();
  }, []);

  return <span ref={ref} hidden />;
}
