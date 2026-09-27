"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState, type KeyboardEvent, type Ref } from "react";
import { BrandMark } from "@/components/landing/BrandMark";
import type { BrandLogo } from "@/components/landing/logos";
import type { Integration } from "@/lib/content/integrations";

type ToolProps = {
  variant?: "tool";
  integration: Integration;
  logo: BrandLogo;
  size?: "sm" | "md";
  /** Lit from outside (the top result of a typed query). Hover and focus light it too. */
  lit?: boolean;
  /** Called when this tile is hovered/focused (so a parent can keep one lit tile). */
  onActive?: (active: boolean) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLAnchorElement>) => void;
  ref?: Ref<HTMLAnchorElement>;
  className?: string;
};

type RequestProps = { variant: "request"; href: string; title: string; body: string; size?: "sm" | "md"; className?: string };

/**
 * An integration: its mark (monochrome at rest), name, and category, swapping to the tool's
 * one-line job when lit. Lit only by the visitor: hover, focus, or being the top result of
 * their search. Nothing lights on its own.
 */
export function IntegrationTile(props: ToolProps | RequestProps) {
  if (props.variant === "request") return <RequestTile {...props} />;
  return <ToolTile {...props} />;
}

function ToolTile({ integration, logo, size = "md", lit: litProp, onActive, onKeyDown, ref, className = "" }: ToolProps) {
  const [hover, setHover] = useState(false);
  const lit = hover || !!litProp;
  const sm = size === "sm";
  const activate = (on: boolean) => {
    setHover(on);
    onActive?.(on);
  };
  const show = (on: boolean) => (on ? "opacity-100" : "opacity-0");

  return (
    <Link
      ref={ref}
      href={`/integrations/${integration.slug}`}
      aria-label={`${integration.name} integration`}
      onMouseEnter={() => activate(true)}
      onMouseLeave={() => activate(false)}
      onFocus={() => activate(true)}
      onBlur={() => activate(false)}
      onKeyDown={onKeyDown}
      className={`card group relative flex rounded-[16px]! outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400/60 ${
        sm ? "h-16 items-center gap-3 p-3" : "h-[124px] flex-col items-start justify-between p-4 sm:h-[88px] sm:flex-row sm:items-center sm:justify-start sm:gap-4 sm:p-5"
      } ${className}`}
    >
      <span aria-hidden="true" className={`card-lit pointer-events-none absolute -inset-px rounded-[16px] border transition-opacity duration-200 ${show(lit)}`} />
      <span
        className={`relative grid shrink-0 place-items-center rounded-[14px] border transition-[border-color,background-color,box-shadow] duration-200 ${
          sm ? "h-10 w-10" : "h-10 w-10 sm:h-12 sm:w-12"
        } ${lit ? "border-ink/20 bg-ink/[0.06] shadow-[0_10px_30px_-12px_rgb(var(--brand-glow-rgb)/0.6)]" : "border-line bg-ink/[0.025]"}`}
      >
        <BrandMark logo={logo} lit={lit} duration={200} className={sm ? "h-5 w-5" : "h-5 w-5 sm:h-6 sm:w-6"} />
      </span>
      <span className="relative flex min-w-0 flex-col">
        <span className={`truncate tracking-[-0.01em] text-fg ${sm ? "text-[0.9375rem]" : "text-[1rem]"}`}>{integration.name}</span>
        {!sm && (
          <span className="grid text-[0.75rem] text-fg-3 [&>*]:col-start-1 [&>*]:row-start-1">
            <span className={`transition-opacity duration-150 ${show(!lit)}`}>{integration.category}</span>
            <span className={`truncate transition-opacity duration-150 ${show(lit)}`} aria-hidden="true">
              {integration.job}
            </span>
          </span>
        )}
      </span>
      <ArrowUpRight
        className={`absolute right-3.5 top-3.5 h-3.5 w-3.5 text-fg-3 transition-[opacity,transform] duration-200 ${lit ? "translate-x-0 translate-y-0 opacity-100" : "-translate-x-0.5 translate-y-0.5 opacity-0"}`}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Link>
  );
}

function RequestTile({ href, title, body, size = "md", className = "" }: RequestProps) {
  const sm = size === "sm";
  return (
    <a
      href={href}
      className={`group relative flex rounded-[16px] border border-dashed border-line-strong transition-colors duration-200 hover:border-ink/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400/60 ${
        sm ? "h-16 items-center gap-3 p-3" : "h-[124px] flex-col items-start justify-between p-4 sm:h-[88px] sm:flex-row sm:items-center sm:justify-start sm:gap-4 sm:p-5"
      } ${className}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] border border-dashed border-line-strong text-fg-3 sm:h-12 sm:w-12">
        <Plus className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[1rem] tracking-[-0.01em] text-fg">{title}</span>
        <span className="text-[0.75rem] text-fg-3">{body}</span>
      </span>
    </a>
  );
}
