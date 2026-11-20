"use client";

import { useEffect, useRef } from "react";
import { usePageVisible, usePrefersReducedMotion } from "@/lib/hooks";

type Mode = "gold-dust" | "marigold" | "none";

type Props = {
  mode: Mode;
  className?: string;
};

type P = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  rot: number;
  rv: number;
};

export function ChapterParticles({ mode, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const visible = usePageVisible();
  const reduced = usePrefersReducedMotion();
  const active = useRef(true);

  useEffect(() => {
    active.current = visible;
  }, [visible]);

  useEffect(() => {
    if (reduced || mode === "none") return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const count = mode === "marigold" ? 14 : 22;
    let parts: P[] = [];

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

    const spawn = (): P => ({
      x: Math.random() * (canvas.clientWidth || 390),
      y: Math.random() * (canvas.clientHeight || 700),
      r: mode === "marigold" ? 3 + Math.random() * 4 : 0.6 + Math.random() * 1.5,
      vx: -0.12 + Math.random() * 0.24,
      vy:
        mode === "marigold"
          ? 0.2 + Math.random() * 0.45
          : -0.12 - Math.random() * 0.22,
      a: 0.2 + Math.random() * 0.4,
      rot: Math.random() * Math.PI,
      rv: -0.015 + Math.random() * 0.03,
    });

    parts = Array.from({ length: count }, spawn);
    resize();
    window.addEventListener("resize", resize);

    const color = mode === "marigold" ? "#E07A1F" : "#D4AF37";

    const draw = () => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (!active.current || document.visibilityState !== "visible") return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx + Math.sin(p.y * 0.012) * 0.1;
        p.y += p.vy;
        p.rot += p.rv;
        if (mode === "gold-dust" && p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        if (mode === "marigold" && p.y > h + 12) {
          p.y = -8;
          p.x = Math.random() * w;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = color;
        ctx.beginPath();
        if (mode === "marigold") ctx.ellipse(0, 0, p.r, p.r * 1.5, 0, 0, Math.PI * 2);
        else ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
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
  }, [mode, reduced]);

  if (reduced || mode === "none") return null;
  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
