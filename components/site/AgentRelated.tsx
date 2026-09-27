import { SectionHeader } from "@/components/landing/ui";
import { AGENTS, type AgentSlug } from "@/lib/content/agents";
import { AGENT_ICONS, agentHref } from "./agents";
import { RelatedCards, type RelatedItem } from "./RelatedCards";

type AgentRelatedProps = {
  /** Section number for the eyebrow; omit on pages without numbered eyebrows (just the headline). */
  num?: string;
  label: string;
  headline: string;
  /** In order; `reason` is the copy sheet's line for why this agent is next. */
  agents: { slug: AgentSlug; reason: string }[];
  linkText: string;
};

/**
 * An agent page's "what happens next": compact cards for the agents it hands to. Each links
 * to that agent's page when it exists, else to the hub (see LIVE_AGENT_PAGES).
 */
export function AgentRelated({ num, label, headline, agents, linkText }: AgentRelatedProps) {
  const items: RelatedItem[] = agents.map(({ slug, reason }) => {
    const agent = AGENTS.find((a) => a.slug === slug)!;
    const Icon = AGENT_ICONS[agent.icon];
    return { href: agentHref(slug, "/agents"), title: agent.name, body: reason, icon: <Icon strokeWidth={1.6} aria-hidden="true" />, linkText };
  });
  return (
    <section id="related" className="relative py-24 sm:py-32">
      {num ? (
        <SectionHeader num={num} label={label} title={headline} />
      ) : (
        <h2 data-reveal className="max-w-[20ch] text-[clamp(2.25rem,4.4vw,3.75rem)] font-normal leading-[1.04] tracking-[-0.035em] text-fg text-balance">
          {headline}
        </h2>
      )}
      <RelatedCards items={items} columns={2} className="mt-12 max-w-[880px]" />
    </section>
  );
}
