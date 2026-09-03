import type { CSSProperties } from "react";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="reveal flex items-center justify-between pt-5 sm:pt-6" style={{ "--d": "0ms" } as CSSProperties}>
      <Logo />
      <span className="pill px-4 py-3 sm:px-5 sm:py-3.5">
        <span
          aria-hidden="true"
          className="h-[7px] w-[7px] rounded-full bg-brand-400 shadow-[0_0_10px_2px_rgb(var(--brand-400-rgb)/0.55)]"
        />
        Private Deployments
      </span>
    </header>
  );
}
