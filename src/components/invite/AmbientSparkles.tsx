"use client";

import { useEffect, useRef } from "react";
import { usePageVisible, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  color?: string;
  count?: number;
  className?: string;
};

export function AmbientSparkles({
  color = "#C9A227",
  count = 20,
  className = "",
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

    type Spark = {
      x: number;
      y: number;
      r: number;
      a: number;
      speed: number;
      phase: number;
    };

    let raf = 0;
    let running = true;
    const capped = Math.min(count, 24);
    let sparks: Spark[] = [];

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

    const spawn = (): Spark => ({
      x: Math.random() * (canvas.clientWidth || 390),
      y: Math.random() * (canvas.clientHeight || 700),
      r: 0.6 + Math.random() * 1.8,
      a: 0.15 + Math.random() * 0.45,
      speed: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    });

    sparks = Array.from({ length: capped }, spawn);
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (!activeRef.current || document.visibilityState !== "visible") return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const s of sparks) {
        s.y -= s.speed;
        s.x += Math.sin(t * 0.001 + s.phase) * 0.15;
        if (s.y < -10) {
          s.y = h + 10;
          s.x = Math.random() * w;
        }
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.003 + s.phase);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = s.a * pulse;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color, count, reduced]);

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
