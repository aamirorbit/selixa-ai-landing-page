/**
 * The engagement, drawn: concentric rings with a slow sweep, and the three
 * stages of a Selixa deployment plotted at increasing radius. Decorative.
 */
const C = 240;
const RINGS = [64, 124, 184, 232];
const NODES = [
  { r: 64, deg: -38, label: "Embedded" },
  { r: 124, deg: 32, label: "In production" },
  { r: 184, deg: 138, label: "Owned", pulse: true },
];

const pt = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};

export function DeploymentDiagram({ className = "" }: { className?: string }) {
  const outer = RINGS[RINGS.length - 1];
  return (
    <svg
      viewBox="0 0 480 480"
      aria-hidden="true"
      className={`font-sans ${className}`}
      style={{ maskImage: "radial-gradient(circle at 50% 50%, #000 63%, transparent 80%)" }}
    >
      <defs>
        <linearGradient id="sweep-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--color-brand-400)", stopOpacity: 0.28 }} />
          <stop offset="1" style={{ stopColor: "var(--color-brand-400)", stopOpacity: 0 }} />
        </linearGradient>
        <radialGradient id="node-glow">
          <stop offset="0" style={{ stopColor: "var(--color-brand-300)", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "var(--color-brand-500)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Crosshair */}
      <line x1={C} y1={C - outer} x2={C} y2={C + outer} stroke="#fff" strokeOpacity="0.05" strokeDasharray="2 6" />
      <line x1={C - outer} y1={C} x2={C + outer} y2={C} stroke="#fff" strokeOpacity="0.05" strokeDasharray="2 6" />

      {/* Rings */}
      {RINGS.map((r, i) => (
        <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="#fff" strokeOpacity={0.11 - i * 0.018} />
      ))}

      {/* Ticks on the outer ring */}
      {Array.from({ length: 72 }, (_, i) => {
        const major = i % 18 === 0;
        const a = pt(outer, i * 5);
        const b = pt(outer - (major ? 10 : 4), i * 5);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            style={{ stroke: major ? "var(--color-brand-300)" : "#fff", strokeOpacity: major ? 0.5 : 0.14 }}
          />
        );
      })}

      {/* Sweep */}
      <g className="sweep" style={{ transformOrigin: "50% 50%", transformBox: "view-box" }}>
        <path
          d={`M ${C} ${C} L ${C} ${C - outer} A ${outer} ${outer} 0 0 1 ${pt(outer, 46).x} ${pt(outer, 46).y} Z`}
          fill="url(#sweep-fill)"
          transform={`rotate(-46 ${C} ${C})`}
        />
        <line x1={C} y1={C} x2={C} y2={C - outer} style={{ stroke: "var(--color-brand-300)", strokeOpacity: 0.55 }} />
      </g>

      {/* Center */}
      <circle cx={C} cy={C} r={3} fill="#fff" fillOpacity="0.8" />
      <circle cx={C} cy={C} r={9} fill="none" stroke="#fff" strokeOpacity="0.25" />

      {/* Stages */}
      {NODES.map(({ r, deg, label, pulse }) => {
        const p = pt(r, deg);
        const right = p.x >= C;
        return (
          <g key={label}>
            {pulse && (
              <circle
                className="node-pulse"
                cx={p.x}
                cy={p.y}
                r={6}
                fill="none"
                style={{ stroke: "var(--color-brand-300)", strokeOpacity: 0.6, transformOrigin: `${p.x}px ${p.y}px` }}
              />
            )}
            <circle cx={p.x} cy={p.y} r={18} fill="url(#node-glow)" />
            <circle cx={p.x} cy={p.y} r={3.5} style={{ fill: pulse ? "var(--color-brand-200)" : "var(--color-brand-400)" }} />
            <text
              x={p.x + (right ? 14 : -14)}
              y={p.y + 4}
              textAnchor={right ? "start" : "end"}
              fontSize="12"
              fill={pulse ? "#f5f5f7" : "#b9b9c2"}
              letterSpacing="0.02em"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
