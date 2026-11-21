"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import type { InviteConfig } from "@/types/invite";

gsap.registerPlugin(SplitText);
import { ScratchCard } from "@/components/invite/ScratchCard";
import { FilmPreloader } from "@/components/film/FilmPreloader";
import { MusicToggle } from "@/components/film/MusicToggle";
import { EnvelopeScene } from "@/components/film/EnvelopeScene";
import { PhotoFrame, ArchMountedCutout } from "@/components/film/PhotoFrame";
import { GoldWipe, IrisReveal } from "@/components/film/ChapterTransitions";
import { GlassBottom } from "@/components/film/GlassBottom";
import { Countdown } from "@/components/film/Countdown";
import { CeremonyJourney } from "@/components/film/CeremonyJourney";
import { DevDarshanSection } from "@/components/film/DevDarshanSection";
import { EntranceDust } from "@/components/film/EntranceDust";
import { FamilyPhoto } from "@/components/film/FamilyPhoto";
import { useFilmScroll } from "@/components/film/useFilmScroll";
import { startFoilShine } from "@/components/film/foilShine";
import { runOpacityAudit } from "@/components/film/opacityAudit";
import { PHOTOS } from "@/lib/film/photos";
import { formatLongDate } from "@/lib/dates";
import { downloadAllICS } from "@/lib/ics";
import { parseGuestInvite } from "@/lib/sanitize";
import { HINDI_COPY } from "@/lib/hindi";
import {
  hasSeenEnvelope,
  markEnvelopeSeen,
  usePrefersReducedMotion,
} from "@/lib/hooks";

type Props = {
  config: InviteConfig;
  guestName?: string | null;
  preview?: boolean;
};

const PRELOAD = [
  PHOTOS.standingLook.webp,
  PHOTOS.mehndi.webp,
  PHOTOS.hands.webp,
  PHOTOS.seated.webp,
  PHOTOS.family.webp,
  PHOTOS.cutoutStanding,
];

