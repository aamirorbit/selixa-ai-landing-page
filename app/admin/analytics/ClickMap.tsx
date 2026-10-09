"use client";

import { useEffect, useRef, useState } from "react";
import type { ClickPoint } from "@/lib/analytics";

const FRAME_HEIGHT = 900;

/**
 * The live page in a desktop-sized window (scaled to fit) that you scroll like the real thing,
 * with each desktop click drawn where it landed. The window is as wide as most of the clicks'
 * screens; x was recorded as a share of the viewport and y in page pixels, so clicks from other
 * widths, and on sections sized to the screen height, land close but not exact.
 * Not stretched to the full page: the site's sections size to the viewport, so a taller frame
 * only makes a taller page. The tracker switches itself off inside iframes.
 */
export function ClickMap({ path, points }: { path: string; points: ClickPoint[] }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const width = commonWidth(points);
  const [scale, setScale] = useState(0.5);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const onLoad = () => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    const sync = () => setScrollY(win.scrollY);
    win.addEventListener("scroll", sync, { passive: true });
    sync();
  };

  return (
    <div>
      <p className="mb-3 text-[0.8125rem] text-fg-3">
        {points.length.toLocaleString("en-US")} click{points.length === 1 ? "" : "s"} on <code>{path}</code>, shown at {width}px wide. Scroll inside
        the page to see clicks further down.
      </p>
      <div ref={box} className="relative overflow-hidden rounded-[12px] border border-line" style={{ height: FRAME_HEIGHT * scale }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width, height: FRAME_HEIGHT, transform: `scale(${scale})` }}>
          <iframe ref={frame} src={path} title={`Click map for ${path}`} onLoad={onLoad} className="block border-0" style={{ width, height: FRAME_HEIGHT }} />
          <svg className="pointer-events-none absolute inset-0" width={width} height={FRAME_HEIGHT} aria-hidden="true">
            <g transform={`translate(0 ${-scrollY})`}>
              {points.map((p, i) => (
                <circle key={i} cx={p.x * width} cy={p.y} r={12} fill="rgb(var(--brand-400-rgb) / 0.4)" stroke="rgb(255 255 255 / 0.6)" strokeWidth={1.5} />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

/** The viewport width most clicks came from, to the nearest 10px. */
function commonWidth(points: ClickPoint[]): number {
  const tally = new Map<number, number>();
  for (const p of points) if (p.vw) tally.set(Math.round(p.vw / 10) * 10, (tally.get(Math.round(p.vw / 10) * 10) ?? 0) + 1);
  let best = 1440;
  let n = 0;
  for (const [w, c] of tally) if (c > n) [best, n] = [w, c];
  return best;
}
