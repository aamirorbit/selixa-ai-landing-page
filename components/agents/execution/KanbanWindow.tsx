"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { BrandMark } from "@/components/landing/BrandMark";
import { LOGOS } from "@/components/landing/logos";
import { WindowBar } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { Initials } from "@/components/site/Initials";
import { SlotBoard, type SlotBoardColumn, type SlotBoardItem } from "@/components/site/SlotBoard";
import { EXECUTION_COPY, TASKS } from "./copy";

/*
 * The hero: a kanban that empties. Tasks glide To do → In progress → Done and settle into a
 * pile while the ring fills; the loop starts at 0 (owner decision) so the emptying is visible.
 */

const H = EXECUTION_COPY.hero;
const N = TASKS.length;
const LINEAR = LOGOS.find((l) => l.name === "Linear")!;

// reset, 16 moves of 280ms, done, hold
const SCRIPT = [400, ...Array.from({ length: 16 }, () => 280), 600, 3000];
const DONE_STEP = 17;
const LAST = SCRIPT.length - 1;

/** After step k: how many tasks have started, and how many are done. */
function counts(k: number) {
  if (k <= 0) return { started: 0, done: 0 };
  return { started: Math.min(k, N), done: Math.max(0, Math.min(k - 2, N)) };
}

function items(k: number, todoSlots: number): SlotBoardItem[] {
  const { started, done } = counts(k);
  return TASKS.map((t, i) => {
    if (i < done) return { id: t.id, col: "done", slot: done - 1 - i };
    if (i < started) return { id: t.id, col: "doing", slot: i - done };
    const slot = i - started;
    return { id: t.id, col: "todo", slot: Math.min(slot, todoSlots - 1), hidden: slot >= todoSlots };
  });
}

function TaskCard({ id, done, compact }: { id: string; done: boolean; compact?: boolean }) {
  const t = TASKS.find((x) => x.id === id)!;
  return (
    <div className={`card flex h-full flex-col justify-between rounded-[10px]! bg-panel ${compact ? "px-2.5 py-2" : "px-3 py-2.5"}`}>
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[0.6875rem] tabular-nums text-fg-3">
          <CheckCircle2 className={`h-3 w-3 text-brand-300 transition-opacity duration-200 ${done ? "opacity-100" : "opacity-0"} ${done ? "" : "-mr-[18px]"}`} strokeWidth={2} aria-hidden="true" />
          {t.id}
        </span>
        {!compact && <Initials name={t.owner} size={18} />}
      </span>
      <span className={`grid min-w-0 [&>*]:col-start-1 [&>*]:row-start-1 ${compact ? "text-[0.78125rem]" : "text-[0.84375rem]"}`}>
        <span className={`truncate text-fg transition-opacity duration-200 ${done ? "opacity-0" : "opacity-100"}`}>{t.title}</span>
        <span className={`truncate text-fg-2 transition-opacity duration-200 ${done ? "opacity-100" : "opacity-0"}`}>{t.title}</span>
      </span>
    </div>
  );
}

function Ring({ n, complete }: { n: number; complete: boolean }) {
  return (
    <span className="relative grid h-7 w-7 place-items-center">
      <span className={`absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.45),transparent_70%)] opacity-0 ${complete ? "glow-once" : ""}`} />
      <svg viewBox="0 0 28 28" className="absolute inset-0 -rotate-90" fill="none">
        <circle cx="14" cy="14" r="12" stroke="rgb(var(--ink-rgb) / 0.1)" strokeWidth={3} />
        <circle
          cx="14"
          cy="14"
          r="12"
          stroke="var(--progress)"
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          className="transition-[stroke-dashoffset] duration-300"
          style={{ strokeDashoffset: 100 - (n / N) * 100 }}
        />
      </svg>
      <Check className={`relative h-3 w-3 text-fg transition-opacity duration-200 ${complete ? "opacity-100" : "opacity-0"}`} strokeWidth={2.5} aria-hidden="true" />
    </span>
  );
}

