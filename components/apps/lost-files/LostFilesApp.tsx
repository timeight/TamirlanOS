"use client";

import { useEffect, useState } from "react";
import { ArchiveViewer } from "@/components/apps/lost-files/ArchiveViewer";
import { FileList } from "@/components/apps/lost-files/FileList";
import { FolderGrid } from "@/components/apps/lost-files/FolderGrid";
import { AchievementId } from "@/core/achievements/catalog";
import {
  LOST_FILE_COUNT,
  LOST_FOLDERS,
  type LostFile,
  type LostFolder,
} from "@/core/lost-files/archive";
import { useT } from "@/hooks/use-translations";
import { useAchievementStore } from "@/stores/achievement-store";
import { useLostFilesStore } from "@/stores/lost-files-store";

export function LostFilesApp() {
  const [folder, setFolder] = useState<LostFolder | null>(null);
  const [file, setFile] = useState<LostFile | null>(null);
  const read = useLostFilesStore((state) => state.read);
  const visited = useLostFilesStore((state) => state.visited);
  const markRead = useLostFilesStore((state) => state.markRead);
  const markVisited = useLostFilesStore((state) => state.markVisited);
  const unlock = useAchievementStore((state) => state.unlock);
  const t = useT();

  useEffect(() => {
    unlock(AchievementId.HiddenExplorer);
  }, [unlock]);

  useEffect(() => {
    if (read.length >= 5) unlock(AchievementId.CuriousMind);
    if (read.length >= LOST_FILE_COUNT) unlock(AchievementId.Historian);
    if (visited.length >= LOST_FOLDERS.length) unlock(AchievementId.Archivist);
  }, [read.length, visited.length, unlock]);

  const openFolder = (next: LostFolder) => {
    markVisited(next.id);
    setFolder(next);
    setFile(null);
  };

  const openFile = (next: LostFile) => {
    markRead(next.id);
    setFile(next);
  };

  const back = () => (file ? setFile(null) : setFolder(null));

  return (
    <div className="@container flex h-full min-h-0 flex-col bg-[#12161d]">
      <header className="flex shrink-0 items-center gap-2 border-b border-[#242c38] px-3 py-2">
        {folder && (
          <button
            type="button"
            onClick={back}
            className="rounded-sm border border-[#2c3441] px-2 py-1 font-mono text-[11px] text-[#a9b0bb] hover:border-[#3f4a5a] hover:text-[#e6e2d6] focus-visible:outline-1 focus-visible:outline-[#7fc3ff]"
          >
            ← {t("lost.back")}
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-mono text-[12px] tracking-[0.18em] text-[#e6e2d6] uppercase">
            {folder ? `Lost Files \\ ${folder.name}` : t("lost.title")}
          </h1>
          <p className="truncate text-[11px] text-[#7d828c]">
            {folder ? folder.caption : t("lost.intro")}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto">
        {!folder && <FolderGrid visited={visited} onOpen={openFolder} />}
        {folder && !file && (
          <FileList folder={folder} read={read} onOpen={openFile} />
        )}
        {file && <ArchiveViewer file={file} />}
      </div>

      <footer className="shrink-0 border-t border-[#242c38] px-3 py-1.5 font-mono text-[10px] text-[#5f6672]">
        {read.length} / {LOST_FILE_COUNT} {t("lost.read")}
      </footer>
    </div>
  );
}
