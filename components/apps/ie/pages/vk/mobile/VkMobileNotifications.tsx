"use client";

import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { NOTIFICATION_TEXT } from "@/core/vk/social-types";
import { fullName, vkDate } from "@/core/vk/vk-types";
import { useVkNotifications } from "@/hooks/use-vk-notifications";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMobileNotificationsProps {
  onOpenProfile: (profileId: string) => void;
  onOpenPost: (postId: string) => void;
  onCountersChanged: () => Promise<void>;
  onMenu: () => void;
}

export function VkMobileNotifications({
  onOpenProfile,
  onOpenPost,
  onCountersChanged,
  onMenu,
}: VkMobileNotificationsProps) {
  const { items, loading, clearRead } = useVkNotifications(onCountersChanged);

  return (
    <VkMobileScreen
      title="Ответы"
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
      right={
        items.length > 0
          ? {
              glyph: "close",
              label: "Очистить",
              onClick: () => void clearRead(),
            }
          : undefined
      }
    >
      {loading ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.loading}
        </p>
      ) : items.length === 0 ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          Новых событий нет.
        </p>
      ) : (
        <ul>
          {items.map((item) => (
            <VkMobileRow
              key={item.id}
              title={item.actor ? fullName(item.actor) : "Удалённая страница"}
              subtitle={`${NOTIFICATION_TEXT[item.kind]} · ${vkDate(item.created_at)}`}
              avatar={item.actor?.avatar_url}
              unread={!item.is_read}
              chevron
              onClick={() =>
                item.post_id
                  ? onOpenPost(item.post_id)
                  : onOpenProfile(item.actor_id)
              }
            />
          ))}
        </ul>
      )}
    </VkMobileScreen>
  );
}
