"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { InviteConfig } from "@/types/invite";
import { CoupleIllustration } from "@/components/invite/CoupleIllustration";
import { Ornament } from "@/components/invite/Ornaments";
import { RevealText, StaggerLines } from "@/components/invite/RevealText";
import { ScratchCard } from "@/components/invite/ScratchCard";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  config: InviteConfig;
};

export function InvitationSection({ config }: Props) {
  const { palette, preset } = config.theme;
  const dates = config.events.map((e) => e.date);
  const firstEvent = config.events[0];
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const coupleY = useTransform(scrollYProgress, [0.2, 0.8], [reduced ? 0 : 30, reduced ? 0 : -20]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 py-14 text-center"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, ${palette.gold}18 0%, transparent 45%),
          linear-gradient(180deg, ${palette.surface} 0%, #f3e8d8 55%, ${palette.surface} 100%)
        `,
        color: palette.text,
      }}
    >
      {/* Decorative side glow */}
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-56 w-56 rounded-full blur-3xl"
        style={{ background: palette.accentSoft, opacity: 0.2 }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 h-56 w-56 rounded-full blur-3xl"
        style={{ background: palette.gold, opacity: 0.15 }}
      />

      <Ornament
        preset={preset}
        color={palette.accent}
        className="mb-5 w-[min(260px,80%)]"
      />

      <StaggerLines
        className="flex max-w-[340px] flex-col items-center gap-3"
        step={0.4}
        lines={[
          <p
            key="eyebrow"
            className="text-[10px] tracking-[0.35em] uppercase opacity-50"
          >
            The invitation
          </p>,
          <p key="inv" className="text-sm leading-relaxed opacity-80">
            {config.invitationLine}
          </p>,
          <div key="couple" className="space-y-2 pt-3">
            <p className="font-[family-name:var(--font-heading)] text-3xl">
              {config.bride.name}
            </p>
            <p className="text-xs opacity-55">Daughter of {config.brideParents}</p>
            <p className="py-1 text-sm tracking-[0.35em] opacity-40">&</p>
            <p className="font-[family-name:var(--font-heading)] text-3xl">
              {config.groom.name}
            </p>
            <p className="text-xs opacity-55">Son of {config.groomParents}</p>
          </div>,
        ]}
      />

      {firstEvent && (
        <RevealText delay={1.1} className="mt-2">
          <motion.div style={{ y: coupleY }}>
            <CoupleIllustration
              brideOutfit={firstEvent.brideOutfit}
              groomOutfit={firstEvent.groomOutfit}
              size={200}
            />
          </motion.div>
        </RevealText>
      )}

      <RevealText delay={1.35} className="mt-4 flex w-full justify-center">
        <ScratchCard dates={dates} gold={palette.gold} />
      </RevealText>
    </section>
  );
}
