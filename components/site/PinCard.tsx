import type { ReactNode } from "react";

type PinCardKind = "quote" | "ticket" | "count" | "screenshot" | "note";

type PinCardProps = {
  kind: PinCardKind;
  /** Small-caps line on top, e.g. "Ticket · #4127". */
  tag: string;
  /** The body: quote text, ticket subject, a screenshot thumbnail, … */
  children: ReactNode;
  /** Default by kind: screenshot and ticket are taped, the rest pinned. */
  fasten?: "pin" | "tape";
  /** Static rotation in degrees. */
  rotate?: number;
  /** Brand ring (a pre-rendered layer; only its opacity changes): "the one that matters". */
  lit?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const BODY: Record<PinCardKind, string> = {
  quote: "text-[1rem] leading-[1.45] text-fg",
  ticket: "text-[0.875rem] leading-[1.45] text-fg",
  count: "text-[0.875rem] text-fg-2",
  screenshot: "",
  note: "text-[0.875rem] leading-[1.5] text-fg-2",
};

/**
 * A scrap of paper pinned or taped to a board: a tag line and a body. Paper, not UI:
 * radius 6, a soft drop shadow, a slight rotation.
 */
export function PinCard({ kind, tag, children, fasten, rotate = 0, lit, className = "", style }: PinCardProps) {
  const how = fasten ?? (kind === "screenshot" || kind === "ticket" ? "tape" : "pin");
  return (
    <div
      className={`pin-card relative rounded-[6px] border border-line p-4 ${className}`}
      style={{ ...style, rotate: rotate ? `${rotate}deg` : undefined }}
    >
      {lit != null && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-px rounded-[6px] border border-brand-400/60 shadow-[0_0_0_3px_rgb(var(--brand-500-rgb)/0.12)] transition-opacity duration-300 ${lit ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {how === "pin" ? (
        <span aria-hidden="true" className="absolute -top-[5px] left-1/2 grid h-2.5 w-2.5 -translate-x-1/2 place-items-center rounded-full bg-brand-500 shadow-[0_2px_4px_rgb(var(--shadow-rgb)/0.3)]">
          <span className="h-[3px] w-[3px] -translate-x-[1px] -translate-y-[1px] rounded-full bg-brand-200" />
        </span>
      ) : (
        <span aria-hidden="true" className="absolute -top-[9px] left-1/2 h-[18px] w-16 -translate-x-1/2 -rotate-[4deg] bg-ink/[0.07]" />
      )}
      <p className="text-[0.65625rem] uppercase tracking-[0.12em] text-fg-3">{tag}</p>
      <div className={`mt-2 ${BODY[kind]}`}>{children}</div>
    </div>
  );
}
