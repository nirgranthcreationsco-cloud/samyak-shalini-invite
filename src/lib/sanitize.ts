/** Sanitize a single name/family fragment for display and URLs. */
function sanitizePart(raw: string): string {
  return raw
    .replace(/[<>&"'`]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 80);
}

/** Sanitize guest name for display and WhatsApp prefill. */
export function sanitizeGuestName(raw: string | null | undefined): string {
  if (!raw) return "";
  let name = raw;
  try {
    name = decodeURIComponent(name);
  } catch {
    // keep raw
  }
  return sanitizePart(name);
}

/**
 * Parse personalized guest line.
 * Formats: "Priya Kapoor" or "Priya Kapoor | Kapoor Family" (also `/`).
 */
export function parseGuestInvite(raw: string | null | undefined): {
  name: string;
  family?: string;
  /** Short line for greetings: "Priya" or "Priya & Family" */
  greeting: string;
  /** Full addressed line */
  addressedTo: string;
} {
  if (!raw) {
    return { name: "", greeting: "", addressedTo: "" };
  }
  let decoded = raw;
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // keep raw
  }
  const parts = decoded
    .split(/\s*[|/]\s*/)
    .map(sanitizePart)
    .filter(Boolean);
  const name = parts[0] ?? "";
  const family = parts[1];
  if (!name) {
    return { name: "", greeting: "", addressedTo: "" };
  }
  if (family) {
    return {
      name,
      family,
      greeting: `${name} & ${family}`,
      addressedTo: `${name}\n${family}`,
    };
  }
  return {
    name,
    greeting: name,
    addressedTo: name,
  };
}

/** Escape for safe text content (React already escapes, but useful for attributes/ARIA). */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
