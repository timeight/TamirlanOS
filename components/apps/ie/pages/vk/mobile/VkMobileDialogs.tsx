"use client";

import { useEffect } from "react";
import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import { fullName, vkDate } from "@/core/vk/vk-types";
import type { VkMessenger } from "@/hooks/use-vk-messages";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMobileDialogsProps {
  messenger: VkMessenger;
  viewerId: string;
}

/** data-clarity-mask: превью переписки — личные данные, в записи сессий не идут. */
export function VkMobileDialogs({ messenger, viewerId }: VkMobileDialogsProps) {
  const { dialogs, loading, open, markSeen } = messenger;

  useEffect(() => {
    void markSeen();
  }, [markSeen]);

  if (loading) {
    return (
      <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
        {VK_TEXT.loading}
      </p>
    );
  }

  if (dialogs.length === 0) {
    return (
      <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
        Переписок нет. Откройте чью-нибудь страницу и напишите первым.
      </p>
    );
  }

  return (
    <ul data-clarity-mask="true">
      {dialogs.map((dialog) => (
        <VkMobileRow
          key={dialog.conversationId}
          title={fullName(dialog.other)}
          subtitle={
            dialog.lastContent
              ? `${dialog.lastAuthorId === viewerId ? "Вы: " : ""}${dialog.lastContent}`
              : "нет сообщений"
          }
          avatar={dialog.other.avatar_url}
          meta={dialog.lastCreatedAt ? vkDate(dialog.lastCreatedAt) : undefined}
          badge={dialog.unread}
          unread={dialog.unread > 0}
          onClick={() => open(dialog.conversationId)}
        />
      ))}
    </ul>
  );
}
