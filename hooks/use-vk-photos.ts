"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PHOTO_BUCKET,
  deletePhoto,
  fetchPhotos,
  publicUrl,
  uploadPhoto,
} from "@/core/vk/api/photos";
import type { VkPhotoRow } from "@/core/vk/social-types";

export interface VkPhoto {
  row: VkPhotoRow;
  url: string;
}

export interface VkPhotoLibrary {
  photos: readonly VkPhoto[];
  loading: boolean;
  busy: boolean;
  error: string | null;
  add: (file: File, caption?: string) => Promise<VkPhotoRow | null>;
  remove: (row: VkPhotoRow) => Promise<void>;
}

export function useVkPhotos(ownerId: string): VkPhotoLibrary {
  const [photos, setPhotos] = useState<readonly VkPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const rows = await fetchPhotos(ownerId);
    setPhotos(
      rows.map((row) => ({
        row,
        url: publicUrl(PHOTO_BUCKET, row.storage_path),
      })),
    );
    setLoading(false);
  }, [ownerId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const add = useCallback(
    async (file: File, caption?: string) => {
      setBusy(true);
      setError(null);
      const result = await uploadPhoto(ownerId, file, caption);
      setBusy(false);
      if (typeof result === "string") {
        setError(result);
        return null;
      }
      await reload();
      return result.photo;
    },
    [ownerId, reload],
  );

  const remove = useCallback(
    async (row: VkPhotoRow) => {
      await deletePhoto(row);
      await reload();
    },
    [reload],
  );

  return { photos, loading, busy, error, add, remove };
}
