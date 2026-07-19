import { create } from "zustand";
import { persist } from "zustand/middleware";
import { playSound } from "@/core/audio/audio-manager";
import type { SoundEvent } from "@/types/sound";

// Conservative default per docs/AUDIO_GUIDELINES.md: the system is a guest in the user's speakers.
const DEFAULT_VOLUME = 0.5;

interface AudioStore {
  volume: number;
  muted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  play: (event: SoundEvent) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      volume: DEFAULT_VOLUME,
      muted: false,

      setVolume: (volume) => {
        set({ volume: Math.min(Math.max(volume, 0), 1) });
      },

      toggleMute: () => {
        set((state) => ({ muted: !state.muted }));
      },

      play: (event) => {
        const { volume, muted } = get();
        playSound(event, { volume, muted });
      },
    }),
    {
      name: "tamirlanos-audio",
      partialize: (state) => ({ volume: state.volume, muted: state.muted }),
    },
  ),
);
