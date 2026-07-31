import { publish, subscribeAll } from "@/core/events/event-bus";
import { WorldEventType, type WorldEvent } from "@/core/events/world-events";

export type { WorldEvent as PetEvent };

const queue: WorldEvent[] = [];
const QUEUE_LIMIT = 16;

let attached = false;

/** PIX perceives the world through the same bus every other system uses. */
function attach(): void {
  if (attached) return;
  attached = true;
  subscribeAll((event) => {
    queue.push(event);
    if (queue.length > QUEUE_LIMIT) queue.shift();
  });
}

export function emitPetEvent(event: WorldEvent): void {
  publish(event);
}

export function drainPetEvents(): WorldEvent[] {
  attach();
  return queue.splice(0, queue.length);
}

export { WorldEventType };
