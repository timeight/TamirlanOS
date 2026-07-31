import type { Mood } from "@/core/pet/pet-mood";
import type { DayPart } from "@/core/pet/reaction-engine";
import { STORIES } from "@/core/pet/story/story-library";
import type { PetState } from "@/core/pet/pet-types";
import type { Story, StoryTag } from "@/core/pet/story/story-types";

/** How many recent stories are barred from repeating. */
const RECENT_MEMORY = 14;
const STORY_COOLDOWN_MS = 90000;

/** Moods pull the selection toward matching themes. */
const MOOD_TAGS: Record<Mood, readonly StoryTag[]> = {
  happy: ["social", "play", "curiosity"],
  curious: ["curiosity", "observe"],
  excited: ["play", "social"],
  sleepy: ["rest", "night"],
  scared: ["mishap", "rest"],
  proud: ["social", "play", "bond"],
  idle: ["observe", "rest"],
};

export interface StorySelection {
  recent: readonly string[];
  playedAt: Readonly<Record<string, number>>;
  mood: Mood;
  dayPart: DayPart;
  friendship: number;
  now: number;
}

export function selectStory(
  selection: StorySelection,
  random: () => number = Math.random,
): Story | null {
  const preferred = MOOD_TAGS[selection.mood];
  const pool = STORIES.filter((item) => {
    if (selection.recent.includes(item.id)) return false;
    if (
      selection.now - (selection.playedAt[item.id] ?? 0) <
      STORY_COOLDOWN_MS
    ) {
      return false;
    }
    if ((item.minFriendship ?? 0) > selection.friendship) return false;
    if (item.dayParts && !item.dayParts.includes(selection.dayPart)) {
      return false;
    }
    return true;
  });
  if (!pool.length) return null;

  const weights = pool.map((item) => {
    const themed = item.tags.some((tag) => preferred.includes(tag)) ? 2.4 : 1;
    return item.weight * themed;
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = random() * total;
  for (let index = 0; index < pool.length; index++) {
    roll -= weights[index] ?? 0;
    if (roll <= 0) return pool[index] ?? null;
  }
  return pool[0] ?? null;
}

export function rememberStory(recent: readonly string[], id: string): string[] {
  return [...recent, id].slice(-RECENT_MEMORY);
}

/** Walks the beats of one story; the engine only asks what to play now. */
export class StoryPlayer {
  private story: Story | null = null;
  private index = 0;
  private elapsed = 0;

  start(story: Story): void {
    this.story = story;
    this.index = 0;
    this.elapsed = 0;
  }

  stop(): void {
    this.story = null;
  }

  get active(): boolean {
    return this.story !== null;
  }

  get id(): string | null {
    return this.story?.id ?? null;
  }

  /** Returns the state to play, or null once the scene is over. */
  advance(dt: number): { state: PetState; changed: boolean } | null {
    if (!this.story) return null;
    const beat = this.story.beats[this.index];
    if (!beat) {
      this.story = null;
      return null;
    }
    this.elapsed += dt;
    if (this.elapsed < beat.seconds) {
      return { state: beat.state, changed: false };
    }
    this.elapsed = 0;
    this.index += 1;
    const next = this.story.beats[this.index];
    if (!next) {
      this.story = null;
      return null;
    }
    return { state: next.state, changed: true };
  }
}
