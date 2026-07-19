"use client";

import { useCallback } from "react";
import { getApplication } from "@/core/process/app-registry";
import { useAudioStore } from "@/stores/audio-store";
import { useWindowStore } from "@/stores/window-store";
import type { AppId } from "@/types/application";
import { SoundEvent } from "@/types/sound";

const CASCADE_BASE_PX = 48;
const CASCADE_STEP_PX = 26;

export function useOpenApp() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const play = useAudioStore((state) => state.play);

  return useCallback(
    (appId: AppId) => {
      const manifest = getApplication(appId);
      if (!manifest) return;
      const state = useWindowStore.getState();
      const alreadyOpen =
        manifest.singleton &&
        Object.values(state.windows).some((window) => window.appId === appId);
      const offset =
        CASCADE_BASE_PX + (state.zOrder.length % 8) * CASCADE_STEP_PX;
      openWindow(manifest, {
        x: offset,
        y: offset,
        ...manifest.defaultSize,
      });
      // Per audio guidelines: window-open fires once per creation, not on refocus.
      if (!alreadyOpen) play(SoundEvent.WindowOpen);
    },
    [openWindow, play],
  );
}
