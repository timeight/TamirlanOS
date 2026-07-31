"use client";

import { useEffect, useRef } from "react";
import { publish } from "@/core/events/event-bus";
import { WorldEventType } from "@/core/events/world-events";
import { useWindowStore } from "@/stores/window-store";
import type { AppId } from "@/types/application";

const IDLE_THRESHOLD_S = 120;
const IDLE_CHECK_MS = 5000;
const RETURN_AFTER_MS = 60000;

/**
 * Translates raw system state into world events. This is the only place that
 * knows about both the window store and the bus.
 */
export function useWorldPublishers(): void {
  const known = useRef(new Map<string, AppId>());
  const focused = useRef<AppId | null>(null);

  useEffect(() => {
    const sync = () => {
      const store = useWindowStore.getState();
      const current = new Map<string, AppId>();
      for (const [id, win] of Object.entries(store.windows)) {
        current.set(id, win.appId);
      }

      for (const [id, appId] of current) {
        if (!known.current.has(id)) {
          publish({ type: WorldEventType.WindowOpened, appId });
        }
      }
      for (const [id, appId] of known.current) {
        if (!current.has(id)) {
          publish({ type: WorldEventType.WindowClosed, appId });
        }
      }
      known.current = current;

      const topId = store.zOrder[store.zOrder.length - 1] ?? null;
      const topApp = topId ? (store.windows[topId]?.appId ?? null) : null;
      if (topApp && topApp !== focused.current) {
        focused.current = topApp;
        publish({ type: WorldEventType.WindowFocused, appId: topApp });
      }
      if (!topApp) focused.current = null;
    };

    sync();
    return useWindowStore.subscribe(sync);
  }, []);

  useEffect(() => {
    let lastInputAt = Date.now();
    let idleAnnounced = false;

    const onInput = () => {
      const away = Date.now() - lastInputAt;
      lastInputAt = Date.now();
      if (idleAnnounced) {
        idleAnnounced = false;
        publish({ type: WorldEventType.UserReturned, awayMs: away });
      }
    };

    const timer = window.setInterval(() => {
      const seconds = (Date.now() - lastInputAt) / 1000;
      if (!idleAnnounced && seconds >= IDLE_THRESHOLD_S) {
        idleAnnounced = true;
        publish({ type: WorldEventType.UserIdle, seconds });
      }
    }, IDLE_CHECK_MS);

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      const away = Date.now() - lastInputAt;
      if (away > RETURN_AFTER_MS) {
        publish({ type: WorldEventType.UserReturned, awayMs: away });
      }
      lastInputAt = Date.now();
    };

    window.addEventListener("pointermove", onInput);
    window.addEventListener("pointerdown", onInput);
    window.addEventListener("keydown", onInput);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pointermove", onInput);
      window.removeEventListener("pointerdown", onInput);
      window.removeEventListener("keydown", onInput);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
