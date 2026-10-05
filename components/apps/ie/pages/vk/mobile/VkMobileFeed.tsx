"use client";

import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobilePost } from "@/components/apps/ie/pages/vk/mobile/VkMobilePost";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { VK_SECTION } from "@/core/vk/sections";
import { useVkFeed } from "@/hooks/use-vk-feed";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMobileFeedProps {
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onSection: (section: string) => void;
  onMenu: () => void;
}

export function VkMobileFeed({
  viewerId,
  onOpenProfile,
  onSection,
  onMenu,
}: VkMobileFeedProps) {
  const { posts, loading, loadingMore, hasMore, loadMore, reload } =
    useVkFeed(viewerId);

  return (
    <VkMobileScreen
      title="Новости"
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
    >
      {loading ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.loading}
        </p>
      ) : posts.length === 0 ? (
        <div className="px-[10px] py-6 text-center">
          <p className="text-[14px] text-[#8a8a8a]">Здесь пока ничего нет.</p>
          <p className="mt-1 text-[12px] text-[#9aa4ad]">
            Новости появятся, когда Вы или Ваши друзья напишете на стене.
          </p>
          <VkMobileButton
            className="mt-3"
            onClick={() => onSection(VK_SECTION.search)}
          >
            Найти людей
          </VkMobileButton>
        </div>
      ) : (
        <>
          <ul>
            {posts.map((post) => (
              <VkMobilePost
                key={post.id}
                post={post}
                viewerId={viewerId}
                onChanged={reload}
                onOpenProfile={onOpenProfile}
              />
            ))}
          </ul>

          {hasMore && (
            <div className="px-[10px] py-3">
              <VkMobileButton
                tone="secondary"
                className="w-full"
                disabled={loadingMore}
                onClick={loadMore}
              >
                {loadingMore ? "Загрузка..." : "Показать ещё"}
              </VkMobileButton>
            </div>
          )}
        </>
      )}
    </VkMobileScreen>
  );
}
