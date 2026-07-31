import { PetState } from "@/core/pet/pet-types";

export const SPEECH_COOLDOWN_MS = 5 * 60 * 1000;
export const SPEECH_VISIBLE_MS = 3200;

/** Translation keys. Lines stay short so the bubble never covers real UI. */
const AMBIENT_LINES: readonly string[] = [
  "pix.say.coffee",
  "pix.say.stillCoding",
  "pix.say.building",
  "pix.say.wallpaper",
  "pix.say.listening",
  "pix.say.interesting",
  "pix.say.helloAgain",
  "pix.say.save",
];

const FRIEND_LINES: readonly string[] = [
  "pix.say.friend1",
  "pix.say.friend2",
  "pix.say.friend3",
];

const STATE_LINES: Partial<Record<PetState, string>> = {
  [PetState.Dance]: "pix.say.listening",
  [PetState.Repair]: "pix.say.fixing",
  [PetState.Confused]: "pix.say.hmm",
  [PetState.ObserveWindow]: "pix.say.interesting",
};

export function pickLine(
  state: PetState,
  friendship: number,
  random: () => number = Math.random,
): string {
  const stateLine = STATE_LINES[state];
  if (stateLine && random() < 0.5) return stateLine;
  const pool =
    friendship >= 50 ? [...AMBIENT_LINES, ...FRIEND_LINES] : AMBIENT_LINES;
  return pool[Math.floor(random() * pool.length)] ?? AMBIENT_LINES[0]!;
}

export function canSpeak(lastSpokeAt: number, now: number): boolean {
  return now - lastSpokeAt > SPEECH_COOLDOWN_MS;
}
