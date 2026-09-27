"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { BrandMark } from "@/components/landing/BrandMark";
import type { BrandLogo } from "@/components/landing/logos";
import { Orb } from "@/components/landing/ui";
import { Initials } from "./Initials";

/*
 * DocSurface: a document sheet, with sections, citations and margin notes.
 *
 *   <DocSurface tone="paper" header={…} margin footer={<Bar />}>
 *     <DocSection num="01" heading="Problem" written={w} step={s} notes={<MarginNote … />}>
 *       <DocBlock index={0}><p>… <Cite n={1} source={…} /></p></DocBlock>
 *     </DocSection>
 *   </DocSurface>
 *
 * - tone "paper": a light sheet in both schemes (the .doc-paper token scope); "page" follows
 *   the page's scheme (blog posts).
 * - DocSection renders a written or a reserved (skeleton) frame. Writing choreography lives
 *   in the page, which drives `written` and `step`: the heading shows from step 1, block i
 *   from step i + 2. Default written = true, so static content (blog) just renders.
 * - Cite is a disclosure: a [n] chip that opens a source card. One open at a time per sheet;
 *   Open state is keyed per chip (its `id`, or a generated one), so two [1]s never open together;
 *   control it from the page with DocSurface's `openCite` / `onOpenCite` (by chip id) if needed.
 * - MarginNote is a comment thread: in the right margin at ≥ lg (with `margin`), inline
 *   with a left rule below that.
 */

type DocCtx = {
  margin: boolean;
  openCite: string | null;
  setOpenCite: (key: string | null) => void;
};
const DocContext = createContext<DocCtx>({ margin: false, openCite: null, setOpenCite: () => {} });

type SectionCtx = { written: boolean; step: number };
const SectionContext = createContext<SectionCtx>({ written: true, step: Infinity });

/** The current section's write state, for page-local pieces (stats, strikes) that time their own beat. */
export const useDocSection = () => useContext(SectionContext);

type DocSurfaceProps = {
  /** "paper": light sheet in both schemes; "page" (default): follows the scheme. */
  tone?: "paper" | "page";
  /** Doc chrome row (breadcrumb, state, avatars). */
  header?: ReactNode;
  /** Reserve a 280px right margin column at ≥ lg for MarginNotes. */
  margin?: boolean;
  /** A sticky footer bar that rides the bottom of the viewport while the sheet is on screen. */
  footer?: ReactNode;
  as?: "article" | "div";
  id?: string;
  /** Controlled citation state (optional). */
  /** The open chip's id (Cite `id`). */
  openCite?: string | null;
  onOpenCite?: (key: string | null) => void;
  className?: string;
  children: ReactNode;
};

