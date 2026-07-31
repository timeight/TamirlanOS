import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExplorerStore {
  showHidden: boolean;
  openFileId: string | null;
  toggleHidden: () => void;
  openFile: (id: string) => void;
}

export const useExplorerStore = create<ExplorerStore>()(
  persist(
    (set) => ({
      showHidden: false,
      openFileId: null,
      toggleHidden: () => set((state) => ({ showHidden: !state.showHidden })),
      openFile: (id) => set({ openFileId: id }),
    }),
    {
      name: "tamirlanos-explorer",
      partialize: (state) => ({
        showHidden: state.showHidden,
        openFileId: null,
      }),
    },
  ),
);
