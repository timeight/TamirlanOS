import type { DayPart } from "@/core/pet/reaction-engine";
import type { PetState } from "@/core/pet/pet-types";

export type StoryTag =
  | "repair"
  | "curiosity"
  | "social"
  | "rest"
  | "play"
  | "mishap"
  | "observe"
  | "night"
  | "bond";

/** One shot of the scene: a pose to hold and how long to hold it. */
export interface StoryBeat {
  state: PetState;
  seconds: number;
}

export interface Story {
  id: string;
  tags: readonly StoryTag[];
  beats: readonly StoryBeat[];
  weight: number;
  minFriendship?: number;
  dayParts?: readonly DayPart[];
}

export const STORY_MIN_S = 5;
export const STORY_MAX_S = 20;

export function storyDuration(story: Story): number {
  return story.beats.reduce((sum, beat) => sum + beat.seconds, 0);
}

/** Compact constructor: beats are [state, seconds] tuples. */
export function story(
  id: string,
  tags: readonly StoryTag[],
  weight: number,
  beats: readonly (readonly [PetState, number])[],
  options: { minFriendship?: number; dayParts?: readonly DayPart[] } = {},
): Story {
  return {
    id,
    tags,
    weight,
    beats: beats.map(([state, seconds]) => ({ state, seconds })),
    ...options,
  };
}
