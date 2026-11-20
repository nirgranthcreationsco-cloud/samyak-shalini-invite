"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  active: boolean;
  gold: string;
};

export function LotusBloom({ active, gold }: Props) {
  const reduced = usePrefersReducedMotion();
  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[18%] z-[6] -translate-x-1/2"
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 120 120"
        width="72"
        height="72"
        initial={reduced ? false : { scale: 0.35, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.85 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
          <motion.ellipse
            key={deg}
            cx="60"
            cy="48"
            rx="10"
            ry="28"
            fill={gold}
            opacity={0.35 + (i % 3) * 0.08}
            transform={`rotate(${deg} 60 70)`}
            initial={reduced ? false : { scaleY: 0.2 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.4, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "60px 70px" }}
          />
        ))}
        <circle cx="60" cy="70" r="8" fill={gold} opacity="0.9" />
        <circle cx="60" cy="70" r="3.5" fill="#F5E6C8" opacity="0.85" />
      </motion.svg>
    </div>
  );
}
