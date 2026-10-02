"use client";

import { useRef, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { VkMobileButton } from "@/components/apps/ie/pages/vk/mobile/VkMobileButton";
import { VkMobileScreen } from "@/components/apps/ie/pages/vk/mobile/VkMobileScreen";
import { WALL_ALBUM } from "@/core/vk/api/photos";
import { useVkPhotos, type VkPhoto } from "@/hooks/use-vk-photos";

interface VkMobilePhotosProps {
  ownerId: string;
  viewerId: string;
  ownerName: string;
  onMenu: () => void;
}

export function VkMobilePhotos({
  ownerId,
  viewerId,
  ownerName,
  onMenu,
}: VkMobilePhotosProps) {
  const { photos, loading, busy, error, add, remove } = useVkPhotos(ownerId);
  const [shown, setShown] = useState<VkPhoto | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const mine = ownerId === viewerId;

  return (
    <VkMobileScreen
      title={mine ? "Фотографии" : ownerName}
      left={{ glyph: "menu", label: "Открыть меню", onClick: onMenu }}
      right={
        mine
          ? {
              glyph: "plus",
              label: "Загрузить фотографию",
              onClick: () => input.current?.click(),
            }
          : undefined
      }
    >
      <h3 className="bg-[#f2f4f6] px-3 py-1.5 text-[12px] text-[#7a7a7a] uppercase">
        {WALL_ALBUM}
        {busy && " · загрузка"}
      </h3>

      {error && <p className="px-3 py-2 text-[13px] text-[#b63131]">{error}</p>}

      {loading ? (
        <p className="px-3 py-5 text-[13px] text-[#95a0ab]">Загрузка...</p>
      ) : photos.length === 0 ? (
        <p className="px-3 py-5 text-[13px] text-[#95a0ab]">
          {mine
            ? "Вы ещё не загрузили ни одной фотографии."
            : "Фотографий нет."}
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-px bg-[#d8dde2]">
          {photos.map((photo) => (
            <li key={photo.row.id} className="bg-white">
              <button
                type="button"
                onClick={() => setShown(photo)}
                className="relative block aspect-square w-full"
              >
                <AssetImage
                  src={photo.url}
                  alt={photo.row.caption ?? "Фотография"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void add(file);
        }}
      />

      {shown && (
        <div className="absolute inset-0 z-40 flex flex-col bg-black">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShown(null)}
              aria-label="Закрыть фотографию"
              className="flex h-[46px] w-[46px] items-center justify-center text-white"
            >
              <VkGlyph name="close" size={20} />
            </button>
          </div>
          <div className="relative flex-1">
            <AssetImage
              src={shown.url}
              alt={shown.row.caption ?? "Фотография"}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-3 px-3 py-3">
            <p className="min-w-0 flex-1 truncate text-[13px] text-[#c3cad1]">
              {shown.row.caption ?? "без описания"}
            </p>
            {mine && (
              <VkMobileButton
                size="small"
                tone="secondary"
                onClick={() => {
                  void remove(shown.row);
                  setShown(null);
                }}
              >
                Удалить
              </VkMobileButton>
            )}
          </div>
        </div>
      )}
    </VkMobileScreen>
  );
}
