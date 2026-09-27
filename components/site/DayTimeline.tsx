"use client";

import { Sun, Sunrise, Sunset } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Orb } from "@/components/landing/ui";
import type { DayMoment } from "@/lib/content/use-cases";
import { useInView } from "./useInView";

type DayTimelineProps = {
  /** A: sticky index on the left, active moment follows reading. B: a rail across the top that
      fills once (a carousel on phones). C: cards that stack like a deck (CSS sticky only). */
  variant: "A" | "B" | "C";
  moments: DayMoment[];
  /** The section header, placed per variant. */
  header: ReactNode;
  /** Small label before Selixa's line. */
  selixaLabel?: string;
};

/** Morning / afternoon / evening, from "H:MM". */
function TimeIcon({ time, className = "h-3.5 w-3.5" }: { time: string; className?: string }) {
  const h = parseInt(time, 10);
  const Icon = h < 12 ? Sunrise : h < 17 ? Sun : Sunset;
  return <Icon className={`shrink-0 text-fg-3 ${className}`} strokeWidth={1.75} aria-hidden="true" />;
}

function Time({ time, size = "text-[2rem]" }: { time: string; size?: string }) {
  return (
    <span className="flex items-center gap-2">
      <TimeIcon time={time} />
      <span className={`font-light tabular-nums tracking-[-0.02em] text-fg ${size}`}>{time}</span>
    </span>
  );
}

function SelixaLine({ m, label }: { m: DayMoment; label?: string }) {
  return (
    <p className="mt-3 flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">
        <Orb size={18} />
      </span>
      <span className="text-[0.9375rem] leading-[1.5] text-fg-2">
        {label && <span className="mr-1.5 text-[0.75rem] text-fg-3">{label}</span>}
        {m.selixa}
      </span>
    </p>
  );
}

/** The content unit: time, the moment, and what Selixa did. */
function Moment({ m, label, time = true }: { m: DayMoment; label?: string; time?: boolean }) {
  return (
    <>
      {time && <Time time={m.time} />}
      <p className={`${time ? "mt-3" : ""} text-[1.0625rem] font-medium text-fg`}>{m.moment}</p>
      <SelixaLine m={m} label={label} />
    </>
  );
}

/* ---------- A: sticky index left, cards right ---------- */

