"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Smooth, weighted page scrolling (Lenis) — the wheel eases the page toward
 * where you're heading instead of jumping in steps. Touch keeps the native
 * feel, and anyone who prefers reduced motion gets plain scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085, // lower is silkier; 0.1 is Lenis' default
      autoRaf: true,
      // In-page links (#agents, /#integrations) glide there too, clearing the sticky header.
      anchors: { offset: -88 },
      // Pauses while the page is locked (form dialog, phone menu), and lets panels with
      // their own scroll area scroll on their own.
      autoToggle: true,
      allowNestedScroll: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
