"use client";

type Chapter = {
  id: string;
  label: string;
};

type Props = {
  chapters: Chapter[];
  activeId: string;
  onSelect: (id: string) => void;
  gold: string;
};

export function ChapterNav({ chapters, activeId, onSelect, gold }: Props) {
  return (
    <nav
      className="pointer-events-auto fixed bottom-5 left-1/2 z-50 flex max-w-[min(390px,92vw)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full border px-2 py-1.5 backdrop-blur-md"
      style={{
        borderColor: `${gold}44`,
        background: "rgba(18,8,10,0.72)",
      }}
      aria-label="Film chapters"
    >
      {chapters.map((c, i) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className="min-h-10 shrink-0 rounded-full px-3 text-[10px] tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              color: active ? "#12080a" : `${gold}cc`,
              background: active ? gold : "transparent",
              outlineColor: gold,
            }}
            aria-current={active ? "true" : undefined}
          >
            <span className="opacity-60">{String(i + 1).padStart(2, "0")}</span>{" "}
            {c.label}
          </button>
        );
      })}
    </nav>
  );
}
