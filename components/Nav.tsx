"use client";

import {
  ArrowRight,
  ChevronDown,
  ListChecks,
  Menu,
  Plus,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandMark } from "./landing/BrandMark";
import { LOGOS } from "./landing/logos";
import { Mark, Orb } from "./landing/ui";
import { AGENTS as AGENT_DATA } from "@/lib/content/agents";
import { INTEGRATIONS as INTEGRATION_DATA } from "@/lib/content/integrations";
import { USE_CASES as USE_CASE_DATA } from "@/lib/content/use-cases";
import { iconForUseCase } from "./site/useCaseIcons";
import { AGENT_ICONS, agentHref } from "./site/agents";
import { ConversationCTA } from "./ConversationCTA";
import { Logo } from "./Logo";

type Item = { title: string; body: string; href: string; icon?: LucideIcon; logo?: (typeof LOGOS)[number] };

// From lib/content/agents.ts, in hand-off order. Each item goes to its agent's page once it
// exists (LIVE_AGENT_PAGES), else to the hub.
const AGENTS: Item[] = AGENT_DATA.map((a) => ({ title: a.name, body: a.short, href: agentHref(a.slug, "/agents"), icon: AGENT_ICONS[a.icon] }));

// From lib/content/integrations.ts (joined to the marks by name), each to its own page.
const INTEGRATIONS: Item[] = [
  ...INTEGRATION_DATA.map((i) => ({ title: i.name, body: i.job, href: `/integrations/${i.slug}`, logo: LOGOS.find((l) => l.name === i.name) })),
  { title: "More on the way", body: "Tell us what you use.", href: "/integrations#request", icon: Plus },
];

// From lib/content/use-cases.ts (titles and lines as in the menu), each to its own page.
const USE_CASES: Item[] = USE_CASE_DATA.map((u) => ({ title: u.title, body: u.line, href: `/use-cases/${u.slug}`, icon: iconForUseCase(u.slug) }));

type MenuId = "agents" | "integrations" | "use-cases";
const MENUS: { id: MenuId; label: string; items: Item[]; cols: string; tiles?: boolean; card?: () => ReactNode }[] = [
  { id: "agents", label: "Agents", items: AGENTS, cols: "sm:grid-cols-2", card: AgentsCard },
  { id: "integrations", label: "Integrations", items: INTEGRATIONS, cols: "sm:grid-cols-2 lg:grid-cols-3", card: IntegrationsCard },
  { id: "use-cases", label: "Use cases", items: USE_CASES, cols: "sm:grid-cols-2 lg:grid-cols-3" },
];

export function Nav() {
  const [open, setOpen] = useState<MenuId | null>(null);
  const [sheet, setSheet] = useState(false);
  // Past the first few pixels of scroll, the solid bar fades in behind the header.
  const [scrolled, setScrolled] = useState(false);
  // Once the closing section (or the footer) reaches the top, the brand is on screen there, so the header tucks away.
  const [atFooter, setAtFooter] = useState(false);
  const header = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const show = (id: MenuId) => {
    window.clearTimeout(closeTimer.current);
    setOpen(id);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };
  const close = () => {
    setOpen(null);
    setSheet(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (header.current && !header.current.contains(e.target as Node)) setOpen(null);
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        // From the page's closing section (marked data-hide-nav) or else the footer, down.
        const end = document.querySelector("[data-hide-nav]") ?? document.querySelector("footer");
        const h = header.current?.offsetHeight ?? 72;
        setAtFooter(!!end && end.getBoundingClientRect().top <= h);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <header
      ref={header}
      onMouseLeave={hideSoon}
      data-scrolled={scrolled || sheet}
      data-hidden={atFooter && !sheet && !open}
      className="nav-shell sticky top-0 z-40"
    >
      <div aria-hidden="true" className="nav-layer" />
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1280px] items-center gap-10 px-5 sm:px-8">
        <Link href="/" onClick={close} className="flex items-center" aria-label="Selixa home">
          <Mark className="h-6 w-6 shrink-0 text-fg" />
          <Logo asText className="pl-2.5" />
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 md:flex">
          {MENUS.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-expanded={open === m.id}
              aria-controls={`menu-${m.id}`}
              onMouseEnter={() => show(m.id)}
              onClick={() => (open === m.id ? setOpen(null) : show(m.id))}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors duration-200 ${
                open === m.id ? "text-fg" : "text-fg-3 hover:text-fg"
              }`}
            >
              {m.label}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${open === m.id ? "rotate-180" : ""}`}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
          ))}
          <Link
            href="/blog"
            onMouseEnter={hideSoon}
            onClick={close}
            className="rounded-full px-3.5 py-2 text-[0.9375rem] text-fg-3 transition-colors duration-200 hover:text-fg"
          >
            Blog
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ConversationCTA variant="compact" />
          <button
            type="button"
            onClick={() => setSheet((s) => !s)}
            aria-expanded={sheet}
            aria-controls="mobile-menu"
            aria-label={sheet ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg-2 md:hidden"
          >
            {sheet ? <X className="h-4 w-4" strokeWidth={2} /> : <Menu className="h-4 w-4" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Desktop mega menus */}
      <div className="absolute inset-x-0 top-full hidden px-5 pt-2 sm:px-8 md:block">
        {MENUS.map((m) => (
          <div
            key={m.id}
            id={`menu-${m.id}`}
            data-open={open === m.id}
            inert={open !== m.id}
            onMouseEnter={() => show(m.id)}
            className="mega absolute inset-x-5 top-2 mx-auto sm:inset-x-8"
            style={{ maxWidth: "1216px" }}
          >
            <div className={`grid gap-3 rounded-[24px] ${m.card ? "grid-cols-[minmax(0,1fr)_20rem] lg:grid-cols-[minmax(0,1fr)_22rem]" : "grid-cols-1"} border border-ink/10 bg-panel p-3 shadow-[0_40px_120px_-30px_rgb(var(--shadow-rgb)/calc(0.9*var(--shadow-k))),0_30px_90px_-50px_rgb(var(--brand-glow-rgb)/0.5)] `}>
              <ul className={`grid h-full grid-cols-1 auto-rows-fr gap-1 ${m.tiles ? "gap-2 p-1" : "p-3"} ${m.cols}`}>
                {m.items.map((item) => (
                  <li key={item.title}>
                    <MenuLink item={item} onClick={close} tile={m.tiles} />
                  </li>
                ))}
              </ul>
              {m.card && <m.card />}
            </div>
          </div>
        ))}
      </div>

      {/* Phone sheet */}
      <div
        id="mobile-menu"
        data-open={sheet}
        inert={!sheet}
        className="sheet absolute inset-x-0 top-full h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-bg px-5 pb-10 md:hidden"
      >
        {MENUS.map((m) => (
          <details key={m.id} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[1.0625rem] text-fg [&::-webkit-details-marker]:hidden">
              {m.label}
              <ChevronDown className="h-4 w-4 text-fg-3 transition-transform group-open:rotate-180" strokeWidth={2} aria-hidden="true" />
            </summary>
            <ul className="flex flex-col gap-1 pb-4">
              {m.items.map((item) => (
                <li key={item.title}>
                  <MenuLink item={item} onClick={close} />
                </li>
              ))}
            </ul>
          </details>
        ))}
        <Link href="/blog" onClick={close} className="flex items-center justify-between border-b border-line py-5 text-[1.0625rem] text-fg">
          Blog
          <ArrowRight className="h-4 w-4 text-fg-3" strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}

