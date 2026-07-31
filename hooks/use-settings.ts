"use client";

import { useCallback, useEffect, useState } from "react";
import { tryResolve } from "@/core/kernel/service-registry";
import {
  DEFAULT_SETTINGS,
  SETTINGS_MANAGER,
  type SystemSettings,
} from "@/core/system/settings-manager";

export interface SettingsBinding {
  settings: SystemSettings;
  set: <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K],
  ) => void;
  reset: () => void;
}

/**
 * The only React binding to SettingsManager. Control Panel pages read and write
 * through this, so no screen keeps its own copy of a setting.
 */
export function useSettings(): SettingsBinding {
  const [settings, setSettings] = useState<SystemSettings>(
    () => tryResolve(SETTINGS_MANAGER)?.get() ?? DEFAULT_SETTINGS,
  );

  useEffect(() => {
    const manager = tryResolve(SETTINGS_MANAGER);
    if (!manager) return;
    setSettings(manager.get());
    return manager.subscribe(setSettings);
  }, []);

  const set = useCallback<SettingsBinding["set"]>((key, value) => {
    tryResolve(SETTINGS_MANAGER)?.set(key, value);
  }, []);

  const reset = useCallback(() => tryResolve(SETTINGS_MANAGER)?.reset(), []);

  return { settings, set, reset };
}
