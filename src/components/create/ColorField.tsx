"use client";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

export function ColorField({ label, value, onChange }: Props) {
  return (
    <label className="flex min-h-11 items-center gap-2 text-xs">
      <span className="w-14 shrink-0 text-stone-500">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-10 cursor-pointer rounded border border-stone-200 bg-white p-1"
        aria-label={label}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-10 flex-1 rounded-lg border border-stone-200 px-2 font-mono text-xs"
      />
    </label>
  );
}
