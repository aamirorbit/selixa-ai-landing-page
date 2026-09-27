"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * The pre-paint script that applies a saved light/dark choice (and the motion flag).
 *
 * It only needs to run once, from the server HTML, before first paint. Rendered through
 * React on the client — e.g. when a server-action redirect re-renders the root layout, as
 * the admin login does — React warns that scripts it mounts never execute. So it renders
 * during SSR and hydration (matching the server HTML), and never mounts on the client.
 */
export function SchemeScript({ code }: { code: string }) {
  // false on the server and while hydrating; true for any render that starts in the browser.
  const inBrowser = useSyncExternalStore(noop, () => true, () => false);
  if (inBrowser) return null;
  // Browser extensions inject their own <script> tags into <head> before React loads, so
  // React may pair this one with theirs; its job is done by then, so skip the comparison.
  return <script dangerouslySetInnerHTML={{ __html: code }} suppressHydrationWarning />;
}
