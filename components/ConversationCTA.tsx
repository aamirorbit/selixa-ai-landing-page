"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { InquiryForm } from "./InquiryForm";

/** Premium call-to-action that opens the inquiry form in a modal dialog. */
export function ConversationCTA({ label = "Start a conversation" }: { label?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();
  // The panel fills the dialog box, so a click that lands on the dialog itself hit the backdrop.
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => e.target === dialog.current && close();

  return (
    <>
      <button type="button" onClick={open} className="btn-premium">
        <span className="relative">{label}</span>
        <span className="chip" aria-hidden="true">
          <ArrowUpRight className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
        </span>
      </button>

      <dialog ref={dialog} onClick={onBackdrop} aria-labelledby="inquiry-title" className="modal">
        <div className="modal-panel">
          <button type="button" onClick={close} aria-label="Close" className="modal-close">
            <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <InquiryForm
            titleId="inquiry-title"
            heading="Start a conversation"
            intro={
              <>
                Tell us what you&rsquo;re building.{" "}
                <strong className="font-medium text-fg">We&rsquo;ll show you where we can make an impact.</strong>
              </>
            }
            submitLabel="Send"
            compact
          />
        </div>
      </dialog>
    </>
  );
}
