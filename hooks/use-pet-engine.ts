"use client";

import { useEffect, useRef, useState } from "react";
import { inflate, nearestFreePoint, isBlocked } from "@/core/pet/collision";
import { buildDesktopMap, selectDestination } from "@/core/pet/desktop-map";
import { advance, createMotion } from "@/core/pet/movement-controller";
import { findPath } from "@/core/pet/pathfinding";
import {
  createEmotions,
  decay,
  dominant,
  stimulate,
} from "@/core/pet/emotion-engine";
import { placeBias } from "@/core/pet/habit-engine";
import { traitsFor } from "@/core/pet/personality";
import { emotionForEvent, dayPartOf } from "@/core/pet/reaction-engine";
import {
  rememberStory,
  selectStory,
  StoryPlayer,
} from "@/core/pet/story/story-player";
import { nextThinkDelay, think, type BrainContext } from "@/core/pet/pet-brain";
import { WorldEventType, type WorldEvent } from "@/core/events/world-events";
import { drainPetEvents } from "@/core/pet/pet-events";
import { deriveMood, type Mood } from "@/core/pet/pet-mood";
import { distanceTo } from "@/core/pet/pet-physics";
import { definitionOf, rollDuration } from "@/core/pet/pet-state-machine";
import {
  PET_SIZE,
  PetState,
  TASKBAR_HEIGHT,
  type PetFrame,
  type PetVector,
  type Rect,
} from "@/core/pet/pet-types";
import { usePetStore } from "@/stores/pet-store";
import { useWindowStore } from "@/stores/window-store";
import { WindowState } from "@/types/window";

const FIRST_BOOT_DELAY_MS = 5000;
const ICON_COLUMN_WIDTH = 190;
const POSITION_SAVE_INTERVAL_S = 2;
const MICRO_PAUSE_CHANCE = 0.18;
const MICRO_PAUSE_MS: readonly [number, number] = [500, 1200];

const EMOTION_TO_MOOD: Record<string, Mood> = {
  happy: "happy",
  curious: "curious",
  excited: "excited",
  calm: "happy",
  sleepy: "sleepy",
  scared: "scared",
  embarrassed: "scared",
  proud: "proud",
  confused: "curious",
  thinking: "idle",
};

interface EngineOptions {
  reducedMotion: boolean;
  onSpeak: (state: PetState, forcedLine?: string | null) => void;
}

