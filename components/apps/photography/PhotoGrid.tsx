"use client";

import { useRef } from "react";
import type { PhotoCategory, StoredPhoto } from "@/types/photo";

interface PhotoGridProps {
  photos: readonly StoredPhoto[];
  category: PhotoCategory;
  categoryLabel: string;
  loading: boolean;
  onAdd: (files: FileList, category: PhotoCategory) => void;
  onOpen: (photo: StoredPhoto) => void;
}

const addButton =
  "rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]";

export function PhotoGrid({
  photos,
  category,
  categoryLabel,
  loading,
  onAdd,
  onOpen,
}: PhotoGridProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = () => inputRef.current?.click();

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-[#aca899] bg-[#ebf3fb] px-3 py-1.5">
        <span className="flex-1 font-bold text-[#003399]">{categoryLabel}</span>
        <button type="button" onClick={pick} className={addButton}>
          Добавить фото
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) onAdd(event.target.files, category);
            event.target.value = "";
          }}
        />
      </div>
      {loading ? (
        <p className="p-4 text-[#4a5a70]">Загрузка…</p>
      ) : photos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-[#4a5a70]">
          <p>В категории «{categoryLabel}» пока нет фото.</p>
          <button type="button" onClick={pick} className={addButton}>
            Загрузить фото
          </button>
        </div>
      ) : (
        <ul className="grid flex-1 auto-rows-min grid-cols-2 gap-2 overflow-auto p-2 @sm:grid-cols-3 @lg:grid-cols-4">
          {photos.map((photo) => (
            <li key={photo.id}>
              <button
                type="button"
                onClick={() => onOpen(photo)}
                className="block w-full overflow-hidden rounded-sm border border-[#aca899] bg-black focus-visible:outline-2 focus-visible:outline-[#316ac5]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.dataUrl}
                  alt={photo.name}
                  draggable={false}
                  className="aspect-square w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
