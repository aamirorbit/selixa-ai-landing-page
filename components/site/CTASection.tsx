import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { ConversationCTA } from "@/components/ConversationCTA";
import { Orb, d } from "@/components/landing/ui";

type CTASectionProps = {
  /** h2, Satoshi Light, lowercase by convention. */
  title: ReactNode;
  /** One short line under the headline. */
  line?: ReactNode;
  /** Button label (default "Get started"). */
  label?: string;
  /** A quiet text link under the CTA, e.g. back to the page's demo. */
  secondary?: { label: string; href: string };
};

/**
 * The close of every inner page: the orb, one headline, and the website CTA
 * (`ConversationCTA variant="site"`), the page's one primary action. The ring
 * layer matches the home FinalCTA; the scraps and tumbling letters stay home-only.
 */
export function CTASection({ title, line, label = "Get started", secondary }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="aspect-square w-[min(110vw,60rem)] rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.1),transparent_65%)]" />
        <div className="absolute aspect-square w-[min(90vw,44rem)] rounded-full border border-ink/[0.05]" />
        <div className="spin-slow absolute aspect-square w-[min(70vw,34rem)] rounded-full border border-dashed border-ink/[0.06]" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div data-reveal>
          <Orb size={64} />
        </div>
        <h2
          data-reveal
          style={d(80)}
          className="mt-10 max-w-[18ch] font-display text-[clamp(2.5rem,5.6vw,4.75rem)] font-light leading-[0.98] tracking-[-0.05em] text-fg text-balance"
        >
          {title}
        </h2>
        {line && (
          <p data-reveal style={d(160)} className="mt-6 max-w-[34rem] text-[1.125rem] leading-[1.6] text-fg-2 text-pretty">
            {line}
          </p>
        )}
        <div data-reveal style={d(240)} className="mt-12 flex w-full justify-center">
          <ConversationCTA variant="site" label={label} />
        </div>
        {secondary && (
          <a data-reveal style={d(300)} href={secondary.href} className="link-arrow mt-8 text-fg-2 hover:text-fg">
            {secondary.label}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  );
}
