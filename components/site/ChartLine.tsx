"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * ChartLine: an SVG line chart with an HTML overlay layer for annotations.
 *
 *   <ChartLine data={…} yDomain={[29, 42]} height="min(48svh, 460px)" highlightFrom={6} ariaLabel="…">
 *     <MyCallouts />      // positioned with useChartScale()
 *   </ChartLine>
 *
 * The SVG uses a fixed 1000 × 400 viewBox stretched to the plot (non-scaling strokes), so it's
 * right at any width without measuring, including on the server. Labels and overlays are HTML
 * placed in %, never inside the stretched SVG. The plot box never changes size.
 *
 * Reveal "wipe" uncovers the line left → right with transforms only (an outer clip slides in
 * while its inner layer slides back). With `on` omitted it plays once on page load (after
 * `revealDelay`, CSS only); with `on` it follows that flag (e.g. a useSequence step).
 */

type Insets = { top: number; right: number; bottom: number; left: number };

type ChartLineProps = {
  /** Evenly spaced points. */
  data: number[];
  yDomain: [number, number];
  yTicks?: { value: number; label: string }[];
  xTicks?: { index: number; label: string }[];
  /** Fixed height (px or any CSS length); never animated. */
  height: number | string;
  /** From this index on, the line is drawn in the brand stroke. */
  highlightFrom?: number;
  /** Soft brand area under the highlighted part. */
  area?: "highlight" | "none";
  /** Dashed verticals at an index, with an optional label at their foot. */
  markers?: { index: number; label?: string; labelAt?: "top" | "bottom"; tone?: "neutral" | "brand"; className?: string; style?: CSSProperties }[];
  reveal?: "wipe" | "none";
  /** Default 1200. */
  revealMs?: number;
  /** Load-time delay for the wipe when `on` is omitted. */
  revealDelay?: number;
  /** Controlled reveal: plays when it turns true. Omit to play once on load. */
  on?: boolean;
  /** Finished frame (reduced motion / before a sequence starts). */
  still?: boolean;
  insets?: Partial<Insets>;
  /** Small y/x label size (px). Default 12. */
  labelSize?: number;
  ariaLabel: string;
  className?: string;
  /** Overlay: absolute, same box as the plot. */
  children?: ReactNode;
};

export type ChartScale = {
  n: number;
  /** Index → % from the plot's left edge. */
  x: (index: number) => number;
  /** Value → % from the plot's top edge. */
  y: (value: number) => number;
  /** Value at a fractional index (linear between points). */
  at: (index: number) => number;
  /** The plot's size in px (0 until measured) and px versions of x / y. */
  px: { w: number; h: number; x: (index: number) => number; y: (value: number) => number };
};

const ScaleContext = createContext<ChartScale | null>(null);

