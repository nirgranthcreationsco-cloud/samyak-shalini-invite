"use client";

import { useEffect, useRef } from "react";
import { usePageVisible, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  gold?: string;
  count?: number;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  kind: "dust" | "petal";
  rot: number;
  rotV: number;
};

export function GoldDustCanvas({ gold = "#C9A227", count = 28 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const visible = usePageVisible();
  const reduced = usePrefersReducedMotion();
  const active = useRef(true);

  useEffect(() => {
    active.current = visible;
  }, [visible]);

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const capped = Math.min(count, 36);
    let parts: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? 390;
      const h = parent?.clientHeight ?? 700;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (): Particle => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const petal = Math.random() > 0.55;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: petal ? 3 + Math.random() * 4 : 0.6 + Math.random() * 1.4,
        vx: -0.15 + Math.random() * 0.3,
        vy: petal ? 0.25 + Math.random() * 0.55 : -0.15 - Math.random() * 0.25,
        a: petal ? 0.25 + Math.random() * 0.35 : 0.2 + Math.random() * 0.45,
        kind: petal ? "petal" : "dust",
        rot: Math.random() * Math.PI,
        rotV: -0.02 + Math.random() * 0.04,
      };
    };

    parts = Array.from({ length: capped }, spawn);
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (!active.current || document.visibilityState !== "visible") return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of parts) {
        p.x += p.vx + Math.sin(p.y * 0.01) * 0.12;
        p.y += p.vy;
        p.rot += p.rotV;
        if (p.kind === "dust" && p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.kind === "petal" && p.y > h + 20) {
          p.y = -10;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.a;
        if (p.kind === "petal") {
          ctx.fillStyle = "#E8A0BF";
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 1.7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = gold;
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [gold, count, reduced]);

  if (reduced) return null;
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[5]"
      aria-hidden="true"
    />
  );
}
