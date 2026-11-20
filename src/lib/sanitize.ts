/** Sanitize guest name for display and WhatsApp prefill. */
export function sanitizeGuestName(raw: string | null | undefined): string {
  if (!raw) return "";
  let name = raw;
  try {
    name = decodeURIComponent(name);
  } catch {
    // keep raw
  }
  return name
    .replace(/[<>&"'`]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 80);
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
