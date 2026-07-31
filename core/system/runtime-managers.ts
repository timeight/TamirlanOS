import { publish } from "@/core/events/event-bus";
import { WorldEventType, type Weather } from "@/core/events/world-events";
import { createToken, type Manager } from "@/core/kernel/manager";
import { resolve, tryResolve } from "@/core/kernel/service-registry";
import { SETTINGS_MANAGER } from "@/core/system/settings-manager";

/* ------------------------------------------------------------------ Clock */

export interface ClockManager extends Manager {
  now(): Date;
  subscribe(listener: (date: Date) => void): () => void;
}

export const CLOCK_MANAGER = createToken<ClockManager>("ClockManager");

/** One timer for the whole OS instead of one per component. */
export function createClockManager(): ClockManager {
  const listeners = new Set<(date: Date) => void>();
  let timer = 0;

  return {
    id: "clock",
    start() {
      timer = window.setInterval(() => {
        const date = new Date();
        for (const listener of [...listeners]) listener(date);
      }, 1000);
    },
    stop() {
      window.clearInterval(timer);
      listeners.clear();
    },
    now: () => new Date(),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/* ------------------------------------------------------------------ Power */

export type PowerState = "running" | "idle" | "sleeping" | "shutting-down";

export interface PowerManager extends Manager {
  state(): PowerState;
  sleep(): void;
  wake(): void;
  requestShutdown(): void;
  requestRestart(): void;
  subscribe(listener: (state: PowerState) => void): () => void;
}

export const POWER_MANAGER = createToken<PowerManager>("PowerManager");

const IDLE_AFTER_MS = 120000;

export function createPowerManager(): PowerManager {
  const listeners = new Set<(state: PowerState) => void>();
  let state: PowerState = "running";
  let lastInput = Date.now();
  let timer = 0;

  const set = (next: PowerState) => {
    if (state === next) return;
    state = next;
    for (const listener of [...listeners]) listener(state);
  };

  const onInput = () => {
    lastInput = Date.now();
    if (state === "idle" || state === "sleeping") set("running");
  };

  return {
    id: "power",
    start() {
      window.addEventListener("pointermove", onInput);
      window.addEventListener("keydown", onInput);
      timer = window.setInterval(() => {
        if (state === "shutting-down") return;
        const idleFor = Date.now() - lastInput;
        if (idleFor > IDLE_AFTER_MS && state === "running") set("idle");
      }, 4000);
    },
    stop() {
      window.clearInterval(timer);
      window.removeEventListener("pointermove", onInput);
      window.removeEventListener("keydown", onInput);
    },
    state: () => state,
    sleep: () => set("sleeping"),
    wake: () => set("running"),
    requestShutdown: () => set("shutting-down"),
    requestRestart: () => {
      set("shutting-down");
      publish({ type: WorldEventType.SystemUpdated, version: "restart" });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/* ------------------------------------------------------------- Screensaver */

export interface ScreenSaverManager extends Manager {
  active(): boolean;
  subscribe(listener: (active: boolean) => void): () => void;
}

export const SCREENSAVER_MANAGER =
  createToken<ScreenSaverManager>("ScreenSaverManager");

/** Disabled unless the visitor sets a delay in settings. */
export function createScreenSaverManager(): ScreenSaverManager {
  const listeners = new Set<(active: boolean) => void>();
  let active = false;
  let unsubscribe: (() => void) | null = null;

  const set = (next: boolean) => {
    if (active === next) return;
    active = next;
    for (const listener of [...listeners]) listener(active);
  };

  return {
    id: "screensaver",
    dependsOn: ["power", "settings"],
    start() {
      const power = resolve(POWER_MANAGER);
      unsubscribe = power.subscribe((state) => {
        const minutes = resolve(SETTINGS_MANAGER).get().screensaverMinutes;
        if (minutes <= 0) return set(false);
        set(state === "idle" || state === "sleeping");
      });
    },
    stop() {
      unsubscribe?.();
    },
    active: () => active,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/* ----------------------------------------------------------------- Cursor */

export type CursorKind = "default" | "busy" | "progress" | "grab" | "text";

export interface CursorManager extends Manager {
  set(kind: CursorKind): void;
  reset(): void;
}

export const CURSOR_MANAGER = createToken<CursorManager>("CursorManager");

const CURSOR_CSS: Record<CursorKind, string> = {
  default: "auto",
  busy: "wait",
  progress: "progress",
  grab: "grabbing",
  text: "text",
};

export function createCursorManager(): CursorManager {
  return {
    id: "cursor",
    start() {
      document.body.style.cursor = CURSOR_CSS.default;
    },
    set(kind) {
      document.body.style.cursor = CURSOR_CSS[kind];
    },
    reset() {
      document.body.style.cursor = CURSOR_CSS.default;
    },
  };
}

/* ---------------------------------------------------------------- Weather */

export interface WeatherManager extends Manager {
  current(): Weather | null;
  simulate(weather: Weather): void;
}

export const WEATHER_MANAGER = createToken<WeatherManager>("WeatherManager");

/**
 * No network calls: the OS derives a plausible condition from the season and
 * hour, and publishes it. A real provider can replace this without touching
 * subscribers.
 */
export function createWeatherManager(): WeatherManager {
  let current: Weather | null = null;

  return {
    id: "weather",
    dependsOn: ["settings"],
    start() {
      const settings = tryResolve(SETTINGS_MANAGER);
      if (!settings?.get().weatherEnabled) return;
      const month = new Date().getMonth();
      const hour = new Date().getHours();
      const winter = month <= 1 || month === 11;
      current = winter ? "snow" : hour > 19 || hour < 6 ? "fog" : "sun";
      publish({ type: WorldEventType.WeatherChanged, weather: current });
    },
    current: () => current,
    simulate(weather) {
      current = weather;
      publish({ type: WorldEventType.WeatherChanged, weather });
    },
  };
}

/* ----------------------------------------------------------------- Update */

export interface UpdateManager extends Manager {
  version(): string;
  checkForUpdates(): void;
}

export const UPDATE_MANAGER = createToken<UpdateManager>("UpdateManager");

export const OS_VERSION = "2.0.0";

export function createUpdateManager(): UpdateManager {
  return {
    id: "update",
    start() {
      publish({ type: WorldEventType.SystemUpdated, version: OS_VERSION });
    },
    version: () => OS_VERSION,
    checkForUpdates() {
      publish({ type: WorldEventType.SystemUpdated, version: OS_VERSION });
    },
  };
}
