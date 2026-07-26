"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { listApplications } from "@/core/process/app-registry";
import { useT } from "@/hooks/use-translations";
import type { AppId } from "@/types/application";

interface ProgramsFlyoutProps {
  onLaunch: (id: AppId) => void;
}

export function ProgramsFlyout({ onLaunch }: ProgramsFlyoutProps) {
  const t = useT();
  const apps = [...listApplications()]
    .map((app) => ({
      id: app.id,
      iconSrc: app.iconSrc,
      title: t(`app.${app.id}`),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div
      role="menu"
      className="absolute bottom-0 left-full z-20 ml-0.5 max-h-[70vh] w-[220px] overflow-auto rounded-sm border border-[#8a8676] bg-white py-1 shadow-[3px_3px_10px_rgba(0,0,0,0.4)]"
    >
      {apps.map((app) => (
        <button
          key={app.id}
          type="button"
          role="menuitem"
          onClick={() => onLaunch(app.id)}
          className="hover:bg-xp-selection focus-visible:bg-xp-selection flex w-full items-center gap-2 px-2 py-1 text-left text-[11px] hover:text-white focus-visible:text-white focus-visible:outline-none"
        >
          <Image
            src={app.iconSrc}
            alt=""
            width={20}
            height={20}
            unoptimized
            draggable={false}
          />
          <span className="truncate">{app.title}</span>
        </button>
      ))}
    </div>
  );
}
