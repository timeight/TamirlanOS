"use client";

import { useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkPhotoViewer } from "@/components/apps/ie/pages/vk/VkPhotoViewer";
import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { VkMobileComments } from "@/components/apps/ie/pages/vk/mobile/VkMobileComments";
import { deletePost, setLike } from "@/core/vk/api/posts";
import { cn } from "@/core/utils/cn";
import { vkDate, type VkWallPost } from "@/core/vk/vk-types";

interface VkMobilePostProps {
  post: VkWallPost;
  viewerId: string;
  onChanged: () => Promise<void>;
  onOpenProfile: (profileId: string) => void;
}

/** Запись во всю ширину; записи разделяет серая полоса, а не рамка карточки. */
export function VkMobilePost({
  post,
  viewerId,
  onChanged,
  onOpenProfile,
}: VkMobilePostProps) {
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(false);

  return (
    <li className="border-b-[7px] border-[#e4e8eb] bg-white">
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
            aria-label="Удалить запись"
            onClick={async () => {
              await deletePost(post.id);
              await onChanged();
            }}
            className="flex h-[30px] w-[26px] shrink-0 items-center justify-center text-[#c3c9cf]"
          >
            <VkGlyph name="close" size={14} />
          </button>
        )}
      </div>

      {post.content && (
        <p className="px-[10px] pt-1.5 text-[14px] leading-[19px] break-words whitespace-pre-wrap text-[#333]">
          {post.content}
        </p>
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
          onClick={async () => {
            await setLike(post.id, viewerId, !post.liked);
            await onChanged();
          }}
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
