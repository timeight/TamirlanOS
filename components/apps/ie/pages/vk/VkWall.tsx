"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkPost } from "@/components/apps/ie/pages/vk/VkPost";
import { createPost } from "@/core/vk/api/posts";
import { useVkWall } from "@/hooks/use-vk-wall";

interface VkWallProps {
  ownerId: string;
  viewerId: string;
  viewerAvatar: string | null;
  onOpenProfile: (profileId: string) => void;
}

export function VkWall({
  ownerId,
  viewerId,
  viewerAvatar,
  onOpenProfile,
}: VkWallProps) {
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
    <div className="mt-5">
      <h2 className="border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        Стена <span className="font-normal text-[#999]">{posts.length}</span>
      </h2>

      <form
        className="flex gap-2 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <VkAvatar size={50} src={viewerAvatar} />
        <div className="min-w-0 flex-1">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={
              ownerId === viewerId ? "Что у Вас нового?" : "Написать на стене"
            }
            rows={2}
            aria-label="Новая запись"
            className="w-full resize-none border border-[#c0cad5] bg-white px-2 py-1.5 text-[12px] leading-[17px] outline-none focus:border-[#7196bd]"
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-1 border border-[#b2bdc8] bg-[#edf1f5] px-4 py-1 text-[11px] text-[#2b587a] hover:bg-[#e2e8ee] active:translate-y-px disabled:text-[#aaa]"
          >
            Отправить
          </button>
        </div>
      </form>

      {loading ? (
        <p className="border-t border-[#dae1e8] py-4 text-[11px] text-[#939393]">
          Загрузка...
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
            />
          ))}
        </ul>
      )}
    </div>
  );
}
