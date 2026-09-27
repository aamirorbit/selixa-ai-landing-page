import type { Metadata } from "next";
import { HUB_COPY } from "@/components/use-cases/copy";
import { RoleExplorer } from "@/components/use-cases/RoleExplorer";
import { UseCaseGroups } from "@/components/use-cases/UseCaseGroups";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SectionHeader } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { pageMetadata } from "@/lib/site";

const C = HUB_COPY;

export const metadata: Metadata = pageMetadata({ ...C.meta, path: "/use-cases" });

/**
 * /use-cases: the page turns to face you. Pick a role and one panel cross-fades to that role's
 * pain, agents and day; below, every role in three groups.
 */
export default function UseCasesPage() {
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <PageHero eyebrow={C.hero.eyebrow} title={C.hero.headline} line={C.hero.line} visual={<RoleExplorer />} className="sm:pt-20" />

          <section id="all" className="relative py-24 sm:py-32">
            <SectionHeader num="01" label={C.grid.label} title={C.grid.headline} />
            <UseCaseGroups cardLink={C.grid.cardLink} />
          </section>

          <CTASection title={C.cta.headline} line={C.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
