type TumbleWordProps = {
  /** "chaos.", "not found." */
  text: string;
  /** false = letters scattered, true = in place. */
  settled: boolean;
  /** No transitions (reduced motion / server frame). */
  still?: boolean;
  /** "chaos": the crimson ramp across the letters (home); "fg": plain text colour. */
  ink?: "chaos" | "fg";
  /** ms between letters. Default 30. */
  stagger?: number;
  /** Picks the scatter table for words longer than six letters. Default 0. */
  seed?: number;
};

/** The home page's scatter for the first six letters: [x em, y em, deg]. */
const BASE: [number, number, number][] = [
  [0.1, -0.18, -14],
  [0.05, 0.22, 11],
  [-0.04, -0.3, -9],
  [0.1, 0.16, 16],
  [-0.08, -0.12, -12],
  [0.14, 0.26, 20],
];

/** Deterministic scatter (no Math.random at render, so server and client agree). */
function scatter(i: number, seed: number): [number, number, number] {
  if (seed === 0 && i < BASE.length) return BASE[i];
  const k = i * 7 + seed * 13 + 3;
  const sign = i % 2 ? -1 : 1;
  const x = ((k * 37) % 29) / 100 - 0.14; // ±0.14em
  const y = sign * (((k * 53) % 31) / 100); // ±0.3em
  const r = sign * (6 + ((k * 17) % 15)); // ±20°
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100, r];
}

/**
 * A word whose letters tumble into place: scattered while `settled` is false, then each letter
 * settles with a slight overshoot (transform only). Spaces never move. Letters are aria-hidden;
 * the parent heading carries the accessible text (aria-label).
 */
export function TumbleWord({ text, settled, still, ink = "fg", stagger = 30, seed = 0 }: TumbleWordProps) {
  const chars = text.split("");
  const letters = chars.filter((c) => c !== " ").length;
  // Each character's index among the letters (spaces don't count).
  const letterIndex = chars.map((_, i) => chars.slice(0, i).filter((c) => c !== " ").length);
  return (
    <span aria-hidden="true">
      {chars.map((ch, i) => {
        if (ch === " ") return <span key={i}>{" "}</span>;
        const li = letterIndex[i];
        const [x, y, deg] = scatter(li, seed);
        const tone = ink === "chaos" ? `var(--chaos-${letters > 1 ? Math.round((li * 5) / (letters - 1)) : 0})` : undefined;
        return (
          <span
            key={i}
            className="inline-block transition-transform duration-[550ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
            style={{
              color: tone,
              transform: settled ? "none" : `translate(${x}em, ${y}em) rotate(${deg}deg)`,
              transitionDelay: settled && !still ? `${li * stagger}ms` : "0ms",
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}
