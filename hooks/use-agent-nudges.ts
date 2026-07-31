"use client";

import { useEffect, useRef } from "react";
import { pickNudge, type NudgeContext } from "@/core/agent/nudges";
import { useAchievementStore } from "@/stores/achievement-store";
import { useAgentStore } from "@/stores/agent-store";
import { useExplorerStore } from "@/stores/explorer-store";
import { useWindowStore } from "@/stores/window-store";

const TICK_MS = 5000;
const COOLDOWN_MS = 50000;

export function useAgentNudges(): void {
  const startedAt = useRef(Date.now());
  const focusedSince = useRef({ appId: null as string | null, at: Date.now() });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (!useAgentStore.getState().canShow(now, COOLDOWN_MS)) return;

      const windows = useWindowStore.getState();
      const focusedId = windows.zOrder[windows.zOrder.length - 1] ?? null;
      const focusedAppId = focusedId
        ? (windows.windows[focusedId]?.appId ?? null)
        : null;

      if (focusedAppId !== focusedSince.current.appId) {
        focusedSince.current = { appId: focusedAppId, at: now };
      }

      const achievements = useAchievementStore.getState();
      const context: NudgeContext = {
        secondsOnSite: Math.round((now - startedAt.current) / 1000),
        visitedApps: achievements.visitedApps,
        unlocked: achievements.unlocked,
        focusedAppId,
        secondsOnFocused: Math.round((now - focusedSince.current.at) / 1000),
        showHidden: useExplorerStore.getState().showHidden,
        achievementCount: achievements.unlocked.length,
      };

      const nudge = pickNudge(context, useAgentStore.getState().shownIds);
      if (nudge) useAgentStore.getState().show(nudge.id);
    };

    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, []);
}
