import { create } from "zustand";
import type { MenuRequest } from "@/types/context-menu";

interface ContextMenuStore {
  open: MenuRequest | null;
  show: (request: MenuRequest) => void;
  hide: () => void;
}

/**
 * Одно меню на всю систему. Новый вызов правой кнопкой заменяет открытое,
 * поэтому два меню одновременно появиться не могут даже при быстрых щелчках.
 */
export const useContextMenuStore = create<ContextMenuStore>((set) => ({
  open: null,
  show: (request) => set({ open: request }),
  hide: () => set({ open: null }),
}));
