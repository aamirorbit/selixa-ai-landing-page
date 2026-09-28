"use client";

import { Check, ChartLine, FileText, Map as MapIcon, Telescope, TrendingDown, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { Count, Typed } from "@/components/landing/demo";
import { LOGOS } from "@/components/landing/logos";
import { Orb, d } from "@/components/landing/ui";
import { Cite, DocBlock, DocSection, DocSurface, Highlight, MarginNote, useDocSection, type CiteSource } from "@/components/site/DocSurface";
import { Initials } from "@/components/site/Initials";
import { PRODUCT_COPY } from "./copy";

/*
 * The memo that writes itself (spec §3–4). No scroll scene: each section writes itself once
 * when its top passes 70% of the viewport. Writes run one at a time; if a later section
 * enters first, every earlier one completes instantly and only the newest animates.
 * Documents don't rewind. The server renders the finished document (still), which is also
 * what reduced motion keeps.
 */

const C = PRODUCT_COPY;
const S = C.sections;
const logo = (name: string) => LOGOS.find((l) => l.name === name);

const SOURCES: CiteSource[] = [
  { ...C.sources[0], icon: Video, href: "/product/meetings" },
  { ...C.sources[1], logo: logo("Intercom"), href: "/product/research" },
  { ...C.sources[2], icon: Telescope, href: "/product/research" },
  { ...C.sources[3], logo: logo("PostHog"), href: "/product/analytics" },
].map((s) => ({ kind: s.kind, title: s.title, quote: s.quote, linkText: s.linkText, href: s.href, icon: "icon" in s ? s.icon : undefined, logo: "logo" in s ? s.logo : undefined }));

/** The Evidence section's [1], which opens once by itself to teach the citations. */
const DEMO_CITE = "cite-evidence-1";

/* ---------- The writer ---------- */

// Per section: body blocks, and the special beat's length (ms) after the last block.
const PLAN = [
  { blocks: 1, special: 300 }, // Problem: stat underline
  { blocks: 4, special: 500 }, // Evidence: counts
  { blocks: 3, special: 680 }, // Options: strike + reason
  { blocks: 1, special: 300 }, // Recommendation: bar
  { blocks: 1, special: 0 }, // Impact
  { blocks: 3, special: 0 }, // Next steps
];
/** Which section each margin thread follows (Options, Recommendation, Next steps). */
const THREAD_OF = [2, 3, 5];

type State = {
  written: boolean[];
  active: { i: number; step: number } | null;
  /** Thread stages: 0 not started, 1 queued, 2 first message, 3 Selixa thinking, 4 done. */
  threads: number[];
  /** Resolved tags shown (0–3), then the doc is In review. */
  resolved: number;
  /** Evidence finished writing on its own (for the one-time citation demo). */
  evidenceAnimated: boolean;
};

type Action = { type: "enter"; i: number } | { type: "advance" } | { type: "thread"; k: number } | { type: "resolve" };

const initial: State = { written: PLAN.map(() => false), active: null, threads: [0, 0, 0], resolved: 0, evidenceAnimated: false };

function finishThreads(threads: number[], written: boolean[]) {
  return threads.map((t, k) => (written[THREAD_OF[k]] ? 4 : t));
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "enter": {
      if (s.written[a.i] || s.active?.i === a.i) return s;
      // Everything above completes instantly (including one mid-write); only this one animates.
      const written = s.written.map((w, j) => w || j < a.i);
      return { ...s, written, threads: finishThreads(s.threads, written), active: { i: a.i, step: 1 } };
    }
    case "advance": {
      if (!s.active) return s;
      const { i, step } = s.active;
      const last = PLAN[i].blocks + 2; // the special beat
      if (step < last) return { ...s, active: { i, step: step + 1 } };
      const written = s.written.map((w, j) => w || j === i);
      const k = THREAD_OF.indexOf(i);
      const threads = s.threads.map((t, j) => (j === k && t === 0 ? 1 : t));
      return { ...s, written, active: null, threads, evidenceAnimated: s.evidenceAnimated || i === 1 };
    }
    case "thread": {
      const threads = s.threads.map((t, j) => {
        if (j !== a.k || t === 0 || t >= 4) return t;
        if (a.k === 2 && t === 2) return 4; // Sara's single note
        return t + 1;
      });
      return { ...s, threads };
    }
    case "resolve":
      return { ...s, resolved: Math.min(3, s.resolved + 1) };
  }
}

