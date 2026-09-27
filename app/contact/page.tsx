import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { d } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { PageHeroTitle } from "@/components/site/PageHero";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact — Selixa",
  description: "Tell us what you're building. We'll set you up with Selixa, your AI Product Manager.",
  ogTitle: "Contact Selixa",
  ogDescription: "Tell us what you're building.",
  path: "/contact",
});

/**
 * /contact: the inquiry form as a page, for direct links and people who'd rather skip the
 * modal. No CTA section: the form is the page's one primary action. No "Prefer email?" row
 * until the owner confirms an address.
 */
export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8">
          <section className="grid min-h-[calc(100svh-4.5rem)] grid-cols-1 items-center gap-10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
            <div className="mx-auto w-full max-w-[36rem] lg:col-span-5 lg:mx-0">
              <PageHeroTitle
                align="left"
                size="compact"
                eyebrow="Contact"
                title="talk to us."
                line={<span className="block max-w-[26rem]">Tell us what you’re building. We’ll take it from there.</span>}
              />
            </div>
            <div className="relative mx-auto w-full max-w-[36rem] lg:col-span-7 lg:mr-0">
              <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.08),transparent_65%)]" />
              <div className="reveal modal-panel max-h-none! overflow-visible! p-5! sm:p-8!" style={d(300)}>
                <InquiryForm titleId="contact-form-title" heading="Get started with Selixa" submitLabel="Request access" source="contact" />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
