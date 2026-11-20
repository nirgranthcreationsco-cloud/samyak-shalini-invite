export type OutfitColors = {
  top: string;
  bottom: string;
  accent: string;
};

export type InviteEvent = {
  id: string;
  title: string;
  /** ISO date yyyy-mm-dd — weekday/formatted dates are computed in code */
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
  brideOutfit: OutfitColors;
  groomOutfit: OutfitColors;
  /** Short poetic line for film chapter */
  poeticLine?: string;
};

export type ThemePresetId =
  | "royal-palace"
  | "pastel-garden"
  | "midnight-gold"
  | "marigold-festive";

export type ThemeSymbol = "lotus" | "rose" | "marigold";

export type ThemePalette = {
  bg: string;
  bgAlt: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  gold: string;
  border: string;
};

export type InviteTheme = {
  preset: ThemePresetId;
  palette: ThemePalette;
  headingFont: string;
  bodyFont: string;
  symbol: ThemeSymbol;
};

export type PersonDetails = {
  name: string;
  honorific?: string;
  grandparents?: string;
  parents?: string;
};

export type InviteConfig = {
  bride: PersonDetails;
  groom: PersonDetails;
  monogram: string;
  city: string;
  blessingLine: string;
  invitationLine: string;
  brideParents: string;
  groomParents: string;
  families: string[];
  whatsappNumber: string;
  events: InviteEvent[];
  theme: InviteTheme;
  /** Optional — music never autoplays */
  musicUrl?: string;
  /** e.g. ॥ श्री पार्श्वनाथाय नमः ॥ — use HINDI_COPY; never invent Devanagari */
  invocation?: string;
  hostLine?: string;
  hostAddress?: string;
  /** Verbatim Hindi lines — render with lang="hi"; never character-split */
  hindi?: {
    invocation: string;
    title: string;
    invite: string;
    request: string;
    closing: string;
    events?: Record<string, string>;
  };
  /** Film chapter poetic headlines */
  chapterLines?: {
    opening?: string;
    beginning?: string;
    celebrations?: string;
    venue?: string;
    closing?: string;
  };
};
