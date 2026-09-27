import type { BrandLogo } from "./logos";

/** An integration's mark: monochrome at rest, the brand's own colour when lit. */
export function BrandMark({ logo, lit, className = "h-6 w-6" }: { logo: BrandLogo; lit: boolean; className?: string }) {
  return (
    <svg
      viewBox={logo.viewBox}
      role="img"
      aria-label={logo.name}
      className={`transition-colors duration-700 ${className}`}
      style={{ color: lit ? logo.color : "var(--color-fg-2)" }}
      fill="currentColor"
    >
      {logo.paths.map((p) => (
        <path key={p.d.slice(0, 24)} d={p.d} fill={lit ? p.fill : p.rest} className="transition-[fill] duration-700" />
      ))}
    </svg>
  );
}
