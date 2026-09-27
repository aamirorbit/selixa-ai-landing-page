"use client";

import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements in as they scroll into view. It marks the
 * page first, so without JavaScript everything simply shows.
 *
 * "Shown" is a data attribute, not a class: the demos re-render their classes
 * every frame, and React would wipe a class added from outside.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Showing, or already scrolled past (a fast scroll or an anchor jump can skip it).
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          (e.target as HTMLElement).dataset.shown = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px 8% 0px", threshold: 0 },
    );
    // Anything already on screen (or scrolled past) shows immediately, so the page never blinks.
    const track = (el: HTMLElement) => {
      if (el.hasAttribute("data-shown")) return;
      if (el.getBoundingClientRect().top < window.innerHeight) el.dataset.shown = "";
      else io.observe(el);
    };
    targets.forEach(track);

    // Elements rendered later (a remount, a new route, a hot reload) get the same treatment,
    // otherwise they'd sit hidden with nothing watching them.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        for (const node of r.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches("[data-reveal]")) track(node);
          node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(track);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    root.classList.add("sr-ready");
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
