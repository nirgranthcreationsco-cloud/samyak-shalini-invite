/**
 * Verbatim Devanagari copy — do not edit, improve, or character-split these strings.
 * Animate Hindi only as a whole line or by whole words (splitHindiWords).
 */
export const HINDI_COPY = {
  invocation: "॥ श्री पार्श्वनाथाय नमः ॥",
  title: "शुभ विवाह",
  invite: "आपको सपरिवार सादर आमंत्रित करते हैं",
  request: "आपकी गरिमामयी उपस्थिति प्रार्थनीय है",
  closing: "आपके आशीर्वाद के अभिलाषी",
  events: {
    "dev-darshan": "देव दर्शन",
    barat: "बारात",
    panigrahan: "पाणिग्रहण संस्कार",
    aashirwad: "स्वागत समारोह",
  },
} as const;

export type HindiEventId = keyof typeof HINDI_COPY.events;

/** Split Devanagari (or any) text on spaces only — never by character. */
export function splitHindiWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export function hindiEventTitle(eventId: string): string | undefined {
  if (eventId in HINDI_COPY.events) {
    return HINDI_COPY.events[eventId as HindiEventId];
  }
  return undefined;
}
