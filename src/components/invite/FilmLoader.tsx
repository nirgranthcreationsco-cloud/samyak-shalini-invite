"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  monogram: string;
  brideName: string;
  groomName: string;
  invocation?: string;
  dateLine: string;
  gold: string;
  accent: string;
  onDone: () => void;
};

export function FilmLoader({
  monogram,
  brideName,
  groomName,
  invocation,
  dateLine,
  gold,
  accent,
  onDone,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [pct, setPct] = useState(reduced ? 100 : 0);

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(() => onDone(), 200);
      return () => window.clearTimeout(t);
    }

    let frame = 0;
    let raf = 0;
    const start = performance.now();
    const duration = 2400;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setPct(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        frame = window.setTimeout(() => onDone(), 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(frame);
    };
  }, [reduced, onDone]);

  const label =
    pct < 40 ? "Loading the film…" : pct < 90 ? "Almost ready…" : "Ready";

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center px-8 text-center"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, ${accent}55, transparent 55%),
          linear-gradient(180deg, #1a0c0e 0%, #12080a 100%)
        `,
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85 }}
      role="status"
      aria-live="polite"
      aria-busy={pct < 100}
    >
      {invocation && (
        <p
          className="mb-8 font-[family-name:var(--font-noto)] text-sm tracking-wide opacity-80"
          style={{ color: gold }}
        >
          {invocation}
        </p>
      )}

      <p className="text-[10px] tracking-[0.35em] uppercase opacity-50" style={{ color: gold }}>
        Together with our families
      </p>

      <h1
        className="mt-4 font-[family-name:var(--font-heading)] text-4xl leading-tight sm:text-5xl"
        style={{ color: "#F7F0E6" }}
      >
        {brideName}
        <span className="mx-2 text-2xl opacity-60">&</span>
        {groomName}
      </h1>

      <p className="mt-3 font-[family-name:var(--font-heading)] text-2xl" style={{ color: gold }}>
        {monogram}
      </p>

      <div className="mt-10 w-full max-w-[220px]">
        <p className="mb-2 text-[10px] tracking-[0.25em] uppercase opacity-60" style={{ color: gold }}>
          {label}
        </p>
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full origin-left"
            style={{ background: gold, scaleX: pct / 100 }}
          />
        </div>
        <p className="mt-2 text-[11px] tabular-nums opacity-50" style={{ color: gold }}>
          {pct}%
        </p>
      </div>

      <p className="mt-8 text-sm italic opacity-55" style={{ color: "#F7F0E6" }}>
        invite you to celebrate our wedding
      </p>
      <p className="mt-3 text-[10px] tracking-[0.3em] uppercase opacity-45" style={{ color: gold }}>
        {dateLine}
      </p>
    </motion.div>
  );
}
