"use client";

import { useEffect } from "react";

/**
 * A soft camera move for product screens: each `.window` in the page's main content (outside
 * pinned scenes, which run their own motion) grows from 94% to full size as it rises into
 * view, tied to scroll. Transform only; nothing for reduced motion.
 */
export function ScrollZoom() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("main .window")).filter((el) => !el.closest(".scene"));
    if (!els.length) return;

    const visible = new Set<HTMLElement>();
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of visible) {
        const top = el.getBoundingClientRect().top;
        // 0 as its top enters the bottom of the screen, 1 once it's 55% of the way up.
        const t = Math.min(1, Math.max(0, (vh - top) / (vh * 0.55)));
        const eased = 1 - Math.pow(1 - t, 3);
        el.style.transform = `scale(${(0.94 + 0.06 * eased).toFixed(4)})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) visible.add(el);
          else {
            visible.delete(el);
            // Parked where it would be, so it never jumps on the way back in.
            el.style.transform = e.boundingClientRect.top > 0 ? "scale(0.94)" : "";
          }
        }
        onScroll();
      },
      { rootMargin: "10% 0px" },
    );
    els.forEach((el) => {
      el.style.transformOrigin = "50% 0%";
      el.style.willChange = "transform";
      io.observe(el);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      els.forEach((el) => {
        el.style.transform = el.style.transformOrigin = el.style.willChange = "";
      });
    };
  }, []);

  return null;
}
