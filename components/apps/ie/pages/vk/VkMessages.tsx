"use client";

import { useEffect } from "react";
import { VkDialogList } from "@/components/apps/ie/pages/vk/VkDialogList";
import { VkThread } from "@/components/apps/ie/pages/vk/VkThread";
import { fullName } from "@/core/vk/vk-types";
import type { VkMessenger } from "@/hooks/use-vk-messages";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMessagesProps {
  messenger: VkMessenger;
  viewerId: string;
}

export function VkMessages({ messenger, viewerId }: VkMessagesProps) {
  const {
    dialogs,
    openId,
    messages,
    loading,
    open,
    close,
    send,
    remove,
    markSeen,
  } = messenger;
  const active = dialogs.find((item) => item.conversationId === openId);

  // Раздел смонтирован только пока он открыт, поэтому это и есть «зашёл».
  useEffect(() => {
    void markSeen();
  }, [markSeen]);

  // Clarity записывает сессии целиком, а превью диалогов — личная переписка.
  return (
    <div className="pt-3" data-clarity-mask="true">
      {!openId && (
        <h1 className="mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
          Мои сообщения
        </h1>
      )}

      {loading && (
        <p className="py-4 text-[11px] text-[#939393]">{VK_TEXT.loading}</p>
      )}

      {!loading && !openId && (
        <VkDialogList
          dialogs={dialogs}
          viewerId={viewerId}
          activeId={openId}
          onOpen={open}
        />
      )}

      {openId && (
        <VkThread
          messages={messages}
          viewerId={viewerId}
          title={active ? fullName(active.other) : "Переписка"}
          onSend={send}
          onDelete={remove}
          onBack={close}
        />
      )}
    </div>
  );
}
