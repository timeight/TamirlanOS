"use client";

import { formatTime } from "@/core/audio/fft-analyzer";
import { cn } from "@/core/utils/cn";
import { useWinampStore } from "@/stores/winamp-store";

export function WinampPlaylist() {
  const playlist = useWinampStore((state) => state.playlist);
  const currentId = useWinampStore((state) => state.currentId);
  const select = useWinampStore((state) => state.select);
  const setPlaying = useWinampStore((state) => state.setPlaying);
  const remove = useWinampStore((state) => state.remove);
  const move = useWinampStore((state) => state.move);

  return (
    <div className="flex min-h-0 flex-1 flex-col border-2 [border-style:inset] border-[#3b3b46] bg-[#0b0b12]">
      <p className="shrink-0 bg-[#1d1d28] px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[#8fa8b8] uppercase">
        playlist
      </p>
      <ol className="min-h-0 flex-1 overflow-auto py-0.5">
        {playlist.length === 0 && (
          <li className="px-2 py-3 text-center font-mono text-[10px] leading-4 text-[#4d6070]">
            перетащите сюда mp3, wav или ogg
          </li>
        )}
        {playlist.map((track, index) => (
          <li
            key={track.id}
            className={cn(
              "group flex items-center gap-2 px-2 py-[1px] font-mono text-[11px]",
              track.id === currentId
                ? "bg-[#1b3450] text-white"
                : "text-[#5ff85f]",
              !track.src && "opacity-45",
            )}
          >
            <button
              type="button"
              onDoubleClick={() => {
                select(track.id);
                setPlaying(true);
              }}
              onClick={() => select(track.id)}
              className="min-w-0 flex-1 truncate text-left focus-visible:outline-1 focus-visible:outline-[#5ff85f]"
            >
              {index + 1}. {track.title}
            </button>
            <span className="shrink-0 tabular-nums">
              {formatTime(track.duration)}
            </span>
            <span className="flex shrink-0 gap-0.5 opacity-0 transition-opacity duration-100 group-hover:opacity-100 focus-within:opacity-100 motion-reduce:transition-none">
              <button
                type="button"
                aria-label="Выше"
                onClick={() => move(track.id, -1)}
                className="px-1 hover:text-white"
              >
                ▲
              </button>
              <button
                type="button"
                aria-label="Ниже"
                onClick={() => move(track.id, 1)}
                className="px-1 hover:text-white"
              >
                ▼
              </button>
              <button
                type="button"
                aria-label="Удалить"
                onClick={() => remove(track.id)}
                className="px-1 hover:text-[#ff6b6b]"
              >
                ✕
              </button>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
