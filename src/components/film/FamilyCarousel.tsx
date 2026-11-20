"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  hostLine?: string;
  brideParents: string;
  groomParents: string;
  families: string[];
  gold: string;
};

type Card = { title: string; names: string[] };

function chunk(arr: string[], size: number): string[][] {
  const out: string[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildCards(
  hostLine: string | undefined,
  brideParents: string,
  groomParents: string,
  families: string[]
): Card[] {
  const cards: Card[] = [];
  if (hostLine) cards.push({ title: "Host family", names: [hostLine] });
  cards.push({ title: "Bride's family", names: [brideParents] });
  cards.push({ title: "Groom's family", names: [groomParents] });

  const rest = families.filter(Boolean);
  const size = rest.length > 12 ? 5 : Math.min(6, Math.max(4, rest.length || 4));
  chunk(rest, size).forEach((names, i) => {
    cards.push({
      title: rest.length > size ? `Family · ${i + 1}` : "With love",
      names,
    });
  });
  return cards;
}

export function FamilyCarousel({
  hostLine,
  brideParents,
  groomParents,
  families,
  gold,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const cards = useMemo(
    () => buildCards(hostLine, brideParents, groomParents, families),
    [hostLine, brideParents, groomParents, families]
  );
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      const len = cards.length;
      if (!len) return;
      const i = ((next % len) + len) % len;
      setIndex(i);
    },
    [cards.length]
  );

  useEffect(() => {
    if (reduced || cards.length <= 1) return;
    const id = window.setInterval(() => {
      if (paused.current) return;
      setIndex((i) => (i + 1) % cards.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [reduced, cards.length]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    const active = stage.querySelector("[data-fam-active]");
    if (!active) return;
    gsap.from(active, {
      y: 16,
      rotateX: -8,
      immediateRender: false,
      duration: 0.55,
      ease: "power2.out",
    });
  }, [index, reduced]);

  if (reduced) {
    return (
      <div
        className="mt-6 grid gap-3 text-left text-sm leading-relaxed"
        style={{ color: "#2A1A14" }}
      >
        {cards.map((c) => (
          <div
            key={c.title + c.names[0]}
            className="border bg-[#FFFBF5] px-3 py-3"
            style={{ borderColor: `${gold}66` }}
          >
            <p className="type-label mb-2" style={{ color: "#8A6A1F" }}>
              {c.title}
            </p>
            {c.names.map((n) => (
              <p key={n} className="type-body py-0.5 text-[#2A1A14]/90">
                {n}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }

  const card = cards[index];

  return (
    <div
      className="mt-6 w-full"
      onPointerEnter={() => {
        paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
      onTouchStart={() => {
        paused.current = true;
      }}
      onTouchEnd={() => {
        window.setTimeout(() => {
          paused.current = false;
        }, 2500);
      }}
    >
      <div
        ref={stageRef}
        className="relative min-h-[9.5rem] overflow-hidden border bg-[#FFFBF5] px-4 py-4 text-left"
        style={{
          borderColor: `${gold}66`,
          perspective: "800px",
          color: "#2A1A14",
          boxShadow: "0 10px 28px rgba(42,26,20,0.08)",
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          const end = e.changedTouches[0]?.clientX;
          if (start == null || end == null) return;
          const dx = end - start;
          if (Math.abs(dx) < 40) return;
          go(index + (dx < 0 ? 1 : -1));
        }}
      >
        {card && (
          <div data-fam-active key={index} style={{ transformStyle: "preserve-3d" }}>
            <p className="type-label mb-2" style={{ color: "#8A6A1F" }}>
              {card.title}
            </p>
            <div aria-live="polite" aria-atomic="true">
              {card.names.map((n) => (
                <p key={n} className="type-body py-0.5 text-[16px] text-[#2A1A14]">
                  {n}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          className="type-label min-h-11 px-2 opacity-80"
          style={{ color: gold }}
          onClick={() => go(index - 1)}
          aria-label="Previous family group"
        >
          Prev
        </button>
        <div className="flex gap-1.5" role="tablist" aria-label="Family groups">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Group ${i + 1}`}
              onClick={() => go(i)}
              className="h-2 w-2 rounded-full"
              style={{
                background: i === index ? gold : `${gold}44`,
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="type-label min-h-11 px-2 opacity-80"
          style={{ color: gold }}
          onClick={() => go(index + 1)}
          aria-label="Next family group"
        >
          Next
        </button>
      </div>
    </div>
  );
}
