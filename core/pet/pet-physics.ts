import {
  PET_SIZE,
  TASKBAR_HEIGHT,
  type PetBounds,
  type PetVector,
  type Rect,
} from "@/core/pet/pet-types";

const MARGIN = 12;
const WALK_SPEED = 46;
const RUN_SPEED = 120;
const ARRIVE_EPSILON = 3;

export function clampToDesktop(
  position: PetVector,
  bounds: PetBounds,
): PetVector {
  return {
    x: Math.max(
      MARGIN,
      Math.min(bounds.width - PET_SIZE.width - MARGIN, position.x),
    ),
    y: Math.max(
      MARGIN,
      Math.min(
        bounds.height - TASKBAR_HEIGHT - PET_SIZE.height - MARGIN,
        position.y,
      ),
    ),
  };
}

function overlaps(position: PetVector, rect: Rect): boolean {
  return (
    position.x < rect.x + rect.width &&
    position.x + PET_SIZE.width > rect.x &&
    position.y < rect.y + rect.height &&
    position.y + PET_SIZE.height > rect.y
  );
}

export function isFree(
  position: PetVector,
  obstacles: readonly Rect[],
): boolean {
  return !obstacles.some((rect) => overlaps(position, rect));
}

/** Picks a free spot; falls back to the current position when the desktop is full. */
export function pickTarget(
  from: PetVector,
  bounds: PetBounds,
  obstacles: readonly Rect[],
  random: () => number = Math.random,
): PetVector {
  for (let attempt = 0; attempt < 24; attempt++) {
    const candidate = clampToDesktop(
      {
        x: random() * bounds.width,
        y: random() * bounds.height,
      },
      bounds,
    );
    if (isFree(candidate, obstacles)) return candidate;
  }
  return from;
}

export interface StepResult {
  position: PetVector;
  facing: 1 | -1;
  arrived: boolean;
}

export function stepToward(
  from: PetVector,
  target: PetVector,
  dt: number,
  running = false,
): StepResult {
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const distance = Math.hypot(dx, dy);
  if (distance < ARRIVE_EPSILON) {
    return { position: from, facing: dx >= 0 ? 1 : -1, arrived: true };
  }
  const speed = running ? RUN_SPEED : WALK_SPEED;
  const travel = Math.min(distance, speed * dt);
  return {
    position: {
      x: from.x + (dx / distance) * travel,
      y: from.y + (dy / distance) * travel,
    },
    facing: dx >= 0 ? 1 : -1,
    arrived: false,
  };
}

export function distanceTo(a: PetVector, b: PetVector): number {
  return Math.hypot(
    a.x + PET_SIZE.width / 2 - b.x,
    a.y + PET_SIZE.height / 2 - b.y,
  );
}
