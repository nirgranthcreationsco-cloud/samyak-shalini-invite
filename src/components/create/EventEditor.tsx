"use client";

import type { InviteEvent } from "@/types/invite";
import { weekdayFromISO } from "@/lib/dates";
import { ColorField } from "@/components/create/ColorField";

const inputClass =
  "min-h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-[0.95rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800";

type Props = {
  event: InviteEvent;
  index: number;
  total: number;
  onChange: (event: InviteEvent) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
};

export function EventEditor({
  event,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: Props) {
  const weekday = weekdayFromISO(event.date);

  const set = <K extends keyof InviteEvent>(key: K, value: InviteEvent[K]) => {
    onChange({ ...event, [key]: value });
  };

  return (
    <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-stone-800">Event {index + 1}</p>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="min-h-11 min-w-11 rounded-lg border border-stone-200 bg-white text-sm disabled:opacity-30"
            aria-label="Move event up"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="min-h-11 min-w-11 rounded-lg border border-stone-200 bg-white text-sm disabled:opacity-30"
            aria-label="Move event down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={total <= 1}
            className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-sm text-red-700 disabled:opacity-30"
          >
            Remove
          </button>
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">Title</span>
        <input
          value={event.title}
          onChange={(e) => set("title", e.target.value)}
          className={inputClass}
        />
      </label>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-stone-600">Date</span>
          <input
            type="date"
            value={event.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputClass}
          />
          {weekday && <p className="mt-1 text-xs text-amber-800">{weekday}</p>}
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-stone-600">Time</span>
          <input
            value={event.time}
            onChange={(e) => set("time", e.target.value)}
            placeholder="6:00 PM"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">Venue name</span>
        <input
          value={event.venueName}
          onChange={(e) => set("venueName", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">Venue address</span>
        <input
          value={event.venueAddress}
          onChange={(e) => set("venueAddress", e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">Map URL</span>
        <input
          value={event.mapUrl}
          onChange={(e) => set("mapUrl", e.target.value)}
          className={inputClass}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-stone-600">Bride outfit</p>
          <ColorField
            label="Top"
            value={event.brideOutfit.top}
            onChange={(top) => set("brideOutfit", { ...event.brideOutfit, top })}
          />
          <ColorField
            label="Bottom"
            value={event.brideOutfit.bottom}
            onChange={(bottom) =>
              set("brideOutfit", { ...event.brideOutfit, bottom })
            }
          />
          <ColorField
            label="Accent"
            value={event.brideOutfit.accent}
            onChange={(accent) =>
              set("brideOutfit", { ...event.brideOutfit, accent })
            }
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-stone-600">Groom outfit</p>
          <ColorField
            label="Top"
            value={event.groomOutfit.top}
            onChange={(top) => set("groomOutfit", { ...event.groomOutfit, top })}
          />
          <ColorField
            label="Bottom"
            value={event.groomOutfit.bottom}
            onChange={(bottom) =>
              set("groomOutfit", { ...event.groomOutfit, bottom })
            }
          />
          <ColorField
            label="Accent"
            value={event.groomOutfit.accent}
            onChange={(accent) =>
              set("groomOutfit", { ...event.groomOutfit, accent })
            }
          />
        </div>
      </div>
    </div>
  );
}
