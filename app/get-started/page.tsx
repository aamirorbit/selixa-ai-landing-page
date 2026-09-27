import type { Metadata } from "next";
import { GS } from "@/components/get-started/copy";
import { OnboardingFlow } from "@/components/get-started/OnboardingFlow";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/Nav";
import { pageMetadata, toDomain } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ ...GS.meta, path: "/get-started" });

/**
 * /get-started: the interview. One input at a time, with a brief card building beside it.
 * `?site=acme.com` pre-fills the site (only if the tab hasn't already got one) and opens on
 * Tools. No CTA section: this page is where the CTA leads.
 */
export default async function GetStartedPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const raw = Array.isArray(params.site) ? params.site[0] : params.site;
  const initialSite = raw ? toDomain(raw) : "";
  return (
    <>
      <Nav />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8">
          <OnboardingFlow initialSite={initialSite} />
        </div>
      </main>
      <Footer />
    </>
  );
}
