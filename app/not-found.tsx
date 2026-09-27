import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/Nav";
import { NotFoundWord } from "@/components/not-found/NotFoundWord";
import { IntegrationSearch } from "@/components/site/integrations/IntegrationSearch";

// Copy: docs/pages/not-found.copy.md. Next adds noindex to 404 responses.
export const metadata: Metadata = { title: "Not found — Selixa" };

/**
 * The 404: the home page's close in miniature. The words tumble into line once, then two ways
 * back: search the integrations, or go home. No site CTA here (recovery, not a pitch).
 */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <section className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] w-full max-w-[1280px] flex-col items-center justify-center px-4 py-16 text-center sm:px-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="aspect-square w-[min(90vw,40rem)] rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.1),transparent_65%)]" />
            <div className="absolute aspect-square w-[min(80vw,34rem)] rounded-full border border-ink/[0.05]" />
            <div className="spin-slow absolute aspect-square w-[min(64vw,26rem)] rounded-full border border-dashed border-ink/[0.06]" />
          </div>
          <div className="relative flex w-full flex-col items-center">
            <NotFoundWord text="not found." />
            <p className="mt-6 max-w-[28rem] text-[1rem] leading-[1.6] text-fg-2 sm:text-[1.125rem]">This page wandered off. Let&rsquo;s get you back.</p>
            <div className="mt-10 w-full">
              <IntegrationSearch
                compact
                shortcuts={false}
                copy={{
                  placeholder: "Search integrations",
                  label: "Search integrations",
                  hint: "⌘K",
                  countMany: "{n} integrations",
                  countOne: "1 integration",
                  all: "All",
                  emptyBefore: "No tools match “",
                  emptyAfter: "”.",
                  emptyLink: "",
                  requestPrefix: "",
                  request: { href: "/integrations", title: "", body: "" },
                }}
              />
            </div>
            <Link href="/" className="link-arrow mt-6 text-[0.9375rem]">
              Back to home
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
