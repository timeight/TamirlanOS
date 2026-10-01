"use client";

import { useState } from "react";
import { searchProfiles } from "@/core/vk/api/profiles";
import { fullName, type VkProfileRow } from "@/core/vk/vk-types";

interface VkMobileSearchProps {
  onOpenProfile: (profileId: string) => void;
}

export function VkMobileSearch({ onOpenProfile }: VkMobileSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<readonly VkProfileRow[]>([]);
  const [searched, setSearched] = useState(false);

  const run = async () => {
    setResults(await searchProfiles(query));
    setSearched(true);
  };

  return (
    <section>
      <h2 className="border-y border-[#dde3e8] bg-[#f0f3f6] px-3 py-1.5 text-[12px] font-bold text-[#45688e]">
        Поиск людей
      </h2>

      <form
        className="flex gap-1.5 px-3 py-2"
        onSubmit={(event) => {
          event.preventDefault();
          void run();
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Имя или фамилия"
          aria-label="Поиск людей"
          className="min-w-0 flex-1 border border-[#c0cad5] px-2 py-1.5 text-[13px] outline-none focus:border-[#7196bd]"
        />
        <button
          type="submit"
          className="shrink-0 border border-[#b2bdc8] bg-[#edf1f5] px-4 py-1.5 text-[13px] text-[#2b587a]"
        >
          Найти
        </button>
      </form>

      {searched && results.length === 0 && (
        <p className="px-3 pb-3 text-[12px] text-[#939393]">
          Ничего не найдено. Введите хотя бы два знака.
        </p>
      )}

      <ul>
        {results.map((profile) => (
          <li key={profile.id} className="border-b border-[#dde3e8]">
            <button
              type="button"
              onClick={() => onOpenProfile(profile.id)}
              className="block w-full px-3 py-2.5 text-left"
            >
              <span className="block text-[13px] font-bold text-[#2b587a]">
                {fullName(profile)}
              </span>
              <span className="block text-[11px] text-[#939393]">
                vk.com/{profile.username}
                {profile.city ? ` · ${profile.city}` : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