export function CinematicInvite({ config, guestName, preview = false }: Props) {
  const gold = "#C9A227";
  const accent = "#5A0F2B";
  const guest = parseGuestInvite(guestName);
  const safeGuest = guest.greeting;
  const prefersReduced = usePrefersReducedMotion();

  const hindi = config.hindi ?? {
    invocation: config.invocation ?? HINDI_COPY.invocation,
    title: HINDI_COPY.title,
    invite: HINDI_COPY.invite,
    request: HINDI_COPY.request,
    closing: HINDI_COPY.closing,
    events: { ...HINDI_COPY.events },
  };
  const [loadRatio, setLoadRatio] = useState(0);
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [doorsDone, setDoorsDone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [lotusOn, setLotusOn] = useState(false);
  const [entranceOn, setEntranceOn] = useState(false);

  const events = config.events;
  const firstEvent = events[0];
  const coupleLabel = `${config.groom.name} & ${config.bride.name}`;
  const venueMapUrl = events.find((e) => e.mapUrl)?.mapUrl ?? firstEvent?.mapUrl;
  const devEvent =
    events.find((e) => e.id === "dev-darshan") ?? firstEvent;
  const scheduleExcludeIds = useMemo(
    () => (devEvent ? [devEvent.id] : ["dev-darshan"]),
    [devEvent]
  );
  const dates = events.map((e) => e.date);
  const storyLine =
    config.chapterLines?.beginning ?? "Two hearts. One beautiful journey.";
  const storyWords = storyLine.split(/\s+/).filter(Boolean);

  /** Envelope dissolves onto scene 1 — gold dust entrance beat. */
  const beginDoors = useCallback(() => {
    setShowEnvelope(false);
    setDoorsDone(true);
    setEntranceOn(true);
    window.setTimeout(() => setEntranceOn(false), 2200);
  }, []);

  // Preload photos for film preloader
  useEffect(() => {
    let done = 0;
    const total = PRELOAD.length;
    PRELOAD.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        done += 1;
        setLoadRatio(done / total);
        if (done >= total) setReady(true);
      };
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      setShowLoader(false);
      if (skipped) {
        markEnvelopeSeen();
        setDoorsDone(true);
        return;
      }
      // Reduced motion: brief crossfade path (no envelope choreography)
      if (prefersReduced) {
        beginDoors();
        return;
      }
      if (hasSeenEnvelope()) {
        beginDoors();
      } else {
        setShowEnvelope(true);
      }
    }, skipped ? 0 : 380);
    return () => window.clearTimeout(t);
  }, [ready, skipped, prefersReduced, beginDoors]);

  useEffect(() => {
    if (showLoader || showEnvelope || !doorsDone) return;
    return startFoilShine(document, prefersReduced);
  }, [showLoader, showEnvelope, doorsDone, prefersReduced]);

  const setup = useCallback(
    ({
      gsap,
      ScrollTrigger,
      root,
      reduced,
    }: {
      gsap: typeof import("gsap").default;
      ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
      root: HTMLElement;
      reduced: boolean;
    }) => {
      if (reduced) {
        gsap.set("[data-inv-line]", {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        gsap.set("[data-monogram]", { scale: 1, opacity: 1 });
        gsap.set("[data-arch-window]", {
          clipPath: "inset(0% 0% 0% 0%)",
        });
        gsap.set("[data-name-l], [data-name-r]", {
          clipPath: "inset(0% 0% 0% 0%)",
          letterSpacing: "0.12em",
          opacity: 1,
        });
        gsap.set("[data-amp]", { opacity: 1 });
        gsap.set("[data-name-line]", { strokeDashoffset: 0 });
        gsap.set("[data-story-word]", { opacity: 1 });
        gsap.set("[data-strip-frame]", { x: 0, opacity: 1 });
        gsap.set("[data-dd-meta]", { y: 0, opacity: 1 });
        gsap.set("[data-glass-bottom]", {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          opacity: 1,
        });
        gsap.set("[data-countdown]", { opacity: 1, y: 0 });
        gsap.set("[data-close-block]", { opacity: 1, y: 0 });
        return;
      }

      // Ch1 — Latin label via SplitText chars; Hindi whole-line / whole-word only
      const openLabel = root.querySelector("[data-open-label]");
      if (openLabel) {
        const split = SplitText.create(openLabel, {
          type: "chars",
          charsClass: "open-char",
        });
        gsap.from(split.chars, {
          y: 8,
          immediateRender: false,
          stagger: 0.02,
          ease: "power2.out",
          duration: 0.5,
          scrollTrigger: {
            trigger: "[data-chapter='beginning']",
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }
      // Progressive enhancement — content stays visible if ST never fires
      gsap.from("[data-inv-line]", {
        y: 16,
        immediateRender: false,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-chapter='beginning']",
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
      gsap.from("[data-monogram]", {
        scale: 0.88,
        immediateRender: false,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-chapter='beginning']",
          start: "top 75%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Transition 1→2 doors close then open across the seam
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-chapter='names']",
            start: "top 98%",
            end: "top 35%",
            scrub: true,
          },
        })
        .fromTo(
          "[data-door-l]",
          { xPercent: -100 },
          { xPercent: 0, ease: "none", duration: 0.45 }
        )
        .fromTo(
          "[data-door-r]",
          { xPercent: 100 },
          { xPercent: 0, ease: "none", duration: 0.45 },
          0
        )
        .to("[data-door-l]", { xPercent: -100, ease: "none", duration: 0.45 })
        .to("[data-door-r]", { xPercent: 100, ease: "none", duration: 0.45 }, "<");

      // Ch2 — arch expand (NO pin — pin was creating large blank gaps)
      gsap.fromTo(
        "[data-arch-window]",
        { clipPath: "inset(0 35% 0 35%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-chapter='names']",
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        }
      );
      gsap.from("[data-name-l], [data-name-r]", {
        letterSpacing: "0.28em",
        y: 12,
        immediateRender: false,
        ease: "power2.out",
        duration: 0.8,
        scrollTrigger: {
          trigger: "[data-chapter='names']",
          start: "top 75%",
          toggleActions: "play none none none",
          once: true,
        },
      });
      gsap.from("[data-amp]", {
        scale: 0.85,
        immediateRender: false,
        duration: 0.6,
        scrollTrigger: {
          trigger: "[data-chapter='names']",
          start: "top 70%",
          toggleActions: "play none none none",
          once: true,
        },
      });
      const nameLine = root.querySelector("[data-name-line]") as SVGGeometryElement | null;
      if (nameLine) {
        const len = nameLine.getTotalLength?.() ?? 220;
        gsap.set(nameLine, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(nameLine, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-chapter='names']",
            start: "top+=10% top",
            end: "+=50%",
            scrub: true,
          },
        });
      }

      // Transition 2→3: arch expand feel (scale up names chapter exit)
      gsap.fromTo(
        "[data-trans-arch]",
        { clipPath: "inset(50% 40% 50% 40%)", opacity: 0.9 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-chapter='story']",
            start: "top bottom",
            end: "top 40%",
            scrub: true,
          },
        }
      );

      // Ch3 — film strip parallax + words
      root.querySelectorAll<HTMLElement>("[data-strip-frame]").forEach((el, i) => {
        const speed = 40 + i * 28;
        gsap.fromTo(
          el,
          { x: i % 2 === 0 ? -speed : speed },
          {
            x: i % 2 === 0 ? speed : -speed,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-chapter='story']",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
      gsap.from("[data-story-word]", {
        y: 10,
        immediateRender: false,
        stagger: 0.06,
        duration: 0.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: "[data-chapter='story']",
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Transition 3→4: gold horizontal wipe
      gsap.fromTo(
        "[data-wipe]",
        { x: "-105%" },
        {
          x: "105%",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-chapter='dev']",
            start: "top 90%",
            end: "top 35%",
            scrub: true,
          },
        }
      );

      // Glass bottoms — enhance only (visible by default in CSS)
      root.querySelectorAll<HTMLElement>("[data-glass-bottom]").forEach((el) => {
        const chapter = el.closest("[data-chapter]");
        if (!chapter) return;
        gsap.from(el, {
          y: 16,
          immediateRender: false,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: chapter,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });

      // Transition 5→6: iris
      gsap.fromTo(
        "[data-iris]",
        { clipPath: "circle(150% at 50% 50%)" },
        {
          clipPath: "circle(0% at 50% 50%)",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-chapter='celebrations']",
            start: "top 90%",
            end: "top 35%",
            scrub: true,
          },
        }
      );

      // Names — countdown + scratch rise in once
      gsap.from("[data-countdown]", {
        y: 18,
        immediateRender: false,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-chapter='names']",
          start: "top 55%",
          toggleActions: "play none none none",
          once: true,
        },
      });
      gsap.from("[data-scratch-wrap]", {
        y: 28,
        scale: 0.96,
        immediateRender: false,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-chapter='names']",
          start: "top 50%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Closing chapter — soft rise of blocks
      gsap.from("[data-close-block]", {
        y: 28,
        immediateRender: false,
        stagger: 0.12,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-chapter='celebrations']",
          start: "top 75%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      ScrollTrigger.refresh();
    },
    []
  );

  const { rootRef, reduced } = useFilmScroll({
    enabled: !showLoader && doorsDone,
    setup,
  });

  useEffect(() => {
    if (!doorsDone || showLoader || process.env.NODE_ENV !== "development") return;
    const el = rootRef.current;
    if (el) runOpacityAudit(el);
  }, [doorsDone, showLoader, rootRef]);

  const jumpToCelebrations = useCallback(() => {
    setSkipped(true);
    setReady(true);
    setShowLoader(false);
    setShowEnvelope(false);
    markEnvelopeSeen();
    setDoorsDone(true);
    setLoadRatio(1);
    requestAnimationFrame(() => {
      rootRef.current
        ?.querySelector("#celebrations")
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  }, [reduced, rootRef]);

  const cssVars = useMemo(
    () =>
      ({
        ["--film-gold" as string]: gold,
      }) as React.CSSProperties,
    []
  );

  return (
    <div
      className={
        preview
          ? "relative h-full w-full overflow-hidden"
          : "fixed inset-0 overflow-hidden"
      }
      style={{ ...cssVars, background: "#F7F1E6" }}
    >
      <div className="film-grain opacity-[0.04]" aria-hidden="true" />

      <AnimatePresence>
        {showLoader && (
          <FilmPreloader
            monogram={config.monogram}
            progress={loadRatio}
            gold={gold}
            onSkip={jumpToCelebrations}
            visible={showLoader}
          />
        )}
      </AnimatePresence>

      {/* Scene 1 underlay — cream + photo under envelope (no black flash) */}
      {showEnvelope && !showLoader && (
        <div
          className="pointer-events-none fixed inset-0 z-[105] flex justify-center"
          aria-hidden="true"
          style={{ background: "#F7F1E6" }}
        >
          <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-[#F7F1E6]">
            <picture>
              <source
                srcSet={PHOTOS.standingLook.webpSm}
                type="image/webp"
                media="(max-width: 430px)"
              />
              <source srcSet={PHOTOS.standingLook.webp} type="image/webp" />
              <img
                src={PHOTOS.standingLook.jpg}
                alt=""
                className="film-grade absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            </picture>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(247,241,230,0.55) 0%, rgba(247,241,230,0.15) 40%, rgba(247,241,230,0.45) 100%)",
              }}
            />
          </div>
        </div>
      )}

      <EnvelopeScene
        config={config}
        guestName={guestName}
        visible={showEnvelope && !showLoader}
        onComplete={beginDoors}
        onSkip={jumpToCelebrations}
      />

      {!showLoader && !showEnvelope && (
        <MusicToggle musicUrl={config.musicUrl} gold={gold} />
      )}

      <EntranceDust active={entranceOn && doorsDone && !showLoader} gold={gold} />

      {!showLoader && !showEnvelope && doorsDone && (
        <div className="progress-rail" aria-hidden="true">
          <span data-progress-fill />
        </div>
      )}

      <div
        ref={rootRef}
        className={
          preview
            ? "invite-film relative mx-auto h-full max-w-[430px] overflow-x-hidden overflow-y-auto"
            : "invite-film relative mx-auto h-[100svh] w-full max-w-[430px] overflow-x-hidden overflow-y-auto shadow-[0_0_80px_rgba(0,0,0,0.55)]"
        }
      >
        <div data-film-content className="relative w-full overflow-x-hidden">
          {/* ── 1 BEGINNING — tighter mobile hero ── */}
          <section
            data-chapter="beginning"
            className="relative flex min-h-[88svh] flex-col items-center overflow-hidden pb-16 text-center"
            style={{ background: "#F7F1E6", color: "#2A1A14" }}
          >
            <div className="absolute inset-0 z-0">
              <picture>
                <source
                  srcSet={PHOTOS.standingLook.webpSm}
                  type="image/webp"
                  media="(max-width: 430px)"
                />
                <source srcSet={PHOTOS.standingLook.webp} type="image/webp" />
                <img
                  src={PHOTOS.standingLook.jpg}
                  alt=""
                  className="film-grade h-full w-full object-cover object-[center_22%]"
                  draggable={false}
                />
              </picture>
            </div>
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(247,241,230,0.88) 0%, rgba(247,241,230,0.45) 38%, rgba(247,241,230,0.2) 58%, rgba(247,241,230,0.75) 100%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex w-full flex-1 flex-col items-center px-7 pt-[8svh]">
              <p data-open-label className="type-label mb-4" style={{ color: "#8A6A1F" }}>
                {config.chapterLines?.opening ?? "The beginning"}
              </p>
              <p
                lang="hi"
                data-inv-line
                className="type-hi-display max-w-[20rem] text-[#2A1A14]"
              >
                {hindi.invocation}
              </p>
              <p lang="hi" data-inv-line className="type-hi-display mt-2 foil-text">
                {hindi.title}
              </p>
              <p data-monogram className="type-name foil-text mt-6">
                {config.monogram}
              </p>
              {safeGuest && (
                <p className="type-body mt-4 text-[#2A1A14]/85">
                  Dear {safeGuest}
                </p>
              )}
            </div>

            <GlassBottom tone="light">
              <p lang="hi" className="type-hi-body text-[16px] text-[#2A1A14]">
                {hindi.invite}
              </p>
              <p className="type-body mt-2 text-[16px] text-[#2A1A14]/85">
                {firstEvent ? formatLongDate(firstEvent.date) : ""}
                {config.city ? ` · ${config.city}` : ""}
              </p>
              <p
                data-scroll-chevron
                className="type-label mt-3"
                style={{
                  color: "#8A6A1F",
                  animation: reduced ? undefined : "chevron-bob 1.6s ease-in-out infinite",
                }}
              >
                ↓ Scroll to unfold
              </p>
            </GlassBottom>
          </section>

          {/* ── 2 NAMES — one name block, scratch + countdown in flow ── */}
          <section
            data-chapter="names"
            className="relative flex flex-col items-center px-5 pb-12 pt-8 text-center"
            style={{ background: "#FBF6EE", color: "#2A1A14" }}
          >
            {/* Transition 1→2: soft ivory doors */}
            <div
              data-door-l
              className="pointer-events-none absolute inset-y-0 left-0 z-30 w-1/2"
              style={{
                background: `linear-gradient(90deg, #F7F1E6, #E8D9C0)`,
                transform: "translateX(-100%)",
                willChange: "transform",
              }}
              aria-hidden="true"
            />
            <div
              data-door-r
              className="pointer-events-none absolute inset-y-0 right-0 z-30 w-1/2"
              style={{
                background: `linear-gradient(270deg, #F7F1E6, #E8D9C0)`,
                transform: "translateX(100%)",
                willChange: "transform",
              }}
              aria-hidden="true"
            />
            <p className="type-label mb-4" style={{ color: "#8A6A1F" }}>
              With love
            </p>

            <div
              data-arch-window
              className="relative mx-auto w-full max-w-[210px]"
              style={{ willChange: "clip-path" }}
            >
              <PhotoFrame
                src={PHOTOS.standingLook.webp}
                srcSm={PHOTOS.standingLook.webpSm}
                alt={`${config.groom.name} and ${config.bride.name}`}
                variant="arch"
                className="aspect-[3/4] w-full"
              />
            </div>

            <div className="mt-5 flex w-full max-w-[360px] flex-col items-center gap-0.5 overflow-hidden px-2">
              <h1 data-name-l className="type-name foil-text text-center">
                {config.groom.name}
              </h1>
              <span data-amp className="type-amp foil-text">
                &
              </span>
              <h1 data-name-r className="type-name foil-text text-center">
                {config.bride.name}
              </h1>
              <svg
                className="mt-2 w-[min(200px,65%)]"
                viewBox="0 0 220 8"
                aria-hidden="true"
              >
                <path
                  data-name-line
                  d="M4 4 H216"
                  fill="none"
                  stroke={gold}
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {firstEvent && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="type-label text-[11px]" style={{ color: "#8A6A1F" }}>
                  Until we meet
                </p>
                <Countdown dateISO={firstEvent.date} gold={gold} />
              </div>
            )}

            <div
              data-scratch-wrap
              className="pointer-events-auto relative z-10 mx-auto mt-7 w-full max-w-[300px]"
              onPointerUp={() => setLotusOn(true)}
            >
              <p className="type-label mb-3 text-[11px]" style={{ color: "#8A6A1F" }}>
                Scratch to reveal the date
              </p>
              <ScratchCard dates={dates} gold={gold} label="Reveal the date" />
            </div>

            {(lotusOn || reduced) && (
              <div className="mt-6 flex justify-center" aria-hidden="true">
                <svg viewBox="0 0 120 120" width="56" height="56">
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
                    <ellipse
                      key={deg}
                      cx="60"
                      cy="48"
                      rx="10"
                      ry="28"
                      fill={gold}
                      opacity={0.35 + (i % 3) * 0.08}
                      transform={`rotate(${deg} 60 70)`}
                    />
                  ))}
                  <circle cx="60" cy="70" r="8" fill={gold} opacity="0.9" />
                </svg>
              </div>
            )}
          </section>

          {/* ── 3 OUR STORY — line once, no duplicate glass ── */}
          <section
            data-chapter="story"
            className="relative overflow-hidden px-5 pb-12 pt-10"
            style={{ background: "#F6EFE2", color: "#2A1A14" }}
          >
            {/* Transition 2→3: arch expand */}
            <div
              data-trans-arch
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background: "#5A0F2B",
                clipPath: "inset(50% 40% 50% 40%)",
                opacity: 0.9,
                willChange: "clip-path, opacity",
              }}
              aria-hidden="true"
            />
            <p className="type-label relative z-10 text-center" style={{ color: "#8A6A1F" }}>
              Our story
            </p>
            <p className="type-body-lg relative z-10 mx-auto mt-5 max-w-[20rem] text-center leading-relaxed">
              {storyWords.map((w, i) => (
                <span
                  key={`${w}-${i}`}
                  data-story-word
                  className="mr-[0.35em] inline-block"
                >
                  {w}
                </span>
              ))}
            </p>

            <div
              className="relative mx-auto mt-10 h-[36svh] w-full max-w-[360px]"
              style={{ perspective: "900px" }}
            >
              {[
                { photo: PHOTOS.mehndi, rot: -8, top: "2%", left: "2%" },
                { photo: PHOTOS.hands, rot: 5, top: "16%", left: "28%" },
                { photo: PHOTOS.seated, rot: -4, top: "6%", left: "54%" },
                { photo: PHOTOS.standingLook, rot: 7, top: "26%", left: "12%" },
              ].map((f, i) => (
                <div
                  key={i}
                  data-strip-frame
                  className="absolute w-[42%]"
                  style={{
                    top: f.top,
                    left: f.left,
                    transform: `rotate(${f.rot}deg)`,
                    willChange: "transform",
                  }}
                >
                  <PhotoFrame
                    src={f.photo.webp}
                    srcSm={f.photo.webpSm}
                    alt=""
                    variant="pill"
                    className="aspect-[3/4] w-full"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ── 4 DEV DARSHAN (compact) ── */}
          <div className="relative">
            <GoldWipe />
            {devEvent && (
              <DevDarshanSection
                event={devEvent}
                hindiTitle={
                  hindi.events?.["dev-darshan"] ?? HINDI_COPY.events["dev-darshan"]
                }
                gold={gold}
              />
            )}
          </div>

          {/* ── 5 CEREMONIES — remaining events only (Dev Darshan already told) ── */}
          <CeremonyJourney
            events={events}
            excludeIds={scheduleExcludeIds}
            hindiEvents={hindi.events}
            gold={gold}
            coupleLabel={coupleLabel}
            eyebrow="The day continues"
            title="Ceremonies"
            subtitle="Barat, vows, and blessings"
          />

          {/* ── 6 CLOSING — invite + venue CTA + family ── */}
          <section
            id="celebrations"
            data-chapter="celebrations"
            className="relative overflow-hidden px-5 pb-14 pt-10"
            style={{
              background: "linear-gradient(180deg, #F7F1E6 0%, #FBF6EE 45%, #F3E6D0 100%)",
              color: "#2A1A14",
            }}
          >
            <IrisReveal />
            <div data-close-block className="relative z-10 text-center">
              <p className="type-label" style={{ color: "#8A6A1F" }}>
                With warm regards
              </p>
              <h2 className="type-title mt-3" style={{ color: accent }}>
                You&apos;re invited
              </h2>
              <p
                lang="hi"
                className="type-hi-body mx-auto mt-4 max-w-[18rem] text-[#2A1A14]"
              >
                {hindi.invite}
              </p>
              <p className="type-body mx-auto mt-3 max-w-[18rem] text-[16px] text-[#2A1A14]/80">
                {config.city}
                {firstEvent ? ` · ${formatLongDate(firstEvent.date)}` : ""}
              </p>
            </div>

            {/* Venue CTA — map + add all events */}
            {firstEvent && (
              <div
                data-close-block
                className="relative z-10 mx-auto mt-8 max-w-[340px] border px-4 py-5 text-center"
                style={{
                  borderColor: `${gold}66`,
                  background: "rgba(255,251,245,0.85)",
                  borderRadius: 14,
                }}
              >
                <p className="type-label text-[11px]" style={{ color: "#8A6A1F" }}>
                  Venue
                </p>
                <p className="type-title mt-2 text-[1.05rem] text-[#2A1A14]">
                  {firstEvent.venueName}
                </p>
                <p className="type-body mt-1 text-[15px] text-[#2A1A14]/75">
                  {firstEvent.venueAddress}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {venueMapUrl && (
                    <a
                      href={venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-label flex min-h-11 items-center justify-center text-[14px] tracking-[0.14em]"
                      style={{ background: gold, color: "#2A1A14", borderRadius: 8 }}
                    >
                      Get Directions
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => downloadAllICS(events, coupleLabel)}
                    className="type-label flex min-h-11 w-full items-center justify-center border text-[14px] tracking-[0.14em]"
                    style={{
                      borderColor: gold,
                      color: accent,
                      borderRadius: 8,
                      background: "transparent",
                    }}
                  >
                    Add all to Calendar
                  </button>
                </div>
              </div>
            )}

            <div data-close-block className="relative z-10 mt-10 flex justify-center px-1">
              <FamilyPhoto
                src={PHOTOS.family.webp}
                srcSm={PHOTOS.family.webpSm}
                alt={`${config.groom.name}, ${config.bride.name} and family`}
              />
            </div>

            <div
              data-close-block
              className="relative z-10 mx-auto mt-10 max-w-[340px] text-center text-[#2A1A14]"
            >
              <p lang="hi" className="type-hi-display foil-text text-[1.6rem]">
                {hindi.closing}
              </p>
              <p lang="hi" className="type-hi-body mt-3 text-[#2A1A14]/90">
                {hindi.request}
              </p>
              <p className="type-label mt-6" style={{ color: "#8A6A1F" }}>
                {config.chapterLines?.closing ?? "With love"}
              </p>
              <p className="type-body mt-5 text-[16px] text-[#2A1A14]/90">
                {config.groomParents}
              </p>
              {config.hostAddress && (
                <p className="mt-1 text-[15px] text-[#2A1A14]/70">
                  {config.hostAddress}
                </p>
              )}
            </div>

            <div
              data-close-block
              className="relative z-10 mt-10 flex justify-center opacity-80"
            >
              <ArchMountedCutout
                src={PHOTOS.cutoutStanding}
                alt={`${config.groom.name} and ${config.bride.name}`}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
