"use client";

import { ChartLine as ChartIcon, Video } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { LOGOS } from "@/components/landing/logos";
import { ChartLine, useChartScale } from "@/components/site/ChartLine";
import { SourceChip } from "@/components/site/SourceChip";
import { StickyScene, seg, smoothstep, useSceneBeat, useSceneProgress, useSceneStill } from "@/components/site/StickyScene";
import { ACTIVATION, ANALYST_COPY } from "./copy";

/*
 * The chart that explains itself (spec §3.2). The chart stays put; a read-cursor travels the
 * line as the page scrolls (the only scrubbed thing) and each cause attaches as a callout
 * when the cursor reaches it. The server renders the p = 0 frame; [data-scene-show] /
 * [data-scene-hide] let CSS show the finished frame whenever the scene is static.
 */

const H = ANALYST_COPY.hero;
const A = ANALYST_COPY.annotations;

const BEATS = [0.08, 0.2, 0.36, 0.52, 0.68, 0.86];
const SUMMARY = 6;
/** Cursor keyframes: [p, data index]; it reaches each anchor exactly on its beat. */
const KEYS: [number, number][] = [
  [0.08, 0],
  [0.2, 6],
  [0.36, 7],
  [0.52, 8],
  [0.68, 10],
  [0.86, 12],
];
const cursorIndex = (p: number) => {
  if (p <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 1; i < KEYS.length; i++) {
    const [p1, x1] = KEYS[i];
    const [p0, x0] = KEYS[i - 1];
    if (p <= p1) return x0 + (x1 - x0) * smoothstep(seg(p, p0, p1));
  }
  return KEYS[KEYS.length - 1][1];
};

/** Anchors on the line: [index, value]. Callout 1 hangs off the release marker's top. The y domain
    tops out at 45 (spec: 42) so callout 1 always clears the line (y(38.3)) on short plots. */
const Y_TOP = 45;
const ANCHORS: [number, number][] = [
  [6, Y_TOP],
  [7, 36.4],
  [8, 35.3],
  [10, 34.9],
];
const CALLOUT_W = 200;
const CALLOUT_H = 84;
const pctX = (i: number) => Math.round((i / (ACTIVATION.length - 1)) * 10000) / 100;
/** Before measuring (server / first paint): the boxes in CSS. */
const BOXES_CSS: { left: string; top: string }[] = [
  { left: `calc(${pctX(6)}% - ${CALLOUT_W + 12}px)`, top: "2%" },
  { left: `calc(${pctX(6)}% + 8px)`, top: "4%" },
  { left: `calc(${pctX(8) - 1}% - ${CALLOUT_W}px)`, top: `calc(100% - ${CALLOUT_H + 4}px)` },
  { left: `calc(100% - ${CALLOUT_W}px)`, top: "4%" },
];
/**
 * The boxes in px from the measured plot (on resize, never during scroll). Callout 1 left of
 * the release, 2 to its right, 3 under the line, 4 top-right; none overlap each other and
 * each stays inside the plot.
 */
function layout(w: number, h: number) {
  const x = (idx: number) => (idx / (ACTIVATION.length - 1)) * w;
  const gap = 8;
  const c1 = { left: x(6) - CALLOUT_W - 12, top: Math.min(0.02 * h, h - CALLOUT_H) };
  const c2 = { left: Math.max(c1.left + CALLOUT_W + gap, x(7) - 100), top: 0.04 * h };
  const c3 = { left: x(8) - 0.01 * w - CALLOUT_W, top: Math.min(0.7 * h, h - CALLOUT_H - 4) };
  const c4 = { left: Math.min(Math.max(x(10) + 0.01 * w, c2.left + CALLOUT_W + gap), w - CALLOUT_W), top: 0.04 * h };
  // Narrow plots: if 4 would still touch 2, it goes under it.
  if (c4.left < c2.left + CALLOUT_W + gap) c4.top = c2.top + CALLOUT_H + gap;
  return [c1, c2, c3, c4];
}

const logo = (name: string | null) => (name ? LOGOS.find((l) => l.name === name) : undefined);
const show = (on: boolean) => (on ? "opacity-100" : "opacity-0");
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ---------- Overlays (inside ChartLine) ---------- */

