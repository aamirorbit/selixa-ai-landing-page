"use client";

import { Orb } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { TumbleWord } from "@/components/site/TumbleWord";

/** The 404's headline: "not found." with every letter out of place, then (once) in line. */
export function NotFoundWord({ text }: { text: string }) {
  // Scattered for 700ms, then settle and stop. The server frame is settled.
  const { ref, step, still } = useSequence<HTMLDivElement>([700, 1], { loop: false });
  const settled = still || step >= 1;
  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative [@media(max-height:640px)]:hidden">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-[-110%] -z-10 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.5),transparent_62%)] transition-opacity duration-500 ${settled ? "opacity-0" : "opacity-60"}`}
        />
        <span className="max-sm:hidden">
          <Orb size={56} />
        </span>
        <span className="sm:hidden">
          <Orb size={44} />
        </span>
      </div>
      <h1
        aria-label={text}
        className="mt-8 whitespace-nowrap font-display text-[clamp(3.5rem,13vw,10rem)] font-light leading-[0.9] tracking-[-0.055em] text-fg [@media(max-height:640px)]:text-[clamp(3.5rem,13vw,7rem)]"
      >
        <TumbleWord text={text} settled={settled} still={still} ink="chaos" stagger={40} seed={1} />
      </h1>
    </div>
  );
}
