import type { ReactNode } from "react";
import { d } from "@/components/landing/ui";

type PageHeroProps = {
  /** Shown in the .pill (text, or e.g. a breadcrumb with a link). */
  eyebrow: ReactNode;
  /** Live dot in the pill (default true). */
  live?: boolean;
  /** The h1, Satoshi Light, lowercase by convention. */
  title: ReactNode;
  /** One sentence under the headline. */
  line?: ReactNode;
  /** The page's signature visual, full container width. */
  visual?: ReactNode;
  /** "bottom" (default): under the line. "top": between the pill and the headline (the headline captions it). */
  visualPosition?: "top" | "bottom";
  /** Anything under the visual, e.g. a scroll hint. */
  after?: ReactNode;
  /** Default "center". */
  align?: "center" | "left";
  /** Fill the first screen on md+ (min-h calc(100svh - 4.5rem)), content centred. */
  fill?: boolean;
  /** Soft rings and glow behind the headline, as on the home hero (default true). */
  rings?: boolean;
  /** Tight top padding and none below, for a hero that hands straight on to a visual section. */
  compact?: boolean;
  className?: string;
};

/**
 * The top of every inner page: eyebrow pill → headline → one line → signature visual.
 * Revealed on load with the same staggered `.reveal` as the home hero.
 */
export function PageHero({
  eyebrow,
  live = true,
  title,
  line,
  visual,
  visualPosition = "bottom",
  after,
  align = "center",
  fill = false,
  rings = true,
  compact = false,
  className = "",
}: PageHeroProps) {
  const center = align === "center";
  return (
    <section
      className={`relative flex flex-col justify-center ${
        compact ? "pb-0 pt-6 sm:pt-10" : `py-14 sm:py-16 ${fill ? "md:min-h-[calc(100svh-4.5rem)] lg:py-10" : "sm:pt-24"}`
      } ${className}`}
    >
      {rings && (
        <div aria-hidden="true" className="fade pointer-events-none absolute inset-0 grid place-items-center" style={d(300)}>
          <div className="absolute aspect-square w-[min(92vw,56rem)] rounded-full border border-ink/[0.05]" />
          <div className="spin-slow absolute aspect-square w-[min(72vw,42rem)] rounded-full border border-dashed border-ink/[0.07]" />
          <div className="absolute aspect-square w-[min(52vw,28rem)] rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.12),transparent_68%)]" />
        </div>
      )}

      <PageHeroTitle
        eyebrow={eyebrow}
        live={live}
        title={title}
        line={line}
        align={align}
        afterEyebrow={visual && visualPosition === "top" ? <div className="reveal relative mt-10 w-full" style={d(140)}>{visual}</div> : undefined}
      />

      {visual && visualPosition === "bottom" && (
        <div className="reveal relative mt-14 w-full" style={d(320)}>
          {visual}
        </div>
      )}

      {after && (
        <div className={`reveal relative mt-8 flex ${center ? "justify-center" : ""}`} style={d(420)}>
          {after}
        </div>
      )}
    </section>
  );
}

type PageHeroTitleProps = Pick<PageHeroProps, "eyebrow" | "live" | "title" | "line" | "align"> & {
  className?: string;
  /** "compact": a smaller headline for heroes that share their row (e.g. /contact). */
  size?: "default" | "compact";
  /** Rendered between the pill and the headline. */
  afterEyebrow?: ReactNode;
};

/**
 * PageHero's title block on its own (pill, h1, line), for heroes whose headline sits on
 * a visual rather than above it (e.g. inside a scroll scene). Same look and load reveal.
 */
export function PageHeroTitle({ eyebrow, live = true, title, line, align = "center", className = "", afterEyebrow, size = "default" }: PageHeroTitleProps) {
  const center = align === "center";
  return (
    <div className={`relative flex flex-col ${center ? "items-center text-center" : "items-start text-left"} ${className}`}>
      <span className="reveal pill gap-2.5 px-4 py-3" style={d(60)}>
        {live && <span className="live-dot" aria-hidden="true" />}
        {eyebrow}
      </span>
      {afterEyebrow}

      <h1
        className={`reveal mt-8 max-w-[18ch] font-display font-light leading-[0.95] tracking-[-0.05em] text-fg text-balance md:max-w-none ${
          size === "compact" ? "text-[clamp(2.75rem,5.4vw,4.75rem)]" : "text-[clamp(2.75rem,6.4vw,5.75rem)]"
        }`}
        style={d(140)}
      >
        {title}
      </h1>

      {line && (
        <p className="reveal mt-6 max-w-[38rem] text-[1.125rem] leading-[1.6] text-fg-2 text-pretty sm:text-[1.25rem]" style={d(220)}>
          {line}
        </p>
      )}
    </div>
  );
}
