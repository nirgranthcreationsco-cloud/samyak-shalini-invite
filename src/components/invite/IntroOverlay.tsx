"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { markIntroSeen, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  accent: string;
  gold: string;
  monogram: string;
};

function subscribeIntro() {
  return () => {};
}

function getIntroSnapshot() {
  try {
    return sessionStorage.getItem("wedding-invite-intro-seen") !== "1";
  } catch {
    return false;
  }
}

function getIntroServerSnapshot() {
  return false;
}

export function IntroOverlay({ accent, gold, monogram }: Props) {
  const reduced = usePrefersReducedMotion();
  const shouldOffer = useSyncExternalStore(
    subscribeIntro,
    getIntroSnapshot,
    getIntroServerSnapshot
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduced || !shouldOffer) return;
    let cancelled = false;
    const start = window.setTimeout(() => {
      if (!cancelled) setShow(true);
    }, 0);
    const end = window.setTimeout(() => {
      markIntroSeen();
      if (!cancelled) setShow(false);
    }, 2800);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [reduced, shouldOffer]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 origin-left"
            style={{
              background: `linear-gradient(90deg, ${accent} 0%, ${accent}ee 70%, ${gold}55 100%)`,
            }}
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 1.4, delay: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            <div
              className="absolute inset-y-0 right-0 w-3 opacity-40"
              style={{ background: gold }}
            />
            <div
              className="absolute right-6 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-2 opacity-60"
              style={{ borderColor: gold }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 origin-right"
            style={{
              background: `linear-gradient(270deg, ${accent} 0%, ${accent}ee 70%, ${gold}55 100%)`,
            }}
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.4, delay: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            <div
              className="absolute inset-y-0 left-0 w-3 opacity-40"
              style={{ background: gold }}
            />
            <div
              className="absolute left-6 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-2 opacity-60"
              style={{ borderColor: gold }}
            />
          </motion.div>

          <motion.p
            className="relative z-10 font-[family-name:var(--font-heading)] text-3xl tracking-wide"
            style={{ color: gold }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.05] }}
            transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1] }}
          >
            {monogram}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
