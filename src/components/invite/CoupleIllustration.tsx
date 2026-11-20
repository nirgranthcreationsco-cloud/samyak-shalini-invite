"use client";

import { motion } from "framer-motion";
import type { OutfitColors } from "@/types/invite";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  brideOutfit: OutfitColors;
  groomOutfit: OutfitColors;
  className?: string;
  size?: number;
};

/** Layered anime-style couple — faces/hair fixed; outfits from config colours. */
export function CoupleIllustration({
  brideOutfit,
  groomOutfit,
  className = "",
  size = 220,
}: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size * 1.15 }}
      aria-hidden="true"
      animate={
        reduced
          ? undefined
          : { y: [0, -8, 0], rotate: [-0.4, 0.4, -0.4] }
      }
      transition={
        reduced
          ? undefined
          : { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <svg
        viewBox="0 0 240 276"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft ground shadow */}
        <ellipse cx="120" cy="262" rx="70" ry="8" fill="currentColor" opacity="0.08" />

        {/* ——— GROOM (left) ——— */}
        <g transform="translate(28, 28)">
          {/* Body / sherwani */}
          <path
            d="M38 118 C38 98 48 88 62 88 C76 88 86 98 86 118 L90 200 C90 210 80 218 62 218 C44 218 34 210 34 200 Z"
            fill={groomOutfit.top}
          />
          <path
            d="M40 170 L86 170 L88 210 C88 218 78 224 62 224 C46 224 36 218 36 210 Z"
            fill={groomOutfit.bottom}
          />
          {/* Collar / accent */}
          <path
            d="M52 90 L62 108 L72 90"
            stroke={groomOutfit.accent}
            strokeWidth="2.5"
            fill="none"
          />
          <circle cx="62" cy="112" r="3" fill={groomOutfit.accent} />
          {/* Arms */}
          <path
            d="M38 120 C22 130 18 160 24 180"
            stroke={groomOutfit.top}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M86 120 C102 130 106 160 100 180"
            stroke={groomOutfit.top}
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Hands */}
          <circle cx="24" cy="182" r="7" fill="#F5D0B0" />
          <circle cx="100" cy="182" r="7" fill="#F5D0B0" />

          {/* Neck */}
          <rect x="54" y="72" width="16" height="18" rx="4" fill="#F5D0B0" />

          {/* Head */}
          <ellipse cx="62" cy="52" rx="28" ry="32" fill="#F5D0B0" />

          {/* Side-parted hair */}
          <path
            d="M34 48 C34 22 48 14 62 14 C78 14 90 24 90 46 C90 38 84 32 76 30 C70 42 58 46 48 42 C42 48 36 52 34 48 Z"
            fill="#2A1F18"
          />
          <path
            d="M48 18 C52 28 58 32 66 28"
            stroke="#1A1410"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />

          {/* Ears */}
          <ellipse cx="34" cy="54" rx="5" ry="7" fill="#F0C4A0" />
          <ellipse cx="90" cy="54" rx="5" ry="7" fill="#F0C4A0" />

          {/* Eyes — glossy */}
          <ellipse cx="50" cy="54" rx="6.5" ry="7.5" fill="#fff" />
          <ellipse cx="74" cy="54" rx="6.5" ry="7.5" fill="#fff" />
          <ellipse cx="51" cy="55" rx="3.8" ry="4.5" fill="#3A2818" />
          <ellipse cx="75" cy="55" rx="3.8" ry="4.5" fill="#3A2818" />
          <circle cx="52.5" cy="53" r="1.6" fill="#fff" />
          <circle cx="76.5" cy="53" r="1.6" fill="#fff" />
          {/* Brows */}
          <path d="M43 45 Q50 42 57 45" stroke="#2A1F18" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M67 45 Q74 42 81 45" stroke="#2A1F18" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Blush */}
          <ellipse cx="42" cy="64" rx="6" ry="3.5" fill="#F2A8A0" opacity="0.45" />
          <ellipse cx="82" cy="64" rx="6" ry="3.5" fill="#F2A8A0" opacity="0.45" />

          {/* Nose */}
          <path d="M62 58 L60 66 L64 66" stroke="#E0B090" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Smile */}
          <path d="M54 72 Q62 78 70 72" stroke="#C87870" strokeWidth="1.6" fill="none" strokeLinecap="round" />

          {/* Trimmed beard */}
          <path
            d="M44 68 C46 82 54 90 62 90 C70 90 78 82 80 68 C76 74 70 78 62 78 C54 78 48 74 44 68 Z"
            fill="#2A1F18"
            opacity="0.55"
          />
        </g>

        {/* ——— BRIDE (right) ——— */}
        <g transform="translate(108, 20)">
          {/* Lehenga / skirt */}
          <path
            d="M20 140 C10 160 4 200 8 230 C30 236 70 236 92 230 C96 200 90 160 80 140 Z"
            fill={brideOutfit.bottom}
          />
          <path
            d="M22 140 C28 155 72 155 78 140"
            fill={brideOutfit.accent}
            opacity="0.35"
          />

          {/* Blouse / top */}
          <path
            d="M28 100 C28 86 40 78 50 78 C60 78 72 86 72 100 L76 145 C76 152 66 158 50 158 C34 158 24 152 24 145 Z"
            fill={brideOutfit.top}
          />
          {/* Dupatta accent */}
          <path
            d="M22 95 C8 110 4 150 18 175"
            stroke={brideOutfit.accent}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M78 95 C92 110 96 150 82 175"
            stroke={brideOutfit.accent}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* Arms */}
          <path
            d="M28 105 C14 120 12 150 20 168"
            stroke={brideOutfit.top}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M72 105 C86 120 88 150 80 168"
            stroke={brideOutfit.top}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="20" cy="170" r="6.5" fill="#F7D4B8" />
          <circle cx="80" cy="170" r="6.5" fill="#F7D4B8" />

          {/* Bangles */}
          <circle cx="20" cy="162" r="5" stroke={brideOutfit.accent} strokeWidth="1.5" fill="none" />
          <circle cx="80" cy="162" r="5" stroke={brideOutfit.accent} strokeWidth="1.5" fill="none" />

          {/* Neck */}
          <rect x="42" y="68" width="16" height="16" rx="4" fill="#F7D4B8" />

          {/* Necklace */}
          <path d="M42 78 Q50 88 58 78" stroke={brideOutfit.accent} strokeWidth="2" fill="none" />
          <circle cx="50" cy="86" r="3" fill={brideOutfit.accent} />

          {/* Head */}
          <ellipse cx="50" cy="48" rx="30" ry="34" fill="#F7D4B8" />

          {/* Shiny long hair */}
          <path
            d="M20 48 C18 18 32 8 50 8 C70 8 84 20 80 50 C86 70 88 110 82 140 C74 120 72 90 70 70 C68 90 62 120 55 145 C48 120 42 90 40 70 C36 95 30 125 24 145 C16 110 14 70 20 48 Z"
            fill="#1A1210"
          />
          {/* Hair shine */}
          <path
            d="M42 14 C46 30 48 50 46 70"
            stroke="#4A3830"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M56 12 C58 28 60 48 58 68"
            stroke="#FFF8F0"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
          />

          {/* Maang tikka */}
          <circle cx="50" cy="18" r="3.5" fill={brideOutfit.accent} />
          <path d="M50 22 L50 32" stroke={brideOutfit.accent} strokeWidth="1.5" />
          <circle cx="50" cy="34" r="2.5" fill={brideOutfit.accent} />

          {/* Ears + earrings */}
          <ellipse cx="20" cy="50" rx="5" ry="7" fill="#F0C4A0" />
          <ellipse cx="80" cy="50" rx="5" ry="7" fill="#F0C4A0" />
          <circle cx="20" cy="60" r="3" fill={brideOutfit.accent} />
          <circle cx="80" cy="60" r="3" fill={brideOutfit.accent} />

          {/* Eyes — big glossy */}
          <ellipse cx="38" cy="50" rx="7.5" ry="8.5" fill="#fff" />
          <ellipse cx="62" cy="50" rx="7.5" ry="8.5" fill="#fff" />
          <ellipse cx="39" cy="51" rx="4.2" ry="5" fill="#3A2818" />
          <ellipse cx="63" cy="51" rx="4.2" ry="5" fill="#3A2818" />
          <circle cx="41" cy="48.5" r="2" fill="#fff" />
          <circle cx="65" cy="48.5" r="2" fill="#fff" />
          <circle cx="37" cy="53" r="0.9" fill="#fff" opacity="0.7" />
          <circle cx="61" cy="53" r="0.9" fill="#fff" opacity="0.7" />

          {/* Lashes */}
          <path d="M30 44 Q34 40 38 42" stroke="#1A1210" strokeWidth="1.2" fill="none" />
          <path d="M62 42 Q66 40 70 44" stroke="#1A1210" strokeWidth="1.2" fill="none" />

          {/* Brows */}
          <path d="M30 41 Q38 36 46 40" stroke="#1A1210" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M54 40 Q62 36 70 41" stroke="#1A1210" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Blush */}
          <ellipse cx="28" cy="60" rx="7" ry="4" fill="#F2A8A0" opacity="0.5" />
          <ellipse cx="72" cy="60" rx="7" ry="4" fill="#F2A8A0" opacity="0.5" />

          {/* Nose */}
          <path d="M50 54 L48 62 L52 62" stroke="#E8B898" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Soft smile */}
          <path d="M42 68 Q50 75 58 68" stroke="#C87870" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
}
