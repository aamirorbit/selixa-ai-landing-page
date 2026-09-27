import type { Metadata } from "next";
import { ActivationChart } from "@/components/agents/analyst/ActivationChart";
import { AskNumber } from "@/components/agents/analyst/AskNumber";
import { ANALYST_COPY } from "@/components/agents/analyst/copy";
import { MetricsTable } from "@/components/agents/analyst/MetricsTable";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SectionHeader } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { AgentRelated } from "@/components/site/AgentRelated";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { agentBySlug } from "@/lib/content/agents";
import { pageMetadata } from "@/lib/site";

const C = ANALYST_COPY;
const agent = agentBySlug("analyst")!;

export const metadata: Metadata = pageMetadata({
  title: C.meta.title,
  description: agent.description,
  ogTitle: C.meta.ogTitle,
  ogDescription: C.meta.ogDescription,
  path: "/agents/analyst",
});

/**
 * /agents/analyst: one big chart, annotated live. A compact hero hands straight on to the
 * pinned chart (both fit the first screen); then ask a number, the metrics, what's next.
 * No overflow-hidden above the chart scene: it would break position: sticky.
 */
export default function AnalystAgentPage() {
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <PageHero compact align="left" rings={false} eyebrow={C.hero.eyebrow} title={agent.headline} line={agent.line} />
          {/* Phones: the annotations header sits above the chart (desktop shows it in the stage's foot row) */}
          <div className="pt-12 md:hidden">
            <SectionHeader num="01" label={C.annotations.label} title={C.annotations.headline} lead={C.annotations.line} />
          </div>
          <ActivationChart />
          <AskNumber />
          <MetricsTable />
          <AgentRelated
            num="04"
            label={C.related.label}
            headline={C.related.headline}
            linkText={C.related.linkText}
            agents={[...C.related.agents]}
          />
          <CTASection title={C.cta.headline} line={C.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
