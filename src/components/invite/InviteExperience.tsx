"use client";

import type { InviteConfig } from "@/types/invite";
import { CinematicInvite } from "@/components/film/CinematicInvite";

type Props = {
  config: InviteConfig;
  guestName?: string | null;
  preview?: boolean;
  isSample?: boolean;
};

/** Guest-facing invite — photo film stage with real scenes & couple art. */
export function InviteExperience({ config, guestName, preview = false }: Props) {
  return (
    <CinematicInvite config={config} guestName={guestName} preview={preview} />
  );
}
