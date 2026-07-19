import { create } from "zustand";
import { enforceMinSize } from "@/core/window-manager/window-geometry";
import { raiseWindow, removeWindow } from "@/core/window-manager/z-order";
import type { ApplicationManifest } from "@/types/application";
import type { Bounds, Position, Size } from "@/types/geometry";
import {
  WindowState,
  type WindowDescriptor,
  type WindowId,
} from "@/types/window";

interface WindowStore {
  windows: Record<WindowId, WindowDescriptor>;
  zOrder: WindowId[];
  focusedId: WindowId | null;
  openWindow: (manifest: ApplicationManifest, bounds: Bounds) => WindowId;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId, workArea: Size) => void;
  restoreWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, position: Position) => void;
  resizeWindow: (id: WindowId, bounds: Bounds) => void;
}

function topVisible(
  order: readonly WindowId[],
  windows: Record<WindowId, WindowDescriptor>,
): WindowId | null {
  for (let i = order.length - 1; i >= 0; i--) {
    const id = order[i];
    if (id === undefined) continue;
    const window = windows[id];
    if (window && window.state !== WindowState.Minimized) return id;
  }
  return null;
}

export const useWindowStore = create<WindowStore>()((set, get) => {
  const update = (
    id: WindowId,
    change: (window: WindowDescriptor) => Partial<WindowDescriptor>,
  ) => {
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;
      return {
        windows: { ...state.windows, [id]: { ...window, ...change(window) } },
      };
    });
  };

  return {
    windows: {},
    zOrder: [],
    focusedId: null,

    openWindow: (manifest, bounds) => {
      if (manifest.singleton) {
        const existing = Object.values(get().windows).find(
          (window) => window.appId === manifest.id,
        );
        if (existing) {
          get().focusWindow(existing.id);
          return existing.id;
        }
      }
      const id = crypto.randomUUID();
      const descriptor: WindowDescriptor = {
        id,
        appId: manifest.id,
        title: manifest.title,
        bounds: { ...bounds, ...enforceMinSize(bounds, manifest.minSize) },
        restoreBounds: null,
        state: WindowState.Normal,
        resizable: manifest.resizable,
        minSize: manifest.minSize,
      };
      set((state) => ({
        windows: { ...state.windows, [id]: descriptor },
        zOrder: [...state.zOrder, id],
        focusedId: id,
      }));
      return id;
    },

    closeWindow: (id) => {
      set((state) => {
        const windows = { ...state.windows };
        delete windows[id];
        const zOrder = removeWindow(state.zOrder, id);
        return {
          windows,
          zOrder,
          focusedId:
            state.focusedId === id
              ? topVisible(zOrder, windows)
              : state.focusedId,
        };
      });
    },

    focusWindow: (id) => {
      set((state) => {
        const window = state.windows[id];
        if (!window || window.state === WindowState.Minimized) return state;
        return { zOrder: raiseWindow(state.zOrder, id), focusedId: id };
      });
    },

    minimizeWindow: (id) => {
      update(id, () => ({ state: WindowState.Minimized }));
      set((state) => ({
        focusedId:
          state.focusedId === id
            ? topVisible(state.zOrder, state.windows)
            : state.focusedId,
      }));
    },

    maximizeWindow: (id, workArea) => {
      update(id, (window) =>
        window.state === WindowState.Normal && window.resizable
          ? {
              state: WindowState.Maximized,
              restoreBounds: window.bounds,
              bounds: { x: 0, y: 0, ...workArea },
            }
          : {},
      );
    },

    restoreWindow: (id) => {
      update(id, (window) => {
        if (window.state === WindowState.Maximized) {
          return {
            state: WindowState.Normal,
            bounds: window.restoreBounds ?? window.bounds,
            restoreBounds: null,
          };
        }
        if (window.state === WindowState.Minimized) {
          return { state: WindowState.Normal };
        }
        return {};
      });
      get().focusWindow(id);
    },

    moveWindow: (id, position) => {
      update(id, (window) =>
        window.state === WindowState.Normal
          ? { bounds: { ...window.bounds, ...position } }
          : {},
      );
    },

    resizeWindow: (id, bounds) => {
      update(id, (window) =>
        window.state === WindowState.Normal && window.resizable
          ? { bounds: { ...bounds, ...enforceMinSize(bounds, window.minSize) } }
          : {},
      );
    },
  };
});
