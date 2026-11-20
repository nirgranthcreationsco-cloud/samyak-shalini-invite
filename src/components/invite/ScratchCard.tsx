"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FallingPetals } from "@/components/invite/FallingPetals";
import { formatDateRange } from "@/lib/dates";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  dates: string[];
  gold?: string;
  label?: string;
};

const REVEAL_RATIO = 0.55;

function paintFoil(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  gold: string,
  label: string
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#F5E6A8");
  grad.addColorStop(0.35, gold);
  grad.addColorStop(0.55, "#FFE9A0");
  grad.addColorStop(0.75, gold);
  grad.addColorStop(1, "#A67C00");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = -h; i < w + h; i += 18) {
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + h, h);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(80,50,0,0.55)";
  ctx.font = `600 ${Math.max(14, Math.floor(h * 0.14))}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, w / 2, h / 2);
}

export function ScratchCard({
  dates,
  gold = "#C9A227",
  label = "Save the date",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scratchingRef = useRef(false);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [showPetals, setShowPetals] = useState(false);
  const reduced = usePrefersReducedMotion();
  const dateText = formatDateRange(dates);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const resize = () => {
      const w = wrap.clientWidth || 300;
      const h = Math.max(110, Math.round(w * 0.42));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil(ctx, w, h, gold, label);
      revealedRef.current = false;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [gold, label, revealed]);

  const checkReveal = useCallback(() => {
    if (revealedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    let samples = 0;
    const step = 4 * 10;
    for (let i = 3; i < data.length; i += step) {
      samples++;
      if (data[i] < 28) transparent++;
    }
    if (samples > 0 && transparent / samples >= REVEAL_RATIO) {
      revealedRef.current = true;
      setRevealed(true);
      setShowPetals(true);
      ctx.clearRect(0, 0, width, height);
      window.setTimeout(() => setShowPetals(false), 3000);
    }
  }, []);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      if (revealedRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * canvas.width;
      const y = ((clientY - rect.top) / rect.height) * canvas.height;
      // work in device pixels; radius scaled
      const radius = Math.max(canvas.width, canvas.height) * 0.045;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      checkReveal();
    },
    [checkReveal]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    e.preventDefault();
    scratchingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!scratchingRef.current) return;
    e.preventDefault();
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    scratchingRef.current = false;
  };

  const revealNow = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    setShowPetals(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    window.setTimeout(() => setShowPetals(false), 3000);
  };

  return (
    <div className="relative w-full max-w-[320px]">
      {showPetals && (
        <FallingPetals
          burst
          burstDurationMs={2400}
          origin="card"
          count={14}
          className="z-20"
          colors={["#D4AF37", "#E8A33D", "#F0D78C", "#C9A227"]}
        />
      )}

      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-xl border shadow-sm"
        style={{ borderColor: `${gold}66`, background: "#FFFBF5" }}
      >
        <div className="flex min-h-[110px] flex-col items-center justify-center px-4 py-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Save the date
          </p>
          <p
            className="mt-2 font-[family-name:var(--font-heading)] text-2xl leading-snug"
            style={{ color: gold }}
          >
            {dateText || "Coming soon"}
          </p>
        </div>

        {!revealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-pointer"
            style={{ touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="img"
            aria-label="Gold scratch card covering the wedding date"
          />
        )}
      </div>

      {!revealed && (
        <button
          type="button"
          onClick={revealNow}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-lg border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: `${gold}88`,
            color: gold,
            boxShadow: reduced ? `0 0 0 2px ${gold}` : undefined,
          }}
        >
          Tap to reveal
        </button>
      )}

    </div>
  );
}
