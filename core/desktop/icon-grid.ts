import type { GridSlot } from "@/types/desktop-icon";
import type { Position } from "@/types/geometry";

export const ICON_GRID = {
  cellWidth: 76,
  cellHeight: 90,
  paddingX: 8,
  paddingY: 8,
} as const;

export function slotToPosition(slot: GridSlot): Position {
  return {
    x: ICON_GRID.paddingX + slot.column * ICON_GRID.cellWidth,
    y: ICON_GRID.paddingY + slot.row * ICON_GRID.cellHeight,
  };
}

export function nextFreeSlot(
  occupied: readonly GridSlot[],
  rowsPerColumn: number,
): GridSlot {
  const taken = new Set(occupied.map((slot) => `${slot.column}:${slot.row}`));
  for (let column = 0; ; column++) {
    for (let row = 0; row < rowsPerColumn; row++) {
      if (!taken.has(`${column}:${row}`)) return { column, row };
    }
  }
}