const stepMs = (i: number, step: number) => {
  if (step === 1) return 400; // heading types
  if (step <= PLAN[i].blocks + 1) return 160; // one block each
  return PLAN[i].special + 200;
};
const THREAD_MS = [0, 300, 500, 600];

function useMemoWriter(sections: React.RefObject<(HTMLElement | null)[]>) {
  const [still, setStill] = useState(true);
  const [ready, setReady] = useState(false);
  const [s, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setStill(false);
      setReady(true);
    });
    return () => window.clearTimeout(t);
  }, []);

  // A section starts when its top passes 70% of the viewport (or it's already above it).
  useEffect(() => {
    if (still) return;
    const els = sections.current ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          const i = els.indexOf(e.target as HTMLElement);
          if (i >= 0) dispatch({ type: "enter", i });
        }
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [still, sections]);

  // Step the active section.
  const active = s.active;
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => dispatch({ type: "advance" }), stepMs(active.i, active.step));
    return () => window.clearTimeout(t);
  }, [active]);

  // Step the margin threads (they never block the queue).
  const [t0, t1, t2] = s.threads;
  useEffect(() => {
    const timers = [t0, t1, t2].map((t, k) => (t > 0 && t < 4 ? window.setTimeout(() => dispatch({ type: "thread", k }), THREAD_MS[t]) : 0));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [t0, t1, t2]);

  // After Sara's note: the Resolved tags, 120ms apart.
  const resolved = s.resolved;
  useEffect(() => {
    if (t2 < 4 || resolved >= 3) return;
    const t = window.setTimeout(() => dispatch({ type: "resolve" }), resolved === 0 ? 400 : 120);
    return () => window.clearTimeout(t);
  }, [t2, resolved]);

  return { still, ready, s };
}

/* ---------- Pieces ---------- */

function DocHeader({ review }: { review: boolean }) {
  return (
    <>
      <p className="flex min-w-0 items-center gap-2 text-[0.8125rem] text-fg-3">
        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-[4px] bg-brand-500 text-[0.625rem] text-[var(--brand-on)]" aria-hidden="true">
          A
        </span>
        <span className="hidden truncate sm:inline">{C.doc.crumbs.join(" / ")}</span>
        <span className="truncate sm:hidden">{C.doc.crumbs[C.doc.crumbs.length - 1]}</span>
      </p>
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden sm:flex">
          {C.doc.people.map((p, i) => (
            <Initials key={p} name={p} size={22} className={i ? "-ml-1.5" : ""} />
          ))}
        </span>
        <span className="grid justify-items-end [&>*]:col-start-1 [&>*]:row-start-1">
          <span className={`tag transition-opacity duration-200 ${review ? "opacity-0" : "opacity-100"}`}>
            <span className="live-dot" aria-hidden="true" />
            {C.doc.draft}
          </span>
          <span className={`tag transition-opacity duration-200 ${review ? "opacity-100" : "opacity-0"}`}>
            <Check className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
            {C.doc.review}
          </span>
        </span>
      </div>
    </>
  );
}

/** A section's special beat has started (or it's written). */
function useSpecial(blocks: number) {
  const { written, step } = useDocSection();
  return written || step >= blocks + 2;
}

function Problem() {
  const on = useSpecial(PLAN[0].blocks);
  return (
    <DocBlock index={0} as="p">
      {S.problem.before}
      <span className="relative whitespace-nowrap text-fg">
        {S.problem.stat}
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-brand-400/70 transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0"}`}
          style={{ transitionDelay: on ? "150ms" : "0ms" }}
        />
      </span>
      {S.problem.after}
    </DocBlock>
  );
}

