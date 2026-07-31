import {
  SESSION_KEY,
  type SessionSnapshot,
} from "@/core/session/session-types";
import { migrate } from "@/core/session/version-migration";

/** Set once the visitor ticks "remember my choice". */
const CHOICE_KEY = "tamirlanos:session-choice";

export type SessionChoice = "restore" | "fresh" | null;

export function loadSession(): SessionSnapshot | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

let pending: number | undefined;

/** Debounced so a drag that fires fifty updates still writes once. */
export function saveSession(snapshot: SessionSnapshot, delayMs = 1200): void {
  if (typeof localStorage === "undefined") return;
  if (pending !== undefined) clearTimeout(pending);
  pending = setTimeout(() => {
    pending = undefined;
    writeSession(snapshot);
  }, delayMs) as unknown as number;
}

/** Bypasses the debounce: used on unload, where there is no next tick. */
export function writeSession(snapshot: SessionSnapshot): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
  } catch {
    // Quota or private mode. The desktop keeps working without a snapshot.
  }
}

export function loadChoice(): SessionChoice {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(CHOICE_KEY);
  return raw === "restore" || raw === "fresh" ? raw : null;
}

export function saveChoice(choice: SessionChoice): void {
  try {
    if (choice) localStorage.setItem(CHOICE_KEY, choice);
    else localStorage.removeItem(CHOICE_KEY);
  } catch {
    // Remembering the choice is a convenience, never a requirement.
  }
}
