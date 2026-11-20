"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  /** 0–1 how active this chapter is */
  visibility: number;
  children: ReactNode;
  className?: string;
};

/** Soft mask / translate-up tied to chapter visibility (scroll), not time. */
export function ScrollCopy({ visibility, children, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  const v = Math.min(1, Math.max(0, visibility));

  if (reduced) {
    return (
      <div className={className} style={{ opacity: v > 0.15 ? 1 : 0 }}>
        {children}
      </div>
    );
  }

  const opacity = v < 0.08 ? 0 : v > 0.85 ? Math.max(0, 1 - (v - 0.85) / 0.15) : Math.min(1, (v - 0.08) / 0.25);
  const y = (1 - Math.min(1, Math.max(0, (v - 0.08) / 0.3))) * 28;

  return (
    <div
      className={`will-change-transform ${className}`}
      style={{
        opacity,
        transform: `translate3d(0, ${y}px, 0)`,
        filter: opacity < 0.4 ? `blur(${(1 - opacity) * 4}px)` : "none",
        pointerEvents: opacity > 0.2 ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
}

export function DualHeading({
  regular,
  italic,
  gold,
  className = "",
}: {
  regular: string;
  italic: string;
  gold: string;
  className?: string;
}) {
  return (
    <h2 className={`leading-snug ${className}`}>
      <span className="block text-[11px] tracking-[0.32em] uppercase opacity-55">
        {regular}
      </span>
      <span
        className="mt-2 block font-[family-name:var(--font-heading)] text-3xl italic sm:text-4xl"
        style={{ color: gold }}
      >
        {italic}
      </span>
    </h2>
  );
}

export function ChapterBadge({
  index,
  label,
  gold,
}: {
  index: number;
  label: string;
  gold: string;
}) {
  return (
    <p
      className="mb-4 text-[10px] tracking-[0.35em] uppercase"
      style={{ color: `${gold}bb` }}
    >
      {String(index).padStart(2, "0")} · {label}
    </p>
  );
}

export function ScrollHint({
  show,
  gold,
}: {
  show: boolean;
  gold: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (!show) return null;
  return (
    <motion.div
      className="pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      aria-hidden="true"
    >
      <p
        className="text-[10px] tracking-[0.3em] uppercase"
        style={{ color: `${gold}99` }}
      >
        Scroll to unfold
      </p>
      <motion.div
        className="mx-auto mt-2 h-8 w-5 rounded-full border"
        style={{ borderColor: `${gold}66` }}
        animate={reduced ? undefined : { y: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <motion.div
          className="mx-auto mt-1.5 h-1.5 w-1.5 rounded-full"
          style={{ background: gold }}
          animate={reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}
