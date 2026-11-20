"use client";

import { useState } from "react";
import type { InviteConfig } from "@/types/invite";
import { buildWhatsAppUrl, rsvpMessage } from "@/lib/whatsapp";

type Props = {
  config: InviteConfig;
  accent: string;
  gold: string;
  defaultName?: string;
};

export function RsvpBlock({ config, accent, gold, defaultName = "" }: Props) {
  const [name, setName] = useState(defaultName);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);

  const submit = () => {
    const n = name.trim();
    if (!n || attending === null) return;
    const url = buildWhatsAppUrl(
      config.whatsappNumber,
      rsvpMessage(config, n, attending, guests)
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="w-full rounded-2xl border px-4 py-5"
      style={{ borderColor: `${gold}55`, background: "rgba(255,255,255,0.55)" }}
    >
      <h3
        className="font-[family-name:var(--font-heading)] text-xl"
        style={{ color: accent }}
      >
        RSVP
      </h3>
      <p className="mt-1 text-sm opacity-70">Let us know if you can celebrate with us.</p>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block opacity-70">Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-11 w-full rounded-lg border bg-white/80 px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ borderColor: `${gold}66`, outlineColor: gold }}
          maxLength={80}
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Attendance">
        <button
          type="button"
          onClick={() => setAttending(true)}
          className="min-h-11 rounded-lg border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: attending === true ? accent : `${gold}66`,
            background: attending === true ? accent : "transparent",
            color: attending === true ? "#fff" : "inherit",
            outlineColor: gold,
          }}
        >
          Joyfully attending
        </button>
        <button
          type="button"
          onClick={() => setAttending(false)}
          className="min-h-11 rounded-lg border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: attending === false ? accent : `${gold}66`,
            background: attending === false ? accent : "transparent",
            color: attending === false ? "#fff" : "inherit",
            outlineColor: gold,
          }}
        >
          Unable to attend
        </button>
      </div>

      {attending === true && (
        <label className="mt-3 block text-sm">
          <span className="mb-1 block opacity-70">Number of guests</span>
          <input
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            className="min-h-11 w-full rounded-lg border bg-white/80 px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: `${gold}66`, outlineColor: gold }}
          />
        </label>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!name.trim() || attending === null}
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg text-sm font-medium text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ background: accent, outlineColor: gold }}
      >
        Send RSVP via WhatsApp
      </button>
    </div>
  );
}
