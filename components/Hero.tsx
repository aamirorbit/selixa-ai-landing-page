import { ArrowDown, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import { ConversationCTA } from "@/components/ConversationCTA";
import { DeploymentDiagram } from "./DeploymentDiagram";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const STAGES = [
  {
    when: "Week one",
    title: "Embedded, not advising.",
    body: "A senior engineer sits inside your team from the first day, working the real problem with your data.",
  },
  {
    when: "In production",
    title: "Built where it runs.",
    body: "The system ships into your stack, not a deck or a prototype, and is measured against live traffic.",
  },
  {
    when: "Until it’s owned",
    title: "Accountable for results.",
    body: "We stay through adoption, hand over what we built, and report what actually changed.",
  },
];

export function Hero() {
  return (
    <div className="flex flex-1 flex-col justify-center py-10 lg:py-4">
      <div className="grid items-center gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-x-10">
        <div className="flex flex-col items-start">
          <div className="reveal" style={d(80)}>
            <span className="pill gap-2.5 px-4 py-3">
              <Plus className="h-3.5 w-3.5 text-brand-400" strokeWidth={2.25} aria-hidden="true" />
              AI systems that own the outcome
            </span>
          </div>

          <h1
            className="reveal mt-7 font-display text-[clamp(3.25rem,6vw,6rem)] font-light leading-[0.98] tracking-[-0.05em] text-fg"
            style={d(160)}
          >
            <span className="sm:whitespace-nowrap">Forward Deployed</span>
            <br />
            <span className="text-brand-gradient inline-block pb-[0.12em] -mb-[0.12em]">Intelligence.</span>
          </h1>

          <p className="reveal mt-6 max-w-[36rem] text-[1.125rem] leading-[1.6] text-fg-2 text-pretty" style={d(240)}>
            Selixa embeds senior AI engineers inside a small number of teams, builds in production, and stays until
            the outcome is owned.
          </p>

          <div className="reveal mt-7 flex flex-wrap items-center gap-x-8 gap-y-4" style={d(320)}>
            <ConversationCTA />
            <a
              href="#engagement"
              className="group inline-flex items-center gap-2.5 text-[0.9375rem] text-fg-3 transition-colors duration-200 hover:text-fg"
            >
              How an engagement runs
              <ArrowDown
                className="h-4 w-4 text-brand-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div className="fade hidden justify-center lg:flex" style={d(400)}>
          <DeploymentDiagram className="w-full max-w-[30rem]" />
        </div>
      </div>

      <section id="engagement" aria-label="How an engagement runs" className="reveal mt-14 lg:mt-10" style={d(480)}>
        <div className="h-px w-full bg-[linear-gradient(90deg,rgb(var(--brand-500-rgb)/0.9)_0%,rgb(var(--brand-500-rgb)/0.35)_10%,rgb(255_255_255/0.08)_22%,rgb(255_255_255/0.06)_78%,transparent_100%)]" />
        <ol className="grid gap-8 pt-6 sm:grid-cols-3 sm:gap-10">
          {STAGES.map((s) => (
            <li key={s.when} className="flex flex-col gap-2">
              <span className="text-[0.8125rem] text-brand-300">{s.when}</span>
              <span className="text-[1.0625rem] font-medium leading-snug text-fg">{s.title}</span>
              <span className="max-w-[22rem] text-[0.9375rem] leading-[1.6] text-fg-3 text-pretty">{s.body}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
