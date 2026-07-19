import type { Bounds, Size } from "@/types/geometry";

export enum ResizeDirection {
  North = "n",
  South = "s",
  East = "e",
  West = "w",
  NorthEast = "ne",
  NorthWest = "nw",
  SouthEast = "se",
  SouthWest = "sw",
}

const NORTH = new Set([
  ResizeDirection.North,
  ResizeDirection.NorthEast,
  ResizeDirection.NorthWest,
]);
const SOUTH = new Set([
  ResizeDirection.South,
  ResizeDirection.SouthEast,
  ResizeDirection.SouthWest,
]);
const EAST = new Set([
  ResizeDirection.East,
  ResizeDirection.NorthEast,
  ResizeDirection.SouthEast,
]);
const WEST = new Set([
  ResizeDirection.West,
  ResizeDirection.NorthWest,
  ResizeDirection.SouthWest,
]);

export function resizeBounds(
  start: Bounds,
  direction: ResizeDirection,
  dx: number,
  dy: number,
  min: Size,
  workArea: Size,
): Bounds {
  let { x, y, width, height } = start;

  if (EAST.has(direction))
    width = Math.min(start.width + dx, workArea.width - start.x);
  if (SOUTH.has(direction))
    height = Math.min(start.height + dy, workArea.height - start.y);
  if (WEST.has(direction)) width = start.width - dx;
  if (NORTH.has(direction)) height = start.height - dy;

  width = Math.max(width, min.width);
  height = Math.max(height, min.height);

  // Resizing from the west/north keeps the opposite edge fixed, so the origin moves.
  if (WEST.has(direction)) {
    x = start.x + start.width - width;
    if (x < 0) {
      width += x;
      x = 0;
    }
  }
  if (NORTH.has(direction)) {
    y = start.y + start.height - height;
    if (y < 0) {
      height += y;
      y = 0;
    }
  }

  return { x, y, width, height };
}
