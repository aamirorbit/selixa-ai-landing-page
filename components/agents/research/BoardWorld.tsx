import type { CSSProperties, Ref } from "react";
import { PinCard } from "@/components/site/PinCard";
import { Sparkline } from "@/components/site/Sparkline";
import { CARDS, RESEARCH_COPY, type BoardCard, type Placed, type World } from "./copy";

/*
 * The evidence board's world: a dot-grid surface, string threads, cluster labels and
 * pinned/taped cards, at native size (the camera scales it; never above 1). Purely
 * presentational: lit states come in as props and change only opacity.
 */

const C = RESEARCH_COPY;
const card = (id: string) => CARDS.find((c) => c.id === id)!;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** The dip the Analyst Agent found, for the analyst note. */
const ACTIVATION = [38.1, 37.9, 38.3, 38.0, 38.2, 38.0, 36.4, 35.3, 35.1, 34.9, 35.0, 35.0];

/** Abstract competitor screens: grey UI blocks, a different arrangement each. */
function Shot({ kind }: { kind: NonNullable<BoardCard["shot"]> }) {
  const b = "rounded-[2px] bg-ink/[0.1]";
  return (
    <div className="relative aspect-video overflow-hidden rounded-[4px] border border-line bg-well">
      <div className="absolute inset-x-0 top-0 h-[12%] bg-ink/[0.08]" />
      {kind === "stepper" && (
        <>
          <div className="absolute left-[12%] right-[12%] top-[28%] flex items-center justify-between">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-3 w-3 rounded-full ${i === 0 ? "bg-ink/[0.22]" : "bg-ink/[0.1]"}`} />
            ))}
          </div>
          <div className="absolute left-[16%] right-[16%] top-[30.5%] -z-0 h-px bg-ink/[0.1]" />
          <div className={`absolute left-[22%] top-[50%] h-[7%] w-[56%] ${b}`} />
          <div className={`absolute left-[22%] top-[62%] h-[7%] w-[40%] ${b}`} />
          <div className="absolute left-[38%] top-[78%] h-[10%] w-[24%] rounded-full bg-ink/[0.16]" />
        </>
      )}
      {kind === "table" && (
        <>
          <div className="absolute bottom-0 left-0 top-[12%] w-[18%] bg-ink/[0.05]" />
          {[26, 40, 54, 68, 82].map((t) => (
            <div key={t} className="absolute left-[24%] right-[6%] flex gap-[6%]" style={{ top: `${t}%` }}>
              <span className={`h-[6px] w-[30%] ${b}`} />
              <span className={`h-[6px] w-[20%] ${b}`} />
              <span className={`h-[6px] w-[24%] ${b}`} />
            </div>
          ))}
        </>
      )}
      {kind === "single" && (
        <>
          <div className="absolute left-1/2 top-[30%] h-[36%] w-[46%] -translate-x-1/2 rounded-[4px] border border-line bg-ink/[0.06]" />
          <div className={`absolute left-1/2 top-[74%] h-[6%] w-[30%] -translate-x-1/2 ${b}`} />
          <div className="absolute left-1/2 top-[84%] h-[8%] w-[18%] -translate-x-1/2 rounded-full bg-ink/[0.16]" />
        </>
      )}
    </div>
  );
}

/** A card's body, by kind. */
export function CardBody({ c }: { c: BoardCard }) {
  if (c.kind === "quote") return <p>“{c.text}”</p>;
  if (c.kind === "ticket")
    return (
      <p className="flex items-start gap-2">
        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" aria-hidden="true" />
        {c.text}
      </p>
    );
  if (c.kind === "count")
    return (
      <p className="flex items-end gap-3">
        <span className="font-display text-[2.25rem] font-light leading-none tabular-nums text-fg">7</span>
        <span className="pb-1 text-fg-2">“{c.text}”</span>
      </p>
    );
  if (c.kind === "screenshot")
    return (
      <>
        <Shot kind={c.shot!} />
        <p className="mt-3 text-[0.75rem] leading-[1.45] text-fg-3">{c.text}</p>
      </>
    );
  return (
    <>
      <p>{c.text}</p>
      {c.spark && <Sparkline data={ACTIVATION} highlightFrom={5} width={96} height={24} className="mt-3" />}
    </>
  );
}

const pinOf = (p: Placed): [number, number] => [p.x, p.top];
const sag = (a: [number, number], b: [number, number], down: number) => {
  const cx = (a[0] + b[0]) / 2;
  const cy = (a[1] + b[1]) / 2 + down;
  return {
    d: `M${r1(a[0])} ${r1(a[1])} Q${r1(cx)} ${r1(cy)} ${r1(b[0])} ${r1(b[1])}`,
    mid: [r1(0.25 * a[0] + 0.5 * cx + 0.25 * b[0]), r1(0.25 * a[1] + 0.5 * cy + 0.25 * b[1])] as [number, number],
  };
};

type BoardWorldProps = {
  world: World;
  /** Per cluster: 0 (unlit), 0.6 (visited) or 1 (lit). */
  lit: [number, number, number];
  /** The knot → brief threads light (staggered). */
  converge: boolean;
  /** Show the in-world brief placeholder (the live scene; hidden in the static figure). */
  placeholder?: boolean;
  className?: string;
  style?: CSSProperties;
  /** The world element, for the camera's transform writes. */
  ref?: Ref<HTMLDivElement>;
};

export function BoardWorld({ world, lit, converge, placeholder = true, className = "", style, ref }: BoardWorldProps) {
  const briefTop: [number, number] = [world.brief.x, world.brief.y - world.brief.h / 2];
  const placed = world.cards.map((p) => ({ p, c: card(p.id) }));
  const cardThreads = placed.map(({ p, c }) => ({ key: p.id, cluster: c.cluster, ...sag(pinOf(p), world.knots[c.cluster], 40) }));
  const briefThreads = world.knots.map((k, i) => ({ key: `brief-${i}`, cluster: i, ...sag(k, briefTop, 80) }));
  const extra = world.extra.map(([from, to, label, dashed]) => {
    const a = world.cards.find((p) => p.id === from)!;
    const b = world.cards.find((p) => p.id === to)!;
    return { key: `${from}-${to}`, label, dashed, ...sag(pinOf(a), pinOf(b), 40) };
  });
  const litStyle = (k: number, delay = 0) => ({ opacity: lit[k], transitionDelay: `${delay}ms` });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`board-surface absolute left-0 top-0 origin-top-left [contain:layout_paint] ${className}`}
      style={{ width: world.w, height: world.h, ...style }}
    >
      {/* Threads, under everything */}
      <svg viewBox={`0 0 ${world.w} ${world.h}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        {[...cardThreads, ...briefThreads].map((t) => (
          <path key={t.key} d={t.d} stroke="rgb(var(--ink-rgb) / 0.18)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
        {extra.map((t) => (
          <path
            key={t.key}
            d={t.d}
            stroke="rgb(var(--ink-rgb) / 0.22)"
            strokeWidth={1}
            strokeDasharray={t.dashed ? "4 2" : undefined}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {cardThreads.map((t) => (
          <path
            key={`lit-${t.key}`}
            d={t.d}
            stroke="rgb(var(--brand-400-rgb) / 0.75)"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            className="transition-opacity duration-[400ms]"
            style={litStyle(t.cluster)}
          />
        ))}
        {briefThreads.map((t, i) => (
          <path
            key={`lit-${t.key}`}
            d={t.d}
            stroke="rgb(var(--brand-400-rgb) / 0.75)"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            className="transition-opacity duration-[400ms]"
            style={{ opacity: converge ? 1 : 0, transitionDelay: converge ? `${i * 80}ms` : "0ms" }}
          />
        ))}
      </svg>

      {/* Thread labels */}
      {extra.map((t) => (
        <span
          key={`l-${t.key}`}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg px-2 py-0.5 text-[0.6875rem] ${
            t.label === "contradicts" ? `text-brand-300 transition-opacity duration-300 ${lit[2] === 1 ? "opacity-100" : "opacity-70"}` : "text-fg-3"
          }`}
          style={{ left: t.mid[0], top: t.mid[1] }}
        >
          {C.threads[t.label]}
        </span>
      ))}
      {world.supports.map((k) => (
        <span
          key={`s-${k}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg px-2 py-0.5 text-[0.6875rem] text-fg-3"
          style={{ left: briefThreads[k].mid[0], top: briefThreads[k].mid[1] }}
        >
          {C.threads.supports}
        </span>
      ))}

      {/* Knots */}
      {world.knots.map(([x, y], k) => (
        <span key={k} className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-strong bg-panel" style={{ left: x, top: y }}>
          <span className="absolute -inset-px rounded-full bg-brand-500 transition-opacity duration-[400ms]" style={litStyle(k)} />
        </span>
      ))}

      {/* Cluster labels and chips */}
      {world.labels.map((l) => {
        const stop = C.stops[l.cluster];
        return (
          <div key={l.cluster}>
            <p className="absolute flex items-baseline gap-3" style={{ left: l.x, top: l.y }}>
              <span className="text-[0.875rem] tabular-nums text-brand-300">0{l.cluster + 1}</span>
              <span className="font-display text-[2.75rem] font-light leading-none tracking-[-0.03em] text-fg-3">{stop.name}</span>
            </p>
            {l.chip && stop.chip && (
              <span
                className={`tag absolute origin-left border-brand-400/30 bg-brand-500/10 text-[0.8125rem] text-brand-200 transition-transform duration-300 ${
                  lit[l.cluster] === 1 ? "scale-100" : "scale-[0.94]"
                }`}
                style={{ left: l.chip[0], top: l.chip[1] }}
              >
                {stop.chip}
              </span>
            )}
          </div>
        );
      })}

      {/* In-world brief placeholder: the threads run into it */}
      {placeholder && (
        <div
          className="window absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-3"
          style={{ left: world.brief.x, top: world.brief.y, width: world.brief.w, height: world.brief.h }}
        >
          <span className="flex items-center gap-2 text-[0.8125rem] text-fg-3">
            <span className="grid h-5 w-5 place-items-center rounded-[6px] bg-brand-500 text-[0.6875rem] text-[var(--brand-on)]">A</span>
            {C.brief.label}
          </span>
          <span className={`thinking transition-opacity duration-300 ${converge ? "opacity-100" : "opacity-30"}`}>
            <i />
            <i />
            <i />
          </span>
        </div>
      )}

      {/* Cards */}
      {placed.map(({ p, c }) => (
        <PinCard
          key={p.id}
          kind={c.kind}
          tag={c.tag}
          rotate={p.rot}
          className="absolute! -translate-x-1/2"
          style={{ left: p.x, top: p.top, width: p.w }}
        >
          <CardBody c={c} />
        </PinCard>
      ))}
    </div>
  );
}
