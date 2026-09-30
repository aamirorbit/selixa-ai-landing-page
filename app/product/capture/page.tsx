import type { Metadata } from "next";
import { WithSignal } from "@/components/capture/Shared";
import { CaptureHero } from "@/components/capture/CaptureHero";
import { CAPTURE_COPY } from "@/components/capture/copy";
import { Memory } from "@/components/capture/Memory";
import { StaysWithYou } from "@/components/capture/StaysWithYou";
import { Trust } from "@/components/capture/Trust";
import { Understand } from "@/components/capture/Understand";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { ScrollZoom } from "@/components/landing/ScrollZoom";
import { Nav } from "@/components/Nav";
import { CTASection } from "@/components/site/CTASection";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

const C = CAPTURE_COPY;

export const metadata: Metadata = pageMetadata({
  title: C.meta.title,
  description: C.meta.description,
  ogTitle: C.meta.ogTitle,
  ogDescription: C.meta.ogDescription,
  path: "/product/capture",
});

/**
 * /product/capture: the human signal layer. conversation → context → memory → intelligence
 * → action: a message understood (hero) → signals that never go online → where to capture
 * → a conversation understood → memory of a person → Selixa stays with you (pinned) →
 * the shareable link → a network's pattern → with Signal → into execution → trust → CTA.
 */
export default function CapturePage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Product", path: "/product" }, { name: "Capture", path: "/product/capture" }])} />
      <main className="relative flex-1 overflow-x-clip">
        <div aria-hidden="true" className="signal-grid pointer-events-none absolute inset-x-0 top-0 h-[120svh]" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <CaptureHero />
          <Understand />
          <Memory />
          <StaysWithYou />
          <WithSignal />
          <Trust />
          <CTASection title={C.cta.headline} line={C.cta.line} label={C.cta.label} secondary={{ label: C.cta.secondary, href: "/" }} />

        </div>
      </main>
      <Footer />
      <ScrollReveal />
      <ScrollZoom />
    </>
  );
}
