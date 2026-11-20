"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { ThemeSymbol } from "@/types/invite";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  symbol: ThemeSymbol;
  color: string;
  containerRef?: React.RefObject<HTMLElement | null>;
};

function Lotus({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none" aria-hidden="true">
      <path
        d="M32 52 C28 40 16 36 12 28 C20 28 28 32 32 40 C36 32 44 28 52 28 C48 36 36 40 32 52 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M32 48 C30 36 22 28 22 18 C28 22 32 30 32 38 C32 30 36 22 42 18 C42 28 34 36 32 48 Z"
        fill={color}
        opacity="0.95"
      />
      <path
        d="M32 44 C26 34 14 32 10 22 C18 24 26 30 32 38 C38 30 46 24 54 22 C50 32 38 34 32 44 Z"
        fill={color}
        opacity="0.55"
      />
      <circle cx="32" cy="28" r="3" fill={color} />
    </svg>
  );
}

function Rose({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none" aria-hidden="true">
      <path
        d="M32 14 C40 14 46 22 44 30 C50 32 52 40 46 46 C42 54 32 56 32 56 C32 56 22 54 18 46 C12 40 14 32 20 30 C18 22 24 14 32 14 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M32 24 C36 24 38 28 36 32 C38 34 36 38 32 38 C28 38 26 34 28 32 C26 28 28 24 32 24 Z"
        fill={color}
      />
      <path d="M32 38 L32 54" stroke={color} strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

function Marigold({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" width="36" height="36" fill="none" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x = 32 + Math.cos(a) * 14;
        const y = 32 + Math.sin(a) * 14;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="6"
            ry="10"
            fill={color}
            opacity="0.7"
            transform={`rotate(${i * 30} ${x} ${y})`}
          />
        );
      })}
      <circle cx="32" cy="32" r="8" fill={color} />
      <circle cx="32" cy="32" r="4" fill="#F5E6C8" opacity="0.8" />
    </svg>
  );
}

export function FloatingSymbol({ symbol, color, containerRef }: Props) {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef } : undefined
  );
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [0, 14, -10]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.35, 0.55, 0.55, 0.25]);

  const icon =
    symbol === "rose" ? (
      <Rose color={color} />
    ) : symbol === "marigold" ? (
      <Marigold color={color} />
    ) : (
      <Lotus color={color} />
    );

  return (
    <motion.div
      className="pointer-events-none fixed right-3 top-[16%] z-40 md:right-[calc(50%-200px)]"
      style={reduced ? { opacity: 0.4 } : { y, x, rotate, opacity }}
      aria-hidden="true"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {icon}
      </motion.div>
    </motion.div>
  );
}
