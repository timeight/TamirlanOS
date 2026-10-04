"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkField } from "@/components/apps/ie/pages/vk/VkField";
import {
  deleteGroup,
  leaveGroup,
  setMemberRole,
  updateGroup,
} from "@/core/vk/api/groups";
import { fullName, type VkGroupRow } from "@/core/vk/vk-types";
import type { VkGroup } from "@/hooks/use-vk-group";

interface VkGroupManageProps {
  group: VkGroupRow;
  state: VkGroup;
  onClosed: () => void;
}

const CONFIRM = "УДАЛИТЬ";

export function VkGroupManage({ group, state, onClosed }: VkGroupManageProps) {
  const [name, setName] = useState(group.name);
  const [about, setAbout] = useState(group.description ?? "");
  const [word, setWord] = useState("");
  const [error, setError] = useState<string | null>(null);
  const owner = state.role === "owner";

  const run = async (action: Promise<string | null>) => {
    const message = await action;
    setError(message);
    if (!message) await state.reload();
  };

  return (
    <div className="mt-4 border-t border-[#dae1e8] pt-3 text-[11px]">
      <p className="mb-2 font-bold text-[#45688e]">Управление сообществом</p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void run(updateGroup(group.id, { name, description: about || null }));
        }}
      >
        <VkField label="Название:" value={name} onChange={setName} />
        <VkField label="Описание:" value={about} onChange={setAbout} />
        <VkButton type="submit" className="ml-[120px]">
          Сохранить
        </VkButton>
      </form>

      <p className="mt-3 mb-1 font-bold text-[#45688e]">Участники</p>
      <ul>
        {state.memberList.map((member) => (
          <li
            key={member.profile.id}
            className="flex items-center gap-2 border-b border-[#e3e8ec] py-1.5"
          >
            <VkAvatar size={28} src={member.profile.avatar_url} />
            <span className="min-w-0 flex-1 truncate text-[#333]">
              {fullName(member.profile)}
              <span className="ml-2 text-[#939393]">
                {member.role === "owner"
                  ? "владелец"
                  : member.role === "admin"
                    ? "администратор"
                    : "участник"}
              </span>
            </span>
            {owner && member.role === "member" && (
              <VkButton
                tone="quiet"
                onClick={() =>
                  void run(setMemberRole(group.id, member.profile.id, "admin"))
                }
              >
                Назначить админом
              </VkButton>
            )}
            {owner && member.role === "admin" && (
              <VkButton
                tone="quiet"
                onClick={() =>
                  void run(setMemberRole(group.id, member.profile.id, "member"))
                }
              >
                Снять админа
              </VkButton>
            )}
            {member.role !== "owner" && (
              <VkButton
                tone="quiet"
                onClick={() =>
                  void run(leaveGroup(group.id, member.profile.id))
                }
              >
                Исключить
              </VkButton>
            )}
          </li>
        ))}
      </ul>

      {error && <p className="mt-2 text-[#9b2c2c]">{error}</p>}

      {owner && (
        <form
          className="mt-4 border-t border-[#dae1e8] pt-2"
          onSubmit={async (event) => {
            event.preventDefault();
            if (word !== CONFIRM) return;
            const message = await deleteGroup(group.id);
            if (message) setError(message);
            else onClosed();
          }}
        >
          <p className="text-[#777]">
            Удаление сообщества уносит все его записи и комментарии. Введите{" "}
            <span className="font-bold text-[#9b2c2c]">{CONFIRM}</span>.
          </p>
          <input
            value={word}
            onChange={(event) => setWord(event.target.value)}
            aria-label="Подтверждение удаления сообщества"
            className="mt-1 w-[160px] border border-[#c0cad5] px-1.5 py-[3px] text-[11px] outline-none focus:border-[#7196bd]"
          />
          <VkButton type="submit" disabled={word !== CONFIRM} className="ml-2">
            Удалить сообщество
          </VkButton>
        </form>
      )}
    </div>
  );
}
