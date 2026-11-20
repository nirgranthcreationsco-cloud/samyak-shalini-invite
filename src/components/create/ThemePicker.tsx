"use client";

import { THEME_PRESETS } from "@/lib/themes";
import type { ThemePresetId, ThemeSymbol } from "@/types/invite";

type Props = {
  preset: ThemePresetId;
  symbol: ThemeSymbol;
  onPreset: (id: ThemePresetId) => void;
  onSymbol: (s: ThemeSymbol) => void;
};

export function ThemePicker({ preset, symbol, onPreset, onSymbol }: Props) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-stone-800">Theme preset</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {THEME_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPreset(p.id)}
            className="min-h-11 rounded-xl border px-3 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            style={{
              borderColor: preset === p.id ? p.theme.palette.accent : "#e7e5e4",
              background:
                preset === p.id
                  ? `${p.theme.palette.accent}12`
                  : "#fff",
            }}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ background: p.theme.palette.accent }}
              />
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ background: p.theme.palette.gold }}
              />
              <span className="text-sm font-medium">{p.name}</span>
            </span>
            <span className="mt-1 block text-xs text-stone-500">{p.description}</span>
          </button>
        ))}
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">Symbol</span>
        <select
          value={symbol}
          onChange={(e) => onSymbol(e.target.value as ThemeSymbol)}
          className="min-h-11 w-full rounded-lg border border-stone-200 bg-white px-3"
        >
          <option value="lotus">Lotus</option>
          <option value="rose">Rose</option>
          <option value="marigold">Marigold</option>
        </select>
      </label>
    </fieldset>
  );
}
