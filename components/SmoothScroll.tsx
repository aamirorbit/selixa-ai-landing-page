"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Smooth, weighted page scrolling (Lenis) — the wheel eases the page toward
 * where you're heading instead of jumping in steps. Touch keeps the native
 * feel, and anyone who prefers reduced motion gets plain scrolling.
 */
/**
 * Pinned scenes (StickyScene) ask for heavier scrolling while they hold the screen: each
 * wheel movement is scaled down and capped, so even a hard flick walks through the story
 * instead of skipping it. A count, because two scenes can overlap briefly at a hand-off.
 */
let heavy = 0;
const HEAVY_SCALE = 0.6;
const HEAVY_MAX = 90; // px per wheel event
export function setSceneScrolling(on: boolean) {
  heavy = Math.max(0, heavy + (on ? 1 : -1));
}

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.075, // lower is silkier; 0.1 is Lenis' default
      // A touch less distance per wheel tick, so hard flicks glide rather than lurch.
      wheelMultiplier: 0.9,
      autoRaf: true,
      // In-page links (#agents, /#integrations) glide there too, clearing the sticky header.
      anchors: { offset: -88 },
      // Pauses while the page is locked (form dialog, phone menu), and lets panels with
      // their own scroll area scroll on their own.
      autoToggle: true,
      allowNestedScroll: true,
      // Wheel only (touch stays native): heavier while a pinned scene holds the screen.
      virtualScroll: (data) => {
        if (heavy > 0 && data.event instanceof WheelEvent) {
          const d = data.deltaY * HEAVY_SCALE;
          data.deltaY = Math.max(-HEAVY_MAX, Math.min(HEAVY_MAX, d));
        }
        return true;
      },
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
