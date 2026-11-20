"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

type SetupFn = (ctx: {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  root: HTMLElement;
  reduced: boolean;
}) => void;

type Options = {
  enabled: boolean;
  onProgress?: (p: number) => void;
  setup: SetupFn;
};

/** Lenis smooth scroll synced to ScrollTrigger. Disabled when reduced motion. */
export function useFilmScroll({ enabled, onProgress, setup }: Options) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const setupRef = useRef(setup);
  const progressRef = useRef(onProgress);

  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useEffect(() => {
    progressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const content = root.querySelector("[data-film-content]") as HTMLElement | null;
    if (!content) return;

    ScrollTrigger.defaults({ scroller: root });

    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        wrapper: root,
        content,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1.05,
        autoRaf: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    const onScroll = () => {
      const max = root.scrollHeight - root.clientHeight;
      const p = max > 0 ? root.scrollTop / max : 0;
      progressRef.current?.(Math.min(1, Math.max(0, p)));
      const rail =
        root.querySelector<HTMLElement>("[data-progress-fill]") ??
        document.querySelector<HTMLElement>("[data-progress-fill]");
      if (rail) rail.style.transform = `scaleY(${p})`;
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const ctx = gsap.context(() => {
      setupRef.current({ gsap, ScrollTrigger, root, reduced });
    }, root);

    const refresh = () => ScrollTrigger.refresh();

    const onResize = () => refresh();
    const onOrient = () => refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrient);

    void document.fonts?.ready?.then(refresh);

    const imgs = Array.from(root.querySelectorAll("img"));
    let pending = imgs.filter((img) => !img.complete).length;
    if (pending === 0) {
      refresh();
    } else {
      imgs.forEach((img) => {
        if (img.complete) return;
        const done = () => {
          pending -= 1;
          if (pending <= 0) refresh();
        };
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    }

    // After layout settles
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrient);
      root.removeEventListener("scroll", onScroll);
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [enabled, reduced]);

  return { rootRef, reduced };
}
