"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkPost } from "@/components/apps/ie/pages/vk/VkPost";
import { useVkStore } from "@/stores/vk-store";

interface VkWallProps {
  onOpenAuthor: () => void;
}

export function VkWall({ onOpenAuthor }: VkWallProps) {
  const posts = useVkStore((state) => state.posts);
  const open = useVkStore((state) => state.open);
  const publish = useVkStore((state) => state.publish);
  const reset = useVkStore((state) => state.reset);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    publish(text);
    setDraft("");
  };

  return (
    <div className="mt-5">
      <div className="flex items-baseline justify-between border-b border-[#dae1e8] pb-1">
        <h2 className="text-[11px] font-bold text-[#45688e]">
          Стена <span className="font-normal text-[#999]">{posts.length}</span>
        </h2>
        <button
          type="button"
          onClick={reset}
          className="text-[10px] text-[#939393] hover:text-[#2b587a] hover:underline"
        >
          восстановить записи
        </button>
      </div>

      <form
        className="flex gap-2 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <VkAvatar size={50} />
        <div className="min-w-0 flex-1">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Что у Вас нового?"
            rows={2}
            aria-label="Новая запись"
            className="w-full resize-none border border-[#c0cad5] bg-white px-2 py-1.5 text-[12px] leading-[17px] outline-none focus:border-[#7196bd]"
          />
          <button
            type="submit"
            className="mt-1 border border-[#b2bdc8] bg-[#edf1f5] px-4 py-1 text-[11px] text-[#2b587a] hover:bg-[#e2e8ee] active:translate-y-px"
          >
            Отправить
          </button>
        </div>
      </form>

      <ul className="border-t border-[#dae1e8]">
        {posts.map((post) => (
          <VkPost
            key={post.id}
            post={post}
            expanded={open.includes(post.id)}
            onOpenAuthor={onOpenAuthor}
          />
        ))}
      </ul>
    </div>
  );
}
