"use client";

import { useState } from "react";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileField } from "@/components/apps/ie/pages/vk/mobile/VkMobileField";
import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { useVkGroups } from "@/hooks/use-vk-groups";

interface VkMobileGroupsProps {
  viewerId: string;
  onOpenGroup: (groupId: string) => void;
  onMenu: () => void;
}

export function VkMobileGroups({
  viewerId,
  onOpenGroup,
  onMenu,
}: VkMobileGroupsProps) {
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

  return (
    <VkMobileScreen
      title="Группы"
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
      right={{
        glyph: making ? "close" : "plus",
        label: making ? "Отменить" : "Создать сообщество",
        onClick: () => setMaking(!making),
      }}
    >
      {making && (
        <form
          className="border-b border-[#d5d9de] px-[10px] py-2.5"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <VkMobileField label="Название" value={name} onChange={setName} />
          <VkMobileField
            label="Адрес (латиница)"
            value={username}
            onChange={setUsername}
          />
          <VkMobileField label="Описание" value={about} onChange={setAbout} />
          {groups.error && (
            <p className="mb-2 text-[12px] text-[#b63131]">{groups.error}</p>
          )}
          <VkMobileButton
            type="submit"
            disabled={groups.busy}
            className="w-full"
          >
            Создать
          </VkMobileButton>
        </form>
      )}

      <form
        className="flex gap-2 border-b border-[#d5d9de] bg-[#eceff1] px-[10px] py-1.5"
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
          className="h-[28px] min-w-0 flex-1 rounded-[3px] border border-[#c2cad3] bg-white px-[7px] text-[13px] outline-none placeholder:text-[#a6adb4] focus:border-[#5181b8]"
        />
        <VkMobileButton type="submit" disabled={groups.busy}>
          Найти
        </VkMobileButton>
      </form>

      {groups.found.length > 0 && (
        <>
          <VkMobileGroupLabel>Найдено</VkMobileGroupLabel>
          <ul>
            {groups.found.map((group) => (
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
        </>
      )}
      {groups.searched && groups.found.length === 0 && (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          Ничего не найдено.
        </p>
      )}

      <VkMobileGroupLabel>Мои группы</VkMobileGroupLabel>
      {groups.loading ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">Загрузка...</p>
      ) : groups.mine.length === 0 ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          Вы пока ни в одном сообществе не состоите.
        </p>
      ) : (
        <ul>
          {groups.mine.map((group) => (
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

      {groups.popular.length > 0 && (
        <>
          <VkMobileGroupLabel>Популярные</VkMobileGroupLabel>
          <ul>
            {groups.popular.map((group) => (
              <VkMobileRow
                key={group.id}
                title={group.name}
                subtitle={`${group.members} участников`}
                avatar={group.avatar_url}
                chevron
                onClick={() => onOpenGroup(group.id)}
              />
            ))}
          </ul>
        </>
      )}
    </VkMobileScreen>
  );
}
