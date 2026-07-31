import { clampToWalkable, isBlocked } from "@/core/pet/collision";
import {
  PET_SIZE,
  TASKBAR_HEIGHT,
  type PetBounds,
  type PetVector,
  type Rect,
} from "@/core/pet/pet-types";

export type NodeKind =
  "start-button" | "taskbar" | "tray" | "clock" | "icon" | "window" | "center";

export interface MapNode {
  id: string;
  kind: NodeKind;
  position: PetVector;
  /** Attraction, 1–5 stars from the design brief. */
  interest: number;
}

export interface MapInput {
  bounds: PetBounds;
  inflated: readonly Rect[];
  /** Live window rects in z-order; the last one is focused. */
  windows: readonly { rect: Rect; appId: string }[];
  iconColumnWidth: number;
}

/** Attraction per application window. Unknown apps fall back to three stars. */
const APP_INTEREST: Record<string, number> = {
  projects: 5,
  ie: 4,
  portfolio: 4,
  photography: 4,
  agent: 4,
  "recycle-bin": 3,
  achievements: 4,
  skills: 3,
  resume: 3,
  paint: 3,
};

/** Rebuilt on demand so the level always matches the live desktop. */
export function buildDesktopMap(input: MapInput): MapNode[] {
  const { bounds } = input;
  const floorY = bounds.height - TASKBAR_HEIGHT - PET_SIZE.height / 2 - 8;
  const nodes: MapNode[] = [
    {
      id: "start-button",
      kind: "start-button",
      position: { x: 54, y: floorY },
      interest: 4,
    },
    {
      id: "taskbar-mid",
      kind: "taskbar",
      position: { x: bounds.width * 0.45, y: floorY },
      interest: 4,
    },
    {
      id: "tray",
      kind: "tray",
      position: { x: bounds.width - 170, y: floorY },
      interest: 3,
    },
    {
      id: "clock",
      kind: "clock",
      position: { x: bounds.width - 80, y: floorY },
      interest: 2,
    },
    {
      id: "icons-top",
      kind: "icon",
      position: { x: input.iconColumnWidth + 30, y: 120 },
      interest: 3,
    },
    {
      id: "icons-bottom",
      kind: "icon",
      position: { x: input.iconColumnWidth + 30, y: 330 },
      interest: 3,
    },
    {
      id: "center",
      kind: "center",
      position: { x: bounds.width * 0.55, y: bounds.height * 0.42 },
      interest: 3,
    },
  ];

  input.windows.forEach((entry, index) => {
    const focused = index === input.windows.length - 1;
    nodes.push({
      id: `window-${entry.appId}-${index}`,
      kind: "window",
      position: {
        x: entry.rect.x + entry.rect.width + 40,
        y: entry.rect.y + entry.rect.height - 40,
      },
      interest: (APP_INTEREST[entry.appId] ?? 3) + (focused ? 1 : 0),
    });
  });

  return nodes
    .map((node) => ({
      ...node,
      position: clampToWalkable(node.position, bounds),
    }))
    .filter((node) => !isBlocked(node.position, input.inflated, bounds));
}

/** Weighted by interest and biased toward nodes that are not far away. */
export function selectDestination(
  from: PetVector,
  nodes: readonly MapNode[],
  lastNodeId: string | null,
  random: () => number = Math.random,
): MapNode | null {
  const pool = nodes.filter((node) => node.id !== lastNodeId);
  if (!pool.length) return null;

  const scored = pool.map((node) => {
    const distance = Math.hypot(
      node.position.x - from.x,
      node.position.y - from.y,
    );
    const proximity = 1 / (1 + distance / 420);
    return { node, weight: node.interest * node.interest * proximity };
  });

  const total = scored.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = random() * total;
  for (const entry of scored) {
    roll -= entry.weight;
    if (roll <= 0) return entry.node;
  }
  return scored[0]?.node ?? null;
}
