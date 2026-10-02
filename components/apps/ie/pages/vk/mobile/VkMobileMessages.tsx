"use client";

import { VkMobileChat } from "@/components/apps/ie/pages/vk/mobile/VkMobileChat";
import { VkMobileDialogs } from "@/components/apps/ie/pages/vk/mobile/VkMobileDialogs";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { fullName } from "@/core/vk/vk-types";
import type { VkMessenger } from "@/hooks/use-vk-messages";

interface VkMobileMessagesProps {
  messenger: VkMessenger;
  viewerId: string;
  onMenu: () => void;
}

export function VkMobileMessages({
  messenger,
  viewerId,
  onMenu,
}: VkMobileMessagesProps) {
  const { dialogs, openId, close } = messenger;
  const active = dialogs.find((item) => item.conversationId === openId);

  if (openId) {
    return (
      <VkMobileScreen
        title={active ? fullName(active.other) : "Переписка"}
        left={{ glyph: "back", label: "К диалогам", onClick: close }}
      >
        <VkMobileChat messenger={messenger} viewerId={viewerId} />
      </VkMobileScreen>
    );
  }

  return (
    <VkMobileScreen
      title="Сообщения"
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
    >
      <VkMobileDialogs messenger={messenger} viewerId={viewerId} />
    </VkMobileScreen>
  );
}
