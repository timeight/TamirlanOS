import { PetState } from "@/core/pet/pet-types";

export type Trait =
  | "curious"
  | "friendly"
  | "playful"
  | "shy"
  | "helpful"
  | "lazy"
  | "hardworking"
  | "funny";

export type TraitWeights = Readonly<Record<Trait, number>>;

/** PIX's baseline character. Weights are 0–1 and drift with friendship. */
export const BASE_TRAITS: TraitWeights = {
  curious: 0.9,
  friendly: 0.75,
  playful: 0.65,
  shy: 0.55,
  helpful: 0.6,
  lazy: 0.35,
  hardworking: 0.5,
  funny: 0.45,
};

/** How each trait pushes a state's weight. Values multiply, 1 means no opinion. */
const TRAIT_AFFINITY: Record<Trait, Partial<Record<PetState, number>>> = {
  curious: {
    [PetState.Observe]: 1.9,
    [PetState.Walk]: 1.3,
    [PetState.Think]: 1.4,
    [PetState.Inspect]: 1.6,
  },
  friendly: { [PetState.Wave]: 2.1, [PetState.Celebrate]: 1.3 },
  playful: {
    [PetState.Jump]: 1.9,
    [PetState.Dance]: 1.8,
    [PetState.Celebrate]: 1.4,
  },
  shy: {
    [PetState.Wave]: 0.5,
    [PetState.Dance]: 0.4,
    [PetState.Sit]: 1.4,
    [PetState.Peek]: 1.8,
  },
  helpful: { [PetState.Repair]: 1.8, [PetState.Observe]: 1.2 },
  lazy: {
    [PetState.Sit]: 1.9,
    [PetState.Idle]: 1.6,
    [PetState.Walk]: 0.6,
    [PetState.Run]: 0.3,
  },
  hardworking: {
    [PetState.Repair]: 1.6,
    [PetState.Walk]: 1.25,
    [PetState.Idle]: 0.6,
  },
  funny: { [PetState.Dance]: 1.5, [PetState.Confused]: 1.3 },
};

/**
 * Shyness fades and friendliness grows as the visitor and PIX get to know each
 * other, so the same code produces a different character over time.
 */
export function traitsFor(friendship: number): TraitWeights {
  const bond = Math.max(0, Math.min(1, friendship / 100));
  return {
    ...BASE_TRAITS,
    shy: BASE_TRAITS.shy * (1 - bond * 0.85),
    friendly: Math.min(1, BASE_TRAITS.friendly + bond * 0.25),
    playful: Math.min(1, BASE_TRAITS.playful + bond * 0.3),
    helpful: Math.min(1, BASE_TRAITS.helpful + bond * 0.35),
  };
}

export function traitBias(traits: TraitWeights, state: PetState): number {
  let bias = 1;
  for (const key of Object.keys(traits) as Trait[]) {
    const affinity = TRAIT_AFFINITY[key][state];
    if (affinity === undefined) continue;
    // A trait at weight 0 has no say; at weight 1 it applies its full affinity.
    bias *= 1 + (affinity - 1) * traits[key];
  }
  return bias;
}

export type FriendshipTier =
  "stranger" | "acquaintance" | "friend" | "close" | "bonded";

export function friendshipTier(friendship: number): FriendshipTier {
  if (friendship >= 100) return "bonded";
  if (friendship >= 75) return "close";
  if (friendship >= 40) return "friend";
  if (friendship >= 15) return "acquaintance";
  return "stranger";
}
