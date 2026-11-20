"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  gold: string;
  containerRef: React.RefObject<HTMLElement | null>;
};

export function JourneyProgress({ gold, containerRef }: Props) {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-0 z-50 w-full max-w-[430px] -translate-x-1/2">
      <motion.div
        className="h-[2px] origin-left"
        style={{ scaleX, background: gold, opacity: 0.85 }}
      />
    </div>
  );
}
