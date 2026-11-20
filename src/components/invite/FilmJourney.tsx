"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { InviteConfig } from "@/types/invite";
import { AmbientSparkles } from "@/components/invite/AmbientSparkles";
import { BlessingsCard } from "@/components/invite/BlessingsCard";
import { ChapterNav } from "@/components/invite/ChapterNav";
import { CoupleIllustration } from "@/components/invite/CoupleIllustration";
import { FallingPetals } from "@/components/invite/FallingPetals";
import { FilmLoader } from "@/components/invite/FilmLoader";
import { FloatingSymbol } from "@/components/invite/FloatingSymbol";
import { Ornament } from "@/components/invite/Ornaments";
import {
  GoldLine,
  RevealLetters,
  RevealText,
  ScrollCue,
  StaggerLines,
} from "@/components/invite/RevealText";
import { RsvpBlock } from "@/components/invite/RsvpBlock";
import { ScratchCard } from "@/components/invite/ScratchCard";
import { formatLongDate, weekdayFromISO } from "@/lib/dates";
import { downloadICS } from "@/lib/ics";
import { sanitizeGuestName } from "@/lib/sanitize";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  config: InviteConfig;
  guestName?: string | null;
  preview?: boolean;
};

const CHAPTERS = [
  { id: "wedding", label: "The wedding" },
  { id: "beginning", label: "The beginning" },
  { id: "celebrations", label: "Celebrations" },
  { id: "venue", label: "The venue" },
  { id: "love", label: "With love" },
] as const;

function SectionObserver({
  id,
  onActive,
  children,
  className,
  style,
}: {
  id: string;
  onActive: (id: string) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.45 });

  useEffect(() => {
    if (inView) onActive(id);
  }, [inView, id, onActive]);

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={style}
      data-chapter={id}
    >
      {children}
    </section>
  );
}

