"use client";

import { useCallback, useEffect, useState } from "react";
import { addPhoto, deletePhoto, getAllPhotos } from "@/core/photos/photo-db";
import type { PhotoCategory, StoredPhoto } from "@/types/photo";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function usePhotos() {
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAllPhotos()
      .then((all) => {
        if (active) setPhotos(all);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addPhotos = useCallback(
    async (files: FileList | File[], category: PhotoCategory) => {
      const added: StoredPhoto[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const photo: StoredPhoto = {
          id: crypto.randomUUID(),
          category,
          name: file.name,
          createdAt: Date.now(),
          dataUrl: await readAsDataUrl(file),
        };
        await addPhoto(photo);
        added.push(photo);
      }
      if (added.length) setPhotos((prev) => [...prev, ...added]);
    },
    [],
  );

  const removePhoto = useCallback(async (id: string) => {
    await deletePhoto(id);
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }, []);

  return { photos, loading, addPhotos, removePhoto };
}
