"use client";

import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { FRIEND_ACTION } from "@/core/vk/social-types";
import { fullName } from "@/core/vk/vk-types";
import { useVkPeopleSearch } from "@/hooks/use-vk-people-search";

interface VkMobileSearchProps {
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onWrite: (profileId: string) => void;
  onMenu: () => void;
}

export function VkMobileSearch({
  viewerId,
  onOpenProfile,
  onWrite,
  onMenu,
}: VkMobileSearchProps) {
  const { query, setQuery, results, states, searched, busy, run, act } =
    useVkPeopleSearch(viewerId);

  return (
    <VkMobileScreen
      title="Поиск людей"
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
    >
      <form
        className="flex gap-2 border-b border-[#d8dde2] bg-[#f2f4f6] px-3 py-2"
        onSubmit={(event) => {
          event.preventDefault();
          void run();
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Имя, фамилия или адрес"
          aria-label="Поиск людей"
          className="min-w-0 flex-1 rounded-[3px] border border-[#ccd4dd] bg-white px-2.5 py-2 text-[14px] outline-none focus:border-[#5181b8]"
        />
        <VkMobileButton type="submit" disabled={busy}>
          Найти
        </VkMobileButton>
      </form>

      {searched && results.length === 0 && (
        <p className="px-3 py-5 text-[13px] text-[#95a0ab]">
          Ничего не найдено. Введите хотя бы два знака.
        </p>
      )}

      <ul>
        {results.map((profile) => (
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
                    onClick={() => void act(profile.id)}
                  >
                    {FRIEND_ACTION[states[profile.id] ?? "none"]}
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
    </VkMobileScreen>
  );
}
