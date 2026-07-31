import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VisualizerMode } from "@/core/audio/fft-analyzer";
import { publish } from "@/core/events/event-bus";
import { WorldEventType } from "@/core/events/world-events";

export enum RepeatMode {
  Off = "off",
  All = "all",
  One = "one",
}

export interface Track {
  id: string;
  title: string;
  /** Object URLs die on reload; a src-less track is shown greyed out. */
  src: string | null;
  duration: number;
}

interface WinampStore {
  playlist: Track[];
  currentId: string | null;
  playing: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  balance: number;
  mode: VisualizerMode;
  shaded: boolean;
  position: number;
  add: (tracks: Track[]) => void;
  remove: (id: string) => void;
  move: (id: string, delta: number) => void;
  select: (id: string) => void;
  setPlaying: (playing: boolean) => void;
  step: (delta: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolume: (value: number) => void;
  setBalance: (value: number) => void;
  cycleMode: () => void;
  toggleShade: () => void;
  setPosition: (seconds: number) => void;
  setDuration: (id: string, duration: number) => void;
  clear: () => void;
}

const ORDER: readonly RepeatMode[] = [
  RepeatMode.Off,
  RepeatMode.All,
  RepeatMode.One,
];
const MODES: readonly VisualizerMode[] = [
  VisualizerMode.Spectrum,
  VisualizerMode.Oscilloscope,
  VisualizerMode.Off,
];

export const useWinampStore = create<WinampStore>()(
  persist(
    (set, get) => ({
      playlist: [],
      currentId: null,
      playing: false,
      shuffle: false,
      repeat: RepeatMode.Off,
      volume: 0.7,
      balance: 0,
      mode: VisualizerMode.Spectrum,
      shaded: false,
      position: 0,

      add: (tracks) =>
        set((state) => ({
          playlist: [...state.playlist, ...tracks],
          currentId: state.currentId ?? tracks[0]?.id ?? null,
        })),

      remove: (id) =>
        set((state) => ({
          playlist: state.playlist.filter((track) => track.id !== id),
          currentId: state.currentId === id ? null : state.currentId,
          playing: state.currentId === id ? false : state.playing,
        })),

      move: (id, delta) =>
        set((state) => {
          const index = state.playlist.findIndex((track) => track.id === id);
          const target = index + delta;
          if (index < 0 || target < 0 || target >= state.playlist.length) {
            return state;
          }
          const playlist = [...state.playlist];
          const [moved] = playlist.splice(index, 1);
          if (moved) playlist.splice(target, 0, moved);
          return { playlist };
        }),

      select: (id) => set({ currentId: id, position: 0 }),

      setPlaying: (playing) => {
        set({ playing });
        const track = get().playlist.find(
          (item) => item.id === get().currentId,
        );
        publish(
          playing
            ? { type: WorldEventType.SongStarted, title: track?.title }
            : { type: WorldEventType.SongStopped },
        );
      },

      /** Walks the playlist honouring shuffle; repeat is handled by the engine. */
      step: (delta) => {
        const { playlist, currentId, shuffle } = get();
        if (playlist.length === 0) return;
        if (shuffle) {
          const pool = playlist.filter((track) => track.id !== currentId);
          const pick = pool[Math.floor(Math.random() * pool.length)];
          if (pick) set({ currentId: pick.id, position: 0 });
          return;
        }
        const index = playlist.findIndex((track) => track.id === currentId);
        const next = (index + delta + playlist.length) % playlist.length;
        set({ currentId: playlist[next]?.id ?? null, position: 0 });
      },

      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      cycleRepeat: () =>
        set((state) => ({
          repeat:
            ORDER[(ORDER.indexOf(state.repeat) + 1) % ORDER.length] ??
            RepeatMode.Off,
        })),
      setVolume: (value) => set({ volume: Math.min(Math.max(value, 0), 1) }),
      setBalance: (value) => set({ balance: Math.min(Math.max(value, -1), 1) }),
      cycleMode: () =>
        set((state) => ({
          mode:
            MODES[(MODES.indexOf(state.mode) + 1) % MODES.length] ??
            VisualizerMode.Spectrum,
        })),
      toggleShade: () => set((state) => ({ shaded: !state.shaded })),
      setPosition: (position) => set({ position }),
      setDuration: (id, duration) =>
        set((state) => ({
          playlist: state.playlist.map((track) =>
            track.id === id ? { ...track, duration } : track,
          ),
        })),
      clear: () => set({ playlist: [], currentId: null, playing: false }),
    }),
    {
      name: "tamirlanos:winamp",
      partialize: (state) => ({
        // Blob URLs are dropped on purpose: they cannot survive a reload.
        playlist: state.playlist.map((track) => ({
          ...track,
          src: track.src?.startsWith("blob:") ? null : track.src,
        })),
        currentId: state.currentId,
        shuffle: state.shuffle,
        repeat: state.repeat,
        volume: state.volume,
        balance: state.balance,
        mode: state.mode,
        shaded: state.shaded,
        position: state.position,
      }),
    },
  ),
);
