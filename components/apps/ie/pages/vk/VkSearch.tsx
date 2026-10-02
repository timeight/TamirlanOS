"use client";

import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkPersonRow } from "@/components/apps/ie/pages/vk/VkPersonRow";
import { FRIEND_ACTION } from "@/core/vk/social-types";
import { useVkPeopleSearch } from "@/hooks/use-vk-people-search";

interface VkSearchProps {
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onWrite: (profileId: string) => void;
}

export function VkSearch({ viewerId, onOpenProfile, onWrite }: VkSearchProps) {
  const { query, setQuery, results, states, searched, busy, run, act } =
    useVkPeopleSearch(viewerId);

  return (
    <div className="pt-3">
      <h1 className="mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Поиск людей
      </h1>

      <form
        className="flex gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          void run();
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Имя, фамилия или адрес страницы"
          aria-label="Поиск людей"
          className="w-full max-w-[260px] min-w-0 border border-[#c0cad5] bg-white px-1.5 py-[3px] text-[11px] outline-none focus:border-[#7196bd]"
        />
        <VkButton type="submit" disabled={busy}>
          Найти
        </VkButton>
      </form>

      {searched && results.length === 0 && (
        <p className="mt-4 text-[11px] text-[#939393]">
          Ничего не найдено. Введите хотя бы два знака.
        </p>
      )}

      <ul className="mt-3">
        {results.map((profile) => (
          <VkPersonRow
            key={profile.id}
            profile={profile}
            onOpenProfile={onOpenProfile}
            note={profile.id === viewerId ? "это Вы" : undefined}
            actions={
              profile.id === viewerId ? null : (
                <>
                  <VkButton onClick={() => void act(profile.id)}>
                    {FRIEND_ACTION[states[profile.id] ?? "none"]}
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
    </div>
  );
}
