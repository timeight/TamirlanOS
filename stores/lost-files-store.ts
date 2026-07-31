import { create } from "zustand";
import { persist } from "zustand/middleware";
import { publish } from "@/core/events/event-bus";
import { WorldEventType } from "@/core/events/world-events";
import {
  DRIFT_THRESHOLD,
  type DiscoverySource,
} from "@/core/lost-files/discovery";

/** idle → freeze (500 ms glitch) → revealed. */
export type RevealPhase = "idle" | "freeze" | "revealed";

interface LostFilesStore {
  discovered: boolean;
  source: DiscoverySource | null;
  phase: RevealPhase;
  /** Ids of files whose viewer was opened at least once. */
  read: string[];
  /** Folder ids the visitor has stepped into. */
  visited: string[];
  drift: number;
  discover: (source: DiscoverySource) => void;
  settle: () => void;
  nudgeDrift: () => boolean;
  markRead: (fileId: string) => void;
  markVisited: (folderId: string) => void;
  reset: () => void;
}

export const useLostFilesStore = create<LostFilesStore>()(
  persist(
    (set, get) => ({
      discovered: false,
      source: null,
      phase: "idle",
      read: [],
      visited: [],
      drift: 0,

      discover: (source) => {
        if (get().discovered) return;
        set({ discovered: true, source, phase: "freeze" });
        publish({ type: WorldEventType.LostFiles, active: true });
      },

      settle: () => set({ phase: "revealed" }),

      /** Returns true on the tick that crosses the threshold. */
      nudgeDrift: () => {
        if (get().discovered) return false;
        const drift = get().drift + 1;
        set({ drift });
        return drift >= DRIFT_THRESHOLD;
      },

      markRead: (fileId) =>
        set((state) =>
          state.read.includes(fileId)
            ? state
            : { read: [...state.read, fileId] },
        ),

      markVisited: (folderId) =>
        set((state) =>
          state.visited.includes(folderId)
            ? state
            : { visited: [...state.visited, folderId] },
        ),

      reset: () =>
        set({
          discovered: false,
          source: null,
          phase: "idle",
          read: [],
          visited: [],
          drift: 0,
        }),
    }),
    {
      name: "tamirlanos:lost-files",
      partialize: (state) => ({
        discovered: state.discovered,
        source: state.source,
        read: state.read,
        visited: state.visited,
        drift: state.drift,
      }),
      // A returning visitor is already past the reveal; never replay the glitch.
      onRehydrateStorage: () => (state) => {
        if (state?.discovered) state.phase = "revealed";
      },
    },
  ),
);
