"use client";

import { ArrowUpRight, Globe, X } from "lucide-react";
import { useId, useRef, useState, type FormEvent, type MouseEvent } from "react";
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
};

/** "https://www.Acme.com/pricing" → "acme.com". Empty if it doesn't look like a site. */
function toDomain(input: string) {
  const raw = input.trim().toLowerCase();
  if (!raw) return "";
  try {
    const host = new URL(raw.includes("://") ? raw : `https://${raw}`).hostname.replace(/^www\./, "");
    return host.includes(".") ? host : "";
  } catch {
    return "";
  }
}

const TRUST = ["Slack", "Linear", "Notion", "GitHub", "Zoom"].map((n) => LOGOS.find((l) => l.name === n)!);

/** Call-to-action that opens the inquiry form in a modal dialog. */
export function ConversationCTA({ label = "Get started", variant = "premium", className = "" }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [site, setSite] = useState("");
  const [siteError, setSiteError] = useState(false);

  const open = () => {
    dialog.current?.showModal();
    // Start them on the first empty field rather than the close button.
    requestAnimationFrame(() =>
      dialog.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus(),
    );
  };
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
        <button type="button" onClick={open} className="btn-premium">
          <span className="relative">{label}</span>
          <span className="chip" aria-hidden="true">
            <ArrowUpRight className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
          </span>
        </button>
      ) : variant === "link" ? (
        <button type="button" onClick={open} className={className}>
          {label}
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
            <p id={`${titleId}-site-error`} role="alert" className="mt-3 text-[0.875rem] text-red-300/90">
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
          onClick={open}
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
            // A new site means a fresh form carrying it.
            key={site}
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
            defaults={site ? { company: site } : undefined}
            submitLabel="Request access"
            compact
          />
        </div>
      </dialog>
    </>
  );
}
