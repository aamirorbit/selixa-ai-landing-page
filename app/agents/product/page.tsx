import type { Metadata } from "next";
import { PRODUCT_COPY } from "@/components/agents/product/copy";
import { Memo } from "@/components/agents/product/Memo";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Nav } from "@/components/Nav";
import { AgentRelated } from "@/components/site/AgentRelated";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { AGENTS, agentBySlug } from "@/lib/content/agents";
import { pageMetadata } from "@/lib/site";

const C = PRODUCT_COPY;
const agent = agentBySlug("product")!;

export const metadata: Metadata = pageMetadata({
  title: C.meta.title,
  description: agent.description,
  ogTitle: C.meta.ogTitle,
  ogDescription: C.meta.ogDescription,
  path: "/agents/product",
});

/**
 * /agents/product: the page is a document being written. The hero hands straight on to one
 * sheet of paper (light in both schemes) that writes itself section by section as you read.
 * No pinned scene on this page.
 */
export default function ProductAgentPage() {
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <PageHero rings={false} eyebrow={C.hero.eyebrow} title={agent.headline} line={agent.line} className="sm:pt-16" />
          <Memo />
          {/* Owner decision: Related shows the memo's inputs */}
          <div className="pt-4">
            <AgentRelated
              label={C.related.label}
              headline={C.related.headline}
              linkText={C.related.linkText}
              agents={C.related.agents.map((slug) => ({ slug, reason: AGENTS.find((a) => a.slug === slug)!.line }))}
            />
          </div>
          <CTASection title={C.cta.headline} line={C.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