export function usePetEngine({ reducedMotion, onSpeak }: EngineOptions) {
  const savePosition = usePetStore((store) => store.savePosition);
  const metPix = usePetStore((store) => store.metPix);
  const markMet = usePetStore((store) => store.markMet);

  const [frame, setFrame] = useState<PetFrame>(() => ({
    position: usePetStore.getState().position,
    facing: 1,
    state: metPix ? PetState.Idle : PetState.Hide,
    mood: "happy",
    progress: 0,
    elapsed: 0,
    lean: 0,
    speed: 0,
  }));

  const cursor = useRef<PetVector>({ x: 0, y: 0 });
  const lastInputAt = useRef(Date.now());
  const cursorNearSince = useRef<number | null>(null);
  const motion = useRef(createMotion());
  const path = useRef<PetVector[]>([]);
  const lastNodeId = useRef<string | null>(null);
  const pauseUntil = useRef(0);
  const running = useRef(false);
  const stateStartedAt = useRef(performance.now());
  const stateDuration = useRef(3);
  const cooldowns = useRef<Record<string, number>>({});
  const nextThinkAt = useRef(Date.now() + FIRST_BOOT_DELAY_MS);
  const lastFocusedApp = useRef<string | null>(null);
  const pendingEvents = useRef<WorldEvent[]>([]);
  const recentAchievementUntil = useRef(0);
  const forced = useRef<{ state: PetState; until: number } | null>(null);
  const emotions = useRef(createEmotions());
  const rareLine = useRef<string | null>(null);
  const storyPlayer = useRef(new StoryPlayer());
  const recentStories = useRef<string[]>([]);
  const storyPlayedAt = useRef<Record<string, number>>({});

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      cursor.current = { x: event.clientX, y: event.clientY };
      lastInputAt.current = Date.now();
    };
    const onKey = () => {
      lastInputAt.current = Date.now();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let saveTimer = 0;

    const bounds = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const liveWindows = () =>
      Object.values(useWindowStore.getState().windows)
        .filter((win) => win.state !== WindowState.Minimized)
        .map((win) => ({
          appId: win.appId,
          rect: {
            x: win.bounds.x,
            y: win.bounds.y,
            width: win.bounds.width,
            height: win.bounds.height,
          } as Rect,
        }));

    const inflatedObstacles = (): Rect[] => [
      ...liveWindows().map((entry) => inflate(entry.rect)),
      inflate({
        x: 0,
        y: 0,
        width: ICON_COLUMN_WIDTH,
        height: window.innerHeight,
      }),
    ];

    const routeTo = (from: PetVector, to: PetVector) => {
      path.current = findPath(from, to, inflatedObstacles(), bounds());
    };

    const chooseDestination = (from: PetVector) => {
      const inflated = inflatedObstacles();
      const nodes = buildDesktopMap({
        bounds: bounds(),
        inflated,
        windows: liveWindows(),
        iconColumnWidth: ICON_COLUMN_WIDTH,
      });
      // Habits nudge PIX back toward the places he already likes.
      const habits = usePetStore.getState().habits;
      const weighted = nodes.map((node) => ({
        ...node,
        interest: node.interest * placeBias(habits, node.id),
      }));
      const node = selectDestination(from, weighted, lastNodeId.current);
      if (!node) return false;
      lastNodeId.current = node.id;
      usePetStore.getState().notePlace(node.id);
      routeTo(from, node.position);
      return path.current.length > 0;
    };

    const enterState = (state: PetState, seconds?: number) => {
      stateStartedAt.current = performance.now();
      stateDuration.current = seconds ?? rollDuration(state);
      cooldowns.current[state] = Date.now() + definitionOf(state).cooldownMs;
      setFrame((current) => ({ ...current, state, elapsed: 0, progress: 0 }));
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      saveTimer += dt;

      const fresh = drainPetEvents();
      pendingEvents.current.push(...fresh);
      for (const event of fresh) {
        const feeling = emotionForEvent(event);
        if (feeling) {
          emotions.current = stimulate(
            emotions.current,
            feeling.kind,
            feeling.amount,
          );
        }
        if (event.type === WorldEventType.AchievementUnlocked) {
          recentAchievementUntil.current = Date.now() + 8000;
        }
      }
      emotions.current = decay(emotions.current, dt);

      setFrame((current) => {
        const elapsed = (now - stateStartedAt.current) / 1000;
        const next: PetFrame = {
          ...current,
          elapsed,
          progress: Math.min(1, elapsed / stateDuration.current),
        };
        const nowMs = Date.now();
        const idleSeconds = (nowMs - lastInputAt.current) / 1000;

        if (!metPix && next.state === PetState.Hide) {
          if (nowMs > nextThinkAt.current) {
            next.position = {
              x: 40,
              y: window.innerHeight - TASKBAR_HEIGHT - PET_SIZE.height / 2 - 8,
            };
            enterState(PetState.Peek);
            nextThinkAt.current = nowMs + 2400;
          }
          return next;
        }
        if (next.state === PetState.Peek && next.progress >= 1) {
          markMet();
          chooseDestination(next.position);
          enterState(PetState.Walk);
          return next;
        }

        // A window dropped on top of PIX: step aside immediately.
        const inflated = inflatedObstacles();
        if (isBlocked(next.position, inflated, bounds())) {
          const escape = nearestFreePoint(next.position, inflated, bounds());
          if (escape) {
            running.current = true;
            path.current = [escape];
            if (next.state !== PetState.Walk) enterState(PetState.Walk, 3);
          } else if (next.state !== PetState.Confused) {
            enterState(PetState.Confused);
          }
        }

        if (forced.current) {
          storyPlayer.current.stop();
          if (nowMs < forced.current.until) return applyMotion(next, dt);
          forced.current = null;
        }

        // World events and sleep cut a scene short; nothing else does.
        if (
          storyPlayer.current.active &&
          (pendingEvents.current.length > 0 || idleSeconds >= 120)
        ) {
          storyPlayer.current.stop();
        }

        const distance = distanceTo(next.position, cursor.current);
        if (distance < 130) {
          cursorNearSince.current ??= now;
        } else {
          cursorNearSince.current = null;
        }
        const dwell = cursorNearSince.current
          ? (now - cursorNearSince.current) / 1000
          : 0;

        const windows = useWindowStore.getState();
        const topId = windows.zOrder[windows.zOrder.length - 1] ?? null;
        const focusedAppId = topId
          ? (windows.windows[topId]?.appId ?? null)
          : null;
        const focusChanged = focusedAppId !== lastFocusedApp.current;
        if (focusChanged && focusedAppId) {
          usePetStore.getState().noteApp(focusedAppId);
        }

        // Strong emotions override the derived mood; otherwise context wins.
        const feeling = dominant(emotions.current);
        const mood: Mood =
          feeling.intensity > 55
            ? (EMOTION_TO_MOOD[feeling.emotion] ?? "happy")
            : deriveMood({
                idleSeconds,
                friendship: usePetStore.getState().friendship,
                cursorNear: distance < 130,
                windowJustOpened: focusChanged && focusedAppId !== null,
                recentAchievement: recentAchievementUntil.current > nowMs,
                dizzy: next.state === PetState.Dizzy,
              });
        next.mood = mood;

        // A running scene owns PIX until it ends or something urgent interrupts.
        if (storyPlayer.current.active) {
          const beat = storyPlayer.current.advance(dt);
          if (!beat) {
            enterState(PetState.Idle, 1.2);
            nextThinkAt.current = nowMs + nextThinkDelay();
          } else {
            if (beat.changed) {
              enterState(beat.state, 99);
              next.state = beat.state;
              if (beat.state === PetState.Walk && !path.current.length) {
                chooseDestination(next.position);
              }
            }
            return applyMotion(next, dt);
          }
        }

        if (nowMs >= nextThinkAt.current) {
          nextThinkAt.current = nowMs + nextThinkDelay();
          const context: BrainContext = {
            now: nowMs,
            state: next.state,
            stateElapsed: elapsed,
            stateDuration: stateDuration.current,
            mood,
            position: next.position,
            cursor: cursor.current,
            cursorDistance: distance,
            cursorDwellSeconds: dwell,
            idleSeconds,
            focusedAppId,
            focusChanged,
            openWindowCount: windows.zOrder.length,
            friendship: usePetStore.getState().friendship,
            events: pendingEvents.current,
            cooldowns: cooldowns.current,
            traits: traitsFor(usePetStore.getState().friendship),
            dayPart: dayPartOf(new Date()),
          };
          const decision = think(context);
          pendingEvents.current = [];
          lastFocusedApp.current = focusedAppId;

          // Ambient time is where the little scenes live.
          if (decision?.reason === "ambient" && Math.random() < 0.62) {
            const picked = selectStory({
              recent: recentStories.current,
              playedAt: storyPlayedAt.current,
              mood,
              dayPart: dayPartOf(new Date()),
              friendship: usePetStore.getState().friendship,
              now: nowMs,
            });
            if (picked) {
              recentStories.current = rememberStory(
                recentStories.current,
                picked.id,
              );
              storyPlayedAt.current[picked.id] = nowMs;
              storyPlayer.current.start(picked);
              const first = picked.beats[0];
              if (first) {
                enterState(first.state, 99);
                next.state = first.state;
                if (first.state === PetState.Walk) {
                  chooseDestination(next.position);
                }
              }
              return applyMotion(next, dt);
            }
          }

          if (decision) {
            if (decision.needsTarget) {
              running.current = decision.reason === "focus:approach";
              let routed = false;
              if (decision.reason === "focus:approach" && topId) {
                const win = windows.windows[topId];
                if (win) {
                  routeTo(next.position, {
                    x: win.bounds.x + win.bounds.width + 40,
                    y: win.bounds.y + win.bounds.height - 40,
                  });
                  lastNodeId.current = `window-${focusedAppId}`;
                  routed = path.current.length > 0;
                }
              } else {
                routed = chooseDestination(next.position);
              }
              if (!routed) return applyMotion(next, dt);
            }
            if (decision.rare) {
              enterState(decision.state, decision.rare.duration);
              if (decision.rare.emotion) {
                emotions.current = stimulate(
                  emotions.current,
                  decision.rare.emotion.kind,
                  decision.rare.emotion.amount,
                );
              }
              rareLine.current = decision.rare.lineKey ?? null;
            } else {
              enterState(decision.state);
            }
            next.state = decision.state;
            if (decision.reason !== "ambient" || Math.random() < 0.2) {
              onSpeak(decision.state, rareLine.current);
              rareLine.current = null;
            }
          }
        }

        return applyMotion(next, dt);
      });

      if (saveTimer > POSITION_SAVE_INTERVAL_S) {
        saveTimer = 0;
        setFrame((current) => {
          savePosition(current.position);
          return current;
        });
      }
      raf = requestAnimationFrame(loop);
    };

    /** Path following with momentum; the only per-frame physics in the system. */
    function applyMotion(next: PetFrame, dt: number): PetFrame {
      const moving =
        next.state === PetState.Walk || next.state === PetState.Run;
      const paused = Date.now() < pauseUntil.current;
      const waypoint = moving && !paused ? (path.current[0] ?? null) : null;

      const result = advance(
        next.position,
        motion.current,
        waypoint,
        reducedMotion ? dt * 3 : dt,
        running.current,
      );
      motion.current = result.motion;
      next.position = result.position;
      next.lean = reducedMotion ? 0 : result.motion.lean;
      next.speed = result.motion.speed;

      if (result.motion.speed > 4) {
        next.facing = result.facing;
      } else if (cursorNearSince.current) {
        next.facing = cursor.current.x > next.position.x ? 1 : -1;
      }

      if (waypoint && result.arrived) {
        path.current.shift();
        if (path.current.length) {
          // Natural hesitation between legs of a longer route.
          if (Math.random() < MICRO_PAUSE_CHANCE) {
            const [min, max] = MICRO_PAUSE_MS;
            pauseUntil.current = Date.now() + min + Math.random() * (max - min);
          }
        } else {
          running.current = false;
          stateDuration.current = 0;
        }
      }
      return next;
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [markMet, metPix, onSpeak, reducedMotion, savePosition]);

  const trigger = (state: PetState, seconds: number) => {
    forced.current = { state, until: Date.now() + seconds * 1000 };
    stateStartedAt.current = performance.now();
    stateDuration.current = seconds;
    lastInputAt.current = Date.now();
    path.current = [];
    setFrame((current) => ({ ...current, state, elapsed: 0, progress: 0 }));
  };

  const makeDizzy = () => trigger(PetState.Dizzy, 2.6);

  const setPosition = (position: PetVector) => {
    motion.current = createMotion();
    path.current = [];
    setFrame((current) => ({ ...current, position }));
  };

  return { frame, trigger, makeDizzy, setPosition };
}
