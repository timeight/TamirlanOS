"use client";

import { useEffect } from "react";
import type { AchievementId } from "@/core/achievements/catalog";
import { useAchievementStore } from "@/stores/achievement-store";

/** Unlocks once the condition first becomes true; unlocking is idempotent. */
export function useAchievement(id: AchievementId, earned: boolean): void {
  useEffect(() => {
    if (earned) useAchievementStore.getState().unlock(id);
  }, [earned, id]);
}
