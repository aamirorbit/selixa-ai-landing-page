/*
 * The browser half of Selixa's first-party analytics (server half: lib/analytics.ts).
 * No cookies, no identifiers in storage, nothing typed into a field is ever read.
 * Sends: page views, clicks (what was clicked and where on the page), scroll depth and
 * engaged time when a page is left, and funnel steps / conversions via track().
 * Off when the visitor opted out on /privacy, sends Global Privacy Control or Do Not Track,
 * on /admin, and inside an iframe (the admin click map embeds pages).
 */

const ENDPOINT = "/api/e";
export const OPT_OUT_KEY = "selixa.analytics.optout";

type Fields = { l?: string; h?: string; x?: number; y?: number; vw?: number; n?: number; ms?: number; r?: string; us?: string; um?: string; uc?: string };
type Event = Fields & { t: "pageview" | "click" | "leave" | "step" | "convert"; p: string };

export function trackingAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (window.top !== window.self) return false;
  if (location.pathname.startsWith("/admin")) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl || nav.doNotTrack === "1") return false;
  try {
    if (localStorage.getItem(OPT_OUT_KEY) === "1") return false;
  } catch {}
  return true;
}

let queue: Event[] = [];
let timer: number | undefined;

function flush() {
  window.clearTimeout(timer);
  timer = undefined;
  if (!queue.length) return;
  const body = JSON.stringify({ e: queue });
  queue = [];
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "text/plain" }))) return;
  } catch {}
  fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "content-type": "text/plain" } }).catch(() => {});
}

function push(e: Event, now = false) {
  queue.push(e);
  if (now || queue.length >= 20) return flush();
  timer ??= window.setTimeout(flush, 2000);
}

let lastStep = "";

/** Records a funnel step or conversion, e.g. track("step", "tools") or track("convert", "inquiry"). */
export function track(type: "step" | "convert", name: string) {
  if (!trackingAllowed()) return;
  // Effects can fire twice for one step (dev Strict Mode, restored state); count it once.
  const key = `${type}:${location.pathname}:${name}`;
  if (key === lastStep) return;
  lastStep = key;
  push({ t: type, p: location.pathname, l: name.slice(0, 120) }, type === "convert");
}

const host = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/** What a click landed on, in words. Never reads an input's value. */
function describeTarget(target: Element): { l: string; h: string } {
  const field = target.closest("input, textarea, select");
  if (field) {
    const type = field.getAttribute("type");
    if (type === "checkbox" || type === "radio") {
      const text = field.closest("label")?.textContent ?? field.getAttribute("aria-label") ?? field.getAttribute("value") ?? "";
      return { l: clean(text) || `${type}: ${field.getAttribute("name") ?? ""}`, h: "" };
    }
    return { l: `Field: ${field.getAttribute("name") || field.getAttribute("aria-label") || type || field.tagName.toLowerCase()}`, h: "" };
  }
  const el = target.closest("a, button, [role='button'], summary, label, [data-track]");
  if (!el) return { l: "", h: "" };
  // innerText skips hidden text (e.g. a "Skip" label swapped in with CSS).
  const text = el instanceof HTMLElement ? el.innerText : (el.textContent ?? "");
  const l = el.getAttribute("data-track") || el.getAttribute("aria-label") || clean(text);
  let h = "";
  const href = el instanceof HTMLAnchorElement ? el.href : "";
  if (href) {
    const url = new URL(href, location.href);
    if (url.protocol === "mailto:" || url.protocol === "tel:") h = url.protocol.slice(0, -1);
    else if (url.host === location.host) h = url.pathname + url.hash;
    else h = url.host.replace(/^www\./, "");
  }
  return { l, h };
}

// Drop anything that looks like an email address, collapse whitespace.
const clean = (s: string) => s.replace(/\S+@\S+/g, "").replace(/\s+/g, " ").trim().slice(0, 80);

let started = false;

export function startTracking() {
  if (started || !trackingAllowed()) return;
  started = true;

  let path = location.pathname;
  let maxScroll = 0;
  let engaged = 0;
  let visibleSince: number | null = document.visibilityState === "visible" ? performance.now() : null;

  const scrollDepth = () => {
    const doc = document.documentElement;
    const h = Math.max(doc.scrollHeight, 1);
    return Math.min(100, Math.round(((window.scrollY + window.innerHeight) / h) * 100));
  };

  const pageview = (first: boolean) => {
    maxScroll = scrollDepth();
    const e: Event = { t: "pageview", p: path, vw: window.innerWidth };
    if (first) {
      const ref = document.referrer ? host(document.referrer) : "";
      if (ref && ref !== location.host.replace(/^www\./, "")) e.r = ref;
      const q = new URLSearchParams(location.search);
      e.us = q.get("utm_source") ?? q.get("ref") ?? undefined;
      e.um = q.get("utm_medium") ?? undefined;
      e.uc = q.get("utm_campaign") ?? undefined;
    }
    push(e, true);
  };

  // Engaged time since the last report; called when the page is hidden or left.
  const leave = () => {
    if (visibleSince !== null) {
      engaged += performance.now() - visibleSince;
      visibleSince = document.visibilityState === "visible" ? performance.now() : null;
    }
    if (engaged < 500 && maxScroll === 0) return;
    push({ t: "leave", p: path, n: maxScroll, ms: Math.round(engaged) }, true);
    engaged = 0;
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        maxScroll = Math.max(maxScroll, scrollDepth());
        ticking = false;
      });
    },
    { passive: true },
  );

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") leave();
    else visibleSince = performance.now();
  });

  document.addEventListener(
    "click",
    (ev) => {
      if (!(ev.target instanceof Element) || !trackingAllowed()) return;
      const { l, h } = describeTarget(ev.target);
      push({ t: "click", p: path, l, h, x: ev.clientX / window.innerWidth, y: ev.pageY, vw: window.innerWidth }, Boolean(h));
    },
    { capture: true, passive: true },
  );

  // Client-side navigations: a new pathname is a new page (query-only changes like ?step= aren't).
  const onUrlChange = () => {
    if (location.pathname === path) return;
    leave();
    path = location.pathname;
    visibleSince = document.visibilityState === "visible" ? performance.now() : null;
    engaged = 0;
    if (trackingAllowed()) pageview(false);
  };
  for (const method of ["pushState", "replaceState"] as const) {
    const original = history[method];
    history[method] = function (this: History, ...args: Parameters<History["pushState"]>) {
      const result = original.apply(this, args);
      window.setTimeout(onUrlChange);
      return result;
    };
  }
  window.addEventListener("popstate", () => window.setTimeout(onUrlChange));

  pageview(true);
}
