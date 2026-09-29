"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { RoleTabs } from "@/components/site/RoleTabs";

/** Copies `text`; the label flips to "Copied" for a moment. */
export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      // Clipboard blocked (insecure origin, permissions): the text stays selectable on the page.
    }
  };
  return (
    <button type="button" onClick={copy} className={`btn-ghost btn-ghost-sm ${className}`} aria-live="polite">
      {done ? <Check className="h-3.5 w-3.5 text-brand-400" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />}
      {done ? "Copied" : label}
    </button>
  );
}

/** A colour swatch that copies its hex on click. */
export function Swatch({ name, hex, dark }: { name: string; hex: string; dark?: boolean }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    } catch {}
  };
  return (
    <button type="button" onClick={copy} className="group block w-full text-left" aria-label={`Copy ${name}, ${hex}`}>
      <span
        className="flex aspect-[4/3] items-end rounded-[12px] border border-line p-3 text-[0.75rem] transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5"
        style={{ background: hex, color: dark ? "#fff" : "#0d0d10" }}
      >
        <span className="opacity-0 transition-opacity group-hover:opacity-80 group-focus-visible:opacity-80">{done ? "Copied" : "Copy"}</span>
      </span>
      <span className="mt-2.5 block text-[0.875rem] text-fg">{name}</span>
      <span className="block font-mono text-[0.75rem] uppercase text-fg-3">{hex}</span>
    </button>
  );
}

type Banner = { id: string; label: string; alt: string; src: { dark: string; light: string } };
type Tone = "dark" | "light";

/**
 * The LinkedIn header, shown in place: a generic profile card (not LinkedIn's UI) with the
 * picked banner and an avatar over its lower left, where LinkedIn puts the photo. The banner
 * art keeps that corner empty for this reason. Pick a style, then dark or light.
 */
export function LinkedInPreview({ banners, headline }: { banners: Banner[]; headline: string }) {
  const [id, setId] = useState(banners[0].id);
  const [tone, setTone] = useState<Tone>("dark");
  const b = banners.find((x) => x.id === id)!;
  const src = b.src[tone];
  return (
    <div>
      <RoleTabs items={banners} value={id} onChange={setId} label="Banner style" idPrefix="banner" wrap="lines" className="justify-center" />
      <div role="group" aria-label="Banner tone" className="mt-4 flex justify-center gap-2">
        {(["dark", "light"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tone === t}
            onClick={() => setTone(t)}
            className={`btn-ghost btn-ghost-sm capitalize ${tone === t ? "!border-line-strong !text-fg" : ""}`}
          >
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full border border-line-strong ${t === "dark" ? "bg-[#050505]" : "bg-[#f7f7f5]"}`} />
            {t}
          </button>
        ))}
      </div>
      <div id={`banner-panel-${id}`} role="tabpanel" aria-labelledby={`banner-tab-${id}`} className="card mx-auto mt-8 max-w-[960px] overflow-hidden !rounded-[18px]">
        <div className="relative aspect-[4/1] w-full">
          {/* Plain <img>: the file is already sized, and the optimizer would cache it past a re-render. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`${b.alt}, ${tone}`} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="relative px-5 pb-6 sm:px-8">
          <div
            aria-hidden="true"
            className="-mt-[12%] grid aspect-square w-[22%] max-w-[152px] place-items-center rounded-full border-4 border-bg bg-panel-2 text-[clamp(1rem,3vw,1.75rem)] text-fg-3"
          >
            You
          </div>
          <p className="mt-3 text-[1.125rem] font-medium text-fg">Your name</p>
          <p className="mt-1 text-[0.9375rem] text-fg-2">{headline}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <a href={src} download className="btn-ghost">
          <Download className="h-4 w-4" strokeWidth={1.75} />
          Download this banner
        </a>
      </div>
    </div>
  );
}
