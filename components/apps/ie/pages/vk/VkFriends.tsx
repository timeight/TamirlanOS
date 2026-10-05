"use client";

import { useEffect, useState } from "react";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkPersonRow } from "@/components/apps/ie/pages/vk/VkPersonRow";
import { cn } from "@/core/utils/cn";
import { useVkFriends } from "@/hooks/use-vk-friends";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkFriendsProps {
  ownerId: string;
  viewerId: string;
  ownerName: string;
  onOpenProfile: (profileId: string) => void;
  onWrite: (profileId: string) => void;
  onCountersChanged: () => Promise<void>;
}

type Tab = "friends" | "incoming" | "outgoing";

export function VkFriends({
  ownerId,
  viewerId,
  ownerName,
  onOpenProfile,
  onWrite,
  onCountersChanged,
}: VkFriendsProps) {
  const { friends, incoming, outgoing, loading, accept, drop, markSeen } =
    useVkFriends(ownerId, viewerId, onCountersChanged);
  const [tab, setTab] = useState<Tab>("friends");
  const mine = ownerId === viewerId;

  // Счётчик гасит именно вкладка заявок: открытие списка друзей заявок не видит.
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
    <div className="pt-3">
      <h1 className="mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        {mine ? "Мои друзья" : `Друзья · ${ownerName}`}
      </h1>

      {mine && (
        <div className="mb-2 flex gap-3 text-[11px]">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                item.key === tab
                  ? "font-bold text-[#45688e]"
                  : "text-[#2b587a] hover:underline",
              )}
            >
              {item.label}
              {item.count > 0 && ` (${item.count})`}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="py-4 text-[11px] text-[#939393]">{VK_TEXT.loading}</p>
      ) : list.length === 0 ? (
        <p className="py-4 text-[11px] text-[#939393]">
          {tab === "incoming"
            ? "Новых заявок нет."
            : tab === "outgoing"
              ? "Вы никому не отправляли заявок."
              : "Список друзей пуст."}
        </p>
      ) : (
        <ul>
          {list.map((profile) => (
            <VkPersonRow
              key={profile.id}
              profile={profile}
              onOpenProfile={onOpenProfile}
              actions={
                <>
                  {tab === "incoming" && (
                    <>
                      <VkButton onClick={() => void accept(profile.id)}>
                        Принять
                      </VkButton>
                      <VkButton
                        tone="quiet"
                        onClick={() => void drop(profile.id)}
                      >
                        Отклонить
                      </VkButton>
                    </>
                  )}
                  {tab === "outgoing" && (
                    <VkButton
                      tone="quiet"
                      onClick={() => void drop(profile.id)}
                    >
                      Отменить
                    </VkButton>
                  )}
                  {tab === "friends" && profile.id !== viewerId && (
                    <VkButton onClick={() => onWrite(profile.id)}>
                      Написать
                    </VkButton>
                  )}
                  {tab === "friends" && mine && (
                    <VkButton
                      tone="quiet"
                      onClick={() => void drop(profile.id)}
                    >
                      Удалить
                    </VkButton>
                  )}
                </>
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
