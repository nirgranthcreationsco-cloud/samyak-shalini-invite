import type { InviteEvent } from "@/types/invite";
import { parseISODate } from "@/lib/dates";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toICSDate(iso: string, time?: string): string {
  const date = parseISODate(iso);
  if (!date) return "";
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());

  if (time) {
    const match = /(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/.exec(time);
    if (match) {
      let hour = Number(match[1]);
      const minute = Number(match[2]);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === "PM" && hour < 12) hour += 12;
      if (meridiem === "AM" && hour === 12) hour = 0;
      return `${y}${m}${d}T${pad(hour)}${pad(minute)}00`;
    }
  }
  return `${y}${m}${d}`;
}

export function buildICS(event: InviteEvent, titlePrefix: string): string {
  const start = toICSDate(event.date, event.time);
  const allDay = start.length === 8;
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

  let end = start;
  if (allDay) {
    const date = parseISODate(event.date);
    if (date) {
      date.setDate(date.getDate() + 1);
      end = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    }
  } else if (start) {
    // default 2-hour duration
    const y = Number(start.slice(0, 4));
    const mo = Number(start.slice(4, 6)) - 1;
    const d = Number(start.slice(6, 8));
    const h = Number(start.slice(9, 11));
    const mi = Number(start.slice(11, 13));
    const dt = new Date(y, mo, d, h + 2, mi);
    end = `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
  }

  const summary = `${titlePrefix} — ${event.title}`;
  const location = [event.venueName, event.venueAddress].filter(Boolean).join(", ");
  const uid = `${event.id}-${event.date}@wedding-invite`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
    allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
    `SUMMARY:${escapeICS(summary)}`,
    location ? `LOCATION:${escapeICS(location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

function escapeICS(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function downloadICS(event: InviteEvent, titlePrefix: string): void {
  const content = buildICS(event, titlePrefix);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
