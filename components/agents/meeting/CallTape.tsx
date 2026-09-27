"use client";

import { CircleHelp, Lightbulb, ListChecks, PhoneOff, Scale, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Typed } from "@/components/landing/demo";
import { Initials } from "@/components/site/Initials";
import { StickyScene, seg, smoothstep, useMeasure, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { MEETING_COPY, type ChipKind } from "./copy";

/*
 * The call's tape (spec §3.2): a transcript slides up under a fixed playhead as the page
 * scrolls. Scrub position (the tape's translateY), step content (rows, chips, tally, timecode).
 */

const T = MEETING_COPY.timeline;
const ROWS = T.rows;
const END = ROWS.length; // index of the end row; 14 rows in all

// Row k arrives at 0.03 + 0.07k; the end row at 0.93.
const BEATS = [...ROWS.map((_, k) => Math.round((0.03 + 0.07 * k) * 100) / 100), 0.93];
const ENDED = BEATS.length;

/** Continuous tape position, 0 … 13: glides over the 0.035 before each beat, rests between. */
const tapeAt = (p: number) => BEATS.slice(1).reduce((r, b) => r + smoothstep(seg(p, b - 0.035, b)), 0);

/** From a row's top to the middle of its speaker line (pt-4 + half the 24px avatar). */
const SPEAKER_Y = 28;

const KINDS: ChipKind[] = ["decision", "action", "question", "insight"];
const ICON: Record<ChipKind, LucideIcon> = { decision: Scale, action: ListChecks, question: CircleHelp, insight: Lightbulb };
/** Decision and Insight are lit; Action item and Open question stay neutral (crimson stays rare). */
const chipClass = (k: ChipKind) =>
  k === "decision" || k === "insight" ? "border-brand-400/40 bg-brand-500/15 text-brand-200" : "";

const TOTALS = Object.fromEntries(KINDS.map((k) => [k, ROWS.filter((r) => r.chip === k).length])) as Record<ChipKind, number>;
/** "1 open question" / "2 open questions". */
const noun = (k: ChipKind, n: number) => (n === 1 ? T.chips[k].one : T.chips[k].plural);
const COUNTER = KINDS.map((k) => `${TOTALS[k]} ${noun(k, TOTALS[k])}`).join(" · ");
const show = (on: boolean) => (on ? "opacity-100" : "opacity-0");

/** A digit that changes by cross-fading stacked copies (no width change). */
function Digit({ value, max }: { value: number; max: number }) {
  return (
    <span className="inline-grid w-[1ch] tabular-nums [&>*]:col-start-1 [&>*]:row-start-1">
      {Array.from({ length: max + 1 }, (_, n) => (
        <span key={n} className={`transition-opacity duration-150 ${show(n === value)}`}>
          {n}
        </span>
      ))}
    </span>
  );
}

function Tally({ counts }: { counts: Record<ChipKind, number> }) {
  return (
    <>
      <p className="sr-only">{COUNTER}</p>
      {/* Desktop: the counter as words */}
      <p aria-hidden="true" className="hidden text-right text-[0.8125rem] text-fg-2 md:block">
        {KINDS.map((k, i) => (
          <span key={k}>
            {i > 0 && <span className="text-fg-3"> · </span>}
            <Digit value={counts[k]} max={TOTALS[k]} /> {noun(k, counts[k])}
          </span>
        ))}
      </p>
      {/* Phone: four icon counters */}
      <p aria-hidden="true" className="flex items-center gap-2 text-[0.75rem] text-fg-2 md:hidden">
        {KINDS.map((k) => {
          const Icon = ICON[k];
          return (
            <span key={k} className="flex items-center gap-1">
              <Icon className="h-3 w-3 text-brand-300" strokeWidth={2} />
              <Digit value={counts[k]} max={TOTALS[k]} />
            </span>
          );
        })}
      </p>
    </>
  );
}

function Chip({ kind, landed, className = "" }: { kind: ChipKind; landed: boolean; className?: string }) {
  const Icon = ICON[kind];
  return (
    <span
      className={`tag w-fit transition-[opacity,transform] duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${chipClass(kind)} ${
        landed ? "translate-x-0 scale-100 opacity-100" : "-translate-x-1.5 scale-[0.94] opacity-0"
      } ${className}`}
      style={{ transitionDelay: landed ? "180ms" : "0ms" }}
    >
      <Icon className={`h-3 w-3 ${chipClass(kind) ? "" : "text-brand-300"}`} strokeWidth={2} aria-hidden="true" />
      {T.chips[kind].label}
    </span>
  );
}

type RowState = { arrived: boolean; current: boolean; typing: boolean };

function Row({ k, state, still }: { k: number; state: RowState; still: boolean }) {
  const row = ROWS[k];
  const { arrived, current, typing } = state;
  const landed = arrived && !!row.chip;
  return (
    <li
      className={`tape-row relative grid grid-cols-[44px_14px_minmax(0,1fr)] pt-4 transition-opacity duration-200 md:grid-cols-[88px_20px_148px_minmax(0,1fr)] ${show(arrived)}`}
    >
      {/* Timestamp; hidden on the current row, where the playhead's badge shows it */}
      <span className={`pt-[3px] text-[0.6875rem] tabular-nums text-fg-3 transition-opacity duration-200 md:text-[0.75rem] ${show(!current)}`}>{row.time}</span>
      {/* Rail node: a dot, or a brand diamond once a chip lands */}
      <span aria-hidden="true" className="relative flex justify-center pt-[7px]">
        <span className="h-[7px] w-[7px] rounded-full bg-ink/25" />
        <span
          className={`absolute top-[6px] h-[9px] w-[9px] rotate-45 bg-brand-500 transition-opacity duration-200 ${show(landed)}`}
          style={{ transitionDelay: landed ? "180ms" : "0ms" }}
        />
      </span>
      {/* Chip lane (desktop) */}
      <span className="hidden flex-col gap-1.5 pr-4 md:flex">
        {row.chip && (
          <>
            <Chip kind={row.chip} landed={landed} />
            <span
              className={`line-clamp-2 text-[0.75rem] leading-[1.4] text-fg-3 transition-opacity duration-[260ms] ${show(landed)}`}
              style={{ transitionDelay: landed ? "180ms" : "0ms" }}
            >
              {row.chipText}
            </span>
          </>
        )}
      </span>
      {/* Transcript */}
      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-2 text-[0.75rem] text-fg-3">
          <Initials name={row.who} size={24} />
          {row.who}
        </span>
        <span className="mt-1.5 grid text-[0.9375rem] leading-[1.5] md:text-[1rem] [&>*]:col-start-1 [&>*]:row-start-1">
          <span className={`line-clamp-3 text-fg-2 transition-opacity duration-200 md:line-clamp-2 ${show(!current)}`}>{row.line}</span>
          <span aria-hidden="true" className={`line-clamp-3 text-fg transition-opacity duration-200 md:line-clamp-2 ${show(current)}`}>
            {typing && !still ? <Typed text={row.line} on cps={90} /> : row.line}
          </span>
        </span>
        {row.chip && <Chip kind={row.chip} landed={landed} className="mt-2.5 md:hidden" />}
      </span>
    </li>
  );
}

function EndRow({ arrived }: { arrived: boolean }) {
  return (
    <li className={`tape-row flex flex-col items-center justify-center gap-2.5 transition-opacity duration-200 ${show(arrived)}`}>
      <span className="tag">
        <PhoneOff className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
        {T.endMarker}
      </span>
      <a href="#recap" className="text-[0.8125rem] text-fg-3 transition-colors hover:text-fg">
        {T.endLink} ↓
      </a>
    </li>
  );
}

function TapeStage() {
  const b = useSceneBeat(BEATS);
  const still = useSceneStill();
  const ended = still || b >= ENDED;
  const arrivedCount = still ? END + 1 : b;
  const current = still || ended ? -1 : Math.min(b - 1, END - 1);

  // Only the newest row types, and only when it arrived one beat at a time (a fast scroll
  // or anchor jump shows skipped rows whole). Previous beat kept per React's
  // "store information from previous renders" pattern.
  const [beats, setBeats] = useState({ now: b, prev: b });
  if (beats.now !== b) setBeats({ now: b, prev: beats.now });
  const typingRow = b - beats.prev === 1 && b - 1 < END ? b - 1 : -1;

  const counts = Object.fromEntries(
    KINDS.map((k) => [k, ROWS.filter((r, i) => i < arrivedCount && r.chip === k).length]),
  ) as Record<ChipKind, number>;

  // Scrubbed: the tape's translateY. Sizes are cached on resize, never read while scrolling.
  const tape = useRef<HTMLDivElement>(null);
  const size = useRef({ rowH: 0, playY: 0 });
  const last = useRef(1);
  const place = (p: number) => {
    last.current = p;
    const { rowH, playY } = size.current;
    if (!tape.current || !rowH) return;
    // The current row's speaker line sits on the playhead (its text reads just below it).
    const y = playY - (tapeAt(p) * rowH + SPEAKER_Y);
    tape.current.style.transform = `translate3d(0,${Math.round(y * 100) / 100}px,0)`;
  };
  const viewport = useMeasure<HTMLDivElement>((el) => {
    const row = tape.current?.querySelector<HTMLElement>(".tape-row");
    const ph = parseFloat(getComputedStyle(el).getPropertyValue("--ph")) || 0.44;
    size.current = { rowH: row?.offsetHeight ?? 0, playY: el.clientHeight * ph };
    place(last.current);
  });
  useSceneProgress(place);

  return (
    <div className={`mx-auto flex w-full max-w-[960px] flex-col ${still ? "py-10" : "h-full"}`}>
      {/* Header: REC + title, and the running tally */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-line md:h-14">
        <span className="flex min-w-0 items-center gap-2.5 text-[0.8125rem] text-fg md:text-[0.875rem]">
          {still ? (
            <span className="tag shrink-0">
              <PhoneOff className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              {T.endMarker}
            </span>
          ) : (
            <span aria-hidden="true" className="relative grid h-[7px] w-[7px] shrink-0 [&>*]:col-start-1 [&>*]:row-start-1">
              <span className={`live-dot transition-opacity duration-200 ${show(!ended)}`} />
              <span className={`h-[7px] w-[7px] rounded-full bg-ink/30 transition-opacity duration-200 ${show(ended)}`} />
            </span>
          )}
          <span className="truncate">{MEETING_COPY.hero.windowTitle}</span>
        </span>
        <Tally counts={counts} />
      </div>

      {/* The tape, under a fixed playhead */}
      <div
        ref={viewport}
        className={`relative [--ph:0.4] md:[--ph:0.44] ${still ? "" : "tape-mask min-h-0 flex-1 overflow-clip"}`}
      >
        {/* The tape: rail + rows, moved as one by translateY */}
        <div ref={tape} data-scrub className={still ? "relative [transform:none]!" : "absolute inset-x-0 top-0"}>
          <span aria-hidden="true" className="absolute bottom-0 left-[51px] top-0 w-px bg-ink/[0.12] md:left-[98px]" />
          <ol aria-label="Transcript" className="relative">
            {ROWS.map((_, k) => (
              <Row
                key={k}
                k={k}
                still={still}
                state={{ arrived: still || k < arrivedCount, current: k === current, typing: k === typingRow }}
              />
            ))}
            <EndRow arrived={still || b >= ENDED} />
          </ol>
        </div>

        {/* Playhead: fixed in the stage, with the current row's timecode */}
        {!still && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[calc(var(--ph)*100%)]">
            {/* The line goes at the end beat; the badge stays with the final time */}
            <span className={`absolute inset-x-0 h-px bg-brand-400/70 transition-opacity duration-200 ${show(!ended)}`} />
            <span className="absolute left-0 grid -translate-y-1/2 text-[0.6875rem] tabular-nums md:text-[0.75rem] [&>*]:col-start-1 [&>*]:row-start-1">
              {[...ROWS.map((r) => r.time), MEETING_COPY.hero.endTime].map((t, i) => {
                const on = ended ? i === END : i === Math.max(0, current);
                return (
                  <span
                    key={i}
                    className={`rounded-md px-1.5 py-0.5 transition-opacity duration-[120ms] ${
                      ended ? "bg-ink/[0.08] text-fg-2" : "bg-brand-500 text-[var(--brand-on)]"
                    } ${show(on)}`}
                  >
                    {t}
                  </span>
                );
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function CallTape() {
  return (
    <StickyScene id="call-tape" length={4.2} label={T.headline}>
      <TapeStage />
    </StickyScene>
  );
}
