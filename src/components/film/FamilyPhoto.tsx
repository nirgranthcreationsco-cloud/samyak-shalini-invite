"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  src: string;
  srcSm?: string;
  alt: string;
  className?: string;
};

/** Full family photo — object-fit contain, natural aspect, no face crop. */
export function FamilyPhoto({ src, srcSm, alt, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduced = usePrefersReducedMotion();
  const [ratio, setRatio] = useState<number | null>(null);
  const jpg = src.replace(/\.webp$/i, ".jpg");

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = src.endsWith(".webp") ? src : jpg;
  }, [src, jpg]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img || reduced) return;

    gsap.set(wrap, { clipPath: "inset(12% 12% 12% 12%)" });
    gsap.set(img, { scale: 1.04 });

    const ctx = gsap.context(() => {
      gsap.to(wrap, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrap,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        },
      });
      gsap.to(img, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 75%",
          end: "bottom 40%",
          scrub: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [reduced, ratio]);

  return (
    <div
      ref={wrapRef}
      data-family-photo
      className={`photo-frame photo-frame--pill mx-auto w-full max-w-[340px] overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio ? String(ratio) : "4 / 3",
        background: "#F3E6D0",
        willChange: "clip-path",
      }}
    >
      <picture>
        {srcSm && (
          <source srcSet={srcSm} type="image/webp" media="(max-width: 430px)" />
        )}
        {src.endsWith(".webp") && <source srcSet={src} type="image/webp" />}
        <img
          ref={imgRef}
          src={jpg}
          alt={alt}
          className="film-grade h-full w-full object-contain"
          draggable={false}
          style={{ willChange: "transform", transformOrigin: "center center" }}
        />
      </picture>
    </div>
  );
}