function MenuLink({ item, onClick, tile }: { item: Item; onClick: () => void; tile?: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group/item flex h-full gap-3.5 rounded-[14px] transition-colors duration-200 hover:bg-ink/[0.04] ${
        tile ? "flex-col justify-between border border-line bg-ink/[0.015] p-5 hover:border-line-strong" : "items-center p-3"
      }`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border border-line bg-ink/[0.03] text-brand-300 transition-colors duration-200 group-hover/item:border-line-strong">
        {item.logo ? (
          <BrandMark logo={item.logo} lit className="h-5 w-5" />
        ) : (
          Icon && <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.6} aria-hidden="true" />
        )}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={`truncate text-fg ${tile ? "text-[1.0625rem]" : "text-[0.9375rem]"}`}>{item.title}</span>
        <span className="text-[0.8125rem] leading-snug text-fg-3">{item.body}</span>
      </span>
    </Link>
  );
}

/* Showcase cards: a small, live moment from the product for each menu. */

function Card({ children, href, cta }: { children: ReactNode; href: string; cta: string }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-[18px] border border-line bg-[radial-gradient(120%_90%_at_100%_0%,rgb(var(--brand-500-rgb)/0.16),transparent_60%),var(--color-panel-2)] p-6">
      {children}
      <Link href={href} className="link-arrow mt-auto pt-6 text-[0.875rem]">
        {cta}
        <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </Link>
    </div>
  );
}

function AgentsCard() {
  return (
    <Card href="/agents" cta="Meet the agents">
      <div className="flex items-center gap-3">
        <Orb size={40} />
        <span className="flex items-center gap-2 text-[0.75rem] text-brand-300">
          <span className="live-dot" aria-hidden="true" />
          Working now
        </span>
      </div>
      <p className="mt-6 text-[1.375rem] leading-[1.25] tracking-[-0.02em] text-fg">
        One product’s context. <span className="text-fg-3">Every agent knows it.</span>
      </p>
      <ul className="mt-6 flex flex-col gap-2.5 text-[0.8125rem] text-fg-2">
        <li className="flex items-center gap-2">
          <Video className="h-3.5 w-3.5 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
          Captured 3 decisions from Product review
        </li>
        <li className="flex items-center gap-2">
          <ListChecks className="h-3.5 w-3.5 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
          Created 14 tasks in Linear
        </li>
      </ul>
    </Card>
  );
}

function IntegrationsCard() {
  const ring = LOGOS.slice(0, 8);
  return (
    <Card href="/integrations" cta="See all integrations">
      {/* The tools, orbiting the one place they flow into */}
      <div className="relative mx-auto aspect-square w-[11.5rem]">
        <div aria-hidden="true" className="absolute inset-[14%] rounded-full border border-dashed border-ink/10" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Orb size={52} />
        </div>
        {ring.map((logo, i) => {
          const a = (i / ring.length) * 2 * Math.PI - Math.PI / 2;
          return (
            <span
              key={logo.name}
              className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[10px] border border-line bg-panel"
              style={{ left: `${Math.round((50 + 44 * Math.cos(a)) * 100) / 100}%`, top: `${Math.round((50 + 44 * Math.sin(a)) * 100) / 100}%` }}
            >
              <BrandMark logo={logo} lit className="h-4 w-4" />
            </span>
          );
        })}
      </div>
      <p className="mt-6 text-[1.25rem] leading-[1.25] tracking-[-0.02em] text-fg">Everything flows into your product’s context.</p>
    </Card>
  );
}
