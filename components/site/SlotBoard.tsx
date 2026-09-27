"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * SlotBoard: a board whose items sit in slots and move between them by transform only.
 *
 *   <SlotBoard
 *     columns={[{ id: "todo", slots: 5 }, { id: "doing", slots: 2 }, { id: "done", slots: 1, pile: true }]}
 *     items={tasks.map(t => ({ id: t.id, col: t.col, slot: t.slot }))}   // change these to move cards
 *     slotSize={{ main: 60, gap: 8 }}
 *     renderItem={(item, { moving, depth }) => <Card … />}
 *   />
 *
 * Why: moving cards by re-parenting them between column divs reflows the page (jank under
 * Lenis). Here the board's size is fixed by its slots, every item is absolutely positioned
 * with translate3d, and a move is a transform transition. Positions are pure CSS (container
 * query units), so the server HTML is already right; nothing is measured to place items.
 *
 * Geometry:
 * - axis "x": columns side by side (equal widths, `columnGap` apart), slots top to bottom;
 *   `slotsPerRow` cards side by side per row. Lanes (optional) stack below each other.
 * - axis "y": columns stacked top to bottom (phone boards), each `head` tall plus its rows.
 * - Pile columns: `slot` is the depth (0 = newest, on top); older items offset by
 *   `pileOffset` and scale down, fading beyond `pileDepth`.
 */

export type SlotBoardColumn = { id: string; label?: ReactNode; slots: number; pile?: boolean };
export type SlotBoardLane = { id: string; label?: ReactNode };
export type SlotBoardItem = {
  id: string;
  /** Column id. */
  col: string;
  /** Lane id (optional rows of the board). */
  lane?: string;
  /** Index within the cell (0 = first). In a pile column: the depth (0 = newest). */
  slot: number;
  /** Queued / off-board: rendered at opacity 0 in its slot. */
  hidden?: boolean;
};

type Rect = { x: number; y: number; w: number; h: number };

type SlotBoardProps = {
  columns: SlotBoardColumn[];
  lanes?: SlotBoardLane[];
  items: SlotBoardItem[];
  axis?: "x" | "y";
  /** px. main = slot height; cross = card width in a multi-slot row (default: fill the row); gap between slots. */
  slotSize: { main: number; cross?: number; gap: number };
  /** Cards side by side in a cell (default 1). */
  slotsPerRow?: number;
  /** Gap between columns (axis x) in px. Default 12. */
  columnGap?: number;
  /** Height reserved for each column head (px). Default 0, or 32 with renderColumnHead. */
  headSize?: number;
  /** Default 480. */
  moveMs?: number;
  /** Play the "jump" arc on a moved item (its inner layer). */
  arc?: boolean;
  /** Pile columns: px per depth (default 6) and visible depth (default 3). */
  pileOffset?: number;
  pileDepth?: number;
  renderItem: (item: SlotBoardItem, s: { moving: boolean; depth: number }) => ReactNode;
  renderColumnHead?: (col: SlotBoardColumn) => ReactNode;
  /** For overlays (e.g. dependency lines): slot rects in board px, after each resize. */
  onGeometry?: (g: { width: number; slotRect: (col: string, lane: string | undefined, slot: number) => Rect }) => void;
  /** No transitions (reduced motion / server). */
  still?: boolean;
  /** Visual demo: hide from assistive tech (default true). Set false when items are interactive. */
  decorative?: boolean;
  className?: string;
};

const px = (n: number) => `${Math.round(n * 100) / 100}px`;

