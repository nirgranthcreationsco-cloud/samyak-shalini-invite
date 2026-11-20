/** Available photos in /public — inspected from repo. */
export const PHOTOS = {
  standingLook: {
    webp: "/scenes/scene-1.webp",
    jpg: "/scenes/scene-1.jpg",
    webpSm: "/scenes/scene-1-sm.webp",
    jpgSm: "/scenes/scene-1-sm.jpg",
  },
  mehndi: {
    webp: "/scenes/scene-2.webp",
    jpg: "/scenes/scene-2.jpg",
    webpSm: "/scenes/scene-2-sm.webp",
    jpgSm: "/scenes/scene-2-sm.jpg",
  },
  hands: {
    webp: "/scenes/scene-3.webp",
    jpg: "/scenes/scene-3.jpg",
    webpSm: "/scenes/scene-3-sm.webp",
    jpgSm: "/scenes/scene-3-sm.jpg",
  },
  seated: {
    webp: "/scenes/scene-4.webp",
    jpg: "/scenes/scene-4.jpg",
    webpSm: "/scenes/scene-4-sm.webp",
    jpgSm: "/scenes/scene-4-sm.jpg",
  },
  family: {
    webp: "/scenes/scene-6.webp",
    jpg: "/scenes/scene-6.jpg",
    webpSm: "/scenes/scene-6-sm.webp",
    jpgSm: "/scenes/scene-6-sm.jpg",
  },
  cutoutStanding: "/couple/couple-standing.png",
  cutoutMehndi: "/couple/couple-mehndi.png",
  cutoutHands: "/couple/couple-hands.png",
  cutoutFamily: "/couple/family.png",
} as const;

export type PhotoSet = (typeof PHOTOS)[keyof typeof PHOTOS];
