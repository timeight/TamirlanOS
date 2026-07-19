import type { WindowId } from "@/types/window";

export function raiseWindow(
  order: readonly WindowId[],
  id: WindowId,
): WindowId[] {
  return [...order.filter((other) => other !== id), id];
}

export function removeWindow(
  order: readonly WindowId[],
  id: WindowId,
): WindowId[] {
  return order.filter((other) => other !== id);
}

export function zIndexOf(order: readonly WindowId[], id: WindowId): number {
  return order.indexOf(id);
}

export function topWindow(order: readonly WindowId[]): WindowId | null {
  return order.at(-1) ?? null;
}
