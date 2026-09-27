import type { LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/landing/BrandMark";
import type { BrandLogo } from "@/components/landing/logos";

type SourceChipProps = {
  /** An integration's mark (components/landing/logos.ts)… */
  logo?: BrandLogo;
  /** …or a lucide icon, for non-brand sources ("Meeting Agent"). */
  icon?: LucideIcon;
  label: string;
  /** Brand colour on the mark (default false: monochrome). */
  lit?: boolean;
  /** "sm" is 11px text, 22px tall; "md" is the regular .tag. */
  size?: "sm" | "md";
  /** Hide the label below 360px wide (the mark stays). */
  compactLabel?: boolean;
  className?: string;
};

/** A small chip naming where something came from: a mark or icon, then the label. */
export function SourceChip({ logo, icon: Icon, label, lit = false, size = "md", compactLabel, className = "" }: SourceChipProps) {
  const sm = size === "sm";
  const mark = sm ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <span className={`tag ${sm ? "h-[22px] gap-1.5 px-2 py-0 text-[0.6875rem]" : ""} ${className}`}>
      {logo ? (
        <BrandMark logo={logo} lit={lit} className={`${mark} shrink-0`} />
      ) : (
        Icon && <Icon className={`${mark} shrink-0 text-brand-300`} strokeWidth={1.75} aria-hidden="true" />
      )}
      <span className={compactLabel ? "max-[359px]:sr-only" : ""}>{label}</span>
    </span>
  );
}