export function DocSurface({ tone = "page", header, margin = false, footer, as: Tag = "article", id, openCite, onOpenCite, className = "", children }: DocSurfaceProps) {
  const [own, setOwn] = useState<string | null>(null);
  const controlled = openCite !== undefined;
  const current = controlled ? openCite : own;
  const setOpenCite = (n: string | null) => {
    if (!controlled) setOwn(n);
    onOpenCite?.(n);
  };

  // Escape closes the open citation.
  useEffect(() => {
    if (current == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (!controlled) setOwn(null);
      onOpenCite?.(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, controlled, onOpenCite]);

  return (
    <DocContext.Provider value={{ margin, openCite: current, setOpenCite }}>
      <Tag
        id={id}
        className={`doc ${tone === "paper" ? "doc-paper" : ""} rounded-[16px] px-5 pt-8 md:rounded-[20px] md:px-12 md:pt-12 lg:rounded-[24px] lg:px-[72px] lg:pt-14 ${className}`}
      >
        {header && (
          <div className="-mx-5 -mt-8 flex h-14 items-center justify-between gap-4 border-b border-line px-5 md:-mx-12 md:-mt-12 md:px-12 lg:-mx-[72px] lg:-mt-14 lg:px-[72px]">
            {header}
          </div>
        )}
        {children}
        {footer && <div className="sticky bottom-3 z-20 mt-16 sm:bottom-4 lg:-mx-10">{footer}</div>}
        <div className="h-10" aria-hidden="true" />
      </Tag>
    </DocContext.Provider>
  );
}

type DocSectionProps = {
  id?: string;
  /** "01" */
  num?: string;
  heading: ReactNode;
  /** MarginNote(s): margin column at ≥ lg, inline after the body below that. */
  notes?: ReactNode;
  /** false → the reserved skeleton frame; true (default) → finished. */
  written?: boolean;
  /** Write step: heading shows from 1, block i from i + 2. */
  step?: number;
  /** Rendered in the heading's place while it's being written (e.g. a typing heading). */
  headingNode?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function DocSection({ id, num, heading, notes, written = true, step = Infinity, headingNode, className = "", children }: DocSectionProps) {
  const { margin } = useContext(DocContext);
  const headingShown = written || step >= 1;
  return (
    <SectionContext.Provider value={{ written, step: written ? Infinity : step }}>
      <section
        id={id}
        data-written={written}
        className={`pt-10 md:pt-14 ${margin ? "lg:grid lg:grid-cols-[minmax(0,680px)_280px] lg:gap-x-14" : "max-w-[680px]"} ${className}`}
      >
        <div className="min-w-0">
          <h2 className="relative flex items-baseline gap-4">
            {num && <span className="text-[0.8125rem] tabular-nums text-fg-3">{num}</span>}
            <span className="relative grid flex-1 [&>*]:col-start-1 [&>*]:row-start-1">
              <span
                aria-hidden="true"
                className={`mt-2 h-2.5 w-2/5 self-start rounded-[4px] bg-ink/[0.07] transition-opacity duration-150 ${headingShown ? "opacity-0" : "opacity-100"}`}
              />
              <span className={`text-[1.1875rem] font-medium tracking-[-0.02em] text-fg md:text-[1.375rem] ${headingShown ? "" : "opacity-0"}`}>
                {headingNode && !written ? headingNode : heading}
              </span>
            </span>
          </h2>
          <div className="mt-4 text-[1rem] leading-[1.65] text-fg-2 md:text-[1.0625rem] md:leading-[1.7]">{children}</div>
        </div>
        {notes && <div className="mt-5 flex flex-col gap-4 lg:mt-[52px] lg:self-start">{notes}</div>}
      </section>
    </SectionContext.Provider>
  );
}

type DocBlockProps = {
  /** Order within the section (0 = first block after the heading). */
  index: number;
  as?: "div" | "p" | "li" | "blockquote";
  /** Skeleton line pitch (CSS length), matching the block's line-height. Default 1.7em. */
  pitch?: string;
  className?: string;
  children: ReactNode;
};

/** A block of a section's body: covered by skeleton lines until its step, then fades up. */
export function DocBlock({ index, as: Tag = "div", pitch, className = "", children }: DocBlockProps) {
  const { written, step } = useContext(SectionContext);
  const shown = written || step >= index + 2;
  const Inner = Tag === "p" ? "span" : "div";
  return (
    <Tag data-shown={shown} className={`relative ${className}`} style={pitch ? ({ "--skel-pitch": pitch } as React.CSSProperties) : undefined}>
      <span aria-hidden="true" className="doc-skel" />
      <Inner className="doc-text block">{children}</Inner>
    </Tag>
  );
}

/* ---------- Citations ---------- */

export type CiteSource = {
  kind: string;
  title: string;
  meta?: string;
  quote?: string;
  icon?: LucideIcon;
  logo?: BrandLogo;
  /** Where the source lives (a real page), and its link text. */
  href?: string;
  linkText?: string;
};

type CiteProps = {
  n: number;
  source: CiteSource;
  /** Stable id, to open this chip from the page (e.g. a one-time demo). Default: generated. */
  id?: string;
};

/**
 * An inline [n] citation: a disclosure button that opens a source card under the line.
 * The nearest positioned ancestor (a DocBlock) is the popover's containing block.
 */
export function Cite({ n, source, id }: CiteProps) {
  const { openCite, setOpenCite } = useContext(DocContext);
  const popId = useId();
  const key = id ?? popId;
  const open = openCite === key;
  const chip = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLSpanElement>(null);
  const [left, setLeft] = useState(0);

  // Outside click closes.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (chip.current?.contains(t) || pop.current?.contains(t)) return;
      setOpenCite(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, setOpenCite]);

  const toggle = () => {
    // Place once on open (not on scroll): left-aligned to the chip, clamped to the block.
    const c = chip.current;
    const block = c?.offsetParent as HTMLElement | null;
    if (c && block) {
      const max = Math.max(0, block.clientWidth - Math.min(320, block.clientWidth));
      setLeft(Math.min(Math.max(0, c.offsetLeft - 8), max));
    }
    setOpenCite(open ? null : key);
  };

  const Icon = source.icon;
  return (
    <>
      <button
        ref={chip}
        type="button"
        className="cite"
        aria-expanded={open}
        aria-controls={popId}
        title={`${source.kind} · ${source.title}`}
        onClick={toggle}
      >
        {n}
      </button>
      <span ref={pop} id={popId} role="region" aria-label={`Source ${n}`} data-open={open} className="cite-pop block text-left" style={{ left }}>
        <span className="flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.08em] text-fg-3">
          {source.logo ? (
            <BrandMark logo={source.logo} lit={false} className="h-4 w-4" />
          ) : (
            Icon && (
              <span className="grid h-5 w-5 place-items-center rounded-[6px] border border-line bg-ink/[0.03] text-brand-300">
                <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
              </span>
            )
          )}
          {source.kind}
          {source.meta && <span className="ml-auto normal-case tracking-normal">{source.meta}</span>}
        </span>
        <span className="mt-2.5 block text-[0.875rem] font-medium text-fg">{source.title}</span>
        {source.quote && <span className="mt-1 line-clamp-3 block text-[0.875rem] leading-[1.5] text-fg-2">“{source.quote}”</span>}
        {source.href && source.linkText && (
          <Link href={source.href} className="link-arrow mt-3 text-[0.75rem] text-fg-2" tabIndex={open ? 0 : -1}>
            {source.linkText}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </Link>
        )}
      </span>
    </>
  );
}

/* ---------- Margin notes ---------- */

export type MarginMessage = {
  author: string;
  selixa?: boolean;
  time?: string;
  body: ReactNode;
  /** Default true. */
  shown?: boolean;
  /** Selixa typing: dots in the message slot. */
  thinking?: boolean;
};

type MarginNoteProps = {
  /** id of the highlighted phrase this thread is about. */
  anchorId: string;
  messages: MarginMessage[];
  /** Show the Resolved tag (with its label). */
  resolved?: boolean;
  resolvedLabel?: string;
  /** Hover/focus on the thread (to raise the anchor's highlight). */
  onActive?: (active: boolean) => void;
  className?: string;
};

export function MarginNote({ anchorId, messages, resolved, resolvedLabel = "Resolved", onActive, className = "" }: MarginNoteProps) {
  const { margin } = useContext(DocContext);
  return (
    <aside
      aria-describedby={anchorId}
      onMouseEnter={() => onActive?.(true)}
      onMouseLeave={() => onActive?.(false)}
      onFocus={() => onActive?.(true)}
      onBlur={() => onActive?.(false)}
      className={`relative border-l-2 border-brand-400/40 pl-4 ${
        margin ? "lg:w-[280px] lg:rounded-[12px] lg:border lg:border-line lg:bg-panel lg:p-4 lg:shadow-[0_10px_30px_-18px_rgb(var(--shadow-rgb)/0.5)]" : ""
      } ${className}`}
    >
      <span
        className={`tag absolute right-0 top-0 gap-1 px-1.5 py-0.5 text-[0.6875rem] transition-opacity duration-200 lg:right-3 lg:top-3 ${resolved ? "opacity-100" : "opacity-0"}`}
      >
        <svg viewBox="0 0 24 24" className="h-[11px] w-[11px]" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {resolvedLabel}
      </span>
      {messages.map((m, i) => {
        const shown = m.shown ?? true;
        return (
          <div
            key={i}
            className={`st ${i ? "mt-3 border-t border-line pt-3" : ""} ${m.selixa ? "ml-3 border-l border-brand-400/40 pl-3" : ""}`}
            data-on={shown}
          >
            <p className="flex items-center gap-2 pr-16">
              {m.selixa ? <Orb size={20} /> : <Initials name={m.author} size={20} />}
              <span className="text-[0.78125rem] font-medium text-fg">{m.author}</span>
              {m.time && <span className="text-[0.75rem] text-fg-3">{m.time}</span>}
            </p>
            <div className="relative mt-1.5 text-[0.84375rem] leading-[1.55] text-fg-2">
              <span className={`thinking absolute left-0 top-1.5 transition-opacity duration-200 ${m.thinking ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <div className={`transition-opacity duration-[280ms] ${m.thinking ? "opacity-0" : "opacity-100"}`}>{m.body}</div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}

/**
 * A highlighted phrase a margin note is about. An inline background with
 * box-decoration-break: clone, so every wrapped line is tinted; its colour fades once when the
 * thread appears (not tied to scroll), and deepens while the thread is hovered or focused.
 */
export function Highlight({ id, on, strong, block, children }: { id: string; on: boolean; strong?: boolean; block?: boolean; children: ReactNode }) {
  const Tag = block ? "div" : "span";
  return (
    <Tag
      id={id}
      className={`${block ? "-mx-2 rounded-[8px] px-2 py-1" : "rounded-[2px]"} transition-[background-color,box-shadow] duration-200 [box-decoration-break:clone] [-webkit-box-decoration-break:clone] ${
        on
          ? strong
            ? "bg-brand-500/[0.14] shadow-[inset_0_-1px_0_rgb(var(--brand-400-rgb)/0.6)]"
            : "bg-brand-500/[0.08] shadow-[inset_0_-1px_0_rgb(var(--brand-400-rgb)/0.4)]"
          : "bg-transparent"
      }`}
    >
      {children}
    </Tag>
  );
}
