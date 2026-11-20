"use client";

import { useCallback, useRef, useState } from "react";
import type { InviteConfig, InviteEvent, ThemePresetId, ThemeSymbol } from "@/types/invite";
import { SAMPLE_CONFIG } from "@/lib/sample";
import { applyPreset } from "@/lib/themes";
import { buildInviteUrl, encodeConfig, decodeConfig, isValidConfig } from "@/lib/encode";
import { DRAFT_KEY } from "@/lib/hooks";
import { EventEditor } from "@/components/create/EventEditor";
import { GuestsBox } from "@/components/create/GuestsBox";
import { LivePreview } from "@/components/create/LivePreview";
import { ThemePicker } from "@/components/create/ThemePicker";

const inputClass =
  "min-h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-[0.95rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800";

function newEvent(index: number): InviteEvent {
  const base = SAMPLE_CONFIG.events[0];
  return {
    ...base,
    id: `event-${Date.now()}-${index}`,
    title: `Celebration ${index + 1}`,
    date: "2027-03-01",
  };
}

export function CreateForm() {
  const [config, setConfig] = useState<InviteConfig>(SAMPLE_CONFIG);
  const [status, setStatus] = useState("");
  const [familiesText, setFamiliesText] = useState(
    SAMPLE_CONFIG.families.join("\n")
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const liveConfig: InviteConfig = {
    ...config,
    families: familiesText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  };

  const patch = useCallback((partial: Partial<InviteConfig>) => {
    setConfig((c) => ({ ...c, ...partial }));
  }, []);

  const copyLink = async () => {
    const url = buildInviteUrl(window.location.origin, liveConfig);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Invite link copied");
    } catch {
      setStatus(url);
    }
    window.setTimeout(() => setStatus(""), 2500);
  };

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(liveConfig));
      setStatus("Draft saved");
      window.setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Could not save draft");
    }
  };

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) {
        setStatus("No draft found");
        return;
      }
      const parsed: unknown = JSON.parse(raw);
      if (!isValidConfig(parsed)) {
        setStatus("Draft is invalid");
        return;
      }
      setConfig(parsed);
      setFamiliesText(parsed.families.join("\n"));
      setStatus("Draft loaded");
      window.setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Could not load draft");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(liveConfig, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-invite.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        // try plain JSON first, then lz-string encoded
        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = decodeConfig(text.trim());
        }
        if (!parsed || !isValidConfig(parsed)) {
          setStatus("Invalid JSON");
          return;
        }
        setConfig(parsed);
        setFamiliesText(parsed.families.join("\n"));
        setStatus("Imported");
        window.setTimeout(() => setStatus(""), 2000);
      } catch {
        setStatus("Import failed");
      }
    };
    reader.readAsText(file);
  };

  const onPreset = (id: ThemePresetId) => {
    setConfig((c) => ({
      ...c,
      theme: applyPreset(id, c.theme.symbol),
    }));
  };

  const onSymbol = (symbol: ThemeSymbol) => {
    setConfig((c) => ({
      ...c,
      theme: { ...c.theme, symbol },
    }));
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <header>
          <p className="text-xs tracking-[0.2em] uppercase text-amber-900/70">
            Create
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-heading)] text-3xl text-stone-900">
            Craft your invitation
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Everything lives in the link — no accounts, no database.
          </p>
        </header>

        <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-base font-medium">Couple</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-stone-600">Bride name</span>
              <input
                className={inputClass}
                value={config.bride.name}
                onChange={(e) =>
                  patch({ bride: { ...config.bride, name: e.target.value } })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-stone-600">Groom name</span>
              <input
                className={inputClass}
                value={config.groom.name}
                onChange={(e) =>
                  patch({ groom: { ...config.groom, name: e.target.value } })
                }
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-stone-600">Monogram</span>
              <input
                className={inputClass}
                value={config.monogram}
                onChange={(e) => patch({ monogram: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-stone-600">City</span>
              <input
                className={inputClass}
                value={config.city}
                onChange={(e) => patch({ city: e.target.value })}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">Blessing line</span>
            <input
              className={inputClass}
              value={config.blessingLine}
              onChange={(e) => patch({ blessingLine: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">Invitation line</span>
            <textarea
              className={`${inputClass} py-2`}
              rows={3}
              value={config.invitationLine}
              onChange={(e) => patch({ invitationLine: e.target.value })}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-stone-600">Bride&apos;s parents</span>
              <input
                className={inputClass}
                value={config.brideParents}
                onChange={(e) => patch({ brideParents: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-stone-600">Groom&apos;s parents</span>
              <input
                className={inputClass}
                value={config.groomParents}
                onChange={(e) => patch({ groomParents: e.target.value })}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">
              Families (one per line)
            </span>
            <textarea
              className={`${inputClass} py-2`}
              rows={3}
              value={familiesText}
              onChange={(e) => setFamiliesText(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">
              WhatsApp number (with country code)
            </span>
            <input
              className={inputClass}
              value={config.whatsappNumber}
              onChange={(e) => patch({ whatsappNumber: e.target.value })}
              placeholder="919876543210"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-600">
              Music URL (optional — never autoplays)
            </span>
            <input
              className={inputClass}
              value={config.musicUrl ?? ""}
              onChange={(e) =>
                patch({ musicUrl: e.target.value || undefined })
              }
            />
          </label>
        </section>

        <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
          <ThemePicker
            preset={config.theme.preset}
            symbol={config.theme.symbol}
            onPreset={onPreset}
            onSymbol={onSymbol}
          />
        </section>

        <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-medium">Events</h2>
            <button
              type="button"
              onClick={() =>
                setConfig((c) => ({
                  ...c,
                  events: [...c.events, newEvent(c.events.length)],
                }))
              }
              className="min-h-11 rounded-lg border border-stone-200 px-3 text-sm"
            >
              Add event
            </button>
          </div>
          {config.events.map((event, index) => (
            <EventEditor
              key={event.id}
              event={event}
              index={index}
              total={config.events.length}
              onChange={(next) =>
                setConfig((c) => ({
                  ...c,
                  events: c.events.map((e) => (e.id === next.id ? next : e)),
                }))
              }
              onRemove={() =>
                setConfig((c) => ({
                  ...c,
                  events: c.events.filter((e) => e.id !== event.id),
                }))
              }
              onMove={(dir) =>
                setConfig((c) => {
                  const events = [...c.events];
                  const j = index + dir;
                  if (j < 0 || j >= events.length) return c;
                  [events[index], events[j]] = [events[j], events[index]];
                  return { ...c, events };
                })
              }
            />
          ))}
        </section>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="min-h-11 rounded-lg bg-stone-900 px-4 text-sm font-medium text-white"
          >
            Copy invite link
          </button>
          <button
            type="button"
            onClick={saveDraft}
            className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 text-sm"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={loadDraft}
            className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 text-sm"
          >
            Load draft
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 text-sm"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="min-h-11 rounded-lg border border-stone-300 bg-white px-4 text-sm"
          >
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJson(f);
              e.target.value = "";
            }}
          />
        </div>
        {status && (
          <p className="text-sm text-amber-900" role="status">
            {status}
          </p>
        )}
        <p className="break-all text-[11px] text-stone-400">
          Encoded length: {encodeConfig(liveConfig).length} chars
        </p>

        <GuestsBox config={liveConfig} />
      </div>

      <aside className="hidden lg:block">
        <LivePreview config={liveConfig} />
      </aside>

      <div className="lg:hidden">
        <LivePreview config={liveConfig} />
      </div>
    </div>
  );
}
