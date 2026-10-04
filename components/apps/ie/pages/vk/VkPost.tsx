"use client";

import { useEffect, useRef, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkPhotoViewer } from "@/components/apps/ie/pages/vk/VkPhotoViewer";
import {
  addComment,
  deleteComment,
  deletePost,
  editPost,
  setLike,
} from "@/core/vk/api/posts";
import { fullName, vkDate, type VkWallPost } from "@/core/vk/vk-types";
import { pluralComments } from "@/core/browser/vk/vk-data";
import { cn } from "@/core/utils/cn";

interface VkPostProps {
  post: VkWallPost;
  viewerId: string;
  onChanged: () => Promise<void>;
  onOpenProfile: (profileId: string) => void;
  focused?: boolean;
}

export function VkPost({
  post,
  viewerId,
  onChanged,
  onOpenProfile,
  focused,
}: VkPostProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [viewing, setViewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frame = useRef<HTMLLIElement>(null);

  const run = async (action: Promise<string | null>) => {
    const message = await action;
    setError(message);
    if (!message) await onChanged();
  };

  const like = () => run(setLike(post.id, viewerId, !post.liked));

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setOpen(true);
    await run(addComment(post.id, viewerId, text));
  };

  const saveEdit = async () => {
    const text = (editing ?? "").trim();
    if (text) await run(editPost(post.id, text));
    setEditing(null);
  };

  useEffect(() => {
    if (!focused) return;
    frame.current?.scrollIntoView({ block: "center" });
  }, [focused]);

  return (
    <li
      ref={frame}
      className={cn(
        "flex gap-2.5 border-b border-[#e3e8ec] py-3",
        focused && "bg-[#f6f0d8]",
      )}
    >
      <button
        type="button"
        onClick={() => onOpenProfile(post.authorId)}
        className="shrink-0"
      >
        <VkAvatar size={50} src={post.authorAvatar} />
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onOpenProfile(post.authorId)}
          className="text-[12px] font-bold text-[#2b587a] hover:underline"
        >
          {post.authorName}
        </button>

        {editing === null ? (
          <p className="mt-1 text-[12px] leading-[17px] whitespace-pre-wrap text-[#000]">
            {post.content}
          </p>
        ) : (
          <form
            className="mt-1"
            onSubmit={(event) => {
              event.preventDefault();
              void saveEdit();
            }}
          >
            <textarea
              value={editing}
              onChange={(event) => setEditing(event.target.value)}
              rows={3}
              className="w-full resize-none border border-[#c0cad5] px-2 py-1 text-[12px] outline-none focus:border-[#7196bd]"
            />
            <button
              type="submit"
              className="mt-1 border border-[#b2bdc8] bg-[#edf1f5] px-3 py-[2px] text-[11px] text-[#2b587a]"
            >
              Сохранить
            </button>
          </form>
        )}

        {post.photoUrl && (
          <button
            type="button"
            onClick={() => setViewing(true)}
            aria-label="Открыть фотографию"
            className="relative mt-1.5 block h-[220px] w-full max-w-[320px] overflow-hidden border border-[#c5cdd5] bg-[#e8ebee]"
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

        <p className="mt-1.5 text-[10px] text-[#939393]">
          {vkDate(post.createdAt)}
        </p>

        {error && <p className="mt-1 text-[11px] text-[#9b2c2c]">{error}</p>}

        <p className="mt-1 flex flex-wrap gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => void like()}
            className={cn(
              "hover:underline",
              post.liked ? "font-bold text-[#8b1a1a]" : "text-[#2b587a]",
            )}
          >
            {post.liked ? "Мне больше не нравится" : "Мне нравится"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-[#2b587a] hover:underline"
          >
            Комментировать
          </button>
          {post.mine && (
            <button
              type="button"
              onClick={() => setEditing(post.content)}
              className="text-[#2b587a] hover:underline"
            >
              Редактировать
            </button>
          )}
          {post.canDelete && (
            <button
              type="button"
              onClick={() => void run(deletePost(post.id))}
              className="text-[#2b587a] hover:underline"
            >
              Удалить
            </button>
          )}
        </p>

        <p className="mt-1 flex gap-4 text-[11px] text-[#939393]">
          <span className={post.liked ? "text-[#8b1a1a]" : undefined}>
            ♥ {post.likes}
          </span>
          {post.comments.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="text-[#2b587a] hover:underline"
            >
              {pluralComments(post.comments.length)}
            </button>
          )}
        </p>

        {open && (
          <div className="mt-2 border-t border-[#eef1f4] pt-2">
            <ul>
              {post.comments.map((item) => (
                <li key={item.id} className="group flex gap-2 py-1.5">
                  <VkAvatar size={32} src={item.author?.avatar_url ?? null} />
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onOpenProfile(item.author_id)}
                      className="text-[11px] font-bold text-[#2b587a] hover:underline"
                    >
                      {item.author ? fullName(item.author) : "Страница удалена"}
                    </button>
                    <p className="text-[11px] leading-[16px] text-[#000]">
                      {item.content}
                    </p>
                    <p className="text-[10px] text-[#939393]">
                      {vkDate(item.created_at)}
                      {item.author_id === viewerId && (
                        <button
                          type="button"
                          onClick={() => void run(deleteComment(item.id))}
                          className="ml-2 text-[#2b587a] opacity-0 group-hover:opacity-100 hover:underline focus:opacity-100"
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
              className="mt-1 flex gap-1.5"
              onSubmit={(event) => {
                event.preventDefault();
                void send();
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
