const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Parse ISO yyyy-mm-dd as local calendar date (no timezone shift). */
export function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function weekdayFromISO(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return "";
  return WEEKDAYS[date.getDay()];
}

export function formatLongDate(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatShortDate(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatDateRange(isos: string[]): string {
  const valid = isos
    .map((iso) => ({ iso, date: parseISODate(iso) }))
    .filter((x): x is { iso: string; date: Date } => x.date !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (valid.length === 0) return "";
  if (valid.length === 1) {
    return `${weekdayFromISO(valid[0].iso)}, ${formatLongDate(valid[0].iso)}`;
  }

  const first = valid[0];
  const last = valid[valid.length - 1];
  if (first.iso === last.iso) {
    return `${weekdayFromISO(first.iso)}, ${formatLongDate(first.iso)}`;
  }
  if (first.date.getFullYear() === last.date.getFullYear()) {
    if (first.date.getMonth() === last.date.getMonth()) {
      return `${MONTHS[first.date.getMonth()]} ${first.date.getDate()}–${last.date.getDate()}, ${first.date.getFullYear()}`;
    }
    return `${MONTHS[first.date.getMonth()].slice(0, 3)} ${first.date.getDate()} – ${MONTHS[last.date.getMonth()].slice(0, 3)} ${last.date.getDate()}, ${first.date.getFullYear()}`;
  }
  return `${formatShortDate(first.iso)} – ${formatShortDate(last.iso)}`;
}
