"use client";

import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkPersonRow } from "@/components/apps/ie/pages/vk/VkPersonRow";
import { VkTrackList } from "@/components/apps/ie/pages/vk/VkTrackList";
import { cn } from "@/core/utils/cn";
import { FRIEND_ACTION } from "@/core/vk/social-types";
import { VK_TEXT } from "@/core/vk/ui-text";
import { SEARCH_TABS, useVkSearch } from "@/hooks/use-vk-search";

interface VkSearchProps {
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onWrite: (profileId: string) => void;
  onOpenGroup: (groupId: string) => void;
}

export function VkSearch({
  viewerId,
  onOpenProfile,
  onWrite,
  onOpenGroup,
}: VkSearchProps) {
  const search = useVkSearch(viewerId);
  const counts = {
    people: search.people.length,
    groups: search.groups.length,
    audio: search.tracks.length,
  };

  return (
    <div className="pt-3">
      <h1 className="mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Поиск
      </h1>

      <form
        className="flex gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          void search.run();
        }}
      >
        <input
          value={search.query}
          onChange={(event) => search.setQuery(event.target.value)}
          placeholder="Люди, сообщества, аудиозаписи"
          aria-label="Поиск"
          className="w-full max-w-[300px] min-w-0 border border-[#c0cad5] bg-white px-1.5 py-[3px] text-[11px] outline-none focus:border-[#7196bd]"
        />
        <VkButton type="submit" disabled={search.busy}>
          Найти
        </VkButton>
      </form>

      <div className="mt-2 flex gap-3 border-b border-[#dae1e8] pb-1 text-[11px]">
        {SEARCH_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => search.setScope(tab.key)}
            className={cn(
              tab.key === search.scope
                ? "font-bold text-[#45688e]"
                : "text-[#2b587a] hover:underline",
            )}
          >
            {tab.label}
            {search.searched && counts[tab.key] > 0 && ` (${counts[tab.key]})`}
          </button>
        ))}
      </div>

      {search.error && (
        <p className="py-3 text-[11px] text-[#9b2c2c]">
          {search.error}{" "}
          <button
            type="button"
            onClick={() => void search.run()}
            className="text-[#2b587a] hover:underline"
          >
            {VK_TEXT.retry}
          </button>
        </p>
      )}

      {search.busy && (
        <p className="py-4 text-[11px] text-[#939393]">{VK_TEXT.loading}</p>
      )}

      {!search.busy && search.searched && counts[search.scope] === 0 && (
        <p className="py-4 text-[11px] text-[#939393]">
          {VK_TEXT.notFound} {VK_TEXT.shortQuery}
        </p>
      )}

      {search.scope === "people" && (
        <ul className="mt-2">
          {search.people.map((profile) => (
            <VkPersonRow
              key={profile.id}
              profile={profile}
              onOpenProfile={onOpenProfile}
              note={profile.id === viewerId ? "это Вы" : undefined}
              actions={
                profile.id === viewerId ? null : (
                  <>
                    <VkButton onClick={() => void search.act(profile.id)}>
                      {FRIEND_ACTION[search.states[profile.id] ?? "none"]}
                    </VkButton>
                    <VkButton tone="quiet" onClick={() => onWrite(profile.id)}>
                      Написать
                    </VkButton>
                  </>
                )
              }
            />
          ))}
        </ul>
      )}

      {search.scope === "groups" && (
        <ul className="mt-2">
          {search.groups.map((group) => (
            <li
              key={group.id}
              className="flex items-center gap-2.5 border-b border-[#e3e8ec] py-2"
            >
              <button type="button" onClick={() => onOpenGroup(group.id)}>
                <VkAvatar size={40} src={group.avatar_url} />
              </button>
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onOpenGroup(group.id)}
                  className="block truncate text-[12px] font-bold text-[#2b587a] hover:underline"
                >
                  {group.name}
                </button>
                <p className="truncate text-[10px] text-[#939393]">
                  vk.com/{group.username}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {search.scope === "audio" && search.tracks.length > 0 && (
        <div className="mt-2">
          <VkTrackList tracks={search.tracks} viewerId={viewerId} />
        </div>
      )}
    </div>
  );
}
