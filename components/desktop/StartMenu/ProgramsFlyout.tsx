"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { FlyoutShell } from "@/components/desktop/StartMenu/FlyoutShell";
import { listApplications } from "@/core/process/app-registry";
import { useT } from "@/hooks/use-translations";
import type { AppId } from "@/types/application";

interface ProgramsFlyoutProps {
  onLaunch: (id: AppId) => void;
  onClose: () => void;
}

export function ProgramsFlyout({ onLaunch, onClose }: ProgramsFlyoutProps) {
  const t = useT();
  const apps = [...listApplications()]
    .map((app) => ({
      id: app.id,
      iconSrc: app.iconSrc,
      title: t(`app.${app.id}`),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <FlyoutShell title={t("start.allPrograms")} side="bottom" onClose={onClose}>
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
    </FlyoutShell>
  );
}
