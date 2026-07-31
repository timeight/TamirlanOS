"use client";

import { useEffect, useState } from "react";
import { currentHour, lightAt, phaseAt } from "@/core/ambience/day-cycle";
import {
  MicroEvent,
  durationOf,
  rollMicroEvent,
} from "@/core/ambience/micro-events";
import { lastEventOf } from "@/core/events/event-bus";
import { WorldEventType } from "@/core/events/world-events";

const LIGHT_TICK_MS = 60_000;
const EVENT_TICK_MS = 60_000;

export interface Ambience {
  tint: string;
  strength: number;
  shade: number;
  phase: string;
  event: MicroEvent | null;
  /** True once the visitor has been still for a while: everything slows down. */
  calm: boolean;
}

/**
 * The desktop's pulse. It runs on minute-scale timers rather than a frame loop
 * — ambient light has no business costing a rAF budget.
 */
export function useAmbience(): Ambience {
  const [hour, setHour] = useState(() => currentHour());
  const [event, setEvent] = useState<MicroEvent | null>(null);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(
      () => setHour(currentHour()),
      LIGHT_TICK_MS,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const lastFiredAt: Partial<Record<MicroEvent, number>> = {};
    let clear: number | undefined;

    const tick = () => {
      const idle = lastEventOf(WorldEventType.UserIdle);
      const returned = lastEventOf(WorldEventType.UserReturned);
      setCalm(idle !== null && returned === null);

      if (event !== null) return;
      const now = Date.now();
      const rolled = rollMicroEvent(lastFiredAt, now);
      if (!rolled) return;
      lastFiredAt[rolled] = now;
      setEvent(rolled);
      clear = window.setTimeout(() => setEvent(null), durationOf(rolled));
    };

    const timer = window.setInterval(tick, EVENT_TICK_MS);
    return () => {
      window.clearInterval(timer);
      if (clear !== undefined) window.clearTimeout(clear);
    };
  }, [event]);

  const light = lightAt(hour);
  return {
    ...light,
    // Calm dims the wash slightly, the way a room settles when nobody moves.
    strength: calm ? light.strength * 1.12 : light.strength,
    phase: phaseAt(hour),
    event,
    calm,
  };
}
