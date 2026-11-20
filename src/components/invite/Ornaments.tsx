"use client";

import type { ThemePresetId } from "@/types/invite";

type Props = {
  preset: ThemePresetId;
  color?: string;
  className?: string;
  variant?: "arch" | "divider" | "corner" | "border";
};

export function Ornament({
  preset,
  color = "currentColor",
  className = "",
  variant = "arch",
}: Props) {
  if (variant === "divider") {
    return (
      <svg
        className={className}
        viewBox="0 0 200 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 12 H78 M122 12 H190"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        {preset === "marigold-festive" ? (
          <circle cx="100" cy="12" r="5" fill={color} opacity="0.7" />
        ) : preset === "pastel-garden" ? (
          <path
            d="M100 6 C104 10 104 14 100 18 C96 14 96 10 100 6 Z"
            fill={color}
            opacity="0.7"
          />
        ) : (
          <path
            d="M100 4 L104 12 L100 20 L96 12 Z"
            fill={color}
            opacity="0.7"
          />
        )}
      </svg>
    );
  }

  if (variant === "corner") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="M4 44 V16 Q4 4 16 4 H44"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.55"
        />
        <circle cx="10" cy="10" r="2" fill={color} opacity="0.5" />
      </svg>
    );
  }

  if (variant === "border") {
    return (
      <svg
        className={className}
        viewBox="0 0 300 400"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="8"
          width="284"
          height="384"
          rx={preset === "royal-palace" ? 4 : 16}
          stroke={color}
          strokeWidth="1.5"
          opacity="0.35"
        />
        <rect
          x="14"
          y="14"
          width="272"
          height="372"
          rx={preset === "royal-palace" ? 2 : 12}
          stroke={color}
          strokeWidth="0.75"
          opacity="0.25"
        />
      </svg>
    );
  }

  // Arch (default) — motif varies by preset
  if (preset === "midnight-gold") {
    return (
      <svg className={className} viewBox="0 0 280 80" fill="none" aria-hidden="true">
        <path
          d="M20 70 Q20 20 140 20 Q260 20 260 70"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.55"
        />
        <path
          d="M40 70 Q40 36 140 36 Q240 36 240 70"
          stroke={color}
          strokeWidth="0.75"
          opacity="0.35"
        />
        <circle cx="140" cy="20" r="3" fill={color} opacity="0.6" />
      </svg>
    );
  }

  if (preset === "pastel-garden") {
    return (
      <svg className={className} viewBox="0 0 280 80" fill="none" aria-hidden="true">
        <path
          d="M30 70 C30 30 80 18 140 18 C200 18 250 30 250 70"
          stroke={color}
          strokeWidth="1.25"
          opacity="0.5"
        />
        <path d="M120 28 C130 18 150 18 160 28" stroke={color} strokeWidth="1" opacity="0.45" />
        <circle cx="140" cy="22" r="4" fill={color} opacity="0.4" />
      </svg>
    );
  }

  if (preset === "marigold-festive") {
    return (
      <svg className={className} viewBox="0 0 280 80" fill="none" aria-hidden="true">
        <path
          d="M20 70 L40 40 L70 55 L100 30 L140 50 L180 28 L210 55 L240 40 L260 70"
          stroke={color}
          strokeWidth="1.25"
          opacity="0.5"
          fill="none"
        />
        <circle cx="140" cy="50" r="6" fill={color} opacity="0.45" />
      </svg>
    );
  }

  // Royal palace — ornate pointed arch
  return (
    <svg className={className} viewBox="0 0 280 90" fill="none" aria-hidden="true">
      <path
        d="M24 80 V48 Q24 20 80 20 L120 20 Q140 8 160 20 L200 20 Q256 20 256 48 V80"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M40 80 V52 Q40 32 90 32 L120 32 Q140 22 160 32 L190 32 Q240 32 240 52 V80"
        stroke={color}
        strokeWidth="0.75"
        opacity="0.35"
      />
      <circle cx="140" cy="14" r="3.5" fill={color} opacity="0.55" />
    </svg>
  );
}

export function FloralCorners({ color = "currentColor", className = "" }: { color?: string; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Ornament variant="corner" color={color} className="absolute left-3 top-3 h-10 w-10" preset="royal-palace" />
      <Ornament
        variant="corner"
        color={color}
        className="absolute right-3 top-3 h-10 w-10 -scale-x-100"
        preset="royal-palace"
      />
      <Ornament
        variant="corner"
        color={color}
        className="absolute bottom-3 left-3 h-10 w-10 -scale-y-100"
        preset="royal-palace"
      />
      <Ornament
        variant="corner"
        color={color}
        className="absolute bottom-3 right-3 h-10 w-10 -scale-x-100 -scale-y-100"
        preset="royal-palace"
      />
    </div>
  );
}
