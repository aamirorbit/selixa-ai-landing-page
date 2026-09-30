import { BookMarked, Link2, MessagesSquare, Mic, type LucideIcon } from "lucide-react";
import { Section, SectionHeader, d } from "@/components/landing/ui";
import { CAPTURE_COPY } from "./copy";

const C = CAPTURE_COPY.anywhere;

const WAYS: { verb: string; icon: LucideIcon; examples: string[] }[] = [
  {
    verb: "Talk",
    icon: MessagesSquare,
    examples: ["Telegram", "Slack", "Email", "Customer conversations"],
  },
  { verb: "Record", icon: Mic, examples: ["Audio", "Video", "Voice notes"] },
  {
    verb: "Share",
    icon: Link2,
    examples: ["Shareable Selixa link", "Guest contribution", "Customer feedback"],
  },
  {
    verb: "Remember",
    icon: BookMarked,
    examples: ["People", "Topics", "Problems", "Opportunities", "Decisions"],
  },
];

export function Anywhere() {
  return (
    <Section id="anywhere">
      <SectionHeader num="02" label={C.label} title={C.headline} />
      <ul className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {WAYS.map(({ verb, icon: Icon, examples }, i) => (
          <li key={verb} data-reveal style={d(i * 70)} className="flex">
            <div className="card signal-card flex w-full flex-col p-6">
              <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-line bg-ink/[0.03] text-brand-300">
                <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-10 font-display text-[2rem] font-light leading-none tracking-[-0.04em] text-fg">{verb}</h3>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {examples.map((e) => (
                  <li key={e} className="tag">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
