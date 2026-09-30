import { ChevronDown } from "lucide-react";
import { ConversationCTA } from "@/components/ConversationCTA";
import { d } from "@/components/landing/ui";
import { PageHeroTitle } from "@/components/site/PageHero";
import { SIGNAL_COPY } from "./copy";
import { SignalField } from "./SignalField";

const C = SIGNAL_COPY.hero;

/** Pill → headline → line → the two actions, then the internet Signal watches. */
export function SignalHero() {
  return (
    <section className="relative flex flex-col pb-10 pt-14 sm:pt-20">
      <PageHeroTitle eyebrow={C.eyebrow} title={C.headline} line={C.line} />

      <div className="reveal mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-7" style={d(300)}>
        <ConversationCTA variant="premium" label={C.cta} defaults={{ problem: "I’d like to try Selixa Signal." }} />
        <a href="#how" className="flex items-center gap-1.5 text-[0.9375rem] text-fg-2 transition-colors duration-200 hover:text-fg">
          {C.secondary}
          <ChevronDown className="bob h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        </a>
      </div>

      <div className="reveal relative mt-12 w-full sm:mt-8" style={d(420)}>
        <SignalField />
      </div>
    </section>
  );
}
