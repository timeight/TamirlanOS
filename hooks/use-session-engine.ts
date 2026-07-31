"use client";

import { useCallback, useEffect } from "react";
import { getApplication } from "@/core/process/app-registry";
import {
  RestoreStage,
  STAGE_MS,
  WINDOW_STAGGER_MS,
} from "@/core/session/restore-plan";
import {
  loadChoice,
  loadSession,
  saveSession,
  writeSession,
} from "@/core/session/session-storage";
import {
  emptySnapshot,
  type SessionSnapshot,
} from "@/core/session/session-types";
import { useDesktopStore } from "@/stores/desktop-store";
import { useSessionStore } from "@/stores/session-store";
import { useWindowStore } from "@/stores/window-store";
import { WindowState } from "@/types/window";

const AUTOSAVE_MS = 5 * 60_000;

/** Reads live state into a plain object. Cheap enough to run on every change. */
function capture(previous: SessionSnapshot | null): SessionSnapshot {
  const windows = useWindowStore.getState();
  const desktop = useDesktopStore.getState();
  const open = windows.zOrder.flatMap((id) => {
    const entry = windows.windows[id];
    return entry && !windows.closing.includes(id) ? [entry] : [];
  });

  return {
    ...emptySnapshot(),
    visits: (previous?.visits ?? 0) + (previous ? 0 : 1),
    savedAt: Date.now(),
    windows: open.map((entry) => ({
      appId: entry.appId,
      bounds: entry.bounds,
      state: entry.state,
    })),
    zOrder: open.map((entry) => entry.appId),
    focusedApp: windows.focusedId
      ? (windows.windows[windows.focusedId]?.appId ?? null)
      : null,
    crtEnabled: desktop.crtEnabled,
    theme: document.documentElement.dataset.theme ?? null,
  };
}

function restoreWindows(snapshot: SessionSnapshot): number {
  const store = useWindowStore.getState();
  let delay = 0;
  for (const entry of snapshot.windows) {
    const manifest = getApplication(entry.appId);
    if (!manifest) continue;
    window.setTimeout(() => {
      const id = store.openWindow(manifest, entry.bounds);
      if (entry.state === WindowState.Minimized) {
        useWindowStore.getState().minimizeWindow(id);
      }
    }, delay);
    delay += WINDOW_STAGGER_MS;
  }
  return delay;
}

/**
 * Owns the whole remember/restore lifecycle. Nothing else writes the session,
 * so there is exactly one place where a bug could lose someone's desktop.
 */
export function useSessionEngine(): () => void {
  const ask = useSessionStore((state) => state.ask);
  const beginRestore = useSessionStore((state) => state.beginRestore);
  const setStage = useSessionStore((state) => state.setStage);
  const finish = useSessionStore((state) => state.finish);

  const run = useCallback(
    (snapshot: SessionSnapshot) => {
      beginRestore();
      const desktopMs = STAGE_MS[RestoreStage.Desktop];
      const taskbarMs = desktopMs + STAGE_MS[RestoreStage.Taskbar];

      window.setTimeout(() => setStage(RestoreStage.Taskbar), desktopMs);
      window.setTimeout(() => {
        setStage(RestoreStage.Windows);
        const windowsMs = restoreWindows(snapshot);
        window.setTimeout(() => {
          setStage(RestoreStage.Companion);
          window.setTimeout(finish, STAGE_MS[RestoreStage.Companion]);
        }, windowsMs);
      }, taskbarMs);
    },
    [beginRestore, setStage, finish],
  );

  const restoreNow = useCallback(() => {
    const snapshot = useSessionStore.getState().snapshot;
    if (snapshot) run(snapshot);
  }, [run]);

  useEffect(() => {
    const snapshot = loadSession();
    if (!snapshot || snapshot.windows.length === 0) {
      writeSession(capture(snapshot));
      finish();
      return;
    }

    const awayMs = Date.now() - snapshot.savedAt;
    const choice = loadChoice();
    if (choice === "fresh") {
      finish();
      return;
    }
    if (choice === "restore") {
      run(snapshot);
      return;
    }
    ask(snapshot, awayMs);
  }, [ask, run, finish]);

  useEffect(() => {
    let latest = loadSession();

    const persist = (immediate: boolean) => {
      latest = capture(latest);
      if (immediate) writeSession(latest);
      else saveSession(latest);
    };

    const unsubscribe = useWindowStore.subscribe(() => persist(false));
    const timer = window.setInterval(() => persist(true), AUTOSAVE_MS);
    const onLeave = () => persist(true);

    window.addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", onLeave);
    return () => {
      unsubscribe();
      window.clearInterval(timer);
      window.removeEventListener("pagehide", onLeave);
      document.removeEventListener("visibilitychange", onLeave);
      persist(true);
    };
  }, []);

  return restoreNow;
}

export { capture as captureSession };
