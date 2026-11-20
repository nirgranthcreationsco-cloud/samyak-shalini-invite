"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { InviteConfig } from "@/types/invite";
import { HINDI_COPY } from "@/lib/hindi";
import { markEnvelopeSeen, usePrefersReducedMotion } from "@/lib/hooks";
import { MagneticButton } from "@/components/film/MagneticButton";

type Props = {
  config: InviteConfig;
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
};

const PARTICLE_CAP = 40;

export function EnvelopeScene({ config, visible, onComplete, onSkip }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openingRef = useRef(false);
  const reduced = usePrefersReducedMotion();
  const [hint, setHint] = useState(true);

  const hindi = config.hindi ?? HINDI_COPY;
  const invocation = hindi.invocation;
  const title = hindi.title;

  const finish = useCallback(() => {
    markEnvelopeSeen();
    onComplete();
  }, [onComplete]);

  const runOpen = useCallback(() => {
    if (openingRef.current || !rootRef.current) return;
    openingRef.current = true;
    setHint(false);
    tlRef.current?.play("open");
  }, []);

  // Idle auto-open after 6s
  useEffect(() => {
    if (!visible || reduced) return;
    const t = window.setTimeout(() => runOpen(), 6000);
    return () => window.clearTimeout(t);
  }, [visible, reduced, runOpen]);

  // Reduced motion: crossfade out
  useEffect(() => {
    if (!visible || !reduced) return;
    const el = rootRef.current;
    if (!el) {
      finish();
      return;
    }
    const tw = gsap.to(el, {
      opacity: 0,
      duration: 0.6,
      ease: "power1.out",
      onComplete: finish,
    });
    return () => {
      tw.kill();
    };
  }, [visible, reduced, finish]);

  // Master timeline + breath + dust
  useEffect(() => {
    if (!visible || reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    const envelope = q("[data-env]")[0] as HTMLElement;
    const flap = q("[data-flap]")[0] as HTMLElement;
    const seal = q("[data-seal]")[0] as HTMLElement;
    const card = q("[data-card]")[0] as HTMLElement;
    const liner = q("[data-liner]")[0] as HTMLElement;
    const dustHost = q("[data-dust]")[0] as HTMLElement;
    const hintEl = q("[data-hint]")[0] as HTMLElement;

    gsap.set(flap, { transformOrigin: "50% 0%", rotationX: 0 });
    gsap.set(card, { yPercent: 35, rotation: -2, scale: 0.92, opacity: 1 });
    gsap.set(seal, { transformOrigin: "50% 50%" });

    // Breath float
    const breath = gsap.to(envelope, {
      y: -8,
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Hint pulse
    const pulse = hintEl
      ? gsap.to(hintEl, {
          opacity: 0.35,
          duration: 1.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      : null;

    // Gold dust — capped GSAP particles
    const particles: HTMLSpanElement[] = [];
    if (dustHost) {
      const count = Math.min(PARTICLE_CAP, 28);
      for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        s.className = "pointer-events-none absolute block rounded-full";
        const size = 1.5 + Math.random() * 2.5;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.background = i % 3 === 0 ? "#F3DC8A" : "#C9A227";
        s.style.opacity = "0";
        s.style.left = `${10 + Math.random() * 80}%`;
        s.style.top = `${20 + Math.random() * 60}%`;
        dustHost.appendChild(s);
        particles.push(s);
        gsap.to(s, {
          opacity: 0.15 + Math.random() * 0.45,
          y: -40 - Math.random() * 80,
          x: -20 + Math.random() * 40,
          duration: 3 + Math.random() * 4,
          delay: Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }

    const burstDust = () => {
      if (!dustHost) return;
      for (let i = 0; i < 12; i++) {
        const s = document.createElement("span");
        s.className = "pointer-events-none absolute block rounded-full";
        s.style.width = "3px";
        s.style.height = "3px";
        s.style.background = "#F3DC8A";
        s.style.left = "50%";
        s.style.top = "42%";
        dustHost.appendChild(s);
        gsap.fromTo(
          s,
          { opacity: 1, x: 0, y: 0, scale: 1 },
          {
            opacity: 0,
            x: -40 + Math.random() * 80,
            y: 20 + Math.random() * 60,
            scale: 0.2,
            duration: 0.7,
            ease: "power2.out",
            onComplete: () => s.remove(),
          }
        );
      }
    };

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
    });
    tlRef.current = tl;

    tl.addLabel("idle", 0);
    tl.addLabel("open", 0.01);

    // a) seal cracks & drops
    tl.to(
      seal,
      {
        rotation: 18,
        scaleX: 1.05,
        duration: 0.18,
        ease: "power1.in",
        onStart: burstDust,
      },
      "open"
    )
      .to(
        seal,
        {
          y: 140,
          rotation: 48,
          opacity: 0,
          scale: 0.7,
          duration: 0.55,
          ease: "power2.in",
        },
        "open+=0.15"
      )
      // b) flap opens 3D
      .set(flap, { zIndex: 6 }, "open+=0.35")
      .to(
        flap,
        {
          rotationX: -180,
          duration: 1.05,
          ease: "power3.inOut",
        },
        "open+=0.35"
      )
      .set(flap, { zIndex: 1 }, "open+=0.9")
      .set(card, { zIndex: 8 }, "open+=0.9")
      // c) card slides up
      .to(
        card,
        {
          yPercent: -8,
          rotation: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        "open+=0.85"
      )
      // d) card fills viewport; envelope drops — dissolve onto scene-1 underlay
      .to(
        card,
        {
          scale: 2.55,
          yPercent: -10,
          opacity: 0.35,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "open+=1.55"
      )
      .to(
        [envelope, liner, flap],
        {
          y: 120,
          opacity: 0,
          duration: 0.85,
          ease: "power2.in",
        },
        "open+=1.55"
      )
      .to(hintEl, { opacity: 0, duration: 0.25 }, "open+=0.2")
      // Fade plate to ivory so scene-1 underlay shows (no black flash)
      .to(
        root,
        {
          backgroundColor: "rgba(247,241,230,0)",
          duration: 0.85,
          ease: "power1.inOut",
        },
        "open+=2.2"
      )
      .to(
        card,
        { opacity: 0, duration: 0.55, ease: "power1.out" },
        "open+=2.35"
      )
      .to(
        root,
        {
          opacity: 0,
          duration: 0.45,
          ease: "power1.inOut",
          onComplete: finish,
        },
        "open+=2.7"
      );

    // Total open sequence ~3.3s after tap; idle breath before that.
    // Master length with labels ≈ 7s story if including idle breath feel.

    return () => {
      breath.kill();
      pulse?.kill();
      particles.forEach((p) => {
        gsap.killTweensOf(p);
        p.remove();
      });
      tl.kill();
      tlRef.current = null;
    };
  }, [visible, reduced, finish]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-hidden px-5"
      style={{ backgroundColor: "#4A0E22" }}
      role="dialog"
      aria-label="Wedding invitation envelope"
    >
      {/* SVG defs: paper grain + jaali */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.85
                      0 0 0 0 0.72
                      0 0 0 0 0.45
                      0 0 0 0.12 0"
              in="noise"
            />
          </filter>
          <pattern
            id="jaali"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="14" cy="14" r="1.2" fill="#C9A227" opacity="0.35" />
            <path
              d="M14 4c2 4 6 6 10 6-4 2-6 6-6 10-2-4-6-6-10-6 4-2 6-6 6-10z"
              fill="none"
              stroke="#C9A227"
              strokeWidth="0.4"
              opacity="0.25"
            />
          </pattern>
        </defs>
      </svg>

      <div data-dust className="pointer-events-none absolute inset-0 z-20" />

      <button
        type="button"
        data-env
        className="relative z-10 w-full max-w-[300px] border-0 bg-transparent p-0 text-left"
        style={{ perspective: "900px" }}
        onClick={runOpen}
        aria-label="Open invitation envelope"
      >
        {/* Envelope body */}
        <div
          className="relative aspect-[5/3.4] w-full overflow-hidden rounded-sm shadow-[0_28px_60px_rgba(0,0,0,0.45)]"
          style={{
            background: "linear-gradient(160deg, #5C142C 0%, #3A0A1A 100%)",
            border: "1px solid rgba(201,162,39,0.35)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40 paper-grain"
            aria-hidden="true"
          />

          {/* Liner with jaali */}
          <div
            data-liner
            className="absolute inset-[8%] overflow-hidden rounded-[2px]"
            style={{
              background: "linear-gradient(180deg, #F6EFE2 0%, #E8D9C0 100%)",
            }}
          >
            <svg className="h-full w-full" aria-hidden="true">
              <rect width="100%" height="100%" fill="url(#jaali)" />
            </svg>
          </div>

          {/* Card */}
          <div
            data-card
            className="absolute inset-x-[12%] top-[10%] z-[5] flex aspect-[3/4] flex-col items-center justify-center px-4 py-5 text-center shadow-lg"
            style={{
              background: "linear-gradient(180deg, #FFF9F0 0%, #F3E6D0 100%)",
              border: "1px solid rgba(201,162,39,0.45)",
              color: "#2A1A14",
            }}
          >
            <p
              lang="hi"
              className="type-hi-display foil-text text-[0.95rem] leading-[1.7]"
            >
              {invocation}
            </p>
            <p
              lang="hi"
              className="type-hi-display foil-text mt-3 text-[1.35rem] leading-[1.7]"
            >
              {title}
            </p>
            <p className="type-label foil-text mt-5 tracking-[0.2em]">
              {config.monogram}
            </p>
            <p className="type-name mt-3 text-[0.95rem] text-[#2A1A14]">
              {config.bride.name}
            </p>
            <p className="type-amp foil-text my-0.5">&</p>
            <p className="type-name text-[0.95rem] text-[#2A1A14]">
              {config.groom.name}
            </p>
          </div>

          {/* Flap */}
          <div
            data-flap
            className="absolute inset-x-0 top-0 z-[7] origin-top"
            style={{
              height: "58%",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(180deg, #6B1A36 0%, #4A0E22 70%, #3A0A1A 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                borderTop: "1px solid rgba(201,162,39,0.4)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              }}
            />
          </div>

          {/* Wax seal */}
          <div
            data-seal
            className="pointer-events-none absolute left-1/2 top-[38%] z-[9] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #E8A33D, #8B1E3F 55%, #5C0F28)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
              border: "1px solid rgba(243,220,138,0.5)",
            }}
          >
            <span className="type-label foil-text text-[9px] tracking-[0.15em]">
              {config.monogram}
            </span>
          </div>
        </div>
      </button>

      {hint && (
        <button
          type="button"
          data-hint
          onClick={runOpen}
          className="type-label relative z-10 mt-10 border-0 bg-transparent foil-text"
        >
          Tap to open
        </button>
      )}

      <MagneticButton
        onClick={() => {
          markEnvelopeSeen();
          onSkip();
        }}
        className="type-label absolute bottom-8 left-1/2 z-30 min-h-11 -translate-x-1/2 px-3 underline-offset-4 hover:underline"
        style={{ color: "rgba(243,220,138,0.75)" }}
        strength={8}
      >
        Skip the film to wedding details
      </MagneticButton>
    </div>
  );
}
