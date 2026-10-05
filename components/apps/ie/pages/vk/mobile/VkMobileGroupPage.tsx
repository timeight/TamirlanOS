"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileGroupLabel } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupLabel";
import { VkMobileGroupManage } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupManage";
import { VkMobileGroupAudio } from "@/components/apps/ie/pages/vk/mobile/VkMobileGroupAudio";
import { VkMobilePost } from "@/components/apps/ie/pages/vk/mobile/VkMobilePost";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { createGroupPost } from "@/core/vk/api/posts";
import { useVkGroup } from "@/hooks/use-vk-group";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMobileGroupPageProps {
  groupId: string;
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
  onBack: () => void;
}

export function VkMobileGroupPage({
  groupId,
  viewerId,
  onOpenProfile,
  onBack,
}: VkMobileGroupPageProps) {
  const state = useVkGroup(groupId, viewerId);
  const [draft, setDraft] = useState("");
  const [manage, setManage] = useState(false);
  const canManage = state.role === "owner" || state.role === "admin";

  return (
    <VkMobileScreen
      title={state.group?.name ?? "Сообщество"}
      left={{ glyph: "back", label: "К списку групп", onClick: onBack }}
      right={
        canManage
          ? {
              glyph: "settings",
              label: "Управление",
              onClick: () => setManage(!manage),
            }
          : undefined
      }
    >
      {state.loading ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          {VK_TEXT.loading}
        </p>
      ) : !state.group ? (
        <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
          Сообщество не найдено.
        </p>
      ) : (
        <>
          <div className="flex items-start border-b border-[#d5d9de] bg-[linear-gradient(#fbfcfd,#f1f4f6)] px-[10px] py-2">
            <span className="block border border-[#c6ced6] bg-white p-px">
              <VkAvatar size={64} src={state.group.avatar_url} />
            </span>
            <div className="ml-2.5 min-w-0 flex-1">
              <h2 className="text-[15px] leading-[18px] font-bold break-words text-[#1a1a1a]">
                {state.group.name}
              </h2>
              <p className="text-[12px] text-[#8a8a8a]">
                участников: {state.members}
              </p>
              <div className="mt-1.5">
                {state.role === "owner" ? (
                  <span className="text-[12px] text-[#8a8a8a]">
                    Вы владелец
                  </span>
                ) : state.role ? (
                  <VkMobileButton
                    size="small"
                    tone="secondary"
                    disabled={state.busy}
                    onClick={() => void state.leave()}
                  >
                    Выйти
                  </VkMobileButton>
                ) : (
                  <VkMobileButton
                    size="small"
                    disabled={state.busy}
                    onClick={() => void state.join()}
                  >
                    Вступить
                  </VkMobileButton>
                )}
              </div>
            </div>
          </div>

          {state.group.description && (
            <p className="border-b border-[#d5d9de] px-[10px] py-2 text-[13px] leading-[18px] whitespace-pre-wrap text-[#333]">
              {state.group.description}
            </p>
          )}

          {state.error && (
            <p className="px-[10px] py-2 text-[13px] text-[#b63131]">
              {state.error}
            </p>
          )}

          {manage && (
            <VkMobileGroupManage
              group={state.group}
              state={state}
              onClosed={onBack}
            />
          )}

          <VkMobileGroupAudio
            groupId={groupId}
            viewerId={viewerId}
            canManage={canManage}
          />

          <VkMobileGroupLabel>Стена</VkMobileGroupLabel>

          {state.role && (
            <form
              className="border-b border-[#d5d9de] px-[10px] py-2"
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
                className="w-full resize-none rounded-[3px] border border-[#c2cad3] px-2 py-1.5 text-[13px] outline-none focus:border-[#5181b8]"
              />
              <VkMobileButton type="submit" className="mt-1.5 w-full">
                Отправить
              </VkMobileButton>
            </form>
          )}

          {state.posts.length === 0 ? (
            <p className="px-[10px] py-4 text-[13px] text-[#9aa4ad]">
              Записей пока нет.
            </p>
          ) : (
            <ul>
              {state.posts.map((post) => (
                <VkMobilePost
                  key={post.id}
                  post={post}
                  viewerId={viewerId}
                  onChanged={state.reload}
                  onOpenProfile={onOpenProfile}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </VkMobileScreen>
  );
}
