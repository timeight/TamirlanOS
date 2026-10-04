"use client";

import { VkMobilePost } from "@/components/apps/ie/pages/vk/mobile/VkMobilePost";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { useVkFeed } from "@/hooks/use-vk-feed";

interface VkMobileFeedProps {
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onMenu: () => void;
}

export function VkMobileFeed({
  viewerId,
  onOpenProfile,
  onMenu,
}: VkMobileFeedProps) {
  const { posts, loading, reload } = useVkFeed(viewerId);

  return (
    <VkMobileScreen
      title="Новости"
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
    >
      {loading ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">Загрузка...</p>
      ) : posts.length === 0 ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          Здесь появятся записи Ваших друзей. Пока их нет — найдите людей через
          поиск.
        </p>
      ) : (
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
      )}
    </VkMobileScreen>
  );
}
