import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChevronRight, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOL_COPY } from "@/components/integrations/copy";
import { ConversationCTA } from "@/components/ConversationCTA";
import { BrandMark } from "@/components/landing/BrandMark";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Orb, SectionHeader, d } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { AGENT_ICONS, agentHref } from "@/components/site/agents";
import { CTASection } from "@/components/site/CTASection";
import { IntegrationDemo } from "@/components/site/demos/IntegrationDemos";
import { logoOf, TOOL_LOOK } from "@/components/site/integrations/look";
import { ToolConnector, ToolWash } from "@/components/site/integrations/ToolHero";
import { PageHero } from "@/components/site/PageHero";
import { RelatedCards } from "@/components/site/RelatedCards";
import { AGENTS } from "@/lib/content/agents";
import { INTEGRATIONS, integrationBySlug } from "@/lib/content/integrations";
import { pageMetadata } from "@/lib/site";

const T = TOOL_COPY;

/** One static page per tool; anything else is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return INTEGRATIONS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = integrationBySlug(slug);
  if (!i) return {};
  return pageMetadata({ title: T.meta.title(i.name), description: i.metaDescription, ogTitle: T.meta.ogTitle(i.name), ogDescription: i.job, path: `/integrations/${i.slug}` });
}

/** "Threads and decisions." → "threads and decisions." (page headlines are lowercase). */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * /integrations/[slug]: one template, eleven faces. The hero wears the tool's own colour; below
 * it the page is plain Selixa: what flows each way, a small demo in the tool's shape, the
 * permissions placeholder, setup, related agents.
 */
