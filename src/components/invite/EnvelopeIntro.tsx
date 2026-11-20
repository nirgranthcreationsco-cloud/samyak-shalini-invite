"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { markIntroSeen, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  brideName: string;
  groomName: string;
  monogram: string;
  accent: string;
  gold: string;
  surface: string;
  onComplete: () => void;
};

function subscribeIntro() {
  return () => {};
}

function getShouldShowIntro() {
  try {
    return sessionStorage.getItem("wedding-invite-intro-seen") !== "1";
  } catch {
    return false;
  }
}

export function EnvelopeIntro({
  brideName,
  groomName,
  monogram,
  accent,
  gold,
  surface,
  onComplete,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const shouldShow = useSyncExternalStore(
    subscribeIntro,
    getShouldShowIntro,
    () => true
  );
  const needsIntro = shouldShow && !reduced;
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const visible = needsIntro && phase !== "done";

  useEffect(() => {
    if (!needsIntro) {
      const id = window.setTimeout(() => onComplete(), 0);
      return () => window.clearTimeout(id);
    }
  }, [needsIntro, onComplete]);

  useEffect(() => {
    if (phase === "done") {
      const id = window.setTimeout(() => onComplete(), 0);
      return () => window.clearTimeout(id);
    }
  }, [phase, onComplete]);

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => {
      markIntroSeen();
      setPhase("done");
    }, 2200);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${accent}cc, #12080a 75%)`,
          }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="pointer-events-none absolute h-64 w-64 rounded-full blur-3xl"
            style={{ background: gold, opacity: 0.18 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative w-full max-w-[320px]">
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{ background: surface, aspectRatio: "3/4" }}
              initial={{ y: 28, opacity: 0, scale: 0.94 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: `linear-gradient(160deg, ${surface} 0%, #efe2d0 50%, ${surface} 100%)`,
                }}
              />

              <motion.div
                className="absolute inset-x-0 top-0 z-20 origin-top"
                style={{
                  height: "42%",
                  background: `linear-gradient(180deg, ${accent} 0%, ${accent}dd 100%)`,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                  transformStyle: "preserve-3d",
                }}
                animate={
                  phase === "opening"
                    ? { rotateX: -155, opacity: 0.7 }
                    : { rotateX: 0, opacity: 1 }
                }
                transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
              />

              <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                <motion.p
                  className="text-[10px] tracking-[0.35em] uppercase"
                  style={{ color: accent }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.35 }}
                >
                  Wedding invitation
                </motion.p>

                <motion.p
                  className="mt-6 font-[family-name:var(--font-heading)] text-4xl"
                  style={{ color: gold }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  {monogram}
                </motion.p>

                <motion.div
                  className="mt-4 space-y-1"
                  style={{ color: accent }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="font-[family-name:var(--font-heading)] text-2xl leading-tight">
                    {brideName}
                  </p>
                  <p className="text-xs tracking-[0.3em] opacity-60">&</p>
                  <p className="font-[family-name:var(--font-heading)] text-2xl leading-tight">
                    {groomName}
                  </p>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={open}
                  disabled={phase !== "closed"}
                  className="mt-10 flex h-16 w-16 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, #e8b84a, ${gold} 45%, #8a6a12)`,
                    boxShadow: `0 0 0 3px ${surface}, 0 8px 28px ${gold}66`,
                    outlineColor: gold,
                  }}
                  whileTap={phase === "closed" ? { scale: 0.92 } : undefined}
                  animate={
                    phase === "closed"
                      ? { scale: [1, 1.07, 1] }
                      : { scale: 0.8, opacity: 0 }
                  }
                  transition={
                    phase === "closed"
                      ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.45 }
                  }
                  aria-label="Open invitation"
                >
                  <span className="font-[family-name:var(--font-heading)] text-xl text-[#2A1518]">
                    {monogram.replace(/\s/g, "").charAt(0) || "S"}
                  </span>
                </motion.button>

                <motion.p
                  className="mt-4 text-[11px] tracking-[0.2em] uppercase"
                  style={{ color: accent }}
                  animate={
                    phase === "closed"
                      ? { opacity: [0.35, 0.9, 0.35] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Tap seal to open
                </motion.p>
              </div>

              <AnimatePresence>
                {phase === "opening" && (
                  <motion.div
                    className="absolute inset-0 z-30"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, ${gold}bb, transparent 70%)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.85, 0] }}
                    transition={{ duration: 1.7 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
