"use client";

import { useEffect, useState } from "react";
import { parseISODate } from "@/lib/dates";
import { useHasMounted } from "@/lib/hooks";

type Parts = { days: number; hours: number; minutes: number };

const ZERO: Parts = { days: 0, hours: 0, minutes: 0 };

function calc(iso: string): Parts {
  const d = parseISODate(iso);
  if (!d) return ZERO;
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { days, hours, minutes };
}

type Props = {
  dateISO: string;
  gold?: string;
  className?: string;
};

/** Compact elegant countdown — one line of foil numerals, no heavy chrome. */
export function Countdown({
  dateISO,
  gold = "#C9A227",
  className = "",
}: Props) {
  const mounted = useHasMounted();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30000);
    return () => window.clearInterval(id);
  }, []);

  const parts = mounted ? calc(dateISO) : ZERO;
  void tick;

  const unit = (n: number, label: string) => (
    <div data-count-unit className="flex flex-col items-center gap-1.5">
      <span
        className="type-name tabular-nums leading-none"
        style={{
          fontSize: "clamp(1.75rem, 8vw, 2.25rem)",
          color: "transparent",
          WebkitTextStroke: `1.25px ${gold}`,
          letterSpacing: "0.06em",
        }}
      >
        {String(n).padStart(2, "0")}
      </span>
      <span
        className="type-label text-[11px] tracking-[0.28em]"
        style={{ color: "#8A6A1F" }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      data-countdown
      className={`inline-flex items-center gap-4 sm:gap-5 ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {unit(parts.days, "Days")}
      <span
        aria-hidden="true"
        className="mb-5 h-8 w-px"
        style={{ background: `${gold}55` }}
      />
      {unit(parts.hours, "Hrs")}
      <span
        aria-hidden="true"
        className="mb-5 h-8 w-px"
        style={{ background: `${gold}55` }}
      />
      {unit(parts.minutes, "Min")}
    </div>
  );
}
