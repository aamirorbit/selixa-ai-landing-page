"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True while the element is on screen (turning on `delay` ms after it arrives). Put the result
 * on the element as data-inview so CSS loops (lane packets) run only then.
 */
export function useInView<T extends HTMLElement>(delay = 600) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearTimeout(t);
      if (e.isIntersecting) t = window.setTimeout(() => setInView(true), delay);
      else setInView(false);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [delay]);
  return { ref, inView };
}
