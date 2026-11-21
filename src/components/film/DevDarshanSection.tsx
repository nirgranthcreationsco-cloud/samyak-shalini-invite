"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InviteEvent } from "@/types/invite";
import { formatLongDate, parseISODate, weekdayFromISO } from "@/lib/dates";
import { hindiEventTitle } from "@/lib/hindi";
import { usePrefersReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  event: InviteEvent;
  hindiTitle: string;
  gold: string;
};

/** Compact Dev Darshan (~1.2svh max). Content visible by default. */
export function DevDarshanSection({ event, hindiTitle, gold }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const day = parseISODate(event.date)?.getDate() ?? 0;
  const month = parseISODate(event.date)
    ? parseISODate(event.date)!.toLocaleString("en-US", { month: "long" })
    : "";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const scroller =
      (root.closest(".invite-film") as HTMLElement | null) ?? undefined;

    const arch = root.querySelector("[data-arch-path]") as SVGGeometryElement | null;
    const numeral = root.querySelector("[data-day-num]") as HTMLElement | null;
    const lotus = root.querySelector("[data-lotus]") as HTMLElement | null;
    const flame = root.querySelector("[data-flame]") as HTMLElement | null;
    const flower = root.querySelector("[data-flower]") as HTMLElement | null;
    const rise = root.querySelector("[data-dd-rise]") as HTMLElement | null;

    const ctx = gsap.context(() => {
      if (arch) {
        const len = arch.getTotalLength?.() ?? 400;
        gsap.set(arch, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(arch, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            scroller,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }

      if (numeral) {
        // Keep the real day visible; enhance with a short count from day-4
        const startN = Math.max(0, day - 4);
        numeral.textContent = String(day).padStart(2, "0");
        const obj = { n: startN };
        gsap.to(obj, {
          n: day,
          duration: 0.9,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            scroller,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
          onUpdate: () => {
            numeral.textContent = String(Math.round(obj.n)).padStart(2, "0");
          },
          onComplete: () => {
            numeral.textContent = String(day).padStart(2, "0");
          },
        });
      }

      if (lotus) {
        gsap.from(lotus, {
          scale: 0.7,
          transformOrigin: "50% 80%",
          immediateRender: false,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            scroller,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }
      if (flame) {
        gsap.to(flame, {
          scaleY: 1.2,
          transformOrigin: "50% 100%",
          yoyo: true,
          repeat: -1,
          duration: 0.55,
          ease: "sine.inOut",
        });
      }
      if (flower) {
        gsap.to(flower, {
          y: 14,
          rotation: 18,
          yoyo: true,
          repeat: -1,
          duration: 1.8,
          ease: "sine.inOut",
        });
      }
      if (rise) {
        gsap.from(rise, {
          y: 16,
          immediateRender: false,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            scroller,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [day, reduced, gold]);

  const title =
    hindiTitle || hindiEventTitle(event.id) || event.title;

  return (
    <section
      ref={rootRef}
      data-chapter="dev"
      data-dd-rise
      className="relative mx-auto flex max-h-[120svh] min-h-0 flex-col items-center overflow-hidden px-5 py-12 text-center"
      style={{
        background: "linear-gradient(180deg, #E8A33D 0%, #F6EFE2 70%)",
        color: "#2A1A14",
      }}
    >
      <div className="relative mx-auto w-full max-w-[280px]">
        <svg
          viewBox="0 0 280 120"
          className="pointer-events-none absolute inset-x-0 -top-2 mx-auto h-[7.5rem] w-full"
          aria-hidden="true"
        >
          <path
            data-arch-path
            d="M20 110 Q20 20 140 20 Q260 20 260 110"
            fill="none"
            stroke={gold}
            strokeWidth="1.5"
          />
        </svg>
        <p
          lang="hi"
          className="type-hi-display relative z-10 pt-8 text-[#2A1A14]"
        >
          {title}
        </p>
      </div>

      <p
        data-day-num
        className="type-name mt-3 leading-none"
        style={{
          fontSize: "clamp(3rem, 16vw, 4.25rem)",
          color: "transparent",
          WebkitTextStroke: `1.25px #5A0F2B`,
          letterSpacing: "0.04em",
        }}
      >
        {String(day).padStart(2, "0")}
      </p>

      <p className="type-title mt-2 text-[#2A1A14]">
        {weekdayFromISO(event.date)}
      </p>
      <p className="type-body mt-1 text-[16px] text-[#2A1A14]/85">
        {month} · {event.time}
      </p>
      <p className="type-body mt-1 text-[15px] text-[#2A1A14]/65">
        {formatLongDate(event.date)}
      </p>

      {/* Lotus · diya · flower */}
      <div className="mt-6 flex items-end justify-center gap-8" aria-hidden="true">
        <svg data-lotus width="36" height="36" viewBox="0 0 36 36">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="18"
              cy="14"
              rx="4"
              ry="10"
              fill={gold}
              opacity="0.45"
              transform={`rotate(${deg} 18 22)`}
            />
          ))}
          <circle cx="18" cy="22" r="3.5" fill={gold} />
        </svg>
        <svg width="28" height="32" viewBox="0 0 28 32">
          <ellipse cx="14" cy="24" rx="9" ry="4" fill={gold} />
          <path
            data-flame
            d="M14 20c0-3.5 3-6 3-9 0-2.5-3-4.5-3-4.5S11 8.5 11 11c0 3 3 5.5 3 9z"
            fill="#E07A1F"
          />
        </svg>
        <svg data-flower width="28" height="28" viewBox="0 0 28 28">
          <ellipse cx="14" cy="14" rx="5" ry="9" fill="#E07A1F" opacity="0.85" />
          <ellipse
            cx="14"
            cy="14"
            rx="5"
            ry="9"
            fill="#E8A33D"
            opacity="0.7"
            transform="rotate(60 14 14)"
          />
          <ellipse
            cx="14"
            cy="14"
            rx="5"
            ry="9"
            fill="#C43C2A"
            opacity="0.55"
            transform="rotate(120 14 14)"
          />
          <circle cx="14" cy="14" r="2.5" fill={gold} />
        </svg>
      </div>

      <p className="type-body mt-6 text-[16px] font-medium text-[#2A1A14]">
        {event.venueName}
      </p>
      <p className="type-body mt-1 max-w-[18rem] text-[15px] text-[#2A1A14]/75">
        {event.venueAddress}
      </p>
      {event.mapUrl && (
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="type-label mt-5 inline-flex min-h-11 items-center justify-center px-5"
          style={{ background: gold, color: "#2A1A14", borderRadius: 8 }}
        >
          Get Directions
        </a>
      )}
    </section>
  );
}
