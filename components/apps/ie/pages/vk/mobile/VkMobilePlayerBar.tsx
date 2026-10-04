"use client";

import { formatDuration } from "@/core/vk/api/audio";
import { useVkPlayerStore } from "@/stores/vk-player-store";

/** Полоса прижата к низу экрана и видна во всех разделах, пока играет трек. */
export function VkMobilePlayerBar() {
  const track = useVkPlayerStore((state) => state.current());
  const playing = useVkPlayerStore((state) => state.playing);
  const position = useVkPlayerStore((state) => state.position);
  const duration = useVkPlayerStore((state) => state.duration);
  const toggle = useVkPlayerStore((state) => state.toggle);
  const next = useVkPlayerStore((state) => state.next);
  const previous = useVkPlayerStore((state) => state.previous);
  const seek = useVkPlayerStore((state) => state.seek);
  const stop = useVkPlayerStore((state) => state.stop);

  if (!track) return null;
  const total = Math.max(1, Math.round(duration || track.duration));

  return (
    <div className="shrink-0 border-t border-[#c6ced6] bg-[linear-gradient(#fcfdfd,#e7ebef)]">
      <div className="flex items-center gap-2 px-[10px] py-1.5">
        <button
          type="button"
          aria-label="Предыдущая"
          onClick={previous}
          className="h-[30px] w-[28px] shrink-0 text-[12px] text-[#2a5885]"
        >
          ◀◀
        </button>
        <button
          type="button"
          aria-label={playing ? "Пауза" : "Слушать"}
          onClick={toggle}
          className="flex h-[30px] w-[32px] shrink-0 items-center justify-center rounded-[3px] border border-[#41699b] bg-[linear-gradient(#6a93c3,#5181b8)] text-[12px] text-white"
        >
          {playing ? "❙❙" : "▶"}
        </button>
        <button
          type="button"
          aria-label="Следующая"
          onClick={next}
          className="h-[30px] w-[28px] shrink-0 text-[12px] text-[#2a5885]"
        >
          ▶▶
        </button>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] text-[#2a5885]">
            {track.title}
          </span>
          <span className="block truncate text-[11px] text-[#8a8a8a]">
            {track.artist} · {formatDuration(position)} /{" "}
            {formatDuration(duration || track.duration)}
          </span>
        </span>

        <button
          type="button"
          aria-label="Остановить"
          onClick={stop}
          className="h-[30px] w-[24px] shrink-0 text-[14px] text-[#9aa4ad]"
        >
          ×
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={total}
        value={Math.round(position)}
        aria-label="Перемотка"
        onChange={(event) => seek(Number(event.target.value))}
        className="mb-1 h-[16px] w-full px-[10px]"
      />
    </div>
  );
}
