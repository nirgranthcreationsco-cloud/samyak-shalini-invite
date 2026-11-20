"use client";

/** Decorative transition layers — animated via GSAP scrub. Light-theme friendly. */

export function GoldWipe({ className = "" }: { className?: string }) {
  return (
    <div
      data-wipe
      className={`pointer-events-none absolute inset-0 z-30 ${className}`}
      style={{
        background: "linear-gradient(90deg, #E8D9C0 0%, #F3DC8A 45%, #E8D9C0 100%)",
        transform: "translateX(-105%)",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}

export function VerticalCurtain({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        data-curtain-top
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background: "linear-gradient(180deg, #F7F1E6 0%, #EDE3D0 100%)",
          transform: "translateY(0%)",
          willChange: "transform",
        }}
      />
      <div
        data-curtain-bot
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: "linear-gradient(0deg, #F7F1E6 0%, #EDE3D0 100%)",
          transform: "translateY(0%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

export function IrisReveal({ className = "" }: { className?: string }) {
  return (
    <div
      data-iris
      className={`pointer-events-none absolute inset-0 z-30 ${className}`}
      style={{
        background: "#F7F1E6",
        clipPath: "circle(150% at 50% 50%)",
        willChange: "clip-path",
      }}
      aria-hidden="true"
    />
  );
}
