import { LOGOS } from "@/components/landing/logos";
import { SectionHeader } from "@/components/landing/ui";
import { ToolStrip } from "@/components/site/ToolStrip";
import { RESEARCH_COPY } from "./copy";

const TOOLS = RESEARCH_COPY.brief.sources.map((n) => ({ logo: LOGOS.find((l) => l.name === n)! }));

/** Where the evidence lives: the four sources, lit once on screen. */
export function Sources() {
  return (
    <section id="sources" className="relative py-24 sm:py-32">
      <SectionHeader num="01" label={RESEARCH_COPY.sources.label} title={RESEARCH_COPY.sources.headline} align="center" className="mx-auto" />
      <div data-reveal className="mx-auto mt-16 max-w-[320px] sm:max-w-none">
        <ToolStrip tools={TOOLS} size="lg" align="center" />
      </div>
    </section>
  );
}
