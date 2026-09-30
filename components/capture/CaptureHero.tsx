"use client";

import { ArrowDown, ChevronDown } from "lucide-react";
import { ConversationCTA } from "@/components/ConversationCTA";
import { Stage } from "@/components/landing/demo";
import { Avatar, Orb, d } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { PageHeroTitle } from "@/components/site/PageHero";
import { CAPTURE_COPY } from "./copy";
import { TelegramMark } from "./marks";

const C = CAPTURE_COPY.hero;

const QUOTE =
  "Honestly, our biggest problem is that we have hundreds of customer requests, but no idea which ones are actually worth building.";

// What Selixa takes from that one message. Sample person and company.
const FIELDS = [
  { k: "Problem", v: "Customer requests are difficult to prioritize.", lit: true },
  { k: "Person", v: "Sarah · Head of Product · Acme" },
  { k: "Topic", v: "Product prioritization" },
  { k: "Opportunity", v: "AI-assisted product prioritization", lit: true },
  { k: "Source", v: "Telegram · Today" },
];

// message arrives, Selixa picks it up, each field lands, hold
const SCRIPT = [500, 900, 900, ...FIELDS.map(() => 450), 5200];
const MESSAGE = 1;
const TAKEN = 2;
const FIELD = 3;

/** A Telegram message on the left; what Selixa understood from it on the right. */
function HeroVisual() {
  const { ref, step, still } = useSequence(SCRIPT);

  return (
    <div ref={ref} className="relative mx-auto grid w-full max-w-[64rem] grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] lg:gap-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[15%] top-[10%] h-[80%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(var(--brand-glow-rgb)/0.14),transparent)] blur-2xl" />

      {/* The message, where it happened */}
      <div className="card relative p-5 text-left sm:p-6">
        <div className="flex items-center gap-2 text-[0.75rem] text-fg-3">
          <TelegramMark className="h-3.5 w-3.5" />
          Telegram
          <span className="ml-auto tabular-nums">14:32</span>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Avatar name="Sarah Kim" />
          <span className="flex flex-col">
            <span className="text-[0.9375rem] text-fg">Sarah</span>
            <span className="text-[0.75rem] text-fg-3">Head of Product · Acme</span>
          </span>
        </div>
        <Stage on={step >= MESSAGE} className="mt-4 rounded-[16px] rounded-tl-[4px] border border-line bg-ink/[0.04] px-4 py-3 text-[0.9375rem] leading-[1.55] text-fg">
          &ldquo;{QUOTE}&rdquo;
        </Stage>
        <Stage on={step >= TAKEN} className="mt-4 flex items-center gap-2 text-[0.75rem] text-brand-300">
          <span className="live-dot" aria-hidden="true" />
          Captured to Selixa, with Sarah&rsquo;s OK
        </Stage>
      </div>

      {/* Into Selixa */}
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 top-1/2 hidden h-5 w-full -translate-y-1/2 lg:block">
          <line x1="0" y1="10" x2="100" y2="10" stroke="rgb(var(--brand-400-rgb))" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" data-on={still || step >= TAKEN} className="line-in" />
          {!still && step >= TAKEN && <line x1="0" y1="10" x2="100" y2="10" stroke="rgb(var(--brand-300-rgb))" className="flow" vectorEffect="non-scaling-stroke" />}
        </svg>
        <span className="relative">
          <Orb size={48} />
        </span>
        <ArrowDown className="absolute -bottom-3 h-4 w-4 text-brand-400 lg:hidden" strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* What Selixa understood */}
      <div className={`card card-lit relative p-5 text-left sm:p-6 ${!still && step >= TAKEN && step < FIELD + FIELDS.length ? "is-live" : ""}`}>
        <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-brand-300">Understood by Selixa</p>
        <dl className="mt-4 flex flex-col">
          {FIELDS.map((f, i) => (
            <Stage key={f.k} on={step >= FIELD + i} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-t border-line py-2.5 first:border-t-0">
              <dt className="pt-0.5 text-[0.6875rem] uppercase tracking-[0.14em] text-fg-3">{f.k}</dt>
              <dd className={`text-[0.9375rem] leading-[1.45] ${f.lit ? "text-fg" : "text-fg-2"}`}>{f.v}</dd>
            </Stage>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function CaptureHero() {
  return (
    <section className="relative flex flex-col pb-10 pt-14 sm:pt-20">
      <PageHeroTitle eyebrow={C.eyebrow} title={C.headline} line={C.line} />

      <div className="reveal mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-7" style={d(300)}>
        <ConversationCTA variant="premium" label={C.cta} defaults={{ problem: "I’d like to try Selixa Capture." }} />
        <a href="#understand" className="flex items-center gap-1.5 text-[0.9375rem] text-fg-2 transition-colors duration-200 hover:text-fg">
          {C.secondary}
          <ChevronDown className="bob h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        </a>
      </div>

      <div className="reveal relative mt-16" style={d(420)}>
        <HeroVisual />
      </div>
    </section>
  );
}
