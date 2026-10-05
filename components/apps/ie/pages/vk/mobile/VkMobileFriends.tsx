"use client";

import { useEffect, useState } from "react";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { cn } from "@/core/utils/cn";
import { VK_SECTION } from "@/core/vk/sections";
import { fullName } from "@/core/vk/vk-types";
import { useVkFriends } from "@/hooks/use-vk-friends";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMobileFriendsProps {
  ownerId: string;
  viewerId: string;
  ownerName: string;
  onOpenProfile: (profileId: string) => void;
  onSection: (section: string) => void;
  onCountersChanged: () => Promise<void>;
  onMenu: () => void;
}

type Tab = "friends" | "incoming" | "outgoing";

export function VkMobileFriends({
  ownerId,
  viewerId,
  ownerName,
  onOpenProfile,
  onSection,
  onCountersChanged,
  onMenu,
}: VkMobileFriendsProps) {
  const { friends, incoming, outgoing, loading, accept, drop, markSeen } =
    useVkFriends(ownerId, viewerId, onCountersChanged);
  const [tab, setTab] = useState<Tab>("friends");
  const mine = ownerId === viewerId;

  useEffect(() => {
    if (tab !== "incoming") return;
    void markSeen();
  }, [markSeen, tab]);

  const tabs: readonly { key: Tab; label: string; count: number }[] = [
    { key: "friends", label: "Друзья", count: friends.length },
    { key: "incoming", label: "Заявки", count: incoming.length },
    { key: "outgoing", label: "Исходящие", count: outgoing.length },
  ];

  const list =
    tab === "incoming" ? incoming : tab === "outgoing" ? outgoing : friends;

  return (
    <VkMobileScreen
      title={mine ? "Друзья" : ownerName}
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
      right={{
        glyph: "search",
        label: "Найти друзей",
        onClick: () => onSection(VK_SECTION.search),
      }}
    >
      {mine && (
        <div className="flex h-[33px] border-b border-[#d5d9de] bg-[#eceff1]">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "flex-1 border-b-2 text-[13px]",
                item.key === tab
                  ? "border-[#4a76a8] bg-white font-bold text-[#2a5885]"
                  : "border-transparent text-[#6d7883]",
              )}
            >
              {item.label}
              {item.count > 0 && ` ${item.count}`}
            </button>
          ))}
        </div>
      )}

      <ul>
        <VkMobileRow
          title="Найти друзей"
          chevron
          onClick={() => onSection(VK_SECTION.search)}
        />
      </ul>

      {loading ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.loading}
        </p>
      ) : list.length === 0 ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {tab === "incoming"
            ? "Новых заявок нет."
            : tab === "outgoing"
              ? "Вы никому не отправляли заявок."
              : "Список друзей пуст."}
        </p>
      ) : (
        <ul>
          {list.map((profile) => (
            <VkMobileRow
              key={profile.id}
              title={fullName(profile)}
              subtitle={profile.city}
              avatar={profile.avatar_url}
              chevron={tab === "friends"}
              onClick={
                tab === "friends" ? () => onOpenProfile(profile.id) : undefined
              }
              actions={
                tab === "incoming" ? (
                  <>
                    <VkMobileButton
                      size="small"
                      onClick={() => void accept(profile.id)}
                    >
                      Принять
                    </VkMobileButton>
                    <VkMobileButton
                      size="small"
                      tone="secondary"
                      onClick={() => void drop(profile.id)}
                    >
                      Отклонить
                    </VkMobileButton>
                  </>
                ) : tab === "outgoing" ? (
                  <VkMobileButton
                    size="small"
                    tone="secondary"
                    onClick={() => void drop(profile.id)}
                  >
                    Отменить заявку
                  </VkMobileButton>
                ) : undefined
              }
            />
          ))}
        </ul>
      )}
    </VkMobileScreen>
  );
}
