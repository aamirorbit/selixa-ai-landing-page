import { ArrowRight, ChevronsLeftRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PAGE_COPY } from "@/components/use-cases/copy";
import { DayResolved, DayScraps } from "@/components/use-cases/DayLayers";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SectionHeader, d } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { AGENT_ICONS, agentHref } from "@/components/site/agents";
import { CTASection } from "@/components/site/CTASection";
import { DayTimeline } from "@/components/site/DayTimeline";
import { IntegrationTile } from "@/components/site/integrations/IntegrationTile";
import { logoOf } from "@/components/site/integrations/look";
import { PageHero } from "@/components/site/PageHero";
import { RelatedCards } from "@/components/site/RelatedCards";
import { SplitCompare } from "@/components/site/SplitCompare";
import { AGENTS } from "@/lib/content/agents";
import { INTEGRATIONS } from "@/lib/content/integrations";
import { USE_CASES } from "@/lib/content/use-cases";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const T = PAGE_COPY;
/** (Not named use…: the hooks lint rule would treat it as a hook.) */
const findUseCase = (slug: string) => USE_CASES.find((u) => u.slug === slug);

/** One static page per use case; anything else is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = findUseCase(slug);
  if (!u) return {};
  return pageMetadata({
    title: `${u.title} — Selixa use cases`,
    description: `${u.line} ${u.pain} See a day with Selixa, the AI Product Manager.`,
    ogTitle: `Selixa for ${u.title.toLowerCase()}`,
    ogDescription: u.line,
    path: `/use-cases/${u.slug}`,
  });
}

/** "Less time collecting context." → "less time collecting context." */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * /use-cases/[slug]: a before/after split you drag, then a day with Selixa (one of three
 * timeline layouts, by the data's `variant`), the agents and tools for the role, and the CTA.
 */
export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = findUseCase(slug);
  if (!u) notFound();
  const tools = u.integrations.map((name) => INTEGRATIONS.find((i) => i.name === name)!).filter(Boolean);
  const hintId = `split-hint-${u.slug}`;
  const header = <SectionHeader num="01" label={T.timeline.label} title={T.timeline.headline} lead={T.timeline.line} />;

  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Use cases", path: "/use-cases" }, { name: u.title, path: `/use-cases/${u.slug}` }])} />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <PageHero
            eyebrow={
              <span>
                <Link href="/use-cases" className="transition-colors hover:text-fg focus-visible:underline">
                  {T.eyebrow}
                </Link>
                <span className="text-fg-3"> · {u.title}</span>
              </span>
            }
            title={lowerFirst(u.line)}
            line={u.pain}
            className="sm:pt-20"
            visual={
              <div className="mx-auto max-w-[1120px]">
                <p id={hintId} className="sr-only">
                  {T.split.keyboard}
                </p>
                <p className="sr-only">
                  {T.split.without}: {u.without.join("; ")}. {T.split.with}: {u.with.join("; ")}.
                </p>
                <SplitCompare
                    className="window h-[480px] rounded-[24px]! md:h-[420px] lg:h-[440px] [@media(max-height:800px)_and_(min-width:1024px)]:h-[380px]"
                    label={T.split.handle}
                    describedBy={hintId}
                    before={<DayScraps items={u.without} />}
                    after={<DayResolved items={u.with} />}
                    labels={{
                      before: <span className="tag bg-panel">{T.split.without}</span>,
                      after: (
                        <span className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">
                          <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
                          {T.split.with}
                        </span>
                      ),
                    }}
                    hint={
                      <span className="tag bg-panel">
                        <ChevronsLeftRight className="h-3 w-3" strokeWidth={2} />
                        {T.split.dragHint}
                      </span>
                    }
                    toggle={{ before: T.split.toggleWithout, after: T.split.toggleWith }}
                  />
              </div>
            }
          />

          <section id="day" className="relative py-24 sm:py-32">
            <DayTimeline variant={u.variant} moments={u.day} header={header} selixaLabel={T.timeline.selixa} />
          </section>

          <section id="agents" className="relative py-20 sm:py-28">
            <SectionHeader num="02" label={T.agents.label} title={T.agents.headline} />
            <RelatedCards
              columns={u.agents.length === 3 ? 3 : 2}
              className={`mt-12 ${u.agents.length === 3 ? "" : "max-w-[760px]"}`}
              items={u.agents.map((s) => {
                const a = AGENTS.find((x) => x.slug === s)!;
                const Icon = AGENT_ICONS[a.icon];
                return { href: agentHref(s, "/product"), title: a.name, body: a.line, icon: <Icon strokeWidth={1.6} aria-hidden="true" />, linkText: T.agents.cardLink };
              })}
            />
          </section>

          <section id="tools" className="relative py-20 sm:py-28">
            <SectionHeader num="03" label={T.tools.label} title={T.tools.headline} lead={T.tools.line} />
            <ul className="mt-12 grid max-w-[880px] grid-cols-2 gap-2.5 md:grid-cols-4">
              {tools.map((i, k) => (
                <li key={i.slug} data-reveal style={d(k * 50)}>
                  <IntegrationTile integration={i} logo={logoOf(i)} size="sm" />
                </li>
              ))}
            </ul>
            <Link href="/integrations" className="link-arrow mt-8 text-[0.9375rem]">
              {T.tools.link}
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </section>

          <CTASection title={T.cta.headline} line={T.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
