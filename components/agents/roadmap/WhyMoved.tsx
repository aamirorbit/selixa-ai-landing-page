"use client";

import { ArrowRight, Compass, Telescope, TrendingDown, Video, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SectionHeader, WindowBar, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { Initials } from "@/components/site/Initials";
import { ROADMAP_COPY } from "./copy";
import { PhoneStatic, StaticBoard } from "./RoadmapPlane";

const W = ROADMAP_COPY.why;
const D = W.drawer;

// Opens once by itself, 600ms after the window reveals (well within setTimeout's limit after that).
const SCRIPT = [600, 2_000_000_000];

function Row({ label, children, i, on }: { label?: string; children: ReactNode; i: number; on: boolean }) {
  return (
    <div className="st border-t border-line py-3.5" data-on={on} style={{ transitionDelay: on ? `${i * 50}ms` : "0ms" }}>
      {label && <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-fg-3">{label}</p>}
      <div className={label ? "mt-1.5" : ""}>{children}</div>
    </div>
  );
}

function DrawerBody({ on, titleRef, titleId, onClose }: { on: boolean; titleRef?: React.Ref<HTMLHeadingElement>; titleId?: string; onClose?: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 pb-3.5">
        <h3 ref={titleRef} id={titleId} tabIndex={-1} className="text-[1.125rem] text-fg outline-none">
          {D.title}
        </h3>
        {onClose && (
          <button type="button" onClick={onClose} aria-label={D.close} className="flex items-center gap-1.5 rounded-full p-1.5 text-fg-3 transition-colors hover:text-fg">
            <span className="text-[0.8125rem] md:hidden">{D.close}</span>
            <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
      <Row i={0} on={on}>
        <p className="flex flex-wrap items-center gap-2 text-[0.75rem] text-fg-3">
          <span className="tag">{D.from}</span>
          <ArrowRight className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          <span className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">{D.to}</span>· {D.date}
        </p>
      </Row>
      <Row i={1} on={on} label={D.decisionLabel}>
        <p className="text-[0.9375rem] text-fg">{D.decision}</p>
      </Row>
      <Row i={2} on={on} label={D.decidedByLabel}>
        <p className="flex items-center gap-2 text-[0.875rem] text-fg">
          <Initials name={D.decidedBy} size={20} />
          {D.decidedBy}
        </p>
      </Row>
      <Row i={3} on={on} label={D.fromLabel}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.875rem] text-fg-2">
          <span className="flex items-center gap-2">
            <Video className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.75} aria-hidden="true" />
            {D.meeting}
          </span>
          <Link href="/product/meetings" className="link-arrow text-[0.8125rem]">
            {D.meetingLink}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </p>
      </Row>
      <Row i={4} on={on} label={D.whyLabel}>
        <ul className="flex flex-col gap-1.5 text-[0.875rem] text-fg-2">
          <li className="flex items-center gap-2">
            <TrendingDown className="h-3.5 w-3.5 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
            {D.why[0]}
          </li>
          <li className="flex items-center gap-2">
            <Telescope className="h-3.5 w-3.5 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
            {D.why[1]}
          </li>
        </ul>
      </Row>
      <Row i={5} on={on} label={D.recommendationLabel}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.875rem] text-fg-2">
          <span className="flex items-center gap-2">
            <Compass className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.75} aria-hidden="true" />
            {D.recommendation}
          </span>
          <Link href="/product/priorities" className="link-arrow text-[0.8125rem]">
            {D.memoLink}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </p>
      </Row>
    </>
  );
}

/** The finished board, holding still; Onboarding v2 opens a drawer with the decision behind it. */
export function WhyMoved() {
  const { ref, step, still } = useSequence<HTMLElement>(SCRIPT);
  const [choice, setChoice] = useState<boolean | null>(null);
  const open = choice ?? (still || step >= 1);
  const title = useRef<HTMLHeadingElement>(null);
  const card = useRef<HTMLElement | null>(null);
  const [focusTo, setFocusTo] = useState<"title" | "card" | null>(null);

  useEffect(() => {
    if (focusTo === "title") title.current?.focus({ preventScroll: true });
    if (focusTo === "card") card.current?.focus({ preventScroll: true });
  }, [focusTo, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setChoice(false);
      setFocusTo("card");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const openFrom = (el: HTMLElement) => {
    card.current = el;
    setChoice(true);
    setFocusTo("title");
  };
  const close = () => {
    // After the automatic open there's no clicked card yet: return focus to Onboarding v2.
    if (!card.current) card.current = document.querySelector<HTMLElement>('#why [aria-controls="why-drawer"]');
    setChoice(false);
    setFocusTo("card");
  };

  return (
    // The sequence watches the section (visible at every width), so phones auto-open too.
    <section ref={ref} id="why" className="relative py-24 sm:py-32">
      <SectionHeader num="02" label={W.label} title={W.headline} lead={W.line} />

      {/* md+: the board in a window, the drawer slides over it from the right */}
      <div data-reveal style={d(120)} className="window relative mt-14 hidden md:block">
        <WindowBar>{ROADMAP_COPY.board.product}</WindowBar>
        <div className="relative h-[460px] overflow-hidden p-6">
          <StaticBoard onOpen={openFrom} selected={open} />
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={close}
            className={`absolute inset-0 z-10 bg-bg/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
          />
          <div
            id="why-drawer"
            role="region"
            aria-labelledby="why-drawer-title"
            className={`absolute inset-y-0 right-0 z-20 w-[360px] overflow-y-auto border-l border-line bg-panel px-6 py-5 shadow-[-30px_0_60px_-30px_rgb(var(--shadow-rgb)/0.5)] transition-[transform,opacity,visibility] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:w-[400px] ${
              open ? "visible translate-x-0 opacity-100" : "invisible translate-x-full opacity-0"
            }`}
          >
            <DrawerBody on={open} titleRef={title} titleId="why-drawer-title" onClose={still ? undefined : close} />
          </div>
        </div>
      </div>

      {/* Phone: the stack, with the drawer as a card under Now */}
      <div className="mt-10 md:hidden">
        <PhoneStatic onOpen={() => setChoice(true)} open={open}>
          {open && (
            <div className="card mt-3 p-5">
              <DrawerBody on onClose={still ? undefined : () => setChoice(false)} />
            </div>
          )}
        </PhoneStatic>
      </div>
    </section>
  );
}
