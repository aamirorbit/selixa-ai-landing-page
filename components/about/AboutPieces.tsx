"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChaosToOrder } from "@/components/site/ChaosToOrder";
import { TumbleWord } from "@/components/site/TumbleWord";

/** The opening: the home page's close, full screen, played once. */
export function AboutOpening({ eyebrow, lead, word, scroll }: { eyebrow: string; lead: string; word: string; scroll: string }) {
  return (
    <ChaosToOrder
      size="screen"
      loop={false}
      delayStart={250}
      phoneScraps={6}
      orbSize={80}
      label={`${lead} ${word}`}
      lead={
        <>
          {lead}
          <br />
        </>
      }
      word={word}
      titleClassName="text-[clamp(3rem,8vw,7.25rem)] leading-[0.95] tracking-[-0.055em] [@media(max-height:700px)]:text-[clamp(3rem,8vw,5.5rem)]"
      eyebrow={
        <span className="reveal pill gap-2.5 px-4 py-3">
          <span className="live-dot" aria-hidden="true" />
          {eyebrow}
        </span>
      }
      after={({ done }) => (
        <a
          href="#manifesto"
          className={`mt-14 flex items-center gap-1.5 text-[0.8125rem] text-fg-3 transition-opacity duration-300 hover:text-fg [@media(max-height:700px)]:hidden ${done ? "opacity-100" : "opacity-0"}`}
        >
          {scroll}
          <ChevronDown className="bob h-3 w-3" strokeWidth={2} aria-hidden="true" />
        </a>
      )}
    />
  );
}

/** The close's headline: "chaos." settles once when it comes into view (reduced motion: settled). */
export function SettlingHeadline() {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"still" | "scattered" | "settled">("still");
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t = window.setTimeout(() => setState("settled"), 300);
      },
      { threshold: 0.4 },
    );
    // Scatter only if it's not already on screen (so it never visibly jumps apart).
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight) t = window.setTimeout(() => setState("scattered"));
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return (
    <span ref={ref}>
      stop building
      <br />
      <span style={{ color: "var(--chaos-in)" }}>{"in "}</span>
      <span className="sr-only">chaos.</span>
      <TumbleWord text="chaos." settled={state !== "scattered"} still={state === "still"} ink="chaos" />
    </span>
  );
}
