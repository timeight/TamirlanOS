"use client";

import { useEffect } from "react";
import { unlockAudio } from "@/core/audio/audio-manager";

// The power button is the intended unlock gesture, but a reload or hot update can drop that
// state while the desktop is already running — the first gesture anywhere restores audio.
export function useAudioUnlock() {
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);
}
