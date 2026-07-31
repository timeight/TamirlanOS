import type { Bounds } from "@/types/geometry";

const KEY = "tamirlanos:window-memory";

type Memory = Record<string, Bounds>;

let cache: Memory | null = null;

function load(): Memory {
  if (cache) return cache;
  cache = {};
  if (typeof localStorage === "undefined") return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) cache = JSON.parse(raw) as Memory;
  } catch {
    cache = {};
  }
  return cache;
}

/** Geometry an app was last left at, so reopening feels like resuming. */
export function recallWindow(appId: string): Bounds | null {
  return load()[appId] ?? null;
}

export function rememberWindow(appId: string, bounds: Bounds): void {
  const memory = load();
  memory[appId] = bounds;
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    // Private browsing denies writes; geometry is not worth failing over.
  }
}

/** Keeps a restored window inside the current viewport after a resize. */
export function clampToViewport(bounds: Bounds, area: Bounds): Bounds {
  const width = Math.min(bounds.width, area.width);
  const height = Math.min(bounds.height, area.height);
  return {
    width,
    height,
    x: Math.min(Math.max(bounds.x, 0), Math.max(area.width - width, 0)),
    y: Math.min(Math.max(bounds.y, 0), Math.max(area.height - height, 0)),
  };
}
