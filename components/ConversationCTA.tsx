"use client";

import { ArrowUpRight, Globe, X } from "lucide-react";
import { useId, useImperativeHandle, useRef, useState, type FormEvent, type MouseEvent, type ReactNode, type Ref } from "react";
import type { FieldName } from "@/app/actions";
import { toDomain } from "@/lib/site";
import { InquiryForm } from "./InquiryForm";
import { BrandMark } from "./landing/BrandMark";
import { LOGOS } from "./landing/logos";

type Props = {
  label?: string;
  /**
   * "premium" is the pill with the lit chip; "compact" is the small nav button;
   * "link" is plain text; "site" asks for the product's website first.
   */
  variant?: "premium" | "compact" | "link" | "site";
  className?: string;
  /** Starting values for the form, e.g. { problem: "Integration request: " }. */
  defaults?: Partial<Record<FieldName, string>>;
  /** Field to focus on open (caret at the end). Default: the name field. */
  focus?: FieldName;
  /** "link" variant: custom button content instead of the label. */
  children?: ReactNode;
  /** Open the form from code, optionally with other defaults (e.g. a search query). */
  ref?: Ref<ConversationCTAHandle>;
};

export type ConversationCTAHandle = { open: (defaults?: Partial<Record<FieldName, string>>) => void };

const TRUST = ["Slack", "Linear", "Notion", "GitHub", "Zoom"].map((n) => LOGOS.find((l) => l.name === n)!);

/** Call-to-action that opens the inquiry form in a modal dialog. */
export function ConversationCTA({ label = "Get started", variant = "premium", className = "", defaults, focus = "name", children, ref }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [site, setSite] = useState("");
  const [siteError, setSiteError] = useState(false);
  // Defaults passed at open time (e.g. a search query) override the prop's.
  const [opened, setOpened] = useState<Partial<Record<FieldName, string>> | undefined>(undefined);
  const formDefaults = { ...defaults, ...opened, ...(site ? { company: site } : null) };
  const hasDefaults = Object.keys(formDefaults).length > 0;

  const open = (extra?: Partial<Record<FieldName, string>>) => {
    if (extra) setOpened(extra);
    dialog.current?.showModal();
    // Start them on the chosen field (the first empty one by default) rather than the close button,
    // with the caret after any prefilled text.
    requestAnimationFrame(() => {
      const el = dialog.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${focus}"]`);
      if (!el) return;
      el.focus();
      try {
        el.setSelectionRange(el.value.length, el.value.length);
      } catch {
        // Some input types (email) don't support selection; focus is enough.
      }
    });
  };
  useImperativeHandle(ref, () => ({ open }));
  const close = () => dialog.current?.close();
  // The panel fills the dialog box, so a click that lands on the dialog itself hit the backdrop.
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => e.target === dialog.current && close();

  const onSite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const typed = String(new FormData(e.currentTarget).get("site") ?? "");
    const domain = toDomain(typed);
    if (typed.trim() && !domain) {
      setSiteError(true);
      return;
    }
    setSiteError(false);
    setSite(domain);
    open();
  };

  return (
    <>
      {variant === "premium" ? (
        <button type="button" onClick={() => open()} className="btn-premium">
          <span className="relative">{label}</span>
          <span className="chip" aria-hidden="true">
            <ArrowUpRight className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
          </span>
        </button>
      ) : variant === "link" ? (
        <button type="button" onClick={() => open()} className={className}>
          {children ?? label}
        </button>
      ) : variant === "site" ? (
        <div className={`flex w-full max-w-[34rem] flex-col items-center ${className}`}>
          <form onSubmit={onSite} noValidate className="site-cta w-full" data-error={siteError}>
            <Globe className="ml-5 h-5 w-5 shrink-0 text-fg-3" strokeWidth={1.6} aria-hidden="true" />
            <label htmlFor={`${titleId}-site`} className="sr-only">
              Your product&rsquo;s website
            </label>
            <input
              id={`${titleId}-site`}
              name="site"
              type="text"
              inputMode="url"
              autoComplete="url"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Enter your product’s website"
              aria-invalid={siteError || undefined}
              aria-describedby={siteError ? `${titleId}-site-error` : undefined}
              onChange={() => siteError && setSiteError(false)}
              className="min-w-0 flex-1 bg-transparent px-3 text-[1.0625rem] text-fg outline-none placeholder:text-fg-3"
            />
            {/* Just the lit round chip; the label is for screen readers */}
            <button type="submit" aria-label={label} title={label} className="site-cta-go">
              <ArrowUpRight className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
            </button>
          </form>
          {siteError ? (
            <p id={`${titleId}-site-error`} role="alert" className="mt-3 text-[0.875rem] text-danger">
              That doesn&rsquo;t look like a website. Try something like acme.com.
            </p>
          ) : (
            <p className="mt-4 flex items-center gap-3 text-[0.875rem] text-fg-3">
              <span className="flex -space-x-1.5" aria-hidden="true">
                {TRUST.map((logo) => (
                  <span
                    key={logo.name}
                    className="grid h-7 w-7 place-items-center rounded-full border-2 border-bg bg-panel-2"
                  >
                    <BrandMark logo={logo} lit className="h-3.5 w-3.5" />
                  </span>
                ))}
              </span>
              <span>
                Works with <span className="text-fg-2">Slack, Linear, Notion</span> and the tools you already use
              </span>
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => open()}
          className="inline-flex items-center rounded-full bg-[linear-gradient(180deg,var(--brand-cta),var(--brand-cta-2))] px-[1.125rem] py-2.5 text-[0.875rem] font-medium leading-none text-[var(--brand-on)] transition-[filter] duration-200 hover:brightness-110"
        >
          {label}
        </button>
      )}

      <dialog ref={dialog} onClick={onBackdrop} aria-labelledby={titleId} className="modal">
        <div className="modal-panel">
          <button type="button" onClick={close} aria-label="Close" className="modal-close">
            <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <InquiryForm
            // New starting values (a site, a query) mean a fresh form carrying them. The same
            // values keep the same form, so anything typed survives closing and reopening.
            key={JSON.stringify(formDefaults)}
            titleId={titleId}
            heading={site ? `Let’s get Selixa learning ${site}` : "Get started with Selixa"}
            intro={
              site ? (
                <>
                  A few details and{" "}
                  <strong className="font-medium text-fg">we&rsquo;ll set up your AI Product Manager on it.</strong>
                </>
              ) : (
                <>
                  Tell us what you&rsquo;re building.{" "}
                  <strong className="font-medium text-fg">We&rsquo;ll set you up with your AI Product Manager.</strong>
                </>
              )
            }
            defaults={hasDefaults ? formDefaults : undefined}
            submitLabel="Request access"
            compact
          />
        </div>
      </dialog>
    </>
  );
}