/** The read-cursor: a hairline and a dot riding the line. Transforms only. */
function Cursor({ visible }: { visible: boolean }) {
  const scale = useChartScale();
  const line = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const last = useRef(0);
  const place = (p: number) => {
    last.current = p;
    const { w, x, y } = scale.px;
    if (!w || !line.current || !dot.current) return;
    const i = cursorIndex(p);
    const cx = r2(x(i));
    line.current.style.transform = `translate3d(${cx}px,0,0)`;
    dot.current.style.transform = `translate3d(${cx}px,${r2(y(scale.at(i)))}px,0)`;
  };
  useSceneProgress(place);
  // Re-place when the plot is resized (sizes come from ChartLine's ResizeObserver).
  const w = scale.px.w;
  const h = scale.px.h;
  useEffect(() => {
    if (!line.current || !dot.current || !w) return;
    const i = cursorIndex(last.current);
    const cx = r2((i / (scale.n - 1)) * w);
    line.current.style.transform = `translate3d(${cx}px,0,0)`;
    dot.current.style.transform = `translate3d(${cx}px,${r2((scale.y(scale.at(i)) / 100) * h)}px,0)`;
  }, [w, h, scale]);

  return (
    <span aria-hidden="true" data-scene-hide className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${show(visible)}`}>
      <span ref={line} data-scrub className="absolute inset-y-0 left-0 w-px bg-ink/30" />
      <span ref={dot} data-scrub className="absolute left-0 top-0 -ml-[3.5px] -mt-[3.5px] h-[7px] w-[7px] rounded-full bg-fg" />
    </span>
  );
}

/** The −8% badge under the dip, with the rates on hover (desktop). Pops in on load. */
function DipBadge({ small }: { small?: boolean }) {
  const { x, y, at } = useChartScale();
  return (
    <span
      className="group absolute -translate-x-1/2"
      style={{ left: `${r2(x(9.5))}%`, top: `calc(${r2(y(at(9.5)))}% + ${small ? 10 : 14}px)` }}
    >
      <span className="pop-in block" style={{ "--d": "1650ms" } as CSSProperties}>
        <span tabIndex={small ? undefined : 0} className="tag border-brand-400/30 bg-brand-500/10 px-2 py-0.5 text-brand-200 outline-none">
          {H.dipLabel}
        </span>
      </span>
      {!small && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[8px] border border-line bg-panel-2 px-2.5 py-1.5 text-[0.75rem] tabular-nums text-fg-2 opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
        >
          {H.dipTooltip}
        </span>
      )}
    </span>
  );
}

/** Desktop callouts: anchor ring, leader, card. */
function Callouts({ b }: { b: number }) {
  const { x, y, px } = useChartScale();
  return (
    <>
      {A.items.map((item, i) => {
        const on = b >= i + 2;
        const dim = on && b > i + 2 && b < SUMMARY;
        const [ai, av] = ANCHORS[i];
        // Leader: from the anchor to the nearest point on the callout box.
        let leader: CSSProperties | null = null;
        if (px.w) {
          const ax = px.x(ai);
          const ay = px.y(av);
          const box = layout(px.w, px.h)[i];
          const nx = Math.min(Math.max(ax, box.left), box.left + CALLOUT_W);
          const ny = Math.min(Math.max(ay, box.top), box.top + CALLOUT_H);
          const len = Math.hypot(nx - ax, ny - ay);
          leader = { left: r2(ax), top: r2(ay), width: r2(len), rotate: `${r2((Math.atan2(ny - ay, nx - ax) * 180) / Math.PI)}deg` };
        }
        const Icon = item.logo ? undefined : Video;
        return (
          <div key={item.title} aria-hidden="true" className={`transition-opacity duration-200 ${dim ? "opacity-[0.72]" : "opacity-100"}`} data-scene-show>
            {leader && (
              <span className="absolute origin-left" style={leader} aria-hidden="true">
                <span
                  data-scene-show
                  className={`block h-px origin-left bg-brand-400/60 transition-[opacity,transform] duration-200 ${on ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
                  style={{ transitionDelay: on ? "80ms" : "0ms" }}
                />
              </span>
            )}
            <span
              aria-hidden="true"
              data-scene-show
              className={`absolute -ml-1 -mt-1 h-2 w-2 rounded-full border-2 border-brand-400 bg-bg transition-[opacity,transform] duration-200 ${on ? "scale-100 opacity-100" : "scale-[0.4] opacity-0"}`}
              style={{ left: `${r2(x(ai))}%`, top: `${r2(y(av))}%` }}
            />
            <div
              data-scene-show
              className={`card absolute flex flex-col gap-1 rounded-[12px]! bg-panel p-2.5 transition-[opacity,transform] duration-[280ms] ${
                on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
              }`}
              style={{
                ...(px.w ? { left: r2(layout(px.w, px.h)[i].left), top: r2(layout(px.w, px.h)[i].top) } : BOXES_CSS[i]),
                width: CALLOUT_W,
                transitionDelay: on ? "140ms" : "0ms",
              }}
            >
              <p className="flex items-baseline gap-2">
                <span className="text-[0.6875rem] tabular-nums text-brand-300">{i + 1}</span>
                <span className="text-[0.875rem] text-fg">{item.title}</span>
              </p>
              <p className="text-[0.78125rem] text-fg-3">{item.detail}</p>
              <SourceChip logo={logo(item.logo)} icon={Icon} label={item.source} size="sm" className="w-fit" />
            </div>
          </div>
        );
      })}
    </>
  );
}

/** Phone: numbered pins on the anchors (the callouts become a list under the chart). */
function Pins({ b }: { b: number }) {
  const { x, y } = useChartScale();
  return (
    <>
      {ANCHORS.map(([ai, av], i) => (
        <span
          key={i}
          aria-hidden="true"
          data-scene-show
          className={`absolute -ml-2 -mt-2 grid h-4 w-4 place-items-center rounded-full border border-brand-400 bg-bg text-[0.625rem] tabular-nums text-brand-300 transition-[opacity,transform] duration-200 ${
            b >= i + 2 ? "scale-100 opacity-100" : "scale-[0.4] opacity-0"
          }`}
          style={{ left: `${r2(x(ai))}%`, top: `${r2(y(av))}%` }}
        >
          {i + 1}
        </span>
      ))}
    </>
  );
}

