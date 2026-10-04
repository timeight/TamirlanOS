"use client";

import { formatDuration } from "@/core/vk/api/audio";
import { useVkPlayerStore } from "@/stores/vk-player-store";

/** Узкая полоса под списком — в 2012 плеер выглядел именно так. */
export function VkPlayerBar() {
  const track = useVkPlayerStore((state) => state.current());
  const playing = useVkPlayerStore((state) => state.playing);
  const position = useVkPlayerStore((state) => state.position);
  const duration = useVkPlayerStore((state) => state.duration);
  const volume = useVkPlayerStore((state) => state.volume);
  const muted = useVkPlayerStore((state) => state.muted);
  const toggle = useVkPlayerStore((state) => state.toggle);
  const next = useVkPlayerStore((state) => state.next);
  const previous = useVkPlayerStore((state) => state.previous);
  const seek = useVkPlayerStore((state) => state.seek);
  const setVolume = useVkPlayerStore((state) => state.setVolume);
  const toggleMute = useVkPlayerStore((state) => state.toggleMute);

  if (!track) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border border-[#dae1e8] bg-[#f6f8fa] px-2 py-1.5 text-[11px]">
      <span className="flex gap-1">
        <button
          type="button"
          aria-label="Предыдущая"
          onClick={previous}
          className="h-[18px] w-[20px] border border-[#b2bdc8] bg-[#edf1f5] text-[9px] text-[#2b587a]"
        >
          ◀◀
        </button>
        <button
          type="button"
          aria-label={playing ? "Пауза" : "Слушать"}
          onClick={toggle}
          className="h-[18px] w-[20px] border border-[#b2bdc8] bg-[#edf1f5] text-[9px] text-[#2b587a]"
        >
          {playing ? "❙❙" : "▶"}
        </button>
        <button
          type="button"
          aria-label="Следующая"
          onClick={next}
          className="h-[18px] w-[20px] border border-[#b2bdc8] bg-[#edf1f5] text-[9px] text-[#2b587a]"
        >
          ▶▶
        </button>
      </span>

      <span className="min-w-0 flex-1 truncate">
        <span className="font-bold text-[#2b587a]">{track.artist}</span>
        <span className="text-[#333]"> — {track.title}</span>
      </span>

      <span className="shrink-0 text-[10px] text-[#939393]">
        {formatDuration(position)} /{" "}
        {formatDuration(duration || track.duration)}
      </span>

      <input
        type="range"
        min={0}
        max={Math.max(1, Math.round(duration || track.duration))}
        value={Math.round(position)}
        aria-label="Перемотка"
        onChange={(event) => seek(Number(event.target.value))}
        className="h-[14px] w-[140px]"
      />

      <button
        type="button"
        onClick={toggleMute}
        className="text-[#2b587a] hover:underline"
      >
        {muted ? "звук выкл." : "звук"}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round((muted ? 0 : volume) * 100)}
        aria-label="Громкость"
        onChange={(event) => setVolume(Number(event.target.value) / 100)}
        className="h-[14px] w-[70px]"
      />
    </div>
  );
}
