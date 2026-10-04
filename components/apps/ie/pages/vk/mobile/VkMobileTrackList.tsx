"use client";

import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { cn } from "@/core/utils/cn";
import { formatDuration, type VkTrack } from "@/core/vk/api/audio";
import { useVkPlayerStore } from "@/stores/vk-player-store";

interface VkMobileTrackListProps {
  tracks: readonly VkTrack[];
  viewerId: string;
  canModerate?: boolean;
  onRemove?: (track: VkTrack) => void;
}

export function VkMobileTrackList({
  tracks,
  viewerId,
  canModerate,
  onRemove,
}: VkMobileTrackListProps) {
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
              "relative flex min-h-[43px] items-center gap-2.5 px-[10px] py-1.5",
              "after:absolute after:right-0 after:bottom-0 after:left-[10px] after:h-px after:bg-[#d5d9de] after:content-['']",
              active ? "bg-[#eef3f8]" : "bg-white",
            )}
          >
            <button
              type="button"
              aria-label={active && playing ? "Пауза" : "Слушать"}
              onClick={() => (active ? toggle() : start(tracks, at))}
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[3px] border border-[#c2cad3] bg-[linear-gradient(#fdfdfe,#eef1f4)] text-[11px] text-[#2a5885]"
            >
              {active && playing ? "❙❙" : "▶"}
            </button>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] text-[#2a5885]">
                {track.title}
              </span>
              <span className="block truncate text-[12px] text-[#8a8a8a]">
                {track.artist}
              </span>
            </span>

            <span className="shrink-0 text-[12px] text-[#9aa4ad]">
              {formatDuration(track.duration)}
            </span>

            {(track.owner_id === viewerId || canModerate) && onRemove && (
              <VkMobileButton
                size="small"
                tone="secondary"
                onClick={() => onRemove(track)}
              >
                Удалить
              </VkMobileButton>
            )}
          </li>
        );
      })}
    </ul>
  );
}
