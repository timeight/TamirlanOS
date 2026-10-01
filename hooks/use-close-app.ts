"use client";

import { useCallback } from "react";
import { useWindowStore } from "@/stores/window-store";
import type { AppId } from "@/types/application";

/** Closes every window belonging to an app, so a page can dismiss its host. */
export function useCloseApp() {
  const closeWindow = useWindowStore((state) => state.closeWindow);

  return useCallback(
    (appId: AppId) => {
      const { windows } = useWindowStore.getState();
      for (const window of Object.values(windows)) {
        if (window.appId === appId) closeWindow(window.id);
      }
    },
    [closeWindow],
  );
}
