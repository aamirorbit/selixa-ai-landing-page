import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { d } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { CTASection } from "@/components/site/CTASection";
import { IsolationDiagram } from "@/components/site/IsolationDiagram";
import { PageHero } from "@/components/site/PageHero";
import { pageMetadata } from "@/lib/site";

// Copy: docs/pages/security.copy.md. Only the isolation principle ships; every other trust
// topic waits for the owner (no storage, encryption, retention or certification claims).
// The diagram description and the CTA line are the shortest honest wording (not in the sheet).
const C = {
  eyebrow: "Security",
  headline: "every product, sealed.",
  line: "Each product gets its own context. Nothing crosses over.",
  contents: ["Meetings", "Docs", "Decisions", "Memory"],
  agent: "Selixa, working in {product}",
  wall: "Sealed",
  blocked: "Not shared",
  caption: "Selixa works inside one product at a time.",
  srDiagram:
    "Four sample products, Atlas, Beacon, Cove and Drift, each sealed with its own meetings, docs, decisions and memory. Selixa works inside one at a time. Nothing is shared between them.",
  principles: [
    { title: "Its own context.", body: "Each product keeps its own meetings, docs, decisions and memory." },
    { title: "One product at a time.", body: "Selixa works inside a single product's context." },
    { title: "Nothing shared.", body: "Nothing moves from one product to another." },
  ],
  holding: {
    headline: "more details soon.",
    line: "Details on storage, encryption and retention are being finalized. Ask us anything:",
    email: "hello@selixa.ai",
  },
  cta: { headline: "stop building in chaos.", line: "Start with your product's website." },
};

export const metadata: Metadata = pageMetadata({
  title: "Security — Selixa",
  description: "In Selixa, every product is a sealed context with its own meetings, docs, decisions and memory. Nothing is shared across products.",
  ogTitle: "Every product, sealed. — Selixa",
  ogDescription: "How Selixa keeps each product's context separate.",
  path: "/security",
});

/**
 * /security: the isolation principle, drawn. Four sealed containers; Selixa works inside one
 * at a time and a path from Atlas stops at the wall. Then three principle rows and one honest
 * holding note.
 */
export default function SecurityPage() {
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8">
          <PageHero
            live={false}
            eyebrow={C.eyebrow}
            title={C.headline}
            line={C.line}
            visual={
              <>
                <p className="sr-only">{C.srDiagram}</p>
                <IsolationDiagram contents={C.contents} agentLabel={C.agent} wallLabel={C.wall} blockedLabel={C.blocked} />
                <p className="mt-6 text-center text-[0.875rem] text-fg-3">{C.caption}</p>
              </>
            }
          />

          {/* The principle, in three rows */}
          <ol className="mx-auto mt-24 grid max-w-[1040px] grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {C.principles.map((p, i) => (
              <li key={p.title} data-reveal style={d(i * 60)} className="border-t border-line pt-6">
                <p className="text-[0.75rem] tabular-nums text-fg-3">0{i + 1}</p>
                <h2 className="mt-3 text-[1.125rem] font-medium text-fg">{p.title}</h2>
                <p className="mt-2 text-[0.9375rem] leading-[1.6] text-fg-2">{p.body}</p>
              </li>
            ))}
          </ol>

          {/* Everything else: one holding note, no topic list */}
          <div data-reveal className="mx-auto mt-28 flex max-w-[40rem] flex-col items-center text-center">
            <span aria-hidden="true" className="mb-10 h-px w-16 bg-ink/[0.1]" />
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-light tracking-[-0.035em] text-fg">{C.holding.headline}</h2>
            <p className="mt-4 text-[1rem] leading-[1.6] text-fg-2">
              {C.holding.line}{" "}
              <a href={`mailto:${C.holding.email}`} className="text-fg underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-brand-400">
                {C.holding.email}
              </a>
            </p>
          </div>

          <CTASection title={C.cta.headline} line={C.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
