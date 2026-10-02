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

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await addComment(post.id, viewerId, text);
    await onChanged();
  };

  return (
    <div className="border-t border-[#e3e7ea] bg-[#f7f8fa]">
      <ul>
        {post.comments.map((item) => (
          <li
            key={item.id}
            className="flex gap-2.5 border-b border-[#e3e7ea] px-3 py-2"
          >
            <VkAvatar size={28} src={item.author?.avatar_url} />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onOpenProfile(item.author_id)}
                className="text-[13px] font-medium text-[#2a5885]"
              >
                {item.author ? fullName(item.author) : "Страница удалена"}
              </button>
              <p className="text-[14px] leading-[18px] break-words text-[#2a2a2a]">
                {item.content}
              </p>
              <p className="mt-0.5 text-[11px] text-[#95a0ab]">
                {vkDate(item.created_at)}
                {item.author_id === viewerId && (
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteComment(item.id);
                      await onChanged();
                    }}
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

      <form
        className="flex items-end gap-2 px-3 py-2"
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
          className="min-w-0 flex-1 rounded-[3px] border border-[#ccd4dd] bg-white px-2.5 py-2 text-[14px] outline-none focus:border-[#5181b8]"
        />
        <button
          type="submit"
          aria-label="Отправить комментарий"
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[3px] bg-[#5181b8] text-white active:bg-[#4a76a8]"
        >
          <VkGlyph name="send" size={18} />
        </button>
      </form>
    </div>
  );
}
