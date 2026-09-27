"use client";

import { useEffect, useRef, useState } from "react";
import { SlotBoard, type SlotBoardColumn } from "@/components/site/SlotBoard";
import { StickyScene, seg, smoothstep, useMeasure, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { agentBySlug } from "@/lib/content/agents";
import { ROADMAP_COPY, type ColId } from "./copy";
import { ColumnHead, FINAL, RoadmapCardView, boardItems, boardState, cardById, type BoardState } from "./RoadmapCard";

/*
 * The horizontal roadmap (spec §4.2): vertical scroll pans a wide Now / Next / Later plane
 * sideways (the only scrubbed thing: one transform on the plane, one on the indicator dot).
 * The camera rests twice; at each rest a decision toast arrives and a card moves (time-based,
 * on beats). Phones turn the axis: a tall stack pans up.
 */

const C = ROADMAP_COPY;
const B = C.board;
const agent = agentBySlug("roadmap")!;

const BEATS = [0.05, 0.09, 0.17, 0.21, 0.68, 0.72, 0.8, 0.84];
const pan = (p: number) => smoothstep(seg(p, 0.34, 0.62));
/** Toast shown after b beats (play order 1, 3, 2, 4), or null. */
const toastAt = (b: number) => (b < 1 ? null : Math.min(3, Math.floor((b - 1) / 2)));

const COLS = (["now", "next", "later"] as ColId[]).map((id) => ({ id, label: C.columns[id] }));
const r2 = (n: number) => Math.round(n * 100) / 100;

type Rect = { x: number; y: number; w: number; h: number };
type SlotRectFn = (col: string, lane: string | undefined, slot: number) => Rect;

/** The dependency: an elbow from Public API v2 (Later) to Import from CSV (Next); fades in. */
function Dependency({ geo, on, vertical, width, height, csvSlot = 1 }: { geo: SlotRectFn | null; on: boolean; vertical?: boolean; width: number; height: number; csvSlot?: number }) {
  if (!geo || !width) return null;
  const api = geo("later", undefined, 0);
  const csv = geo("next", undefined, csvSlot);
  let d: string;
  let end: [number, number];
  if (vertical) {
    // Down the left edge, from CSV to the API card.
    const x = -8;
    d = `M${csv.x} ${csv.y + csv.h / 2} H${x} V${api.y + api.h / 2} H${api.x}`;
    end = [csv.x, csv.y + csv.h / 2];
  } else {
    const ax = api.x;
    const ay = api.y + api.h / 2;
    const bx = csv.x + csv.w;
    const by = csv.y + csv.h / 2;
    const mid = (ax + bx) / 2;
    d = `M${r2(ax)} ${r2(ay)} H${r2(mid)} V${r2(by)} H${r2(bx)}`;
    end = [bx, by];
  }
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 overflow-visible transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}
      width={width}
      height={height}
      fill="none"
    >
      <path d={d} stroke="var(--dep-line)" strokeWidth={1} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
      <circle cx={r2(end[0])} cy={r2(end[1])} r={2.5} fill="var(--dep-line)" />
    </svg>
  );
}

function Toasts({ b, className = "" }: { b: number; className?: string }) {
  const t = toastAt(b);
  return (
    <div className={`grid [&>*]:col-start-1 [&>*]:row-start-1 ${className}`}>
      {B.toasts.map((toast, i) => (
        <div
          key={i}
          className={`card min-w-0 rounded-[14px]! bg-panel px-3.5 py-2 transition-[opacity,transform] duration-200 ${
            t === i ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
          }`}
        >
          <p className="flex min-w-0 items-center gap-2 text-[0.8125rem]">
            <span className="live-dot shrink-0" aria-hidden="true" />
            <span className="truncate">
              <span className="text-fg">{toast.kind}</span> <span className="text-fg-2">{toast.text}</span>
            </span>
          </p>
          <p className="mt-0.5 pl-[15px] text-[0.71875rem] text-fg-3">{B.source}</p>
        </div>
      ))}
    </div>
  );
}

