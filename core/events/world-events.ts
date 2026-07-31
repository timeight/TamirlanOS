import type { AppId } from "@/types/application";

export enum WorldEventType {
  WindowOpened = "WINDOW_OPENED",
  WindowClosed = "WINDOW_CLOSED",
  WindowFocused = "WINDOW_FOCUSED",
  SongStarted = "SONG_STARTED",
  SongStopped = "SONG_STOPPED",
  WeatherChanged = "WEATHER_CHANGED",
  AchievementUnlocked = "ACHIEVEMENT_UNLOCKED",
  TimeMachine = "TIME_MACHINE",
  LostFiles = "LOST_FILES",
  PuzzleSolved = "PUZZLE_SOLVED",
  SecretFound = "SECRET_FOUND",
  UserIdle = "USER_IDLE",
  UserReturned = "USER_RETURNED",
  SystemUpdated = "SYSTEM_UPDATED",
  SystemError = "SYSTEM_ERROR",
}

export type Weather = "rain" | "snow" | "sun" | "storm" | "fog";

/**
 * The whole vocabulary of the world. Adding a module means adding a variant
 * here — publishers and subscribers never learn about each other.
 */
export type WorldEvent =
  | { type: WorldEventType.WindowOpened; appId: AppId }
  | { type: WorldEventType.WindowClosed; appId: AppId }
  | { type: WorldEventType.WindowFocused; appId: AppId }
  | { type: WorldEventType.SongStarted; title?: string; bpm?: number }
  | { type: WorldEventType.SongStopped }
  | { type: WorldEventType.WeatherChanged; weather: Weather }
  | { type: WorldEventType.AchievementUnlocked; id: string }
  | { type: WorldEventType.TimeMachine; year?: number }
  | { type: WorldEventType.LostFiles; active: boolean }
  | { type: WorldEventType.PuzzleSolved; id: string }
  | { type: WorldEventType.SecretFound; id: string }
  | { type: WorldEventType.UserIdle; seconds: number }
  | { type: WorldEventType.UserReturned; awayMs: number }
  | { type: WorldEventType.SystemUpdated; version: string }
  | { type: WorldEventType.SystemError; code?: string };

export type WorldEventOf<T extends WorldEventType> = Extract<
  WorldEvent,
  { type: T }
>;
