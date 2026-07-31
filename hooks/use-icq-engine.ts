"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENT_TOTAL } from "@/core/achievements/catalog";
import { lastEventOf } from "@/core/events/event-bus";
import { WorldEventType } from "@/core/events/world-events";
import { awayMessages } from "@/core/icq/away-messages";
import { PixStatus, type ChatContext } from "@/core/icq/chat-types";
import {
  pickLine,
  selectMessage,
  typingMsFor,
} from "@/core/icq/message-selector";
import { useAchievementStore } from "@/stores/achievement-store";
import { useIcqStore } from "@/stores/icq-store";
import { useLostFilesStore } from "@/stores/lost-files-store";
import { usePetStore } from "@/stores/pet-store";
import { useWindowStore } from "@/stores/window-store";

const TICK_MS = 20_000;
const IDLE_AFTER_MS = 90_000;

function buildContext(sessionStart: number, awayMs: number): ChatContext {
  const achievements = useAchievementStore.getState();
  const lost = useLostFilesStore.getState();
  const pet = usePetStore.getState();
  const windows = useWindowStore.getState();
  const focused = windows.focusedId
    ? (windows.windows[windows.focusedId]?.appId ?? null)
    : null;
  const idleEvent = lastEventOf(WorldEventType.UserIdle);
  const returned = lastEventOf(WorldEventType.UserReturned);
  const song = lastEventOf(WorldEventType.SongStarted);
  const stopped = lastEventOf(WorldEventType.SongStopped);

  return {
    hour: new Date().getHours(),
    minutesInSession: Math.floor((Date.now() - sessionStart) / 60_000),
    awayMs,
    idle:
      idleEvent !== null &&
      (returned === null || idleEvent.seconds * 1000 > IDLE_AFTER_MS),
    friendship: pet.friendship,
    achievements: achievements.unlocked.length,
    achievementTotal: ACHIEVEMENT_TOTAL,
    currentApp: focused,
    appsVisited: achievements.visitedApps.length,
    lostFilesFound: lost.discovered,
    lostFilesRead: lost.read.length,
    secretsFound: pet.secretsFound.length,
    weather: lastEventOf(WorldEventType.WeatherChanged)?.weather ?? null,
    musicPlaying: song !== null && stopped === null,
    firstEverVisit: useIcqStore.getState().messages.length === 0,
  };
}

/** What the contact list shows when PIX is not mid-sentence. */
function presenceFor(context: ChatContext): PixStatus {
  if (context.hour >= 2 && context.hour < 6) return PixStatus.Sleeping;
  if (context.musicPlaying) return PixStatus.Listening;
  if (context.idle) return PixStatus.Away;
  if (context.currentApp) return PixStatus.Exploring;
  return PixStatus.Online;
}

/**
 * The only thing that decides when PIX speaks. It runs on a slow tick and
 * usually decides to say nothing — silence is the feature, not a gap.
 */
export function useIcqEngine(): void {
  const sessionStart = useRef(Date.now());
  const awayMs = useRef(0);

  useEffect(() => {
    const store = useIcqStore.getState();
    awayMs.current = store.noteVisit();
    if (store.messages.length === 0) return;
    for (const message of awayMessages(awayMs.current)) {
      store.push(message, message.id);
    }
  }, []);

  useEffect(() => {
    let typing: number | undefined;

    const tick = () => {
      const store = useIcqStore.getState();
      if (store.status === PixStatus.Typing) return;
      const context = buildContext(sessionStart.current, awayMs.current);
      const silentMs = store.lastMessageAt
        ? Date.now() - store.lastMessageAt
        : Number.MAX_SAFE_INTEGER;

      store.setStatus(presenceFor(context));

      const entry = selectMessage({
        context,
        history: store.sent,
        silentMs,
      });
      if (!entry) return;

      const text = pickLine(entry);
      store.setStatus(PixStatus.Typing);
      typing = window.setTimeout(
        () => {
          useIcqStore.getState().push(
            {
              id: `${entry.id}-${Date.now().toString(36)}`,
              kind: entry.kind,
              text,
              at: Date.now(),
              fromPix: true,
              ...(entry.attachment ? { attachment: entry.attachment } : {}),
            },
            entry.id,
          );
        },
        text ? typingMsFor(text) : 900,
      );
    };

    const timer = window.setInterval(tick, TICK_MS);
    return () => {
      window.clearInterval(timer);
      if (typing !== undefined) window.clearTimeout(typing);
    };
  }, []);
}
