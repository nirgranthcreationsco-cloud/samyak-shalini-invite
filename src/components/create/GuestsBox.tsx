"use client";

import { useMemo, useState } from "react";
import type { InviteConfig } from "@/types/invite";
import { buildInviteUrl } from "@/lib/encode";
import { sanitizeGuestName } from "@/lib/sanitize";
import { buildWhatsAppUrl, shareInviteMessage } from "@/lib/whatsapp";

type Props = {
  config: InviteConfig;
};

export function GuestsBox({ config }: Props) {
  const [raw, setRaw] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const guests = useMemo(
    () =>
      raw
        .split("\n")
        .map((line) => sanitizeGuestName(line))
        .filter(Boolean),
    [raw]
  );

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const copyLink = async (url: string, name: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(name);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
      <h2 className="text-base font-medium text-stone-900">Guests</h2>
      <p className="text-sm text-stone-500">
        Paste one name per line to generate personalized invite links.
      </p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={5}
        placeholder={"Priya Kapoor\nArjun Singh"}
        className="min-h-28 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
      />

      {guests.length > 0 && (
        <ul className="space-y-2">
          {guests.map((name) => {
            const url = buildInviteUrl(origin, config, name);
            return (
              <li
                key={name}
                className="rounded-lg border border-stone-100 bg-stone-50 p-3"
              >
                <p className="text-sm font-medium text-stone-800">{name}</p>
                <p className="mt-1 break-all text-[11px] text-stone-500">{url}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyLink(url, name)}
                    className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-xs"
                  >
                    {copied === name ? "Copied" : "Copy link"}
                  </button>
                  <a
                    href={buildWhatsAppUrl(
                      config.whatsappNumber,
                      shareInviteMessage(config, name, url)
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center rounded-lg bg-[#128C7E] px-3 text-xs font-medium text-white"
                  >
                    Share on WhatsApp
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
