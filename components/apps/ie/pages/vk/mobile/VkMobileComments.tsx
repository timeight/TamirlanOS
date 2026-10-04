"use client";

import { useState } from "react";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { addComment, deleteComment } from "@/core/vk/api/posts";
import { fullName, vkDate, type VkWallPost } from "@/core/vk/vk-types";

interface VkMobileCommentsProps {
  post: VkWallPost;
  viewerId: string;
  onChanged: () => Promise<void>;
  onOpenProfile: (profileId: string) => void;
}

export function VkMobileComments({
  post,
  viewerId,
  onChanged,
  onOpenProfile,
}: VkMobileCommentsProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = async (action: Promise<string | null>) => {
    const message = await action;
    setError(message);
    if (!message) await onChanged();
  };

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await run(addComment(post.id, viewerId, text));
  };

  return (
    <div className="border-t border-[#d5d9de] bg-[#f4f6f8]">
      <ul>
        {post.comments.map((item) => (
          <li
            key={item.id}
            className="flex gap-2 border-b border-[#e0e4e8] px-[10px] py-[7px]"
          >
            <VkAvatar size={28} src={item.author?.avatar_url} />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onOpenProfile(item.author_id)}
                className="text-[12px] font-bold text-[#2a5885]"
              >
                {item.author ? fullName(item.author) : "Страница удалена"}
              </button>
              <p className="text-[13px] leading-[17px] break-words text-[#333]">
                {item.content}
              </p>
              <p className="text-[11px] text-[#9aa4ad]">
                {vkDate(item.created_at)}
                {item.author_id === viewerId && (
                  <button
                    type="button"
                    onClick={() => void run(deleteComment(item.id))}
                    className="ml-2 text-[#2a5885]"
                  >
                    удалить
                  </button>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {error && (
        <p className="px-[10px] pt-1 text-[12px] text-[#b63131]">{error}</p>
      )}

      <form
        className="flex items-center gap-2 px-[10px] py-[7px]"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Комментарий"
          aria-label="Комментарий"
          className="h-[29px] min-w-0 flex-1 rounded-[3px] border border-[#c2cad3] bg-white px-[7px] text-[13px] outline-none placeholder:text-[#a6adb4] focus:border-[#5181b8]"
        />
        <button
          type="submit"
          aria-label="Отправить комментарий"
          className="flex h-[29px] w-[32px] shrink-0 items-center justify-center rounded-[3px] border border-[#41699b] bg-[linear-gradient(#6a93c3,#5181b8)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] active:bg-[#4a76a8]"
        >
          <VkGlyph name="send" size={15} />
        </button>
      </form>
    </div>
  );
}
