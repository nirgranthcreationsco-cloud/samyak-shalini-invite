"use client";

import { motion } from "framer-motion";

type Props = {
  monogram: string;
  progress: number;
  gold: string;
  onSkip: () => void;
  visible: boolean;
};

export function FilmPreloader({
  monogram,
  progress,
  gold,
  onSkip,
  visible,
}: Props) {
  const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center px-8 text-center"
      style={{ background: "#F7F1E6", color: "#2A1A14" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      aria-busy={pct < 100}
    >
      <p className="type-name foil-text">{monogram}</p>

      <p className="type-label mt-10 opacity-80" style={{ color: "#8A6A1F" }}>
        Preparing your journey…
      </p>

      <div className="mt-5 w-full max-w-[200px]">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-[#2A1A14]/10">
          <div
            className="h-full origin-left transition-[transform] duration-150 ease-out"
            style={{
              background: gold,
              transform: `scaleX(${pct / 100})`,
            }}
          />
        </div>
        <p className="type-label mt-2 tabular-nums opacity-70" style={{ color: "#8A6A1F" }}>
          {pct}%
        </p>
      </div>

      <a
        href="#celebrations"
        onClick={(e) => {
          e.preventDefault();
          onSkip();
        }}
        className="type-label absolute bottom-8 left-1/2 min-h-11 -translate-x-1/2 px-3 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: "#8A6A1F", outlineColor: gold }}
      >
        Skip the film to wedding details
      </a>
    </motion.div>
  );
}
