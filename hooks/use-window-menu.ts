"use client";

import { useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useContextMenuStore } from "@/stores/context-menu-store";
import { useIsCompact } from "@/hooks/use-compact";
import { useWindowStore } from "@/stores/window-store";
import { WindowState, type WindowId } from "@/types/window";
import type { MenuEntry } from "@/types/context-menu";

/**
 * Меню заголовка окна целиком опирается на существующий диспетчер окон:
 * здесь нет ни одного нового действия, только вызовы window-store.
 */
export function useWindowMenu(): (
  event: ReactMouseEvent,
  id: WindowId,
  state: WindowState,
  /** Разворот считает рабочую область сам, поэтому идёт тем же путём,
      что и двойной щелчок по заголовку. */
  toggleMaximize: () => void,
) => void {
  const show = useContextMenuStore((state) => state.show);
  const minimize = useWindowStore((store) => store.minimizeWindow);
  const restore = useWindowStore((store) => store.restoreWindow);
  const close = useWindowStore((store) => store.closeWindow);
  const compact = useIsCompact();

  return useCallback(
    (event, id, state, toggleMaximize) => {
      if (compact) return;
      event.preventDefault();
      event.stopPropagation();

      const maximized = state === WindowState.Maximized;
      const items: MenuEntry[] = [
        {
          kind: "action",
          label: "Восстановить",
          disabled: !maximized,
          onSelect: () => restore(id),
        },
        {
          kind: "action",
          label: "Свернуть",
          onSelect: () => minimize(id),
        },
        {
          kind: "action",
          label: "Развернуть",
          disabled: maximized,
          onSelect: toggleMaximize,
        },
        { kind: "separator" },
        { kind: "action", label: "Закрыть", onSelect: () => close(id) },
      ];
      show({ x: event.clientX, y: event.clientY, items });
    },
    [close, compact, minimize, restore, show],
  );
}
