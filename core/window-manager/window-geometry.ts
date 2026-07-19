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
