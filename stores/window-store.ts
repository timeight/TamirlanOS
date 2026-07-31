import { create } from "zustand";
import { enforceMinSize } from "@/core/window-manager/window-geometry";
import {
  clampToViewport,
  recallWindow,
  rememberWindow,
} from "@/core/window-manager/window-memory";
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
  closing: readonly WindowId[];
  openWindow: (manifest: ApplicationManifest, bounds: Bounds) => WindowId;
  closeWindow: (id: WindowId) => void;
  destroyWindow: (id: WindowId) => void;
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
    closing: [],

    openWindow: (manifest, bounds) => {
      if (manifest.singleton) {
        const closing = get().closing;
        const existing = Object.values(get().windows).find(
          (window) =>
            window.appId === manifest.id && !closing.includes(window.id),
        );
        if (existing) {
          get().focusWindow(existing.id);
          return existing.id;
        }
      }
      const id = crypto.randomUUID();
      const remembered = recallWindow(manifest.id);
      const start = remembered
        ? clampToViewport(remembered, {
            x: 0,
            y: 0,
            width: globalThis.innerWidth,
            height: globalThis.innerHeight - 30,
          })
        : bounds;
      const descriptor: WindowDescriptor = {
        id,
        appId: manifest.id,
        title: manifest.title,
        bounds: { ...start, ...enforceMinSize(start, manifest.minSize) },
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

    /**
     * Marks the window closing and hands focus on immediately, so the window
     * below lights up while the closing one is still fading. The frame calls
     * destroyWindow once its exit animation ends.
     */
    closeWindow: (id) => {
      set((state) => {
        const target = state.windows[id];
        if (!target || state.closing.includes(id)) return state;
        if (target.state === WindowState.Normal) {
          rememberWindow(target.appId, target.bounds);
        }
        const survivors = { ...state.windows };
        for (const gone of [id, ...state.closing]) delete survivors[gone];
        return {
          closing: [...state.closing, id],
          focusedId:
            state.focusedId === id
              ? topVisible(removeWindow(state.zOrder, id), survivors)
              : state.focusedId,
        };
      });
    },

    destroyWindow: (id) => {
      set((state) => {
        if (!state.windows[id]) return state;
        const windows = { ...state.windows };
        delete windows[id];
        const zOrder = removeWindow(state.zOrder, id);
        return {
          windows,
          zOrder,
          closing: state.closing.filter((closingId) => closingId !== id),
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
      update(id, (window) => {
        if (window.state !== WindowState.Normal) return {};
        const bounds = { ...window.bounds, ...position };
        rememberWindow(window.appId, bounds);
        return { bounds };
      });
    },

    resizeWindow: (id, bounds) => {
      update(id, (window) => {
        if (window.state !== WindowState.Normal || !window.resizable) return {};
        const next = { ...bounds, ...enforceMinSize(bounds, window.minSize) };
        rememberWindow(window.appId, next);
        return { bounds: next };
      });
    },
  };
});
