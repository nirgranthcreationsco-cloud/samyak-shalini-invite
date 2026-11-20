"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GoldDustCanvas } from "@/components/film/GoldDustCanvas";
import { LotusBloom } from "@/components/film/LotusBloom";
import { PalaceDoors } from "@/components/film/PalaceDoors";
import { SCENE_ASSETS, type SceneAsset } from "@/lib/film/assets";
import {
  chapterFromProgress,
  type ChapterId,
} from "@/lib/film/types";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  progress: number;
  gold: string;
  accent: string;
  doorsOpen: boolean;
  onDoorsDone: () => void;
  onLoadProgress: (ratio: number) => void;
  onReady: () => void;
  showCouple?: boolean;
};

function sceneWeight(progress: number, index: number): number {
  // Map 6 scenes across film portion; soft cross-dissolve at edges
  const starts = [0, 0.14, 0.28, 0.42, 0.56, 0.72];
  const ends = [0.14, 0.28, 0.42, 0.56, 0.72, 1.01];
  const a = starts[index];
  const b = ends[index];
  const edge = 0.04;
  if (progress < a - edge || progress > b + edge) return 0;
  if (progress >= a && progress < b) {
    const into = progress <= a + edge ? Math.min(1, (progress - (a - edge)) / (edge * 2)) : 1;
    const out = progress >= b - edge ? Math.min(1, (b + edge - progress) / (edge * 2)) : 1;
    // Within the chapter core, stay fully visible
    if (progress > a + edge && progress < b - edge) return 1;
    return Math.max(0, Math.min(into, out, 1));
  }
  if (progress < a) return Math.max(0, 1 - (a - progress) / edge);
  return Math.max(0, 1 - (progress - b) / edge);
}

function useSmallScreen() {
  const [sm, setSm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 430px)");
    const apply = () => setSm(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return sm;
}

function SceneLayer({
  asset,
  opacity,
  progress,
  reduced,
  preferSm,
}: {
  asset: SceneAsset;
  opacity: number;
  progress: number;
  reduced: boolean;
  preferSm: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const zoom = reduced ? 1 : 1 + Math.min(0.12, progress * 0.12);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !asset.mp4) return;
    // scrub roughly by chapter progress when possible
    if (v.duration && Number.isFinite(v.duration)) {
      const t = Math.min(v.duration * 0.98, progress * v.duration);
      if (Math.abs(v.currentTime - t) > 0.08) {
        try {
          v.currentTime = t;
        } catch {
          // ignore
        }
      }
    }
  }, [progress, asset.mp4]);

  if (opacity < 0.01) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ opacity, transition: "opacity 120ms linear" }}
    >
      {asset.mp4 ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          style={{ transform: `scale(${zoom})` }}
          src={asset.mp4}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      ) : (
        <picture>
          <source
            srcSet={preferSm ? asset.webpSm : asset.webp}
            type="image/webp"
          />
          <img
            src={preferSm ? asset.jpgSm : asset.jpg}
            alt=""
            className="h-full w-full object-cover"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "50% 40%",
            }}
            draggable={false}
          />
        </picture>
      )}
      {/* subtle depth parallax wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.25) 100%)",
          transform: reduced ? undefined : `translateY(${(1 - zoom) * 40}px)`,
        }}
      />
    </div>
  );
}

export function PhotoFilmStage({
  progress,
  gold,
  accent,
  doorsOpen,
  onDoorsDone,
  onLoadProgress,
  onReady,
  showCouple = true,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const preferSm = useSmallScreen();
  const readyOnce = useRef(false);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const chapter = chapterFromProgress(progress);
  const activeCouple = useMemo(() => {
    const scene = SCENE_ASSETS.find((s) => s.chapter === chapter.id);
    return scene?.couple ?? "/couple/default.png";
  }, [chapter.id]);

  const markReady = useCallback(() => {
    if (readyOnce.current) return;
    readyOnce.current = true;
    onReady();
  }, [onReady]);

  // Preload scene 1 first, then lazy the rest
  useEffect(() => {
    let cancelled = false;
    const lowMem =
      typeof navigator !== "undefined" &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory !==
        undefined &&
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <=
        2;

    const loadImg = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    (async () => {
      const first = SCENE_ASSETS[0];
      const firstSrc = preferSm ? first.webpSm : first.webp;
      await loadImg(firstSrc);
      if (cancelled) return;
      setLoaded((s) => ({ ...s, 1: true }));
      onLoadProgress(0.35);
      markReady();

      if (reduced || lowMem) {
        onLoadProgress(1);
        return;
      }

      // couple for scene 1
      if (first.couple) await loadImg(first.couple);
      if (cancelled) return;
      onLoadProgress(0.5);

      const rest = SCENE_ASSETS.slice(1);
      let done = 0;
      await Promise.all(
        rest.map(async (s) => {
          await loadImg(preferSm ? s.webpSm : s.webp);
          if (s.couple) await loadImg(s.couple);
          done += 1;
          if (!cancelled) {
            setLoaded((prev) => ({ ...prev, [s.id]: true }));
            onLoadProgress(0.5 + (done / rest.length) * 0.5);
          }
        })
      );
      if (!cancelled) onLoadProgress(1);
    })();

    return () => {
      cancelled = true;
    };
  }, [preferSm, reduced, onLoadProgress, markReady]);

  const showLotus = chapter.id === "names" && progress > 0.14 && progress < 0.3;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#211f1a]">
      {SCENE_ASSETS.map((asset, i) => (
        <SceneLayer
          key={asset.id}
          asset={asset}
          opacity={
            reduced
              ? chapter.id === asset.chapter
                ? 1
                : 0
              : sceneWeight(progress, i)
          }
          progress={progress}
          reduced={reduced}
          preferSm={preferSm || !loaded[asset.id]}
        />
      ))}

      {/* Warm vignette + text legibility gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background: `
            radial-gradient(ellipse at 50% 42%, transparent 35%, rgba(18,12,10,0.45) 100%),
            linear-gradient(180deg, rgba(20,14,12,0.42) 0%, rgba(20,14,12,0.08) 32%, rgba(20,14,12,0.12) 58%, rgba(12,8,6,0.72) 100%)
          `,
        }}
      />

      <GoldDustCanvas gold={gold} count={26} />
      <LotusBloom active={showLotus} gold={gold} />

      {showCouple && activeCouple && chapter.id !== "celebrations" && (
        <CoupleOverlay src={activeCouple} reduced={reduced} />
      )}

      {chapter.id === "celebrations" && (
        <CoupleOverlay
          src="/couple/family.png"
          reduced={reduced}
          family
        />
      )}

      <PalaceDoors
        show={doorsOpen}
        gold={gold}
        accent={accent}
        onDone={onDoorsDone}
      />
    </div>
  );
}

function CoupleOverlay({
  src,
  reduced,
  family = false,
}: {
  src: string;
  reduced: boolean;
  family?: boolean;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-[6%] z-[6] flex justify-center"
      key={src}
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: reduced ? 0 : [0, -8, 0],
      }}
      transition={
        reduced
          ? { duration: 0.4 }
          : {
              opacity: { duration: 0.6 },
              y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            }
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={
          family
            ? "h-[34svh] max-h-[280px] w-auto max-w-[92%] object-contain"
            : "h-[42svh] max-h-[360px] w-auto max-w-[85%] object-contain"
        }
        style={{
          filter:
            "drop-shadow(0 18px 28px rgba(0,0,0,0.55)) drop-shadow(0 0 18px rgba(201,162,39,0.28))",
        }}
        draggable={false}
      />
    </motion.div>
  );
}

// re-export chapter id type usage silence
export type { ChapterId };
