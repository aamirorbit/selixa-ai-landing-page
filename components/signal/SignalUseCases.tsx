import { Cpu, Megaphone, Rocket, Users, type LucideIcon } from "lucide-react";
import { Section, SectionHeader, d } from "@/components/landing/ui";
import { SIGNAL_COPY } from "./copy";

const C = SIGNAL_COPY.useCases;

const FOR: { who: string; line: string; icon: LucideIcon }[] = [
  { who: "Founders", line: "Validate before you build.", icon: Rocket },
  { who: "Product managers", line: "Prioritize with the market in view.", icon: Users },
  { who: "Marketing teams", line: "Find demand as it emerges.", icon: Megaphone },
  { who: "AI agents", line: "Real-world context for your agents.", icon: Cpu },
];

export function SignalUseCases() {
  return (
    <Section id="for">
      <SectionHeader num="08" label={C.label} title={C.headline} />
      <ul className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FOR.map(({ who, line, icon: Icon }, i) => (
          <li key={who} data-reveal style={d(i * 70)} className="flex">
            <div className="card signal-card flex w-full flex-col p-6">
              <Icon className="h-5 w-5 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-10 text-[0.75rem] uppercase tracking-[0.18em] text-fg">{who}</h3>
              <p className="mt-3 text-[1rem] leading-[1.55] text-fg-2">{line}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