export default async function IntegrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = integrationBySlug(slug);
  if (!i) notFound();
  const logo = logoOf(i);
  const look = TOOL_LOOK[i.slug];
  const place = i.demoScript.kind === "thread" ? i.demoScript.place : i.demoScript.kind === "doc" || i.demoScript.kind === "call" ? i.demoScript.title : `Atlas · ${i.name}`;

  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <ToolWash look={look}>
            <PageHero
              live={false}
              rings={false}
              eyebrow={
                <span>
                  <Link href="/integrations" className="transition-colors hover:text-fg focus-visible:underline">
                    {T.eyebrow}
                  </Link>
                  <span className="text-fg-3"> · {i.category}</span>
                </span>
              }
              visualPosition="top"
              visual={<ToolConnector logo={logo} look={look} label={T.connector(i.name)} />}
              title={lowerFirst(i.job)}
              line={T.line}
              className="pb-20 sm:pb-28"
            />
          </ToolWash>

          {/* What flows each way */}
          <section id="flow" className="py-20 sm:py-28">
            <p data-reveal className="eyebrow mx-auto flex w-fit">
              <span className="num">01</span>
              <span className="rule" aria-hidden="true" />
              {T.flow.label}
            </p>
            <div className="mx-auto mt-10 grid max-w-[960px] grid-cols-1 items-stretch gap-6 md:grid-cols-[1fr_72px_1fr] md:gap-0">
              {[
                { heading: T.flow.reads, items: i.reads, Icon: ArrowDownLeft, delay: 0 },
                null,
                { heading: T.flow.writes, items: i.writes, Icon: ArrowUpRight, delay: 160 },
              ].map((col, k) =>
                col ? (
                  <div key={k} data-reveal style={d(col.delay)} className="card rounded-[20px]! p-7">
                    <p className="flex items-center gap-3 text-[0.9375rem] font-medium text-fg">
                      <span className="grid h-8 w-8 place-items-center rounded-[10px] border border-line bg-ink/[0.03] text-brand-300">
                        <col.Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      {col.heading}
                    </p>
                    <ul className="mt-5">
                      {col.items.map((t) => (
                        <li key={t} className="border-t border-line py-3.5 text-[0.9375rem] text-fg-2">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div key={k} data-reveal style={d(80)} aria-hidden="true" className="flex flex-col items-center justify-center md:flex-row">
                    {/* The spine: reads come in from the left, writes go out to the right */}
                    <span className="h-3 w-px bg-ink/[0.12] md:h-px md:w-3" />
                    <ChevronRight className="hidden h-3 w-3 text-fg-3 md:block" strokeWidth={2} />
                    <span className="md:hidden">
                      <Orb size={28} />
                    </span>
                    <span className="hidden md:block">
                      <Orb size={40} />
                    </span>
                    <span className="h-3 w-px bg-ink/[0.12] md:h-px md:w-3" />
                    <ChevronRight className="hidden h-3 w-3 text-fg-3 md:block" strokeWidth={2} />
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Demo */}
          <section id="demo" className="py-20 sm:py-28">
            <SectionHeader num="02" label={T.demo.label(i.name)} title={T.demo.headline(i.name)} align="center" className="mx-auto" />
            <div data-reveal className="mx-auto mt-12 w-full max-w-[680px]">
              <IntegrationDemo script={i.demoScript} logo={logo} place={place} labels={T.demoLabels} />
            </div>
          </section>

          {/* Permissions: the isolation line only, until the details are confirmed */}
          <section id="permissions" className="py-20 sm:py-28">
            <SectionHeader num="03" label={T.permissions.label} title={T.permissions.headline} align="center" className="mx-auto" />
            <div data-reveal className="window mx-auto mt-12 flex max-w-[720px] flex-col gap-5 rounded-[20px]! p-6 sm:flex-row sm:p-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border border-brand-400/30 bg-brand-500/10 text-brand-300">
                <Lock className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[1.0625rem] leading-[1.5] text-fg">{T.permissions.line(i.name)}</p>
                <p className="mt-2 text-[0.875rem] text-fg-3">{T.permissions.smallPrint}</p>
                <div className="mt-5">
                  <ConversationCTA variant="link" defaults={{ problem: T.permissions.prefix(i.name) }} focus="problem" label={T.permissions.link} className="link-arrow cursor-pointer">
                    {T.permissions.link} →
                  </ConversationCTA>
                </div>
              </div>
            </div>
            {process.env.NODE_ENV !== "production" && (
              <p className="mx-auto mt-4 max-w-[720px] rounded-[14px] border border-dashed border-line-strong p-4 font-mono text-[0.8125rem] text-fg-3">
                TODO(owner): permissions for {i.slug}: access requested · storage · retention · disconnect
              </p>
            )}
          </section>

          {/* Setup */}
          <section id="setup" className="py-20 sm:py-28">
            <SectionHeader num="04" label={T.setup.label} title={T.setup.headline} align="center" className="mx-auto" />
            <ol className="relative mx-auto mt-12 grid max-w-[960px] grid-cols-1 gap-3 md:grid-cols-3">
              <span aria-hidden="true" className="absolute bottom-10 left-[34px] top-10 w-px bg-ink/[0.1] md:hidden" />
              {i.setup.map((step, k) => (
                <li key={step} data-reveal style={d(k * 80)} className="card relative rounded-[16px]! p-6 md:min-h-[148px]">
                  <span className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-line-strong bg-panel text-[0.8125rem] tabular-nums text-fg-2">{k + 1}</span>
                    {k === 0 && (
                      <span className="flex items-center gap-1.5" aria-hidden="true">
                        <BrandMark logo={logo} lit className="h-4 w-4" />
                        <span className="h-px w-4 bg-ink/[0.2]" />
                        <Orb size={16} />
                      </span>
                    )}
                  </span>
                  <p className="mt-6 text-[1rem] text-fg text-pretty">{step}</p>
                  {k < 2 && (
                    <ChevronRight aria-hidden="true" className="absolute -right-[10px] top-1/2 hidden h-3 w-3 -translate-y-1/2 text-fg-3 md:block" strokeWidth={2} />
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* Related agents */}
          <section id="related" className="py-20 sm:py-28">
            <SectionHeader num="05" label={T.related.label} title={T.related.headline} />
            <RelatedCards
              columns={i.agents.length === 3 ? 3 : 2}
              className={`mt-12 ${i.agents.length === 3 ? "" : "max-w-[760px]"}`}
              items={i.agents.map((s) => {
                const a = AGENTS.find((x) => x.slug === s)!;
                const Icon = AGENT_ICONS[a.icon];
                return { href: agentHref(s, "/product"), title: a.name, body: a.line, icon: <Icon strokeWidth={1.6} aria-hidden="true" />, linkText: T.related.cardLink };
              })}
            />
            <Link href="/integrations" className="link-arrow mt-8 text-[0.9375rem]">
              {T.related.allLink}
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </section>

          <CTASection title={T.cta.headline} line={T.cta.line(i.name)} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
