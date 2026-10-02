"use client";

import { useCallback, useState } from "react";
import { applyFriendAction, fetchFriendStates } from "@/core/vk/api/friends";
import { searchProfiles } from "@/core/vk/api/profiles";
import type { FriendState } from "@/core/vk/social-types";
import type { VkProfileRow } from "@/core/vk/vk-types";

export interface VkPeopleSearch {
  query: string;
  setQuery: (query: string) => void;
  results: readonly VkProfileRow[];
  states: Record<string, FriendState>;
  searched: boolean;
  busy: boolean;
  run: () => Promise<void>;
  act: (target: string) => Promise<void>;
}

/** Состояние дружбы приходит из базы, чтобы кнопка в строке не врала. */
export function useVkPeopleSearch(viewerId: string): VkPeopleSearch {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<readonly VkProfileRow[]>([]);
  const [states, setStates] = useState<Record<string, FriendState>>({});
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (people: readonly VkProfileRow[]) => {
      const others = people.filter((p) => p.id !== viewerId).map((p) => p.id);
      setStates(await fetchFriendStates(others));
    },
    [viewerId],
  );

  const run = useCallback(async () => {
    setBusy(true);
    const people = await searchProfiles(query);
    setResults(people);
    await load(people);
    setSearched(true);
    setBusy(false);
  }, [load, query]);

  const act = useCallback(
    async (target: string) => {
      await applyFriendAction(viewerId, target, states[target] ?? "none");
      await load(results);
    },
    [load, results, states, viewerId],
  );

  return { query, setQuery, results, states, searched, busy, run, act };
}
