"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteTrack,
  fetchGroupTracks,
  fetchTracks,
  searchTracks,
  uploadTrack,
  type UploadTrack,
  type VkTrack,
} from "@/core/vk/api/audio";

export interface VkAudioLibrary {
  tracks: readonly VkTrack[];
  found: readonly VkTrack[];
  query: string;
  setQuery: (query: string) => void;
  searched: boolean;
  loading: boolean;
  busy: boolean;
  error: string | null;
  search: () => Promise<void>;
  add: (file: File, meta: UploadTrack) => Promise<void>;
  remove: (track: VkTrack) => Promise<void>;
}

/** groupId задан — библиотека сообщества, иначе личная. */
export function useVkAudio(
  ownerId: string,
  groupId: string | null = null,
): VkAudioLibrary {
  const [tracks, setTracks] = useState<readonly VkTrack[]>([]);
  const [found, setFound] = useState<readonly VkTrack[]>([]);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setTracks(
      groupId ? await fetchGroupTracks(groupId) : await fetchTracks(ownerId),
    );
    setLoading(false);
  }, [groupId, ownerId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const search = useCallback(async () => {
    setBusy(true);
    setFound(await searchTracks(query));
    setSearched(true);
    setBusy(false);
  }, [query]);

  const add = useCallback(
    async (file: File, meta: UploadTrack) => {
      setBusy(true);
      setError(null);
      const result = await uploadTrack(ownerId, file, {
        ...meta,
        groupId: groupId ?? null,
      });
      setBusy(false);
      if (typeof result === "string") {
        setError(result);
        return;
      }
      await reload();
    },
    [groupId, ownerId, reload],
  );

  const remove = useCallback(
    async (track: VkTrack) => {
      setBusy(true);
      setError(await deleteTrack(track));
      setBusy(false);
      await reload();
    },
    [reload],
  );

  return {
    tracks,
    found,
    query,
    setQuery,
    searched,
    loading,
    busy,
    error,
    search,
    add,
    remove,
  };
}
