"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandMark } from "@/components/landing/BrandMark";
import type { BrandLogo } from "@/components/landing/logos";

export type Tool = {
  logo: BrandLogo;
  /** One line: what Selixa reads or writes there. */
  caption?: string;
  /** e.g. "Coming soon", shown as a tag under the name. */
  status?: string;
  /** The integration's page, once it exists. */
  href?: string;
};

type ToolStripProps = {
  tools: Tool[];
  /** Tile size: md 64px (default), lg 88px (72px on phones). */
  size?: "md" | "lg";
  /** When marks take their brand colour (default "inView": once the strip is on screen). */
  lit?: "always" | "inView" | "hover";
  align?: "left" | "center";
  className?: string;
};

/** A row of integration marks with names: marks go from monochrome to brand colour. */
export function ToolStrip({ tools, size = "md", lit = "inView", align = "left", className = "" }: ToolStripProps) {
  const ref = useRef<HTMLUListElement>(null);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (lit !== "inView" || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lit]);

  const tile = size === "lg" ? "h-[72px] w-[72px] sm:h-[88px] sm:w-[88px]" : "h-16 w-16";

  return (
    <ul ref={ref} className={`flex flex-wrap gap-x-6 gap-y-8 ${align === "center" ? "justify-center" : ""} ${className}`}>
      {tools.map((t, i) => {
        const on = lit === "always" || (lit === "inView" && seen) || (lit === "hover" && hover === i);
        const body: ReactNode = (
          <>
            <span className={`card grid place-items-center rounded-[16px]! ${tile}`}>
              <BrandMark logo={t.logo} lit={on} className="h-[40%] w-[40%]" />
            </span>
            <span className="mt-3 text-[0.8125rem] text-fg-2">{t.logo.name}</span>
            {t.caption && <span className="mt-1 max-w-[10rem] truncate text-[0.75rem] text-fg-3">{t.caption}</span>}
            {t.status && <span className="tag mt-2 px-2 py-0.5 text-[0.6875rem]">{t.status}</span>}
          </>
        );
        const cls = "flex flex-col items-center text-center";
        return (
          <li key={t.logo.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            {t.href ? (
              <Link href={t.href} className={cls}>
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
