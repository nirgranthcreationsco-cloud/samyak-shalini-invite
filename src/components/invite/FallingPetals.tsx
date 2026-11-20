"use client";

import { useEffect, useRef } from "react";
import { usePageVisible, usePrefersReducedMotion } from "@/lib/hooks";

type Petal = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  rot: number;
  rotSpeed: number;
  opacity: number;
  color: string;
};

type Props = {
  colors?: string[];
  count?: number;
  className?: string;
  burst?: boolean;
  burstDurationMs?: number;
  origin?: "full" | "top" | "card";
};

export function FallingPetals({
  colors = ["#E8A0BF", "#F2C4C4", "#C9A227", "#F5D0E0"],
  count = 18,
  className = "",
  burst = false,
  burstDurationMs = 3000,
  origin = "full",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visible = usePageVisible();
  const reduced = usePrefersReducedMotion();
  const activeRef = useRef(true);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let petals: Petal[] = [];
    let running = true;
    const burstEndsAt = burst ? performance.now() + burstDurationMs : Infinity;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (partial = false): Petal => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      let y = -10 - Math.random() * 40;
      if (origin === "card" && partial) {
        y = h * 0.35 + Math.random() * 40;
      } else if (origin === "top") {
        y = -10 - Math.random() * 20;
      }
      return {
        x: Math.random() * w,
        y,
        r: 3 + Math.random() * 5,
        speed: 0.4 + Math.random() * 1.1,
        drift: -0.4 + Math.random() * 0.8,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: -0.02 + Math.random() * 0.04,
        opacity: 0.35 + Math.random() * 0.45,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const capped = Math.min(count, 28);
    petals = Array.from({ length: capped }, () => spawn(true));
    resize();
    window.addEventListener("resize", resize);

    const draw = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (!activeRef.current || document.visibilityState !== "visible") return;
      if (burst && now > burstEndsAt) {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        return;
      }

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of petals) {
        p.y += p.speed;
        p.x += p.drift + Math.sin(p.y * 0.02) * 0.3;
        p.rot += p.rotSpeed;
        if (p.y > h + 20) {
          if (burst && now > burstEndsAt - 500) {
            p.opacity = Math.max(0, p.opacity - 0.02);
          } else {
            Object.assign(p, spawn());
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [colors, count, burst, burstDurationMs, origin, reduced]);

  useEffect(() => {
    activeRef.current = visible;
  }, [visible]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
