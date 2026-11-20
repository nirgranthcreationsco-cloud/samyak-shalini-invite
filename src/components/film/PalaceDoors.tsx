"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  show: boolean;
  gold: string;
  accent: string;
  onDone: () => void;
};

export function PalaceDoors({ show, gold, accent, onDone }: Props) {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!show) return;
    if (reduced) {
      onDone();
      return;
    }
    const t1 = window.setTimeout(() => setOpen(true), 400);
    const t2 = window.setTimeout(() => onDone(), 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [show, reduced, onDone]);

  return (
    <AnimatePresence>
      {show && !reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 origin-left"
            style={{
              background: `linear-gradient(90deg, #1a1210 0%, ${accent} 70%, ${gold}44 100%)`,
              boxShadow: `inset -8px 0 24px rgba(0,0,0,0.45)`,
            }}
            initial={{ x: 0 }}
            animate={{ x: open ? "-102%" : 0 }}
            transition={{ duration: 1.35, ease: [0.65, 0, 0.35, 1] }}
          >
            <div
              className="absolute inset-y-[12%] right-6 w-[1px]"
              style={{ background: gold, opacity: 0.55 }}
            />
            <div
              className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border-2"
              style={{ borderColor: `${gold}99` }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 origin-right"
            style={{
              background: `linear-gradient(270deg, #1a1210 0%, ${accent} 70%, ${gold}44 100%)`,
              boxShadow: `inset 8px 0 24px rgba(0,0,0,0.45)`,
            }}
            initial={{ x: 0 }}
            animate={{ x: open ? "102%" : 0 }}
            transition={{ duration: 1.35, ease: [0.65, 0, 0.35, 1] }}
          >
            <div
              className="absolute inset-y-[12%] left-6 w-[1px]"
              style={{ background: gold, opacity: 0.55 }}
            />
            <div
              className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border-2"
              style={{ borderColor: `${gold}99` }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
