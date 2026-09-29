import { Bell, CalendarX, ChartLine, FileSpreadsheet, Mail, MessageSquare, StickyNote, Video, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { BrandMark } from "./BrandMark";
import { LOGOS } from "./logos";
import { HeroTarget } from "./HeroTarget";

/*
 * The hero acts out the headline. A storm of product fragments (a Monday morning's worth of
 * Slack, tickets, calls and charts) drifts behind the words, then every piece is pulled into
 * the full stop of "chaos." and the dot pulses once: the chaos ends, and only the headline is
 * left. The motion is CSS, server-rendered; HeroTarget only tells the stage where the dot is.
 * The fragments are gone by the end, so reduced motion (which hides the stage) shows the same
 * finished picture. Timings live in `--in` / `--go` here and the keyframes in globals.css.
 */

const logo = (name: string) => LOGOS.find((l) => l.name === name)!;

type Fragment = {
  /** Start, as % of the hero box. */
  sx: number;
  sy: number;
  /** Tilt in degrees. */
  r: number;
  /** 0 front, 1 middle, 2 back (dimmer, softly blurred). */
  depth: 0 | 1 | 2;
  /** Also shown on phones. */
  phone?: boolean;
  src: string;
  text: string;
  tag?: string;
  metric?: string;
  spark?: boolean;
} & ({ logo: string } | { icon: LucideIcon });

// Sample product Atlas and the site's sample team; no real companies or people.
const FRAGMENTS: Fragment[] = [
  {
    sx: 9,
    sy: 17,
    r: -8,
    depth: 1,

    phone: true,
    logo: "Slack",
    src: "#atlas-product",
    text: "is onboarding v2 still happening??",
  },
  {
    sx: 88,
    sy: 14,
    r: 6,
    depth: 0,

    phone: true,
    logo: "Linear",
    src: "ATL-198",
    text: "Fix setup flow",
    tag: "No owner",
  },
  {
    sx: 19,
    sy: 41,
    r: 4,
    depth: 0,

    phone: true,
    icon: Video,
    src: "Product review · 02:41",
    text: "“People still stall at the integrations step.”",
  },
  {
    sx: 80,
    sy: 35,
    r: -5,
    depth: 1,

    phone: true,
    logo: "PostHog",
    src: "PostHog · Activation",
    text: "Since the Aug 12 release",
    metric: "−8%",
    spark: true,
  },
  {
    sx: 7,
    sy: 63,
    r: 7,
    depth: 2,

    phone: true,
    logo: "Intercom",
    src: "Intercom · 7 notes",
    text: "“Onboarding takes too long.”",
  },
  {
    sx: 92,
    sy: 56,
    r: -9,
    depth: 0,

    phone: true,
    logo: "Notion",
    src: "Notion",
    text: "Onboarding PRD v3 (draft)",
    tag: "Outdated?",
  },
  {
    sx: 19,
    sy: 86,
    r: -6,
    depth: 1,

    phone: true,
    logo: "GitHub",
    src: "PR #451 · merged",
    text: "Add integrations step to setup",
  },
  {
    sx: 80,
    sy: 80,
    r: 5,
    depth: 0,

    phone: true,
    icon: CalendarX,
    src: "Calendar",
    text: "Product review",
    tag: "3 conflicts",
  },
  {
    sx: 34,
    sy: 9,
    r: -3,
    depth: 2,

    logo: "Slack",
    src: "Maya Chen",
    text: "which roadmap is the current one?",
  },
  {
    sx: 65,
    sy: 8,
    r: 8,
    depth: 2,

    icon: Mail,
    src: "Email",
    text: "Re: Re: Fwd: Q4 priorities",
  },
  {
    sx: 13,
    sy: 90,
    r: 9,
    depth: 2,

    icon: StickyNote,
    src: "Note",
    text: "TODO: call churned users",
  },
  {
    sx: 91,
    sy: 93,
    r: -4,
    depth: 1,

    icon: FileSpreadsheet,
    src: "Google Drive",
    text: "roadmap_final_v7.xlsx",
  },
  {
    sx: 33,
    sy: 96,
    r: -10,
    depth: 2,

    icon: Bell,
    src: "Slack",
    text: "12 unread in #feedback",
  },
  {
    sx: 62,
    sy: 27,
    r: 3,
    depth: 2,

    logo: "Jira",
    src: "ATL-203",
    text: "Onboarding copy",
    tag: "Blocked 4d",
  },
  {
    sx: 4,
    sy: 38,
    r: -4,
    depth: 1,

    icon: MessageSquare,
    src: "Comment",
    text: "Who decided this?",
  },
  {
    sx: 96,
    sy: 75,
    r: 6,
    depth: 2,

    icon: ChartLine,
    src: "Setup completion",
    text: "Down since Aug 12",
    metric: "62%",
  },
  {
    sx: 97,
    sy: 31,
    r: -7,
    depth: 1,

    logo: "Zoom",
    src: "Zoom",
    text: "Customer call recording, unwatched",
  },
  {
    sx: 45,
    sy: 93,
    r: 5,
    depth: 1,

    logo: "Linear",
    src: "ATL-210",
    text: "Revert integrations step?",
    tag: "Duplicate",
  },
];

/** A tiny falling line, for the metric fragments. */
function Spark() {
  return (
    <svg viewBox="0 0 48 16" className="h-4 w-12 text-brand-400" fill="none" aria-hidden="true">
      <path
        d="M1 4 L10 5 L17 3 L24 6 L30 5 L35 11 L41 12 L47 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Source({ f }: { f: Fragment }) {
  if ("logo" in f) return <BrandMark logo={logo(f.logo)} lit className="h-3.5 w-3.5 shrink-0" />;
  const Icon = f.icon;
  return <Icon className="h-3.5 w-3.5 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden="true" />;
}

// Stable pseudo-random drift per fragment, so server and browser agree.
const drift = (i: number) => ({
  wx: ((i * 37) % 23) - 11,
  wy: ((i * 53) % 19) - 9,
});

function FragmentCard({ f, i }: { f: Fragment; i: number }) {
  const { wx, wy } = drift(i);
  const style = {
    "--sx": f.sx,
    "--sy": f.sy,
    "--r": `${f.r}deg`,
    "--wx": `${wx}px`,
    "--wy": `${wy}px`,
    "--in": `${80 + ((i * 29) % 420)}ms`,
    "--go": `${1500 + ((i * 41) % 380)}ms`,
  } as CSSProperties;
  return (
    <div className={`frag ${f.phone ? "" : "max-md:hidden"}`} data-depth={f.depth} style={style}>
      <div className="frag-drift">
        <div className="frag-card flex w-[13.5rem] flex-col gap-1.5 rounded-[12px] border border-line bg-panel px-3 py-2.5 text-left shadow-[0_12px_32px_-18px_rgb(var(--shadow-rgb)/calc(0.9*var(--shadow-k)))]">
          <span className="flex items-center gap-2 text-[0.6875rem] text-fg-3">
            <Source f={f} />
            <span className="truncate">{f.src}</span>
            {f.tag && (
              <span className="ml-auto shrink-0 rounded-full border border-brand-400/30 px-1.5 py-px text-[0.625rem] text-brand-300">{f.tag}</span>
            )}
          </span>
          {f.metric ? (
            <span className="flex items-end justify-between gap-2">
              <span className="flex flex-col">
                <span className="text-[1.125rem] leading-none tracking-[-0.02em] text-fg">{f.metric}</span>
                <span className="mt-1 text-[0.6875rem] text-fg-3">{f.text}</span>
              </span>
              {f.spark && <Spark />}
            </span>
          ) : (
            <span className="line-clamp-2 text-[0.8125rem] leading-snug text-fg-2">{f.text}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function HeroChaos() {
  return (
    <div aria-hidden="true" className="hero-stage pointer-events-none absolute inset-0">
      <HeroTarget />
      {FRAGMENTS.map((f, i) => (
        <FragmentCard key={f.src + f.text} f={f} i={i} />
      ))}
    </div>
  );
}

/**
 * The headline's last word as letters that shiver out of line, then settle as the fragments are
 * pulled in. Its full stop is where they all go: it pulses once as it takes them in.
 */
// Offsets per letter in em, applied in order to the last word's letters (and its full stop).
const JITTER: [number, number, number][] = [
  [-0.06, 0.08, -9],
  [0.05, -0.1, 7],
  [-0.04, 0.12, -6],
  [0.07, -0.06, 11],
  [-0.05, 0.09, -8],
  [0.08, 0.05, 14],
];

export function ChaosWord({ text }: { text: string }) {
  const WORD = text;
  // Only the last word misbehaves. It takes the tail of JITTER, so its full stop always gets
  // the last (widest) offset, as "chaos." did.
  const first = WORD.lastIndexOf(" ") + 1;
  const skip = Math.max(0, JITTER.length - (WORD.length - first));
  const jitterAt = (i: number) => (i >= first ? JITTER[Math.min(i - first + skip, JITTER.length - 1)] : undefined);
  const n = WORD.length;
  return (
    <span className="inline-block pb-[0.12em] -mb-[0.12em]">
      <span className="sr-only">{WORD}</span>
      {WORD.split("").map((ch, i) => {
        const j = jitterAt(i);
        const style = {
          backgroundSize: `${n * 100}% 100%`,
          backgroundPosition: `${(i / (n - 1)) * 100}% 0`,
          ...(j && {
            "--jx": `${j[0]}em`,
            "--jy": `${j[1]}em`,
            "--jr": `${j[2]}deg`,
            "--sh": `${j[0] < 0 ? 0.025 : -0.025}em ${j[1] < 0 ? 0.02 : -0.02}em`,
            "--cd": `${1650 + (i - first) * 45}ms`,
          }),
        } as CSSProperties;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`text-brand-gradient inline-block ${j ? "chaos-ch" : ""} ${ch === " " ? "whitespace-pre" : ""} ${ch === "." ? "chaos-dot" : ""}`}
            style={style}
            data-chaos-dot={ch === "." ? "" : undefined}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}
