"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkGroupManage } from "@/components/apps/ie/pages/vk/VkGroupManage";
import { VkPost } from "@/components/apps/ie/pages/vk/VkPost";
import { createGroupPost } from "@/core/vk/api/posts";
import { useVkGroup } from "@/hooks/use-vk-group";

interface VkGroupPageProps {
  groupId: string;
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onLeaveGroup: () => void;
}

export function VkGroupPage({
  groupId,
  viewerId,
  onOpenProfile,
  onLeaveGroup,
}: VkGroupPageProps) {
  const state = useVkGroup(groupId, viewerId);
  const [draft, setDraft] = useState("");
  const [manage, setManage] = useState(false);
  const canManage = state.role === "owner" || state.role === "admin";

  if (state.loading) {
    return <p className="py-4 text-[11px] text-[#939393]">Загрузка...</p>;
  }
  if (!state.group) {
    return (
      <p className="py-4 text-[11px] text-[#939393]">Сообщество не найдено.</p>
    );
  }

  return (
    <div className="pt-3">
      <div className="flex gap-4">
        <div className="border border-[#dae1e8] p-1">
          <VkAvatar size={120} src={state.group.avatar_url} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[17px] leading-tight font-bold text-[#2b587a]">
            {state.group.name}
          </h1>
          <p className="mt-0.5 text-[11px] text-[#777]">
            vk.com/{state.group.username} · участников: {state.members}
          </p>
          {state.group.description && (
            <p className="mt-2 text-[11px] leading-[16px] whitespace-pre-wrap text-[#333]">
              {state.group.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {state.role ? (
              state.role === "owner" ? (
                <span className="text-[11px] text-[#777]">
                  Вы владелец сообщества
                </span>
              ) : (
                <VkButton
                  disabled={state.busy}
                  onClick={() => void state.leave()}
                >
                  Выйти из сообщества
                </VkButton>
              )
            ) : (
              <VkButton disabled={state.busy} onClick={() => void state.join()}>
                Вступить в сообщество
              </VkButton>
            )}
            {canManage && (
              <VkButton tone="quiet" onClick={() => setManage(!manage)}>
                {manage ? "Скрыть управление" : "Управление"}
              </VkButton>
            )}
            <VkButton tone="quiet" onClick={onLeaveGroup}>
              ← К списку групп
            </VkButton>
          </div>

          {state.error && (
            <p className="mt-2 text-[11px] text-[#9b2c2c]">{state.error}</p>
          )}
        </div>
      </div>

      {manage && state.group && (
        <VkGroupManage
          group={state.group}
          state={state}
          onClosed={onLeaveGroup}
        />
      )}

      <h2 className="mt-5 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Стена{" "}
        <span className="font-normal text-[#999]">{state.posts.length}</span>
      </h2>

      {state.role && (
        <form
          className="py-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const text = draft.trim();
            if (!text) return;
            setDraft("");
            await createGroupPost(viewerId, groupId, text);
            await state.reload();
          }}
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Написать в сообщество"
            rows={2}
            aria-label="Новая запись сообщества"
            className="w-full resize-none border border-[#c0cad5] bg-white px-2 py-1.5 text-[12px] leading-[17px] outline-none focus:border-[#7196bd]"
          />
          <VkButton type="submit" className="mt-1">
            Отправить
          </VkButton>
        </form>
      )}

      {state.posts.length === 0 ? (
        <p className="border-t border-[#dae1e8] py-4 text-[11px] text-[#939393]">
          Записей пока нет.
        </p>
      ) : (
        <ul className="border-t border-[#dae1e8]">
          {state.posts.map((post) => (
            <VkPost
              key={post.id}
              post={post}
              viewerId={viewerId}
              onChanged={state.reload}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
