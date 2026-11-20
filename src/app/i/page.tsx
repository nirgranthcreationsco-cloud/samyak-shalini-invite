import type { Metadata } from "next";
import { InvitePageClient } from "@/app/i/InvitePageClient";

export const metadata: Metadata = {
  title: "You're invited",
  description: "A personal wedding invitation awaits you.",
  openGraph: {
    title: "You're invited to a wedding",
    description: "Open this link to view your wedding invitation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "You're invited to a wedding",
    description: "Open this link to view your wedding invitation.",
  },
};

export default function InvitePage() {
  return <InvitePageClient />;
}
