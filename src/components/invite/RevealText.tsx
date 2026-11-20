"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "span";
};

export function RevealText({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 22, filter: "blur(6px)" }
      }
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tag className="contents">{children}</Tag>
    </motion.div>
  );
}

type StaggerProps = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  baseDelay?: number;
  step?: number;
};

export function StaggerLines({
  lines,
  className = "",
  lineClassName = "",
  baseDelay = 0.15,
  step = 0.45,
}: StaggerProps) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <RevealText
          key={i}
          delay={baseDelay + i * step}
          className={lineClassName}
        >
          {line}
        </RevealText>
      ))}
    </div>
  );
}

/** Letter-by-letter display for names */
export function RevealLetters({
  text,
  className = "",
  delay = 0,
  color,
}: {
  text: string;
  className?: string;
  delay?: number;
  color?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  const letters = text.split("");

  if (reduced) {
    return (
      <p className={className} style={{ color }}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={`${className} inline-flex flex-wrap justify-center`} style={{ color }}>
      {letters.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : undefined }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{
            duration: 0.45,
            delay: delay + i * 0.045,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </p>
  );
}

export function GoldLine({
  color,
  className = "",
  delay = 0,
}: {
  color: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref} className={`mx-auto h-px w-24 overflow-hidden ${className}`}>
      <motion.div
        className="h-full w-full origin-left"
        style={{ background: color }}
        initial={{ scaleX: reduced ? 1 : 0 }}
        animate={inView || reduced ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function ScrollCue({ color }: { color: string }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className="relative z-10 mt-12 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.8 }}
      aria-hidden="true"
    >
      <p
        className="text-[10px] tracking-[0.35em] uppercase"
        style={{ color, opacity: 0.55 }}
      >
        Scroll the journey
      </p>
      <motion.div
        className="flex h-10 w-6 items-start justify-center rounded-full border pt-1.5"
        style={{ borderColor: `${color}66` }}
        animate={reduced ? undefined : { y: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
          animate={reduced ? undefined : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
