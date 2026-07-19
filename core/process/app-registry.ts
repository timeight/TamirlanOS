import type { AppId, ApplicationManifest } from "@/types/application";

const registry = new Map<AppId, ApplicationManifest>();

export function registerApplication(manifest: ApplicationManifest): void {
  if (registry.has(manifest.id)) {
    throw new Error(`application already registered: ${manifest.id}`);
  }
  registry.set(manifest.id, manifest);
}

export function getApplication(id: AppId): ApplicationManifest | null {
  return registry.get(id) ?? null;
}

export function listApplications(): ApplicationManifest[] {
  return [...registry.values()];
}
