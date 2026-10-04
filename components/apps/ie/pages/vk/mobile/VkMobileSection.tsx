"use client";

import { VkMobileFeed } from "@/components/apps/ie/pages/vk/mobile/VkMobileFeed";
import { VkMobileFriends } from "@/components/apps/ie/pages/vk/mobile/VkMobileFriends";
import { VkMobileMessages } from "@/components/apps/ie/pages/vk/mobile/VkMobileMessages";
import { VkMobileNotifications } from "@/components/apps/ie/pages/vk/mobile/VkMobileNotifications";
import { VkMobilePhotos } from "@/components/apps/ie/pages/vk/mobile/VkMobilePhotos";
import { VkMobileProfile } from "@/components/apps/ie/pages/vk/mobile/VkMobileProfile";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { VkMobileSearch } from "@/components/apps/ie/pages/vk/mobile/VkMobileSearch";
import { VkMobileSettings } from "@/components/apps/ie/pages/vk/mobile/VkMobileSettings";
import { VkMobileWall } from "@/components/apps/ie/pages/vk/mobile/VkMobileWall";
import { VK_SECTION } from "@/core/vk/sections";
import { fullName } from "@/core/vk/vk-types";
import type { VkApp } from "@/hooks/use-vk-app";

interface VkMobileSectionProps {
  app: VkApp;
  userId: string;
  onMenu: () => void;
}

export function VkMobileSection({ app, userId, onMenu }: VkMobileSectionProps) {
  const {
    section,
    setSection,
    openProfile,
    write,
    me,
    shown,
    messenger,
    refreshCounters,
  } = app;
  const owner = shown ?? me;
  const menu = {
    glyph: "menu",
    label: "Открыть меню",
    onClick: onMenu,
  } as const;

  if (section === VK_SECTION.profile && owner) {
    const mine = owner.id === userId;
    return (
      <VkMobileScreen
        title={owner.first_name}
        left={
          mine
            ? menu
            : {
                glyph: "back",
                label: "На мою страницу",
                onClick: () => void openProfile(userId),
              }
        }
        right={
          mine
            ? {
                glyph: "settings",
                label: "Настройки",
                onClick: () => setSection(VK_SECTION.settings),
              }
            : undefined
        }
      >
        <VkMobileProfile
          profile={owner}
          isMe={mine}
          viewerId={userId}
          onWrite={(id) => void write(id)}
          onSection={setSection}
        />
        <VkMobileWall
          ownerId={owner.id}
          viewerId={userId}
          onOpenProfile={openProfile}
          focusPostId={app.focusPostId}
        />
      </VkMobileScreen>
    );
  }

  if (section === VK_SECTION.news) {
    return (
      <VkMobileFeed
        viewerId={userId}
        onOpenProfile={openProfile}
        onMenu={onMenu}
      />
    );
  }

  if (section === VK_SECTION.friends && owner) {
    return (
      <VkMobileFriends
        ownerId={owner.id}
        viewerId={userId}
        ownerName={fullName(owner)}
        onOpenProfile={openProfile}
        onSection={setSection}
        onCountersChanged={refreshCounters}
        onMenu={onMenu}
      />
    );
  }

  if (section === VK_SECTION.photos && owner) {
    return (
      <VkMobilePhotos
        ownerId={owner.id}
        viewerId={userId}
        ownerName={fullName(owner)}
        onMenu={onMenu}
      />
    );
  }

  if (section === VK_SECTION.messages) {
    return (
      <VkMobileMessages
        messenger={messenger}
        viewerId={userId}
        onMenu={onMenu}
      />
    );
  }

  if (section === VK_SECTION.answers) {
    return (
      <VkMobileNotifications
        onOpenProfile={openProfile}
        onOpenPost={(id) => void app.openPost(id)}
        onCountersChanged={refreshCounters}
        onMenu={onMenu}
      />
    );
  }

  if (section === VK_SECTION.search) {
    return (
      <VkMobileSearch
        viewerId={userId}
        onOpenProfile={openProfile}
        onWrite={(id) => void write(id)}
        onMenu={onMenu}
      />
    );
  }

  if (section === VK_SECTION.settings && me) {
    return <VkMobileSettings me={me} onMenu={onMenu} />;
  }

  return (
    <VkMobileScreen title={section} left={menu}>
      <p className="px-[10px] py-6 text-[13px] text-[#8a8a8a]">
        Этот раздел не реализован: за ним нет таблицы в базе.
      </p>
    </VkMobileScreen>
  );
}
