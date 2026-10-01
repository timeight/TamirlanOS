"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { searchProfiles } from "@/core/vk/api/profiles";
import { fullName, type VkProfileRow } from "@/core/vk/vk-types";

interface VkSearchProps {
  onOpenProfile: (profileId: string) => void;
}

export function VkSearch({ onOpenProfile }: VkSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<readonly VkProfileRow[]>([]);
  const [searched, setSearched] = useState(false);

  const run = async () => {
    setResults(await searchProfiles(query));
    setSearched(true);
  };

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
        <button
          type="submit"
          className="border border-[#b2bdc8] bg-[#edf1f5] px-3 py-[3px] text-[11px] text-[#2b587a] hover:bg-[#e2e8ee]"
        >
          Найти
        </button>
      </form>

      {searched && results.length === 0 && (
        <p className="mt-4 text-[11px] text-[#939393]">
          Ничего не найдено. Введите хотя бы два знака.
        </p>
      )}

      <ul className="mt-3">
        {results.map((profile) => (
          <li
            key={profile.id}
            className="flex items-center gap-2.5 border-b border-[#e3e8ec] py-2"
          >
            <button type="button" onClick={() => onOpenProfile(profile.id)}>
              <VkAvatar size={40} src={profile.avatar_url} />
            </button>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onOpenProfile(profile.id)}
                className="text-[12px] font-bold text-[#2b587a] hover:underline"
              >
                {fullName(profile)}
              </button>
              <p className="text-[10px] text-[#939393]">
                vk.com/{profile.username}
                {profile.city ? ` · ${profile.city}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
