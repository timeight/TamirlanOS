import type {
  WorldEvent,
  WorldEventOf,
  WorldEventType,
} from "@/core/events/world-events";

type Handler<T extends WorldEventType> = (event: WorldEventOf<T>) => void;
type AnyHandler = (event: WorldEvent) => void;
export type Unsubscribe = () => void;

const typed = new Map<WorldEventType, Set<AnyHandler>>();
const wildcard = new Set<AnyHandler>();
/** Last event of each type, so late subscribers can read current world state. */
const latest = new Map<WorldEventType, WorldEvent>();

/**
 * Single global bus. Systems publish facts about the world and never call each
 * other; anything that cares subscribes.
 */
export function publish(event: WorldEvent): void {
  latest.set(event.type, event);
  const handlers = typed.get(event.type);
  if (handlers) {
    for (const handler of [...handlers]) handler(event);
  }
  for (const handler of [...wildcard]) handler(event);
}

export function subscribe<T extends WorldEventType>(
  type: T,
  handler: Handler<T>,
): Unsubscribe {
  const set = typed.get(type) ?? new Set<AnyHandler>();
  typed.set(type, set);
  set.add(handler as AnyHandler);
  return () => set.delete(handler as AnyHandler);
}

export function subscribeMany(
  types: readonly WorldEventType[],
  handler: AnyHandler,
): Unsubscribe {
  const unsubscribers = types.map((type) =>
    subscribe(type, handler as Handler<typeof type>),
  );
  return () => unsubscribers.forEach((off) => off());
}

/** Receives every event; used by loggers and by PIX's perception queue. */
export function subscribeAll(handler: AnyHandler): Unsubscribe {
  wildcard.add(handler);
  return () => wildcard.delete(handler);
}

export function lastEventOf<T extends WorldEventType>(
  type: T,
): WorldEventOf<T> | null {
  return (latest.get(type) as WorldEventOf<T> | undefined) ?? null;
}

/** Test and teardown helper; never call from application code. */
export function resetEventBus(): void {
  typed.clear();
  wildcard.clear();
  latest.clear();
}
