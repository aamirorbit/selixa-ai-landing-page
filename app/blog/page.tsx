import type { Metadata } from "next";
import { ConversationCTA } from "@/components/ConversationCTA";
import { Footer } from "@/components/landing/Footer";
import { Orb } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Blog — Selixa",
  description: "Notes on building products with an AI Product Manager.",
};

export default function Blog() {
  return (
    <>
      <Nav />
      <main className="relative flex flex-1 flex-col items-center justify-center px-5 py-32 text-center">
        <Orb size={64} />
        <p className="eyebrow mt-10">Blog</p>
        <h1 className="mt-5 max-w-[16ch] text-[clamp(2.25rem,4.4vw,3.75rem)] font-normal leading-[1.04] tracking-[-0.035em] text-fg">
          Notes on building products.
        </h1>
        <p className="mt-5 text-[1.125rem] text-fg-3">The first posts are on the way.</p>
        <div className="mt-10">
          <ConversationCTA label="Get started" />
        </div>
      </main>
      <Footer />
    </>
  );
}
