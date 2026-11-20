"use client";

import { InviteExperience } from "@/components/invite/InviteExperience";
import { SAMPLE_CONFIG } from "@/lib/sample";

/** The invite is the product — open directly into Samyak & Shalini's journey. */
export default function HomePage() {
  return <InviteExperience config={SAMPLE_CONFIG} />;
}
