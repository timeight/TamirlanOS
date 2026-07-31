"use client";

import { FileIcon } from "@/components/ui/FileIcon";
import { findHiddenFile } from "@/core/files/hidden-files";
import { useT } from "@/hooks/use-translations";
import { useExplorerStore } from "@/stores/explorer-store";

export function FileViewerApp() {
  const openFileId = useExplorerStore((state) => state.openFileId);
  const t = useT();
  const file = openFileId ? findHiddenFile(openFileId) : undefined;

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center bg-white p-6 text-center text-[11px] text-[#4a5a70]">
        {t("files.empty")}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white text-black">
      <div className="flex shrink-0 items-center gap-2 border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2">
        <FileIcon kind={file.kind} className="h-7 w-7" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-bold">{file.name}</p>
          <p className="truncate text-[10px] text-[#4a5a70]">
            {file.size} · {file.modified}
          </p>
        </div>
      </div>
      <pre className="min-h-0 flex-1 overflow-auto px-3 py-2.5 font-mono text-[11px] leading-[1.65] whitespace-pre-wrap">
        {file.body.join("\n")}
      </pre>
      <div className="flex shrink-0 items-stretch gap-0.5 border-t border-[#f6f4ec] bg-[#ece9d8] p-0.5 text-[10px] text-[#4a4a3a]">
        <span className="flex-1 truncate border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
          C:\TamirlanOS\hidden\{file.name}
        </span>
        <span className="border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
          {t("files.readonly")}
        </span>
      </div>
    </div>
  );
}
