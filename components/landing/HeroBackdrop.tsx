"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * The hero's landscape, one per colour scheme. It's pinned under the nav while the
 * headline scrolls up over it, easing in a little closer and dissolving into the page
 * before the next section takes the screen. Both images load lazily and the hidden one
 * is display:none, so only the visible scheme's image is fetched.
 */
export function HeroBackdrop() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const paint = () => {
      raf = 0;
      // 0 at the top of the page, 1 once the page has moved 60% of a screen.
      const t = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
      const fade = t < 0.35 ? 0 : (t - 0.35) / 0.65;
      el.style.opacity = (1 - fade * fade * (3 - 2 * fade)).toFixed(3);
      if (!still) el.style.transform = `scale(${(1 + 0.08 * t).toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // Full-bleed, up under the clear nav, and 60% of a screen taller than the hero:
    // that's how long it stays pinned.
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-[60dvh] -top-[4.5rem] left-1/2 w-screen -translate-x-1/2 select-none">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div ref={stage} className="absolute inset-0 origin-[50%_40%] will-change-transform">
          <div className="hero-bg-dark absolute inset-0">
            <Image src="/hero/dark-bg.png" alt="" fill sizes="100vw" fetchPriority="high" className="object-cover object-center" />
          </div>
          <div className="hero-bg-light absolute inset-0">
            <Image src="/hero/light0-bg.png" alt="" fill sizes="100vw" fetchPriority="high" className="object-cover object-center" />
          </div>
        </div>
        {/* Melts into the page at the bottom edge, and quiets the centre behind the words */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,color-mix(in_srgb,var(--color-bg)_40%,transparent),transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(180deg,transparent,var(--color-bg))]" />
      </div>
    </div>
  );
}
