import { asset } from "@/core/config/base-path";
import type { SoundEvent } from "@/types/sound";
import { SOUND_REGISTRY } from "./sound-registry";

export interface PlaybackSettings {
  volume: number;
  muted: boolean;
}

// Browser autoplay policy: nothing may play until a real user gesture unlocks audio.
let unlocked = false;

export function unlockAudio(): void {
  unlocked = true;
}

export function isAudioUnlocked(): boolean {
  return unlocked;
}

export function playSound(event: SoundEvent, settings: PlaybackSettings): void {
  if (!unlocked || settings.muted) return;
  const definition = SOUND_REGISTRY[event];
  if (definition.src === null) return;
  const audio = new Audio(asset(definition.src));
  audio.volume = settings.volume;
  // Sound files may not be shipped yet; a missing source must never surface as a runtime error.
  audio.play().catch(() => undefined);
}
