"use client";

import { ArrowUpRight, Briefcase, Check, CircleHelp, Loader2, Lock, Mail, Pencil, User } from "lucide-react";
import { useActionState, useEffect, useId, useRef, type ReactNode } from "react";
import { submitInquiry, type FieldName, type InquiryState } from "@/app/actions";

const initial: InquiryState = { status: "idle" };

type InquiryFormProps = {
  titleId: string;
  heading: string;
  intro: ReactNode;
  submitLabel?: string;
  compact?: boolean;
};

export function InquiryForm({ titleId, heading, intro, submitLabel = "Send", compact }: InquiryFormProps) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.status === "error" ? (state.fields ?? {}) : {};
  // React resets a form after its action completes; feeding the submitted values back in as
  // defaults keeps everything the person typed when validation fails.
  const values = state.status === "error" ? state.values : undefined;

  useEffect(() => {
    if (state.status !== "error") return;
    const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    first?.focus({ preventScroll: false });
  }, [state]);

  if (state.status === "success") return <Success name={state.name} titleId={titleId} compact={compact} />;

  return (
    <>
      <h2 id={titleId} className="relative text-[1.625rem] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[1.75rem]">
        {heading}
      </h2>
      <p className="relative mt-3 text-[1.0625rem] leading-[1.55] text-fg-2 sm:text-[1.125rem]">{intro}</p>

      <form ref={formRef} action={action} noValidate className="relative mt-5 flex flex-col gap-2.5">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field name="name" label="Full Name" autoComplete="name" icon={<User />} error={errors.name} defaultValue={values?.name} />
          <Field
            name="email"
            label="Work Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            icon={<Mail />}
            error={errors.email}
            defaultValue={values?.email}
          />
        </div>
        <Field
          name="company"
          label="Company / Project"
          autoComplete="organization"
          icon={<Briefcase />}
          error={errors.company}
          defaultValue={values?.company}
        />
        <Field
          name="building"
          label="What are you building?"
          multiline
          rows={2}
          icon={<Pencil />}
          error={errors.building}
          defaultValue={values?.building}
        />
        <Field
          name="problem"
          label="What problem are you trying to solve?"
          multiline
          rows={1}
          icon={<CircleHelp />}
          error={errors.problem}
          defaultValue={values?.problem}
        />

        {/* Honeypot, invisible to people */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {state.status === "error" && (
          <p role="alert" className="text-[0.9375rem] leading-snug text-red-300/90">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary mt-1">
          {pending ? (
            <>
              Sending
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            </>
          ) : (
            <>
              {submitLabel}
              <ArrowUpRight className="arrow h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <p className="relative mt-4 flex items-center justify-center gap-2.5 text-[0.9375rem] text-fg-3">
        <Lock className="h-4 w-4 text-brand-400" strokeWidth={1.75} aria-hidden="true" />
        We respect your privacy. No spam. Ever.
      </p>
    </>
  );
}

type FieldProps = {
  name: FieldName;
  label: string;
  icon: ReactNode;
  error?: string;
  defaultValue?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  autoComplete?: string;
  inputMode?: "email" | "text";
};

function Field({ name, label, icon, error, defaultValue, multiline, rows = 3, type = "text", autoComplete, inputMode }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    defaultValue,
    placeholder: label,
    "aria-label": label,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: "field peer",
  };

  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={rows} />
        ) : (
          <input {...shared} type={type} autoComplete={autoComplete} inputMode={inputMode} />
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[0.9375rem] top-[0.9375rem] text-brand-400 transition-colors duration-200 peer-focus:text-brand-300 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:stroke-[1.75]"
        >
          {icon}
        </span>
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 pl-1 text-[0.8125rem] leading-snug text-red-300/90">
          {error}
        </p>
      )}
    </div>
  );
}

function Success({ name, titleId, compact }: { name: string; titleId: string; compact?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center justify-center text-center ${compact ? "min-h-[22rem]" : "min-h-[32rem]"}`}>
      <span className="grid h-16 w-16 place-items-center rounded-full border border-brand-500/40 bg-brand-500/10 text-brand-300 shadow-[0_0_40px_-6px_rgb(var(--brand-500-rgb)/0.6)]">
        <Check className="h-7 w-7" strokeWidth={2} aria-hidden="true" />
      </span>
      <h2 id={titleId} className="mt-7 text-[1.75rem] font-medium tracking-[-0.02em]">
        Thanks, {name}.
      </h2>
      <p className="mt-3 max-w-[24rem] text-[1.0625rem] leading-[1.6] text-fg-2">
        Your note is with the team. If there&rsquo;s a fit, you&rsquo;ll hear from us within two business days.
      </p>
    </div>
  );
}
