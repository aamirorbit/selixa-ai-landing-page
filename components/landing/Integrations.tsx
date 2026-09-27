"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { BrandMark as Logo } from "./BrandMark";
import { LOGOS } from "./logos";
import { Orb, Section, SectionHeader, d } from "./ui";

export function Integrations() {
  // Lit only while pointed at (or focused) — nothing cycles on its own.
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Section id="integrations">
      <SectionHeader num="11" label="Integrations" align="center" className="mx-auto" title="Bring your product context with you." />

      <ul
        data-reveal
        style={d(120)}
        className="mx-auto mt-14 grid max-w-[64rem] grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-3 lg:grid-cols-4"
      >
        {LOGOS.map((logo, i) => {
          const lit = hovered === i;
          return (
            <li
              key={logo.name}
              tabIndex={0}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className={`flex cursor-default items-center gap-4 outline-none px-5 py-6 transition-colors duration-700 sm:px-6 sm:py-7 ${lit ? "bg-[color-mix(in_oklab,var(--color-bg)_93%,rgb(var(--brand-500-rgb)))]" : "bg-bg"}`}
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border transition-[border-color,box-shadow,background-color] duration-700 ${
                  lit
                    ? "border-ink/20 bg-ink/[0.06] shadow-[0_10px_30px_-12px_rgb(var(--brand-glow-rgb)/0.6)]"
                    : "border-line bg-ink/[0.025]"
                }`}
              >
                <Logo logo={logo} lit={lit} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[1rem] tracking-[-0.01em] text-fg">{logo.name}</span>
                <span className="flex items-center gap-1.5 text-[0.75rem] text-fg-3">
                  {lit ? (
                    <>
                      <Check className="h-3 w-3 text-brand-400" strokeWidth={2.5} aria-hidden="true" />
                      <span className="text-brand-300">Synced</span>
                    </>
                  ) : (
                    logo.kind
                  )}
                </span>
              </span>
            </li>
          );
        })}
        <li className="flex items-center gap-4 bg-[radial-gradient(120%_120%_at_0%_0%,rgb(var(--brand-500-rgb)/0.14),transparent_60%),var(--color-bg)] px-5 py-6 sm:px-6 sm:py-7">
          <Orb size={48} className="shrink-0" />
          <span className="flex flex-col">
            <span className="text-[1rem] tracking-[-0.01em] text-fg">Selixa</span>
            <span className="text-[0.75rem] text-fg-3">Per-product memory</span>
          </span>
        </li>
      </ul>
    </Section>
  );
}
