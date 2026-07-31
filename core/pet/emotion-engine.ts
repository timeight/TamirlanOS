export type Emotion =
  | "happy"
  | "curious"
  | "excited"
  | "calm"
  | "sleepy"
  | "scared"
  | "embarrassed"
  | "proud"
  | "confused"
  | "thinking";

export type EmotionLevels = Record<Emotion, number>;

const EMOTIONS: readonly Emotion[] = [
  "happy",
  "curious",
  "excited",
  "calm",
  "sleepy",
  "scared",
  "embarrassed",
  "proud",
  "confused",
  "thinking",
];

/** Points per second each emotion loses when nothing reinforces it. */
const DECAY: Record<Emotion, number> = {
  happy: 2.4,
  curious: 4,
  excited: 6,
  calm: 1.2,
  sleepy: 1.6,
  scared: 7,
  embarrassed: 5,
  proud: 3,
  confused: 5,
  thinking: 4,
};

const BASELINE: Partial<EmotionLevels> = { calm: 25, happy: 20 };

export function createEmotions(): EmotionLevels {
  const levels = Object.fromEntries(
    EMOTIONS.map((emotion) => [emotion, 0]),
  ) as EmotionLevels;
  return { ...levels, ...BASELINE };
}

export function stimulate(
  levels: EmotionLevels,
  emotion: Emotion,
  amount: number,
): EmotionLevels {
  return {
    ...levels,
    [emotion]: Math.max(0, Math.min(100, levels[emotion] + amount)),
  };
}

/** Emotions always drift back toward the baseline; nothing stays hot forever. */
export function decay(levels: EmotionLevels, dt: number): EmotionLevels {
  const next = { ...levels };
  for (const emotion of EMOTIONS) {
    const floor = BASELINE[emotion] ?? 0;
    const value = next[emotion];
    next[emotion] =
      value > floor
        ? Math.max(floor, value - DECAY[emotion] * dt)
        : Math.min(floor, value + DECAY[emotion] * dt * 0.4);
  }
  return next;
}

export function dominant(levels: EmotionLevels): {
  emotion: Emotion;
  intensity: number;
} {
  let best: Emotion = "calm";
  let intensity = -1;
  for (const emotion of EMOTIONS) {
    if (levels[emotion] > intensity) {
      intensity = levels[emotion];
      best = emotion;
    }
  }
  return { emotion: best, intensity };
}
