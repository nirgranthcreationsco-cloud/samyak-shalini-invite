"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  active: boolean;
  gold?: string;
};

/**
 * One-shot gold dust + soft bloom after the envelope dissolves.
 * Pure enhancement — does not block content.
 */
export function EntranceDust({ active, gold = "#C9A227" }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const host = root.querySelector("[data-dust-host]") as HTMLElement | null;
    const bloom = root.querySelector("[data-bloom]") as HTMLElement | null;
    if (!host) return;

    const bits: HTMLSpanElement[] = [];
    const n = 36;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "pointer-events-none absolute block rounded-full";
      const size = 1.5 + Math.random() * 3.5;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.background = i % 4 === 0 ? "#F3DC8A" : gold;
      s.style.left = `${42 + Math.random() * 16}%`;
      s.style.top = `${38 + Math.random() * 18}%`;
      s.style.opacity = "0";
      host.appendChild(s);
      bits.push(s);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        bits.forEach((b) => b.remove());
      },
    });

    if (bloom) {
      tl.fromTo(
        bloom,
        { opacity: 0, scale: 0.7 },
        { opacity: 0.55, scale: 1.15, duration: 0.55, ease: "power2.out" },
        0
      ).to(bloom, { opacity: 0, duration: 0.9, ease: "power1.in" }, 0.45);
    }

    tl.fromTo(
      bits,
      {
        opacity: 0,
        x: 0,
        y: 0,
        scale: 0.4,
      },
      {
        opacity: () => 0.35 + Math.random() * 0.55,
        x: () => (Math.random() - 0.5) * 220,
        y: () => -40 - Math.random() * 160,
        scale: () => 0.6 + Math.random() * 1.2,
        duration: 1.35,
        stagger: 0.012,
        ease: "power2.out",
      },
      0.05
    ).to(
      bits,
      {
        opacity: 0,
        y: "-=40",
        duration: 0.7,
        stagger: 0.008,
        ease: "power1.in",
      },
      0.85
    );

    return () => {
      tl.kill();
      bits.forEach((b) => b.remove());
    };
  }, [active, gold, reduced]);

  if (!active || reduced) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[60] flex justify-center"
      aria-hidden="true"
    >
      <div className="relative h-full w-full max-w-[430px]">
        <div
          data-bloom
          className="absolute left-1/2 top-[42%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${gold}88 0%, transparent 70%)`,
            opacity: 0,
          }}
        />
        <div data-dust-host className="absolute inset-0 overflow-hidden" />
      </div>
    </div>
  );
}