const DESKTOP_COLS: SlotBoardColumn[] = [
  { id: "todo", label: H.columns.todo, slots: 5 },
  { id: "doing", label: H.columns.doing, slots: 2 },
  { id: "done", label: H.columns.done, slots: 1, pile: true },
];
// Phones: three To-do slots (two made the lane flicker at 280ms beats).
const PHONE_COLS: SlotBoardColumn[] = [
  { id: "todo", label: H.columns.todo, slots: 3 },
  { id: "doing", label: H.columns.doing, slots: 2 },
  { id: "done", label: H.columns.done, slots: 1, pile: true },
];

export function KanbanWindow() {
  const { ref, step, still } = useSequence(SCRIPT);
  const k = still ? LAST : step;
  const { started, done } = counts(k);
  const complete = k >= DONE_STEP;
  const reset = !still && k === 0;
  const colCount = (id: string) => (id === "todo" ? N - started : id === "doing" ? started - done : done);

  const head = (c: SlotBoardColumn, phone?: boolean) => (
    <span className="flex h-full items-center gap-2 px-1 text-[0.78125rem] text-fg-2">
      {c.label}
      <span className="rounded-full bg-ink/[0.06] px-1.5 text-[0.6875rem] tabular-nums text-fg-3">{colCount(c.id)}</span>
      {phone && c.id === "todo" && N - started > 3 && <span className="tag px-1.5 py-0 text-[0.6875rem]">+{N - started - 3}</span>}
    </span>
  );

  return (
    <div ref={ref} className="window mx-auto w-full max-w-[1040px] text-left">
      <WindowBar>
        <span className="flex items-center gap-2 text-fg-2">
          <span className="grid h-4 w-4 place-items-center rounded-[4px] bg-brand-500 text-[0.625rem] text-[var(--brand-on)]" aria-hidden="true">
            A
          </span>
          {H.board}
        </span>
        <span className="ml-auto flex items-center gap-3">
          <BrandMark logo={LINEAR} lit className="h-3.5 w-3.5" />
          <span className="grid justify-items-end text-[0.75rem] tabular-nums text-fg-2 [&>*]:col-start-1 [&>*]:row-start-1">
            <span className={`transition-opacity duration-200 ${complete ? "opacity-0" : "opacity-100"}`}>
              {done} {H.of} {N}
            </span>
            <span className={`transition-opacity duration-200 ${complete ? "opacity-100" : "opacity-0"}`}>{H.doneLabel}</span>
          </span>
          <Ring n={done} complete={complete} />
        </span>
      </WindowBar>

      <div aria-hidden="true" className={`transition-opacity duration-300 ${reset ? "opacity-0" : "opacity-100"}`}>
        {/* md+: three columns */}
        {/* Column wells sit 12px outside the board's columns (board gap 36 = 12 + 2 × 12) */}
        <div className="relative hidden px-7 pb-7 pt-4 md:block">
          <div className="absolute inset-x-4 bottom-4 top-4 grid grid-cols-3 gap-3">
            {DESKTOP_COLS.map((c) => (
              <div key={c.id} className="relative rounded-[14px] bg-well">
                {c.id === "todo" && (
                  <span className={`absolute inset-x-3 top-[44px] h-[60px] rounded-[10px] border border-dashed border-line transition-opacity duration-300 ${started >= N ? "opacity-100" : "opacity-0"}`} />
                )}
              </div>
            ))}
          </div>
          <SlotBoard
            columns={DESKTOP_COLS}
            items={items(k, 5)}
            slotSize={{ main: 60, gap: 8 }}
            columnGap={36}
            headSize={44}
            pileDepth={4}
            still={still || reset}
            renderColumnHead={(c) => head(c)}
            renderItem={(it) => <TaskCard id={it.id} done={it.col === "done"} />}
          />
        </div>
        {/* Phone: lanes stacked, work flows down */}
        <div className="p-3 md:hidden">
          <SlotBoard
            axis="y"
            columns={PHONE_COLS}
            items={items(k, 3)}
            slotSize={{ main: 52, gap: 8 }}
            slotsPerRow={3}
            headSize={26}
            pileDepth={3}
            still={still || reset}
            renderColumnHead={(c) => head(c, true)}
            renderItem={(it) => <TaskCard id={it.id} done={it.col === "done"} compact />}
          />
        </div>
      </div>
    </div>
  );
}
