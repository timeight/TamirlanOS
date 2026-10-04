"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchFeed } from "@/core/vk/api/posts";
import type { VkWallPost } from "@/core/vk/vk-types";

const PAGE = 20;

export interface VkFeed {
  posts: readonly VkWallPost[];
  loading: boolean;
  /** Идёт подгрузка следующей страницы — лента при этом остаётся на экране. */
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reload: () => Promise<void>;
}

/**
 * Лента растёт пределом выборки, а не курсором: после лайка или удаления
 * она перечитывается целиком и не теряет уже показанные записи. Курсор по
 * времени был бы точнее при большом потоке, но здесь дал бы дыры в списке.
 */
export function useVkFeed(viewerId: string): VkFeed {
  const [posts, setPosts] = useState<readonly VkWallPost[]>([]);
  const [size, setSize] = useState(PAGE);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const reload = useCallback(async () => {
    const page = await fetchFeed(viewerId, size);
    setPosts(page.posts);
    setHasMore(page.hasMore);
    setLoading(false);
    setLoadingMore(false);
  }, [size, viewerId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setSize((current) => current + PAGE);
  }, []);

  return { posts, loading, loadingMore, hasMore, loadMore, reload };
}
