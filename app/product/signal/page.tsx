import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { ScrollZoom } from "@/components/landing/ScrollZoom";
import { Nav } from "@/components/Nav";
import { SIGNAL_COPY } from "@/components/signal/copy";
import { Listening } from "@/components/signal/Listening";
import { Opportunity } from "@/components/signal/Opportunity";
import { OutsideInside } from "@/components/signal/OutsideInside";
import { SignalHero } from "@/components/signal/SignalHero";
import { CTASection } from "@/components/site/CTASection";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const C = SIGNAL_COPY;

export const metadata: Metadata = pageMetadata({
  title: C.meta.title,
  description: C.meta.description,
  ogTitle: C.meta.ogTitle,
  ogDescription: C.meta.ogDescription,
  path: "/product/signal",
});

/**
 * /product/signal: Selixa looking outside the company. The story runs
 * market → opportunity → decision → execution: the internet watched (hero) → streams into
 * one read → what it sees → the dashboard → connected signals become an opportunity →
 * carried into research, roadmap and tasks → outside meets inside → agents → who → CTA.
 */
export default function SignalPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Product", path: "/product" }, { name: "Signal", path: "/product/signal" }])} />
      <main className="relative flex-1 overflow-x-clip">
        {/* A faint grid under the hero, fading out as the page begins */}
        <div aria-hidden="true" className="signal-grid pointer-events-none absolute inset-x-0 top-0 h-[120svh]" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <SignalHero />

          <Listening />
          <Opportunity />
          <OutsideInside />
          <CTASection title={C.cta.headline} line={C.cta.line} label={C.cta.label} secondary={{ label: C.cta.secondary, href: "#how" }} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
      <ScrollZoom />
    </>
  );
}
