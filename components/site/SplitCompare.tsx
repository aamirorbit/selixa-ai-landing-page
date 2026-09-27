"use client";

import { ChevronsLeftRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

type SplitCompareProps = {
  /** Left: the "without" layer. */
  before: ReactNode;
  /** Right: the "with" layer. */
  after: ReactNode;
  /** Divider position 0..1 from the left (fine pointers). Default 0.5. Touch starts at 1 (all before). */
  initial?: number;
  /** Slider aria-label. */
  label: string;
  /** id of the keyboard hint. */
  describedBy?: string;
  /** Shown under the knob until the first interaction. */
  hint?: ReactNode;
  /** Touch: a two-state toggle instead of dragging. */
  toggle: { before: string; after: string };
  /** Label buttons: clicking "before" moves to 1 (all before), "after" to 0 (all after). */
  labels?: { before: ReactNode; after: ReactNode };
  /** On the frame: its height, surface (e.g. "window h-[440px]"). */
  className?: string;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * SplitCompare: a before/after frame with a divider you drag (anywhere on the frame), move with
 * the keys (slider role), or switch with a toggle on touch.
 *
 * Transform only: the "after" layer sits in a clip wrapper that moves right by f·W while the
 * layer inside moves left by the same amount, so the content stays put and only the window onto
 * it slides. Three translate3d writes per frame, no width/clip-path changes, no layout. The
 * server HTML positions everything from CSS (--f), so there's no jump at hydration.
 */
export function SplitCompare({ before, after, initial = 0.5, label, describedBy, hint, toggle, labels, className = "" }: SplitCompareProps) {
  const frame = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLSpanElement>(null);
  const f = useRef(initial);
  const width = useRef(0);
  const [value, setValue] = useState(Math.round(initial * 100));
  const [touched, setTouched] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [side, setSide] = useState<"before" | "after">("before");
  const touchedRef = useRef(false);

  /** Writes f into the three transforms (px once measured). */
  const paint = (next: number) => {
    f.current = clamp01(next);
    const W = width.current;
    if (!W || !clip.current || !inner.current || !handle.current) return;
    const x = Math.round(f.current * W * 100) / 100;
    clip.current.style.transform = `translate3d(${x}px,0,0)`;
    inner.current.style.transform = `translate3d(${-x}px,0,0)`;
    handle.current.style.transform = `translate3d(${x}px,0,0)`;
    // The knob stays fully inside the frame at the ends (the line itself may reach the edge).
    if (knob.current) knob.current.style.transform = `translate3d(${Math.round((Math.min(Math.max(x, 22), W - 22) - x) * 100) / 100}px,0,0)`;
  };

  /** Animated move (a click, a key, the toggle, the intro nudge). */
  const animateTo = (next: number, ms: number, ease = "var(--ease-out-expo)") => {
    const els = [clip.current, inner.current, handle.current, knob.current];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    els.forEach((el) => el && (el.style.transition = reduce ? "none" : `transform ${ms}ms ${ease}`));
    paint(next);
    window.setTimeout(() => els.forEach((el) => el && (el.style.transition = "")), ms + 20);
    setValue(Math.round(f.current * 100));
  };

  // Measure (on resize only), decide pointer mode, and take over from the CSS position.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const isCoarse = !window.matchMedia("(any-pointer: fine)").matches;
    // Touch, and narrow windows even with a mouse: start on "before" (the halves are too narrow at 50/50).
    if (isCoarse || window.innerWidth < 768) f.current = 1;
    const ro = new ResizeObserver(() => {
      width.current = el.clientWidth;
      paint(f.current);
    });
    ro.observe(el);
    const t = window.setTimeout(() => {
      setCoarse(isCoarse);
      setValue(Math.round(f.current * 100)); // aria-valuenow matches the starting position
    });
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Intro nudge: once, the first time it's well in view, fine pointers, motion allowed.
  const nudged = useRef(false);
  useEffect(() => {
    const el = frame.current;
    // No nudge on touch, with reduced motion, or on narrow windows (they start on "before").
    if (!el || coarse || window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || nudged.current || touchedRef.current) return;
        nudged.current = true;
        io.disconnect();
        animateTo(0.42, 450, "ease-in-out");
        window.setTimeout(() => !touchedRef.current && animateTo(0.5, 450, "ease-in-out"), 470);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coarse]);
  const firstTouch = () => {
    touchedRef.current = true;
    setTouched(true);
  };

  // Dragging: anywhere on the frame (fine pointers). One rAF per frame writes the transforms.
  const drag = useRef<{ left: number; startX: number; moved: boolean; raf: number; x: number } | null>(null);
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (coarse || e.button !== 0) return;
    const el = frame.current!;
    const r = el.getBoundingClientRect();
    width.current = r.width;
    drag.current = { left: r.left, startX: e.clientX, moved: false, raf: 0, x: e.clientX };
    el.setPointerCapture(e.pointerId);
    el.dataset.dragging = "";
    firstTouch();
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    d.x = e.clientX;
    if (Math.abs(d.x - d.startX) >= 4) d.moved = true;
    if (!d.moved || d.raf) return;
    d.raf = requestAnimationFrame(() => {
      d.raf = 0;
      paint((d.x - d.left) / width.current);
    });
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    cancelAnimationFrame(d.raf);
    drag.current = null;
    const el = frame.current!;
    delete el.dataset.dragging;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const target = (e.clientX - d.left) / width.current;
    if (d.moved) {
      paint(target);
      setValue(Math.round(f.current * 100));
    } else if (!(e.target as HTMLElement).closest("[data-split-label]")) {
      animateTo(target, 320);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const big = e.shiftKey ? 0.2 : 0.05;
    const map: Record<string, number> = {
      ArrowLeft: f.current - big,
      ArrowRight: f.current + big,
      PageDown: f.current - 0.2,
      PageUp: f.current + 0.2,
      Home: 0,
      End: 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    firstTouch();
    animateTo(map[e.key], 200);
  };

  const flip = (to: "before" | "after") => {
    setSide(to);
    firstTouch();
    animateTo(to === "before" ? 1 : 0, 600, "cubic-bezier(0.65, 0, 0.35, 1)");
  };

  const labelButton = (which: "before" | "after", node: ReactNode) =>
    coarse ? (
      node
    ) : (
      <button
        type="button"
        data-split-label
        tabIndex={-1}
        onClick={() => {
          firstTouch();
          animateTo(which === "before" ? 1 : 0, 320);
        }}
        className="cursor-pointer"
      >
        {node}
      </button>
    );

  return (
    <div>
      <div
        ref={frame}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`split relative overflow-hidden rounded-[24px] [touch-action:pan-y] [&[data-dragging]]:select-none [@media(any-pointer:fine)]:cursor-ew-resize ${className}`}
      >
        <div className="absolute inset-0">
          {before}
          {labels && <div className="absolute left-5 top-5">{labelButton("before", labels.before)}</div>}
        </div>
        <div ref={clip} className="split-clip absolute inset-0 overflow-hidden">
          <div ref={inner} className="split-inner absolute inset-0">
            {after}
            {labels && <div className="absolute right-5 top-5">{labelButton("after", labels.after)}</div>}
          </div>
        </div>
        <div
          ref={handle}
          role="slider"
          tabIndex={coarse ? -1 : 0}
          aria-hidden={coarse || undefined}
          aria-label={label}
          aria-describedby={describedBy}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${100 - value}% with Selixa`}
          onKeyDown={onKey}
          className="split-handle fine-only group absolute inset-y-0 left-0 outline-none"
        >
          <span className="absolute inset-y-0 -left-px w-px bg-ink/[0.35]" />
          <span className="absolute inset-y-0 -left-[22px] w-11" />
          <span ref={knob} className="absolute -left-5 top-1/2 -mt-5 grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-panel text-fg-2 shadow-[0_6px_20px_-6px_rgb(var(--shadow-rgb)/calc(0.8*var(--shadow-k)))] transition-transform duration-200 group-hover:scale-[1.06] group-focus-visible:outline-2 group-focus-visible:outline-offset-[3px] group-focus-visible:outline-brand-400/60">
            <ChevronsLeftRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </span>
          {hint && (
            <span className={`absolute left-0 top-[calc(50%+36px)] -translate-x-1/2 whitespace-nowrap transition-opacity duration-300 ${touched ? "opacity-0" : "opacity-100"}`} aria-hidden="true">
              {hint}
            </span>
          )}
        </div>
      </div>

      {/* Touch: a two-way toggle, starting on "before" */}
      <div role="group" aria-label={label} className="coarse-only mx-auto mt-5 w-fit">
        <div className="relative grid h-11 grid-cols-2 rounded-full border border-line bg-ink/[0.03] p-1">
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full border border-line-strong bg-panel transition-transform duration-300 motion-reduce:transition-none"
            style={{ transform: side === "after" ? "translateX(100%)" : "none" }}
          />
          {(["before", "after"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={side === s}
              onClick={() => flip(s)}
              className={`relative h-9 whitespace-nowrap rounded-full px-5 text-[0.9375rem] transition-colors ${side === s ? "text-fg" : "text-fg-3"}`}
            >
              {toggle[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
