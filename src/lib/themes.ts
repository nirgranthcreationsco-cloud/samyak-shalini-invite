import type { InviteTheme, ThemePalette, ThemePresetId } from "@/types/invite";

export type ThemePreset = {
  id: ThemePresetId;
  name: string;
  description: string;
  theme: Omit<InviteTheme, "preset"> & { preset: ThemePresetId };
};

const royalPalette: ThemePalette = {
  bg: "#2A1518",
  bgAlt: "#3D1F24",
  surface: "#F7F0E6",
  text: "#2A1518",
  muted: "#6B4A4E",
  accent: "#8B1E3F",
  accentSoft: "#C4A484",
  gold: "#C9A227",
  border: "#D4C4A8",
};

const pastelPalette: ThemePalette = {
  bg: "#E8F0E6",
  bgAlt: "#F5E6EC",
  surface: "#FFFBF7",
  text: "#3A4A3C",
  muted: "#6A7A6C",
  accent: "#7A9E7E",
  accentSoft: "#E8B4BC",
  gold: "#B8A07A",
  border: "#C5D4C2",
};

const midnightPalette: ThemePalette = {
  bg: "#0B1C2C",
  bgAlt: "#132A40",
  surface: "#F4EFE6",
  text: "#0B1C2C",
  muted: "#4A5A6A",
  accent: "#1A3A5C",
  accentSoft: "#D4AF37",
  gold: "#D4AF37",
  border: "#C8BFAE",
};

const marigoldPalette: ThemePalette = {
  bg: "#FFF4E0",
  bgAlt: "#FFE8C2",
  surface: "#FFFBF5",
  text: "#4A1F0A",
  muted: "#8A5A2A",
  accent: "#E07A1F",
  accentSoft: "#C43C2A",
  gold: "#F0A830",
  border: "#E8C88A",
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "royal-palace",
    name: "Royal Palace",
    description: "Deep burgundy, gold, and warm ivory",
    theme: {
      preset: "royal-palace",
      palette: royalPalette,
      headingFont: "heading",
      bodyFont: "body",
      symbol: "lotus",
    },
  },
  {
    id: "pastel-garden",
    name: "Pastel Garden",
    description: "Soft sage, blush pink, and ivory",
    theme: {
      preset: "pastel-garden",
      palette: pastelPalette,
      headingFont: "heading",
      bodyFont: "body",
      symbol: "rose",
    },
  },
  {
    id: "midnight-gold",
    name: "Midnight Blue & Gold",
    description: "Navy night sky with luminous gold",
    theme: {
      preset: "midnight-gold",
      palette: midnightPalette,
      headingFont: "heading",
      bodyFont: "body",
      symbol: "lotus",
    },
  },
  {
    id: "marigold-festive",
    name: "Marigold Festive",
    description: "Marigold orange, festive red, cream",
    theme: {
      preset: "marigold-festive",
      palette: marigoldPalette,
      headingFont: "heading",
      bodyFont: "body",
      symbol: "marigold",
    },
  },
];

export function getPresetTheme(id: ThemePresetId): InviteTheme {
  const preset = THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
  return { ...preset.theme };
}

export function applyPreset(id: ThemePresetId, symbol?: InviteTheme["symbol"]): InviteTheme {
  const theme = getPresetTheme(id);
  if (symbol) theme.symbol = symbol;
  return theme;
}
