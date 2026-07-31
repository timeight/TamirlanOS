import { LOST_FOLDERS, type LostFolder } from "@/core/lost-files/archive";
import { cn } from "@/core/utils/cn";

interface FolderGridProps {
  visited: readonly string[];
  onOpen: (folder: LostFolder) => void;
}

export function FolderGrid({ visited, onOpen }: FolderGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-2 p-3 @[520px]:grid-cols-3">
      {LOST_FOLDERS.map((folder) => (
        <li key={folder.id}>
          <button
            type="button"
            onClick={() => onOpen(folder)}
            className={cn(
              "flex w-full items-start gap-2.5 rounded-sm border border-transparent px-2.5 py-2 text-left transition-colors duration-100 hover:border-[#3f4a5a] hover:bg-[#1b222d] focus-visible:outline-1 focus-visible:outline-[#7fc3ff] motion-reduce:transition-none",
              visited.includes(folder.id) && "opacity-70",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-0.5 h-7 w-7 shrink-0"
            >
              <path
                d="M2 6a1.5 1.5 0 0 1 1.5-1.5h5L10.4 7H20.5A1.5 1.5 0 0 1 22 8.5v10A1.5 1.5 0 0 1 20.5 20h-17A1.5 1.5 0 0 1 2 18.5Z"
                fill="#6c6552"
              />
              <path
                d="M2 9h20v9.5A1.5 1.5 0 0 1 20.5 20h-17A1.5 1.5 0 0 1 2 18.5Z"
                fill="#8a8371"
              />
            </svg>
            <span className="min-w-0">
              <span className="block font-mono text-[13px] text-[#e6e2d6]">
                {folder.name}
              </span>
              <span className="mt-0.5 block text-[11px] leading-4 text-[#8d9099]">
                {folder.caption}
              </span>
              <span className="mt-1 block text-[10px] text-[#5f6672]">
                {folder.files.length}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
