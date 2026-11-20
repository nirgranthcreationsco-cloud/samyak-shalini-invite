"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

/**
 * Bottom info panel — fully visible by default (progressive enhancement).
 * GSAP may animate clip-path as enhancement only.
 */
export function GlassBottom({
  children,
  className = "",
  tone = "light",
}: Props) {
  const light = tone === "light";
  return (
    <div
      data-glass-bottom
      className={`pointer-events-auto absolute inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 mx-auto max-w-[380px] px-4 py-3.5 text-center ${className}`}
      style={{
        background: light
          ? "rgba(255, 251, 245, 0.9)"
          : "rgba(12, 10, 8, 0.55)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: light
          ? "1px solid rgba(201, 162, 39, 0.55)"
          : "1px solid rgba(201, 162, 39, 0.45)",
        borderRadius: 14,
        boxShadow: light
          ? "0 12px 36px rgba(42, 26, 20, 0.12)"
          : "0 12px 36px rgba(0,0,0,0.25)",
        color: light ? "#2A1A14" : "#F6EFE2",
      }}
    >
      {children}
    </div>
  );
}
