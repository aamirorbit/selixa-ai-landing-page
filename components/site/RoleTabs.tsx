"use client";

import { useRef, type KeyboardEvent } from "react";

type RoleTabsProps = {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  /** aria-label for the tablist. */
  label: string;
  /** Tab id = `${idPrefix}-tab-${id}`, panel id = `${idPrefix}-panel-${id}`. */
  idPrefix: string;
  /** "responsive" (default): wrap to centred lines from md, one scrolling row below. */
  wrap?: "lines" | "scroll" | "responsive";
  className?: string;
};

/**
 * A row of chips that works as tabs (automatic activation): ←/→ move and select (wrapping),
 * Home/End jump. The selected chip has a brand dot whose slot is always reserved, so chips
 * never change width. On a scrolling row, picking centres the chip in the row only (never
 * scrolls the page).
 */
export function RoleTabs({ items, value, onChange, label, idPrefix, wrap = "responsive", className = "" }: RoleTabsProps) {
  const row = useRef<HTMLDivElement>(null);
  const tabs = useRef(new Map<string, HTMLButtonElement>());

  const pick = (id: string, focus = false) => {
    onChange(id);
    const el = tabs.current.get(id);
    if (focus) el?.focus({ preventScroll: true });
    const r = row.current;
    if (el && r && r.scrollWidth > r.clientWidth) {
      r.scrollTo({ left: el.offsetLeft - (r.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
    }
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = items.findIndex((t) => t.id === value);
    const n = items.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    pick(items[next].id, true);
  };

  const layout =
    wrap === "lines"
      ? "flex-wrap justify-center"
      : wrap === "scroll"
        ? "chip-row -mx-5 snap-x scroll-px-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        : "chip-row -mx-5 snap-x scroll-px-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:[mask-image:none] md:justify-center md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden";

  return (
        // relative: the row is its chips' offsetParent, so centring uses the right offsets
    <div ref={row} role="tablist" aria-label={label} className={`relative flex gap-2 ${layout} ${className}`}>
      {items.map((t) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              if (el) tabs.current.set(t.id, el);
              else tabs.current.delete(t.id);
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${t.id}`}
            aria-selected={on}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            tabIndex={on ? 0 : -1}
            onClick={() => pick(t.id)}
            onKeyDown={onKey}
            className={`flex h-10 shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full border pl-2.5 pr-4 text-[0.9375rem] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400/60 ${
              on ? "border-brand-400/40 bg-brand-500/10 text-fg" : "border-line bg-ink/[0.02] text-fg-2 hover:border-line-strong hover:text-fg"
            }`}
          >
            <span className="grid w-3 place-items-center" aria-hidden="true">
              <span className={`h-1.5 w-1.5 rounded-full bg-brand-400 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`} />
            </span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
