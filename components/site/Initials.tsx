/** A round initials avatar at any size (the home `Avatar` is fixed at 28px). Decorative. */
export function Initials({ name, size = 28, className = "" }: { name: string; size?: number; className?: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border border-line-strong bg-panel-2 text-fg-2 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}
