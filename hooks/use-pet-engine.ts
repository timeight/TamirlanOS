"use client";

import { useEffect, useRef, useState } from "react";
import {
  idleStateFor,
  nextAmbientDelay,
  pickBehaviour,
} from "@/core/pet/pet-brain";
import {
  clampToDesktop,
  distanceTo,
  pickTarget,
  stepToward,
} from "@/core/pet/pet-physics";
import { reactionFor } from "@/core/pet/pet-reactions";
import {
  PET_SIZE,
  PetState,
  TASKBAR_HEIGHT,
  type PetFrame,
  type PetMood,
  type PetVector,
  type Rect,
} from "@/core/pet/pet-types";
import { usePetStore } from "@/stores/pet-store";
import { useWindowStore } from "@/stores/window-store";
import type { AppId } from "@/types/application";
import { WindowState } from "@/types/window";

const FIRST_BOOT_DELAY_MS = 5000;
const CURSOR_NEAR = 130;
const CURSOR_FOLLOW_AFTER_S = 1.6;
const ICON_COLUMN_WIDTH = 190;

interface EngineOptions {
  reducedMotion: boolean;
  onSpeak: (state: PetState) => void;
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
  }));

  const cursor = useRef<PetVector>({ x: 0, y: 0 });
  const lastInputAt = useRef(Date.now());
  const nearSince = useRef<number | null>(null);
  const target = useRef<PetVector | null>(null);
  const stateStart = useRef(performance.now());
  const duration = useRef(2);
  const nextDecisionAt = useRef(Date.now() + FIRST_BOOT_DELAY_MS);
  const lastAppId = useRef<AppId | null>(null);
  const dizzyUntil = useRef(0);

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
    let saveAccumulator = 0;

    const enter = (state: PetState, seconds: number) => {
      stateStart.current = performance.now();
      duration.current = seconds;
      setFrame((current) => ({ ...current, state, elapsed: 0, progress: 0 }));
    };

    const obstacles = (): Rect[] => {
      const store = useWindowStore.getState();
      const rects: Rect[] = Object.values(store.windows)
        .filter((win) => win.state !== WindowState.Minimized)
        .map((win) => ({
          x: win.bounds.x,
          y: win.bounds.y,
          width: win.bounds.width,
          height: win.bounds.height,
        }));
      // The icon column belongs to the desktop, not to PIX.
      rects.push({
        x: 0,
        y: 0,
        width: ICON_COLUMN_WIDTH,
        height: window.innerHeight,
      });
      return rects;
    };

    const bounds = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      saveAccumulator += dt;

      setFrame((current) => {
        const elapsed = (now - stateStart.current) / 1000;
        const progress = Math.min(1, elapsed / duration.current);
        const next: PetFrame = { ...current, elapsed, progress };
        const idleSeconds = (Date.now() - lastInputAt.current) / 1000;

        // First boot: PIX peeks from behind the Start button, then walks out.
        if (!metPix && next.state === PetState.Hide) {
          if (Date.now() > nextDecisionAt.current) {
            next.position = {
              x: 16,
              y: window.innerHeight - TASKBAR_HEIGHT - PET_SIZE.height,
            };
            enter(PetState.Peek, 2.2);
            nextDecisionAt.current = Date.now() + 2200;
          }
          return next;
        }
        if (next.state === PetState.Peek && progress >= 1) {
          target.current = pickTarget(next.position, bounds(), obstacles());
          enter(PetState.Walk, 4);
          markMet();
          return next;
        }

        // Dizzy recovery always wins.
        if (dizzyUntil.current > Date.now()) {
          next.mood = "dizzy";
          return next;
        }

        // Sleep and wake.
        const sleepy = idleStateFor(idleSeconds);
        if (sleepy === PetState.Sleep && next.state !== PetState.Sleep) {
          enter(PetState.Sleep, 999);
          next.mood = "sleepy";
          return next;
        }
        if (next.state === PetState.Sleep && idleSeconds < 1) {
          enter(PetState.Wake, 1.8);
          next.mood = "happy";
          return next;
        }
        if (next.state === PetState.Sleep) {
          next.mood = "sleepy";
          return next;
        }

        // A newly focused window earns a reaction.
        const windows = useWindowStore.getState();
        const topId = windows.zOrder[windows.zOrder.length - 1] ?? null;
        const appId = topId ? (windows.windows[topId]?.appId ?? null) : null;
        if (appId && appId !== lastAppId.current) {
          lastAppId.current = appId;
          const reaction = reactionFor(appId);
          if (reaction) {
            const win = topId ? windows.windows[topId] : null;
            if (reaction.approach && win) {
              target.current = clampToDesktop(
                {
                  x: win.bounds.x + win.bounds.width + 14,
                  y: win.bounds.y + win.bounds.height - 90,
                },
                bounds(),
              );
              enter(PetState.Walk, 4);
            } else {
              enter(reaction.state, reaction.duration);
            }
            next.mood = "curious";
            onSpeak(reaction.state);
            return next;
          }
        }

        // Cursor proximity.
        const near = distanceTo(next.position, cursor.current) < CURSOR_NEAR;
        if (near) {
          nearSince.current ??= now;
          const nearFor = (now - nearSince.current) / 1000;
          next.facing = cursor.current.x > next.position.x ? 1 : -1;
          if (
            nearFor > CURSOR_FOLLOW_AFTER_S &&
            next.state !== PetState.FollowCursor
          ) {
            enter(PetState.FollowCursor, 3.5);
            next.mood = "curious";
          }
        } else {
          nearSince.current = null;
        }

        // Movement states.
        if (
          next.state === PetState.Walk ||
          next.state === PetState.Run ||
          next.state === PetState.FollowCursor
        ) {
          const goal =
            next.state === PetState.FollowCursor
              ? clampToDesktop(
                  {
                    x: cursor.current.x - PET_SIZE.width / 2,
                    y: cursor.current.y + 24,
                  },
                  bounds(),
                )
              : (target.current ?? next.position);
          const step = stepToward(
            next.position,
            goal,
            reducedMotion ? dt * 4 : dt,
            next.state === PetState.Run,
          );
          next.position = step.position;
          next.facing = step.facing;
          if (step.arrived && next.state !== PetState.FollowCursor) {
            enter(PetState.LookAround, 2.2);
          }
        }

        // Ambient decision timer.
        if (
          Date.now() > nextDecisionAt.current &&
          next.state !== PetState.FollowCursor
        ) {
          const option = pickBehaviour(next.state);
          if (option.state === PetState.Walk) {
            target.current = pickTarget(next.position, bounds(), obstacles());
          }
          enter(option.state, option.duration);
          nextDecisionAt.current = Date.now() + nextAmbientDelay();
          if (Math.random() < 0.22) onSpeak(option.state);
        }

        next.mood = moodFor(next.state, next.mood);
        return next;
      });

      if (saveAccumulator > 2) {
        saveAccumulator = 0;
        setFrame((current) => {
          savePosition(current.position);
          return current;
        });
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [markMet, metPix, onSpeak, reducedMotion, savePosition]);

  const trigger = (state: PetState, seconds: number) => {
    stateStart.current = performance.now();
    duration.current = seconds;
    setFrame((current) => ({ ...current, state, elapsed: 0, progress: 0 }));
    lastInputAt.current = Date.now();
  };

  const makeDizzy = () => {
    dizzyUntil.current = Date.now() + 2600;
    trigger(PetState.Dizzy, 2.6);
  };

  return {
    frame,
    trigger,
    makeDizzy,
    setPosition: (position: PetVector) =>
      setFrame((current) => ({ ...current, position })),
  };
}

function moodFor(state: PetState, fallback: PetMood): PetMood {
  switch (state) {
    case PetState.Sleep:
      return "sleepy";
    case PetState.Think:
    case PetState.Repair:
    case PetState.Inspect:
      return "focused";
    case PetState.LookAround:
    case PetState.ObserveWindow:
    case PetState.Peek:
      return "curious";
    case PetState.Dizzy:
      return "dizzy";
    case PetState.Wave:
    case PetState.Dance:
    case PetState.Celebrate:
    case PetState.Jump:
      return "happy";
    default:
      return fallback;
  }
}
