"use client";

import { FileIcon } from "@/components/ui/FileIcon";
import { AchievementId } from "@/core/achievements/catalog";
import { AppKey } from "@/core/apps/app-catalog";
import { HIDDEN_FILES } from "@/core/files/hidden-files";
import { useIsCompact } from "@/hooks/use-compact";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useAchievementStore } from "@/stores/achievement-store";
import { useExplorerStore } from "@/stores/explorer-store";

export function HiddenFileList() {
  const openApp = useOpenApp();
  const openFile = useExplorerStore((state) => state.openFile);
  const compact = useIsCompact();
  const t = useT();

  const open = (id: string) => {
    useAchievementStore.getState().unlock(AchievementId.Digger);
    openFile(id);
    openApp(AppKey.FileViewer);
  };

  return (
    <div className="border-t border-[#d4d0c8] px-2 pt-2 pb-1">
      <p className="mb-1 px-1 text-[10px] tracking-wide text-[#8a867a] uppercase">
        {t("files.hiddenGroup")}
      </p>
      <ul className="grid auto-rows-min grid-cols-2 gap-1 @sm:grid-cols-3 @lg:grid-cols-4">
        {HIDDEN_FILES.map((file) => (
          <li key={file.id}>
            <button
              type="button"
              onClick={() => {
                if (compact) open(file.id);
              }}
              onDoubleClick={() => {
                if (!compact) open(file.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") open(file.id);
              }}
              className="flex w-full flex-col items-center gap-1 rounded-sm p-2 opacity-60 hover:bg-[#ebf3fb] focus-visible:outline-1 focus-visible:outline-[#316ac5] focus-visible:outline-dotted"
            >
              <FileIcon kind={file.kind} className="h-8 w-8" />
              <span className="text-center leading-tight break-all">
                {file.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
