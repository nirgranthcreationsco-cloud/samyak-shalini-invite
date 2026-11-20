"use client";

import { useState } from "react";
import type { InviteConfig } from "@/types/invite";
import { blessingMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  config: InviteConfig;
  accent: string;
  gold: string;
};

export function BlessingsCard({ config, accent, gold }: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    const n = name.trim();
    const m = message.trim();
    if (!n || !m) {
      setError("Please share your name and a short blessing.");
      setReady(false);
      return;
    }
    if (m.length > 500) {
      setError("Message must be 500 characters or fewer.");
      setReady(false);
      return;
    }
    setError("");
    setReady(true);
    const url = buildWhatsAppUrl(
      config.whatsappNumber,
      blessingMessage(config, n, m)
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
        Send your blessings
      </h3>
      <p className="mt-1 text-sm opacity-70">Opens WhatsApp — nothing is stored here.</p>

      <label className="mt-4 block text-sm">
        <span className="mb-1 block opacity-70">Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setReady(false);
          }}
          className="min-h-11 w-full rounded-lg border bg-white/80 px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ borderColor: `${gold}66`, outlineColor: gold }}
          maxLength={80}
          autoComplete="name"
        />
      </label>

      <label className="mt-3 block text-sm">
        <span className="mb-1 flex justify-between opacity-70">
          <span>Message</span>
          <span>{message.length}/500</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value.slice(0, 500));
            setReady(false);
          }}
          rows={4}
          className="w-full rounded-lg border bg-white/80 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ borderColor: `${gold}66`, outlineColor: gold }}
          maxLength={500}
        />
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {ready && (
        <p className="mt-2 text-sm font-medium" style={{ color: accent }} role="status">
          Blessing ready to send
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ background: accent, outlineColor: gold }}
      >
        Send via WhatsApp
      </button>
    </div>
  );
}
