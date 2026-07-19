import { SoundEvent, SoundTier } from "@/types/sound";

export interface SoundDefinition {
  // null marks an event that is documented but intentionally silent (see docs/AUDIO_GUIDELINES.md).
  src: string | null;
  tier: SoundTier;
  preload: boolean;
}

export const SOUND_REGISTRY: Readonly<Record<SoundEvent, SoundDefinition>> = {
  [SoundEvent.Boot]: {
    src: "/sounds/boot.mp3",
    tier: SoundTier.Session,
    preload: true,
  },
  [SoundEvent.Login]: {
    src: "/sounds/login.mp3",
    tier: SoundTier.Session,
    preload: true,
  },
  [SoundEvent.Shutdown]: {
    src: "/sounds/shutdown.mp3",
    tier: SoundTier.Session,
    preload: false,
  },
  [SoundEvent.WindowOpen]: {
    src: "/sounds/window-open.mp3",
    tier: SoundTier.Dialog,
    preload: false,
  },
  [SoundEvent.WindowClose]: {
    src: "/sounds/window-close.mp3",
    tier: SoundTier.Dialog,
    preload: false,
  },
  [SoundEvent.Error]: {
    src: "/sounds/error.mp3",
    tier: SoundTier.Dialog,
    preload: true,
  },
  [SoundEvent.Notification]: {
    src: "/sounds/notification.mp3",
    tier: SoundTier.Dialog,
    preload: false,
  },
  [SoundEvent.RecycleBin]: {
    src: "/sounds/recycle-bin.mp3",
    tier: SoundTier.Dialog,
    preload: false,
  },
  [SoundEvent.Click]: {
    src: "/sounds/click.mp3",
    tier: SoundTier.Interaction,
    preload: false,
  },
  [SoundEvent.Hover]: {
    src: null,
    tier: SoundTier.Interaction,
    preload: false,
  },
};
