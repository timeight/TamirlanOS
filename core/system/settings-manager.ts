import { createToken, type Manager } from "@/core/kernel/manager";
import { resolve } from "@/core/kernel/service-registry";
import { STORAGE_MANAGER } from "@/core/system/storage-manager";
import type { Locale } from "@/types/locale";

export interface SystemSettings {
  theme: string;
  wallpaperId: string;
  locale: Locale;
  animations: boolean;
  volume: number;
  muted: boolean;
  showDesktopIcons: boolean;
  weatherEnabled: boolean;
  petEnabled: boolean;
  crtEnabled: boolean;
  screensaverMinutes: number;
  startupApps: readonly string[];
  reducedMotion: boolean;
  highContrast: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: "luna",
  wallpaperId: "bliss",
  locale: "kk",
  animations: true,
  volume: 0.7,
  muted: false,
  showDesktopIcons: true,
  weatherEnabled: false,
  petEnabled: true,
  crtEnabled: true,
  screensaverMinutes: 0,
  startupApps: [],
  reducedMotion: false,
  highContrast: false,
};

type Listener = (settings: SystemSettings) => void;

export interface SettingsManager extends Manager {
  get(): SystemSettings;
  set<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]): void;
  patch(values: Partial<SystemSettings>): void;
  reset(): void;
  subscribe(listener: Listener): () => void;
}

export const SETTINGS_MANAGER = createToken<SettingsManager>("SettingsManager");

const STORAGE_KEY = "settings";

/** Single source of truth for every preference in the OS. */
export function createSettingsManager(): SettingsManager {
  let settings: SystemSettings = DEFAULT_SETTINGS;
  const listeners = new Set<Listener>();

  const commit = (next: SystemSettings) => {
    settings = next;
    resolve(STORAGE_MANAGER).write(STORAGE_KEY, settings);
    for (const listener of [...listeners]) listener(settings);
  };

  return {
    id: "settings",
    dependsOn: ["storage"],

    start() {
      const stored = resolve(STORAGE_MANAGER).read<Partial<SystemSettings>>(
        STORAGE_KEY,
        {},
      );
      settings = { ...DEFAULT_SETTINGS, ...stored };
    },

    get: () => settings,
    set: (key, value) => commit({ ...settings, [key]: value }),
    patch: (values) => commit({ ...settings, ...values }),
    reset: () => commit(DEFAULT_SETTINGS),

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
