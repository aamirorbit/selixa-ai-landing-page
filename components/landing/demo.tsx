"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Types `text` out while `on`, and clears it when `on` goes false. The full
 * text sits underneath invisibly, so typing never shifts the layout.
 */
export function Typed({ text, on, still, cps = 38 }: { text: string; on: boolean; still?: boolean; cps?: number }) {
  // Mounted mid-demo, start empty; server-rendered (still), start complete.
  const [n, setN] = useState(() => (still ? text.length : 0));

  useEffect(() => {
    if (still) return;
    // Reset while hidden, so the next play starts from nothing.
    if (!on) {
      const t = window.setTimeout(() => setN(0));
      return () => window.clearTimeout(t);
    }
    let v = 0;
    const id = window.setInterval(() => {
      v = Math.min(text.length, v + 1);
      setN(v);
      if (v >= text.length) window.clearInterval(id);
    }, 1000 / cps);
    return () => window.clearInterval(id);
  }, [on, still, text, cps]);

  const shown = on || still ? n : 0;
  const typing = on && !still && shown < text.length;
  return (
    <span className="relative block">
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0">
        {text.slice(0, shown)}
        {typing && <span className="caret" aria-hidden="true" />}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

/** Counts from 0 up to `to` while `on`. */
export function Count({ to, on, still, ms = 900 }: { to: number; on: boolean; still?: boolean; ms?: number }) {
  const [v, setV] = useState(() => (still ? to : 0));

  useEffect(() => {
    if (still) return;
    if (!on) {
      const t = window.setTimeout(() => setV(0));
      return () => window.clearTimeout(t);
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, still, to, ms]);

  return <>{on || still ? v : 0}</>;
}

/** A piece of a demo that fades up into place when `on`. */
export function Stage({
  on,
  as: Tag = "div",
  className = "",
  style,
  children,
}: {
  on: boolean;
  as?: "div" | "li" | "span" | "p";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag data-on={on} className={`st ${className}`} style={style}>
      {children}
    </Tag>
  );
}
