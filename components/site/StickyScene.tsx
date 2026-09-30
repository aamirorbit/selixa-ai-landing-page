"use client";

import { setSceneScrolling } from "@/components/SmoothScroll";
import {
  createContext,
  useContext,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * StickyScene: a section that pins its stage under the nav for a set scroll
 * distance and tells its children how far through they are, 0 → 1.
 *
 *   <StickyScene id="relay" length={3.4} label="one card, six hands.">
 *     <Relay />            // reads progress with the hooks below
 *   </StickyScene>
 *
 * Inside the scene:
 *   useSceneProgress(p => …)   imperative, at most once per frame: write transforms here
 *   useSceneBeat([…])          how many thresholds p has passed; re-renders only on a crossing
 *   useSceneStill()            true when the scene isn't live: render the finished frame
 *   seg(p, a, b), smoothstep(t) helpers for mapping progress to motion
 *
 * Rule of thumb: scrub position (progress → transform), step content (beat → CSS transition).
 *
 * Static by default. The tall, pinned layout only applies when <html data-motion="on">
 * (set before paint in app/layout.tsx unless reduced motion is on) and the section carries
 * data-live (server-rendered; dropped when the stage would be shorter than minStageHeight,
 * e.g. landscape phones). Otherwise the scene reads as a normal section at progress 1.
 *
 * Never put overflow-hidden / overflow-x-hidden on an ancestor: it breaks position: sticky
 * (overflow-x-clip is fine).
 */

type Listener = (p: number) => void;

/** Progress for one scene, shared with its children through context. Mutated only here. */
class SceneStore {
  /** Current progress; always 1 while the scene isn't live. */
  p = 1;
  live = false;
  /** Imperative progress subscribers (useSceneProgress). */
  private frames = new Set<Listener>();
  /** State subscribers (useSceneBeat / useSceneStill via useSyncExternalStore). */
  private changes = new Set<() => void>();

  private emit() {
    for (const f of this.frames) f(this.p);
    for (const c of this.changes) c();
  }
  /** Updates progress; notifies only on a real change (or on reaching 0/1). */
  setProgress(p: number) {
    if (p === this.p) return false;
    if (Math.abs(p - this.p) <= 0.0005 && p !== 0 && p !== 1) return false;
    this.p = p;
    this.emit();
    return true;
  }
  setLive(live: boolean, p: number) {
    this.live = live;
    this.p = live ? p : 1;
    this.emit();
  }
  onFrame(f: Listener) {
    this.frames.add(f);
    f(this.p);
    return () => void this.frames.delete(f);
  }
  onChange(c: () => void) {
    this.changes.add(c);
    return () => void this.changes.delete(c);
  }
}

const SceneContext = createContext<SceneStore | null>(null);

function useStore() {
  const store = useContext(SceneContext);
  if (!store) throw new Error("Scene hooks must be used inside <StickyScene>.");
  return store;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Where p sits inside [a, b], clamped to 0…1. */
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
/** Eases 0…1 in and out. */
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

type Props = {
  id?: string;
  /** Pinned scroll distance, in viewport heights (svh). */
  length: number;
  /** Pin offset: the nav height. */
  top?: string;
  /** Below this stage height (px) the scene falls back to static. */
  minStageHeight?: number;
  /** Below this viewport width (px) the scene falls back to static (e.g. pinned on desktop only). */
  minWidth?: number;
  /** aria-label for the section. */
  label?: string;
  /** Classes on the stage (the pinned element). */
  className?: string;
  /** Classes on the section itself, e.g. to bleed past the page container. */
  sectionClassName?: string;
  children: ReactNode;
};

/** CSS length ("4.5rem" / "72px") → px. */
function toPx(len: string) {
  const n = parseFloat(len);
  if (len.endsWith("rem")) return n * parseFloat(getComputedStyle(document.documentElement).fontSize || "16");
  return Number.isFinite(n) ? n : 72;
}

const motionOn = () => document.documentElement.dataset.motion === "on";

export function StickyScene({ id, length, top = "4.5rem", minStageHeight = 520, minWidth = 0, label, className = "", sectionClassName = "", children }: Props) {
  const [store] = useState(() => new SceneStore());
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // Tall enough to pin? Read at mount and on resize; the server assumes yes, so the
  // pinned height is right from the first paint.
  const tall = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("resize", onChange);
      return () => window.removeEventListener("resize", onChange);
    },
    () => window.innerHeight - toPx(top) >= minStageHeight && window.innerWidth >= minWidth,
    () => true,
  );

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;

    const live = motionOn() && tall;
    if (!live) {
      store.setLive(false, 1);
      return;
    }

    let start = 0;
    let range = 1;
    const measure = () => {
      const topPx = parseFloat(getComputedStyle(stg).top) || 0;
      start = sec.getBoundingClientRect().top + window.scrollY - topPx;
      range = Math.max(1, sec.offsetHeight - stg.offsetHeight);
    };

    const set = (p: number) => {
      if (store.setProgress(p)) stg.style.setProperty("--p", p.toFixed(4));
    };
    const progressNow = () => clamp01((window.scrollY - start) / range);

    // The scene follows the scroll with inertia: it eases toward where the page is (TAU) and
    // never moves faster than MAX_PX of scroll per second, so a fast flick still plays the
    // story at a watchable pace and then catches up. One rAF loop, only while it's behind.
    const TAU = 0.22;
    const MAX_PX = 1500;
    let target = 0;
    let shown = 0;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 1 / 60);
      last = now;
      const gap = target - shown;
      if (Math.abs(gap) < 0.0006) {
        shown = target;
        set(shown);
        raf = 0;
        return;
      }
      let step = gap * (1 - Math.exp(-dt / TAU));
      const cap = (MAX_PX * dt) / range;
      if (Math.abs(step) > cap) step = Math.sign(step) * cap;
      shown += step;
      set(shown);
      raf = requestAnimationFrame(tick);
    };
    // While the stage is actually pinned, the page scrolls heavier (see SmoothScroll).
    let holding = false;
    const hold = (on: boolean) => {
      if (on === holding) return;
      holding = on;
      setSceneScrolling(on);
    };
    const follow = () => {
      target = progressNow();
      hold(target > 0 && target < 1);
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const jump = (p: number) => {
      cancelAnimationFrame(raf);
      raf = 0;
      target = shown = p;
      set(p);
    };
    const compute = follow;

    // Lenis scrolls the real window, so a passive scroll listener sees every smoothed position.
    const onScroll = follow;

    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      stg.dataset.active = "";
      window.addEventListener("scroll", onScroll, { passive: true });
      compute();
    };
    const detach = (above: boolean) => {
      if (!attached) return;
      attached = false;
      delete stg.dataset.active;
      window.removeEventListener("scroll", onScroll);
      hold(false);
      // Once it's off screen, snap to the end it left by: never parked mid-beat.
      jump(above ? 0 : 1);
    };

    // Only listen while the section is near the viewport.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? attach() : detach(e.boundingClientRect.top > 0)),
      { rootMargin: "50% 0px" },
    );
    const ro = new ResizeObserver(() => {
      measure();
      jump(progressNow());
    });

    measure();
    // First frame before paint, wherever the page was loaded or restored to.
    const p0 = progressNow();
    target = shown = p0;
    stg.style.setProperty("--p", p0.toFixed(4));
    store.setLive(true, p0);
    io.observe(sec);
    ro.observe(sec);

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      hold(false);
      delete stg.dataset.active;
      stg.style.removeProperty("--p");
    };
  }, [store, tall]);

  const style = { "--scene-len": length, "--scene-top": top } as CSSProperties;

  return (
    <SceneContext.Provider value={store}>
      <section ref={section} id={id} aria-label={label} className={`scene ${sectionClassName}`} style={style} data-live={tall ? "" : undefined}>
        <div ref={stage} className={`scene-stage ${className}`}>
          {children}
        </div>
      </section>
    </SceneContext.Provider>
  );
}

