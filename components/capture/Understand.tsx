"use client";

import { AudioLines, Check } from "lucide-react";
import { Stage } from "@/components/landing/demo";
import { Avatar, Orb, Section, SectionHeader, WindowBar } from "@/components/landing/ui";
import { useScrollSequence } from "@/components/landing/useScrollSequence";
import { CAPTURE_COPY } from "./copy";

const C = CAPTURE_COPY.understand;

// The raw words, split so the parts Selixa picks up can light as it reads them.
// `f` is the index of the field (below) that phrase feeds.
const QUOTE: { t: string; f?: number }[] = [
  { t: "We’ve got " },
  { t: "hundreds of customer requests", f: 1 },
  { t: " coming through " },
  { t: "Slack and email", f: 1 },
  { t: ". The hard part is " },
  { t: "figuring out which ones actually represent a bigger problem", f: 3 },
  { t: "." },
];

const FIELDS: { k: string; v: string; sub?: string; lit?: boolean }[] = [
  { k: "Person", v: "Sarah", sub: "Head of Product · Acme" },
  { k: "Pain point", v: "No reliable way to identify recurring demand.", lit: true },
  { k: "Topic", v: "Product prioritization" },
  { k: "Potential opportunity", v: "AI-assisted request clustering", lit: true },
  { k: "Follow-up", v: "Explore prioritization workflow" },
];

// reading, then each field lands (lighting the words it came from), hold
const SCRIPT = [900, ...FIELDS.map(() => 700), 5200];
const FIELD = 1;

export function Understand() {
  const { ref, step, still } = useScrollSequence(SCRIPT);
  const current = still ? -1 : step - FIELD;

  return (
    <Section id="understand">
      <SectionHeader num="01" label={C.label} title={C.headline} align="center" className="mx-auto" />

      <div className="relative mt-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] top-[6%] h-[80%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--brand-glow-rgb)/0.14),transparent)] blur-2xl" />

        <div ref={ref} data-reveal className="window relative">
          <WindowBar>
            <span className="flex items-center gap-2 text-fg-2">
              <AudioLines className="h-3.5 w-3.5 text-brand-300" strokeWidth={1.75} aria-hidden="true" />
              Selixa · Capture
            </span>
            <span className="ml-auto rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-fg-3">Sample</span>
          </WindowBar>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* Raw conversation */}
            <div className="border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-fg-3">Raw conversation</p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar name="Sarah Kim" />
                <span className="text-[0.9375rem] text-fg">Sarah</span>
                <span className="text-[0.75rem] text-fg-3">Customer call · 06:12</span>
              </div>
              <p className="mt-5 text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.6] tracking-[-0.01em] text-fg-2">
                &ldquo;
                {QUOTE.map((q, i) => {
                  const lit = q.f != null && (still || q.f <= current);
                  const now = q.f != null && q.f === current;
                  return (
                    <span
                      key={i}
                      className={`rounded-[4px] transition-[background-color,color] duration-500 ${lit ? "text-fg" : ""} ${
                        now ? "bg-brand-500/20" : lit ? "bg-brand-500/[0.08]" : ""
                      }`}
                    >
                      {q.t}
                    </span>
                  );
                })}
                &rdquo;
              </p>
              <div className="mt-8 flex items-end gap-[3px]" aria-hidden="true">
                {Array.from({ length: 48 }, (_, i) => (
                  <i key={i} className="block w-[3px] rounded-full bg-ink/15" style={{ height: `${6 + Math.round(Math.abs(Math.sin(i * 1.7) * 18 + Math.cos(i * 0.6) * 6))}px` }} />
                ))}
              </div>
            </div>

            {/* What Selixa understood */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2.5">
                <Orb size={28} />
                <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-brand-300">Selixa understands</p>
              </div>
              <dl className="mt-5 flex flex-col">
                {FIELDS.map((f, i) => (
                  <Stage
                    key={f.k}
                    on={still || step >= FIELD + i}
                    className={`grid grid-cols-[9rem_minmax(0,1fr)] gap-3 rounded-[10px] border border-transparent px-3 py-2.5 ${!still && step === FIELD + i ? "is-live" : ""}`}
                  >
                    <dt className="pt-0.5 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{f.k}</dt>
                    <dd className={`text-[0.9375rem] leading-[1.45] ${f.lit ? "text-fg" : "text-fg-2"}`}>
                      {f.v}
                      {f.sub && <span className="block text-[0.8125rem] text-fg-3">{f.sub}</span>}
                    </dd>
                  </Stage>
                ))}
              </dl>
              <Stage on={still || step >= FIELD + FIELDS.length - 1} className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[0.75rem] uppercase tracking-[0.16em] text-fg-3">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                </span>
                Understood by Selixa
              </Stage>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
