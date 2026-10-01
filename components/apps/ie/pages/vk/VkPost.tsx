"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { pluralComments, type VkPost as Post } from "@/core/browser/vk/vk-data";
import { cn } from "@/core/utils/cn";
import { useVkStore } from "@/stores/vk-store";

interface VkPostProps {
  post: Post;
  expanded: boolean;
  onOpenAuthor: () => void;
}

export function VkPost({ post, expanded, onOpenAuthor }: VkPostProps) {
  const toggleLike = useVkStore((state) => state.toggleLike);
  const toggleComments = useVkStore((state) => state.toggleComments);
  const addComment = useVkStore((state) => state.addComment);
  const removeComment = useVkStore((state) => state.removeComment);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    addComment(post.id, text);
    setDraft("");
  };

  return (
    <li className="flex gap-2.5 border-b border-[#e3e8ec] py-3">
      <button type="button" onClick={onOpenAuthor} className="shrink-0">
        <VkAvatar size={50} />
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onOpenAuthor}
          className="text-[12px] font-bold text-[#2b587a] hover:underline"
        >
          {post.author}
        </button>
        <p className="mt-1 text-[12px] leading-[17px] whitespace-pre-wrap text-[#000]">
          {post.text}
        </p>

        <p className="mt-1.5 text-[10px] text-[#939393]">{post.at}</p>

        <p className="mt-1 flex flex-wrap gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => toggleLike(post.id)}
            className={cn(
              "hover:underline",
              post.liked ? "font-bold text-[#8b1a1a]" : "text-[#2b587a]",
            )}
          >
            {post.liked ? "Мне больше не нравится" : "Мне нравится"}
          </button>
          <button
            type="button"
            onClick={() => toggleComments(post.id)}
            className="text-[#2b587a] hover:underline"
          >
            Комментировать
          </button>
          <button type="button" className="text-[#2b587a] hover:underline">
            Поделиться
          </button>
        </p>

        <p className="mt-1 flex gap-4 text-[11px] text-[#939393]">
          <span className={post.liked ? "text-[#8b1a1a]" : undefined}>
            ♥ {post.likes}
          </span>
          {post.comments.length > 0 && (
            <button
              type="button"
              onClick={() => toggleComments(post.id)}
              className="text-[#2b587a] hover:underline"
            >
              {pluralComments(post.comments.length)}
            </button>
          )}
        </p>

        {expanded && (
          <div className="mt-2 border-t border-[#eef1f4] pt-2">
            <ul>
              {post.comments.map((item) => (
                <li key={item.id} className="group flex gap-2 py-1.5">
                  <VkAvatar size={32} />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-[#2b587a]">
                      {item.author}
                    </span>
                    <p className="text-[11px] leading-[16px] text-[#000]">
                      {item.text}
                    </p>
                    <p className="text-[10px] text-[#939393]">
                      {item.at}
                      <button
                        type="button"
                        onClick={() => removeComment(post.id, item.id)}
                        className="ml-2 text-[#2b587a] opacity-0 group-hover:opacity-100 hover:underline focus:opacity-100"
                      >
                        удалить
                      </button>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <form
              className="mt-1 flex gap-1.5"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Написать комментарий..."
                aria-label="Комментарий"
                className="min-w-0 flex-1 border border-[#c0cad5] bg-white px-1.5 py-1 text-[11px] outline-none focus:border-[#7196bd]"
              />
              <button
                type="submit"
                className="shrink-0 border border-[#b2bdc8] bg-[#edf1f5] px-3 py-1 text-[11px] text-[#2b587a] hover:bg-[#e2e8ee] active:translate-y-px"
              >
                Отправить
              </button>
            </form>
          </div>
        )}
      </div>
    </li>
  );
}
