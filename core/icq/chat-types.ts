import type { Weather } from "@/core/events/world-events";

export enum MessageKind {
  Greeting = "greeting",
  Hint = "hint",
  Joke = "joke",
  Memory = "memory",
  Warning = "warning",
  Achievement = "achievement",
  Story = "story",
  System = "system",
  Thought = "thought",
}

export enum PixStatus {
  Online = "online",
  Away = "away",
  Typing = "typing",
  Sleeping = "sleeping",
  Listening = "listening",
  Exploring = "exploring",
  Thinking = "thinking",
}

/** Small things PIX sends instead of text when words would be too much. */
export type Attachment =
  | { type: "sticker"; glyph: string; label: string }
  | { type: "file"; name: string; note: string };

export interface IcqMessage {
  id: string;
  kind: MessageKind;
  text: string;
  at: number;
  fromPix: boolean;
  attachment?: Attachment;
}

/** Everything PIX is allowed to know when choosing what to say. */
export interface ChatContext {
  hour: number;
  minutesInSession: number;
  awayMs: number;
  idle: boolean;
  friendship: number;
  achievements: number;
  achievementTotal: number;
  currentApp: string | null;
  appsVisited: number;
  lostFilesFound: boolean;
  lostFilesRead: number;
  secretsFound: number;
  weather: Weather | null;
  musicPlaying: boolean;
  firstEverVisit: boolean;
}
