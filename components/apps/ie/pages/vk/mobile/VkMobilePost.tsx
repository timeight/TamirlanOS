"use client";

import { useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
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

/** Запись во всю ширину, без карточек и скруглений — как в приложении тех лет. */
export function VkMobilePost({
  post,
  viewerId,
  onChanged,
  onOpenProfile,
}: VkMobilePostProps) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b-[6px] border-[#e8ebee] bg-white">
      <div className="flex items-center gap-2.5 px-3 pt-2.5">
        <button type="button" onClick={() => onOpenProfile(post.authorId)}>
          <VkAvatar size={36} src={post.authorAvatar} />
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onOpenProfile(post.authorId)}
            className="block truncate text-[14px] font-medium text-[#2a5885]"
          >
            {post.authorName}
          </button>
          <p className="text-[12px] text-[#95a0ab]">{vkDate(post.createdAt)}</p>
        </div>
        {(post.mine || post.onMyWall) && (
          <button
            type="button"
            aria-label="Удалить запись"
            onClick={async () => {
              await deletePost(post.id);
              await onChanged();
            }}
            className="flex h-[36px] w-[30px] items-center justify-center text-[#c3cad1]"
          >
            <VkGlyph name="close" size={15} />
          </button>
        )}
      </div>

      {post.content && (
        <p className="px-3 pt-2 text-[15px] leading-[20px] break-words whitespace-pre-wrap text-[#2a2a2a]">
          {post.content}
        </p>
      )}

      {post.photoUrl && (
        <span className="relative mt-2 block h-[240px] w-full bg-[#e8ebee]">
          <AssetImage
            src={post.photoUrl}
            alt={post.photoCaption ?? "Фотография к записи"}
            fill
            unoptimized
            className="object-cover"
          />
        </span>
      )}

      <div className="mt-1 flex items-center gap-5 px-3 py-2">
        <button
          type="button"
          onClick={async () => {
            await setLike(post.id, viewerId, !post.liked);
            await onChanged();
          }}
          className={cn(
            "flex min-h-[32px] items-center gap-1.5 text-[13px]",
            post.liked ? "text-[#b63131]" : "text-[#7a8d9f]",
          )}
        >
          <VkGlyph name="heart" size={17} />
          {post.likes > 0 && post.likes}
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-h-[32px] items-center gap-1.5 text-[13px] text-[#7a8d9f]"
        >
          <VkGlyph name="comment" size={17} />
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
