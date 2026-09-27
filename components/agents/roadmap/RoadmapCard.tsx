import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react";
import type { SlotBoardItem } from "@/components/site/SlotBoard";
import { Initials } from "@/components/site/Initials";
import { CARDS, MOVED, ROADMAP_COPY, START, type RoadmapCard as Card } from "./copy";

/** The board's state after `b` beats of the scene (0 = start, 8 = every move applied). */
export function boardState(b: number) {
  return { onboarding: b >= 2, shipped: b >= 4, beta: b >= 6, dependency: b >= 8 };
}
export type BoardState = ReturnType<typeof boardState>;
export const FINAL: BoardState = boardState(8);

/** SlotBoard items for a board state. */
export function boardItems(s: BoardState): SlotBoardItem[] {
  return CARDS.map((c) => {
    const moved = (c.id === "onboarding" && s.onboarding) || (c.id === "beta" && s.beta);
    const at = moved ? MOVED[c.id] : START[c.id];
    return { id: c.id, col: at.col, slot: at.slot };
  });
}

export const cardById = (id: string) => CARDS.find((c) => c.id === id)!;

type Props = {
  card: Card;
  state: BoardState;
  /** The card is mid-move (lit layer). */
  moving?: boolean;
  /** Title only. */
  titleOnly?: boolean;
  /** "stack" (default): title above owner + tag; "row": one line, title left, tag + owner right (short cards). */
  layout?: "stack" | "row";
  className?: string;
};

/**
 * A roadmap card: title, owner, a tag slot. Every state is pre-rendered and cross-faded
 * (tags, moved marker, shipped), so a card never changes size mid-scene.
 */
export function RoadmapCardView({ card, state, moving, titleOnly, layout = "stack", className = "" }: Props) {
  const row = layout === "row";
  const moved = card.id === "onboarding" ? (state.onboarding ? "up" : null) : card.id === "beta" ? (state.beta ? "down" : null) : null;
  const tagAfter = card.id === "onboarding" ? state.onboarding : card.id === "csv" ? state.dependency : false;
  const shipped = card.id === "billing" && state.shipped;
  const show = (on: boolean) => (on ? "opacity-100" : "opacity-0");

  return (
    <div
      className={`card relative flex h-full overflow-hidden rounded-[12px]! bg-panel px-3.5 transition-[opacity,transform] duration-[400ms] ${
        row ? "flex-row items-center justify-between gap-3" : "flex-col justify-between py-3"
      } ${
        shipped ? "scale-[0.96] opacity-0" : card.id === "beta" && state.beta ? "opacity-80" : "opacity-100"
      } ${className}`}
      style={{ transitionDelay: shipped ? "500ms" : "0ms" }}
    >
      <span aria-hidden="true" className={`card-lit pointer-events-none absolute inset-0 rounded-[12px] border transition-opacity duration-300 ${show(!!moving)}`} />
      {/* Moved: a brand edge and an arrow toward where it went */}
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-0.5 bg-brand-400 transition-opacity duration-200 ${show(!!moved)}`} style={{ transitionDelay: moved ? "760ms" : "0ms" }} />
      <span aria-hidden="true" className={`absolute right-2.5 top-2.5 text-brand-300 transition-opacity duration-200 ${row ? "hidden" : ""} ${show(!!moved)}`} style={{ transitionDelay: moved ? "760ms" : "0ms" }}>
        {card.id === "beta" ? <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2} /> : <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />}
      </span>
      <span className={`relative min-w-0 truncate text-[0.875rem] text-fg md:text-[0.90625rem] ${row ? "flex-1" : "pr-5"}`}>{card.title}</span>
      {!titleOnly && (
        <span className={`relative flex min-w-0 items-center gap-2 ${row ? "shrink-0 flex-row-reverse" : ""}`}>
          {card.owner && <Initials name={card.owner} size={20} />}
          {(card.tag || card.id === "billing") && (
            <span className="grid min-w-0 justify-items-start [&>*]:col-start-1 [&>*]:row-start-1">
              {card.tag && (
                <span className={`tag h-5 min-w-0 px-2 py-0 text-[0.6875rem] transition-opacity duration-200 ${show(!tagAfter && !shipped)}`}>
                  <span className="truncate">{card.tag}</span>
                </span>
              )}
              {card.tagAfter && (
                <span className={`tag h-5 min-w-0 border-brand-400/30 bg-brand-500/10 px-2 py-0 text-[0.6875rem] text-brand-200 transition-opacity duration-200 ${show(tagAfter)}`}>
                  <span className="truncate">{card.tagAfter}</span>
                </span>
              )}
              {card.id === "billing" && (
                <span className={`tag h-5 border-brand-400/30 bg-brand-500/10 px-2 py-0 text-[0.6875rem] text-brand-200 transition-opacity duration-200 ${show(shipped)}`}>
                  <Check className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
                  {ROADMAP_COPY.board.shipped}
                </span>
              )}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/** Column head: Now in brand, the others quiet. */
export function ColumnHead({ id, label }: { id: string; label: string }) {
  return (
    <span className={`flex h-full items-center text-[0.75rem] uppercase tracking-[0.14em] ${id === "now" ? "text-brand-300" : "text-fg-3"}`}>{label}</span>
  );
}
