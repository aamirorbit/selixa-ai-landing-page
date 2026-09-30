"use client";

import { Count, Stage } from "@/components/landing/demo";
import { Orb, Section, SectionHeader } from "@/components/landing/ui";
import { useSequence } from "@/components/landing/useSequence";
import { CAPTURE_COPY } from "./copy";

const C = CAPTURE_COPY.network;

// A sample network: 14 people, 7 problems they raised, 3 opportunities those point to.
const PEOPLE = ["SK", "JM", "AR", "LT", "PN", "DO", "EV", "MC", "RB", "HW", "TF", "NA", "GL", "YS"];
const PROBLEMS = [
  "Request prioritization",
  "Feedback in too many places",
  "Roadmap drift",
  "Slow customer research",
  "Unclear activation",
  "Meeting follow-up",
  "Stakeholder updates",
];
const OPPS = ["AI-assisted prioritization", "One feedback inbox", "Research on demand"];

// person → problems they raised. Problem 0 comes up again and again.
const RAISED: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [3, 1], [4, 0], [5, 2], [6, 0], [7, 3], [8, 0], [9, 1], [10, 4], [11, 0], [12, 5], [13, 0],
  [0, 1], [2, 6], [5, 3], [9, 2], [12, 1],
];
// problem → opportunity
const POINTS: [number, number][] = [[0, 0], [1, 1], [3, 2], [2, 0], [1, 0]];

const STATS = [
  { n: 14, label: "product leaders" },
  { n: 23, label: "conversations" },
  { n: 7, label: "recurring problems" },
  { n: 3, label: "repeated opportunities" },
  { n: 2, label: "design partners" },
];

const y = (i: number, n: number) => Math.round((6 + (i / (n - 1)) * 88) * 100) / 100;
const PX = 8;
const QX = 50;
const OX = 90;

// people, the threads, the repeated problem lights, the opportunity, the verdict, hold
const SCRIPT = [400, 700, 900, 900, 800, 5200];
const THREADS = 1;
const HOT = 2;
const OPP = 3;
const FOUND = 4;

