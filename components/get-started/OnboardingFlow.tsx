"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Globe, Loader2, Lock, Mail, Plus, User } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useReducer, useRef, useState, type FormEvent, type ReactNode } from "react";
import { submitOnboarding, type OnboardingField, type OnboardingState, type OnboardingValues } from "@/app/actions";
import { Field } from "@/components/InquiryForm";
import { BrandMark } from "@/components/landing/BrandMark";
import { d } from "@/components/landing/ui";
import { PAIN_OPTIONS, ROLE_OPTIONS, TOOL_OPTIONS, toolLogo } from "@/lib/onboarding";
import { toDomain } from "@/lib/site";
import { BriefCard } from "./BriefCard";
import { GS } from "./copy";

/*
 * The interview: site → tools → pains → you → done, one input at a time, with a brief card
 * building beside it. Hard rule: nothing the visitor typed or tapped is ever cleared by the
 * system. One state object is the source of truth (every input controlled from it), panels
 * stay mounted (hidden) until success, the form never resets on submit, the server echoes
 * values, and the answers are mirrored to sessionStorage (same tab, cleared on success).
 */

const STEPS = ["site", "tools", "pains", "you", "done"] as const;
type Step = (typeof STEPS)[number];
const STORE = "selixa.onboarding.v1";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Answers = OnboardingValues & { toolsSkipped: boolean; painsSkipped: boolean; siteEdited: boolean };
const EMPTY: Answers = { site: "", noSite: false, tools: [], toolsOther: "", pains: [], name: "", email: "", role: "", toolsSkipped: false, painsSkipped: false, siteEdited: false };

type Action = { type: "set"; patch: Partial<Answers> } | { type: "toggle"; key: "tools" | "pains"; value: string };
function reducer(s: Answers, a: Action): Answers {
  if (a.type === "set") return { ...s, ...a.patch };
  const list = s[a.key];
  return { ...s, [a.key]: list.includes(a.value) ? list.filter((v) => v !== a.value) : [...list, a.value] };
}

const fill = (tpl: string, n: number) => tpl.replace("{n}", String(n));

