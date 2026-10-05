"use client";

/**
 * The pre-paint script that applies a saved light/dark choice (and the motion flag).
 *
 * It only needs to run once, from the server HTML, before first paint. It always renders,
 * so the client tree lines up with the server's <head> node for node (rendering nothing
 * on the client let React pair the next <script>, the JSON-LD, with this one). On the
 * client it's typed text/plain, so React doesn't warn about mounting a script it won't
 * run — e.g. when a server-action redirect re-renders the root layout, as the admin login
 * does. suppressHydrationWarning accepts the type difference. This is the pattern in
 * Next's "preventing flash before hydration" guide.
 */
export function SchemeScript({ code }: { code: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
