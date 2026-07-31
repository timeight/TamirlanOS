import {
  PET_SIZE,
  TASKBAR_HEIGHT,
  type PetBounds,
  type PetVector,
  type Rect,
} from "@/core/pet/pet-types";
import { clampToDesktop, isFree } from "@/core/pet/pet-physics";

export type InterestKind =
  "start-button" | "tray" | "clock" | "desktop-icon" | "window" | "open-space";

export interface InterestPoint {
  id: string;
  kind: InterestKind;
  position: PetVector;
  /** Relative pull. Higher means PIX visits it more often. */
  weight: number;
}

export interface NavigationInput {
  bounds: PetBounds;
  obstacles: readonly Rect[];
  /** Bounding boxes of visible windows, in z-order (last is focused). */
  windows: readonly Rect[];
  iconColumnWidth: number;
}

/**
 * Interest points are recomputed each time PIX needs a destination, so the map
 * always matches the live desktop. New landmarks are added here only.
 */
export function interestPoints(input: NavigationInput): InterestPoint[] {
  const { bounds } = input;
  const floor = bounds.height - TASKBAR_HEIGHT - PET_SIZE.height - 6;
  const points: InterestPoint[] = [
    {
      id: "start-button",
      kind: "start-button",
      position: { x: 24, y: floor },
      weight: 14,
    },
    {
      id: "tray",
      kind: "tray",
      position: { x: bounds.width - 190, y: floor },
      weight: 10,
    },
    {
      id: "clock",
      kind: "clock",
      position: { x: bounds.width - 96, y: floor },
      weight: 8,
    },
    {
      id: "icons",
      kind: "desktop-icon",
      position: { x: input.iconColumnWidth + 14, y: 96 },
      weight: 12,
    },
    {
      id: "icons-lower",
      kind: "desktop-icon",
      position: { x: input.iconColumnWidth + 14, y: 300 },
      weight: 9,
    },
  ];

  input.windows.forEach((rect, index) => {
    points.push({
      id: `window-${index}`,
      kind: "window",
      position: { x: rect.x + rect.width + 16, y: rect.y + rect.height - 96 },
      weight: index === input.windows.length - 1 ? 22 : 10,
    });
  });

  points.push({
    id: "open-space",
    kind: "open-space",
    position: {
      x: bounds.width * 0.55,
      y: bounds.height * 0.45,
    },
    weight: 11,
  });

  return points
    .map((point) => ({
      ...point,
      position: clampToDesktop(point.position, bounds),
    }))
    .filter((point) => isFree(point.position, input.obstacles));
}

export function pickInterestPoint(
  input: NavigationInput,
  lastId: string | null,
  random: () => number = Math.random,
): InterestPoint | null {
  const pool = interestPoints(input).filter((point) => point.id !== lastId);
  if (!pool.length) return null;
  const total = pool.reduce((sum, point) => sum + point.weight, 0);
  let roll = random() * total;
  for (const point of pool) {
    roll -= point.weight;
    if (roll <= 0) return point;
  }
  return pool[0] ?? null;
}