export function OnboardingFlow({ initialSite }: { initialSite: string }) {
  const [a, dispatch] = useReducer(reducer, { ...EMPTY, site: initialSite });
  const [step, setStep] = useState<Step>(initialSite ? "tools" : "site");
  const [errors, setErrors] = useState<Partial<Record<OnboardingField, string>>>({});
  const [summary, setSummary] = useState("");
  const [limitNote, setLimitNote] = useState(false);
  const [nudge, setNudge] = useState(0);
  const [live, setLive] = useState("");
  const [state, action, pending] = useActionState<OnboardingState, FormData>(submitOnboarding, { status: "idle" });
  const done = state.status === "success";
  const idx = done ? 4 : STEPS.indexOf(step);
  const set = (patch: Partial<Answers>) => dispatch({ type: "set", patch });

  // Restore a warm tab (sessionStorage), then keep mirroring. Pre-fill never overwrites.
  const restored = useRef(false);
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const raw = sessionStorage.getItem(STORE);
        if (raw) {
          const saved = JSON.parse(raw) as { answers: Answers; step: Step };
          set({ ...saved.answers, site: saved.answers.site || initialSite });
          if (saved.step && saved.step !== "done") setStep(saved.step);
        }
      } catch {
        // storage unavailable: fine
      }
      restored.current = true;
    });
    return () => window.clearTimeout(t);
    // Once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!restored.current || done) return;
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORE, JSON.stringify({ answers: a, step }));
      } catch {}
    }, 250);
    return () => window.clearTimeout(t);
  }, [a, step, done]);

  // Server results: errors land on their step (values untouched); success clears the mirror.
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    if (state.status === "error") {
      setErrors(state.fields ?? {});
      setSummary(state.message);
      setStep(state.step);
    }
  }
  useEffect(() => {
    if (state.status !== "success") return;
    try {
      sessionStorage.removeItem(STORE);
    } catch {}
    // A fresh URL, so a reload starts a new flow.
    window.history.replaceState(null, "", "/get-started");
  }, [state]);

  // Steps in the URL: browser Back/Forward walk the steps without leaving the page.
  const go = (to: Step, push = true) => {
    setStep(to);
    setSummary("");
    if (push) window.history.pushState({ step: to }, "", `?step=${to}`);
  };
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const to = (e.state?.step as Step | undefined) ?? "site";
      if (STEPS.includes(to) && to !== "done") setStep(to);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Focus the new step's heading on every change (not on first load).
  const headings = useRef<Partial<Record<Step, HTMLElement | null>>>({});
  const siteInput = useRef<HTMLInputElement>(null);
  const otherInput = useRef<HTMLInputElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      // First load on step 1 with a mouse: straight into the site field (not on touch).
      if (step === "site" && window.matchMedia("(pointer: fine)").matches) siteInput.current?.focus({ preventScroll: true });
      return;
    }
    const h = headings.current[done ? "done" : step];
    h?.focus({ preventScroll: true });
    if (h && h.getBoundingClientRect().top < 72) window.scrollTo({ top: window.scrollY + h.getBoundingClientRect().top - 120 });
  }, [step, done]);

  // Counts for assistive tech (debounced).
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (step === "tools") setLive(a.tools.length ? fill(GS.tools.selected, a.tools.length) : "");
      if (step === "pains") setLive(fill(GS.pains.counter, a.pains.length));
    }, 500);
    return () => window.clearTimeout(t);
  }, [a.tools.length, a.pains.length, step]);

  const domain = a.noSite ? "" : toDomain(a.site);
  const errorCount = Object.values(errors).filter(Boolean).length;

  const validate = (s: Step): Partial<Record<OnboardingField, string>> => {
    const e: Partial<Record<OnboardingField, string>> = {};
    if (s === "site" && !a.noSite && !toDomain(a.site)) e.site = GS.site.invalid;
    if (s === "you") {
      if (a.name.trim().length < 2) e.name = GS.you.errors.name;
      if (!EMAIL_RE.test(a.email.trim())) e.email = GS.you.errors.email;
      if (!a.role) e.role = GS.you.errors.role;
    }
    return e;
  };

  const form = useRef<HTMLFormElement>(null);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(step);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const n = Object.keys(errs).length;
      setSummary(n === 1 ? GS.summary.one : GS.summary.many);
      window.setTimeout(() => form.current?.querySelector<HTMLElement>(`[data-step="${step}"] input[aria-invalid="true"], [data-step="${step}"] fieldset[aria-invalid="true"] input`)?.focus());
      return;
    }
    if (step === "site") return go("tools");
    if (step === "tools") {
      set({ toolsSkipped: a.tools.length === 0 });
      return go("pains");
    }
    if (step === "pains") {
      set({ painsSkipped: a.pains.length === 0 });
      return go("you");
    }
    // Step 4: submit without letting React reset the form.
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  const back = () => go(STEPS[Math.max(0, idx - 1)]);

  const togglePain = (key: string) => {
    if (!a.pains.includes(key) && a.pains.length >= 3) {
      setLimitNote(true);
      setLive(GS.pains.limit);
      setNudge((n) => n + 1);
      window.setTimeout(() => setLimitNote(false), 2500);
      return;
    }
    dispatch({ type: "toggle", key: "pains", value: key });
  };

  const brief = {
    domain: done && state.status === "success" ? state.site : domain,
    tools: a.tools,
    pains: a.pains,
    name: a.name,
    role: a.role,
    toolsSkipped: a.toolsSkipped,
    painsSkipped: a.painsSkipped,
    sealed: done,
  };

  const heading = (s: Step, text: ReactNode) => (
    <h1
      ref={(el) => {
        headings.current[s] = el;
      }}
      tabIndex={-1}
      className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-light leading-[1] tracking-[-0.045em] text-fg outline-none"
    >
      {text}
    </h1>
  );
  const line = (text: string) => <p className="mt-4 text-[1.0625rem] leading-[1.55] text-fg-2 sm:text-[1.125rem]">{text}</p>;
  const primaryLabel = step === "you" ? GS.buttons.submit : GS.buttons.continue;
  const skipMode = (step === "tools" && !a.tools.length) || (step === "pains" && !a.pains.length);

  return (
    <div className="grid min-h-[calc(100svh-4.5rem)] grid-cols-1 content-start gap-8 pb-20 pt-10 lg:grid-cols-12 lg:gap-12 lg:pt-14">
      {/* Rail */}
      <nav aria-label={GS.rail.aria} className="reveal lg:col-span-12" style={d(60)}>
        <div className="flex items-center justify-between">
          <span className="pill gap-2.5 px-4 py-2.5 text-[0.8125rem]">
            <span className="live-dot" aria-hidden="true" />
            {GS.eyebrow}
          </span>
          <span className="text-[0.8125rem] tabular-nums text-fg-3">{fill(GS.rail.counter, idx + 1)}</span>
        </div>
        <div aria-hidden="true" className="mt-5 h-0.5 rounded-full bg-ink/[0.1]">
          <div className="h-full origin-left rounded-full bg-brand-400 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none" style={{ transform: `scaleX(${idx / 4})` }} />
        </div>
        <ol className="mt-3 hidden grid-cols-5 md:grid">
          {GS.rail.labels.map((label, i) => {
            const current = i === idx;
            const complete = i < idx;
            return (
              <li key={label} aria-current={current ? "step" : undefined} className="text-[0.8125rem]">
                {complete && !done && i < 4 ? (
                  <button type="button" onClick={() => go(STEPS[i])} className="flex items-center gap-1.5 text-fg-2 transition-colors hover:text-fg">
                    <Check className="h-3 w-3 text-brand-300" strokeWidth={2.5} aria-hidden="true" />
                    {label}
                    <span className="sr-only">{GS.rail.completed}</span>
                  </button>
                ) : (
                  <span className={`flex items-center gap-1.5 ${current ? "text-fg" : complete ? "text-fg-2" : "text-fg-3"}`}>
                    {current && <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />}
                    {complete && <Check className="h-3 w-3 text-brand-300" strokeWidth={2.5} aria-hidden="true" />}
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Brief strip (phone/tablet), full card on done */}
      <div className="lg:hidden">{done ? null : <BriefCard data={brief} compact />}</div>

      {/* Questions */}
      <div className="max-w-[40rem] lg:col-span-7">
        <noscript>
          <p className="mb-6 text-[0.9375rem] text-fg-2">
            {GS.noscript} <Link href="/contact" className="underline underline-offset-4">/contact</Link>
          </p>
        </noscript>
        <p className="sr-only" aria-live="polite">
          {live}
        </p>

        {done ? (
          <div className="reveal">
            {heading(
              "done",
              state.site ? (
                <>
                  Selixa will start by learning <span className="text-fg">{state.site}</span>.
                </>
              ) : (
                GS.done.headlineNoSite(state.name)
              ),
            )}
            {line(GS.done.line)}
            <ol className="mt-8 flex flex-col">
              {[...GS.done.next, state.site && a.tools.length ? GS.done.next3(state.site) : GS.done.next3Generic].map((t, i) => (
                <li key={t} className="flex min-h-12 items-center gap-3 text-[0.9375rem] text-fg-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-[0.75rem] text-fg-3">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
            <div className="mt-8 lg:hidden">
              <BriefCard data={brief} />
            </div>
            <Link href="/" className="link-arrow mt-8">
              {GS.done.home}
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <form ref={form} onSubmit={onSubmit} noValidate className="relative">
            {/* Honeypot, invisible to people. (The real field is `site`, never `website`.) */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <input type="hidden" name="noSite" value={a.noSite ? "1" : ""} />

            {/* Step 1: site */}
            <div data-step="site" hidden={step !== "site"} className="reveal" style={d(140)}>
              {heading("site", GS.site.headline)}
              {line(GS.site.line)}
              <div className="mt-10">
                <div className="site-cta max-w-[34rem]" data-error={!!errors.site}>
                  <Globe className="ml-5 h-5 w-5 shrink-0 text-fg-3" strokeWidth={1.6} aria-hidden="true" />
                  <label htmlFor="gs-site" className="sr-only">
                    {GS.site.label}
                  </label>
                  <input
                    ref={siteInput}
                    id="gs-site"
                    name="site"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={GS.site.placeholder}
                    value={a.site}
                    onChange={(e) => {
                      set({ site: e.target.value, siteEdited: true, noSite: false });
                      if (errors.site) setErrors({ ...errors, site: undefined });
                    }}
                    aria-invalid={!!errors.site || undefined}
                    aria-describedby="gs-site-note"
                    className="min-w-0 flex-1 bg-transparent px-3 pr-5 text-[1.0625rem] text-fg outline-none placeholder:text-fg-3"
                  />
                </div>
                <p id="gs-site-note" className={`mt-3 h-5 text-[0.8125rem] ${errors.site ? "text-danger" : "text-fg-3"}`} role={errors.site ? "alert" : undefined}>
                  {errors.site ?? (initialSite && !a.siteEdited && a.site ? GS.site.prefilled : "")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    set({ noSite: true });
                    setErrors({});
                    go("tools");
                  }}
                  className="mt-2 text-[0.875rem] text-fg-3 underline-offset-4 hover:underline"
                >
                  {GS.site.skip}
                </button>
              </div>
            </div>

            {/* Step 2: tools */}
            <div data-step="tools" hidden={step !== "tools"}>
              {heading("tools", GS.tools.headline)}
              {line(GS.tools.line)}
              <fieldset className="mt-10">
                <legend className="sr-only">{GS.tools.headline}</legend>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5">
                  {TOOL_OPTIONS.map((t) => {
                    const on = a.tools.includes(t.slug);
                    const logo = toolLogo(t.slug);
                    return (
                      <label
                        key={t.slug}
                        className={`card relative flex h-[76px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px]! transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-400/60 sm:h-[88px] ${
                          on ? "border-brand-400/50!" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="tools"
                          value={t.slug}
                          checked={on}
                          onChange={() => dispatch({ type: "toggle", key: "tools", value: t.slug })}
                          onClick={(e) => {
                            // A pointer check (not keyboard Space) of "Something else" goes to its field.
                            if (t.slug === "other" && !on && e.detail > 0) window.setTimeout(() => otherInput.current?.focus());
                          }}
                          className="sr-only"
                        />
                        <span aria-hidden="true" className={`card-lit pointer-events-none absolute -inset-px rounded-[14px] border transition-opacity duration-150 ${on ? "opacity-100" : "opacity-0"}`} />
                        <span className="relative grid h-6 w-6 place-items-center">
                          {logo ? <BrandMark logo={logo} lit={on} duration={160} className="h-6 w-6" /> : <Plus className="h-6 w-6 text-fg-3" strokeWidth={1.5} aria-hidden="true" />}
                        </span>
                        <span className="relative text-[0.8125rem] text-fg-2">{t.name}</span>
                        <span
                          aria-hidden="true"
                          className={`absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-brand-500 text-[var(--brand-on)] transition-[opacity,transform] duration-150 ${on ? "scale-100 opacity-100" : "scale-[0.6] opacity-0"}`}
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-3 flex h-[52px] items-center">
                  {a.tools.includes("other") ? (
                    <input
                      ref={otherInput}
                      name="toolsOther"
                      value={a.toolsOther}
                      maxLength={60}
                      autoComplete="off"
                      placeholder={GS.tools.otherPlaceholder}
                      aria-label={GS.tools.otherPlaceholder}
                      onChange={(e) => set({ toolsOther: e.target.value })}
                      className="field h-11"
                    />
                  ) : (
                    // The typed "Which tool?" stays in state while unchecked; it's only sent when checked.
                    <p className={`text-[0.875rem] ${a.tools.length ? "tabular-nums text-fg-2" : "text-fg-3"}`}>{a.tools.length ? fill(GS.tools.selected, a.tools.length) : GS.tools.none}</p>
                  )}
                </div>
              </fieldset>
            </div>

            {/* Step 3: pains */}
            <div data-step="pains" hidden={step !== "pains"}>
              <div className="flex items-start justify-between gap-4">
                {heading("pains", GS.pains.headline)}
                <span key={nudge} className={`tag mt-2 shrink-0 tabular-nums ${nudge ? "animate-[nudge_240ms_ease-in-out] motion-reduce:animate-none" : ""}`}>
                  {fill(GS.pains.counter, a.pains.length)}
                </span>
              </div>
              {line(GS.pains.line)}
              <fieldset className="mt-10">
                <legend className="sr-only">{GS.pains.headline}</legend>
                <div className="flex flex-wrap gap-2">
                  {PAIN_OPTIONS.map((p) => {
                    const on = a.pains.includes(p.key);
                    const full = !on && a.pains.length >= 3;
                    return (
                      <label
                        key={p.key}
                        className={`flex h-11 cursor-pointer items-center gap-1.5 rounded-full border pl-3 pr-4 text-[0.9375rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-400/60 ${
                          on ? "border-brand-400/40 bg-brand-500/10 text-fg" : "border-line bg-ink/[0.03] text-fg-2"
                        } ${full ? "opacity-45" : ""}`}
                      >
                        <input
                          type="checkbox"
                          name="pains"
                          value={p.key}
                          checked={on}
                          aria-disabled={full || undefined}
                          onChange={() => togglePain(p.key)}
                          className="sr-only"
                        />
                        <span className="grid w-3.5 place-items-center" aria-hidden="true">
                          <Check className={`h-3.5 w-3.5 text-brand-300 transition-[opacity,transform] duration-150 ${on ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} strokeWidth={2.5} />
                        </span>
                        {p.label}
                      </label>
                    );
                  })}
                </div>
                <p className={`mt-3 h-5 text-[0.8125rem] text-fg-3 transition-opacity duration-200 ${limitNote ? "opacity-100" : "opacity-0"}`}>{GS.pains.limit}</p>
              </fieldset>
            </div>

            {/* Step 4: you */}
            <div data-step="you" hidden={step !== "you"}>
              {heading("you", GS.you.headline)}
              {line(GS.you.line)}
              <div className="mt-10 grid gap-2.5 sm:grid-cols-2">
                <Field
                  name="name"
                  label={GS.you.name}
                  autoComplete="name"
                  icon={<User />}
                  error={errors.name}
                  value={a.name}
                  onChange={(v) => {
                    set({ name: v });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                />
                <Field
                  name="email"
                  label={GS.you.email}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  icon={<Mail />}
                  error={errors.email}
                  value={a.email}
                  onChange={(v) => {
                    set({ email: v });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                />
              </div>
              <fieldset className="mt-6" aria-invalid={!!errors.role || undefined} aria-describedby={errors.role ? "gs-role-error" : undefined}>
                <legend className="mb-2.5 text-[0.8125rem] text-fg-2">{GS.you.role}</legend>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((r) => {
                    const on = a.role === r.key;
                    return (
                      <label
                        key={r.key}
                        className={`flex h-11 cursor-pointer items-center gap-1.5 rounded-full border pl-3 pr-4 text-[0.9375rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-400/60 ${
                          on ? "border-brand-400/40 bg-brand-500/10 text-fg" : "border-line bg-ink/[0.03] text-fg-2"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.key}
                          checked={on}
                          onChange={() => {
                            set({ role: r.key });
                            if (errors.role) setErrors({ ...errors, role: undefined });
                          }}
                          className="sr-only"
                        />
                        <span className="grid w-3.5 place-items-center" aria-hidden="true">
                          <Check className={`h-3.5 w-3.5 text-brand-300 transition-opacity duration-150 ${on ? "opacity-100" : "opacity-0"}`} strokeWidth={2.5} />
                        </span>
                        {r.label}
                      </label>
                    );
                  })}
                </div>
                {errors.role && (
                  <p id="gs-role-error" className="mt-1.5 pl-1 text-[0.8125rem] text-danger">
                    {errors.role}
                  </p>
                )}
              </fieldset>
            </div>

            {/* Errors and actions */}
            {/* Height reserved; the summary follows the current errors (it clears as they're fixed) */}
            <p role="alert" className="mt-3 min-h-6 text-[0.9375rem] text-danger">
              {errorCount ? (errorCount === 1 ? GS.summary.one : GS.summary.many) : summary && summary !== GS.summary.one && summary !== GS.summary.many ? summary : ""}
            </p>
            <div className="sticky bottom-0 z-10 -mx-4 mt-3 flex items-center justify-between gap-3 border-t border-line bg-bg px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
              {idx > 0 ? (
                <button type="button" onClick={back} className="btn-ghost h-11 max-md:w-11 max-md:justify-center max-md:p-0" aria-label={GS.buttons.back}>
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  <span className="max-md:sr-only">{GS.buttons.back}</span>
                </button>
              ) : null}
              <button type="submit" disabled={pending} className="btn-primary max-md:flex-1 md:ml-auto md:w-auto md:px-7">
                {pending ? (
                  <>
                    {GS.buttons.sending}
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
                      <span className={skipMode ? "invisible" : ""}>{primaryLabel}</span>
                      <span className={skipMode ? "" : "invisible"} aria-hidden={!skipMode}>
                        {GS.buttons.skip}
                      </span>
                    </span>
                    {step === "you" ? <ArrowUpRight className="arrow h-5 w-5" strokeWidth={2.25} aria-hidden="true" /> : <ArrowRight className="arrow h-5 w-5" strokeWidth={2.25} aria-hidden="true" />}
                  </>
                )}
              </button>
            </div>
            {step === "you" && (
              <p className="mt-4 flex items-center gap-2.5 text-[0.9375rem] text-fg-3">
                <Lock className="h-4 w-4 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
                {GS.you.privacy}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Brief card (desktop, sticky beside the questions) */}
      <div className="reveal hidden self-start lg:sticky lg:top-[7rem] lg:col-span-5 lg:block" style={d(360)}>
        <div className="max-w-[26rem]">
          <BriefCard data={brief} />
        </div>
      </div>
    </div>
  );
}
