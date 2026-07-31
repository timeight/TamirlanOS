import {
  PET_SIZE,
  TASKBAR_HEIGHT,
  type PetBounds,
  type PetVector,
  type Rect,
} from "@/core/pet/pet-types";

export const EDGE_MARGIN = 10;
/** Obstacles are grown by half the body so the centre point can be tested. */
const PAD_X = PET_SIZE.width / 2 + 4;
const PAD_Y = PET_SIZE.height / 2 + 4;

export function inflate(rect: Rect): Rect {
  return {
    x: rect.x - PAD_X,
    y: rect.y - PAD_Y,
    width: rect.width + PAD_X * 2,
    height: rect.height + PAD_Y * 2,
  };
}

export function contains(rect: Rect, point: PetVector): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/** Walkable area for the pet centre, taskbar and edges excluded. */
export function walkableBounds(bounds: PetBounds): Rect {
  return {
    x: EDGE_MARGIN + PET_SIZE.width / 2,
    y: EDGE_MARGIN + PET_SIZE.height / 2,
    width: bounds.width - (EDGE_MARGIN + PET_SIZE.width / 2) * 2,
    height:
      bounds.height -
      TASKBAR_HEIGHT -
      PET_SIZE.height / 2 -
      (EDGE_MARGIN + PET_SIZE.height / 2),
  };
}

export function isBlocked(
  point: PetVector,
  inflated: readonly Rect[],
  bounds: PetBounds,
): boolean {
  if (!contains(walkableBounds(bounds), point)) return true;
  return inflated.some((rect) => contains(rect, point));
}

export function clampToWalkable(
  point: PetVector,
  bounds: PetBounds,
): PetVector {
  const area = walkableBounds(bounds);
  return {
    x: Math.max(area.x, Math.min(area.x + area.width, point.x)),
    y: Math.max(area.y, Math.min(area.y + area.height, point.y)),
  };
}

/** Segment test by sampling; cheap and precise enough at desktop scale. */
export function lineOfSight(
  from: PetVector,
  to: PetVector,
  inflated: readonly Rect[],
  bounds: PetBounds,
): boolean {
  const steps = Math.max(
    2,
    Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 14),
  );
  for (let index = 0; index <= steps; index++) {
    const ratio = index / steps;
    const point = {
      x: from.x + (to.x - from.x) * ratio,
      y: from.y + (to.y - from.y) * ratio,
    };
    if (isBlocked(point, inflated, bounds)) return false;
  }
  return true;
}

/** Nearest free spot when a window lands on top of PIX. */
export function nearestFreePoint(
  from: PetVector,
  inflated: readonly Rect[],
  bounds: PetBounds,
): PetVector | null {
  if (!isBlocked(from, inflated, bounds)) return from;
  for (let radius = 40; radius <= 400; radius += 40) {
    for (let angle = 0; angle < 360; angle += 30) {
      const radians = (angle * Math.PI) / 180;
      const candidate = clampToWalkable(
        {
          x: from.x + Math.cos(radians) * radius,
          y: from.y + Math.sin(radians) * radius,
        },
        bounds,
      );
      if (!isBlocked(candidate, inflated, bounds)) return candidate;
    }
  }
  return null;
}
