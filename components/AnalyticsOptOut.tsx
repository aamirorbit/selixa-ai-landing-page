"use client";

import { useEffect, useState } from "react";
import { OPT_OUT_KEY } from "@/lib/track";

/** The /privacy switch: turns Selixa's own analytics off (or back on) for this browser. */
export function AnalyticsOptOut() {
  // null until mounted, so the server render and first paint agree.
  const [state, setState] = useState<"on" | "off" | "signal" | null>(null);

  useEffect(() => {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    let off = false;
    try {
      off = localStorage.getItem(OPT_OUT_KEY) === "1";
    } catch {}
    const t = window.setTimeout(() => setState(nav.globalPrivacyControl || nav.doNotTrack === "1" ? "signal" : off ? "off" : "on"));
    return () => window.clearTimeout(t);
  }, []);

  const toggle = () => {
    const next = state === "on" ? "off" : "on";
    try {
      if (next === "off") localStorage.setItem(OPT_OUT_KEY, "1");
      else localStorage.removeItem(OPT_OUT_KEY);
    } catch {}
    setState(next);
  };

  if (state === null) return <p className="text-fg-3">Checking this browser’s setting…</p>;
  if (state === "signal")
    return <p className="text-fg-2">Your browser sends a Global Privacy Control or Do Not Track signal, so analytics are already off for you.</p>;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <p className="text-fg-2" aria-live="polite">
        Analytics are <strong className="font-medium text-fg">{state === "on" ? "on" : "off"}</strong> in this browser.
      </p>
      <button type="button" onClick={toggle} className="btn-ghost btn-ghost-sm">
        {state === "on" ? "Turn analytics off" : "Turn analytics back on"}
      </button>
    </div>
  );
}
