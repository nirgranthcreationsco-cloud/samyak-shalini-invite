import gsap from "gsap";

/** Slow foil gradient sweep on .foil-text elements. */
export function startFoilShine(
  root: HTMLElement | Document = document,
  reduced = false
): () => void {
  if (reduced) return () => {};
  const nodes = root.querySelectorAll<HTMLElement>(".foil-text");
  if (!nodes.length) return () => {};

  const tweens = Array.from(nodes).map((el) =>
    gsap.to(el, {
      backgroundPosition: "0% 50%",
      duration: 4.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    })
  );

  return () => {
    tweens.forEach((t) => t.kill());
  };
}
