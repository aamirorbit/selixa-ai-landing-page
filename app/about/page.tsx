import type { Metadata } from "next";
import { AboutOpening, SettlingHeadline } from "@/components/about/AboutPieces";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { d } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { CTASection } from "@/components/site/CTASection";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

// Copy: docs/pages/about.copy.md. Statements only: no team, photos, investors, dates or numbers.
const STATEMENTS: { n: string; parts: React.ReactNode[] }[] = [
  { n: "02", parts: ["The context is in meetings, docs and threads."] },
  { n: "03", parts: ["Decisions get made, then lost."] },
  { n: "04", parts: ["Priorities drift.", "Roadmaps go stale."] },
  { n: "05", parts: ["Product managers should decide, not dig."] },
  {
    n: "06",
    parts: [
      <>
        So we built an <span className="text-brand-gradient">AI Product Manager</span>.
      </>,
    ],
  },
];

export const metadata: Metadata = pageMetadata({
  title: "About — Selixa",
  description: "Product work is scattered across meetings, docs and tools. Selixa is product intelligence built so teams can stop guessing what to build next.",
  ogTitle: "stop guessing what to build next. — Selixa",
  ogDescription: "Why we're building an AI Product Manager.",
  path: "/about",
});

/**
 * /about: the manifesto. The home page's close, full screen, then one statement per screen,
 * ending where the home page ends. No product UI at all.
 */
export default function AboutPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "About", path: "/about" }])} />
      <main className="relative flex-1 overflow-x-clip">
        <h1 className="sr-only">About Selixa</h1>
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8">
          <AboutOpening eyebrow="About" lead="Product work is" word="scattered." scroll="Scroll" />

          {STATEMENTS.map((s, i) => (
            <section
              key={s.n}
              id={i === 0 ? "manifesto" : undefined}
              className={`flex min-h-[80svh] flex-col justify-center py-20 md:min-h-[88svh] md:py-24 ${i % 2 === 1 ? "lg:items-end" : ""}`}
            >
              {/* 16ch of the statement's own size (set on the h2, not this wrapper) */}
              <div>
                <p data-reveal className="text-[0.75rem] tabular-nums text-fg-3">
                  {s.n}
                </p>
                <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.25rem,5.4vw,4.75rem)] font-light leading-[1.02] tracking-[-0.045em] text-fg">
                  {s.parts.map((p, k) => (
                    <span key={k} data-reveal style={d(80 + k * 160)} className="block">
                      {p}
                    </span>
                  ))}
                </h2>
              </div>
            </section>
          ))}

          <CTASection title={<SettlingHeadline />} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
