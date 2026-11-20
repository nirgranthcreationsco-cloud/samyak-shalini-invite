"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { InviteConfig } from "@/types/invite";
import { AmbientSparkles } from "@/components/invite/AmbientSparkles";
import { FallingPetals } from "@/components/invite/FallingPetals";
import { FloralCorners, Ornament } from "@/components/invite/Ornaments";
import {
  GoldLine,
  RevealLetters,
  RevealText,
  ScrollCue,
  StaggerLines,
} from "@/components/invite/RevealText";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  config: InviteConfig;
  guestName?: string;
};

export function OpeningSection({ config, guestName }: Props) {
  const { palette, preset } = config.theme;
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
      style={{
        background: `
          radial-gradient(ellipse at 50% 20%, ${palette.gold}22 0%, transparent 50%),
          linear-gradient(165deg, ${palette.bg} 0%, ${palette.bgAlt} 50%, #1a0c0e 100%)
        `,
        color: palette.surface,
      }}
    >
      <FallingPetals
        count={14}
        colors={[palette.gold, palette.accentSoft, "#F5D0E0", `${palette.gold}99`]}
      />
      <AmbientSparkles color={palette.gold} count={18} />
      <FloralCorners color={palette.gold} />

      {/* Soft light orb */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: palette.gold, opacity: 0.12 }}
        animate={
          reduced
            ? undefined
            : { scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ y: parallaxY, opacity: fadeOut }} className="relative z-10 flex w-full max-w-[340px] flex-col items-center">
        <Ornament
          preset={preset}
          color={palette.gold}
          className="mb-8 w-[min(280px,90%)] opacity-80"
        />

        <StaggerLines
          className="flex flex-col items-center gap-5"
          step={0.4}
          baseDelay={0.2}
          lines={[
            guestName ? (
              <p key="dear" className="text-sm tracking-wide opacity-80">
                Dear {guestName}
              </p>
            ) : (
              <p
                key="eyebrow"
                className="text-[10px] tracking-[0.4em] uppercase opacity-60"
              >
                You are invited
              </p>
            ),
            <p
              key="bless"
              className="max-w-[280px] text-sm leading-relaxed tracking-wide opacity-90"
            >
              {config.blessingLine}
            </p>,
          ]}
        />

        <RevealText delay={1} className="mt-6">
          <p
            className="font-[family-name:var(--font-heading)] text-5xl tracking-wide"
            style={{ color: palette.gold }}
          >
            {config.monogram}
          </p>
        </RevealText>

        <GoldLine color={palette.gold} className="mt-5" delay={1.3} />

        <div className="mt-6 space-y-2">
          <RevealLetters
            text={config.bride.name}
            className="font-[family-name:var(--font-heading)] text-[2.1rem] leading-snug"
            delay={1.4}
            color={palette.surface}
          />
          <RevealText delay={1.9}>
            <p className="text-sm tracking-[0.4em] opacity-55">&</p>
          </RevealText>
          <RevealLetters
            text={config.groom.name}
            className="font-[family-name:var(--font-heading)] text-[2.1rem] leading-snug"
            delay={2.05}
            color={palette.surface}
          />
        </div>

        <RevealText delay={2.5} className="mt-6">
          <p className="text-xs tracking-[0.3em] uppercase opacity-70">
            {config.city}
          </p>
        </RevealText>

        <ScrollCue color={palette.gold} />
      </motion.div>
    </section>
  );
}
