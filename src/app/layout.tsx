import type { Metadata, Viewport } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Noto_Serif_Devanagari,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import "./globals.css";

/** Force light UI — Samsung/Android dark mode must not invert the invite. */
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F7F1E6",
  width: "device-width",
  initialScale: 1,
};

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
    default: "Samyak & Shalini | Wedding Invitation",
    template: "%s · Samyak & Shalini",
  },
  description:
    "Together with our families, we invite you to celebrate the Mangal Parinay of Samyak & Shalini — 6 December 2026, Indore.",
  openGraph: {
    title: "Samyak & Shalini | Wedding Invitation",
    description: "6 December 2026 · Indore — You're invited",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samyak & Shalini | Wedding Invitation",
    description: "6 December 2026 · Indore — You're invited",
  },
  other: {
    "color-scheme": "light only",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      style={{ colorScheme: "light only" }}
      className={`${cinzel.variable} ${cormorant.variable} ${tiro.variable} ${noto.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col font-body"
        style={{ background: "#F7F1E6", color: "#2A1A14", colorScheme: "light only" }}
      >
        {children}
      </body>
    </html>
  );
}
