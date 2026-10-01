"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchWall } from "@/core/vk/api/posts";
import type { VkWallPost } from "@/core/vk/vk-types";

export interface WallState {
  posts: readonly VkWallPost[];
  loading: boolean;
  reload: () => Promise<void>;
}

/** Refetches after every mutation: the wall is small and always correct. */
export function useVkWall(
  ownerId: string | null,
  viewerId: string | null,
): WallState {
  const [posts, setPosts] = useState<readonly VkWallPost[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!ownerId) return;
    const next = await fetchWall(ownerId, viewerId);
    setPosts(next);
    setLoading(false);
  }, [ownerId, viewerId]);

  useEffect(() => {
    setLoading(true);
    void reload();
  }, [reload]);

  return { posts, loading, reload };
}
