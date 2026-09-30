import { EyeOff, Handshake, ListChecks, PencilLine, Share2, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { d } from "@/components/landing/ui";
import { CAPTURE_COPY } from "./copy";

const C = CAPTURE_COPY.trust;

// Principles Capture is built on. Keep every line true of the shipped product.
const PROMISES: { title: string; icon: LucideIcon }[] = [
  { title: "Consent first", icon: Handshake },
  { title: "Transparent sharing", icon: Share2 },
  { title: "You control visibility", icon: SlidersHorizontal },
  { title: "Review what was captured", icon: ListChecks },
  { title: "Correct or remove anything", icon: PencilLine },
  { title: "No hidden recording", icon: EyeOff },
];

/** A compact strip: one line of heading, then the promises in a row. */
export function Trust() {
  return (
    <section id="trust" className="border-y border-line py-14 sm:py-16">
      <p data-reveal className="text-center text-[clamp(1.375rem,2.4vw,1.875rem)] tracking-[-0.025em] text-fg text-balance">
        {C.headline}
      </p>
      <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
        {PROMISES.map(({ title, icon: Icon }, i) => (
          <li key={title} data-reveal style={d(i * 40)} className="tag gap-2 px-3.5 py-2 text-[0.8125rem]">
            <Icon className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.75} aria-hidden="true" />
            {title}
          </li>
        ))}
      </ul>
    </section>
  );
}
