import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ROADMAP_COPY } from "@/components/agents/roadmap/copy";
import { ProductDeck } from "@/components/agents/roadmap/ProductDeck";
import { RoadmapPlane } from "@/components/agents/roadmap/RoadmapPlane";
import { RoadmapRibbon } from "@/components/agents/roadmap/RoadmapRibbon";
import { WhyMoved } from "@/components/agents/roadmap/WhyMoved";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SectionHeader } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { AgentRelated } from "@/components/site/AgentRelated";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { agentBySlug } from "@/lib/content/agents";
import { pageMetadata } from "@/lib/site";

const C = ROADMAP_COPY;
const agent = agentBySlug("roadmap")!;

export const metadata: Metadata = pageMetadata({
  title: C.meta.title,
  description: agent.description,
  ogTitle: C.meta.ogTitle,
  ogDescription: C.meta.ogDescription,
  path: "/product/roadmap",
});

/**
 * /product/roadmap: the page scrolls sideways through Now / Next / Later. Then the board holds
 * still so a card can say why it moved, and four products show their own roadmaps.
 * No overflow-hidden above the scene: it would break position: sticky.
 */
export default function RoadmapAgentPage() {
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <PageHero
            fill
            eyebrow={C.hero.eyebrow}
            title={agent.headline}
            line={agent.line}
            visual={<RoadmapRibbon />}
            after={
              <span className="flex items-center gap-2">
                <span className="tag">
                  <span className="live-dot" aria-hidden="true" />
                  {agent.status}
                </span>
                <ArrowRight className="bob-x h-3 w-3 text-fg-3" strokeWidth={2} aria-hidden="true" />
              </span>
            }
          />
          <div className="pt-24 sm:pt-32">
            <SectionHeader num="01" label={C.board.label} title={C.board.headline} />
          </div>
          <RoadmapPlane />
          <WhyMoved />
          <ProductDeck />
          <AgentRelated headline={C.related.headline} label={C.related.label} linkText={C.related.linkText} agents={[...C.related.agents]} />
          <CTASection title={C.cta.headline} line={C.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
