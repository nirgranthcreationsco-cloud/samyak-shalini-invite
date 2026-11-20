import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { InviteConfig } from "@/types/invite";
import { SAMPLE_CONFIG } from "@/lib/sample";
import { getPresetTheme } from "@/lib/themes";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOutfit(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.top === "string" &&
    typeof value.bottom === "string" &&
    typeof value.accent === "string"
  );
}

export function encodeConfig(config: InviteConfig): string {
  return compressToEncodedURIComponent(JSON.stringify(config));
}

export function decodeConfig(encoded: string): InviteConfig | null {
  try {
    const raw = decompressFromEncodedURIComponent(encoded);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidConfig(parsed)) return null;
    return normalizeConfig(parsed);
  } catch {
    return null;
  }
}

export function isValidConfig(value: unknown): value is InviteConfig {
  if (!isRecord(value)) return false;
  if (!isRecord(value.bride) || typeof value.bride.name !== "string") return false;
  if (!isRecord(value.groom) || typeof value.groom.name !== "string") return false;
  if (typeof value.monogram !== "string") return false;
  if (typeof value.city !== "string") return false;
  if (typeof value.blessingLine !== "string") return false;
  if (typeof value.invitationLine !== "string") return false;
  if (typeof value.brideParents !== "string") return false;
  if (typeof value.groomParents !== "string") return false;
  if (!Array.isArray(value.families)) return false;
  if (typeof value.whatsappNumber !== "string") return false;
  if (!Array.isArray(value.events)) return false;
  if (!isRecord(value.theme)) return false;
  return true;
}

function normalizeConfig(value: InviteConfig): InviteConfig {
  const preset = value.theme?.preset ?? "royal-palace";
  const fallbackTheme = getPresetTheme(preset);
  return {
    ...SAMPLE_CONFIG,
    ...value,
    bride: {
      ...SAMPLE_CONFIG.bride,
      ...value.bride,
      name: value.bride.name.trim() || SAMPLE_CONFIG.bride.name,
    },
    groom: {
      ...SAMPLE_CONFIG.groom,
      ...value.groom,
      name: value.groom.name.trim() || SAMPLE_CONFIG.groom.name,
    },
    invocation: value.invocation ?? SAMPLE_CONFIG.invocation,
    hostLine: value.hostLine ?? SAMPLE_CONFIG.hostLine,
    hostAddress: value.hostAddress ?? SAMPLE_CONFIG.hostAddress,
    chapterLines: {
      ...SAMPLE_CONFIG.chapterLines,
      ...(value.chapterLines ?? {}),
    },
    families: value.families.filter((f) => typeof f === "string"),
    events: value.events
      .filter((e) => e && typeof e.id === "string")
      .map((e) => ({
        id: e.id,
        title: e.title || "Celebration",
        date: e.date || "2027-01-01",
        time: e.time || "",
        venueName: e.venueName || "",
        venueAddress: e.venueAddress || "",
        mapUrl: e.mapUrl || "",
        poeticLine: typeof e.poeticLine === "string" ? e.poeticLine : undefined,
        brideOutfit: isOutfit(e.brideOutfit)
          ? e.brideOutfit
          : SAMPLE_CONFIG.events[0].brideOutfit,
        groomOutfit: isOutfit(e.groomOutfit)
          ? e.groomOutfit
          : SAMPLE_CONFIG.events[0].groomOutfit,
      })),
    theme: {
      ...fallbackTheme,
      ...value.theme,
      palette: {
        ...fallbackTheme.palette,
        ...(value.theme.palette ?? {}),
      },
    },
    musicUrl: value.musicUrl || undefined,
  };
}

export function buildInviteHash(config: InviteConfig, guestName?: string): string {
  const d = encodeConfig(config);
  if (guestName && guestName.trim()) {
    return `#d=${d}&g=${encodeURIComponent(guestName.trim())}`;
  }
  return `#d=${d}`;
}

export function buildInviteUrl(
  origin: string,
  config: InviteConfig,
  guestName?: string
): string {
  return `${origin}/i${buildInviteHash(config, guestName)}`;
}

export function parseInviteHash(hash: string): {
  config: InviteConfig | null;
  guestName: string | null;
  hasEncoded: boolean;
} {
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(cleaned);
  const d = params.get("d");
  const g = params.get("g");
  if (!d) {
    return { config: null, guestName: g, hasEncoded: false };
  }
  return {
    config: decodeConfig(d),
    guestName: g,
    hasEncoded: true,
  };
}
