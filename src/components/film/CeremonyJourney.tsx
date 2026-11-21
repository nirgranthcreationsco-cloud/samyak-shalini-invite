"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InviteEvent } from "@/types/invite";
import { parseISODate, weekdayFromISO } from "@/lib/dates";
import { hindiEventTitle } from "@/lib/hindi";
import { downloadICS } from "@/lib/ics";
import { usePrefersReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  events: InviteEvent[];
  hindiEvents?: Record<string, string>;
  gold: string;
  coupleLabel: string;
  /** Skip events already shown elsewhere (e.g. Dev Darshan hero). */
  excludeIds?: string[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

function dayNum(iso: string): string {
  const d = parseISODate(iso);
  return d ? String(d.getDate()).padStart(2, "0") : "";
}

function monthName(iso: string): string {
  const d = parseISODate(iso);
  return d ? d.toLocaleString("en-US", { month: "long" }) : "";
}

/** Parse "8:00 AM" / "5:00 PM onwards" into minutes-from-midnight for ordering. */
function timeToMinutes(time: string): number {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 0;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

function sortByDate(events: InviteEvent[]): InviteEvent[] {
  return [...events].sort((a, b) => {
    const da = parseISODate(a.date)?.getTime() ?? 0;
    const db = parseISODate(b.date)?.getTime() ?? 0;
    if (da !== db) return da - db;
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });
}

function DiyaIcon({ gold, active }: { gold: string; active?: boolean }) {
  return (
    <svg
      data-diya
      width="28"
      height="28"
      viewBox="0 0 28 28"
      aria-hidden="true"
      style={{
        filter: active ? `drop-shadow(0 0 8px ${gold})` : undefined,
        transition: "filter 0.4s ease",
      }}
    >
      <ellipse cx="14" cy="20" rx="9" ry="4" fill={gold} opacity="0.85" />
      <path
        d="M5 18c2-2 4-3 9-3s7 1 9 3"
        fill="none"
        stroke={gold}
        strokeWidth="1.2"
      />
      <path
        data-diya-flame
        d="M14 16c0-3 2.5-5 2.5-7.5C16.5 6 14 4.5 14 4.5S11.5 6 11.5 8.5C11.5 11 14 13 14 16z"
        fill="#E07A1F"
        opacity="0.95"
      />
    </svg>
  );
}

/**
 * Progressive enhancement: cards are fully visible in HTML/CSS.
 * GSAP only adds a one-shot reveal; never leaves content at opacity 0.
 */
export function CeremonyJourney({
  events,
  hindiEvents,
  gold,
  coupleLabel,
  excludeIds = [],
  eyebrow = "The day continues",
  title = "Ceremonies",
  subtitle,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const ordered = useMemo(() => {
    const skip = new Set(excludeIds);
    return sortByDate(events.filter((e) => !skip.has(e.id)));
  }, [events, excludeIds]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-ceremony-card]")
    );
    if (!cards.length) return;

    const scroller =
      (root.closest(".invite-film") as HTMLElement | null) ?? undefined;

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        const line = card.querySelector("[data-card-line]") as SVGGeometryElement | null;
        const diya = card.querySelector("[data-diya]") as HTMLElement | null;
        const flame = card.querySelector("[data-diya-flame]") as HTMLElement | null;
        const body = card.querySelector("[data-card-body]") as HTMLElement | null;

        if (line) {
          const len = line.getTotalLength?.() ?? 320;
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        }

        // Enhance only — never leave content at opacity 0
        gsap.from(body, {
          y: 24,
          clipPath: "inset(12% 0 0 0)",
          immediateRender: false,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            scroller,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
            onEnter: () => {
              if (line) {
                gsap.to(line, {
                  strokeDashoffset: 0,
                  duration: 0.75,
                  ease: "power2.out",
                });
              }
              if (diya) {
                gsap.to(diya, {
                  filter: `drop-shadow(0 0 10px ${gold})`,
                  duration: 0.5,
                });
              }
              if (flame) {
                gsap.to(flame, {
                  scaleY: 1.15,
                  transformOrigin: "50% 100%",
                  yoyo: true,
                  repeat: 3,
                  duration: 0.35,
                  ease: "sine.inOut",
                });
              }
            },
          },
        });
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [ordered.length, reduced, gold]);

  if (!ordered.length) return null;

  return (
    <section
      ref={rootRef}
      data-chapter="ceremony"
      className="relative overflow-hidden px-5 py-12"
      style={{ background: "#F7F1E6", color: "#2A1A14" }}
    >
      <p className="type-label text-center" style={{ color: "#8A6A1F" }}>
        {eyebrow}
      </p>
      <h2 className="type-title mt-2 text-center text-[#2A1A14]">{title}</h2>
      {subtitle && (
        <p className="type-body mx-auto mt-3 max-w-[18rem] text-center text-[16px] text-[#2A1A14]/70">
          {subtitle}
        </p>
      )}

      <ol className="relative z-10 mx-auto mt-8 max-w-[360px] space-y-5">
        {ordered.map((ev) => {
          const hi =
            hindiEvents?.[ev.id] ?? hindiEventTitle(ev.id) ?? ev.title;
          return (
            <li
              key={ev.id}
              data-ceremony-card
              className="overflow-hidden rounded-2xl border bg-[#FFFBF5] text-left shadow-[0_12px_32px_rgba(42,26,20,0.08)]"
              style={{ borderColor: `${gold}66` }}
            >
              <svg
                className="block h-[2px] w-full"
                viewBox="0 0 360 2"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  data-card-line
                  x1="0"
                  y1="1"
                  x2="360"
                  y2="1"
                  stroke={gold}
                  strokeWidth="2"
                />
              </svg>

              <div data-card-body className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="type-name leading-none"
                      style={{
                        fontSize: "clamp(2rem, 10vw, 2.5rem)",
                        color: "transparent",
                        WebkitTextStroke: `1.25px ${gold}`,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {dayNum(ev.date)}
                    </p>
                    <p
                      className="type-label mt-2 tracking-[0.16em]"
                      style={{ color: "#8A6A1F" }}
                    >
                      {weekdayFromISO(ev.date)} · {monthName(ev.date)}
                    </p>
                  </div>
                  <DiyaIcon gold={gold} />
                </div>

                <h3 lang="hi" className="type-hi-display mt-3 text-[#2A1A14]">
                  {hi}
                </h3>
                <p className="type-title mt-1 text-[#2A1A14]">{ev.title}</p>
                <p className="type-body mt-2 text-[16px] text-[#2A1A14]">
                  {ev.time}
                </p>
                <p className="type-body mt-1 text-[16px] font-medium text-[#2A1A14]">
                  {ev.venueName}
                </p>
                <p className="type-body mt-0.5 text-[16px] text-[#2A1A14]/75">
                  {ev.venueAddress}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => downloadICS(ev, coupleLabel)}
                    className="type-label flex min-h-11 w-full items-center justify-center border text-[16px] tracking-[0.14em]"
                    style={{ borderColor: gold, color: "#5A0F2B" }}
                  >
                    Add to Calendar
                  </button>
                  {ev.mapUrl && (
                    <a
                      href={ev.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-label flex min-h-11 w-full items-center justify-center text-[16px] tracking-[0.14em]"
                      style={{ background: gold, color: "#2A1A14" }}
                    >
                      Get Directions
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
