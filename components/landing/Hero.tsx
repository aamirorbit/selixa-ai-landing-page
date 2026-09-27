import { ConversationCTA } from "@/components/ConversationCTA";
import { Capabilities } from "./Capabilities";
import { d } from "./ui";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col justify-center py-16 lg:py-10">
      {/* Rings behind the headline */}
      <div aria-hidden="true" className="fade pointer-events-none absolute inset-0 grid place-items-center" style={d(300)}>
        <div className="absolute aspect-square w-[min(92vw,56rem)] rounded-full border border-ink/[0.05]" />
        <div className="spin-slow absolute aspect-square w-[min(72vw,42rem)] rounded-full border border-dashed border-ink/[0.07]" />
        <div className="absolute aspect-square w-[min(52vw,28rem)] rounded-full bg-[radial-gradient(circle,rgb(var(--brand-glow-rgb)/0.12),transparent_68%)]" />
        {/* Horizon: a low crimson glow the rings sit on */}
        <div className="absolute bottom-[-18%] h-[46%] w-[min(120vw,80rem)] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(var(--brand-glow-rgb)/0.2),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-[52rem] flex-col items-center text-center">
        <span className="reveal pill gap-2.5 px-4 py-3" style={d(60)}>
          <span className="live-dot" aria-hidden="true" />
          AI Product Manager
        </span>

        <h1
          className="reveal mt-8 font-display text-[clamp(3.25rem,8.2vw,7.5rem)] font-light leading-[0.95] tracking-[-0.055em] text-fg"
          style={d(140)}
        >
          stop building
          <br />
          <span className="text-brand-gradient inline-block pb-[0.12em] -mb-[0.12em]">in chaos.</span>
        </h1>

        <p
          className="reveal mt-8 max-w-[38rem] text-[1.125rem] leading-[1.6] text-fg-2 text-pretty sm:text-[1.25rem]"
          style={d(220)}
        >
          Selixa joins your meetings, understands your product, remembers every decision, and turns conversations
          into clear next steps.
        </p>

        <div className="reveal mt-10 flex w-full justify-center" style={d(300)}>
          <ConversationCTA variant="site" label="Get started" />
        </div>
      </div>

      <Capabilities className="reveal" style={d(420)} />
    </section>
  );
}
