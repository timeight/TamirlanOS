"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkField } from "@/components/apps/ie/pages/vk/VkField";
import type { VkGroupRow } from "@/core/vk/vk-types";
import { useVkGroups } from "@/hooks/use-vk-groups";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkGroupsProps {
  viewerId: string;
  onOpenGroup: (groupId: string) => void;
}

export function VkGroups({ viewerId, onOpenGroup }: VkGroupsProps) {
  const groups = useVkGroups(viewerId);
  const [making, setMaking] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");

  const submit = async () => {
    const id = await groups.create({ name, username, description: about });
    if (!id) return;
    setMaking(false);
    setName("");
    setUsername("");
    setAbout("");
    onOpenGroup(id);
  };

  const row = (group: VkGroupRow, note?: string) => (
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
          {note ? ` · ${note}` : ""}
        </p>
      </div>
    </li>
  );

  return (
    <div className="pt-3">
      <h1 className="mb-2 flex items-center gap-3 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Мои группы
        <VkButton
          tone="quiet"
          className="ml-auto"
          onClick={() => setMaking(!making)}
        >
          {making ? "Отменить" : "Создать сообщество"}
        </VkButton>
      </h1>

      {making && (
        <form
          className="mb-3 border-b border-[#dae1e8] pb-3"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <VkField label="Название:" value={name} onChange={setName} />
          <VkField
            label="Адрес:"
            value={username}
            onChange={setUsername}
            hint="Латиница, цифры и подчёркивание, 3–20 знаков."
          />
          <VkField label="Описание:" value={about} onChange={setAbout} />
          {groups.error && (
            <p className="ml-[120px] text-[11px] text-[#9b2c2c]">
              {groups.error}
            </p>
          )}
          <VkButton type="submit" disabled={groups.busy} className="ml-[120px]">
            Создать
          </VkButton>
        </form>
      )}

      {groups.loading ? (
        <p className="py-4 text-[11px] text-[#939393]">{VK_TEXT.loading}</p>
      ) : groups.mine.length === 0 ? (
        <p className="py-3 text-[11px] text-[#939393]">
          Вы пока ни в одном сообществе не состоите.
        </p>
      ) : (
        <ul>{groups.mine.map((group) => row(group))}</ul>
      )}

      <h2 className="mt-4 mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Поиск сообществ
      </h2>
      <form
        className="flex gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          void groups.search();
        }}
      >
        <input
          value={groups.query}
          onChange={(event) => groups.setQuery(event.target.value)}
          placeholder="Название или адрес"
          aria-label="Поиск сообществ"
          className="w-full max-w-[260px] min-w-0 border border-[#c0cad5] bg-white px-1.5 py-[3px] text-[11px] outline-none focus:border-[#7196bd]"
        />
        <VkButton type="submit" disabled={groups.busy}>
          Найти
        </VkButton>
      </form>

      {groups.searched && groups.found.length === 0 && (
        <p className="mt-3 text-[11px] text-[#939393]">Ничего не найдено.</p>
      )}
      {groups.found.length > 0 && (
        <ul className="mt-2">{groups.found.map((group) => row(group))}</ul>
      )}

      {groups.popular.length > 0 && (
        <>
          <h2 className="mt-4 mb-2 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
            Популярные
          </h2>
          <ul>
            {groups.popular.map((group) =>
              row(group, `${group.members} участников`),
            )}
          </ul>
        </>
      )}
    </div>
  );
}
