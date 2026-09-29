"use client";

import { ConversationCTA } from "@/components/ConversationCTA";
import { ChaosToOrder } from "@/components/site/ChaosToOrder";
import { d } from "./ui";

/**
 * The home page's close: scraps of product work pulled into the orb while "next." settles,
 * then the site CTA, pulsing on the hold. Built on the shared ChaosToOrder (transform-only
 * scraps, no backdrop blur).
 */
export function FinalCTA() {
  return (
    <ChaosToOrder
      // The header tucks away from here down: this closing section and the footer carry the brand.
      hidesNav
      label="stop guessing what to build next."
      word="next."
      lead={
        <>
          stop guessing
          <br />
          <span style={{ color: "var(--chaos-in)" }}>{"what to build "}</span>
        </>
      }
      after={({ done, still }) => (
        <div data-reveal style={d(160)} className="relative mt-14 flex w-full justify-center">
          <ConversationCTA variant="site" label="Get started" className={!still && done ? "cta-live" : ""} />
        </div>
      )}
    />
  );
}
