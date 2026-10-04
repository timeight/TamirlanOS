"use client";

import { useEffect, useRef, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkPhotoViewer } from "@/components/apps/ie/pages/vk/VkPhotoViewer";
import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileComments } from "@/components/apps/ie/pages/vk/mobile/VkMobileComments";
import { deletePost, editPost, setLike } from "@/core/vk/api/posts";
import { cn } from "@/core/utils/cn";
import { vkDate, type VkWallPost } from "@/core/vk/vk-types";

interface VkMobilePostProps {
  post: VkWallPost;
  viewerId: string;
  onChanged: () => Promise<void>;
  onOpenProfile: (profileId: string) => void;
  focused?: boolean;
}

/** Запись во всю ширину; записи разделяет серая полоса, а не рамка карточки. */
export function VkMobilePost({
  post,
  viewerId,
  onChanged,
  onOpenProfile,
  focused,
}: VkMobilePostProps) {
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const frame = useRef<HTMLLIElement>(null);

  const run = async (action: Promise<string | null>) => {
    const message = await action;
    setError(message);
    if (!message) await onChanged();
  };

  useEffect(() => {
    if (!focused) return;
    frame.current?.scrollIntoView({ block: "center" });
  }, [focused]);

  return (
    <li
      ref={frame}
      className={cn(
        "border-b-[7px] border-[#e4e8eb]",
        focused ? "bg-[#f6f0d8]" : "bg-white",
      )}
    >
      <div className="flex items-center px-[10px] pt-2">
        <button type="button" onClick={() => onOpenProfile(post.authorId)}>
          <VkAvatar size={36} src={post.authorAvatar} />
        </button>
        <div className="ml-2 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onOpenProfile(post.authorId)}
            className="block truncate text-[13px] leading-[16px] font-bold text-[#2a5885]"
          >
            {post.authorName}
          </button>
          <p className="text-[11px] text-[#9aa4ad]">{vkDate(post.createdAt)}</p>
        </div>
        {(post.mine || post.onMyWall) && (
          <button
            type="button"
            aria-label="Действия с записью"
            onClick={() => setMenu(!menu)}
            className="flex h-[30px] w-[26px] shrink-0 items-center justify-center text-[#c3c9cf]"
          >
            <VkGlyph name="more" size={15} />
          </button>
        )}
      </div>

      {menu && (
        <div className="mt-1 flex gap-4 border-y border-[#e3e7ea] bg-[#f4f6f8] px-[10px] py-1.5 text-[13px]">
          {post.mine && (
            <button
              type="button"
              onClick={() => {
                setEditing(post.content);
                setMenu(false);
              }}
              className="text-[#2a5885]"
            >
              Редактировать
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setMenu(false);
              void run(deletePost(post.id));
            }}
            className="text-[#b63131]"
          >
            Удалить
          </button>
        </div>
      )}

      {editing === null ? (
        post.content && (
          <p className="px-[10px] pt-1.5 text-[14px] leading-[19px] break-words whitespace-pre-wrap text-[#333]">
            {post.content}
          </p>
        )
      ) : (
        <form
          className="px-[10px] pt-1.5"
          onSubmit={async (event) => {
            event.preventDefault();
            const text = editing.trim();
            if (!text) return;
            await run(editPost(post.id, text));
            setEditing(null);
          }}
        >
          <textarea
            value={editing}
            onChange={(event) => setEditing(event.target.value)}
            rows={3}
            aria-label="Текст записи"
            className="w-full resize-none rounded-[3px] border border-[#c2cad3] px-2 py-1.5 text-[14px] leading-[19px] outline-none focus:border-[#5181b8]"
          />
          <div className="mt-1.5 flex gap-1.5">
            <VkMobileButton type="submit" size="small">
              Сохранить
            </VkMobileButton>
            <VkMobileButton
              size="small"
              tone="secondary"
              onClick={() => setEditing(null)}
            >
              Отмена
            </VkMobileButton>
          </div>
        </form>
      )}

      {error && (
        <p className="px-[10px] pt-1.5 text-[12px] text-[#b63131]">{error}</p>
      )}

      {post.photoUrl && (
        <button
          type="button"
          onClick={() => setViewing(true)}
          aria-label="Открыть фотографию"
          className="relative mt-[7px] block h-[210px] w-full bg-[#dfe4e9]"
        >
          <AssetImage
            src={post.photoUrl}
            alt={post.photoCaption ?? "Фотография к записи"}
            fill
            unoptimized
            className="object-cover"
          />
        </button>
      )}

      {viewing && post.photoUrl && (
        <VkPhotoViewer
          url={post.photoUrl}
          caption={post.photoCaption}
          onClose={() => setViewing(false)}
        />
      )}

      <div className="flex items-center gap-[18px] px-[10px] pt-[5px] pb-[7px]">
        <button
          type="button"
          onClick={() => void run(setLike(post.id, viewerId, !post.liked))}
          className={cn(
            "flex items-center gap-[5px] py-1 text-[12px]",
            post.liked ? "text-[#b63131]" : "text-[#7a8d9f]",
          )}
        >
          <VkGlyph name="heart" size={16} />
          {post.likes > 0 && post.likes}
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-[5px] py-1 text-[12px] text-[#7a8d9f]"
        >
          <VkGlyph name="comment" size={16} />
          {post.comments.length > 0 && post.comments.length}
        </button>
      </div>

      {open && (
        <VkMobileComments
          post={post}
          viewerId={viewerId}
          onChanged={onChanged}
          onOpenProfile={onOpenProfile}
        />
      )}
    </li>
  );
}