function Evidence({ still }: { still: boolean }) {
  const on = useSpecial(PLAN[1].blocks);
  return (
    <ol>
      {S.evidence.items.map((item, i) => (
        <DocBlock key={item.cite} index={i} as="li" pitch="1.5em" className="border-t border-line py-3 first:border-t-0">
          <span className="grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-x-4 md:grid-cols-[88px_minmax(0,1fr)]">
            <span className="flex items-center gap-1.5 font-display text-[1.625rem] font-light leading-none tabular-nums text-fg md:text-[1.875rem]">
              {still ? item.value : <Count to={item.value} on={on} ms={500} />}
              {item.suffix}
              {"down" in item && item.down && <TrendingDown className="h-[18px] w-[18px] text-brand-400" strokeWidth={1.75} aria-hidden="true" />}
            </span>
            {/* Not positioned: the row (the reading column) is the popover's containing block */}
            <span className="text-[0.9375rem] leading-[1.5] text-fg-2">
              {item.label}
              <Cite n={item.cite} source={SOURCES[item.cite - 1]} id={item.cite === 1 ? DEMO_CITE : undefined} />
            </span>
          </span>
        </DocBlock>
      ))}
    </ol>
  );
}

function Options({ thread, strong }: { thread: boolean; strong: boolean }) {
  const on = useSpecial(PLAN[2].blocks);
  return (
    <ol className="flex flex-col gap-4">
      {S.options.items.map((o, i) => {
        const rejected = i === 2;
        const tag =
          i === 0 ? "border-brand-400/30 bg-brand-500/10 text-brand-200" : "";
        return (
          <DocBlock key={o.title} index={i} as="li" pitch="1.5em">
            <span className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-[0.75rem] tabular-nums text-fg-3" aria-hidden="true">
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <span className="relative text-[0.9375rem] leading-[1.5]">
                    {rejected ? (
                      <Highlight id="anchor-option-3" on={thread} strong={strong}>
                        <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
                          <span className={`text-fg transition-opacity duration-300 ${on ? "opacity-0" : "opacity-100"}`}>{o.title}</span>
                          <span aria-hidden="true" className={`text-fg-3 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}>
                            {o.title}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-0 top-[0.8em] h-px origin-left bg-fg-3 transition-transform duration-[400ms] ${on ? "scale-x-100" : "scale-x-0"}`}
                        />
                        {on && <span className="sr-only"> (rejected)</span>}
                      </Highlight>
                    ) : (
                      <span className="text-fg">{o.title}</span>
                    )}
                  </span>
                  <span className={`tag shrink-0 ${tag}`}>{o.verdict}</span>
                </span>
                {o.reason && (
                  <span
                    className={`mt-1 text-[0.875rem] leading-[1.5] text-fg-3 ${rejected ? `transition-opacity duration-[280ms] ${on ? "opacity-100" : "opacity-0"}` : ""}`}
                    style={rejected ? { transitionDelay: on ? "400ms" : "0ms" } : undefined}
                  >
                    {o.reason}
                  </span>
                )}
              </span>
            </span>
          </DocBlock>
        );
      })}
    </ol>
  );
}

function Recommendation({ thread, strong }: { thread: boolean; strong: boolean }) {
  const on = useSpecial(PLAN[3].blocks);
  return (
    <DocBlock index={0} as="blockquote" pitch="1.35em" className="pl-6">
      <span aria-hidden="true" className={`absolute -left-0 bottom-0 top-0 w-0.5 origin-top bg-brand-400 transition-transform duration-300 ${on ? "scale-y-100" : "scale-y-0"}`} />
      <span className="block text-[1.25rem] leading-[1.35] tracking-[-0.02em] text-fg md:text-[1.5rem]">
        <Highlight id="anchor-recommendation" on={thread} strong={strong}>
          {S.recommendation.statement}
        </Highlight>
      </span>
    </DocBlock>
  );
}

function Impact() {
  return (
    <DocBlock index={0} as="p">
      {S.impact.body}{" "}
      <Link href="/product/analytics" className="tag ml-1 inline-flex -translate-y-px gap-1.5 whitespace-nowrap py-0.5 align-middle text-[0.75rem] hover:text-fg">
        <ChartLine className="h-3 w-3 text-brand-300" strokeWidth={2} aria-hidden="true" />
        {S.impact.agentTag}
      </Link>
    </DocBlock>
  );
}

