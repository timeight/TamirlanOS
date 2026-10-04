"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createGroup,
  fetchMyGroups,
  popularGroups,
  searchGroups,
  type NewGroup,
} from "@/core/vk/api/groups";
import type { VkGroupListed, VkGroupRow } from "@/core/vk/vk-types";

export interface VkGroups {
  mine: readonly VkGroupRow[];
  popular: readonly VkGroupListed[];
  found: readonly VkGroupRow[];
  query: string;
  setQuery: (query: string) => void;
  searched: boolean;
  loading: boolean;
  busy: boolean;
  error: string | null;
  search: () => Promise<void>;
  create: (input: NewGroup) => Promise<string | null>;
  reload: () => Promise<void>;
}

export function useVkGroups(userId: string): VkGroups {
  const [mine, setMine] = useState<readonly VkGroupRow[]>([]);
  const [popular, setPopular] = useState<readonly VkGroupListed[]>([]);
  const [found, setFound] = useState<readonly VkGroupRow[]>([]);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const [list, top] = await Promise.all([
      fetchMyGroups(userId),
      popularGroups(),
    ]);
    setMine(list);
    setPopular(top);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const search = useCallback(async () => {
    setBusy(true);
    setFound(await searchGroups(query));
    setSearched(true);
    setBusy(false);
  }, [query]);

  /** Возвращает id созданного сообщества, чтобы сразу его открыть. */
  const create = useCallback(
    async (input: NewGroup) => {
      setBusy(true);
      setError(null);
      const result = await createGroup(userId, input);
      setBusy(false);
      if (typeof result === "string") {
        setError(result);
        return null;
      }
      await reload();
      return result.id;
    },
    [reload, userId],
  );

  return {
    mine,
    popular,
    found,
    query,
    setQuery,
    searched,
    loading,
    busy,
    error,
    search,
    create,
    reload,
  };
}
