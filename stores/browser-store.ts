import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HOME_PAGE, resolveUrl, type PageMeta } from "@/core/browser/pages";

export type LoadPhase = "idle" | "opening" | "connecting" | "loading" | "done";

interface BrowserStore {
  entries: PageMeta[];
  index: number;
  phase: LoadPhase;
  devMode: boolean;
  visited: string[];
  current: () => PageMeta;
  canBack: () => boolean;
  canForward: () => boolean;
  navigate: (input: string) => void;
  back: () => void;
  forward: () => void;
  setPhase: (phase: LoadPhase) => void;
  enableDevMode: () => void;
}

export const useBrowserStore = create<BrowserStore>()(
  persist(
    (set, get) => ({
      entries: [HOME_PAGE],
      index: 0,
      phase: "idle",
      devMode: false,
      visited: [],

      current: () => get().entries[get().index] ?? HOME_PAGE,
      canBack: () => get().index > 0,
      canForward: () => get().index < get().entries.length - 1,

      navigate: (input) => {
        const page = resolveUrl(input);
        set((state) => {
          const entries = [...state.entries.slice(0, state.index + 1), page];
          const visited = state.visited.includes(page.url)
            ? state.visited
            : [...state.visited, page.url].slice(-12);
          return { entries, index: entries.length - 1, visited };
        });
      },

      back: () => set((state) => ({ index: Math.max(0, state.index - 1) })),
      forward: () =>
        set((state) => ({
          index: Math.min(state.entries.length - 1, state.index + 1),
        })),

      setPhase: (phase) => set({ phase }),
      enableDevMode: () => set({ devMode: true }),
    }),
    {
      name: "tamirlanos-browser",
      // Dev mode is the only thing worth remembering between sessions.
      partialize: (state) => ({
        devMode: state.devMode,
        entries: [HOME_PAGE],
        index: 0,
        phase: "idle" as LoadPhase,
        visited: [],
      }),
    },
  ),
);
