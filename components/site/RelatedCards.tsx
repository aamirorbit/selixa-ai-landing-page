"use client";

import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { isValidElement, type ComponentType, type ReactNode } from "react";
import { d } from "@/components/landing/ui";

export type RelatedItem = {
  href: string;
  title: string;
  /** One line. */
  body: string;
  /**
   * A lucide icon component, or any node (e.g. a brand mark). From a server component,
   * pass an element (`icon={<Video />}`): components can't cross into client code.
   */
  icon?: LucideIcon | ReactNode;
  /** Small status in the top-right corner (large variant), e.g. an agent's status. */
  corner?: string;
  /** Footer label + value (large variant), e.g. Produces — Tasks with owners. */
  meta?: { label: string; value: string };
  /** Link text (large variant). Default "Learn more". */
  linkText?: string;
};

type RelatedCardsProps = {
  items: RelatedItem[];
  /** "large": hub index cards; "compact": a detail page's "Related" row. Default compact. */
  variant?: "compact" | "large";
  /** Optional small heading above the grid. */
  heading?: ReactNode;
  /** Hover / keyboard focus: the index of the active card, or null. */
  onActive?: (index: number | null) => void;
  /** Fade cards in on scroll, staggered 60ms (default true). */
  reveal?: boolean;
  /** Columns from lg up (default 3); 2 keeps a pair side by side from sm. */
  columns?: 2 | 3;
  className?: string;
};

function Icon({ icon, className }: { icon: RelatedItem["icon"]; className: string }) {
  if (icon == null || icon === false) return null;
  // Elements (from server components) are sized by the tile: any svg inside takes its box.
  if (isValidElement(icon) || typeof icon === "string" || typeof icon === "number")
    return <span className={`grid place-items-center [&_svg]:h-full [&_svg]:w-full ${className}`}>{icon}</span>;
  const C = icon as ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  return <C className={className} strokeWidth={1.6} aria-hidden />;
}

/** Hash links stay plain anchors so Lenis glides to them; routes go through next/link. */
function CardLink({ href, className, children, ...rest }: { href: string; className: string; children: ReactNode } & Record<string, unknown>) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

/**
 * Cross-links: agents, integrations, use cases. Each card is one link; hover and focus
 * light it (a pre-rendered layer fading in), fill the icon tile and nudge the arrow.
 */
export function RelatedCards({ items, variant = "compact", heading, onActive, reveal = true, columns = 3, className = "" }: RelatedCardsProps) {
  const large = variant === "large";
  return (
    <div className={className}>
      {heading && <p className="eyebrow mb-6">{heading}</p>}
      <ul className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
        {items.map((item, i) => (
          <li key={item.href + item.title} data-reveal={reveal ? "" : undefined} style={reveal ? d(i * 60) : undefined}>
            <CardLink
              href={item.href}
              onMouseEnter={onActive ? () => onActive(i) : undefined}
              onMouseLeave={onActive ? () => onActive(null) : undefined}
              onFocus={onActive ? () => onActive(i) : undefined}
              onBlur={onActive ? () => onActive(null) : undefined}
              className={`card group relative flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400/60 ${
                // Compact: a row on phones (icon · text · arrow), a small card from sm up
                large ? "min-h-[260px] p-7" : "max-sm:grid max-sm:grid-cols-[auto_minmax(0,1fr)_auto] max-sm:items-center max-sm:gap-x-4 max-sm:p-4 sm:p-5"
              }`}
            >
              {/* Lit layer: pre-rendered, only its opacity changes */}
              <span
                aria-hidden="true"
                className="card-lit pointer-events-none absolute -inset-px rounded-[14px] border opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              />

              <span className={`relative flex items-start justify-between gap-3 ${large ? "" : "max-sm:contents"}`}>
                {item.icon != null && (
                  <span
                    className={`grid shrink-0 place-items-center border border-line bg-ink/[0.03] text-brand-300 transition-colors duration-200 group-hover:border-brand-400/50 group-hover:bg-brand-500 group-hover:text-white group-focus-visible:bg-brand-500 group-focus-visible:text-white ${
                      large ? "h-11 w-11 rounded-[12px]" : "h-9 w-9 rounded-[10px] max-sm:relative max-sm:row-span-2 max-sm:h-8 max-sm:w-8"
                    }`}
                  >
                    <Icon icon={item.icon} className={large ? "h-[1.1875rem] w-[1.1875rem]" : "h-4 w-4"} />
                  </span>
                )}
                {large && item.corner && (
                  <span className="flex items-center gap-2 pt-1 text-[0.75rem] text-fg-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink/20" aria-hidden="true" />
                    {item.corner}
                  </span>
                )}
                {!large && (
                  <ArrowUpRight
                    className="h-4 w-4 text-fg-3 transition-transform duration-200 group-hover:translate-x-[3px] group-hover:text-fg group-focus-visible:translate-x-[3px] max-sm:relative max-sm:col-start-3 max-sm:row-span-2 max-sm:row-start-1"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                )}
              </span>

              {large ? (
                <>
                  <span className="relative mt-8 text-[1.25rem] font-medium tracking-[-0.015em] text-fg">{item.title}</span>
                  <span className="relative mt-2 text-[0.9375rem] leading-[1.55] text-fg-3">{item.body}</span>
                  <span className="relative mt-auto flex flex-col pt-6">
                    <span className="flex flex-col gap-1.5 border-t border-line pt-4">
                      {item.meta && (
                        <>
                          <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-fg-3">{item.meta.label}</span>
                          <span className="text-[0.875rem] text-fg-2">{item.meta.value}</span>
                        </>
                      )}
                    </span>
                    <span className="link-arrow mt-5 text-[0.875rem]">
                      {item.linkText ?? "Learn more"}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="relative mt-5 text-[1rem] text-fg max-sm:col-start-2 max-sm:row-start-1 max-sm:mt-0 max-sm:text-[0.9375rem]">{item.title}</span>
                  <span className="relative mt-1 text-[0.875rem] text-fg-3 max-sm:truncate sm:line-clamp-2 max-sm:col-start-2 max-sm:row-start-2 max-sm:mt-0.5 max-sm:text-[0.8125rem]">{item.body}</span>
                </>
              )}
            </CardLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
