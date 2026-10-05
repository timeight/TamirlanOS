"use client";

import { useRef } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { VkPost } from "@/components/apps/ie/pages/vk/VkPost";
import { useVkWall } from "@/hooks/use-vk-wall";
import { useWallComposer } from "@/hooks/use-wall-composer";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkWallProps {
  ownerId: string;
  viewerId: string;
  viewerAvatar: string | null;
  onOpenProfile: (profileId: string) => void;
  /** Запись из уведомления: к ней прокручиваем и подсвечиваем. */
  focusPostId?: string | null;
}

export function VkWall({
  ownerId,
  viewerId,
  viewerAvatar,
  onOpenProfile,
  focusPostId,
}: VkWallProps) {
  const { posts, loading, reload } = useVkWall(ownerId, viewerId);
  const composer = useWallComposer(ownerId, viewerId, reload);
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-5">
      <h2 className="border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Стена <span className="font-normal text-[#999]">{posts.length}</span>
      </h2>

      <form
        className="flex gap-2 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          void composer.send();
        }}
      >
        <VkAvatar size={50} src={viewerAvatar} />
        <div className="min-w-0 flex-1">
          <textarea
            value={composer.draft}
            onChange={(event) => composer.setDraft(event.target.value)}
            placeholder={
              ownerId === viewerId ? "Что у Вас нового?" : "Написать на стене"
            }
            rows={2}
            aria-label="Новая запись"
            className="w-full resize-none border border-[#c0cad5] bg-white px-2 py-1.5 text-[12px] leading-[17px] outline-none focus:border-[#7196bd]"
          />

          {composer.attachedUrl && (
            <div className="mt-1 flex items-start gap-2">
              <span className="relative block h-[70px] w-[70px] overflow-hidden border border-[#c5cdd5]">
                <AssetImage
                  src={composer.attachedUrl}
                  alt="Вложение"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </span>
              <VkButton tone="quiet" onClick={composer.detach}>
                убрать
              </VkButton>
            </div>
          )}

          {composer.error && (
            <p className="mt-1 text-[11px] text-[#9b2c2c]">{composer.error}</p>
          )}

          <div className="mt-1 flex items-center gap-2">
            <VkButton
              type="submit"
              disabled={composer.busy || !composer.canSend}
            >
              Отправить
            </VkButton>
            <VkButton
              tone="quiet"
              disabled={composer.busy}
              onClick={() => input.current?.click()}
            >
              Прикрепить фотографию
            </VkButton>
          </div>

          <input
            ref={input}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void composer.attach(file);
            }}
          />
        </div>
      </form>

      {loading ? (
        <p className="border-t border-[#dae1e8] py-4 text-[11px] text-[#939393]">
          {VK_TEXT.loading}
        </p>
      ) : posts.length === 0 ? (
        <p className="border-t border-[#dae1e8] py-4 text-[11px] text-[#939393]">
          Записей пока нет.
        </p>
      ) : (
        <ul className="border-t border-[#dae1e8]">
          {posts.map((post) => (
            <VkPost
              key={post.id}
              post={post}
              viewerId={viewerId}
              onChanged={reload}
              onOpenProfile={onOpenProfile}
              focused={post.id === focusPostId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
