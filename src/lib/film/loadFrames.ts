import type { FilmManifest } from "@/lib/film/types";

export async function fetchManifest(): Promise<FilmManifest> {
  const res = await fetch("/frames/manifest.json", { cache: "force-cache" });
  if (!res.ok) {
    return {
      mode: "svg-fallback",
      frameCount: 0,
      virtualFrames: 120,
      width: 720,
      height: 1280,
      poster: "/frames/poster.svg",
      pattern: "/frames/frame-{index}.webp",
    };
  }
  return (await res.json()) as FilmManifest;
}

function frameUrl(pattern: string, index: number): string {
  return pattern.replace("{index}", String(index).padStart(3, "0"));
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export type FrameLoadProgress = {
  loaded: number;
  total: number;
  ratio: number;
};

/**
 * Preload first `priority` frames, then the rest in background.
 * Calls onProgress as images resolve.
 */
export async function preloadFrames(
  manifest: FilmManifest,
  opts: {
    priority?: number;
    onProgress?: (p: FrameLoadProgress) => void;
    signal?: AbortSignal;
  } = {}
): Promise<(HTMLImageElement | null)[]> {
  if (manifest.mode !== "webp-frames" || manifest.frameCount <= 0) {
    opts.onProgress?.({ loaded: 1, total: 1, ratio: 1 });
    return [];
  }

  const total = manifest.frameCount;
  const priority = Math.min(opts.priority ?? 20, total);
  const frames: (HTMLImageElement | null)[] = Array(total).fill(null);
  let loaded = 0;

  const report = () => {
    opts.onProgress?.({
      loaded,
      total,
      ratio: total === 0 ? 1 : loaded / total,
    });
  };

  const loadOne = async (i: number) => {
    if (opts.signal?.aborted) return;
    try {
      frames[i] = await loadImage(frameUrl(manifest.pattern, i));
    } catch {
      frames[i] = null;
    }
    loaded += 1;
    report();
  };

  // Priority batch
  await Promise.all(
    Array.from({ length: priority }, (_, i) => loadOne(i))
  );

  // Background remainder (don't block readiness beyond priority)
  void Promise.all(
    Array.from({ length: total - priority }, (_, k) => loadOne(priority + k))
  );

  return frames;
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  canvasW: number,
  canvasH: number,
  srcW: number,
  srcH: number
) {
  const scale = Math.max(canvasW / srcW, canvasH / srcH);
  const w = srcW * scale;
  const h = srcH * scale;
  const x = (canvasW - w) / 2;
  const y = (canvasH - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}
