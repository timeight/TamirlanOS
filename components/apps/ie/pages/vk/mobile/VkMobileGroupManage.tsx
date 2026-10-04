"use client";

import { useState } from "react";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileField } from "@/components/apps/ie/pages/vk/mobile/VkMobileField";
import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
import { VkMobileRow } from "@/components/apps/ie/pages/vk/mobile/VkMobileRow";
import {
  deleteGroup,
  leaveGroup,
  setMemberRole,
  updateGroup,
} from "@/core/vk/api/groups";
import { fullName, type VkGroupRow } from "@/core/vk/vk-types";
import type { VkGroup } from "@/hooks/use-vk-group";

interface VkMobileGroupManageProps {
  group: VkGroupRow;
  state: VkGroup;
  onClosed: () => void;
}

const CONFIRM = "УДАЛИТЬ";

export function VkMobileGroupManage({
  group,
  state,
  onClosed,
}: VkMobileGroupManageProps) {
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
    <>
      <VkMobileGroupLabel>Управление</VkMobileGroupLabel>

      <form
        className="border-b border-[#d5d9de] px-[10px] py-2.5"
        onSubmit={(event) => {
          event.preventDefault();
          void run(updateGroup(group.id, { name, description: about || null }));
        }}
      >
        <VkMobileField label="Название" value={name} onChange={setName} />
        <VkMobileField label="Описание" value={about} onChange={setAbout} />
        <VkMobileButton type="submit" className="w-full">
          Сохранить
        </VkMobileButton>
      </form>

      <ul>
        {state.memberList.map((member) => (
          <VkMobileRow
            key={member.profile.id}
            title={fullName(member.profile)}
            subtitle={
              member.role === "owner"
                ? "владелец"
                : member.role === "admin"
                  ? "администратор"
                  : "участник"
            }
            avatar={member.profile.avatar_url}
            actions={
              member.role === "owner" ? undefined : (
                <>
                  {owner && (
                    <VkMobileButton
                      size="small"
                      tone="secondary"
                      onClick={() =>
                        void run(
                          setMemberRole(
                            group.id,
                            member.profile.id,
                            member.role === "admin" ? "member" : "admin",
                          ),
                        )
                      }
                    >
                      {member.role === "admin"
                        ? "Снять админа"
                        : "Сделать админом"}
                    </VkMobileButton>
                  )}
                  <VkMobileButton
                    size="small"
                    tone="secondary"
                    onClick={() =>
                      void run(leaveGroup(group.id, member.profile.id))
                    }
                  >
                    Исключить
                  </VkMobileButton>
                </>
              )
            }
          />
        ))}
      </ul>

      {error && (
        <p className="px-[10px] py-2 text-[13px] text-[#b63131]">{error}</p>
      )}

      {owner && (
        <form
          className="border-t border-[#d5d9de] px-[10px] py-2.5"
          onSubmit={async (event) => {
            event.preventDefault();
            if (word !== CONFIRM) return;
            const message = await deleteGroup(group.id);
            if (message) setError(message);
            else onClosed();
          }}
        >
          <p className="mb-1.5 text-[12px] text-[#8a8a8a]">
            Удаление уносит все записи сообщества. Введите{" "}
            <span className="font-bold text-[#b63131]">{CONFIRM}</span>.
          </p>
          <input
            value={word}
            onChange={(event) => setWord(event.target.value)}
            aria-label="Подтверждение удаления сообщества"
            className="mb-2 h-[29px] w-full rounded-[3px] border border-[#c2cad3] px-[7px] text-[13px] outline-none focus:border-[#5181b8]"
          />
          <VkMobileButton
            type="submit"
            disabled={word !== CONFIRM}
            className="w-full"
          >
            Удалить сообщество
          </VkMobileButton>
        </form>
      )}
    </>
  );
}
