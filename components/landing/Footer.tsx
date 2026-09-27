import { ConversationCTA } from "@/components/ConversationCTA";
import { Logo } from "@/components/Logo";
import { SchemeSwitch } from "@/components/SchemeSwitch";
import { MARKS, type Mark as MarkData } from "./marks";
import { Mark } from "./ui";

/** Add a profile URL to show its icon. Empty ones are left out rather than linking nowhere. */
const SOCIAL: { label: string; href: string; mark: MarkData }[] = [
  { label: "X", href: "", mark: MARKS.x },
  { label: "LinkedIn", href: "", mark: MARKS.linkedin },
  { label: "GitHub", href: "", mark: MARKS.github },
];

const PROMPT = encodeURIComponent(
  "What is Selixa (selixa.ai), the AI Product Manager? Summarize what it does, how it works, and who it's for.",
);
const ASK_AI = [
  { label: "ChatGPT", href: `https://chatgpt.com/?q=${PROMPT}`, mark: MARKS.openai },
  { label: "Claude", href: `https://claude.ai/new?q=${PROMPT}`, mark: MARKS.claude },
  { label: "Perplexity", href: `https://www.perplexity.ai/search?q=${PROMPT}`, mark: MARKS.perplexity },
];

type Column = { title: string; links: { label: string; href: string }[] };

const COLUMNS: Column[][] = [
  [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "/#demo" },
        { label: "Ask Selixa", href: "/#decide" },
        { label: "Product context", href: "/#context" },
        { label: "Multiple products", href: "/#products" },
        { label: "Workspace", href: "/#workspace" },
        { label: "Proactive insights", href: "/#proactive" },
        { label: "Execution", href: "/#execution" },
      ],
    },
  ],
  [
    {
      title: "Agents",
      links: ["Meeting", "Research", "Product", "Analyst", "Roadmap", "Execution"].map((a) => ({
        label: `${a} Agent`,
        href: "/#agents",
      })),
    },
  ],
  [
    {
      title: "Integrations",
      links: ["Slack", "Notion", "Google Drive", "Linear", "Jira", "GitHub", "Zoom", "Google Meet", "Intercom", "PostHog", "Mixpanel"].map(
        (t) => ({ label: t, href: "/#integrations" }),
      ),
    },
  ],
  [
    {
      title: "Built for",
      links: ["Solo founders", "Lean startups", "Product managers", "Multi-product founders"].map((w) => ({
        label: w,
        href: "/#audience",
      })),
    },
  ],
];

const linkClass = "text-[0.9375rem] text-fg-3 transition-colors duration-200 hover:text-fg";

function Glyph({ mark, className = "h-[1.125rem] w-[1.125rem]" }: { mark: MarkData; className?: string }) {
  return (
    <svg viewBox={mark.viewBox} aria-hidden="true" className={className} fill="currentColor">
      {mark.d.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}

const iconButton =
  "grid h-10 w-10 place-items-center rounded-full border border-line bg-ink/[0.02] text-fg-2 transition-colors duration-200 hover:border-line-strong hover:text-fg";

export function Footer() {
  const social = SOCIAL.filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-2">
      <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 gap-14 px-5 pb-10 pt-16 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2.4fr)] lg:gap-10 lg:pt-20">
        {/* Brand */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3">
            <Mark className="h-7 w-7 text-fg" />
            <Logo />
          </div>
          <p className="mt-6 max-w-[18rem] text-[1.25rem] leading-[1.35] tracking-[-0.02em] text-fg">
            Your AI Product Manager for everything you&rsquo;re building.
          </p>

          {social.length > 0 && (
            <ul className="mt-7 flex gap-2.5">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label} className={iconButton} target="_blank" rel="noopener noreferrer">
                    <Glyph mark={s.mark} />
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 text-[0.8125rem] text-fg-2">Ask AI about Selixa</p>
          <ul className="mt-3 flex gap-2.5">
            {ASK_AI.map((a) => (
              <li key={a.label}>
                <a
                  href={a.href}
                  aria-label={`Ask ${a.label} about Selixa`}
                  title={`Ask ${a.label}`}
                  className={iconButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Glyph mark={a.mark} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
          {COLUMNS.map((stack, i) => (
            <div key={i} className="flex flex-col gap-12">
              {stack.map((col) => (
                <div key={col.title}>
                  <p className="text-[0.9375rem] font-medium text-fg">{col.title}</p>
                  <ul className="mt-5 flex flex-col gap-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href} className={linkClass}>
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {i === COLUMNS.length - 1 && (
                <div>
                  <p className="text-[0.9375rem] font-medium text-fg">Company</p>
                  <ul className="mt-5 flex flex-col gap-3">
                    <li>
                      <ConversationCTA variant="link" label="Get started" className={`${linkClass} cursor-pointer text-left`} />
                    </li>
                    <li>
                      <ConversationCTA variant="link" label="Contact" className={`${linkClass} cursor-pointer text-left`} />
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Sign-off: the wordmark, huge and softly lit, resting on the line above the copyright */}
      <div aria-hidden="true" className="group/word relative mx-auto max-w-[1280px] select-none px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 bottom-[-30%] mx-auto h-[110%] w-[80%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(var(--brand-glow-rgb)/0.28),transparent_65%)] blur-2xl" />
        {/* Each letter lights up under the cursor */}
        <p className="relative pb-[0.06em] pt-4 text-center text-[clamp(4.5rem,21vw,19rem)] font-medium uppercase leading-[0.8] tracking-[0.06em]">
          {"Selixa".split("").map((ch, i) => (
            <span key={i} className="glyph">
              {ch}
            </span>
          ))}
        </p>
      </div>

      <div className="relative z-10 border-t border-line">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-5 py-5 text-[0.8125rem] text-fg-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Selixa. All rights reserved.</p>
          <SchemeSwitch />
        </div>
      </div>
    </footer>
  );
}
