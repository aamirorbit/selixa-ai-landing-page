import type { CSSProperties, ReactNode } from "react";

export const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** The Selixa "S" mark, traced from public/brand/logo.png. The lower stroke is the upper one turned 180°. */
export function Mark({ className = "" }: { className?: string }) {
  const half = "M745 448H1150L1068 556H785L648 712L862 966H722L522 740Q512 718 525 698L715 468Q728 450 745 448Z";
  return (
    <svg viewBox="500 430 686 800" aria-hidden="true" className={className} fill="currentColor">
      <path d={half} />
      <path d={half} transform="rotate(180 843 829)" />
    </svg>
  );
}

export function Orb({ size = 96, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`orb orb-breathe ${className}`} style={{ width: size, height: size }}>
      <Mark className="w-[36%] text-white" />
    </span>
  );
}

export function Section({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`relative py-24 sm:py-32 lg:py-40 ${className}`}>
      {children}
    </section>
  );
}

type HeaderProps = {
  num: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ num, label, title, lead, align = "left", className = "" }: HeaderProps) {
  const center = align === "center";
  return (
    <div className={`flex flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
      <p data-reveal className="eyebrow">
        <span className="num">{num}</span>
        <span className="rule" aria-hidden="true" />
        {label}
      </p>
      <h2
        data-reveal
        style={d(80)}
        className="mt-6 max-w-[20ch] text-[clamp(2.25rem,4.4vw,3.75rem)] font-normal leading-[1.04] tracking-[-0.035em] text-fg text-balance"
      >
        {title}
      </h2>
      {lead && (
        <p data-reveal style={d(160)} className="mt-6 max-w-[38rem] text-[1.125rem] leading-[1.6] text-fg-2 text-pretty">
          {lead}
        </p>
      )}
    </div>
  );
}

export function WindowBar({ children }: { children?: ReactNode }) {
  return (
    <div className="window-bar">
      <span className="window-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {children}
    </div>
  );
}

/** Round initials avatar for people in the product mock-ups. */
export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong bg-ink/[0.05] text-[0.6875rem] font-medium text-fg-2 ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
