import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { HUB_COPY } from "@/components/integrations/copy";
import { ConversationCTA } from "@/components/ConversationCTA";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { LOGOS } from "@/components/landing/logos";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Section, SectionHeader } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { CTASection } from "@/components/site/CTASection";
import { DataFlow } from "@/components/site/integrations/DataFlow";
import { IntegrationSearch } from "@/components/site/integrations/IntegrationSearch";
import { logoOf } from "@/components/site/integrations/look";
import { PageHero } from "@/components/site/PageHero";
import { AGENTS } from "@/lib/content/agents";
import { INTEGRATIONS } from "@/lib/content/integrations";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const C = HUB_COPY;

export const metadata: Metadata = pageMetadata({ ...C.meta, path: "/integrations" });

/**
 * /integrations: a command palette you can type in. The hero is the search; the grid under it
 * filters as you type. Then how data flows (one product, one context) and a way to ask for more.
 */
export default function IntegrationsPage() {
  const byName = (n: string) => LOGOS.find((l) => l.name === n)!;
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Integrations", path: "/integrations" }])} />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <PageHero eyebrow={C.hero.eyebrow} title={C.hero.headline} line={C.hero.line} visual={<IntegrationSearch copy={C.search} />} className="sm:pt-20" />

          <Section id="flow">
            <SectionHeader num="01" label={C.flow.label} title={C.flow.headline} lead={C.flow.line} align="center" className="mx-auto" />
            <div className="mt-14">
              <DataFlow
                product={C.flow.product}
                tools={INTEGRATIONS.map(logoOf)}
                agents={AGENTS}
                contextItems={[...C.flow.context]}
                greyed={{ ...C.flow.greyed, tools: ["Notion", "Linear", "Zoom"].map(byName) }}
                labels={{ tools: C.flow.tools, agents: C.flow.agents, reads: C.flow.reads, writes: C.flow.writes }}
                summary={C.flow.summary}
              />
            </div>
          </Section>

          <section id="request" className="mx-auto flex max-w-[40rem] flex-col items-center py-20 sm:py-24">
            <SectionHeader num="02" label={C.request.label} title={C.request.headline} lead={C.request.line} align="center" className="mx-auto" />
            <div data-reveal className="mt-7">
              <ConversationCTA variant="link" defaults={{ problem: C.request.prefix }} focus="problem" label={C.request.button} className="btn-quiet">
                <span className="play" aria-hidden="true">
                  <Plus className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                {C.request.button}
              </ConversationCTA>
            </div>
          </section>

          <CTASection title={C.cta.headline} line={C.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
