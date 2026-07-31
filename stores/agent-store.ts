import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Two ignored tips in a row is a clear signal to stop talking. */
const DISMISS_LIMIT = 2;
const MAX_PER_SESSION = 4;

interface AgentStore {
  currentNudgeId: string | null;
  shownIds: string[];
  dismissCount: number;
  muted: boolean;
  lastShownAt: number;
  show: (id: string) => void;
  accept: () => void;
  dismiss: () => void;
  mute: () => void;
  canShow: (now: number, cooldownMs: number) => boolean;
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      currentNudgeId: null,
      shownIds: [],
      dismissCount: 0,
      muted: false,
      lastShownAt: 0,

      show: (id) =>
        set((state) => ({
          currentNudgeId: id,
          shownIds: [...state.shownIds, id],
          lastShownAt: Date.now(),
        })),

      accept: () => set({ currentNudgeId: null, dismissCount: 0 }),

      dismiss: () =>
        set((state) => {
          const dismissCount = state.dismissCount + 1;
          return {
            currentNudgeId: null,
            dismissCount,
            muted: dismissCount >= DISMISS_LIMIT,
          };
        }),

      mute: () => set({ muted: true, currentNudgeId: null }),

      canShow: (now, cooldownMs) => {
        const state = get();
        return (
          !state.muted &&
          state.currentNudgeId === null &&
          state.shownIds.length < MAX_PER_SESSION &&
          now - state.lastShownAt > cooldownMs
        );
      },
    }),
    {
      name: "tamirlanos-agent",
      // Only the mute preference outlives the session; tips reset on reload.
      partialize: (state) => ({
        muted: state.muted,
        currentNudgeId: null,
        shownIds: [],
        dismissCount: 0,
        lastShownAt: 0,
      }),
    },
  ),
);
