"use client";

import { useEffect } from "react";
import { useAudioStore } from "@/stores/audio-store";
import { SoundEvent } from "@/types/sound";

// A faint tick on every primary press, the way XP voiced its chrome.
export function useClickSound() {
  const play = useAudioStore((state) => state.play);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      play(SoundEvent.Click);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [play]);
}
