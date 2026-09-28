import type { Metadata } from "next";
import { CallScreen } from "@/components/agents/meeting/CallScreen";
import { CallTape } from "@/components/agents/meeting/CallTape";
import { MEETING_COPY } from "@/components/agents/meeting/copy";
import { RecapMessage } from "@/components/agents/meeting/RecapMessage";
import { WhereYouMeet } from "@/components/agents/meeting/WhereYouMeet";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SectionHeader } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { AgentRelated } from "@/components/site/AgentRelated";
import { CTASection } from "@/components/site/CTASection";
import { ScrollHint } from "@/components/site/ScrollHint";
import { agentBySlug } from "@/lib/content/agents";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const C = MEETING_COPY;
const agent = agentBySlug("meeting")!;

export const metadata: Metadata = pageMetadata({
  title: C.meta.title,
  description: agent.description,
  ogTitle: C.meta.ogTitle,
  ogDescription: C.meta.ogDescription,
  path: "/product/meetings",
});

/**
 * /product/meetings: the page is a meeting. A call screen, then the call's tape plays as you
 * scroll (the only scrubbed scene), then the recap it sends, where it joins, what's next.
 * No overflow-hidden above the tape: it would break position: sticky.
 */
export default function MeetingAgentPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Product", path: "/product" }, { name: agent.name, path: "/product/meetings" }])} />
      <main className="relative flex-1 overflow-x-clip">
        <CallScreen />
        <div className="mt-6 flex justify-center">
          <ScrollHint href="#call">{C.hero.scrollHint}</ScrollHint>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <div id="call" className="pt-24 sm:pt-32">
            <SectionHeader num="01" label={C.timeline.eyebrow} title={C.timeline.headline} lead={C.timeline.line} />
          </div>
          <CallTape />
          <RecapMessage />
          <WhereYouMeet />
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
