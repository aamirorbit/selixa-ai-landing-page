import { ChevronDown } from "lucide-react";

/** A quiet "keep scrolling" link under a hero: 13px, with a bobbing chevron. Lenis glides to the anchor. */
export function ScrollHint({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="flex items-center gap-1.5 text-[0.8125rem] text-fg-3 transition-colors duration-200 hover:text-fg">
      {children}
      <ChevronDown className="bob h-3 w-3" strokeWidth={2} aria-hidden="true" />
    </a>
  );
}
