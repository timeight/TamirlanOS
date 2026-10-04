"use client";

import { useEffect, useRef, useState } from "react";
import { trackUrl } from "@/core/vk/api/audio";
import { useVkPlayerStore } from "@/stores/vk-player-store";

/**
 * Единственный элемент audio во всём VK. Он смонтирован в оболочке и не
 * размонтируется при переходе между разделами — поэтому звук не обрывается.
 * Собственный Web Audio граф не строится: его держит Winamp, и пересборка
 * сломала бы его визуализатор.
 */
export function VkPlayerHost() {
  const element = useRef<HTMLAudioElement>(null);
  const [source, setSource] = useState<string | null>(null);

  const track = useVkPlayerStore((state) => state.current());
  const playing = useVkPlayerStore((state) => state.playing);
  const volume = useVkPlayerStore((state) => state.volume);
  const muted = useVkPlayerStore((state) => state.muted);
  const seekTo = useVkPlayerStore((state) => state.seekTo);
  const seekDone = useVkPlayerStore((state) => state.seekDone);
  const report = useVkPlayerStore((state) => state.report);
  const next = useVkPlayerStore((state) => state.next);

  // Ссылка подписанная и живёт час, поэтому запрашивается на каждый трек.
  useEffect(() => {
    let alive = true;
    if (!track) {
      setSource(null);
      return;
    }
    void trackUrl(track.storage_path).then((url) => {
      if (alive) setSource(url);
    });
    return () => {
      alive = false;
    };
  }, [track]);

  useEffect(() => {
    const audio = element.current;
    if (!audio) return;
    if (playing && source) void audio.play().catch(() => undefined);
    else audio.pause();
  }, [playing, source]);

  useEffect(() => {
    const audio = element.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [muted, volume]);

  useEffect(() => {
    const audio = element.current;
    if (!audio || seekTo === null) return;
    audio.currentTime = seekTo;
    seekDone();
  }, [seekDone, seekTo]);

  return (
    <audio
      ref={element}
      src={source ?? undefined}
      preload="metadata"
      onTimeUpdate={(event) =>
        report(
          event.currentTarget.currentTime,
          Number.isFinite(event.currentTarget.duration)
            ? event.currentTarget.duration
            : 0,
        )
      }
      onEnded={next}
    />
  );
}
