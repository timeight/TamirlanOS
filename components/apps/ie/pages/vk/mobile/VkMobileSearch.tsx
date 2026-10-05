"use client";

import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { VkMobileTrackList } from "@/components/apps/ie/pages/vk/mobile/VkMobileTrackList";
import { cn } from "@/core/utils/cn";
import { FRIEND_ACTION } from "@/core/vk/social-types";
import { VK_TEXT } from "@/core/vk/ui-text";
import { fullName } from "@/core/vk/vk-types";
import { SEARCH_TABS, useVkSearch } from "@/hooks/use-vk-search";

interface VkMobileSearchProps {
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onWrite: (profileId: string) => void;
  onOpenGroup: (groupId: string) => void;
  onMenu: () => void;
}

export function VkMobileSearch({
  viewerId,
  onOpenProfile,
  onWrite,
  onOpenGroup,
  onMenu,
}: VkMobileSearchProps) {
  const search = useVkSearch(viewerId);
  const counts = {
    people: search.people.length,
    groups: search.groups.length,
    audio: search.tracks.length,
  };

  return (
    <VkMobileScreen
      title="Поиск"
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
    >
      <form
        className="flex gap-2 border-b border-[#d5d9de] bg-[#eceff1] px-[10px] py-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          void search.run();
        }}
      >
        <input
          value={search.query}
          onChange={(event) => search.setQuery(event.target.value)}
          placeholder="Люди, сообщества, аудио"
          aria-label="Поиск"
          className="h-[28px] min-w-0 flex-1 rounded-[3px] border border-[#c2cad3] bg-white px-[7px] text-[13px] outline-none placeholder:text-[#a6adb4] focus:border-[#5181b8]"
        />
        <VkMobileButton type="submit" disabled={search.busy}>
          Найти
        </VkMobileButton>
      </form>

      <div className="flex h-[33px] border-b border-[#d5d9de] bg-[#eceff1]">
        {SEARCH_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => search.setScope(tab.key)}
            className={cn(
              "flex-1 border-b-2 text-[13px]",
              tab.key === search.scope
                ? "border-[#4a76a8] bg-white font-bold text-[#2a5885]"
                : "border-transparent text-[#6d7883]",
            )}
          >
            {tab.label}
            {search.searched && counts[tab.key] > 0 && ` ${counts[tab.key]}`}
          </button>
        ))}
      </div>

      {search.error && (
        <p className="px-[10px] py-3 text-[13px] text-[#b63131]">
          {search.error}{" "}
          <button
            type="button"
            onClick={() => void search.run()}
            className="text-[#2a5885]"
          >
            {VK_TEXT.retry}
          </button>
        </p>
      )}

      {search.busy && (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.loading}
        </p>
      )}

      {!search.busy && search.searched && counts[search.scope] === 0 && (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.notFound} {VK_TEXT.shortQuery}
        </p>
      )}

      {search.scope === "people" && (
        <ul>
          {search.people.map((profile) => (
            <VkMobileRow
              key={profile.id}
              title={fullName(profile)}
              subtitle={profile.city ?? `vk.com/${profile.username}`}
              avatar={profile.avatar_url}
              chevron
              onClick={() => onOpenProfile(profile.id)}
              actions={
                profile.id === viewerId ? undefined : (
                  <>
                    <VkMobileButton
                      size="small"
                      onClick={() => void search.act(profile.id)}
                    >
                      {FRIEND_ACTION[search.states[profile.id] ?? "none"]}
                    </VkMobileButton>
                    <VkMobileButton
                      size="small"
                      tone="secondary"
                      onClick={() => onWrite(profile.id)}
                    >
                      Написать
                    </VkMobileButton>
                  </>
                )
              }
            />
          ))}
        </ul>
      )}

      {search.scope === "groups" && (
        <ul>
          {search.groups.map((group) => (
            <VkMobileRow
              key={group.id}
              title={group.name}
              subtitle={`vk.com/${group.username}`}
              avatar={group.avatar_url}
              chevron
              onClick={() => onOpenGroup(group.id)}
            />
          ))}
        </ul>
      )}

      {search.scope === "audio" && search.tracks.length > 0 && (
        <VkMobileTrackList tracks={search.tracks} viewerId={viewerId} />
      )}
    </VkMobileScreen>
  );
}
