import { create } from "zustand";
import type { VkTrack } from "@/core/vk/api/audio";

interface VkPlayerStore {
  /** Очередь: откуда играем и что дальше. */
  queue: readonly VkTrack[];
  index: number;
  playing: boolean;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
  /** Что сделать со звуком: читает единственный элемент audio в оболочке. */
  seekTo: number | null;
  current: () => VkTrack | null;
  start: (queue: readonly VkTrack[], index: number) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  seekDone: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  report: (position: number, duration: number) => void;
  stop: () => void;
}

/**
 * Состояние плеера живёт в сторе, а не в компоненте раздела: иначе переход
 * на другую страницу VK размонтировал бы его и музыка обрывалась бы.
 */
export const useVkPlayerStore = create<VkPlayerStore>((set, get) => ({
  queue: [],
  index: 0,
  playing: false,
  position: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  seekTo: null,

  current: () => get().queue[get().index] ?? null,

  start: (queue, index) =>
    set({ queue, index, playing: true, position: 0, duration: 0 }),

  toggle: () =>
    set((state) => ({ playing: !state.playing && !!state.current() })),

  next: () =>
    set((state) => {
      const at = state.index + 1;
      if (at >= state.queue.length) return { playing: false };
      return { index: at, position: 0, duration: 0, playing: true };
    }),

  previous: () =>
    set((state) => {
      // Первые секунды трека перематывают к началу, как было в плеерах той эпохи.
      if (state.position > 3) return { seekTo: 0 };
      const at = state.index - 1;
      if (at < 0) return { seekTo: 0 };
      return { index: at, position: 0, duration: 0, playing: true };
    }),

  seek: (seconds) => set({ seekTo: seconds }),
  seekDone: () => set({ seekTo: null }),
  setVolume: (value) => set({ volume: value, muted: false }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  report: (position, duration) => set({ position, duration }),
  stop: () => set({ queue: [], index: 0, playing: false, position: 0 }),
}));
