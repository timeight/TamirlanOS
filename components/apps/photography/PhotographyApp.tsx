"use client";

import { useState } from "react";
import { PHOTO_CATEGORIES } from "@/core/photos/categories";
import { cn } from "@/core/utils/cn";
import { usePhotos } from "@/hooks/use-photos";
import type { PhotoCategory, StoredPhoto } from "@/types/photo";
import { PhotoGrid } from "./PhotoGrid";
import { PhotoViewer } from "./PhotoViewer";

export function PhotographyApp() {
  const { photos, loading, addPhotos, removePhoto } = usePhotos();
  const [category, setCategory] = useState<PhotoCategory>("city");
  const [viewer, setViewer] = useState<StoredPhoto | null>(null);

  const label =
    PHOTO_CATEGORIES.find((item) => item.id === category)?.label ?? "";
  const current = photos.filter((photo) => photo.category === category);

  return (
    <div className="relative flex h-full flex-col bg-white text-[11px] text-black">
      <div className="border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2">
        <p className="text-[13px] font-bold text-[#003399]">
          Fujifilm X-T2 · XF 35mm F2
        </p>
        <p className="text-[#4a5a70]">
          Мои снимки по категориям. Добавляйте свои фото — они сохраняются в
          этом браузере.
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col @sm:flex-row">
        <ul className="flex w-full shrink-0 gap-1 overflow-auto border-b border-[#aca899] bg-[#ebf3fb] p-1.5 @sm:w-36 @sm:flex-col @sm:border-r @sm:border-b-0">
          {PHOTO_CATEGORIES.map((item) => {
            const count = photos.filter((p) => p.category === item.id).length;
            return (
              <li key={item.id} className="shrink-0 @sm:w-full">
                <button
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "flex w-full items-center gap-1.5 rounded-sm px-2 py-1 text-left",
                    item.id === category
                      ? "bg-xp-selection text-white"
                      : "hover:bg-[#d6e6f8]",
                  )}
                >
                  <span className="flex-1">{item.label}</span>
                  <span
                    className={cn(
                      "text-[10px]",
                      item.id === category ? "text-white/80" : "text-[#7a8aa0]",
                    )}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <PhotoGrid
          photos={current}
          category={category}
          categoryLabel={label}
          loading={loading}
          onAdd={addPhotos}
          onOpen={setViewer}
        />
      </div>
      {viewer && (
        <PhotoViewer
          photo={viewer}
          onClose={() => setViewer(null)}
          onDelete={async () => {
            await removePhoto(viewer.id);
            setViewer(null);
          }}
        />
      )}
    </div>
  );
}
