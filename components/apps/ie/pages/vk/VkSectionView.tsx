"use client";

import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkFriends } from "@/components/apps/ie/pages/vk/VkFriends";
import { VkMessages } from "@/components/apps/ie/pages/vk/VkMessages";
import { VkNotifications } from "@/components/apps/ie/pages/vk/VkNotifications";
import { VkPhotos } from "@/components/apps/ie/pages/vk/VkPhotos";
import { VkSearch } from "@/components/apps/ie/pages/vk/VkSearch";
import { VkSettings } from "@/components/apps/ie/pages/vk/VkSettings";
import { VK_SECTION } from "@/core/vk/sections";
import { fullName } from "@/core/vk/vk-types";
import type { VkApp } from "@/hooks/use-vk-app";

interface VkSectionViewProps {
  app: VkApp;
  userId: string;
}

/**
 * Разделы, кроме своей страницы: разметка списков одинакова на обеих
 * оболочках, поэтому держать две копии было бы прямым дублированием.
 */
export function VkSectionView({ app, userId }: VkSectionViewProps) {
  const { section, setSection, openProfile, write, me, shown, messenger } = app;
  const owner = shown ?? me;

  if (section === VK_SECTION.search) {
    return (
      <VkSearch
        viewerId={userId}
        onOpenProfile={openProfile}
        onWrite={(id) => void write(id)}
      />
    );
  }

  if (section === VK_SECTION.friends && owner) {
    return (
      <VkFriends
        ownerId={owner.id}
        viewerId={userId}
        ownerName={fullName(owner)}
        onOpenProfile={openProfile}
        onWrite={(id) => void write(id)}
      />
    );
  }

  if (section === VK_SECTION.photos && owner) {
    return (
      <VkPhotos
        ownerId={owner.id}
        viewerId={userId}
        ownerName={fullName(owner)}
      />
    );
  }

  if (section === VK_SECTION.messages) {
    return <VkMessages messenger={messenger} viewerId={userId} />;
  }

  if (section === VK_SECTION.answers) {
    return <VkNotifications onOpenProfile={openProfile} />;
  }

  if (section === VK_SECTION.settings && me) {
    return (
      <VkSettings
        me={me}
        onEditProfile={() => setSection(VK_SECTION.profile)}
      />
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-[13px] font-bold text-[#2b587a]">{section}</h1>
      <p className="mt-2 text-[11px] text-[#777]">
        Этот раздел не реализован: за ним нет таблицы в базе.
      </p>
      <VkButton
        tone="quiet"
        className="mt-2 px-0"
        onClick={() => setSection(VK_SECTION.profile)}
      >
        Вернуться на мою страницу
      </VkButton>
    </div>
  );
}
