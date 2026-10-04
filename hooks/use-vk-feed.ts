"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchFeed } from "@/core/vk/api/posts";
import type { VkWallPost } from "@/core/vk/vk-types";

export interface VkFeed {
  posts: readonly VkWallPost[];
  loading: boolean;
  reload: () => Promise<void>;
}

export function useVkFeed(viewerId: string): VkFeed {
  const [posts, setPosts] = useState<readonly VkWallPost[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setPosts(await fetchFeed(viewerId));
    setLoading(false);
  }, [viewerId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { posts, loading, reload };
}