export function Network() {
  const { ref, step, still } = useSequence(SCRIPT);
  const at = (s: number) => still || step >= s;

  return (
    <Section id="network">
      <SectionHeader num="07" label={C.label} title={C.headline} align="center" className="mx-auto" />

      {/* The numbers */}
      <dl data-reveal className="mx-auto mt-14 grid max-w-[60rem] grid-cols-2 gap-6 text-center sm:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col-reverse gap-2">
            <dt className="text-[0.8125rem] text-fg-3">{s.label}</dt>
            <dd className="font-display text-[clamp(2.25rem,4vw,3rem)] font-light leading-none tracking-[-0.04em] text-fg tabular-nums">
              <Count to={s.n} on={at(THREADS)} still={still} />
            </dd>
          </div>
        ))}
      </dl>

      <div ref={ref} data-reveal className="window relative mx-auto mt-12 max-w-[68rem] p-4 sm:p-6">
        <div className="relative h-[26rem] sm:h-[30rem]">
          {/* Threads */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
            {RAISED.map(([p, q], i) => {
              const hot = q === 0 && at(HOT);
              return (
                <path
                  key={`r${i}`}
                  d={`M${PX} ${y(p, PEOPLE.length)} C ${(PX + QX) / 2} ${y(p, PEOPLE.length)}, ${(PX + QX) / 2} ${y(q, PROBLEMS.length)}, ${QX - 11} ${y(q, PROBLEMS.length)}`}
                  fill="none"
                  stroke={hot ? "rgb(var(--brand-400-rgb))" : "rgb(var(--ink-rgb))"}
                  strokeOpacity={hot ? 0.7 : 0.12}
                  strokeWidth={hot ? 1.25 : 1}
                  vectorEffect="non-scaling-stroke"
                  data-on={at(THREADS)}
                  className="line-in"
                  style={{ transition: "stroke-opacity 500ms, opacity 400ms" }}
                />
              );
            })}
            {POINTS.map(([q, o], i) => {
              const hot = o === 0 && at(OPP);
              return (
                <path
                  key={`p${i}`}
                  d={`M${QX + 11} ${y(q, PROBLEMS.length)} C ${(QX + OX) / 2} ${y(q, PROBLEMS.length)}, ${(QX + OX) / 2} ${y(o, OPPS.length) * 0.6 + 20}, ${OX - 11} ${y(o, OPPS.length) * 0.6 + 20}`}
                  fill="none"
                  stroke={hot ? "rgb(var(--brand-400-rgb))" : "rgb(var(--ink-rgb))"}
                  strokeOpacity={hot ? 0.7 : 0.12}
                  vectorEffect="non-scaling-stroke"
                  data-on={at(HOT)}
                  className="line-in"
                />
              );
            })}
          </svg>

          {/* People */}
          {PEOPLE.map((p, i) => {
            const hot = at(HOT) && RAISED.some(([pp, q]) => pp === i && q === 0);
            return (
              <span
                key={p}
                className={`absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-panel text-[0.625rem] transition-colors duration-500 ${
                  hot ? "border-brand-400/60 text-fg" : "border-line-strong text-fg-3"
                }`}
                style={{ left: `${PX}%`, top: `${y(i, PEOPLE.length)}%` }}
                aria-hidden="true"
              >
                {p}
              </span>
            );
          })}

          {/* Problems */}
          {PROBLEMS.map((q, i) => (
            <span
              key={q}
              className={`tag absolute w-[min(44%,13rem)] -translate-x-1/2 -translate-y-1/2 justify-center bg-panel transition-[border-color,color,box-shadow] duration-500 ${
                i === 0 && at(HOT) ? "is-live border-brand-400/60 text-fg" : ""
              }`}
              style={{ left: `${QX}%`, top: `${y(i, PROBLEMS.length)}%` }}
            >
              <span className="truncate">{q}</span>
            </span>
          ))}

          {/* Opportunities */}
          {OPPS.map((o, i) => (
            <span
              key={o}
              className={`tag absolute hidden w-[min(22%,12rem)] -translate-x-1/2 -translate-y-1/2 justify-center bg-panel transition-[border-color,color] duration-500 sm:inline-flex ${
                i === 0 && at(OPP) ? "border-brand-400/60 text-brand-200" : ""
              }`}
              style={{ left: `${OX}%`, top: `${y(i, OPPS.length) * 0.6 + 20}%` }}
            >
              <span className="truncate">{o}</span>
            </span>
          ))}

          {/* Column heads */}
          <span className="absolute -top-1 left-[8%] -translate-x-1/2 text-[0.625rem] uppercase tracking-[0.16em] text-fg-3" aria-hidden="true">
            People
          </span>
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[0.625rem] uppercase tracking-[0.16em] text-fg-3" aria-hidden="true">
            Problems
          </span>
          <span className="absolute -top-1 left-[90%] hidden -translate-x-1/2 text-[0.625rem] uppercase tracking-[0.16em] text-fg-3 sm:block" aria-hidden="true">
            Opportunities
          </span>
        </div>
      </div>

      {/* The moment it becomes intelligence */}
      <Stage on={at(FOUND)} className={`card card-lit mx-auto mt-6 flex max-w-[44rem] items-center gap-4 p-5 sm:p-6 ${!still && step === FOUND ? "is-live" : ""}`}>
        <Orb size={40} className="shrink-0" />
        <div>
          <p className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.18em] text-brand-300">
            <span className="live-dot" aria-hidden="true" />
            Opportunity detected
          </p>
          <p className="mt-1.5 text-[1.125rem] leading-[1.4] tracking-[-0.01em] text-fg">
            Customer-request prioritization appears repeatedly across your network.
          </p>
        </div>
      </Stage>
      <p className="sr-only">
        Across 14 product leaders and 23 conversations, Selixa found 7 recurring problems. Request prioritization came up most often and points to the
        opportunity of AI-assisted prioritization.
      </p>
    </Section>
  );
}
