export type FilmManifest = {
  mode: "webp-frames" | "svg-fallback";
  frameCount: number;
  virtualFrames: number;
  width: number;
  height: number;
  poster: string;
  pattern: string;
  totalSizeKb?: number;
  note?: string;
};

export type ChapterId =
  | "beginning"
  | "names"
  | "story"
  | "first-function"
  | "ceremony"
  | "celebrations";

export type FilmChapter = {
  id: ChapterId;
  index: number;
  label: string;
  /** Inclusive start of scroll progress 0-1 */
  start: number;
  /** Exclusive end of scroll progress 0-1 */
  end: number;
};

/** Six chapters with dedicated scroll ranges across the film journey. */
export const FILM_CHAPTERS: FilmChapter[] = [
  { id: "beginning", index: 1, label: "The beginning", start: 0, end: 0.14 },
  { id: "names", index: 2, label: "Names", start: 0.14, end: 0.28 },
  { id: "story", index: 3, label: "Our story", start: 0.28, end: 0.42 },
  { id: "first-function", index: 4, label: "First function", start: 0.42, end: 0.56 },
  { id: "ceremony", index: 5, label: "Ceremony", start: 0.56, end: 0.72 },
  { id: "celebrations", index: 6, label: "Celebrations", start: 0.72, end: 1.01 },
];

export function chapterFromProgress(p: number): FilmChapter {
  const clamped = Math.min(1, Math.max(0, p));
  return (
    FILM_CHAPTERS.find((c) => clamped >= c.start && clamped < c.end) ??
    FILM_CHAPTERS[FILM_CHAPTERS.length - 1]
  );
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export const MUSIC_PREF_KEY = "wedding-invite-music-unmuted";
export const FRAME_COUNT_VIRTUAL = 120;
