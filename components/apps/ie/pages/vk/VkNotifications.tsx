"use client";

import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { NOTIFICATION_TEXT } from "@/core/vk/social-types";
import { cn } from "@/core/utils/cn";
import { fullName, vkDate } from "@/core/vk/vk-types";
import { useVkNotifications } from "@/hooks/use-vk-notifications";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkNotificationsProps {
  onOpenProfile: (profileId: string) => void;
  onOpenPost: (postId: string) => void;
  onCountersChanged: () => Promise<void>;
}

export function VkNotifications({
  onOpenProfile,
  onOpenPost,
  onCountersChanged,
}: VkNotificationsProps) {
  const { items, loading, clearRead } = useVkNotifications(onCountersChanged);

  return (
    <div className="pt-3">
      <h1 className="mb-2 flex items-center gap-3 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Мои ответы
        {items.length > 0 && (
          <VkButton
            tone="quiet"
            className="ml-auto"
            onClick={() => void clearRead()}
          >
            Очистить
          </VkButton>
        )}
      </h1>

      {loading ? (
        <p className="py-4 text-[11px] text-[#939393]">{VK_TEXT.loading}</p>
      ) : items.length === 0 ? (
        <p className="py-4 text-[11px] text-[#939393]">Новых событий нет.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-2.5 border-b border-[#e3e8ec] px-1 py-2",
                !item.is_read && "bg-[#f3f6f9]",
              )}
            >
              <VkAvatar size={32} src={item.actor?.avatar_url} />
              <p className="min-w-0 flex-1 text-[11px] leading-[16px]">
                <button
                  type="button"
                  onClick={() => onOpenProfile(item.actor_id)}
                  className="font-bold text-[#2b587a] hover:underline"
                >
                  {item.actor ? fullName(item.actor) : "Удалённая страница"}
                </button>{" "}
                {item.post_id ? (
                  <button
                    type="button"
                    onClick={() => onOpenPost(item.post_id!)}
                    className="text-[#2b587a] hover:underline"
                  >
                    {NOTIFICATION_TEXT[item.kind]}
                  </button>
                ) : (
                  <span className="text-[#333]">
                    {NOTIFICATION_TEXT[item.kind]}
                  </span>
                )}
                <span className="mt-0.5 block text-[10px] text-[#939393]">
                  {vkDate(item.created_at)}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
