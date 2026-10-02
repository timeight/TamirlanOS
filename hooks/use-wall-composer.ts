"use client";

import { useCallback, useState } from "react";
import { PHOTO_BUCKET, publicUrl, uploadPhoto } from "@/core/vk/api/photos";
import { createPost } from "@/core/vk/api/posts";

export interface WallComposer {
  draft: string;
  setDraft: (draft: string) => void;
  /** Фотография уже в Storage: отправка записи только привязывает её. */
  attachedUrl: string | null;
  busy: boolean;
  error: string | null;
  canSend: boolean;
  attach: (file: File) => Promise<void>;
  detach: () => void;
  send: () => Promise<void>;
}

export function useWallComposer(
  ownerId: string,
  viewerId: string,
  onPosted: () => Promise<void>,
): WallComposer {
  const [draft, setDraft] = useState("");
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const attach = useCallback(
    async (file: File) => {
      setBusy(true);
      setError(null);
      const result = await uploadPhoto(viewerId, file);
      setBusy(false);
      if (typeof result === "string") {
        setError(result);
        return;
      }
      setPhotoId(result.photo.id);
      setAttachedUrl(publicUrl(PHOTO_BUCKET, result.photo.storage_path));
    },
    [viewerId],
  );

  const detach = useCallback(() => {
    setPhotoId(null);
    setAttachedUrl(null);
  }, []);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (busy || (!text && !photoId)) return;
    setBusy(true);
    setError(null);
    const message = await createPost(viewerId, ownerId, text, photoId);
    if (message) {
      setError(message);
      setBusy(false);
      return;
    }
    setDraft("");
    detach();
    await onPosted();
    setBusy(false);
  }, [busy, detach, draft, onPosted, ownerId, photoId, viewerId]);

  return {
    draft,
    setDraft,
    attachedUrl,
    busy,
    error,
    canSend: Boolean(draft.trim() || photoId),
    attach,
    detach,
    send,
  };
}