export function FilmJourney({ config, guestName, preview = false }: Props) {
  const { palette, preset } = config.theme;
  const safeGuest = sanitizeGuestName(guestName);
  const reduced = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(preview);
  const [active, setActive] = useState<string>("wedding");
  const weddingDate = config.events[0]?.date ?? "2026-12-06";
  const dateLine = `${weekdayFromISO(weddingDate)}, ${formatLongDate(weddingDate)} · ${config.city}`;
  const dates = config.events.map((e) => e.date);

  const onLoaded = useCallback(() => setLoaded(true), []);
  const onActive = useCallback((id: string) => setActive(id), []);

  const jumpTo = (id: string) => {
    const el = scrollerRef.current?.querySelector(`#${id}`);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <div
      className={preview ? "relative h-full w-full overflow-hidden" : "fixed inset-0 overflow-hidden"}
      style={{ background: "#12080a" }}
    >
      <AnimatePresence>
        {!loaded && (
          <FilmLoader
            monogram={config.monogram}
            brideName={config.bride.name}
            groomName={config.groom.name}
            invocation={config.invocation}
            dateLine={dateLine}
            gold={palette.gold}
            accent={palette.accent}
            onDone={onLoaded}
          />
        )}
      </AnimatePresence>

      {loaded && !preview && (
        <>
          <FloatingSymbol
            symbol={config.theme.symbol}
            color={palette.gold}
            containerRef={scrollerRef}
          />
          <ChapterNav
            chapters={[...CHAPTERS]}
            activeId={active}
            onSelect={jumpTo}
            gold={palette.gold}
          />
          <button
            type="button"
            onClick={() => jumpTo("celebrations")}
            className="fixed left-3 top-3 z-50 min-h-10 rounded-full border px-3 text-[10px] tracking-wide backdrop-blur focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              borderColor: `${palette.gold}55`,
              color: palette.gold,
              background: "rgba(18,8,10,0.55)",
              outlineColor: palette.gold,
            }}
          >
            Skip to details
          </button>
        </>
      )}

      <motion.div
        ref={scrollerRef}
        className={
          preview
            ? "mx-auto h-full max-w-[430px] overflow-y-auto snap-y snap-mandatory"
            : "invite-scroll mx-auto h-[100svh] w-full max-w-[430px] overflow-y-auto snap-y snap-mandatory shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        }
        initial={preview ? false : { opacity: 0 }}
        animate={loaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9 }}
      >
        {loaded && (
          <>
            {/* 01 — The wedding */}
            <SectionObserver
              id="wedding"
              onActive={onActive}
              className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 15%, ${palette.gold}28 0%, transparent 45%),
                  linear-gradient(165deg, ${palette.bg} 0%, ${palette.bgAlt} 50%, #14090b 100%)
                `,
                color: palette.surface,
              }}
            >
              <FallingPetals
                count={12}
                colors={[palette.gold, palette.accentSoft, "#F5D0E0"]}
              />
              <AmbientSparkles color={palette.gold} count={16} />
              <Ornament preset={preset} color={palette.gold} className="mb-6 w-[85%] max-w-[280px]" />

              <StaggerLines
                className="relative z-10 flex max-w-[340px] flex-col items-center gap-4"
                step={0.4}
                lines={[
                  config.invocation ? (
                    <p
                      key="inv"
                      className="font-[family-name:var(--font-noto)] text-sm tracking-wide"
                      style={{ color: palette.gold }}
                    >
                      {config.invocation}
                    </p>
                  ) : null,
                  safeGuest ? (
                    <p key="dear" className="text-sm opacity-80">
                      Dear {safeGuest}
                    </p>
                  ) : (
                    <p
                      key="tog"
                      className="text-[10px] tracking-[0.35em] uppercase opacity-55"
                    >
                      Together with our families
                    </p>
                  ),
                  <p key="line" className="text-sm italic opacity-75">
                    {config.chapterLines?.opening ?? config.blessingLine}
                  </p>,
                ].filter(Boolean)}
              />

              <RevealText delay={1} className="relative z-10 mt-5">
                <p
                  className="font-[family-name:var(--font-heading)] text-5xl"
                  style={{ color: palette.gold }}
                >
                  {config.monogram}
                </p>
              </RevealText>
              <GoldLine color={palette.gold} className="mt-4" delay={1.2} />

              <div className="relative z-10 mt-5 space-y-1">
                <RevealLetters
                  text={config.bride.name}
                  className="font-[family-name:var(--font-heading)] text-[2.2rem]"
                  delay={1.35}
                  color={palette.surface}
                />
                <RevealText delay={1.85}>
                  <p className="text-sm tracking-[0.4em] opacity-50">&</p>
                </RevealText>
                <RevealLetters
                  text={config.groom.name}
                  className="font-[family-name:var(--font-heading)] text-[2.2rem]"
                  delay={2}
                  color={palette.surface}
                />
              </div>

              <RevealText delay={2.4} className="relative z-10 mt-6">
                <p className="text-[11px] tracking-[0.28em] uppercase opacity-70">
                  {weekdayFromISO(weddingDate)} · {formatLongDate(weddingDate)}
                </p>
                <p className="mt-2 text-[11px] tracking-[0.28em] uppercase opacity-55">
                  {config.city}
                </p>
              </RevealText>

              <ScrollCue color={palette.gold} />
            </SectionObserver>

            {/* 02 — The beginning */}
            <SectionObserver
              id="beginning"
              onActive={onActive}
              className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 py-14 text-center"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 0%, ${palette.accentSoft}33, transparent 50%),
                  linear-gradient(180deg, ${palette.surface} 0%, #f3e6d6 100%)
                `,
                color: palette.text,
              }}
            >
              <p className="text-[10px] tracking-[0.35em] uppercase opacity-45">
                02 · The beginning
              </p>
              <StaggerLines
                className="mt-3 flex max-w-[340px] flex-col items-center gap-3"
                step={0.4}
                lines={[
                  <h2
                    key="h"
                    className="font-[family-name:var(--font-heading)] text-3xl"
                    style={{ color: palette.accent }}
                  >
                    A new beginning
                  </h2>,
                  <p key="p" className="text-lg leading-snug opacity-80">
                    {config.chapterLines?.beginning ??
                      "Two hearts. One beautiful journey."}
                  </p>,
                  <p key="inv" className="text-sm leading-relaxed opacity-70">
                    {config.invitationLine}
                  </p>,
                ]}
              />

              <GoldLine color={palette.gold} className="my-5" delay={0.8} />

              <StaggerLines
                className="flex max-w-[340px] flex-col items-center gap-5"
                baseDelay={0.9}
                step={0.45}
                lines={[
                  <div key="b" className="space-y-1">
                    <p className="text-[10px] tracking-[0.25em] uppercase opacity-45">
                      The bride
                    </p>
                    <p className="font-[family-name:var(--font-heading)] text-2xl">
                      {config.bride.honorific
                        ? `${config.bride.honorific} ${config.bride.name}`
                        : config.bride.name}
                    </p>
                    {config.bride.grandparents && (
                      <p className="text-xs opacity-55">
                        Granddaughter of {config.bride.grandparents}
                      </p>
                    )}
                    <p className="text-xs opacity-65">
                      Daughter of {config.bride.parents ?? config.brideParents}
                    </p>
                  </div>,
                  <div key="g" className="space-y-1">
                    <p className="text-[10px] tracking-[0.25em] uppercase opacity-45">
                      The groom
                    </p>
                    <p className="font-[family-name:var(--font-heading)] text-2xl">
                      {config.groom.honorific
                        ? `${config.groom.honorific} ${config.groom.name}`
                        : config.groom.name}
                    </p>
                    {config.groom.grandparents && (
                      <p className="text-xs opacity-55">
                        Grandson of {config.groom.grandparents}
                      </p>
                    )}
                    <p className="text-xs opacity-65">
                      Son of {config.groom.parents ?? config.groomParents}
                    </p>
                  </div>,
                ]}
              />

              <RevealText delay={1.6} className="mt-4">
                <CoupleIllustration
                  brideOutfit={config.events[2]?.brideOutfit ?? config.events[0].brideOutfit}
                  groomOutfit={config.events[2]?.groomOutfit ?? config.events[0].groomOutfit}
                  size={190}
                />
              </RevealText>

              <RevealText delay={1.85} className="mt-4 w-full max-w-[300px]">
                <ScratchCard dates={dates} gold={palette.gold} />
              </RevealText>
            </SectionObserver>

            {/* 03 — Celebrations timeline */}
            <SectionObserver
              id="celebrations"
              onActive={onActive}
              className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-start overflow-hidden px-5 py-16 text-center"
              style={{
                background: `
                  radial-gradient(ellipse at 70% 20%, ${palette.accent}18, transparent 50%),
                  linear-gradient(180deg, #f7efe4 0%, ${palette.surface} 100%)
                `,
                color: palette.text,
              }}
            >
              <p className="text-[10px] tracking-[0.35em] uppercase opacity-45">
                03 · Celebrations
              </p>
              <h2
                className="mt-2 font-[family-name:var(--font-heading)] text-3xl"
                style={{ color: palette.accent }}
              >
                {config.chapterLines?.celebrations ?? "The celebrations"}
              </h2>
              <p className="mt-2 text-sm opacity-65">
                {weekdayFromISO(weddingDate)} · {formatLongDate(weddingDate)}
              </p>
              <GoldLine color={palette.gold} className="my-5" delay={0.3} />

              <div className="relative z-10 w-full max-w-[340px] space-y-4 pb-24">
                {config.events.map((event, index) => (
                  <RevealText key={event.id} delay={0.2 + index * 0.25}>
                    <article
                      className="rounded-2xl border px-4 py-4 text-left"
                      style={{
                        borderColor: `${palette.gold}55`,
                        background: "rgba(255,255,255,0.55)",
                      }}
                    >
                      <p
                        className="text-[10px] tracking-[0.25em] uppercase"
                        style={{ color: palette.gold }}
                      >
                        {String(index + 1).padStart(2, "0")} · {event.time}
                      </p>
                      <h3
                        className="mt-1 font-[family-name:var(--font-heading)] text-xl"
                        style={{ color: palette.accent }}
                      >
                        {event.title}
                      </h3>
                      {event.poeticLine && (
                        <p className="mt-1 text-sm italic opacity-65">
                          {event.poeticLine}
                        </p>
                      )}
                      <div className="mt-3 flex justify-center">
                        <CoupleIllustration
                          brideOutfit={event.brideOutfit}
                          groomOutfit={event.groomOutfit}
                          size={140}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          downloadICS(
                            event,
                            `${config.bride.name} & ${config.groom.name}`
                          )
                        }
                        className="mt-2 flex min-h-11 w-full items-center justify-center rounded-lg border text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                          borderColor: `${palette.gold}88`,
                          color: palette.accent,
                          outlineColor: palette.gold,
                        }}
                      >
                        Add to Calendar
                      </button>
                    </article>
                  </RevealText>
                ))}
              </div>
            </SectionObserver>

            {/* 04 — Venue */}
            <SectionObserver
              id="venue"
              onActive={onActive}
              className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 py-14 text-center"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 40%, ${palette.gold}22, transparent 55%),
                  linear-gradient(165deg, ${palette.bg} 0%, ${palette.bgAlt} 100%)
                `,
                color: palette.surface,
              }}
            >
              <p className="text-[10px] tracking-[0.35em] uppercase opacity-50">
                04 · The venue
              </p>
              <h2
                className="mt-3 font-[family-name:var(--font-heading)] text-3xl"
                style={{ color: palette.gold }}
              >
                {config.chapterLines?.venue ?? "Where we gather"}
              </h2>
              <GoldLine color={palette.gold} className="my-5" delay={0.3} />

              <StaggerLines
                className="flex max-w-[320px] flex-col items-center gap-3"
                step={0.4}
                lines={[
                  <p
                    key="v"
                    className="font-[family-name:var(--font-heading)] text-2xl"
                  >
                    {config.events[0]?.venueName}
                  </p>,
                  <p key="a" className="text-sm leading-relaxed opacity-75">
                    {config.events[0]?.venueAddress}
                  </p>,
                  <p key="note" className="text-xs leading-relaxed opacity-55">
                    Barat departs at 10:00 AM from the bride&apos;s residence for
                    the venue.
                  </p>,
                ]}
              />

              {config.events[0]?.mapUrl && (
                <RevealText delay={1} className="mt-8 w-full max-w-[280px]">
                  <a
                    href={config.events[0].mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center justify-center rounded-full text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      background: palette.gold,
                      color: palette.bg,
                      outlineColor: palette.gold,
                    }}
                  >
                    Get Directions
                  </a>
                </RevealText>
              )}
            </SectionObserver>

            {/* 05 — With love */}
            <SectionObserver
              id="love"
              onActive={onActive}
              className="relative flex min-h-[100svh] snap-start snap-always flex-col items-center justify-start overflow-hidden px-5 py-14 text-center"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 0%, ${palette.gold}20, transparent 40%),
                  linear-gradient(180deg, ${palette.surface} 0%, #f0e2d0 100%)
                `,
                color: palette.text,
              }}
            >
              <AmbientSparkles color={palette.gold} count={10} />
              <p className="text-[10px] tracking-[0.35em] uppercase opacity-45">
                05 · With love
              </p>
              <h2
                className="mt-2 font-[family-name:var(--font-heading)] text-3xl"
                style={{ color: palette.accent }}
              >
                Awaiting your presence
              </h2>
              <p className="mt-2 max-w-[300px] text-sm opacity-65">
                {config.chapterLines?.closing}
              </p>

              {(config.hostLine || config.hostAddress) && (
                <RevealText delay={0.4} className="mt-5 max-w-[300px] text-sm">
                  <p className="font-medium">{config.hostLine}</p>
                  <p className="mt-1 opacity-60">{config.hostAddress}</p>
                </RevealText>
              )}

              <RevealText delay={0.6} className="mt-6 w-full max-w-[340px]">
                <div
                  className="max-h-40 overflow-y-auto rounded-xl border px-3 py-3 text-left text-xs leading-relaxed opacity-75"
                  style={{ borderColor: `${palette.gold}44` }}
                >
                  <p className="mb-2 text-[10px] tracking-[0.2em] uppercase opacity-50">
                    With family
                  </p>
                  {config.families.map((f) => (
                    <p key={f} className="py-0.5">
                      {f}
                    </p>
                  ))}
                </div>
              </RevealText>

              <RevealText delay={0.85} className="mt-5 w-full max-w-[340px]">
                <BlessingsCard
                  config={config}
                  accent={palette.accent}
                  gold={palette.gold}
                />
              </RevealText>

              <RevealText delay={1.05} className="mt-4 mb-24 w-full max-w-[340px]">
                <RsvpBlock
                  config={config}
                  accent={palette.accent}
                  gold={palette.gold}
                  defaultName={safeGuest || undefined}
                />
              </RevealText>
            </SectionObserver>
          </>
        )}
      </motion.div>
    </div>
  );
}
