"use client";

import { useState } from "react";
import { pluralComments } from "@/core/browser/vk/vk-data";
import {
  addComment,
  deleteComment,
  deletePost,
  setLike,
} from "@/core/vk/api/posts";
import { fullName, vkDate, type VkWallPost } from "@/core/vk/vk-types";
import { cn } from "@/core/utils/cn";

interface VkMobilePostProps {
  post: VkWallPost;
  viewerId: string;
  onChanged: () => Promise<void>;
  onOpenProfile: (profileId: string) => void;
}

/** No avatars on the wall: the old mobile site dropped them to save traffic. */
export function VkMobilePost({
  post,
  viewerId,
  onChanged,
  onOpenProfile,
}: VkMobilePostProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await addComment(post.id, viewerId, text);
    setOpen(true);
    await onChanged();
  };

  return (
    <li className="border-b border-[#dde3e8] px-3 py-2.5">
      <button
        type="button"
        onClick={() => onOpenProfile(post.authorId)}
        className="text-[13px] font-bold text-[#2b587a]"
      >
        {post.authorName}
      </button>
      <span className="ml-2 text-[11px] text-[#939393]">
        {vkDate(post.createdAt)}
      </span>

      <p className="mt-1 text-[13px] leading-[18px] break-words whitespace-pre-wrap text-[#000]">
        {post.content}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
        <button
          type="button"
          onClick={async () => {
            await setLike(post.id, viewerId, !post.liked);
            await onChanged();
          }}
          className={cn(
            post.liked ? "font-bold text-[#8b1a1a]" : "text-[#2b587a]",
          )}
        >
          {post.liked ? "♥ нравится" : "Мне нравится"}
          {post.likes > 0 && ` (${post.likes})`}
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-[#2b587a]"
        >
          {post.comments.length > 0
            ? pluralComments(post.comments.length)
            : "Комментировать"}
        </button>

        {(post.mine || post.onMyWall) && (
          <button
            type="button"
            onClick={async () => {
              await deletePost(post.id);
              await onChanged();
            }}
            className="text-[#2b587a]"
          >
            Удалить
          </button>
        )}
      </div>

      {open && (
        <div className="mt-2 border-t border-[#eef1f4] pt-2">
          <ul>
            {post.comments.map((item) => (
              <li key={item.id} className="py-1.5">
                <button
                  type="button"
                  onClick={() => onOpenProfile(item.author_id)}
                  className="text-[12px] font-bold text-[#2b587a]"
                >
                  {item.author ? fullName(item.author) : "Страница удалена"}
                </button>
                <p className="text-[12px] leading-[17px] break-words text-[#000]">
                  {item.content}
                </p>
                <p className="text-[11px] text-[#939393]">
                  {vkDate(item.created_at)}
                  {item.author_id === viewerId && (
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteComment(item.id);
                        await onChanged();
                      }}
                      className="ml-2 text-[#2b587a]"
                    >
                      удалить
                    </button>
                  )}
                </p>
              </li>
            ))}
          </ul>

          <form
            className="mt-1 flex gap-1.5"
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
              className="min-w-0 flex-1 border border-[#c0cad5] px-2 py-1.5 text-[13px] outline-none focus:border-[#7196bd]"
            />
            <button
              type="submit"
              className="shrink-0 border border-[#b2bdc8] bg-[#edf1f5] px-3 py-1.5 text-[12px] text-[#2b587a]"
            >
              ОК
            </button>
          </form>
        </div>
      )}
    </li>
  );
}
