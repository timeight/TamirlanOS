"use client";

import { useCallback } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { AppKey } from "@/core/apps/app-catalog";
import { useContextMenuStore } from "@/stores/context-menu-store";
import { useDesktopStore } from "@/stores/desktop-store";
import { useIsCompact } from "@/hooks/use-compact";
import { useOpenApp } from "@/hooks/use-open-app";
import type { DesktopIcon } from "@/types/desktop-icon";
import type { MenuEntry } from "@/types/context-menu";

/**
 * Пункты, за которыми нет модели данных, остаются неактивными. Рабочий стол
 * TamirlanOS — список ярлыков приложений, а не папка: создавать, вставлять
 * и переименовывать там нечего, и притворяться об этом не стоит.
 */
export interface DesktopMenu {
  onDesktop: (event: ReactMouseEvent) => void;
  onIcon: (event: ReactMouseEvent, icon: DesktopIcon) => void;
}

export function useDesktopMenu(onRefresh: () => void): DesktopMenu {
  const show = useContextMenuStore((state) => state.show);
  const selectIcon = useDesktopStore((state) => state.selectIcon);
  const openApp = useOpenApp();
  const compact = useIsCompact();

  const onDesktop = useCallback(
    (event: ReactMouseEvent) => {
      if (compact) return;

      // Обработчик висит на корне рабочего стола, поэтому сюда всплывает и
      // правый щелчок внутри окна приложения. Там своё меню браузера нужно
      // оставить: внутри Internet Explorer и VK оно рабочее.
      const target = event.target as HTMLElement | null;
      if (target?.closest('[role="dialog"], [role="toolbar"], [role="menu"]')) {
        return;
      }

      event.preventDefault();
      const items: MenuEntry[] = [
        { kind: "action", label: "Обновить", onSelect: onRefresh },
        { kind: "separator" },
        { kind: "action", label: "Вставить", disabled: true },
        { kind: "action", label: "Вставить ярлык", disabled: true },
        {
          kind: "submenu",
          label: "Создать",
          items: [
            { kind: "action", label: "Папку", disabled: true },
            { kind: "action", label: "Текстовый документ", disabled: true },
            { kind: "action", label: "Ярлык", disabled: true },
          ],
        },
        { kind: "separator" },
        {
          kind: "action",
          label: "Параметры экрана",
          onSelect: () => openApp(AppKey.ControlPanel),
        },
        {
          kind: "action",
          label: "Персонализация",
          onSelect: () => openApp(AppKey.ControlPanel),
        },
        { kind: "separator" },
        {
          kind: "action",
          label: "О системе",
          onSelect: () => openApp(AppKey.AboutMe),
        },
      ];
      show({ x: event.clientX, y: event.clientY, items });
    },
    [compact, onRefresh, openApp, show],
  );

  const onIcon = useCallback(
    (event: ReactMouseEvent, icon: DesktopIcon) => {
      if (compact) return;
      event.preventDefault();
      event.stopPropagation();
      selectIcon(icon.id);
      const items: MenuEntry[] = [
        {
          kind: "action",
          label: "Открыть",
          onSelect: () => openApp(icon.appId),
        },
        { kind: "separator" },
        { kind: "action", label: "Вырезать", disabled: true },
        { kind: "action", label: "Копировать", disabled: true },
        { kind: "separator" },
        { kind: "action", label: "Переименовать", disabled: true },
        { kind: "action", label: "Удалить ярлык", disabled: true },
        { kind: "separator" },
        { kind: "action", label: "Свойства", disabled: true },
      ];
      show({ x: event.clientX, y: event.clientY, items });
    },
    [compact, openApp, selectIcon, show],
  );

  return { onDesktop, onIcon };
}
