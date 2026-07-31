import type { WorldEventType } from "@/core/events/world-events";
import type { ApplicationManifest } from "@/types/application";

export type Permission =
  | "storage"
  | "audio"
  | "notifications"
  | "camera"
  | "clipboard"
  | "network"
  | "system";

export type StartupBehaviour = "manual" | "autostart" | "background";

/**
 * Everything the OS needs to host an application. Registering this is the only
 * integration step a new app performs.
 */
export interface AppManifest extends ApplicationManifest {
  version: string;
  /** Capabilities the app is allowed to use. */
  permissions: readonly Permission[];
  /** Events the app publishes, declared for documentation and tooling. */
  publishes?: readonly WorldEventType[];
  /** Events the app listens to. */
  subscribes?: readonly WorldEventType[];
  startup?: StartupBehaviour;
  category?: "system" | "portfolio" | "game" | "tool" | "media";
}

const registry = new Map<string, AppManifest>();

export function registerApp(manifest: AppManifest): void {
  registry.set(manifest.id, manifest);
}

export function getApp(id: string): AppManifest | null {
  return registry.get(id) ?? null;
}

export function listApps(): readonly AppManifest[] {
  return [...registry.values()];
}

export function appsWithStartup(
  behaviour: StartupBehaviour,
): readonly AppManifest[] {
  return listApps().filter((app) => (app.startup ?? "manual") === behaviour);
}

export function hasPermission(id: string, permission: Permission): boolean {
  return getApp(id)?.permissions.includes(permission) ?? false;
}

/** Lifts a plain manifest into a full one with conservative defaults. */
export function toAppManifest(
  base: ApplicationManifest,
  extras: Partial<Omit<AppManifest, keyof ApplicationManifest>> = {},
): AppManifest {
  return {
    ...base,
    version: extras.version ?? "1.0.0",
    permissions: extras.permissions ?? ["storage"],
    publishes: extras.publishes,
    subscribes: extras.subscribes,
    startup: extras.startup ?? "manual",
    category: extras.category ?? "portfolio",
  };
}
