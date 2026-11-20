"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { InviteConfig, InviteEvent } from "@/types/invite";
import { formatLongDate, weekdayFromISO } from "@/lib/dates";
import { downloadICS } from "@/lib/ics";
import { CoupleIllustration } from "@/components/invite/CoupleIllustration";
import { Ornament } from "@/components/invite/Ornaments";
import { GoldLine, RevealText, StaggerLines } from "@/components/invite/RevealText";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  config: InviteConfig;
  event: InviteEvent;
  index: number;
};

export function EventSection({ config, event, index }: Props) {
  const { palette, preset } = config.theme;
  const weekday = weekdayFromISO(event.date);
  const longDate = formatLongDate(event.date);
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgShift = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduced ? [0, 0, 0] : [0, 1, 0]
  );
  const floatY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 40, reduced ? 0 : -40]);

  const washes = [
    `radial-gradient(ellipse at 30% 20%, ${event.brideOutfit.top}33, transparent 55%)`,
    `radial-gradient(ellipse at 70% 80%, ${event.groomOutfit.top}33, transparent 50%)`,
    `radial-gradient(ellipse at 50% 50%, ${event.brideOutfit.accent}22, transparent 60%)`,
  ];

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 py-14 text-center"
      style={{
        background: `
          ${washes[index % washes.length]},
          linear-gradient(165deg, ${palette.surface} 0%, #f6eadc 50%, ${palette.surface} 100%)
        `,
        color: palette.text,
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: bgShift,
          background: `radial-gradient(circle at 50% 60%, ${event.brideOutfit.accent}18, transparent 55%)`,
        }}
      />

      <Ornament
        preset={preset}
        color={palette.gold}
        className="mb-4 w-[min(240px,75%)]"
      />

      <StaggerLines
        className="relative z-10 flex max-w-[340px] flex-col items-center gap-2"
        step={0.35}
        lines={[
          <p
            key="n"
            className="text-[10px] tracking-[0.35em] uppercase opacity-45"
          >
            Celebration {index + 1}
          </p>,
          <h2
            key="title"
            className="font-[family-name:var(--font-heading)] text-[1.85rem] leading-snug"
            style={{ color: palette.accent }}
          >
            {event.title}
          </h2>,
        ]}
      />

      <GoldLine color={palette.gold} className="mt-3 mb-3" delay={0.5} />

      <StaggerLines
        className="relative z-10 flex max-w-[340px] flex-col items-center gap-2"
        baseDelay={0.55}
        step={0.35}
        lines={[
          <p key="date" className="text-sm tracking-wide">
            <span className="font-medium">{weekday}</span>
            <span className="mx-2 opacity-35">·</span>
            <span>{longDate}</span>
          </p>,
          <p key="time" className="text-sm opacity-70">
            {event.time}
          </p>,
          <div key="venue" className="pt-2">
            <p className="text-base font-medium">{event.venueName}</p>
            <p className="mt-1 text-sm leading-relaxed opacity-65">
              {event.venueAddress}
            </p>
          </div>,
        ]}
      />

      <RevealText delay={1.1} className="relative z-10 mt-3">
        <motion.div style={{ y: floatY }}>
          <CoupleIllustration
            brideOutfit={event.brideOutfit}
            groomOutfit={event.groomOutfit}
            size={210}
          />
        </motion.div>
      </RevealText>

      <RevealText
        delay={1.4}
        className="relative z-10 mt-5 flex w-full max-w-[320px] flex-col gap-2"
      >
        <button
          type="button"
          onClick={() =>
            downloadICS(event, `${config.bride.name} & ${config.groom.name}`)
          }
          className="flex min-h-11 items-center justify-center rounded-lg border text-sm transition hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: `${palette.gold}88`,
            color: palette.accent,
            outlineColor: palette.gold,
          }}
        >
          Add to Calendar
        </button>
        {event.mapUrl && (
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center rounded-lg text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: palette.accent, outlineColor: palette.gold }}
          >
            Get Directions
          </a>
        )}
      </RevealText>
    </section>
  );
}
