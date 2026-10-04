"use client";

import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { cn } from "@/core/utils/cn";
import { formatDuration, type VkTrack } from "@/core/vk/api/audio";
import { useVkPlayerStore } from "@/stores/vk-player-store";

interface VkTrackListProps {
  tracks: readonly VkTrack[];
  viewerId: string;
  /** Для сообществ: управляющий может убрать чужую запись. */
  canModerate?: boolean;
  onRemove?: (track: VkTrack) => void;
}

export function VkTrackList({
  tracks,
  viewerId,
  canModerate,
  onRemove,
}: VkTrackListProps) {
  const current = useVkPlayerStore((state) => state.current());
  const playing = useVkPlayerStore((state) => state.playing);
  const start = useVkPlayerStore((state) => state.start);
  const toggle = useVkPlayerStore((state) => state.toggle);

  return (
    <ul>
      {tracks.map((track, at) => {
        const active = current?.id === track.id;
        return (
          <li
            key={track.id}
            className={cn(
              "flex items-center gap-2 border-b border-[#e3e8ec] py-1.5 text-[11px]",
              active && "bg-[#f3f6f9]",
            )}
          >
            <button
              type="button"
              aria-label={active && playing ? "Пауза" : "Слушать"}
              onClick={() => (active ? toggle() : start(tracks, at))}
              className="h-[18px] w-[18px] shrink-0 border border-[#b2bdc8] bg-[#edf1f5] text-[9px] leading-[16px] text-[#2b587a]"
            >
              {active && playing ? "❙❙" : "▶"}
            </button>

            <span className="min-w-0 flex-1 truncate">
              <span className="font-bold text-[#2b587a]">{track.artist}</span>
              <span className="text-[#333]"> — {track.title}</span>
            </span>

            <span className="shrink-0 text-[10px] text-[#939393]">
              {formatDuration(track.duration)}
            </span>

            {(track.owner_id === viewerId || canModerate) && onRemove && (
              <VkButton tone="quiet" onClick={() => onRemove(track)}>
                Удалить
              </VkButton>
            )}
          </li>
        );
      })}
    </ul>
  );
}
