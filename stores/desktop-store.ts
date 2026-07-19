import { create } from "zustand";
import { DEFAULT_ICONS } from "@/core/desktop/default-icons";
import { DEFAULT_WALLPAPER } from "@/core/wallpaper/wallpapers";
import type { DesktopIcon } from "@/types/desktop-icon";
import type { Wallpaper } from "@/types/wallpaper";

interface DesktopStore {
  wallpaper: Wallpaper;
  icons: readonly DesktopIcon[];
  selectedIconId: string | null;
  crtEnabled: boolean;
  selectIcon: (id: string) => void;
  clearSelection: () => void;
  toggleCrt: () => void;
}

export const useDesktopStore = create<DesktopStore>()((set) => ({
  wallpaper: DEFAULT_WALLPAPER,
  icons: DEFAULT_ICONS,
  selectedIconId: null,
  crtEnabled: true,

  selectIcon: (id) => {
    set({ selectedIconId: id });
  },

  clearSelection: () => {
    set({ selectedIconId: null });
  },

  toggleCrt: () => {
    set((state) => ({ crtEnabled: !state.crtEnabled }));
  },
}));
