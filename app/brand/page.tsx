import { Download } from "lucide-react";
import type { Metadata } from "next";
import { CopyButton, LinkedInPreview, Swatch } from "@/components/brand/BrandPieces";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { d, Mark, Orb } from "@/components/landing/ui";
import { Nav } from "@/components/Nav";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { BRAND, breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/site";

// Every file lives in public/brand. The PNGs are rendered from the same mark path as
// components/landing/ui.tsx (Mark), in Satoshi Light and Inter, so they match the site.
const K = "/brand";
/** Bump after re-running scripts/render-brand-assets.py, so browsers fetch the new banners. */
const V = "?v=19";

const C = {
  eyebrow: "Brand",
  headline: "take selixa with you.",
  line: "The logo, the colours and a LinkedIn banner. Free to use when you talk about Selixa.",
  kit: { label: "Download the kit", href: `${K}/selixa-brand-kit.zip`, note: "SVG and PNG · 3.4 MB" },
  linkedin: {
    headline: "wear it on LinkedIn.",
    line: "Backing Selixa? Put it in your profile header.",
    banners: [
      { id: "integrated", label: "Integrated", alt: "LinkedIn banner: Agentic Operating Systems for Product Management, integrated with 11 tools" },
      { id: "plain", label: "Plain", alt: "LinkedIn banner: stop building in chaos, on a plain background" },
      { id: "headline", label: "Headline", alt: "LinkedIn banner: stop building in chaos" },
      { id: "tagline", label: "Tagline", alt: "LinkedIn banner: Agentic Operating Systems for Product Management" },
      { id: "connected", label: "Connected", alt: "LinkedIn banner: 11 tools flow into Selixa, and out come decisions, an updated roadmap, tasks and a recap" },
    ].map((b) => ({ ...b, src: { dark: `${K}/linkedin-banner-${b.id}-dark.png${V}`, light: `${K}/linkedin-banner-${b.id}-light.png${V}` } })),
    profileLine: "Building with Selixa",
    steps: [
      "Download a banner. It's LinkedIn's shape, at 2× for sharp screens.",
      "On your profile, click the camera on the header.",
      "Upload it and save. The photo corner is kept clear.",
    ],
    headlineHint: "Add a line to your headline:",
  },
  logos: {
    headline: "the logo.",
    items: [
      { name: "Mark, white", preview: "dark", tone: "text-white", files: [{ label: "SVG", href: `${K}/selixa-mark-white.svg` }] },
      { name: "Mark, black", preview: "light", tone: "text-[#0d0d10]", files: [{ label: "SVG", href: `${K}/selixa-mark-black.svg` }] },
      { name: "Mark, crimson", preview: "dark", tone: "text-[#f23a2b]", files: [{ label: "SVG", href: `${K}/selixa-mark-crimson.svg` }] },
      { name: "Logo, white", preview: "dark", tone: "text-white", lockup: true, files: [{ label: "PNG", href: `${K}/selixa-logo-white.png` }] },
      { name: "Logo, black", preview: "light", tone: "text-[#0d0d10]", lockup: true, files: [{ label: "PNG", href: `${K}/selixa-logo-black.png` }] },
      { name: "App icon", preview: "icon", tone: "", files: [{ label: "PNG", href: `${K}/selixa-icon.png` }] },
    ],
  },
  colours: {
    headline: "the colours.",
    ramp: [
      { name: "Blush", hex: "#ffd9d6" },
      { name: "Coral", hex: "#ff6a5c" },
      { name: "Crimson", hex: "#f23a2b", dark: true },
      { name: "Ember", hex: "#d0241a", dark: true },
      { name: "Oxblood", hex: "#9b1712", dark: true },
      { name: "Night", hex: "#050505", dark: true },
      { name: "Paper", hex: "#f7f7f5" },
    ],
  },
  type: {
    headline: "the type.",
    faces: [
      { name: "Satoshi Light", use: "Headlines, always lowercase.", sample: "stop building in chaos.", display: true },
      { name: "Inter", use: "Everything else. Never bold.", sample: "Your AI Product Manager.", display: false },
    ],
  },
  name: {
    headline: "the name.",
    rules: ["Selixa. One word, capital S.", "Not SELIXA, Selixa AI, or SeliXa."],
    about: BRAND.summary,
  },
  usage: {
    headline: "a few rules.",
    do: ["Give the logo room to breathe.", "Use it on plain, calm backgrounds.", "Link to selixa.ai when you can."],
    dont: ["Stretch, rotate or recolour the mark.", "Add effects or outlines.", "Suggest Selixa endorses you."],
  },
  cta: { headline: "stop building in chaos.", line: "Start with your product's website." },
};

export const metadata: Metadata = pageMetadata({
  title: "Brand — Selixa",
  description: "Download the Selixa logo, colours and LinkedIn banners. Free to use when you write, post or talk about Selixa.",
  ogTitle: "Take Selixa with you — Brand",
  ogDescription: "The Selixa logo, colours and a LinkedIn header banner, ready to download.",
  path: "/brand",
});

const h2 = "font-display text-[clamp(1.75rem,3vw,2.25rem)] font-light tracking-[-0.035em] text-fg";
const tile = { dark: "bg-[#050505]", light: "bg-[#f7f7f5]", icon: "bg-[#050505]" } as const;

/**
 * /brand: a press-kit page. Download the kit up top, then the LinkedIn header (the page's
 * signature: see it on a profile before you download it), logos, colours, type, name, rules.
 */
export default function BrandPage() {
  return (
    <>
      <Nav />
      <JsonLd data={breadcrumbJsonLd([{ name: "Brand", path: "/brand" }])} />
      <main className="relative flex-1 overflow-x-clip">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-8">
          <PageHero
            live={false}
            eyebrow={C.eyebrow}
            title={C.headline}
            line={C.line}
            visual={
              <div className="flex flex-col items-center">
                <Orb size={112} />
                <a href={C.kit.href} download className="btn-ghost mt-10">
                  <Download className="h-4 w-4" strokeWidth={1.75} />
                  {C.kit.label}
                </a>
                <p className="mt-3 text-[0.8125rem] text-fg-3">{C.kit.note}</p>
              </div>
            }
          />

          {/* LinkedIn: the signature */}
          <section id="linkedin" className="mt-28 scroll-mt-24">
            <div data-reveal className="text-center">
              <h2 className={h2}>{C.linkedin.headline}</h2>
              <p className="mt-3 text-[1rem] text-fg-2">{C.linkedin.line}</p>
            </div>
            <div data-reveal className="mt-10">
              <LinkedInPreview banners={C.linkedin.banners} headline={C.linkedin.profileLine} />
            </div>
            <ol className="mx-auto mt-14 grid max-w-[960px] grid-cols-1 gap-8 md:grid-cols-3">
              {C.linkedin.steps.map((s, i) => (
                <li key={s} data-reveal style={d(i * 60)} className="border-t border-line pt-5">
                  <p className="text-[0.75rem] tabular-nums text-fg-3">0{i + 1}</p>
                  <p className="mt-2 text-[0.9375rem] leading-[1.6] text-fg-2">{s}</p>
                </li>
              ))}
            </ol>
            <div data-reveal className="mx-auto mt-10 flex max-w-[960px] flex-col items-start gap-3 rounded-[14px] border border-line p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.9375rem] text-fg-2">
                {C.linkedin.headlineHint} <span className="text-fg">{C.linkedin.profileLine}</span>
              </p>
              <CopyButton text={C.linkedin.profileLine} />
            </div>
          </section>

          {/* Logos */}
          <section id="logo" className="mt-32 scroll-mt-24">
            <h2 data-reveal className={`${h2} text-center`}>{C.logos.headline}</h2>
            <ul className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {C.logos.items.map((l, i) => (
                <li key={l.name} data-reveal style={d((i % 3) * 60)} className="card overflow-hidden">
                  <div className={`grid aspect-[16/10] place-items-center ${tile[l.preview as keyof typeof tile]}`}>
                    {l.preview === "icon" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.files[0].href} alt="" className="h-[58%] rounded-[22%]" />
                    ) : l.lockup ? (
                      <span className={`flex items-center gap-3 ${l.tone}`}>
                        <Mark className="h-9 w-auto" />
                        <span className="text-[2rem] font-medium leading-none tracking-[0.01em]">Selixa</span>
                      </span>
                    ) : (
                      <Mark className={`h-16 w-auto ${l.tone}`} />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
                    <span className="text-[0.875rem] text-fg">{l.name}</span>
                    <span className="flex gap-2">
                      {l.files.map((f) => (
                        <a key={f.href} href={f.href} download className="btn-ghost btn-ghost-sm" aria-label={`Download ${l.name}, ${f.label}`}>
                          <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                          {f.label}
                        </a>
                      ))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Colours */}
          <section id="colours" className="mt-32 scroll-mt-24">
            <h2 data-reveal className={`${h2} text-center`}>{C.colours.headline}</h2>
            <ul data-reveal className="mx-auto mt-10 grid max-w-[1040px] grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {C.colours.ramp.map((c) => (
                <li key={c.hex}>
                  <Swatch {...c} />
                </li>
              ))}
            </ul>
          </section>

          {/* Type */}
          <section id="type" className="mt-32 scroll-mt-24">
            <h2 data-reveal className={`${h2} text-center`}>{C.type.headline}</h2>
            <ul className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 md:grid-cols-2">
              {C.type.faces.map((f, i) => (
                <li key={f.name} data-reveal style={d(i * 60)} className="card p-6 sm:p-8">
                  <p
                    className={
                      f.display
                        ? "font-display text-[clamp(2rem,4vw,2.75rem)] font-light leading-[1.05] tracking-[-0.035em] text-fg"
                        : "text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] text-fg"
                    }
                  >
                    {f.sample}
                  </p>
                  <p className="mt-8 text-[0.875rem] text-fg">{f.name}</p>
                  <p className="mt-1 text-[0.875rem] text-fg-3">{f.use}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Name and a short description */}
          <section id="name" className="mx-auto mt-32 max-w-[1040px] scroll-mt-24">
            <h2 data-reveal className={`${h2} text-center`}>{C.name.headline}</h2>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr]">
              <ul data-reveal className="card p-6">
                {C.name.rules.map((r, i) => (
                  <li key={r} className={`text-[0.9375rem] ${i ? "mt-2 text-fg-3" : "text-fg"}`}>
                    {r}
                  </li>
                ))}
              </ul>
              <div data-reveal style={d(60)} className="card p-6">
                <p className="text-[0.9375rem] leading-[1.65] text-fg-2">{C.name.about}</p>
                <CopyButton text={C.name.about} label="Copy description" className="mt-5" />
              </div>
            </div>
          </section>

          {/* Usage */}
          <section id="usage" className="mx-auto mt-32 max-w-[1040px] scroll-mt-24">
            <h2 data-reveal className={`${h2} text-center`}>{C.usage.headline}</h2>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                { title: "Do", items: C.usage.do },
                { title: "Don't", items: C.usage.dont },
              ].map((col, i) => (
                <div key={col.title} data-reveal style={d(i * 60)} className="border-t border-line pt-5">
                  <p className="text-[0.75rem] uppercase tracking-[0.16em] text-fg-3">{col.title}</p>
                  <ul className="mt-3 space-y-2">
                    {col.items.map((t) => (
                      <li key={t} className="text-[0.9375rem] text-fg-2">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <CTASection title={C.cta.headline} line={C.cta.line} />
        </div>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
