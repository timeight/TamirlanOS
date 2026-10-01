"use client";

import { useState } from "react";
import { VkMobilePost } from "@/components/apps/ie/pages/vk/mobile/VkMobilePost";
import { createPost } from "@/core/vk/api/posts";
import { useVkWall } from "@/hooks/use-vk-wall";

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
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setBusy(true);
    setDraft("");
    await createPost(viewerId, ownerId, text);
    await reload();
    setBusy(false);
  };

  return (
    <section>
      <h2 className="border-y border-[#dde3e8] bg-[#f0f3f6] px-3 py-1.5 text-[12px] font-bold text-[#45688e]">
        Стена
      </h2>

      <form
        className="border-b border-[#dde3e8] px-3 py-2"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={
            ownerId === viewerId ? "Что у Вас нового?" : "Написать на стене"
          }
          rows={2}
          aria-label="Новая запись"
          className="w-full resize-none border border-[#c0cad5] px-2 py-1.5 text-[13px] leading-[18px] outline-none focus:border-[#7196bd]"
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-1.5 w-full border border-[#b2bdc8] bg-[#edf1f5] py-2 text-[13px] text-[#2b587a] disabled:text-[#aaa]"
        >
          Отправить
        </button>
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