function ProductChip() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-brand-500 text-[0.6875rem] text-[var(--brand-on)]" aria-hidden="true">
        A
      </span>
      <span className="text-[0.875rem] text-fg">{B.product}</span>
      <span className="text-[0.75rem] text-fg-3">{agent.status}</span>
    </span>
  );
}

/* ---------- Desktop: the wide plane ---------- */

function DesktopPlane({ b }: { b: number }) {
  const state = boardState(b);
  const [geo, setGeo] = useState<{ W: number; colW: number; left: number; travel: number }>({ W: 1440, colW: 760, left: 112, travel: 1100 });
  const [slotRect, setSlotRect] = useState<SlotRectFn | null>(null);
  const plane = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const rail = useRef({ w: 0 });
  const last = useRef(0);

  const place = (p: number) => {
    last.current = p;
    const t = pan(p);
    if (plane.current) plane.current.style.transform = `translate3d(${r2(geo.left - geo.travel * t)}px,0,0)`;
    if (dot.current) dot.current.style.transform = `translate3d(${r2(rail.current.w * t)}px,0,0)`;
  };
  const stage = useMeasure<HTMLDivElement>((el) => {
    const W = el.clientWidth;
    const pad = W >= 640 ? 32 : 20;
    const containerW = Math.min(1280, W) - 2 * pad;
    const left = (W - Math.min(1280, W)) / 2 + pad;
    const colW = Math.min(760, Math.max(560, 0.62 * W));
    const P = 3 * colW + 80;
    setGeo({ W, colW, left, travel: Math.max(0, P - containerW) });
  });
  const railEl = useMeasure<HTMLDivElement>((el) => {
    rail.current.w = el.clientWidth;
    place(last.current);
  });
  useSceneProgress(place);
  // Re-place after a resize changes the geometry (never during scroll).
  useEffect(() => {
    const t = pan(last.current);
    if (plane.current) plane.current.style.transform = `translate3d(${r2(geo.left - geo.travel * t)}px,0,0)`;
  }, [geo]);

  const P = 3 * geo.colW + 80;
  const height = 36 + 3 * 84 + 2 * 12;

  return (
    <div ref={stage} className="relative flex h-full flex-col">
      <div className="mx-auto flex h-12 w-full max-w-[1280px] shrink-0 items-start justify-between gap-6 px-5 pt-3 sm:px-8 [@media(max-height:760px)]:h-10">
        <ProductChip />
        <Toasts b={b} className="max-w-[480px]" />
      </div>
      <div className="mt-6 border-t border-line" />

      <div className="relative flex flex-1 items-center overflow-clip">
        <div ref={plane} data-scrub className="absolute left-0" style={{ width: P, height, transform: `translate3d(${geo.left}px,0,0)` }}>
          {/* Column rules */}
          {[1, 2].map((k) => (
            <span key={k} aria-hidden="true" className="absolute inset-y-0 w-px bg-line" style={{ left: k * geo.colW + (k - 1) * 40 + 20 }} />
          ))}
          <SlotBoard
            columns={COLS.map((c) => ({ id: c.id, label: c.label, slots: 6 }))}
            items={boardItems(state)}
            slotSize={{ main: 84, gap: 12 }}
            slotsPerRow={2}
            columnGap={40}
            headSize={36}
            moveMs={560}
            arc
            renderColumnHead={(c) => <ColumnHead id={c.id} label={String(c.label)} />}
            renderItem={(it, { moving }) => <RoadmapCardView card={cardById(it.id)} state={state} moving={moving} />}
            onGeometry={(g) => setSlotRect(() => g.slotRect)}
            className="w-full"
          />
          <Dependency geo={slotRect} on={state.dependency} width={P} height={height} />
        </div>
      </div>

      {/* Pan indicator: vertical scroll drives the horizontal travel */}
      <div aria-hidden="true" className="mx-auto mb-6 w-full max-w-[480px] px-5 [@media(max-height:760px)]:hidden">
        <div ref={railEl} className="relative h-px bg-ink/[0.1]">
          <span ref={dot} data-scrub className="absolute -top-1 left-0 -ml-1 h-2 w-2 rounded-full bg-brand-400" />
        </div>
        <div className="mt-2.5 flex justify-between text-[0.6875rem] text-fg-3">
          {COLS.map((c) => (
            <span key={c.id}>{c.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Phone: the tall stack pans up ---------- */

const PHONE_COLS: SlotBoardColumn[] = [
  { id: "now", label: C.columns.now, slots: 3 },
  { id: "next", label: C.columns.next, slots: 4 },
  { id: "later", label: C.columns.later, slots: 5 },
];

function PhonePlane({ b }: { b: number }) {
  const state = boardState(b);
  const [slotRect, setSlotRect] = useState<{ fn: SlotRectFn; w: number } | null>(null);
  const plane = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  // Camera B stops where the NEXT column head reaches the top, so Import from CSV and Mobile app
  // beta's source slot stay in view on short phones (cap from the slot geometry).
  const size = useRef({ travel: 0, full: 0, cap: Infinity, rail: 0 });
  const last = useRef(0);
  const height = PHONE_COLS.reduce((h, c, i) => h + 28 + c.slots * 56 + (c.slots - 1) * 8 + (i ? 16 : 0), 0);

  const place = (p: number) => {
    last.current = p;
    const t = pan(p);
    if (plane.current) plane.current.style.transform = `translate3d(0,${r2(-size.current.travel * t)}px,0)`;
    if (dot.current) dot.current.style.transform = `translate3d(${r2(size.current.rail * t)}px,0,0)`;
  };
  const windowEl = useMeasure<HTMLDivElement>((el) => {
    size.current.full = Math.max(0, height - el.clientHeight + 8);
    size.current.travel = Math.min(size.current.full, size.current.cap);
    place(last.current);
  });
  const railEl = useMeasure<HTMLDivElement>((el) => {
    size.current.rail = el.clientWidth;
    place(last.current);
  });
  useSceneProgress(place);

  return (
    <div className="flex h-full flex-col px-5 pt-3 sm:px-8">
      <ProductChip />
      <Toasts b={b} className="mt-3 h-[52px]" />
      <div aria-hidden="true" className="mt-3 rounded-full border border-line px-4 py-2">
        <div ref={railEl} className="relative h-px bg-ink/[0.1]">
          <span ref={dot} data-scrub className="absolute -top-1 left-0 -ml-1 h-2 w-2 rounded-full bg-brand-400" />
        </div>
        <div className="mt-1.5 flex justify-between text-[0.625rem] text-fg-3">
          {COLS.map((c) => (
            <span key={c.id}>{c.label}</span>
          ))}
        </div>
      </div>
      <div ref={windowEl} className="relative mt-3 min-h-0 flex-1 overflow-clip pl-3">
        <div ref={plane} data-scrub className="relative">
          <SlotBoard
            axis="y"
            columns={PHONE_COLS}
            items={boardItems(state)}
            slotSize={{ main: 56, gap: 8 }}
            headSize={28}
            moveMs={560}
            arc
            renderColumnHead={(c) => <ColumnHead id={c.id} label={String(c.label)} />}
            renderItem={(it, { moving }) => <RoadmapCardView card={cardById(it.id)} state={state} moving={moving} layout="row" />}
            onGeometry={(g) => {
              setSlotRect({ fn: g.slotRect, w: g.width });
              size.current.cap = Math.max(0, g.slotRect("next", undefined, 0).y - 32);
              size.current.travel = Math.min(size.current.full, size.current.cap);
              place(last.current);
            }}
          />
          <Dependency geo={slotRect?.fn ?? null} on={state.dependency} vertical width={slotRect?.w ?? 0} height={height} />
        </div>
      </div>
    </div>
  );
}

/* ---------- The finished board, all at once (static frame, and "Why it moved") ---------- */

type StaticBoardProps = {
  state?: BoardState;
  /** Make Onboarding v2 a button that opens the drawer. */
  onOpen?: (el: HTMLElement) => void;
  selected?: boolean;
};

/** The finished board with shipped cards removed and each column's cards moved up (no gaps). */
function compactItems(state: BoardState) {
  const items = boardItems(state).filter((it) => !(it.id === "billing" && state.shipped));
  return items.map((it) => ({ ...it, slot: items.filter((o) => o.col === it.col && o.slot < it.slot).length }));
}

export function StaticBoard({ state = FINAL, onOpen, selected }: StaticBoardProps) {
  const [slotRect, setSlotRect] = useState<{ fn: SlotRectFn; w: number } | null>(null);
  const main = 64;
  const items = compactItems(state);
  const csvSlot = items.find((it) => it.id === "csv")!.slot;
  const cols: SlotBoardColumn[] = COLS.map((c) => ({ id: c.id, label: c.label, slots: 4 }));
  const height = 32 + 4 * main + 3 * 8;
  return (
    // Its own stacking context, so the drawer and scrim above it always paint on top.
    <div className="relative isolate z-0">
      <SlotBoard
        columns={cols}
        items={items}
        slotSize={{ main, gap: 8 }}
        columnGap={24}
        headSize={32}
        still
        decorative={!onOpen}
        renderColumnHead={(c) => <ColumnHead id={c.id} label={String(c.label)} />}
        renderItem={(it) => {
          const view = <RoadmapCardView card={cardById(it.id)} state={state} moving={selected && it.id === "onboarding"} />;
          if (onOpen && it.id === "onboarding")
            return (
              <button
                type="button"
                aria-expanded={selected}
                aria-controls="why-drawer"
                onClick={(e) => onOpen(e.currentTarget)}
                className="block h-full w-full rounded-[12px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400/60"
              >
                {view}
              </button>
            );
          return view;
        }}
        onGeometry={(g) => setSlotRect({ fn: g.slotRect, w: g.width })}
      />
      <Dependency geo={slotRect?.fn ?? null} on={state.dependency} width={slotRect?.w ?? 0} height={height} csvSlot={csvSlot} />
    </div>
  );
}

/* ---------- The scene ---------- */

function PlaneStage() {
  const beat = useSceneBeat(BEATS);
  const still = useSceneStill();
  // The live layout's server frame is p = 0; the static layout (CSS-picked) is the finished board.
  const b = still ? 0 : beat;
  return (
    <>
      <ol className="sr-only">
        {B.toasts.map((t) => (
          <li key={t.text}>
            {t.kind} {t.text}. {B.source}.
          </li>
        ))}
      </ol>
      <div className="scene-live-only h-full" aria-hidden="true">
        <div className="hidden h-full md:block">
          <DesktopPlane b={b} />
        </div>
        <div className="h-full md:hidden">
          <PhonePlane b={b} />
        </div>
      </div>
      <div className="scene-still-only">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8">
          <div className="hidden md:block">
            <StaticBoard />
          </div>
          <div className="md:hidden">
            <PhoneStatic />
          </div>
        </div>
      </div>
    </>
  );
}

/** Phones, static: the finished stack in normal flow. */
export function PhoneStatic({ children, onOpen, open }: { children?: React.ReactNode; onOpen?: () => void; open?: boolean }) {
  const items = boardItems(FINAL);
  return (
    <div className="flex flex-col gap-4">
      {COLS.map((c) => (
        <div key={c.id}>
          <div className="h-7">
            <ColumnHead id={c.id} label={c.label} />
          </div>
          <ul className="flex flex-col gap-2">
            {items
              .filter((it) => it.col === c.id && !(it.id === "billing"))
              .sort((a, z) => a.slot - z.slot)
              .map((it) => (
                <li key={it.id} className="h-14">
                  {onOpen && it.id === "onboarding" ? (
                    <button type="button" onClick={onOpen} aria-expanded={open} className="block h-full w-full rounded-[12px] text-left">
                      <RoadmapCardView card={cardById(it.id)} state={FINAL} moving={open} layout="row" />
                    </button>
                  ) : (
                    <RoadmapCardView card={cardById(it.id)} state={FINAL} layout="row" />
                  )}
                </li>
              ))}
          </ul>
          {c.id === "now" && children}
        </div>
      ))}
    </div>
  );
}

export function RoadmapPlane() {
  return (
    <div className="mx-[calc(50%-50vw)]">
      <StickyScene id="board" length={4} label={B.headline}>
        <PlaneStage />
      </StickyScene>
    </div>
  );
}
