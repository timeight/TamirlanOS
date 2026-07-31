import type { Manager } from "@/core/kernel/manager";

type Phase = "stopped" | "starting" | "running";

const registered = new Map<string, Manager>();
let phase: Phase = "stopped";
const started: string[] = [];

export function registerManager(manager: Manager): void {
  if (registered.has(manager.id)) return;
  registered.set(manager.id, manager);
}

/** Depth-first start so a manager never boots before what it depends on. */
function startOne(manager: Manager, visiting: Set<string>): void {
  if (started.includes(manager.id)) return;
  if (visiting.has(manager.id)) {
    throw new Error(`Circular manager dependency at ${manager.id}`);
  }
  visiting.add(manager.id);
  for (const dependency of manager.dependsOn ?? []) {
    const target = registered.get(dependency);
    if (target) startOne(target, visiting);
  }
  visiting.delete(manager.id);
  manager.start();
  started.push(manager.id);
}

export function bootSystem(): void {
  if (phase !== "stopped") return;
  phase = "starting";
  const visiting = new Set<string>();
  for (const manager of registered.values()) startOne(manager, visiting);
  phase = "running";
}

/** Stops in reverse start order, mirroring a real shutdown sequence. */
export function shutdownSystem(): void {
  for (const id of [...started].reverse()) {
    registered.get(id)?.stop?.();
  }
  started.length = 0;
  phase = "stopped";
}

export function systemPhase(): Phase {
  return phase;
}

export function runningManagers(): readonly string[] {
  return [...started];
}
