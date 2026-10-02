"use client";

import { useRef } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkMobilePost } from "@/components/apps/ie/pages/vk/mobile/VkMobilePost";
import { useVkWall } from "@/hooks/use-vk-wall";
import { useWallComposer } from "@/hooks/use-wall-composer";

interface VkMobileWallProps {
  ownerId: string;
  viewerId: string;
  onOpenProfile: (profileId: string) => void;
}

export function VkMobileWall({
  ownerId,
  viewerId,
  onOpenProfile,
}: VkMobileWallProps) {
  const { posts, loading, reload } = useVkWall(ownerId, viewerId);
  const composer = useWallComposer(ownerId, viewerId, reload);
  const input = useRef<HTMLInputElement>(null);

  return (
    <section>
      <h2 className="border-y border-[#dde3e8] bg-[#f0f3f6] px-3 py-1.5 text-[12px] font-bold text-[#45688e]">
        Стена
      </h2>

      <form
        className="border-b border-[#dde3e8] px-3 py-2"
        onSubmit={(event) => {
          event.preventDefault();
          void composer.send();
        }}
      >
        <textarea
          value={composer.draft}
          onChange={(event) => composer.setDraft(event.target.value)}
          placeholder={
            ownerId === viewerId ? "Что у Вас нового?" : "Написать на стене"
          }
          rows={2}
          aria-label="Новая запись"
          className="w-full resize-none border border-[#c0cad5] px-2 py-1.5 text-[13px] leading-[18px] outline-none focus:border-[#7196bd]"
        />

        {composer.attachedUrl && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="relative block h-[64px] w-[64px] overflow-hidden border border-[#c5cdd5]">
              <AssetImage
                src={composer.attachedUrl}
                alt="Вложение"
                fill
                unoptimized
                className="object-cover"
              />
            </span>
            <button
              type="button"
              onClick={composer.detach}
              className="min-h-[44px] text-[13px] text-[#2b587a]"
            >
              убрать
            </button>
          </div>
        )}

        {composer.error && (
          <p className="mt-1 text-[12px] text-[#9b2c2c]">{composer.error}</p>
        )}

        <div className="mt-1.5 flex gap-1.5">
          <button
            type="submit"
            disabled={composer.busy || !composer.canSend}
            className="min-h-[44px] flex-1 border border-[#b2bdc8] bg-[#edf1f5] text-[13px] text-[#2b587a] disabled:text-[#aaa]"
          >
            Отправить
          </button>
          <button
            type="button"
            disabled={composer.busy}
            onClick={() => input.current?.click()}
            className="min-h-[44px] shrink-0 border border-[#b2bdc8] bg-[#edf1f5] px-3 text-[13px] text-[#2b587a] disabled:text-[#aaa]"
          >
            Фото
          </button>
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
      </form>

      {loading ? (
        <p className="px-3 py-4 text-[12px] text-[#939393]">Загрузка...</p>
      ) : posts.length === 0 ? (
        <p className="px-3 py-4 text-[12px] text-[#939393]">
          Записей пока нет.
        </p>
      ) : (
        <ul>
          {posts.map((post) => (
            <VkMobilePost
              key={post.id}
              post={post}
              viewerId={viewerId}
              onChanged={reload}
              onOpenProfile={onOpenProfile}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
