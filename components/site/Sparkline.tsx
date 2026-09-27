type SparklineProps = {
  data: number[];
  /** Box size in px (default 96 × 24). */
  width?: number;
  height?: number;
  /** From this index on, the line and end dot are brand-coloured (an anomaly). */
  highlightFrom?: number;
  /** Dot on the last point (default true). */
  endDot?: boolean;
  /** Stroke fg-3 ("muted", default) or fg-2. */
  tone?: "muted" | "default";
  className?: string;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * A tiny, decorative trend line (aria-hidden: the numbers beside it carry the meaning).
 * The SVG stretches to the box with a non-scaling 1.25px stroke; the end dot is HTML so it
 * stays round. No draw animation: it appears with its container.
 */
export function Sparkline({ data, width = 96, height = 24, highlightFrom, endDot = true, tone = "muted", className = "" }: SparklineProps) {
  // The domain spans at least ±8% of the mean, so a near-flat series reads as flat.
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const mean = data.reduce((a, v) => a + v, 0) / data.length;
  const span = Math.max(hi - lo, Math.abs(mean) * 0.16) || 1;
  const min = (lo + hi) / 2 - span / 2;
  const pad = 2; // keep the stroke and dot off the edges
  const pts = data.map((v, i) => ({
    x: r2((i / Math.max(1, data.length - 1)) * 100),
    y: r2(pad + (1 - (v - min) / span) * (100 - 2 * pad)),
  }));
  const path = (from: number, to: number) =>
    pts
      .slice(from, to + 1)
      .map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`)
      .join(" ");
  const hl = highlightFrom != null && highlightFrom < data.length - 1 ? highlightFrom : null;
  const last = pts[pts.length - 1];
  const base = tone === "muted" ? "stroke-fg-3" : "stroke-fg-2";

  return (
    <span aria-hidden="true" className={`relative inline-block shrink-0 ${className}`} style={{ width, height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        <path d={path(0, hl ?? pts.length - 1)} className={base} strokeWidth={1.25} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        {hl != null && (
          <path d={path(hl, pts.length - 1)} className="stroke-brand-400" strokeWidth={1.25} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        )}
      </svg>
      {endDot && (
        <span
          className={`absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full ${hl != null ? "bg-brand-400" : tone === "muted" ? "bg-fg-2" : "bg-fg"}`}
          style={{ left: `${last.x}%`, top: `${last.y}%` }}
        />
      )}
    </span>
  );
}
