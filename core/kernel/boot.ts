import { installApps } from "@/core/apps/app-catalog";
import { toAppManifest, registerApp } from "@/core/apps/app-manifest";
import type { Manager } from "@/core/kernel/manager";
import { provideValue } from "@/core/kernel/service-registry";
import { bootSystem, registerManager } from "@/core/kernel/system-manager";
import { listApplications } from "@/core/process/app-registry";
import {
  CLOCK_MANAGER,
  CURSOR_MANAGER,
  createClockManager,
  createCursorManager,
  createPowerManager,
  createScreenSaverManager,
  createUpdateManager,
  createWeatherManager,
  POWER_MANAGER,
  SCREENSAVER_MANAGER,
  UPDATE_MANAGER,
  WEATHER_MANAGER,
} from "@/core/system/runtime-managers";
import {
  createSettingsManager,
  SETTINGS_MANAGER,
} from "@/core/system/settings-manager";
import {
  createStorageManager,
  STORAGE_MANAGER,
} from "@/core/system/storage-manager";
import { createThemeManager, THEME_MANAGER } from "@/core/system/theme-manager";

let booted = false;

/** Registers a manager both in the kernel and in the service registry. */
function install<T extends Manager>(
  token: Parameters<typeof provideValue<T>>[0],
  manager: T,
): void {
  provideValue(token, manager);
  registerManager(manager);
}

/**
 * The single entry point of TamirlanOS. Nothing else may start a manager, and
 * no application imports another application.
 */
export function bootKernel(): void {
  if (booted) return;
  booted = true;

  install(STORAGE_MANAGER, createStorageManager());
  install(SETTINGS_MANAGER, createSettingsManager());
  install(THEME_MANAGER, createThemeManager());
  install(CLOCK_MANAGER, createClockManager());
  install(POWER_MANAGER, createPowerManager());
  install(SCREENSAVER_MANAGER, createScreenSaverManager());
  install(CURSOR_MANAGER, createCursorManager());
  install(WEATHER_MANAGER, createWeatherManager());
  install(UPDATE_MANAGER, createUpdateManager());

  bootSystem();

  // Applications describe themselves; the OS does the rest.
  installApps();
  for (const app of listApplications()) {
    registerApp(toAppManifest(app));
  }
}

export function kernelReady(): boolean {
  return booted;
}
