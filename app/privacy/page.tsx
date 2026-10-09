import type { Metadata } from "next";
import { AnalyticsOptOut } from "@/components/AnalyticsOptOut";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { Nav } from "@/components/Nav";
import { PageHeroTitle } from "@/components/site/PageHero";
import { breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy — Selixa",
  description: "What selixa.ai collects when you visit, why, how long it's kept, and how to turn analytics off.",
  ogTitle: "Privacy — Selixa",
  ogDescription: "What selixa.ai collects, and how to turn it off.",
  path: "/privacy",
});

const CONTACT = "hello@selixa.ai";

// Every claim here must stay true of lib/track.ts, lib/analytics.ts and app/api/e/route.ts.
// Change the code, change this page. Have counsel review before relying on it.
const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Analytics, without cookies",
    body: (
      <>
        <p>
          We run our own analytics on selixa.ai to see which pages help and where people get stuck. It sets no cookies and stores
          nothing in your browser. Nothing goes to Google, ad networks or any other analytics company.
        </p>
        <p>When you visit, we record:</p>
        <ul>
          <li>the pages you open, how far you scroll and how long the tab is in view</li>
          <li>what you click (the button or link text and where it goes, plus its position on the page)</li>
          <li>the steps you reach in our sign-up flow</li>
          <li>the site that sent you, and any campaign tag in the link</li>
          <li>your approximate location (country, region, city), looked up from your IP address by our host</li>
          <li>device type, browser and operating system, in broad terms</li>
        </ul>
        <p>
          We never store your IP address or your full browser details. We never record what you type, your screen, or your
          keystrokes. To count visits, we combine your IP address and browser details with a random key that changes every day,
          and keep only the scrambled result. Yesterday&apos;s key is deleted, so we can&apos;t link your visits across days or
          work back to who you are.
        </p>
        <p>Analytics records are deleted after 13 months.</p>
      </>
    ),
  },
  {
    title: "Turning analytics off",
    body: (
      <>
        <p>
          If your browser sends Global Privacy Control or Do Not Track, we record nothing. You can also switch analytics off here.
          The switch saves one setting in this browser so we remember your choice.
        </p>
        <AnalyticsOptOut />
      </>
    ),
  },
  {
    title: "What you send us",
    body: (
      <p>
        When you fill in a form, we keep what you entered (name, email, company, website and answers) so we can reply and set
        you up. We don&apos;t sell it or use it for advertising.
      </p>
    ),
  },
  {
    title: "Who processes it",
    body: (
      <p>
        Our hosting and database providers store and process this data for us. Nobody else receives it.
      </p>
    ),
  },
  {
    title: "Why, and your rights",
    body: (
      <p>
        We rely on our legitimate interest in understanding and improving our own website, in a way built to keep you
        anonymous. You can ask us what we hold about you, or ask us to correct or delete it, by writing to{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. You can also complain to your local data protection authority.
      </p>
    ),
  },
];

/** /privacy: what the site collects, in plain words, with the analytics opt-out. */
export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Privacy", path: "/privacy" }])} />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8">
          <section className="mx-auto max-w-[44rem] py-16 lg:py-20">
            <PageHeroTitle align="left" size="compact" eyebrow="Privacy" title="what we collect." line="Plain words, and a switch to turn it off." />
            <div className="mt-12 flex flex-col gap-10">
              {SECTIONS.map((s) => (
                <section key={s.title}>
                  <h2 className="text-[1.25rem] font-medium tracking-[-0.01em] text-fg">{s.title}</h2>
                  <div className="mt-3 flex flex-col gap-3 text-[1rem] leading-[1.65] text-fg-2 [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5">
                    {s.body}
                  </div>
                </section>
              ))}
              <p className="text-[0.875rem] text-fg-3">Last updated 9 October 2026.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
