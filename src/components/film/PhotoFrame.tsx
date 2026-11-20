"use client";

type Variant = "arch" | "circle" | "pill";

type Props = {
  src: string;
  srcSm?: string;
  alt: string;
  variant?: Variant;
  className?: string;
  imgClassName?: string;
};

export function PhotoFrame({
  src,
  srcSm,
  alt,
  variant = "arch",
  className = "",
  imgClassName = "",
}: Props) {
  const shape =
    variant === "circle"
      ? "photo-frame--circle"
      : variant === "pill"
        ? "photo-frame--pill"
        : "photo-frame--arch";

  const jpg = src.replace(/\.webp$/i, ".jpg");

  return (
    <div className={`photo-frame ${shape} ${className}`}>
      <picture>
        {srcSm && <source srcSet={srcSm} type="image/webp" media="(max-width: 430px)" />}
        {src.endsWith(".webp") && <source srcSet={src} type="image/webp" />}
        <img
          src={jpg}
          alt={alt}
          className={`film-grade h-full w-full object-cover ${imgClassName}`}
          draggable={false}
        />
      </picture>
    </div>
  );
}

/** Cut-out mounted on a large gold arch with ground shadow — never over full-bleed photo. */
export function ArchMountedCutout({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto flex w-full max-w-[280px] flex-col items-center ${className}`}>
      <div
        className="absolute inset-x-4 bottom-2 top-0 -z-10 rounded-[999px_999px_40px_40px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.08) 55%, transparent 100%)",
          border: "1px solid rgba(212,175,55,0.55)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="ground-shadow relative z-10 h-auto max-h-[46svh] w-auto max-w-full object-contain"
        draggable={false}
      />
      <div
        className="mt-[-8px] h-3 w-[55%] rounded-[100%] opacity-50"
        style={{
          background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
        }}
      />
    </div>
  );
}
