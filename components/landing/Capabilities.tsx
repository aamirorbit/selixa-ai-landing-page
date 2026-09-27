"use client";

import { Brain, CalendarCheck, Lightbulb, Scale, Video, Zap } from "lucide-react";
import type { CSSProperties } from "react";
import { useSequence } from "./useSequence";

/** Clockwise from top left, so the highlight travels around the headline. */
const CAPABILITIES = [
  { label: "Joins meetings", icon: Video, pos: "lg:left-[2%] lg:top-[16%]" },
  { label: "Plans work", icon: CalendarCheck, pos: "lg:right-[2%] lg:top-[16%]" },
  { label: "Tracks decisions", icon: Scale, pos: "lg:right-[-3%] lg:top-[47%]" },
  { label: "Takes action", icon: Zap, pos: "lg:right-[4%] lg:top-[78%]" },
  { label: "Finds insights", icon: Lightbulb, pos: "lg:left-[4%] lg:top-[78%]" },
  { label: "Understands context", icon: Brain, pos: "lg:left-[-3%] lg:top-[47%]" },
];

const ORDER = [0, 5, 4, 1, 2, 3]; // reading order for the phone layout

export function Capabilities({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const { ref, step, still } = useSequence<HTMLUListElement>(CAPABILITIES.map(() => 1400));

  return (
    <ul
      ref={ref}
      aria-label="What Selixa does"
      className={`relative mx-auto mt-14 flex max-w-[40rem] flex-wrap justify-center gap-2.5 lg:absolute lg:inset-0 lg:mt-0 lg:max-w-none lg:pointer-events-none ${className}`}
      style={style}
    >
      {ORDER.map((i) => {
        const { label, icon: Icon, pos } = CAPABILITIES[i];
        const live = !still && step === i;
        return (
          <li
            key={label}
            className={`tag py-2 pl-2 pr-3.5 text-[0.8125rem] transition-[border-color,box-shadow,color] duration-700 lg:absolute ${pos} ${
              live ? "is-live text-fg" : ""
            }`}
          >
            <span
              className={`grid h-6 w-6 place-items-center rounded-full transition-colors duration-700 ${
                live ? "bg-brand-500 text-white" : "bg-ink/[0.06] text-brand-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}
