import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AchievementId } from "@/core/achievements/catalog";

interface AchievementStore {
  unlocked: string[];
  /** Ids waiting to be shown as balloons, in unlock order. */
  queue: string[];
  visitedApps: string[];
  unlock: (id: AchievementId) => void;
  markAppVisited: (appId: string) => void;
  dismissBalloon: () => void;
  reset: () => void;
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlocked: [],
      queue: [],
      visitedApps: [],

      unlock: (id) => {
        if (get().unlocked.includes(id)) return;
        set((state) => ({
          unlocked: [...state.unlocked, id],
          queue: [...state.queue, id],
        }));
      },

      markAppVisited: (appId) => {
        if (get().visitedApps.includes(appId)) return;
        set((state) => ({ visitedApps: [...state.visitedApps, appId] }));
      },

      dismissBalloon: () => set((state) => ({ queue: state.queue.slice(1) })),

      reset: () => set({ unlocked: [], queue: [], visitedApps: [] }),
    }),
    {
      name: "tamirlanos-achievements",
      partialize: (state) => ({
        unlocked: state.unlocked,
        visitedApps: state.visitedApps,
        queue: [],
      }),
    },
  ),
);
