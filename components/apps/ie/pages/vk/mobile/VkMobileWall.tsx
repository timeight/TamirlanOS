"use client";

import { VkMobileComposer } from "@/components/apps/ie/pages/vk/mobile/VkMobileComposer";
import { VkMobilePost } from "@/components/apps/ie/pages/vk/mobile/VkMobilePost";
import { useVkWall } from "@/hooks/use-vk-wall";
import { useWallComposer } from "@/hooks/use-wall-composer";

interface VkMobileWallProps {
  ownerId: string;
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
}

export function VkMobileWall({
  ownerId,
  viewerId,
  onOpenProfile,
}: VkMobileWallProps) {
  const { posts, loading, reload } = useVkWall(ownerId, viewerId);
  const composer = useWallComposer(ownerId, viewerId, reload);

  return (
    <section>
      <h3 className="bg-[#f2f4f6] px-3 py-1.5 text-[12px] text-[#7a7a7a] uppercase">
        Стена
      </h3>

      <VkMobileComposer composer={composer} own={ownerId === viewerId} />

      {loading ? (
        <p className="px-3 py-5 text-[13px] text-[#95a0ab]">Загрузка...</p>
      ) : posts.length === 0 ? (
        <p className="px-3 py-5 text-[13px] text-[#95a0ab]">
          Записей пока нет.
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
    </section>
  );
}
