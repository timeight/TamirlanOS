"use client";

import { useEffect } from "react";
import { AchievementId } from "@/core/achievements/catalog";
import { AppKey, APP_CATALOG } from "@/core/apps/app-catalog";
import { useAchievementStore } from "@/stores/achievement-store";
import { useWindowStore } from "@/stores/window-store";

const APP_AWARDS: Partial<Record<string, AchievementId>> = {
  [AppKey.AboutMe]: AchievementId.Reader,
  [AppKey.Projects]: AchievementId.Developer,
  [AppKey.Resume]: AchievementId.Recruiter,
  [AppKey.Photography]: AchievementId.Photographer,
  [AppKey.Contact]: AchievementId.Networker,
};

const GAME_APPS: readonly string[] = [
  AppKey.Minesweeper,
  AppKey.Checkers,
  AppKey.Game2048,
  AppKey.TicTacToe,
  AppKey.Shooter,
];

const EXPLORER_THRESHOLD = 5;
const POWER_USER_THRESHOLD = 12;
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function AchievementTracker() {
  useEffect(() => {
    const { unlock } = useAchievementStore.getState();
    unlock(AchievementId.FirstBoot);
  }, []);

  useEffect(() => {
    const evaluate = () => {
      const store = useAchievementStore.getState();
      const openIds = Object.values(useWindowStore.getState().windows).map(
        (window) => window.appId,
      );
      for (const appId of openIds) store.markAppVisited(appId);

      const visited = useAchievementStore.getState().visitedApps;
      for (const appId of visited) {
        const award = APP_AWARDS[appId];
        if (award) store.unlock(award);
        if (GAME_APPS.includes(appId)) store.unlock(AchievementId.Gamer);
      }
      if (visited.length >= EXPLORER_THRESHOLD)
        store.unlock(AchievementId.Explorer);
      if (visited.length >= POWER_USER_THRESHOLD)
        store.unlock(AchievementId.PowerUser);
      if (visited.length >= APP_CATALOG.length)
        store.unlock(AchievementId.WindowsVeteran);
    };

    evaluate();
    return useWindowStore.subscribe(evaluate);
  }, []);

  useEffect(() => {
    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      const expected = KONAMI[progress];
      progress =
        event.key.toLowerCase() === expected?.toLowerCase() ? progress + 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        useAchievementStore.getState().unlock(AchievementId.SecretFinder);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
