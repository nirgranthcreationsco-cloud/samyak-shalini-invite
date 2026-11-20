"use client";

import { useEffect, useState } from "react";
import type { InviteConfig } from "@/types/invite";
import { InviteExperience } from "@/components/invite/InviteExperience";
import { parseInviteHash } from "@/lib/encode";
import { SAMPLE_CONFIG } from "@/lib/sample";

export function InvitePageClient() {
  const [config, setConfig] = useState<InviteConfig>(SAMPLE_CONFIG);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const apply = () => {
      const { config: decoded, guestName: g, hasEncoded } = parseInviteHash(
        window.location.hash
      );
      if (hasEncoded && decoded) {
        setConfig(decoded);
      } else {
        setConfig(SAMPLE_CONFIG);
      }
      setGuestName(g);
      setReady(true);
    };

    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  if (!ready) {
    return (
      <div
        className="flex min-h-[100svh] items-center justify-center text-sm tracking-wide"
        style={{ background: "#2A1518", color: "#C9A227" }}
      >
        Opening invitation…
      </div>
    );
  }

  return <InviteExperience config={config} guestName={guestName} />;
}
