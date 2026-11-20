"use client";

import { motion } from "framer-motion";
import type { InviteConfig } from "@/types/invite";
import { AmbientSparkles } from "@/components/invite/AmbientSparkles";
import { BlessingsCard } from "@/components/invite/BlessingsCard";
import { Ornament } from "@/components/invite/Ornaments";
import { GoldLine, RevealText, StaggerLines } from "@/components/invite/RevealText";
import { RsvpBlock } from "@/components/invite/RsvpBlock";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  config: InviteConfig;
  guestName?: string;
};

export function ClosingSection({ config, guestName }: Props) {
  const { palette, preset } = config.theme;
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-start overflow-hidden px-5 py-14 text-center"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, ${palette.gold}20 0%, transparent 40%),
          linear-gradient(180deg, ${palette.surface} 0%, #f0e2d0 40%, ${palette.surface} 100%)
        `,
        color: palette.text,
      }}
    >
      <AmbientSparkles color={palette.gold} count={12} className="opacity-70" />

      <Ornament
        preset={preset}
        color={palette.gold}
        className="mb-4 w-[min(240px,80%)]"
      />

      <StaggerLines
        className="mb-4 flex max-w-[340px] flex-col items-center gap-3"
        step={0.4}
        lines={[
          <h2
            key="h"
            className="font-[family-name:var(--font-heading)] text-3xl"
            style={{ color: palette.accent }}
          >
            Awaiting your presence
          </h2>,
        ]}
      />

      <GoldLine color={palette.gold} delay={0.4} className="mb-5" />

      <StaggerLines
        className="mb-8 flex max-w-[340px] flex-col items-center gap-3"
        baseDelay={0.5}
        step={0.4}
        lines={[
          <div key="parents" className="space-y-2 text-sm leading-relaxed opacity-75">
            <p>{config.brideParents}</p>
            <p>{config.groomParents}</p>
          </div>,
          <div key="families" className="space-y-1 text-sm opacity-60">
            {config.families.map((f) => (
              <p key={f}>{f}</p>
            ))}
          </div>,
        ]}
      />

      <RevealText delay={1.1} className="w-full max-w-[340px]">
        <BlessingsCard
          config={config}
          accent={palette.accent}
          gold={palette.gold}
        />
      </RevealText>

      <RevealText delay={1.35} className="mt-4 w-full max-w-[340px]">
        <RsvpBlock
          config={config}
          accent={palette.accent}
          gold={palette.gold}
          defaultName={guestName}
        />
      </RevealText>

      <motion.p
        className="relative z-10 mt-10 mb-6 font-[family-name:var(--font-heading)] text-2xl"
        style={{ color: palette.gold }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 1 }}
        animate={
          reduced
            ? undefined
            : { opacity: [0.7, 1, 0.7] }
        }
      >
        {config.monogram}
      </motion.p>
    </section>
  );
}
