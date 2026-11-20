import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Noto_Serif_Devanagari,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const tiro = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
});

const noto = Noto_Serif_Devanagari({
  variable: "--font-noto",
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Shalini & Samyak | Wedding Invitation",
    template: "%s · Shalini & Samyak",
  },
  description:
    "Together with our families, we invite you to celebrate the Mangal Parinay of Shalini & Samyak — 6 December 2026, Indore.",
  openGraph: {
    title: "Shalini & Samyak | Wedding Invitation",
    description: "6 December 2026 · Indore — You're invited",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shalini & Samyak | Wedding Invitation",
    description: "6 December 2026 · Indore — You're invited",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${tiro.variable} ${noto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
