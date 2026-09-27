import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { AgentArc } from "@/components/agents-hub/AgentArc";
import { ContextSection } from "@/components/agents-hub/ContextBoundary";
import { HUB_COPY } from "@/components/agents-hub/copy";
import { Relay } from "@/components/agents-hub/Relay";
import { TeamIndex } from "@/components/agents-hub/TeamIndex";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SectionHeader } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";

const { meta, hero, relay, cta } = HUB_COPY;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/agents" },
  openGraph: {
    title: meta.ogTitle,
    description: meta.ogDescription,
    url: "/agents",
    siteName: "Selixa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.ogTitle,
    description: meta.ogDescription,
  },
};

/**
 * /agents: one piece of work travels the whole team. Hero → the relay (pinned,
 * scroll-scrubbed) → the six agents → one product's context → the website CTA.
 * No overflow-hidden on anything above the relay: it would break position: sticky.
 */
export default function AgentsPage() {
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <PageHero
            fill
            eyebrow={hero.eyebrow}
            title={hero.headline}
            line={hero.line}
            visual={<AgentArc />}
            after={
              <a href="#relay" className="flex items-center gap-1.5 text-[0.8125rem] text-fg-3 transition-colors duration-200 hover:text-fg">
                {hero.scrollHint}
                <ChevronDown className="bob h-3 w-3" strokeWidth={2} aria-hidden="true" />
              </a>
            }
          />

          <div className="pt-24 sm:pt-32">
            <SectionHeader num="01" label={relay.label} title={relay.headline} lead={relay.line} />
          </div>
          <Relay />

          <TeamIndex />
          <ContextSection />
          <CTASection title={cta.headline} line={cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
