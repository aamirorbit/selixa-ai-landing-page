import type { Metadata } from "next";
import { BreakdownTree } from "@/components/agents/execution/BreakdownTree";
import { EXECUTION_COPY } from "@/components/agents/execution/copy";
import { KanbanWindow } from "@/components/agents/execution/KanbanWindow";
import { NudgeStack, OutcomeClose, TrackerSync } from "@/components/agents/execution/Sections";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SectionHeader } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { AgentRelated } from "@/components/site/AgentRelated";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { agentBySlug } from "@/lib/content/agents";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const C = EXECUTION_COPY;
const agent = agentBySlug("execution")!;

export const metadata: Metadata = pageMetadata({
  title: C.meta.title,
  description: agent.description,
  ogTitle: C.meta.ogTitle,
  ogDescription: C.meta.ogDescription,
  path: "/product/tasks",
});

/**
 * /product/tasks: a board that empties. Then where the tasks came from (the breakdown,
 * scroll-scrubbed), how they keep moving (nudges), where they live (your tracker) and what
 * they were for (the number). No overflow-hidden above the scene: it would break sticky.
 */
export default function ExecutionAgentPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Product", path: "/product" }, { name: agent.name, path: "/product/tasks" }])} />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <PageHero eyebrow={C.hero.eyebrow} title={agent.headline} line={agent.line} visual={<KanbanWindow />} />
          <div className="pt-24 sm:pt-32">
            <SectionHeader num="01" label={C.breakdown.label} title={C.breakdown.headline} lead={C.breakdown.line} />
          </div>
          <BreakdownTree />
          <NudgeStack />
          <TrackerSync />
          <OutcomeClose />
          <AgentRelated headline={C.related.headline} label={C.related.label} linkText={C.related.linkText} agents={[...C.related.agents]} />
          <CTASection title={C.cta.headline} line={C.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
