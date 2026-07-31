import type { ChatContext } from "@/core/icq/chat-types";
import { MESSAGE_LIBRARY, type MessageEntry } from "@/core/icq/message-library";

/** Nothing is ever sent sooner than this after the previous line. */
export const BASE_SILENCE_MS = 4 * 60_000;

/** A friend earns the right to speak a little more often. */
export function silenceFor(friendship: number): number {
  const earned = Math.min(friendship, 100) / 100;
  return BASE_SILENCE_MS * (1.9 - earned);
}

export interface SelectionInput {
  context: ChatContext;
  /** Entry ids already delivered, most recent last. */
  history: readonly string[];
  silentMs: number;
}

/**
 * Picks at most one line. Returning null is the normal outcome — PIX stays
 * quiet far more often than he speaks, and that is the whole point.
 */
export function selectMessage(
  input: SelectionInput,
  random: () => number = Math.random,
): MessageEntry | null {
  const { context, history, silentMs } = input;
  if (silentMs < silenceFor(context.friendship)) return null;

  const recent = history.slice(-6);
  const eligible = MESSAGE_LIBRARY.filter((entry) => {
    if (entry.once && history.includes(entry.id)) return false;
    if (recent.includes(entry.id)) return false;
    if (entry.patience !== undefined && silentMs < entry.patience) return false;
    return entry.when(context);
  });
  if (eligible.length === 0) return null;

  const total = eligible.reduce((sum, entry) => sum + entry.weight, 0);
  let ticket = random() * total;
  for (const entry of eligible) {
    ticket -= entry.weight;
    if (ticket <= 0) return entry;
  }
  return eligible[eligible.length - 1] ?? null;
}

/** Typing time scales with the line, so short lines land fast. */
export function typingMsFor(text: string): number {
  return Math.min(4200, 700 + text.length * 55);
}

export function pickLine(
  entry: MessageEntry,
  random: () => number = Math.random,
): string {
  const index = Math.floor(random() * entry.lines.length);
  return entry.lines[index] ?? entry.lines[0] ?? "";
}