function VariantA({ moments, header, selixaLabel }: Omit<DayTimelineProps, "variant">) {
  const [active, setActive] = useState(0);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  // While a clicked entry's smooth scroll runs, the observer doesn't overrule the click.
  const lockUntil = useRef(0);

  useEffect(() => {
    const els = cards.current.filter(Boolean) as HTMLDivElement[];
    const io = new IntersectionObserver(
      (entries) => {
        if (performance.now() < lockUntil.current) return;
        for (const e of entries) if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLDivElement));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (k: number, at: number) => {
    const el = cards.current[k];
    if (!el) return;
    setActive(k);
    lockUntil.current = at + 1200; // the click's timestamp (performance.now() clock)
    // Centre the card in the viewport, where the active band is.
    const r = el.getBoundingClientRect();
    window.scrollTo({ top: r.top + window.scrollY - (window.innerHeight - r.height) / 2, behavior: "smooth" });
  };
  const last = moments.length - 1;

  return (
    <>
      {/* lg+: sticky index + cards */}
      <div className="hidden grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-16 lg:grid">
        <div className="sticky top-28">
          {header}
          <ol className="relative mt-10">
            <span aria-hidden="true" className="absolute bottom-6 left-[calc(3.5rem+0.75rem+6.5px)] top-6 w-px bg-ink/[0.1]">
              <span className="absolute inset-0 origin-top bg-brand-400 transition-transform duration-[400ms]" style={{ transform: `scaleY(${active / last})` }} />
            </span>
            {moments.map((m, k) => (
              <li key={m.time}>
                <button
                  type="button"
                  onClick={(e) => goTo(k, e.timeStamp)}
                  className={`relative grid w-full grid-cols-[3.5rem_14px_1fr] items-center gap-3 py-2.5 text-left transition-colors ${k === active ? "text-fg" : "text-fg-3 hover:text-fg-2"}`}
                >
                  <span className="text-[0.8125rem] tabular-nums">{m.time}</span>
                  <span className="relative grid place-items-center">
                    <span className="h-2 w-2 rounded-full bg-ink/25" />
                    <span className={`absolute h-2 w-2 rounded-full bg-brand-400 ring-[3px] ring-brand-500/20 transition-opacity duration-300 ${k === active ? "opacity-100" : "opacity-0"}`} />
                  </span>
                  <span className="text-[0.9375rem]">{m.moment}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-4">
          {moments.map((m, k) => (
            <div
              key={m.time}
              ref={(el) => {
                cards.current[k] = el;
              }}
              className="card relative min-h-[220px] rounded-[20px]! p-8"
            >
              <span aria-hidden="true" className={`card-lit pointer-events-none absolute -inset-px rounded-[20px] border transition-opacity duration-300 ${k === active ? "opacity-100" : "opacity-0"}`} />
              <div className="relative">
                <Moment m={m} label={selixaLabel} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Below lg: a vertical list on a rail */}
      <div className="lg:hidden">
        {header}
        <ol className="relative mt-10 flex flex-col gap-8 pl-8">
          <span aria-hidden="true" className="absolute bottom-2 left-[9.5px] top-3 w-px bg-ink/[0.1]" />
          {moments.map((m, k) => (
            <li key={m.time} className="relative">
              <span aria-hidden="true" className={`absolute -left-[26px] top-3 h-2 w-2 rounded-full ${k === 0 ? "bg-brand-400" : "bg-ink/25"}`} />
              <Moment m={m} label={selixaLabel} />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

/* ---------- B: rail across the top ---------- */

/** Variant B's rail: stops with time and a node, a fill layer (scaleX), optional tap-to-go. */
function Rail({ moments, fill, big, lit, onStop }: { moments: DayMoment[]; fill: number; big: boolean; lit: (k: number) => boolean; onStop?: (k: number) => void }) {
  return (
    <div className="relative grid grid-cols-4">
      <span aria-hidden="true" className={`absolute left-[12.5%] right-[12.5%] h-px bg-ink/[0.1] ${big ? "top-[40px]" : "top-[30px]"}`}>
        <span className="absolute inset-0 origin-left bg-brand-400 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `scaleX(${fill})` }} />
      </span>
      {moments.map((m, k) => (
        <button
          key={m.time}
          type="button"
          tabIndex={onStop ? 0 : -1}
          onClick={() => onStop?.(k)}
          className={`flex flex-col items-center gap-2 ${onStop ? "" : "pointer-events-none"}`}
        >
          <span className={`flex items-center gap-1.5 tabular-nums text-fg-2 ${big ? "text-[1.125rem]" : "text-[0.75rem]"}`}>
            <TimeIcon time={m.time} />
            {m.time}
          </span>
          <span className="relative grid h-2.5 w-2.5 place-items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
            <span className={`absolute inset-0 rounded-full bg-brand-400 transition-opacity duration-300 ${lit(k) ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: big ? `${k * 300}ms` : "0ms" }} />
          </span>
        </button>
      ))}
    </div>
  
  );
}



function VariantB({ moments, header, selixaLabel }: Omit<DayTimelineProps, "variant">) {
  const { ref, inView } = useInView<HTMLDivElement>(0);
  // Reduced motion: the rail starts full and every stop lit (server: not yet known, so empty).
  const reduced = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [seen, setSeen] = useState(false);
  if (inView && !seen) setSeen(true);
  const played = seen || reduced;
  const [snap, setSnap] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const cardW = useRef(0);
  const last = moments.length - 1;

  // Phone carousel: the active stop follows the snapped card (state only on change).
  useEffect(() => {
    const el = carousel.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const first = el.firstElementChild as HTMLElement | null;
      cardW.current = first ? first.offsetWidth + 12 : 0;
    });
    ro.observe(el);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => cardW.current && setSnap(Math.round(el.scrollLeft / cardW.current)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  const toCard = (k: number) => carousel.current?.scrollTo({ left: k * cardW.current, behavior: "smooth" });

  return (
    <div ref={ref}>
      <div className="flex justify-center text-center [&>*]:items-center">{header}</div>
      {/* md+: rail and four cards */}
      <div className="mx-auto mt-12 hidden max-w-[1120px] md:block">
        <Rail moments={moments} fill={played ? 1 : 0} big lit={() => played} />
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {moments.map((m) => (
            <div key={m.time} className="card relative min-h-[200px] rounded-[18px]! p-6">
              <span aria-hidden="true" className="absolute -top-5 left-1/2 hidden h-5 w-px bg-ink/[0.1] lg:block" />
              <p className="mb-2 text-[0.75rem] tabular-nums text-fg-3 lg:hidden">{m.time}</p>
              <Moment m={m} label={selixaLabel} time={false} />
            </div>
          ))}
        </div>
      </div>
      {/* Phone: mini rail over a carousel */}
      <div className="mt-10 md:hidden">
        <Rail moments={moments} fill={snap / last} big={false} lit={(k) => k === snap} onStop={toCard} />
        <div ref={carousel} className="-mx-5 mt-4 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {moments.map((m) => (
            <div key={m.time} className="card w-[85%] shrink-0 snap-center p-6">
              <p className="mb-2 text-[0.75rem] tabular-nums text-fg-3">{m.time}</p>
              <Moment m={m} label={selixaLabel} time={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- C: stacked deck (CSS sticky only) ---------- */

function VariantC({ moments, header, selixaLabel }: Omit<DayTimelineProps, "variant">) {
  return (
    <div className="pb-40">
      <div className="flex justify-center text-center [&>*]:items-center">{header}</div>
      <ol className="day-deck mx-auto mt-12 max-w-[760px]">
        {moments.map((m, k) => (
          <li
            key={m.time}
            className="window sticky min-h-[196px] rounded-[22px]! bg-panel p-6 md:min-h-[208px] md:p-8"
            style={{ "--i": k, zIndex: k + 1 } as React.CSSProperties}
          >
            <span className="absolute left-4 top-3 text-[0.6875rem] tabular-nums text-fg-3 md:left-5">
              {k + 1}/{moments.length}
            </span>
            <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-[9rem_1fr] md:gap-8">
              <Time time={m.time} />
              <div>
                <p className="text-[1.0625rem] font-medium text-fg">{m.moment}</p>
                <SelixaLine m={m} label={selixaLabel} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A day with Selixa: four moments, laid out per variant. No auto-playing loops. */
export function DayTimeline({ variant, ...rest }: DayTimelineProps) {
  if (variant === "A") return <VariantA {...rest} />;
  if (variant === "B") return <VariantB {...rest} />;
  return <VariantC {...rest} />;
}
