import { AppKey } from "@/core/apps/app-catalog";
import { PetState } from "@/core/pet/pet-types";
import type { AppId } from "@/types/application";

export interface PetReaction {
  state: PetState;
  duration: number;
  /** PIX walks next to the window before reacting. */
  approach: boolean;
}

/** Adding a reaction for a new app is one line here. */
export const APP_REACTIONS: Partial<Record<AppId, PetReaction>> = {
  [AppKey.Portfolio]: {
    state: PetState.ObserveWindow,
    duration: 5,
    approach: true,
  },
  [AppKey.InternetExplorer]: {
    state: PetState.Inspect,
    duration: 5,
    approach: true,
  },
  [AppKey.Agent]: { state: PetState.Think, duration: 4.5, approach: true },
  [AppKey.Paint]: { state: PetState.Inspect, duration: 4, approach: true },
  [AppKey.Photography]: {
    state: PetState.ObserveWindow,
    duration: 4,
    approach: true,
  },
  [AppKey.Gallery3D]: {
    state: PetState.Celebrate,
    duration: 3,
    approach: false,
  },
  [AppKey.Shooter]: { state: PetState.Confused, duration: 3, approach: false },
  [AppKey.Minesweeper]: {
    state: PetState.Confused,
    duration: 3,
    approach: true,
  },
  [AppKey.Checkers]: { state: PetState.Think, duration: 4, approach: true },
  [AppKey.Game2048]: { state: PetState.Dance, duration: 3.5, approach: false },
  [AppKey.TicTacToe]: { state: PetState.Think, duration: 3, approach: true },
  [AppKey.Achievements]: {
    state: PetState.Celebrate,
    duration: 3,
    approach: false,
  },
  [AppKey.RecycleBin]: { state: PetState.Sit, duration: 4, approach: true },
  [AppKey.Skills]: { state: PetState.Repair, duration: 4, approach: true },
  [AppKey.Resume]: { state: PetState.Inspect, duration: 4, approach: true },
  [AppKey.FileViewer]: { state: PetState.Peek, duration: 3, approach: true },
};

export function reactionFor(appId: AppId | null): PetReaction | null {
  if (!appId) return null;
  return APP_REACTIONS[appId] ?? null;
}
