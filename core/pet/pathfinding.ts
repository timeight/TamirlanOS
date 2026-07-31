import {
  clampToWalkable,
  isBlocked,
  lineOfSight,
  walkableBounds,
} from "@/core/pet/collision";
import type { PetBounds, PetVector, Rect } from "@/core/pet/pet-types";

const CELL = 36;
const MAX_EXPANSIONS = 1800;

interface Node {
  cx: number;
  cy: number;
}

function toCell(point: PetVector, origin: PetVector): Node {
  return {
    cx: Math.round((point.x - origin.x) / CELL),
    cy: Math.round((point.y - origin.y) / CELL),
  };
}

function toPoint(node: Node, origin: PetVector): PetVector {
  return { x: origin.x + node.cx * CELL, y: origin.y + node.cy * CELL };
}

/**
 * Breadth-first search on a coarse grid, then string-pulled with line of sight
 * so the result reads as a natural route instead of stair steps.
 */
export function findPath(
  from: PetVector,
  to: PetVector,
  inflated: readonly Rect[],
  bounds: PetBounds,
): PetVector[] {
  const goal = clampToWalkable(to, bounds);
  if (lineOfSight(from, goal, inflated, bounds)) return [goal];

  const area = walkableBounds(bounds);
  const origin = { x: area.x, y: area.y };
  const cols = Math.max(1, Math.floor(area.width / CELL));
  const rows = Math.max(1, Math.floor(area.height / CELL));

  const start = toCell(from, origin);
  const target = toCell(goal, origin);
  const key = (node: Node) => node.cy * (cols + 1) + node.cx;

  const queue: Node[] = [start];
  const cameFrom = new Map<number, Node | null>([[key(start), null]]);
  let expansions = 0;
  let found: Node | null = null;

  while (queue.length && expansions < MAX_EXPANSIONS) {
    const current = queue.shift()!;
    expansions++;
    if (current.cx === target.cx && current.cy === target.cy) {
      found = current;
      break;
    }
    for (const [dx, dy] of NEIGHBOURS) {
      const nextNode = { cx: current.cx + dx, cy: current.cy + dy };
      if (
        nextNode.cx < 0 ||
        nextNode.cy < 0 ||
        nextNode.cx > cols ||
        nextNode.cy > rows
      ) {
        continue;
      }
      const id = key(nextNode);
      if (cameFrom.has(id)) continue;
      if (isBlocked(toPoint(nextNode, origin), inflated, bounds)) continue;
      cameFrom.set(id, current);
      queue.push(nextNode);
    }
  }

  if (!found) {
    // Unreachable: walk as far as the straight line allows.
    return [from];
  }

  const reversed: PetVector[] = [];
  let cursor: Node | null = found;
  while (cursor) {
    reversed.push(toPoint(cursor, origin));
    cursor = cameFrom.get(key(cursor)) ?? null;
  }
  reversed.reverse();
  reversed.push(goal);

  return smooth(from, reversed, inflated, bounds);
}

const NEIGHBOURS: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

/** Drops waypoints that a straight line already covers. */
function smooth(
  from: PetVector,
  path: readonly PetVector[],
  inflated: readonly Rect[],
  bounds: PetBounds,
): PetVector[] {
  const result: PetVector[] = [];
  let anchor = from;
  let index = 0;
  while (index < path.length) {
    let furthest = index;
    for (let probe = path.length - 1; probe > index; probe--) {
      if (lineOfSight(anchor, path[probe]!, inflated, bounds)) {
        furthest = probe;
        break;
      }
    }
    const point = path[furthest]!;
    result.push(point);
    anchor = point;
    index = furthest + 1;
  }
  return result;
}
