import type { Metadata } from "next";
import { Background } from "@/components/Background";
import { JsonLd } from "@/components/JsonLd";
import { Agents } from "@/components/landing/Agents";
import { Audience } from "@/components/landing/Audience";
import { Context } from "@/components/landing/Context";
import { Decide } from "@/components/landing/Decide";
import { Execution } from "@/components/landing/Execution";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Integrations } from "@/components/landing/Integrations";
import { Meeting } from "@/components/landing/Meeting";
import { Proactive } from "@/components/landing/Proactive";
import { Problem } from "@/components/landing/Problem";
import { Products } from "@/components/landing/Products";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { ScrollZoom } from "@/components/landing/ScrollZoom";
import { Workspace } from "@/components/landing/Workspace";
import { Nav } from "@/components/Nav";
import { softwareJsonLd } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Set to "/background.jpg" (file in /public) when the artwork is ready. */
const BACKGROUND_IMAGE: string | null = null;

/**
 * One story, top to bottom: product context is scattered → Selixa brings it
 * together → joins the meeting → knows the product → helps decide → agents
 * act → and it keeps going. Then the opening line again.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <JsonLd data={softwareJsonLd} />
      <main className="relative flex-1 overflow-x-clip">
        <Background src={BACKGROUND_IMAGE} />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <Hero />
          <Problem />
          <Meeting />
          <Context />
          <Decide />
          <Agents />
          <Products />
          <Workspace />
          <Proactive />
          <Execution />
          <Integrations />
          <Audience />
          <FinalCTA />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
      <ScrollZoom />
    </>
  );
}