/** Inside ChartLine's children: map data to the plot box. */
export function useChartScale(): ChartScale {
  const s = useContext(ScaleContext);
  if (!s) throw new Error("useChartScale must be used inside <ChartLine>.");
  return s;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const DEFAULT_INSETS: Insets = { top: 12, right: 16, bottom: 28, left: 44 };

export function ChartLine({
  data,
  yDomain,
  yTicks = [],
  xTicks = [],
  height,
  highlightFrom,
  area = "none",
  markers = [],
  reveal = "none",
  revealMs = 1200,
  revealDelay = 0,
  on,
  still,
  insets: insetsProp,
  labelSize = 12,
  ariaLabel,
  className = "",
  children,
}: ChartLineProps) {
  const insets = { ...DEFAULT_INSETS, ...insetsProp };
  const gradient = useId().replace(/:/g, "");
  const plot = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = plot.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = data.length;
  const [y0, y1] = yDomain;
  const xPct = (i: number) => (i / Math.max(1, n - 1)) * 100;
  const yPct = (v: number) => (1 - (v - y0) / (y1 - y0)) * 100;
  const at = (i: number) => {
    const a = Math.max(0, Math.min(n - 1, Math.floor(i)));
    const b = Math.min(n - 1, a + 1);
    return data[a] + (data[b] - data[a]) * (i - a);
  };
  const scale: ChartScale = {
    n,
    x: xPct,
    y: yPct,
    at,
    px: { w: size.w, h: size.h, x: (i) => (xPct(i) / 100) * size.w, y: (v) => (yPct(v) / 100) * size.h },
  };

  // SVG space: 1000 × 400.
  const pts = data.map((v, i) => [r2(xPct(i) * 10), r2(yPct(v) * 4)] as const);
  const line = (from: number, to: number) =>
    pts
      .slice(from, to + 1)
      .map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`)
      .join(" ");
  const hl = highlightFrom != null && highlightFrom < n - 1 ? highlightFrom : null;
  const areaPath = hl != null ? `${line(hl, n - 1)} L${pts[n - 1][0]} 400 L${pts[hl][0]} 400 Z` : "";

  const wipeState = reveal !== "wipe" || still ? "true" : on === undefined ? "load" : String(on);
  const wipeStyle = { "--wipe-ms": `${revealMs}ms`, "--d": `${revealDelay}ms` } as CSSProperties;
  const label = { fontSize: labelSize };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div
        ref={plot}
        role="img"
        aria-label={ariaLabel}
        className="absolute"
        style={{ top: insets.top, right: insets.right, bottom: insets.bottom, left: insets.left }}
      >
        {/* Grid: dashed hairlines at the y ticks, a solid baseline */}
        {yTicks.map((t) => (
          <div key={t.value} aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-ink/[0.08]" style={{ top: `${r2(yPct(t.value))}%` }}>
            <span
              className="absolute right-full top-0 -translate-y-1/2 pr-2.5 tabular-nums text-fg-3"
              style={label}
            >
              {t.label}
            </span>
          </div>
        ))}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ink/[0.14]" />
        {xTicks.map((t) => (
          <span
            key={t.index}
            aria-hidden="true"
            className="absolute top-full mt-2 -translate-x-1/2 whitespace-nowrap tabular-nums text-fg-3"
            style={{ ...label, left: `${r2(xPct(t.index))}%`, transform: t.index === 0 ? "none" : t.index === n - 1 ? "translateX(-100%)" : undefined }}
          >
            {t.label}
          </span>
        ))}

        {/* Markers: dashed verticals */}
        {markers.map((m) => (
          <div
            key={m.index}
            aria-hidden="true"
            className={`absolute inset-y-0 border-l border-dashed ${m.tone === "brand" ? "border-brand-400/60" : "border-ink/25"} ${m.className ?? ""}`}
            style={{ left: `${r2(xPct(m.index))}%`, ...m.style }}
          >
            {m.label && (
              <span
                className={`absolute left-1.5 whitespace-nowrap text-[0.6875rem] ${m.labelAt === "top" ? "top-0" : "bottom-1.5"} ${m.tone === "brand" ? "text-brand-300" : "text-fg-3"}`}
              >
                {m.label}
              </span>
            )}
          </div>
        ))}

        {/* The line, uncovered by the wipe */}
        <div aria-hidden="true" className="absolute inset-0 overflow-clip">
          <div className="wipe-outer absolute inset-0 overflow-clip" data-on={wipeState} style={wipeStyle}>
            <div className="wipe-inner absolute inset-0" data-on={wipeState} style={wipeStyle}>
              <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
                {area === "highlight" && hl != null && (
                  <>
                    <defs>
                      <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" style={{ stopColor: "rgb(var(--brand-500-rgb))", stopOpacity: "var(--chart-area-a, 0.08)" }} />
                        <stop offset="1" style={{ stopColor: "rgb(var(--brand-500-rgb))", stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill={`url(#${gradient})`} />
                  </>
                )}
                <path
                  d={line(0, hl ?? n - 1)}
                  stroke="var(--color-fg-2)"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {hl != null && (
                  <path
                    d={line(hl, n - 1)}
                    className="chart-hl"
                    strokeWidth={1.75}
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>

        <ScaleContext.Provider value={scale}>{children}</ScaleContext.Provider>
      </div>
    </div>
  );
}