/* ---------- The stage ---------- */

const X_TICKS = H.xAxis.map((label, k) => ({ index: k * 2, label }));
const X_TICKS_PHONE = [X_TICKS[0], X_TICKS[3], X_TICKS[6]];
// The "Aug 12" label sits at the marker's top (callout 3 lives near its foot).
const MARKER = [{ index: 6, label: H.markedPoint, labelAt: "top" as const, className: "appear", style: { "--d": "1100ms" } as CSSProperties }];

function Summary({ on, className = "" }: { on: boolean; className?: string }) {
  return (
    <span
      data-scene-show
      className={`tag border-brand-400/30 bg-brand-500/10 text-[0.875rem] text-brand-200 transition-[opacity,transform] duration-300 ${
        on ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
      } ${className}`}
    >
      <ChartIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      {A.summary}
    </span>
  );
}

function ChartStage() {
  const beat = useSceneBeat(BEATS);
  const still = useSceneStill();
  // The server renders p = 0; CSS shows the finished frame when the scene is static.
  const b = still ? 0 : beat;

  return (
    <div className="flex h-full flex-col pt-6">
      {/* Chart head */}
      <div className="flex h-8 items-center gap-3">
        <span className="text-[0.8125rem] text-fg md:text-[0.875rem]">{H.chartTitle}</span>
        <span className="tag">{H.rangeChip}</span>
        <span className="ml-auto hidden items-center gap-2 text-[0.75rem] text-fg-3 md:flex">
          <span className="h-px w-4 bg-fg-2" aria-hidden="true" />
          {H.legend}
        </span>
      </div>

      {/* Desktop plot with floating callouts */}
      <div className="mt-2 hidden md:block">
        <ChartLine
          data={ACTIVATION}
          yDomain={[29, Y_TOP]}
          yTicks={[...H.yAxis]}
          xTicks={X_TICKS}
          height="min(44svh, 460px)"
          highlightFrom={6}
          area="highlight"
          markers={MARKER}
          reveal="wipe"
          revealDelay={350}
          ariaLabel={H.ariaLabel}
          className="appear"
        >
          <Callouts b={b} />
          <DipBadge />
          <Cursor visible={b >= 1 && b < SUMMARY} />
        </ChartLine>
      </div>

      {/* Phone plot with numbered pins */}
      <div className="mt-2 md:hidden">
        <ChartLine
          data={ACTIVATION}
          yDomain={[29, Y_TOP]}
          yTicks={H.yAxis.map((t) => ({ value: t.value, label: String(t.value) }))}
          xTicks={X_TICKS_PHONE}
          height={220}
          highlightFrom={6}
          area="highlight"
          markers={[{ ...MARKER[0], label: undefined }]}
          reveal="wipe"
          revealDelay={350}
          insets={{ left: 32, bottom: 24, right: 10 }}
          labelSize={11}
          ariaLabel={H.ariaLabel}
        >
          <Pins b={b} />
          <DipBadge small />
          <Cursor visible={b >= 1 && b < SUMMARY} />
        </ChartLine>
      </div>

      {/* The causes as real text, in order: on desktop for assistive tech (the floating
          callouts are the picture); on phones the visible list below is the same list. */}
      <ol className="sr-only hidden md:block">
        {A.items.map((item) => (
          <li key={item.title}>
            {item.title}: {item.detail} ({item.source})
          </li>
        ))}
      </ol>
      <ol className="mt-4 md:hidden" aria-label={A.headline}>
        {A.items.map((item, i) => (
          <li
            key={item.title}
            data-scene-show
            className={`flex h-14 items-center gap-3 border-t border-line transition-[opacity,transform] duration-[280ms] ${
              b >= i + 2 ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
            }`}
          >
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-brand-400 text-[0.625rem] tabular-nums text-brand-300" aria-hidden="true">
              {i + 1}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[0.875rem] text-fg">{item.title}</span>
              <span className="truncate text-[0.75rem] text-fg-3">{item.detail}</span>
            </span>
            <SourceChip logo={logo(item.logo)} icon={item.logo ? undefined : Video} label={item.source} size="sm" compactLabel />
          </li>
        ))}
      </ol>
      <Summary on={b >= SUMMARY} className="mt-3 w-full justify-center md:hidden" />

      {/* Foot row (desktop): the summary once all four causes are attached. (Owner decision:
          no section header in the pinned stage; phones show it above the scene.) */}
      <div className="mt-8 hidden justify-end border-t border-line pt-6 md:flex">
        <Summary on={b >= SUMMARY} />
      </div>
    </div>
  );
}

export function ActivationChart() {
  return (
    <StickyScene id="chart" length={2.6} label={A.headline}>
      <ChartStage />
    </StickyScene>
  );
}
