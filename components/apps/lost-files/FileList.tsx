import type { LostFile, LostFolder } from "@/core/lost-files/archive";
import { cn } from "@/core/utils/cn";

interface FileListProps {
  folder: LostFolder;
  read: readonly string[];
  onOpen: (file: LostFile) => void;
}

const EXT_COLOR: Record<string, string> = {
  txt: "#c9c6ba",
  readme: "#e0d7a8",
  doc: "#9db8dd",
  pdf: "#d59b9b",
  jpg: "#a8cfa5",
  png: "#a8cfa5",
  psd: "#9fb6e6",
  blend: "#e0a878",
  unity: "#bdbdbd",
  zip: "#d3c08a",
};

export function FileList({ folder, read, onOpen }: FileListProps) {
  return (
    <ul className="divide-y divide-[#242c38]">
      {folder.files.map((file) => (
        <li key={file.id}>
          <button
            type="button"
            onDoubleClick={() => onOpen(file)}
            onClick={(event) => {
              if (event.detail === 0) onOpen(file);
            }}
            className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors duration-100 hover:bg-[#1b222d] focus-visible:outline-1 focus-visible:outline-[#7fc3ff] motion-reduce:transition-none"
          >
            <span
              className="w-[52px] shrink-0 rounded-sm px-1 py-0.5 text-center font-mono text-[10px] text-[#12161d]"
              style={{ background: EXT_COLOR[file.kind] ?? "#c9c6ba" }}
            >
              {file.kind}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block truncate font-mono text-[12px]",
                  read.includes(file.id) ? "text-[#8d9099]" : "text-[#e6e2d6]",
                )}
              >
                {file.name}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-[#7d828c]">
                {file.note}
              </span>
            </span>
            <span className="hidden shrink-0 text-right font-mono text-[10px] text-[#5f6672] @[460px]:block">
              <span className="block">{file.size}</span>
              <span className="block">{file.modified}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
