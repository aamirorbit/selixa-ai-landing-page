import type { ReactNode } from "react";

/** A keyboard key, e.g. ⌘K or ↵. */
export function Kbd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={`inline-grid h-6 min-w-6 place-items-center rounded-[6px] border border-line bg-ink/[0.04] px-1.5 font-sans text-[0.75rem] font-medium tabular-nums text-fg-3 ${className}`}
    >
      {children}
    </kbd>
  );
}
