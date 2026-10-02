"use client";

import { useEffect, useState } from "react";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { cn } from "@/core/utils/cn";
import { VK_SECTION } from "@/core/vk/sections";
import { fullName } from "@/core/vk/vk-types";
import { useVkFriends } from "@/hooks/use-vk-friends";

interface VkMobileFriendsProps {
  ownerId: string;
  viewerId: string;
  ownerName: string;
  onOpenProfile: (profileId: string) => void;
  onWrite: (profileId: string) => void;
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
  onWrite,
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
        <div className="flex border-b border-[#d8dde2] bg-[#f2f4f6]">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "min-h-[40px] flex-1 border-b-2 text-[13px]",
                item.key === tab
                  ? "border-[#4a76a8] font-medium text-[#2a5885]"
                  : "border-transparent text-[#7a7a7a]",
              )}
            >
              {item.label}
              {item.count > 0 && ` ${item.count}`}
            </button>
          ))}
        </div>
      )}

      <ul className="border-b border-[#d8dde2]">
        <VkMobileRow
          title="Найти друзей"
          chevron
          onClick={() => onSection(VK_SECTION.search)}
        />
      </ul>

      {loading ? (
        <p className="px-3 py-5 text-[13px] text-[#95a0ab]">Загрузка...</p>
      ) : list.length === 0 ? (
        <p className="px-3 py-5 text-[13px] text-[#95a0ab]">
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
                ) : (
                  <VkMobileButton
                    size="small"
                    tone="secondary"
                    onClick={() => onWrite(profile.id)}
                  >
                    Написать
                  </VkMobileButton>
                )
              }
            />
          ))}
        </ul>
      )}
    </VkMobileScreen>
  );
}
