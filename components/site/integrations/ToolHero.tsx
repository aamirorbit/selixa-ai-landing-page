"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { BrandMark } from "@/components/landing/BrandMark";
import type { BrandLogo } from "@/components/landing/logos";
import { Orb } from "@/components/landing/ui";
import { useInView } from "../useInView";
import type { ToolLook } from "./look";

/**
 * ToolWash: the tool's own colour, as a soft wash behind its hero only (it runs up under the
 * nav and fades out before the next section). Near-black brands get a neutral spotlight.
 */
export function ToolWash({ look, children }: { look: ToolLook; children: ReactNode }) {
  const vars = {
    "--tool-rgb": look.rgb === "ink" ? "var(--ink-rgb)" : look.rgb,
    "--tool-a-dark": look.aDark,
    "--tool-a-light": look.aLight,
  } as CSSProperties;
  return (
    <div className="tool-wash relative isolate" style={vars}>
      <div aria-hidden="true" className="tool-wash-layer pointer-events-none absolute inset-x-[calc(50%-50vw)] -top-[4.5rem] bottom-0 -z-10" />
      {children}
    </div>
  );
}

/**
 * ToolConnector: the tool's mark and the Selixa orb with two lanes between them. Reads flow in
 * (a packet in the tool's colour), writes flow back (a brand packet). Packets run only in view.
 */
export function ToolConnector({ logo, look, label }: { logo: BrandLogo; look: ToolLook; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(700);
  const ink = look.rgb === "ink";
  const packet = (dir: "out" | "back", color: string, delay: number) => (
    <span
      className="lane-packet absolute -top-[2.5px] left-0 block h-1.5 w-1.5 rounded-full"
      data-dir={dir}
      style={{ background: color, boxShadow: `0 0 10px ${color}`, "--lane": "var(--lane-w)", "--lane-ms": "2.2s", "--lane-delay": `${delay}s` } as CSSProperties}
    />
  );
  return (
    <div ref={ref} data-inview={inView ? "" : undefined} className="flex flex-col items-center">
      <div aria-hidden="true" className="flex items-center gap-4 [--lane-w:96px] sm:gap-5 md:[--lane-w:160px] lg:[--lane-w:200px]">
        <span
          className={`grid h-[72px] w-[72px] place-items-center rounded-[20px] border sm:h-24 sm:w-24 sm:rounded-[24px] ${
            ink ? "border-line-strong bg-panel-2" : "border-[rgb(var(--tool-rgb)/0.35)] bg-panel"
          }`}
          style={{
            boxShadow: ink
              ? "0 20px 60px -24px rgb(var(--ink-rgb) / 0.25), inset 0 1px 0 rgb(var(--ink-rgb) / 0.06)"
              : "0 20px 60px -24px rgb(var(--tool-rgb) / 0.7), inset 0 1px 0 rgb(var(--ink-rgb) / 0.06)",
          }}
        >
          <BrandMark logo={logo} lit className="h-9 w-9 sm:h-12 sm:w-12" />
        </span>
        <span className="flex w-[var(--lane-w)] flex-col gap-2.5">
          <span className="relative block h-px bg-ink/[0.14]">
            {packet("out", ink ? "var(--color-fg)" : "rgb(var(--tool-rgb))", 0)}
            <ChevronRight className="absolute -right-1.5 -top-[5px] h-2.5 w-2.5 text-fg-3" strokeWidth={2} />
          </span>
          <span className="relative block h-px bg-ink/[0.14]">
            {packet("back", "var(--color-brand-400)", 1.1)}
            <ChevronLeft className="absolute -left-1.5 -top-[5px] h-2.5 w-2.5 text-fg-3" strokeWidth={2} />
          </span>
        </span>
        <span className="sm:hidden">
          <Orb size={72} />
        </span>
        <span className="hidden sm:block">
          <Orb size={96} />
        </span>
      </div>
      <p className="mt-3.5 text-[0.8125rem] text-fg-3">{label}</p>
    </div>
  );
}
