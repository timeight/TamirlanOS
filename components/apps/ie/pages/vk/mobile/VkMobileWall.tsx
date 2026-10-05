"use client";

import { VkMobileComposer } from "@/components/apps/ie/pages/vk/mobile/VkMobileComposer";
import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
import { VkMobilePost } from "@/components/apps/ie/pages/vk/mobile/VkMobilePost";
import { useVkWall } from "@/hooks/use-vk-wall";
import { useWallComposer } from "@/hooks/use-wall-composer";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMobileWallProps {
  ownerId: string;
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  /** Запись из уведомления: к ней прокручиваем и подсвечиваем. */
  focusPostId?: string | null;
}

export function VkMobileWall({
  ownerId,
  viewerId,
  onOpenProfile,
  focusPostId,
}: VkMobileWallProps) {
  const { posts, loading, reload } = useVkWall(ownerId, viewerId);
  const composer = useWallComposer(ownerId, viewerId, reload);

  return (
    <section>
      <VkMobileGroupLabel>Стена</VkMobileGroupLabel>

      <VkMobileComposer composer={composer} own={ownerId === viewerId} />

      {loading ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.loading}
        </p>
      ) : posts.length === 0 ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
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
              focused={post.id === focusPostId}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
