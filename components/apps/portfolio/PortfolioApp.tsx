"use client";

import { useState } from "react";
import { FsIcon } from "@/components/apps/portfolio/FsIcon";
import { AchievementId } from "@/core/achievements/catalog";
import { AppKey } from "@/core/apps/app-catalog";
import { resolvePath, type FsNode } from "@/core/files/file-system";
import { cn } from "@/core/utils/cn";
import { useIsCompact } from "@/hooks/use-compact";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useAchievementStore } from "@/stores/achievement-store";
import { useExplorerStore } from "@/stores/explorer-store";

export function PortfolioApp() {
  const [path, setPath] = useState<readonly string[]>([]);
  const openApp = useOpenApp();
  const openFile = useExplorerStore((state) => state.openFile);
  const showHidden = useExplorerStore((state) => state.showHidden);
  const compact = useIsCompact();
  const t = useT();

  const folder = resolvePath(path);
  const children = (folder?.children ?? []).filter(
    (node) => showHidden || node.kind === "folder" || !node.hidden,
  );

  const activate = (node: FsNode) => {
    if (node.kind === "folder") {
      setPath([...path, node.name]);
      return;
    }
    if (node.action.type === "app") {
      openApp(node.action.appId);
      return;
    }
    if (node.hidden) {
      useAchievementStore.getState().unlock(AchievementId.Digger);
    }
    openFile(node.id);
    openApp(AppKey.FileViewer);
  };

  return (
    <div className="@container flex h-full flex-col bg-white text-[11px] text-black select-none">
      <div className="flex shrink-0 items-center gap-1 border-b border-[#aca899] bg-[#f4f3ee] px-1.5 py-1">
        <button
          type="button"
          onClick={() => setPath(path.slice(0, -1))}
          disabled={path.length === 0}
          className="rounded-[3px] border border-transparent px-2 py-0.5 hover:border-[#a9cdec] hover:bg-[#e6f0fb] disabled:text-[#a8a8a8] disabled:hover:border-transparent disabled:hover:bg-transparent"
        >
          ← {t("win.back")}
        </button>
        <button
          type="button"
          onClick={() => setPath([])}
          disabled={path.length === 0}
          className="rounded-[3px] border border-transparent px-2 py-0.5 hover:border-[#a9cdec] hover:bg-[#e6f0fb] disabled:text-[#a8a8a8] disabled:hover:border-transparent disabled:hover:bg-transparent"
        >
          ↑ {t("win.up")}
        </button>
        <span className="ml-1 hidden text-[#4a5a70] @[380px]:inline">
          {t("win.address")}
        </span>
        <span className="min-w-0 flex-1 truncate rounded-[2px] border border-[#7f9db9] bg-white px-2 py-0.5">
          C:\{path.join("\\")}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {children.length === 0 ? (
          <p className="p-4 text-center text-[#7a8390]">
            {t("fs.emptyFolder")}
          </p>
        ) : (
          <ul className="grid auto-rows-min grid-cols-2 gap-1 p-2 @sm:grid-cols-3 @lg:grid-cols-4">
            {children.map((node) => (
              <li key={node.kind === "folder" ? node.name : node.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (compact) activate(node);
                  }}
                  onDoubleClick={() => {
                    if (!compact) activate(node);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") activate(node);
                  }}
                  className={cn(
                    "flex w-full flex-col items-center gap-1 rounded-sm p-2 hover:bg-[#ebf3fb] focus-visible:outline-1 focus-visible:outline-[#316ac5] focus-visible:outline-dotted",
                    node.kind === "file" && node.hidden && "opacity-55",
                  )}
                >
                  <FsIcon node={node} className="h-9 w-9" />
                  <span className="text-center leading-tight break-all">
                    {node.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-stretch gap-0.5 border-t border-[#f6f4ec] bg-[#ece9d8] p-0.5 text-[10px] text-[#4a4a3a]">
        <span className="flex-1 truncate border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
          {t("fs.objects", { count: children.length })}
        </span>
        <span className="hidden border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)] @[380px]:block">
          {t("fs.myComputer")}
        </span>
      </div>
    </div>
  );
}
