"use client";

import { Check, Send, StickyNote, TrendingDown, User, Video } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Stage, Typed } from "@/components/landing/demo";
import { BrandMark } from "@/components/landing/BrandMark";
import type { BrandLogo } from "@/components/landing/logos";
import { Orb, WindowBar } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import type { CallScript, ChartScript, DemoScript, DocScript, IssueScript, ThreadScript } from "@/lib/content/integrations";
import { ChartLine, useChartScale } from "../ChartLine";
import { Initials } from "../Initials";

/*
 * Five small demos in a tool's native shape: a thread, a doc, an issue, a call, a chart.
 * Each lives in a DemoWindow with a fixed body height (nothing reflows between steps), plays
 * while in view, loops and holds its final frame 3s; reduced motion / before JS show that
 * final frame. The picture is aria-hidden; an sr-only transcript says what it shows.
 */

export type DemoLabels = { selixa: string; issueFrom: string };

const show = (on: boolean) => (on ? "opacity-100" : "opacity-0");

/** The window a demo plays in: the tool's mark (lit: identification, not tint) and where we are. */
export function DemoWindow({
  logo,
  place,
  heights,
  transcript,
  innerRef,
  children,
}: {
  logo?: BrandLogo;
  place: string;
  /** Body height in px: phones, and md+. */
  heights: { base: number; md: number };
  transcript: ReactNode;
  innerRef?: React.Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div ref={innerRef} className="window w-full text-left">
      <WindowBar>
        {logo && <BrandMark logo={logo} lit className="h-3.5 w-3.5 shrink-0" />}
        <span className="truncate text-[0.8125rem] text-fg-3">{place}</span>
      </WindowBar>
      <div className="sr-only">{transcript}</div>
      <div aria-hidden="true" className="relative h-[var(--h)] overflow-hidden md:h-[var(--h-md)]" style={{ "--h": `${heights.base}px`, "--h-md": `${heights.md}px` } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}

/* ---------- thread (Slack, Intercom) ---------- */

export function ThreadDemo({ script, logo, labels }: { script: ThreadScript; logo?: BrandLogo; labels: DemoLabels }) {
  const typeMs = Math.round((script.reply.length / 70) * 1000 + 250);
  const { ref, step, still } = useSequence([250, 380, script.messages.length > 1 ? 380 : 0, 650, typeMs, 250, 3000]);
  const f = still ? 6 : step;
  const note = !!script.replyTag;

  return (
    <DemoWindow
      innerRef={ref}
      logo={logo}
      place={script.place}
      heights={{ base: 360, md: 300 }}
      transcript={
        <>
          {script.messages.map((m) => (
            <p key={m.text}>
              {m.from}: {m.text}
            </p>
          ))}
          <p>
            {labels.selixa}
            {script.replyTag ? ` (${script.replyTag})` : ""}: {script.reply}
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4 px-5 py-4">
        {script.messages.map((m, i) => (
          <Stage key={m.text} on={f >= i + 1} className="flex gap-3">
            {m.from === "Customer" ? (
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong bg-panel-2 text-fg-3">
                <User className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
            ) : (
              <Initials name={m.from} size={32} />
            )}
            <span className="flex min-w-0 flex-col">
              <span className="text-[0.84375rem] font-medium text-fg">{m.from}</span>
              <span className="text-[0.90625rem] leading-[1.5] text-fg-2">{m.text}</span>
            </span>
          </Stage>
        ))}
        <Stage
          on={f >= 3}
          className={`relative flex gap-3 ${note ? "rounded-[12px] border border-line bg-ink/[0.035] p-3" : "ml-3 border-l border-ink/[0.1] pl-3"}`}
        >
          {note && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand-400/50" />}
          <Orb size={32} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-2 text-[0.84375rem] font-medium text-fg">
              {labels.selixa}
              {script.replyTag && (
                <span className="tag gap-1 px-1.5 py-0 text-[0.6875rem] font-normal">
                  <StickyNote className="h-3 w-3" strokeWidth={1.75} />
                  {script.replyTag}
                </span>
              )}
              <Check className={`h-3 w-3 text-brand-300 transition-opacity duration-200 ${show(f >= 5)}`} strokeWidth={2.5} />
            </span>
            <span className="relative text-[0.90625rem] leading-[1.5] text-fg-2">
              <span className={`thinking absolute left-0 top-2 transition-opacity duration-200 ${show(f === 3)}`}>
                <i />
                <i />
                <i />
              </span>
              <Typed text={script.reply} on={f >= 4} still={still} cps={70} />
            </span>
          </span>
        </Stage>
      </div>
    </DemoWindow>
  );
}

/* ---------- doc (Notion, Google Drive) ---------- */

export function DocDemo({ script, logo }: { script: DocScript; logo?: BrandLogo; labels: DemoLabels }) {
  const n = script.section.lines.length;
  const headMs = Math.round((script.section.heading.length / 45) * 1000 + 150);
  const { ref, step, still } = useSequence([250, 400, headMs, ...script.section.lines.map(() => 320), 300, 3000]);
  const last = 3 + n + 1;
  const f = still ? last : step;
  const writing = !still && f >= 1 && f < 3 + n;

  return (
    <DemoWindow
      innerRef={ref}
      logo={logo}
      place={script.title}
      heights={{ base: 380, md: 320 }}
      transcript={
        <>
          <p>{script.title}</p>
          {script.existing.map((l) => (
            <p key={l}>{l}</p>
          ))}
          <p>{script.section.heading}</p>
          <ul>
            {script.section.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p>{script.byline}</p>
        </>
      }
    >
      <div className="h-full bg-panel px-5 pt-5 md:px-8 md:pt-7">
        <p className="text-[1.375rem] font-medium tracking-[-0.02em] text-fg">{script.title}</p>
        {script.existing.map((l) => (
          <p key={l} className="mt-3 text-[0.9375rem] text-fg-2">
            {l}
            {writing && f === 1 && <span className="caret" />}
          </p>
        ))}
        <div className="mt-3 h-2 w-[92%] rounded-full bg-ink/[0.06]" />
        <div className="mt-2 h-2 w-[64%] rounded-full bg-ink/[0.06]" />
        <div className="relative mt-6">
          <span className={`absolute -left-3 inset-y-0 w-0.5 origin-top bg-brand-400/70 transition-transform duration-[420ms] ${f >= 1 ? "scale-y-100" : "scale-y-0"}`} />
          <p className="text-[1rem] font-medium text-fg">
            <Typed text={script.section.heading} on={f >= 2} still={still} cps={45} />
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {script.section.lines.map((l, i) => (
              <Stage key={l} as="li" on={f >= 3 + i} className="flex items-center gap-2.5 text-[0.90625rem] text-fg-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
                {l}
              </Stage>
            ))}
          </ul>
          <Stage on={f >= 3 + n} className="mt-3 flex items-center gap-2 text-[0.75rem] text-fg-3">
            <Orb size={16} />
            {script.byline}
          </Stage>
        </div>
      </div>
    </DemoWindow>
  );
}

/* ---------- issue (Linear, Jira, GitHub) ---------- */

export function IssueDemo({ script, logo, labels, place }: { script: IssueScript; logo?: BrandLogo; labels: DemoLabels; place: string }) {
  const titleMs = Math.round((script.title.length / 60) * 1000 + 150);
  const { ref, step, still } = useSequence([250, 380, 300, 280, titleMs, 200, 200, 200, 350, 3000]);
  const f = still ? 9 : step;

  return (
    <DemoWindow
      innerRef={ref}
      logo={logo}
      place={place}
      heights={{ base: 400, md: 340 }}
      transcript={
        <>
          <p>
            {labels.issueFrom}: {script.decision}
          </p>
          <p>
            {script.key} {script.title}
          </p>
          <ul>
            {script.fields.map((fl) => (
              <li key={fl.label}>
                {fl.label}: {fl.value}
              </li>
            ))}
          </ul>
          <p>{script.footer}</p>
        </>
      }
    >
      <div className="px-6 py-5">
        <Stage on={f >= 1}>
          <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-fg-3">{labels.issueFrom}</p>
          <p className="mt-2 flex items-center gap-2 rounded-[12px] border border-line bg-ink/[0.025] px-4 py-3 text-[0.875rem] text-fg">
            <Video className="h-3.5 w-3.5 shrink-0 text-fg-3" strokeWidth={1.75} />
            <span className="line-clamp-2 md:truncate">{script.decision}</span>
          </p>
        </Stage>
        <span className={`ml-7 block h-5 w-px origin-top bg-brand-400/60 transition-transform duration-300 ${f >= 2 ? "scale-y-100" : "scale-y-0"}`} />
        <Stage on={f >= 3} className={`relative rounded-[14px] border border-line-strong bg-panel p-4 ${f >= 3 && f < 8 && !still ? "is-live" : ""}`}>
          <p className="flex items-center gap-2 text-[0.75rem] tabular-nums text-fg-3">
            <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-fg-3" />
            {script.key}
          </p>
          <p className="mt-1.5 text-[1rem] font-medium text-fg">
            <Typed text={script.title} on={f >= 4} still={still} cps={60} />
          </p>
          <div className="mt-3 grid grid-cols-[88px_1fr] gap-y-2">
            {script.fields.map((fl, i) => (
              <Stage key={fl.label} on={f >= 5 + i} className="col-span-2 grid grid-cols-subgrid items-center">
                <span className="text-[0.75rem] text-fg-3">{fl.label}</span>
                <span className="flex items-center gap-2 text-[0.84375rem] text-fg-2">
                  {fl.label === "Assignee" && <Initials name={fl.value} size={20} />}
                  {fl.value}
                </span>
              </Stage>
            ))}
          </div>
          <Stage on={f >= 8} className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[0.8125rem] text-fg-2">
            <Check className="h-3.5 w-3.5 text-brand-300" strokeWidth={2.25} />
            {script.footer}
          </Stage>
        </Stage>
      </div>
    </DemoWindow>
  );
}

/* ---------- call (Zoom, Google Meet) ---------- */

export function CallDemo({ script, logo, labels }: { script: CallScript; logo?: BrandLogo; labels: DemoLabels }) {
  const { ref, step, still } = useSequence([250, 600, 500, 550, 550, 550, 700, 350, 3000]);
  const f = still ? 8 : step;
  const joined = f >= 1;
  const status = f >= 6 ? 2 : f >= 2 ? 1 : 0;
  // Speaker: Maya at reset, then Dev, Sara, Maya; nobody once the recap is being written.
  const speaker = still || f >= 6 ? -1 : f >= 5 ? 0 : f >= 4 ? 2 : f >= 3 ? 1 : 0;

  return (
    <DemoWindow
      innerRef={ref}
      logo={logo}
      place={script.title}
      heights={{ base: 440, md: 380 }}
      transcript={
        <>
          <p>
            {script.participants.join(", ")} and {labels.selixa}.
          </p>
          <p>{script.captured.join(", ")}.</p>
          <p>{script.footer}</p>
        </>
      }
    >
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {script.participants.map((p, i) => (
            <div key={p} className={`relative grid aspect-[4/3] md:aspect-auto md:h-[128px] place-items-center rounded-[12px] border bg-well ${speaker === i ? "border-ink/25" : "border-line"}`}>
              <span className="md:hidden">
                <Initials name={p} size={32} />
              </span>
              <span className="hidden md:block">
                <Initials name={p} size={40} />
              </span>
              <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-2 py-0.5 text-[0.75rem] text-fg-2">
                {p}
                <span className={`eq text-brand-400 transition-opacity duration-200 ${show(speaker === i)}`}>
                  <i />
                  <i />
                  <i />
                </span>
              </span>
            </div>
          ))}
          <div className={`relative grid aspect-[4/3] md:aspect-auto md:h-[128px] place-items-center rounded-[12px] border bg-well ${joined ? "border-line" : "border-dashed border-line-strong"}`}>
            <span className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${show(joined)}`}>
              <span className="md:hidden">
                <Orb size={36} />
              </span>
              <span className="hidden md:block">
                <Orb size={44} />
              </span>
              <span className="grid text-[0.6875rem] text-fg-3 [&>*]:col-start-1 [&>*]:row-start-1">
                {script.statuses.map((s, i) => (
                  <span key={s} className={`flex items-center justify-center gap-1.5 transition-opacity duration-200 ${show(i === status)}`}>
                    {i === 1 && <span className="live-dot" />}
                    {s}
                  </span>
                ))}
              </span>
            </span>
            {/* Phones: no name pill on Selixa's tile (it would sit on the status line) */}
            <span className={`absolute bottom-2 left-2 rounded-full bg-ink/[0.06] px-2 py-0.5 text-[0.75rem] text-fg-2 transition-opacity duration-300 max-md:hidden ${show(joined)}`}>
              {labels.selixa}
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {script.captured.map((c, i) => (
            <Stage key={c} as="span" on={f >= 3 + i} className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">
              <Check className="h-3 w-3" strokeWidth={2.25} />
              {c}
            </Stage>
          ))}
        </div>
        <Stage on={f >= 7} className="mt-2 flex items-center gap-2 text-[0.8125rem] text-fg-2">
          <Send className="h-3.5 w-3.5 text-fg-3" strokeWidth={1.75} />
          {script.footer}
        </Stage>
      </div>
    </DemoWindow>
  );
}

/* ---------- chart (PostHog, Mixpanel) ---------- */

// Illustrative: gently rising, then ~8% down from index 15, flat after (same on both tools).
const SERIES = [40, 40.4, 40.2, 40.8, 41, 40.9, 41.3, 41.6, 41.4, 41.9, 42.1, 42, 42.4, 42.6, 42.5, 42.6, 40.2, 39.3, 39.1, 39.2, 39, 39.2, 39.1, 39.2];
const MARK = 15;
const DIP = SERIES.indexOf(Math.min(...SERIES.slice(MARK)));

function DipRing({ on }: { on: boolean }) {
  const { x, y } = useChartScale();
  return (
    <span
      className={`absolute -ml-[7px] -mt-[7px] h-3.5 w-3.5 rounded-full border border-brand-400/60 transition-[opacity,transform] duration-300 ${on ? "scale-100 opacity-100" : "scale-[0.6] opacity-0"}`}
      style={{ left: `${x(DIP)}%`, top: `${y(SERIES[DIP])}%` }}
    />
  );
}

export function ChartDemo({ script, logo, labels, place }: { script: ChartScript; logo?: BrandLogo; labels: DemoLabels; place: string }) {
  const { ref, step, still } = useSequence([200, 950, 300, 350, 400, 400, ...script.sources.map(() => 200), 3000]);
  const last = 6 + script.sources.length;
  const f = still ? last : step;

  const card = (
    <Stage on={f >= 5} className="card w-full bg-panel p-3.5 md:w-[250px]">
      <p className="flex items-center gap-2 text-[0.75rem] font-medium text-fg">
        <Orb size={16} />
        {labels.selixa}
      </p>
      <p className="mt-1.5 text-[0.84375rem] leading-[1.45] text-fg-2">{script.annotation}</p>
      <p className="mt-2 flex flex-wrap gap-1.5">
        {script.sources.map((s, i) => (
          <Stage key={s} as="span" on={f >= 6 + i} className="tag px-2 py-0.5 text-[0.6875rem]">
            {s}
          </Stage>
        ))}
      </p>
    </Stage>
  );

  return (
    <DemoWindow
      innerRef={ref}
      logo={logo}
      place={place}
      heights={{ base: 460, md: 356 }}
      transcript={
        <>
          <p>
            {script.metric} {script.change}, {script.marker}.
          </p>
          <p>
            {labels.selixa}: {script.annotation} ({script.sources.join(", ")})
          </p>
        </>
      }
    >
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-[0.8125rem] text-fg-3">{script.metric}</span>
          <Stage as="span" on={f >= 2} className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">
            <TrendingDown className="h-3 w-3" strokeWidth={2} />
            {script.change}
          </Stage>
        </div>
        <div className="relative mt-4">
          <ChartLine
            data={SERIES}
            yDomain={[36, 44]}
            yTicks={[38, 40, 42].map((v) => ({ value: v, label: "" }))}
            height="min(180px, 40vw)"
            highlightFrom={MARK}
            markers={[{ index: MARK, label: script.marker, labelAt: "top", className: `transition-opacity duration-300 ${show(f >= 3)}` }]}
            reveal="wipe"
            revealMs={900}
            on={f >= 1}
            still={still}
            insets={{ top: 8, right: 6, bottom: 8, left: 0 }}
            ariaLabel={`${script.metric} ${script.change}`}
          >
            <DipRing on={f >= 4} />
            {/* Annotation: right of the dip, under the line (clamped inside the chart) */}
            <div
              className="absolute hidden md:block"
              style={{
                left: `min(calc(${Math.round((DIP / (SERIES.length - 1)) * 1000) / 10}% - 125px), calc(100% - 250px))`,
                top: `calc(${Math.round(((44 - SERIES[DIP]) / 8) * 1000) / 10}% + 18px)`,
              }}
            >
              {card}
            </div>
          </ChartLine>
        </div>
        <div className="mt-4 md:hidden">{card}</div>
      </div>
    </DemoWindow>
  );
}

/** Picks the demo for a tool. */
export function IntegrationDemo({ script, logo, place, labels }: { script: DemoScript; logo?: BrandLogo; place: string; labels: DemoLabels }) {
  switch (script.kind) {
    case "thread":
      return <ThreadDemo script={script} logo={logo} labels={labels} />;
    case "doc":
      return <DocDemo script={script} logo={logo} labels={labels} />;
    case "issue":
      return <IssueDemo script={script} logo={logo} labels={labels} place={place} />;
    case "call":
      return <CallDemo script={script} logo={logo} labels={labels} />;
    case "chart":
      return <ChartDemo script={script} logo={logo} labels={labels} place={place} />;
  }
}
