import type { Metadata } from "next";
import { RESEARCH_COPY } from "@/components/agents/research/copy";
import { ResearchScene } from "@/components/agents/research/ResearchScene";
import { Sources } from "@/components/agents/research/Sources";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Nav } from "@/components/Nav";
import { AgentRelated } from "@/components/site/AgentRelated";
import { CTASection } from "@/components/site/CTASection";
import { agentBySlug } from "@/lib/content/agents";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const C = RESEARCH_COPY;
const agent = agentBySlug("research")!;

export const metadata: Metadata = pageMetadata({
  title: C.meta.title,
  description: agent.description,
  ogTitle: C.meta.ogTitle,
  ogDescription: C.meta.ogDescription,
  path: "/product/research",
});

/**
 * /product/research: a pin board of evidence you pan across. The hero is the scene's first
 * frame, full-bleed (outside the 1280 container); then sources, related, the CTA.
 * No overflow-hidden above the scene: it would break position: sticky.
 */
export default function ResearchAgentPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Product", path: "/product" }, { name: agent.name, path: "/product/research" }])} />
      <main className="relative flex-1 overflow-x-clip">
        <ResearchScene />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <Sources />
          <AgentRelated
            num="02"
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
