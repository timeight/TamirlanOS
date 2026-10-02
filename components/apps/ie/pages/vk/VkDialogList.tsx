"use client";

import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import type { VkDialog } from "@/core/vk/social-types";
import { cn } from "@/core/utils/cn";
import { fullName, vkDate } from "@/core/vk/vk-types";

interface VkDialogListProps {
  dialogs: readonly VkDialog[];
  viewerId: string;
  activeId: string | null;
  onOpen: (conversationId: string) => void;
}

export function VkDialogList({
  dialogs,
  viewerId,
  activeId,
  onOpen,
}: VkDialogListProps) {
  if (dialogs.length === 0) {
    return (
      <p className="py-4 text-[11px] text-[#939393]">
        Переписок нет. Откройте чью-нибудь страницу и напишите первым.
      </p>
    );
  }

  return (
    <ul>
      {dialogs.map((dialog) => (
        <li key={dialog.conversationId}>
          <button
            type="button"
            onClick={() => onOpen(dialog.conversationId)}
            className={cn(
              "flex w-full items-start gap-2.5 border-b border-[#e3e8ec] px-1 py-2 text-left",
              dialog.conversationId === activeId
                ? "bg-[#edf1f5]"
                : "hover:bg-[#f6f8fa]",
            )}
          >
            <VkAvatar size={40} src={dialog.other.avatar_url} />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className="truncate text-[12px] font-bold text-[#2b587a]">
                  {fullName(dialog.other)}
                </span>
                {dialog.unread > 0 && (
                  <span className="shrink-0 bg-[#8b1a1a] px-1 text-[10px] leading-[14px] text-white">
                    {dialog.unread}
                  </span>
                )}
                {dialog.lastCreatedAt && (
                  <span className="ml-auto shrink-0 text-[10px] text-[#939393]">
                    {vkDate(dialog.lastCreatedAt)}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-[#555]">
                {dialog.lastAuthorId === viewerId && "Вы: "}
                {dialog.lastContent ?? "нет сообщений"}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
