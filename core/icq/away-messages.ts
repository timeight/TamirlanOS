import { MessageKind, type IcqMessage } from "@/core/icq/chat-types";

const DAY = 86_400_000;

const LINES: readonly string[] = [
  "я тут прибрался немного",
  "нашёл кое-что интересное, пока тебя не было",
  "тихо без тебя",
  "проверял, всё ли работает. всё работает",
  "я скучал",
];

/**
 * Notes PIX left during the absence. Timestamps are spread across the gap so
 * the history reads as though he really was here while nobody was watching.
 */
export function awayMessages(awayMs: number, now = Date.now()): IcqMessage[] {
  if (awayMs < DAY) return [];
  const count = awayMs >= 30 * DAY ? 3 : awayMs >= 7 * DAY ? 2 : 1;

  return Array.from({ length: count }, (_, index) => {
    const at = now - awayMs + (awayMs * (index + 1)) / (count + 1);
    return {
      id: `away-${index}-${Math.round(at).toString(36)}`,
      kind: MessageKind.Memory,
      text: LINES[index % LINES.length] ?? LINES[0]!,
      at: Math.round(at),
      fromPix: true,
    };
  });
}