/**
 * Calls `cb(p)` with the scene's progress: once on mount, then at most once per frame
 * while it changes (and with 1 when the scene goes static). Write styles directly here
 * (transform/opacity only); never set React state per frame.
 */
export function useSceneProgress(cb: (p: number) => void) {
  const store = useStore();
  const onFrame = useEffectEvent((p: number) => cb(p));
  useLayoutEffect(() => store.onFrame((p) => onFrame(p)), [store]);
}

function useSceneState<T>(read: (store: SceneStore) => T, server: T) {
  const store = useStore();
  return useSyncExternalStore(
    (onChange) => store.onChange(onChange),
    () => read(store),
    () => server,
  );
}

/**
 * The number of `thresholds` (ascending) that progress has reached: 0 … thresholds.length.
 * Re-renders only when that number changes. Static scenes sit at the maximum.
 */
export function useSceneBeat(thresholds: number[]): number {
  return useSceneState((s) => {
    if (!s.live) return thresholds.length;
    let n = 0;
    while (n < thresholds.length && s.p >= thresholds[n]) n++;
    return n;
  }, thresholds.length);
}

/** True while the scene is static (server render, reduced motion, short viewport): show the finished frame. */
export function useSceneStill(): boolean {
  return useSceneState((s) => !s.live, true);
}

/**
 * Keeps a measured value (e.g. a track width) in a ref, updated by a ResizeObserver,
 * so scroll callbacks never read layout. Calls `onChange` after each measurement.
 */
export function useMeasure<T extends HTMLElement>(measure: (el: T) => void) {
  const ref = useRef<T>(null);
  const onMeasure = useEffectEvent((el: T) => measure(el));
  // A layout effect, declared before useSceneProgress, so the first frame is placed with real sizes.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onMeasure(el));
    ro.observe(el);
    onMeasure(el);
    return () => ro.disconnect();
  }, []);
  return ref;
}
