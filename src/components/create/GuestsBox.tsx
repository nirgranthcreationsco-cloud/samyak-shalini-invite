"use client";

import { useMemo, useState } from "react";
import type { InviteConfig } from "@/types/invite";
import { buildInviteUrl } from "@/lib/encode";
import { parseGuestInvite } from "@/lib/sanitize";
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
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parsed = parseGuestInvite(line);
          return {
            line, // keep original for URL (name | family)
            ...parsed,
          };
        })
        .filter((g) => g.name),
    [raw]
  );

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const copyLink = async (url: string, key: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
      <h2 className="text-base font-medium text-stone-900">
        Personalized guests
      </h2>
      <p className="text-sm text-stone-500">
        One guest per line. Their name appears on the envelope and inside the
        invite. Optional family:{" "}
        <span className="font-medium text-stone-700">
          Name | Family
        </span>
      </p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={6}
        placeholder={"Priya Kapoor\nArjun Singh | Singh Family\nMehta Family"}
        className="min-h-28 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
      />

      {guests.length > 0 && (
        <ul className="space-y-2">
          {guests.map((g) => {
            const url = buildInviteUrl(origin, config, g.line);
            return (
              <li
                key={g.line}
                className="rounded-lg border border-stone-100 bg-stone-50 p-3"
              >
                <p className="text-sm font-medium text-stone-800">
                  {g.greeting}
                </p>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  Envelope will say: To · {g.name}
                  {g.family ? ` · ${g.family}` : ""}
                </p>
                <p className="mt-1 break-all text-[11px] text-stone-400">{url}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyLink(url, g.line)}
                    className="min-h-11 rounded-lg border border-stone-200 bg-white px-3 text-xs"
                  >
                    {copied === g.line ? "Copied" : "Copy link"}
                  </button>
                  <a
                    href={buildWhatsAppUrl(
                      config.whatsappNumber,
                      shareInviteMessage(config, g.greeting, url)
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
