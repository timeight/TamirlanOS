"use client";

import { useEffect } from "react";
import { AchievementId } from "@/core/achievements/catalog";
import { subscribeMany } from "@/core/events/event-bus";
import { WorldEventType } from "@/core/events/world-events";
import { DiscoverySource, matchesPhrase } from "@/core/lost-files/discovery";
import { useLostFilesStore } from "@/stores/lost-files-store";

/** Events that count as poking around rather than just using the OS. */
const CURIOUS_EVENTS = [
  WorldEventType.SecretFound,
  WorldEventType.PuzzleSolved,
  WorldEventType.AchievementUnlocked,
  WorldEventType.SystemError,
  WorldEventType.TimeMachine,
] as const;

/** Achievements that hand the archive over directly. */
const KEY_ACHIEVEMENTS: readonly string[] = [
  AchievementId.Digger,
  AchievementId.SecretFinder,
];

/**
 * Watches every route into the archive at once. Nothing here knows about the
 * Explorer or PIX: discovery only flips a flag, the reveal reacts to it.
 */
export function useLostFilesDiscovery(): void {
  useEffect(() => {
    const store = useLostFilesStore.getState;
    let buffer = "";

    const onKey = (event: KeyboardEvent) => {
      if (store().discovered || event.key.length !== 1) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      buffer = (buffer + event.key).slice(-16);
      if (matchesPhrase(buffer)) store().discover(DiscoverySource.Command);
    };

    const unsubscribe = subscribeMany(CURIOUS_EVENTS, (event) => {
      if (store().discovered) return;
      if (
        event.type === WorldEventType.AchievementUnlocked &&
        KEY_ACHIEVEMENTS.includes(event.id)
      ) {
        store().discover(DiscoverySource.Achievement);
        return;
      }
      if (event.type === WorldEventType.SecretFound) {
        store().discover(DiscoverySource.HiddenFile);
        return;
      }
      if (store().nudgeDrift()) store().discover(DiscoverySource.Drift);
    });

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unsubscribe();
    };
  }, []);
}
