/**
 * Dev-only: after scrolling the film, log any elements still at opacity 0.
 * Call once from CinematicInvite when NODE_ENV === "development".
 */
export function runOpacityAudit(root: HTMLElement): void {
  if (process.env.NODE_ENV !== "development") return;

  const scan = () => {
    const hidden: string[] = [];
    root.querySelectorAll<HTMLElement>("*").forEach((el) => {
      const op = getComputedStyle(el).opacity;
      if (op === "0" || Number(op) === 0) {
        // Ignore decorative/particle layers and zero-size nodes
        if (el.getAttribute("aria-hidden") === "true") return;
        if (el.tagName === "CANVAS") return;
        if (!el.offsetParent && el.offsetWidth === 0) return;
        const label =
          el.getAttribute("data-chapter") ||
          el.getAttribute("data-ceremony-card") ||
          el.className?.toString?.().slice(0, 60) ||
          el.tagName;
        hidden.push(label);
      }
    });
    if (hidden.length) {
      console.warn(
        "[invite opacity audit] elements still at opacity 0:",
        hidden.slice(0, 40)
      );
    } else {
      console.info("[invite opacity audit] no content stuck at opacity 0");
    }
  };

  // After 6s of scrolling the whole page, log any stuck opacity-0 nodes
  const max = root.scrollHeight - root.clientHeight;
  const steps = 16;
  let i = 0;
  const step = () => {
    if (i > steps) {
      scan();
      root.scrollTop = 0;
      return;
    }
    root.scrollTop = (max / steps) * i;
    i += 1;
    window.setTimeout(step, 120);
  };
  window.setTimeout(step, 6000);
}
