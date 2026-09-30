"use client";

import { ArrowRight, CircleHelp, Lightbulb, ListChecks, Scale, Send, type LucideIcon } from "lucide-react";
import { useLayoutEffect, useRef, type Ref } from "react";
import { StickyScene, seg, smoothstep, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { Count, Stage, Typed } from "./demo";
import { Avatar, Orb, SectionHeader, WindowBar } from "./ui";
import { useScrollSequence } from "./useScrollSequence";

const PEOPLE = [
  { name: "Maya Chen", role: "Design" },
  { name: "Dev Patel", role: "Engineering" },
  { name: "Sara Kim", role: "Product" },
];

// Who speaks at which step of the script.
const TRANSCRIPT = [
  { who: "Maya Chen", step: 1, text: "Yesterday I tested the new setup flow. People still stall at the integrations step." },
  { who: "Dev Patel", step: 2, text: "Today I can move the Slack connect later, so it ships this sprint." },
  { who: "Sara Kim", step: 3, text: "Let’s do that. Ship the shorter flow on the 14th." },
];

type Capture = { count: number; label: string; example: string; icon: LucideIcon; step: number };

const CAPTURED: Capture[] = [
  { count: 3, label: "Decisions", example: "Ship the shorter onboarding flow on Oct 14", icon: Scale, step: 4 },
  { count: 5, label: "Action items", example: "Dev · Move Slack connect after first project", icon: ListChecks, step: 5 },
  { count: 2, label: "Open questions", example: "Should imports stay behind the trial?", icon: CircleHelp, step: 6 },
  { count: 1, label: "Product insight", example: "Onboarding friction is a recurring theme", icon: Lightbulb, step: 7 },
];

//             reset Maya  Dev   Sara  dec  act  q    ins  card  hold
const SCRIPT = [400, 2000, 1500, 1300, 700, 400, 400, 400, 700, 3500];

// Pinned, the scene runs: arrive (headline, meeting small) → zoom into the room → the meeting
// plays at full size → zoom back out. The script's steps are spread over the full-size part,
// each taking its share of the script.
const ZOOM_IN: [number, number] = [0.08, 0.2];
const PLAY: [number, number] = [0.23, 0.84];
const ZOOM_OUT: [number, number] = [0.9, 1];
const HOLDS = SCRIPT.slice(0, -1);
const TOTAL = HOLDS.reduce((a, b) => a + b, 0);
const BEATS = HOLDS.map((_, s) => {
  const upTo = HOLDS.slice(0, s + 1).reduce((a, b) => a + b, 0);
  return Math.round((PLAY[0] + ((PLAY[1] - PLAY[0]) * upTo) / TOTAL) * 1000) / 1000;
});
// Which side of the meeting has the viewer's eye: the call while people talk, then Selixa's captures.
const focusAt = (step: number): Focus => (step >= 1 && step <= 3 ? "call" : step >= 4 && step <= 8 ? "capture" : null);

const HEADER = (
  <SectionHeader num="03" label="The core experience" align="center" className="mx-auto" title="Your AI Product Manager is already in the room." />
);

/**
 * Large screens: the section pins, you zoom into the meeting, it plays out as you scroll, then
 * it zooms back out and the page moves on. Phones (and short screens): a normal section whose
 * demo still follows the scroll.
 */
export function Meeting() {
  return (
    // Full-bleed and pinned to the very top, so the zoomed-in meeting can take the whole screen
    // (the site header tucks away meanwhile); content is re-centred inside.
    <StickyScene
      id="demo"
      length={2.6}
      label="Your AI Product Manager is already in the room."
      top="0px"
      minStageHeight={600}
      minWidth={1024}
      sectionClassName="ml-[calc(50%-50vw)] w-screen"
    >
      <div className="mx-auto h-full w-full max-w-[1280px] px-5 sm:px-8">
        <Scene />
      </div>
    </StickyScene>
  );
}

function Scene() {
  const beat = useSceneBeat(BEATS);
  const pinned = !useSceneStill();
  // Not pinned: fall back to the scroll-following demo.
  const { ref: scrollRef, step: scrollStep, still: scrollStill } = useScrollSequence(SCRIPT);

  if (!pinned) {
    return (
      <div className="py-24 sm:py-32">
        {HEADER}
        <div className="mt-14">
          <MeetingWindow step={scrollStep} still={scrollStill} ref={scrollRef} />
        </div>
      </div>
    );
  }
  return <Room step={beat} />;
}

/**
 * The pinned room. Sizes are measured on resize (never while scrolling); each frame only
 * writes transforms and opacity: the headline lifts away as the window grows from "fits under
 * the headline" to "fills the stage", then shrinks a little on the way out.
 */
function Room({ step }: { step: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const size = useRef({ small: 1, smallY: 0, full: 1, fullY: 0 });
  const last = useRef(0);

  const place = (p: number) => {
    last.current = p;
    const h = head.current;
    const w = win.current;
    if (!h || !w) return;
    const { small, smallY, full, fullY } = size.current;
    const zin = smoothstep(seg(p, ...ZOOM_IN));
    const zout = smoothstep(seg(p, ...ZOOM_OUT));
    const scale = (small + (full - small) * zin) * (1 - 0.1 * zout);
    const y = smallY + (fullY - smallY) * zin;
    w.style.transform = `translate3d(-50%,${y.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
    h.style.opacity = String(1 - seg(p, ZOOM_IN[0], ZOOM_IN[0] + 0.07));
    // In the room, the site header steps aside; it returns as the scene zooms out or ends.
    document.documentElement.toggleAttribute("data-nav-away", p > ZOOM_IN[0] + 0.04 && p < ZOOM_OUT[0] + 0.02);
    h.style.transform = `translate3d(0,${(-40 * zin).toFixed(1)}px,0)`;
  };

  useLayoutEffect(() => {
    const st = stage.current;
    const h = head.current;
    const w = win.current;
    if (!st || !h || !w) return;
    const measure = () => {
      const H = st.clientHeight;
      const winH = w.offsetHeight;
      const winW = w.offsetWidth;
      const headBottom = h.offsetTop + h.offsetHeight;
      const small = Math.min(1, (H - headBottom - 56) / winH);
      // Full: the whole screen, edge to edge in whichever direction fills first, whole window in view.
      const full = Math.min((H - 16) / winH, (window.innerWidth - 16) / winW);
      size.current = { small, smallY: headBottom + 32, full, fullY: Math.max(8, (H - winH * full) / 2) };
      place(last.current);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(st);
    ro.observe(w);
    measure();
    return () => {
      ro.disconnect();
      document.documentElement.removeAttribute("data-nav-away");
    };
  }, []);
  useSceneProgress(place);

  return (
    <div ref={stage} className="relative h-full">
      <div ref={head} data-scrub className="relative pt-28">
        {HEADER}
      </div>
      <div ref={win} data-scrub className="absolute left-1/2 top-0 w-full origin-top">
        <MeetingWindow step={step} still={false} focus={focusAt(step)} />
      </div>
    </div>
  );
}

type Focus = "call" | "capture" | null;

function MeetingWindow({ step, still, ref, focus = null }: { step: number; still: boolean; ref?: Ref<HTMLDivElement>; focus?: Focus }) {
  const speaking = TRANSCRIPT.find((t) => t.step === Math.min(step, 3))?.who;

  return (
    <div ref={ref} className="window">
      <WindowBar>
        <span className="flex items-center gap-2 text-fg-2">
          <span className="h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_10px_rgb(var(--brand-glow-rgb)/0.8)]" aria-hidden="true" />
          Daily standup
        </span>
        <span className="ml-auto tabular-nums">08:42</span>
      </WindowBar>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* The call */}
        <div className={`border-line p-4 transition-opacity duration-700 sm:p-6 lg:border-r ${focus === "capture" ? "opacity-40" : ""}`}>
          <div className="grid grid-cols-2 gap-3">
            {PEOPLE.map((p) => {
              const talking = !still && speaking === p.name;
              return (
                <div
                  key={p.name}
                  className={`relative flex aspect-[4/3] flex-col sm:aspect-[16/9] items-center justify-center rounded-[12px] border bg-ink/[0.02] transition-[border-color,box-shadow] duration-500 ${
                    talking ? "is-live" : "border-line"
                  }`}
                >
                  <Avatar name={p.name} className="h-12 w-12 text-[0.9375rem]" />
                  <span className="absolute bottom-2.5 left-3 flex items-center gap-2 text-[0.75rem] text-fg-2">
                    {p.name}
                    {talking && (
                      <span className="eq text-brand-400" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                  </span>
                  <span className="absolute bottom-2.5 right-3 hidden text-[0.6875rem] text-fg-3 sm:inline">{p.role}</span>
                </div>
              );
            })}
            <div className="card-lit relative flex aspect-[4/3] flex-col sm:aspect-[16/9] items-center justify-center rounded-[12px] border">
              <Orb size={48} />
              <span className="absolute bottom-2.5 left-3 text-[0.75rem] text-fg">Selixa</span>
              <span className="absolute bottom-2.5 right-3 flex items-center gap-1.5 text-[0.6875rem] text-brand-300">
                <span className="live-dot" aria-hidden="true" />
                Listening
              </span>
            </div>
          </div>

          <ol className="mt-5 flex min-h-[13.5rem] flex-col gap-3.5" aria-label="Live transcript">
            {TRANSCRIPT.map((t) => (
              <Stage as="li" key={t.text} on={step >= t.step} className="flex gap-3">
                <Avatar name={t.who} />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.75rem] text-fg-3">{t.who}</p>
                  <div className="mt-0.5 text-[0.9375rem] leading-[1.5] text-fg">
                    <Typed text={t.text} on={step >= t.step} still={still} cps={62} />
                  </div>
                  {t.step === 3 && (
                    <Stage
                      as="span"
                      on={step >= 4}
                      className="tag mt-2 border-brand-400/40 bg-brand-500/15 text-brand-200"
                    >
                      <Scale className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                      Decision captured
                    </Stage>
                  )}
                </div>
              </Stage>
            ))}
          </ol>
        </div>

        {/* What Selixa took away */}
        <div className={`flex flex-col gap-4 border-t border-line p-4 transition-opacity duration-700 sm:p-6 lg:border-t-0 ${focus === "call" ? "opacity-40" : ""}`}>
          <p className="flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.14em] text-fg-3">
            Captured by Selixa
            {!still && step > 0 && step < 8 && (
              <span className="thinking ml-1" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            )}
          </p>
          <ul className="flex flex-col divide-y divide-line rounded-[14px] border border-line">
            {CAPTURED.map(({ count, label, example, icon: Icon, step: at }) => (
              <li key={label} className="relative flex items-start gap-4 px-4 py-3.5">
                {!still && step < at && (
                  <span aria-hidden="true" className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center gap-4">
                    <span className="skeleton h-6 w-6 rounded-md" />
                    <span className="flex flex-1 flex-col gap-2">
                      <span className="skeleton h-2.5 w-24 rounded-full" />
                      <span className="skeleton h-2 w-2/3 rounded-full" />
                    </span>
                  </span>
                )}
                <Stage on={step >= at} as="span" className="w-7 font-display text-[1.75rem] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
                  <Count to={count} on={step >= at} still={still} ms={500} />
                </Stage>
                <Stage on={step >= at} className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[0.875rem] text-fg">
                    <Icon className="h-3.5 w-3.5 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
                    {label}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-fg-3 lg:truncate">{example}</p>
                </Stage>
              </li>
            ))}
          </ul>

          <Stage on={step >= 8} className="card card-lit p-5">
            <p className="flex items-center gap-2 text-[0.75rem] text-brand-300">
              <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              Insight
            </p>
            <p className="mt-3 text-[1.125rem] leading-[1.45] tracking-[-0.01em] text-fg">
              &ldquo;Onboarding has come up in three customer conversations this week.&rdquo;
            </p>
            <a href="#decide" className="link-arrow mt-4">
              Explore insight
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </a>
          </Stage>

          <Stage on={step >= 9} as="p" className="mt-auto flex items-start gap-2 pt-2 text-[0.8125rem] leading-snug text-fg-3">
            <Send className="mt-px h-3.5 w-3.5 shrink-0 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
            Standup summary posted to #product · 5 tasks synced to Linear
          </Stage>
        </div>
      </div>
    </div>
  );
}
