"use client";

import { useCallback, useState } from "react";
import { searchTracks, type VkTrack } from "@/core/vk/api/audio";
import { applyFriendAction, fetchFriendStates } from "@/core/vk/api/friends";
import { searchGroups } from "@/core/vk/api/groups";
import { searchProfiles } from "@/core/vk/api/profiles";
import type { FriendState } from "@/core/vk/social-types";
import type { VkGroupRow, VkProfileRow } from "@/core/vk/vk-types";

export type SearchScope = "people" | "groups" | "audio";

export const SEARCH_TABS: readonly { key: SearchScope; label: string }[] = [
  { key: "people", label: "Люди" },
  { key: "groups", label: "Сообщества" },
  { key: "audio", label: "Аудиозаписи" },
];

export interface VkSearchState {
  scope: SearchScope;
  setScope: (scope: SearchScope) => void;
  query: string;
  setQuery: (query: string) => void;
  people: readonly VkProfileRow[];
  groups: readonly VkGroupRow[];
  tracks: readonly VkTrack[];
  states: Record<string, FriendState>;
  searched: boolean;
  busy: boolean;
  error: string | null;
  run: () => Promise<void>;
  act: (target: string) => Promise<void>;
}

/**
 * Один запрос ищет сразу по людям, сообществам и аудио, а вкладки лишь
 * показывают нужную часть: искать трижды при переключении было бы и
 * медленнее, и неожиданно для человека.
 */
export function useVkSearch(viewerId: string): VkSearchState {
  const [scope, setScope] = useState<SearchScope>("people");
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<readonly VkProfileRow[]>([]);
  const [groups, setGroups] = useState<readonly VkGroupRow[]>([]);
  const [tracks, setTracks] = useState<readonly VkTrack[]>([]);
  const [states, setStates] = useState<Record<string, FriendState>>({});
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStates = useCallback(
    async (found: readonly VkProfileRow[]) => {
      const others = found.filter((p) => p.id !== viewerId).map((p) => p.id);
      setStates(await fetchFriendStates(others));
    },
    [viewerId],
  );

  const run = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const [foundPeople, foundGroups, foundTracks] = await Promise.all([
        searchProfiles(query),
        searchGroups(query),
        searchTracks(query),
      ]);
      setPeople(foundPeople);
      setGroups(foundGroups);
      setTracks(foundTracks);
      await loadStates(foundPeople);
      setSearched(true);
    } catch {
      setError("Не удалось загрузить данные.");
    }
    setBusy(false);
  }, [loadStates, query]);

  const act = useCallback(
    async (target: string) => {
      await applyFriendAction(viewerId, target, states[target] ?? "none");
      await loadStates(people);
    },
    [loadStates, people, states, viewerId],
  );

  return {
    scope,
    setScope,
    query,
    setQuery,
    people,
    groups,
    tracks,
    states,
    searched,
    busy,
    error,
    run,
    act,
  };
}