export function SlotBoard({
  columns,
  lanes,
  items,
  axis = "x",
  slotSize,
  slotsPerRow = 1,
  columnGap = 12,
  headSize,
  moveMs = 480,
  arc = false,
  pileOffset = 6,
  pileDepth = 3,
  renderItem,
  renderColumnHead,
  onGeometry,
  still = false,
  decorative = true,
  className = "",
}: SlotBoardProps) {
  const head = headSize ?? (renderColumnHead ? 32 : 0);
  const n = columns.length;
  const laneIds: (string | undefined)[] = lanes?.map((l) => l.id) ?? [undefined];
  const rowsOf = (c: SlotBoardColumn) => (c.pile ? 1 : Math.ceil(c.slots / slotsPerRow));
  const maxRows = Math.max(...columns.map(rowsOf));
  const cellH = (rows: number) => rows * slotSize.main + Math.max(0, rows - 1) * slotSize.gap;
  const laneH = cellH(maxRows);

  // Board height (fixed by the slots, never by the items).
  const height =
    axis === "x"
      ? head + laneIds.length * laneH + (laneIds.length - 1) * slotSize.gap * 2
      : columns.reduce((h, c, i) => h + head + cellH(rowsOf(c)) + (i ? slotSize.gap * 2 : 0), 0);

  // Column geometry as CSS lengths (100cqw = the board's width), so it's right before JS.
  const colW = axis === "x" ? `((100cqw - ${(n - 1) * columnGap}px) / ${n})` : "100cqw";
  const cardW = slotSize.cross != null ? `${slotSize.cross}px` : `((${colW} - ${(slotsPerRow - 1) * slotSize.gap}px) / ${slotsPerRow})`;
  const colTopY = (ci: number) =>
    axis === "x" ? 0 : columns.slice(0, ci).reduce((h, c) => h + head + cellH(rowsOf(c)) + slotSize.gap * 2, 0);

  /** A slot's top-left as CSS lengths. */
  const slotPos = (ci: number, laneIdx: number, slot: number) => {
    const c = columns[ci];
    const s = c.pile ? 0 : slot;
    const row = Math.floor(s / slotsPerRow);
    const inRow = s % slotsPerRow;
    const x = axis === "x" ? `(${ci} * (${colW} + ${columnGap}px) + ${inRow} * (${cardW} + ${slotSize.gap}px))` : `(${inRow} * (${cardW} + ${slotSize.gap}px))`;
    const y = colTopY(ci) + head + laneIdx * (laneH + slotSize.gap * 2) + row * (slotSize.main + slotSize.gap);
    return { x, y };
  };

  // Which items just moved (for lit layers and the arc): compared with the previous render.
  const key = (it: SlotBoardItem) => `${it.col}|${it.lane ?? ""}|${it.slot}`;
  const [prev, setPrev] = useState<Record<string, string>>(() => Object.fromEntries(items.map((it) => [it.id, key(it)])));
  const [moving, setMoving] = useState<Set<string>>(() => new Set());
  const now = Object.fromEntries(items.map((it) => [it.id, key(it)]));
  const changed = items.filter((it) => prev[it.id] !== undefined && prev[it.id] !== now[it.id] && !items.find((x) => x.id === it.id)?.hidden);
  if (items.some((it) => prev[it.id] !== now[it.id])) {
    setPrev(now);
    if (changed.length && !still) setMoving(new Set([...moving, ...changed.map((c) => c.id)]));
  }
  useEffect(() => {
    if (!moving.size) return;
    const t = window.setTimeout(() => setMoving(new Set()), moveMs);
    return () => window.clearTimeout(t);
  }, [moving, moveMs]);

  // Geometry for overlays, in px (measured once per resize).
  const board = useRef<HTMLDivElement>(null);
  const geometry = useRef(onGeometry);
  useEffect(() => {
    geometry.current = onGeometry;
  });
  useEffect(() => {
    const el = board.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const W = el.clientWidth;
      const cw = axis === "x" ? (W - (n - 1) * columnGap) / n : W;
      const card = slotSize.cross ?? (cw - (slotsPerRow - 1) * slotSize.gap) / slotsPerRow;
      const slotRect = (col: string, lane: string | undefined, slot: number): Rect => {
        const ci = columns.findIndex((c) => c.id === col);
        const li = Math.max(0, laneIds.indexOf(lane));
        const s = columns[ci]?.pile ? 0 : slot;
        const row = Math.floor(s / slotsPerRow);
        const inRow = s % slotsPerRow;
        const x = (axis === "x" ? ci * (cw + columnGap) : 0) + inRow * (card + slotSize.gap);
        const y = colTopY(ci) + head + li * (laneH + slotSize.gap * 2) + row * (slotSize.main + slotSize.gap);
        return { x, y, w: card, h: slotSize.main };
      };
      geometry.current?.({ width: W, slotRect });
    });
    ro.observe(el);
    return () => ro.disconnect();
    // Geometry inputs are plain values; re-observe only if the layout itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axis, n, columnGap, slotSize.main, slotSize.gap, slotSize.cross, slotsPerRow, head, laneH]);

  // DOM order follows column → lane → slot, so tab order is logical when items are buttons.
  const order = (it: SlotBoardItem) => columns.findIndex((c) => c.id === it.col) * 1e6 + Math.max(0, laneIds.indexOf(it.lane)) * 1e3 + it.slot;
  const sorted = [...items].sort((a, b) => order(a) - order(b));

  return (
    <div
      ref={board}
      aria-hidden={decorative || undefined}
      data-still={still}
      className={`slot-board ${className}`}
      style={{ height, "--move-ms": `${moveMs}ms` } as CSSProperties}
    >
      {renderColumnHead &&
        columns.map((c, ci) => (
          <div
            key={c.id}
            className="absolute left-0 top-0"
            style={{ width: `calc(${colW})`, height: head, transform: `translate3d(calc(${axis === "x" ? `${ci} * (${colW} + ${columnGap}px)` : "0px"}), ${px(colTopY(ci))}, 0)` }}
          >
            {renderColumnHead(c)}
          </div>
        ))}
      {sorted.map((it) => {
        const ci = columns.findIndex((c) => c.id === it.col);
        if (ci < 0) return null;
        const col = columns[ci];
        const li = Math.max(0, laneIds.indexOf(it.lane));
        const { x, y } = slotPos(ci, li, it.slot);
        const depth = col.pile ? it.slot : 0;
        const pile = col.pile && depth > 0;
        const off = depth * pileOffset;
        const transform = `translate3d(calc(${x}${pile && axis === "y" ? ` + ${off}px` : ""}), ${px(y + (pile && axis === "x" ? off : 0))}, 0)${
          pile ? ` scale(${Math.round((1 - 0.03 * depth) * 1000) / 1000})` : ""
        }`;
        const faded = it.hidden || (col.pile && depth > pileDepth);
        const isMoving = moving.has(it.id);
        return (
          <div
            key={it.id}
            className="slot-item"
            style={{
              width: `calc(${cardW})`,
              height: slotSize.main,
              transform,
              transformOrigin: "top center",
              opacity: faded ? 0 : 1,
              zIndex: col.pile ? 50 - depth : isMoving ? 40 : 1,
              pointerEvents: faded ? "none" : undefined,
            }}
          >
            <div className={`h-full ${arc && isMoving ? "slot-jump" : ""}`}>{renderItem(it, { moving: isMoving, depth })}</div>
          </div>
        );
      })}
    </div>
  );
}
