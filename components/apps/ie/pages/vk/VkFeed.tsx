"use client";

import { VkPost } from "@/components/apps/ie/pages/vk/VkPost";
import { useVkFeed } from "@/hooks/use-vk-feed";

interface VkFeedProps {
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
}

export function VkFeed({ viewerId, onOpenProfile }: VkFeedProps) {
  const { posts, loading, reload } = useVkFeed(viewerId);

  return (
    <div className="pt-3">
      <h1 className="mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Мои новости
      </h1>

      {loading ? (
        <p className="py-4 text-[11px] text-[#939393]">Загрузка...</p>
      ) : posts.length === 0 ? (
        <p className="py-4 text-[11px] text-[#939393]">
          Здесь появятся записи Ваших друзей. Пока их нет — найдите людей через
          поиск.
        </p>
      ) : (
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
      )}
    </div>
  );
}
