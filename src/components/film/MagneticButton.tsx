"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import gsap from "gsap";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  strength?: number;
};

/** Subtle magnetic pull on fine pointer devices only. */
export function MagneticButton({
  children,
  className = "",
  strength = 18,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, {
        x: (x / r.width) * strength,
        y: (y / r.height) * strength,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <button ref={ref} type="button" className={`btn-magnetic ${className}`} {...rest}>
      {children}
    </button>
  );
}
