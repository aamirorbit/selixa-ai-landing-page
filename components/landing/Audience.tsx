import { Layers, Rocket, User, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Section, SectionHeader, d } from "./ui";

const FOR: { who: string; line: string; icon: LucideIcon; href: string }[] = [
  { who: "Solo founders", line: "Your AI product team.", icon: User, href: "/use-cases/solo-founders" },
  { who: "Lean startups", line: "Move without adding more meetings.", icon: Rocket, href: "/use-cases/lean-startups" },
  { who: "Product managers", line: "Spend less time collecting context.", icon: Users, href: "/use-cases/product-managers" },
  { who: "Founders running multiple products", line: "One workspace for everything you’re building.", icon: Layers, href: "/use-cases/multi-product-founders" },
];

export function Audience() {
  return (
    <Section id="audience">
      <SectionHeader num="12" label="Who it’s for" title="Built for people building products." />

      <ul className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FOR.map(({ who, line, icon: Icon, href }, i) => (
          <li key={who} data-reveal style={d(i * 70)} className="flex">
            {/* Each card opens that role's page */}
            <Link
              href={href}
              className="card flex w-full flex-col p-6 transition-colors duration-200 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400/60"
            >
              <Icon className="h-5 w-5 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-10 text-[1.1875rem] font-medium leading-[1.3] tracking-[-0.015em] text-fg">{who}</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.55] text-fg-3">{line}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
