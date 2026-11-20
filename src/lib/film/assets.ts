import type { ChapterId } from "@/lib/film/types";

export type SceneAsset = {
  id: number;
  chapter: ChapterId;
  webp: string;
  jpg: string;
  webpSm: string;
  jpgSm: string;
  mp4: string | null;
  couple: string | null;
};

/** Real artwork under /public/scenes and /public/couple — no drawn SVG art. */
export const SCENE_ASSETS: SceneAsset[] = [
  {
    id: 1,
    chapter: "beginning",
    webp: "/scenes/scene-1.webp",
    jpg: "/scenes/scene-1.jpg",
    webpSm: "/scenes/scene-1-sm.webp",
    jpgSm: "/scenes/scene-1-sm.jpg",
    mp4: null,
    couple: "/couple/default.png",
  },
  {
    id: 2,
    chapter: "names",
    webp: "/scenes/scene-2.webp",
    jpg: "/scenes/scene-2.jpg",
    webpSm: "/scenes/scene-2-sm.webp",
    jpgSm: "/scenes/scene-2-sm.jpg",
    mp4: null,
    couple: "/couple/couple-mehndi.png",
  },
  {
    id: 3,
    chapter: "story",
    webp: "/scenes/scene-3.webp",
    jpg: "/scenes/scene-3.jpg",
    webpSm: "/scenes/scene-3-sm.webp",
    jpgSm: "/scenes/scene-3-sm.jpg",
    mp4: null,
    couple: "/couple/couple-hands.png",
  },
  {
    id: 4,
    chapter: "first-function",
    webp: "/scenes/scene-4.webp",
    jpg: "/scenes/scene-4.jpg",
    webpSm: "/scenes/scene-4-sm.webp",
    jpgSm: "/scenes/scene-4-sm.jpg",
    mp4: null,
    // seated cutout lost the groom — use standing hands instead
    couple: "/couple/couple-hands.png",
  },
  {
    id: 5,
    chapter: "ceremony",
    webp: "/scenes/scene-5.webp",
    jpg: "/scenes/scene-5.jpg",
    webpSm: "/scenes/scene-5-sm.webp",
    jpgSm: "/scenes/scene-5-sm.jpg",
    mp4: null,
    couple: "/couple/event-panigrahan.png",
  },
  {
    id: 6,
    chapter: "celebrations",
    webp: "/scenes/scene-6.webp",
    jpg: "/scenes/scene-6.jpg",
    webpSm: "/scenes/scene-6-sm.webp",
    jpgSm: "/scenes/scene-6-sm.jpg",
    mp4: null,
    couple: "/couple/family.png",
  },
];

export function coupleForEventId(eventId: string): string {
  const map: Record<string, string> = {
    "dev-darshan": "/couple/event-dev-darshan.png",
    barat: "/couple/event-barat.png",
    panigrahan: "/couple/event-panigrahan.png",
    aashirwad: "/couple/couple-standing.png",
  };
  return map[eventId] ?? "/couple/default.png";
}

export function sceneIndexForChapter(id: ChapterId): number {
  const i = SCENE_ASSETS.findIndex((s) => s.chapter === id);
  return i >= 0 ? i : 0;
}