function NextSteps({ thread, strong }: { thread: boolean; strong: boolean }) {
  return (
    <Highlight id="anchor-next" on={thread} strong={strong} block>
      <ol className="flex flex-col gap-2.5">
        {S.next.items.map((t, i) => (
          <DocBlock key={t} index={i} as="li" pitch="1.5em">
            <span className="flex items-center gap-3 text-[0.9375rem] text-fg">
              <span className="h-4 w-4 shrink-0 rounded-[4px] border border-line-strong" aria-hidden="true" />
              {t}
            </span>
          </DocBlock>
        ))}
      </ol>
    </Highlight>
  );
}

function HandoffBar({ ready, shown }: { ready: boolean; shown: boolean }) {
  const hint = ready ? "border-brand-400/40" : "";
  return (
    // Hidden until the memo starts writing, so it never covers the title on the first screen.
    <div
      aria-hidden={!shown || undefined}
      className={`transition-[opacity,transform] duration-300 ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
    <div className="relative flex flex-col gap-3 rounded-[16px] border border-line bg-panel p-3 shadow-[0_18px_50px_-20px_rgb(var(--shadow-rgb)/0.35)] sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-0">
      {/* One glow pulse when the memo is ready */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-[16px] opacity-0 shadow-[0_0_0_3px_rgb(var(--brand-500-rgb)/0.15),0_0_40px_-8px_rgb(var(--brand-glow-rgb)/0.5)] ${ready ? "glow-once" : ""}`}
      />
      <span className="flex min-w-0 items-center gap-2.5">
        <Orb size={24} />
        <span className={`truncate text-[0.875rem] text-fg transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-45"}`}>{C.handoff.label}</span>
        <span className={`thinking transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className={`flex gap-2 transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-45"}`}>
        <Link href="/product/roadmap" aria-disabled={!ready} className={`btn-ghost btn-ghost-sm flex-1 justify-center sm:flex-none ${hint}`}>
          <MapIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          {C.handoff.button1}
        </Link>
        <Link href="/product/tasks" aria-disabled={!ready} className="btn-ghost btn-ghost-sm flex-1 justify-center sm:flex-none">
          <FileText className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          {C.handoff.button2}
        </Link>
      </span>
    </div>
    </div>
  );
}

/* ---------- The memo ---------- */

export function Memo() {
  const sections = useRef<(HTMLElement | null)[]>([]);
  const { still, ready, s } = useMemoWriter(sections);
  const [openCite, setOpenCite] = useState<string | null>(null);
  const [userOpened, setUserOpened] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  // Title types after the hero has revealed; the meta line follows.
  const [titleOn, setTitleOn] = useState(false);
  useEffect(() => {
    if (still) return;
    const t = window.setTimeout(() => setTitleOn(true), 600);
    return () => window.clearTimeout(t);
  }, [still]);

  // Teach the citations once: [1] opens by itself after Evidence writes, unless the visitor
  // has already opened one.
  const demo = s.evidenceAnimated && !userOpened;
  useEffect(() => {
    if (!demo) return;
    const open = window.setTimeout(() => setOpenCite(DEMO_CITE), 200);
    const close = window.setTimeout(() => setOpenCite((k) => (k === DEMO_CITE ? null : k)), 2600);
    return () => {
      window.clearTimeout(open);
      window.clearTimeout(close);
    };
    // Runs once: evidenceAnimated only ever turns true.
  }, [demo]);

  const done = (i: number) => still || s.written[i];
  const stepOf = (i: number) => (s.active?.i === i ? s.active.step : 0);
  const thread = (k: number) => (still ? 4 : s.threads[k]);
  const review = still || s.resolved >= 3;
  const heading = (i: number, text: string) =>
    !still && s.active?.i === i && s.active.step >= 1 ? <Typed text={text} on cps={55} /> : undefined;

  const threadNote = (k: number) => {
    const t = thread(k);
    const msgs = C.notes.threads[k].map((m, j) => ({
      author: m.author,
      selixa: "selixa" in m && m.selixa,
      body: k === 1 && j === 1 ? (
        <>
          All 4 customer calls skipped it
          <Cite n={1} source={SOURCES[0]} />. I’d replace it with a 3-step checklist.
        </>
      ) : (
        m.body
      ),
      shown: j === 0 ? t >= 2 : t >= 3,
      thinking: j === 1 && t === 3,
    }));
    return (
      <MarginNote
        anchorId={["anchor-option-3", "anchor-recommendation", "anchor-next"][k]}
        messages={msgs}
        resolved={still || s.resolved > k}
        resolvedLabel={C.notes.resolved}
        onActive={(a) => setHover(a ? k : null)}
        className={`transition-opacity duration-300 ${t >= 2 ? "opacity-100" : "opacity-0"}`}
      />
    );
  };
  const hl = (k: number) => ({ on: thread(k) >= 2, strong: hover === k });

  const register = (i: number) => (el: HTMLElement | null) => {
    sections.current[i] = el;
  };

  return (
    // With motion on, the server's finished memo stays hidden until the writer takes over, so it
    // never flashes before fading back to skeletons (no JS / reduced motion: shown as is).
    <div className="memo-gate" data-ready={ready || undefined}>
    <DocSurface
      id="memo"
      tone="paper"
      margin
      openCite={openCite}
      onOpenCite={(n) => {
        setOpenCite(n);
        if (n != null) setUserOpened(true);
      }}
      header={<DocHeader review={review} />}
      footer={<HandoffBar ready={review} shown={still || s.written.some(Boolean) || !!s.active} />}
      className="mx-auto mt-10 max-w-[1160px] md:mt-12"
    >
      {/* Title */}
      <div className="pt-8 md:pt-12">
        <p role="heading" aria-level={2} className="relative font-display text-[clamp(2.25rem,4.2vw,3.5rem)] font-light leading-[1.02] tracking-[-0.04em] text-fg">
          {still ? C.doc.title : <Typed text={C.doc.title} on={titleOn} cps={32} />}
        </p>
        <p className="st mt-4 flex items-center gap-2.5 text-[0.8125rem] text-fg-3" data-on={still || titleOn} style={d(still ? 0 : 900)}>
          <Orb size={20} />
          {C.doc.meta}
        </p>
        <div className="mt-8 h-px bg-line" />
      </div>

      <Section i={0} register={register} num="01" heading={S.problem.heading} typing={heading(0, S.problem.heading)} done={done(0)} step={stepOf(0)}
        notes={
          <p
            className={`hidden font-display text-[1.375rem] font-light leading-tight tracking-[-0.02em] text-fg-2 transition-opacity duration-300 lg:block ${thread(0) >= 2 ? "opacity-100" : "opacity-0"}`}
          >
            {C.notes.headline}
          </p>
        }
      >
        <Problem />
      </Section>
      <Section i={1} register={register} num="02" heading={S.evidence.heading} typing={heading(1, S.evidence.heading)} done={done(1)} step={stepOf(1)}>
        <Evidence still={still} />
      </Section>
      <Section i={2} register={register} num="03" heading={S.options.heading} typing={heading(2, S.options.heading)} done={done(2)} step={stepOf(2)}
        notes={
          <>
            <p className="sr-only">{C.notes.headline}</p>
            {threadNote(0)}
          </>
        }
      >
        <Options thread={hl(0).on} strong={hl(0).strong} />
      </Section>
      <Section i={3} register={register} num="04" heading={S.recommendation.heading} typing={heading(3, S.recommendation.heading)} done={done(3)} step={stepOf(3)}
        notes={threadNote(1)}
      >
        <Recommendation thread={hl(1).on} strong={hl(1).strong} />
      </Section>
      <Section i={4} register={register} num="05" heading={S.impact.heading} typing={heading(4, S.impact.heading)} done={done(4)} step={stepOf(4)}>
        <Impact />
      </Section>
      <Section i={5} register={register} num="06" heading={S.next.heading} typing={heading(5, S.next.heading)} done={done(5)} step={stepOf(5)}
        notes={threadNote(2)}
      >
        <NextSteps thread={hl(2).on} strong={hl(2).strong} />
      </Section>
    </DocSurface>
    </div>
  );
}

function Section({
  i,
  register,
  num,
  heading,
  typing,
  done,
  step,
  notes,
  children,
}: {
  i: number;
  register: (i: number) => (el: HTMLElement | null) => void;
  num: string;
  heading: string;
  typing?: ReactNode;
  done: boolean;
  step: number;
  notes?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div ref={register(i)}>
      <DocSection num={num} heading={heading} headingNode={typing} written={done} step={step} notes={notes}>
        {children}
      </DocSection>
    </div>
  );
}
