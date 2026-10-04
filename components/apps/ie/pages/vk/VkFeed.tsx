"use client";

import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkPost } from "@/components/apps/ie/pages/vk/VkPost";
import { VK_SECTION } from "@/core/vk/sections";
import { useVkFeed } from "@/hooks/use-vk-feed";

interface VkFeedProps {
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onSection: (section: string) => void;
}

export function VkFeed({ viewerId, onOpenProfile, onSection }: VkFeedProps) {
  const { posts, loading, loadingMore, hasMore, loadMore, reload } =
    useVkFeed(viewerId);

  return (
    <div className="pt-3">
      <h1 className="mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Мои новости
      </h1>

      {loading ? (
        <p className="py-4 text-[11px] text-[#939393]">Загрузка...</p>
      ) : posts.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-[12px] text-[#939393]">Здесь пока ничего нет.</p>
          <p className="mt-1 text-[11px] text-[#939393]">
            Новости появятся, когда Вы или Ваши друзья напишете на стене.
          </p>
          <VkButton
            className="mt-3"
            onClick={() => onSection(VK_SECTION.search)}
          >
            Найти людей
          </VkButton>
        </div>
      ) : (
        <>
          <ul className="border-t border-[#dae1e8]">
            {posts.map((post) => (
              <VkPost
                key={post.id}
                post={post}
                viewerId={viewerId}
                onChanged={reload}
                onOpenProfile={onOpenProfile}
              />
            ))}
          </ul>

          {hasMore && (
            <div className="py-3 text-center">
              <VkButton disabled={loadingMore} onClick={loadMore}>
                {loadingMore ? "Загрузка..." : "Показать ещё"}
              </VkButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
