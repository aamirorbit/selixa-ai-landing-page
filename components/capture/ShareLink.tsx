"use client";

import { ArrowDown, Building2, Check, Lock, MessagesSquare, TriangleAlert, User, type LucideIcon } from "lucide-react";
import { Stage, Typed } from "@/components/landing/demo";
import { Mark, Section, SectionHeader, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { CAPTURE_COPY } from "./copy";

const C = CAPTURE_COPY.share;

// What Sarah chooses to tell the Atlas team (a sample product) through its Selixa link.
const FIELDS = [
  { k: "Name", v: "Sarah Kim" },
  { k: "Role", v: "Head of Product" },
  { k: "Company", v: "Acme" },
  { k: "Problem", v: "Hundreds of requests, no way to rank them" },
];

// Where it lands in the Atlas team's Selixa.
const CHAIN: { label: string; icon: LucideIcon | null }[] = [
  { label: "Sarah", icon: User },
  { label: "Acme", icon: Building2 },
  { label: "Product prioritization problem", icon: TriangleAlert },
  { label: "Your conversation at Token2049", icon: MessagesSquare },
  { label: "Selixa context", icon: null },
];

// each field fills, she agrees, it's sent, the chain lights link by link, hold
const SCRIPT = [500, ...FIELDS.map(() => 900), 700, 700, ...CHAIN.map(() => 360), 4600];
const AGREED = 1 + FIELDS.length;
const SENT = AGREED + 1;
const LINK = SENT + 1;

export function ShareLink() {
  const { ref, step, still } = useSequence(SCRIPT);

  return (
    <Section id="share">
      <div ref={ref} className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <SectionHeader num="06" label={C.label} title={C.headline} lead={C.line} />

          {/* Where it goes */}
          <ol data-reveal style={d(220)} className="mt-10 flex flex-col">
            {CHAIN.map(({ label, icon: Icon }, i) => {
              const on = still || step >= LINK + i;
              return (
                <li key={label} className="flex flex-col">
                  <span
                    className={`flex items-center gap-3 rounded-[12px] border px-4 py-3 text-[0.9375rem] transition-[border-color,color,background-color] duration-500 ${
                      on ? (Icon ? "border-line-strong text-fg" : "border-brand-400/50 bg-brand-500/10 text-fg") : "border-line text-fg-3"
                    }`}
                  >
                    {Icon ? (
                      <Icon className={`h-4 w-4 ${on ? "text-brand-300" : ""}`} strokeWidth={1.6} aria-hidden="true" />
                    ) : (
                      <Mark className="h-4 w-4 text-fg" />
                    )}
                    {label}
                  </span>
                  {i < CHAIN.length - 1 && <ArrowDown className={`mx-auto my-1.5 h-3.5 w-3.5 ${on ? "text-brand-400" : "text-fg-3/60"}`} strokeWidth={1.5} aria-hidden="true" />}
                </li>
              );
            })}
          </ol>
        </div>

        {/* The page Sarah opens */}
        <div data-reveal style={d(160)} className="window mx-auto w-full max-w-[26rem] p-6 sm:p-7">
          <div className="flex items-center gap-2 text-[0.75rem] text-fg-3">
            <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
            Shared by the Atlas team
          </div>
          <div className="mt-6 flex items-center gap-2.5">
            <Mark className="h-5 w-5 text-fg" />
            <p className="text-[1.25rem] leading-[1.25] tracking-[-0.02em] text-fg">Tell Selixa what you&rsquo;re working on.</p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {FIELDS.map((f, i) => (
              <div key={f.k}>
                <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{f.k}</p>
                <div
                  className={`mt-1.5 min-h-[2.5rem] rounded-[10px] border bg-well px-3 py-2.5 text-[0.9375rem] text-fg transition-colors duration-300 ${
                    !still && step === i + 1 ? "border-brand-400/50" : "border-line"
                  }`}
                >
                  <Typed text={f.v} on={step > i} still={still} cps={30} />
                </div>
              </div>
            ))}
          </div>

          {/* Consent, in plain words */}
          <div className="mt-5 flex items-start gap-3 rounded-[12px] border border-line bg-ink/[0.02] p-3.5">
            <span
              className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border transition-colors duration-300 ${
                still || step >= AGREED ? "border-brand-400 bg-brand-500 text-white" : "border-line-strong"
              }`}
              aria-hidden="true"
            >
              {(still || step >= AGREED) && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <p className="text-[0.8125rem] leading-[1.5] text-fg-2">
              Share only this with Atlas. Edit or delete anytime.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className={`btn-ghost w-full justify-center ${still || step >= SENT ? "border-brand-400/50 text-fg" : ""}`}>
              {still || step >= SENT ? (
                <>
                  <Check className="h-4 w-4 text-brand-300" strokeWidth={2} aria-hidden="true" />
                  Shared with Atlas
                </>
              ) : (
                "Share with Atlas"
              )}
            </span>
          </div>
          <Stage on={still || step >= SENT} as="p" className="mt-3 text-center text-[0.75rem] text-fg-3">
            She stays in control.
          </Stage>
        </div>
      </div>
    </Section>
  );
}
