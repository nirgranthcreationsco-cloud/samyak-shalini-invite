"use client";

import type { InviteConfig } from "@/types/invite";
import { InviteExperience } from "@/components/invite/InviteExperience";

type Props = {
  config: InviteConfig;
};

export function LivePreview({ config }: Props) {
  return (
    <div className="sticky top-4">
      <p className="mb-2 text-center text-xs tracking-wide text-stone-500">
        Live preview · 390px
      </p>
      <div
        className="mx-auto overflow-hidden rounded-[2rem] border-[10px] border-stone-900 shadow-xl"
        style={{ width: 320, height: 640 }}
      >
        <div className="h-full w-full origin-top-left scale-[0.82]" style={{ width: 390, height: 780 }}>
          <InviteExperience config={config} preview />
        </div>
      </div>
    </div>
  );
}
