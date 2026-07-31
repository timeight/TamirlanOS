import type { Bounds, Size } from "@/types/geometry";

// Minimum sliver of title bar that must stay reachable so a window can always be recovered.
export const MIN_VISIBLE_EDGE = 32;

export function clampToWorkArea(bounds: Bounds, workArea: Size): Bounds {
  const x = Math.min(
    Math.max(bounds.x, MIN_VISIBLE_EDGE - bounds.width),
    workArea.width - MIN_VISIBLE_EDGE,
  );
  const y = Math.min(Math.max(bounds.y, 0), workArea.height - MIN_VISIBLE_EDGE);
  return { ...bounds, x, y };
}

export function enforceMinSize(size: Size, min: Size): Size {
  return {
    width: Math.max(size.width, min.width),
    height: Math.max(size.height, min.height),
  };
}

const SNAP_PX = 12;

/**
 * Pulls a window flush against a screen edge when it is dragged close enough.
 * Pure arithmetic: safe to call from a pointer-move handler.
 */
export function snapToEdges(
  bounds: Bounds,
  workArea: { width: number; height: number },
): Bounds {
  const right = workArea.width - (bounds.x + bounds.width);
  const bottom = workArea.height - (bounds.y + bounds.height);
  return {
    ...bounds,
    x:
      bounds.x <= SNAP_PX
        ? 0
        : right <= SNAP_PX && right >= 0
          ? workArea.width - bounds.width
          : bounds.x,
    y:
      bounds.y <= SNAP_PX
        ? 0
        : bottom <= SNAP_PX && bottom >= 0
          ? workArea.height - bounds.height
          : bounds.y,
  };
}
