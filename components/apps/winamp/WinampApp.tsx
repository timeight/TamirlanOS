"use client";

import { useState, type DragEvent } from "react";
import { WinampPlaylist } from "@/components/apps/winamp/WinampPlaylist";
import { WinampVisualizer } from "@/components/apps/winamp/WinampVisualizer";
import { formatTime } from "@/core/audio/fft-analyzer";
import { cn } from "@/core/utils/cn";
import { useWinampEngine } from "@/hooks/use-winamp-engine";
import { RepeatMode, useWinampStore, type Track } from "@/stores/winamp-store";

const AUDIO = /\.(mp3|wav|ogg|oga|aac|m4a|flac)$/i;

const button =
  "border border-[#5a5a68] bg-gradient-to-b from-[#4a4a58] to-[#2e2e38] px-2 py-[3px] text-[10px] text-[#d8d8e0] active:translate-y-px hover:from-[#57576a] focus-visible:outline-1 focus-visible:outline-[#5ff85f]";

export function WinampApp() {
  const store = useWinampStore();
  const { audioRef, seek } = useWinampEngine();
  const [over, setOver] = useState(false);

  const track = store.playlist.find((item) => item.id === store.currentId);
  const remaining = track ? Math.max(track.duration - store.position, 0) : 0;
  const [showRemaining, setShowRemaining] = useState(false);

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setOver(false);
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      AUDIO.test(file.name),
    );
    const tracks: Track[] = files.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      title: file.name.replace(AUDIO, ""),
      src: URL.createObjectURL(file),
      duration: 0,
    }));
    if (tracks.length > 0) store.add(tracks);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        "flex h-full min-h-0 flex-col gap-1 bg-[#2b2b34] p-1 select-none",
        over && "outline-2 outline-offset-[-4px] outline-[#5ff85f]",
      )}
    >
      <audio ref={audioRef} crossOrigin="anonymous" />

      <div className="flex shrink-0 items-stretch gap-1 border-2 [border-style:outset] border-[#4a4a58] bg-[#232330] p-1.5">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <button
            type="button"
            onClick={() => setShowRemaining((value) => !value)}
            className="text-left font-mono text-[19px] leading-none text-[#5ff85f] tabular-nums [text-shadow:0_0_6px_rgba(95,248,95,0.45)]"
          >
            {showRemaining ? "-" : ""}
            {formatTime(showRemaining ? remaining : store.position)}
          </button>
          <p className="truncate font-mono text-[11px] text-[#5ff85f]">
            {track ? track.title : "*** нет трека ***"}
          </p>
          <p className="font-mono text-[9px] text-[#3f8f4f]">
            {store.playing ? "▶" : "■"} 44 kHz · stereo
          </p>
        </div>
        <WinampVisualizer
          mode={store.mode}
          active={store.playing}
          onCycle={store.cycleMode}
        />
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(track?.duration ?? 0, 0.1)}
        step={0.1}
        value={store.position}
        onChange={(event) => {
          const value = Number(event.target.value);
          store.setPosition(value);
          seek(value);
        }}
        aria-label="Позиция"
        className="h-2 w-full shrink-0 accent-[#5ff85f]"
      />

      <div className="flex shrink-0 flex-wrap items-center gap-1">
        <button type="button" className={button} onClick={() => store.step(-1)}>
          ⏮
        </button>
        <button
          type="button"
          className={button}
          onClick={() => store.setPlaying(true)}
        >
          ▶
        </button>
        <button
          type="button"
          className={button}
          onClick={() => store.setPlaying(false)}
        >
          ⏸
        </button>
        <button
          type="button"
          className={button}
          onClick={() => {
            store.setPlaying(false);
            store.setPosition(0);
            seek(0);
          }}
        >
          ⏹
        </button>
        <button type="button" className={button} onClick={() => store.step(1)}>
          ⏭
        </button>

        <button
          type="button"
          aria-pressed={store.shuffle}
          onClick={store.toggleShuffle}
          className={cn(button, store.shuffle && "text-[#5ff85f]")}
        >
          SHUF
        </button>
        <button
          type="button"
          onClick={store.cycleRepeat}
          className={cn(
            button,
            store.repeat !== RepeatMode.Off && "text-[#5ff85f]",
          )}
        >
          REP{store.repeat === RepeatMode.One ? "1" : ""}
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2 font-mono text-[9px] text-[#8fa8b8]">
        <label className="flex flex-1 items-center gap-1">
          VOL
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={store.volume}
            onChange={(event) => store.setVolume(Number(event.target.value))}
            className="h-1.5 w-full accent-[#5ff85f]"
          />
        </label>
        <label className="flex flex-1 items-center gap-1">
          BAL
          <input
            type="range"
            min={-1}
            max={1}
            step={0.02}
            value={store.balance}
            onChange={(event) => store.setBalance(Number(event.target.value))}
            className="h-1.5 w-full accent-[#5ff85f]"
          />
        </label>
      </div>

      {!store.shaded && <WinampPlaylist />}

      <button
        type="button"
        onClick={store.toggleShade}
        className="shrink-0 self-start font-mono text-[9px] text-[#6b7f90] hover:text-[#5ff85f]"
      >
        {store.shaded ? "развернуть плейлист" : "свернуть в полоску"}
      </button>
    </div>
  );
}
