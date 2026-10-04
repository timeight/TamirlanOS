"use client";

import { useRef, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { VkButton } from "@/components/apps/ie/pages/vk/VkButton";
import { WALL_ALBUM } from "@/core/vk/api/photos";
import { useVkPhotos, type VkPhoto } from "@/hooks/use-vk-photos";

interface VkPhotosProps {
  ownerId: string;
  viewerId: string;
  ownerName: string;
}

export function VkPhotos({ ownerId, viewerId, ownerName }: VkPhotosProps) {
  const { photos, loading, busy, error, add, remove, makeAvatar } =
    useVkPhotos(ownerId);
  const [shown, setShown] = useState<VkPhoto | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const mine = ownerId === viewerId;

  return (
    <div className="pt-3">
      <h1 className="mb-2 flex items-center gap-3 border-b border-[#dae1e8] pb-1 text-[11px] font-bold text-[#45688e]">
        {mine ? "Мои фотографии" : `Фотографии · ${ownerName}`}
        <span className="font-normal text-[#939393]">{WALL_ALBUM}</span>
        {mine && (
          <VkButton
            tone="quiet"
            className="ml-auto"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {busy ? "Загрузка..." : "Загрузить фотографию"}
          </VkButton>
        )}
      </h1>

      {mine && (
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
      )}

      {error && <p className="mb-2 text-[11px] text-[#9b2c2c]">{error}</p>}

      {loading ? (
        <p className="py-4 text-[11px] text-[#939393]">Загрузка...</p>
      ) : photos.length === 0 ? (
        <p className="py-4 text-[11px] text-[#939393]">
          {mine
            ? "Вы ещё не загрузили ни одной фотографии."
            : "Фотографий нет."}
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2 @[520px]:grid-cols-5">
          {photos.map((photo) => (
            <li key={photo.row.id}>
              <button
                type="button"
                onClick={() => setShown(photo)}
                className="relative block aspect-square w-full overflow-hidden border border-[#c5cdd5] bg-[#e8ebee]"
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

      {shown && (
        <div className="mt-3 border border-[#dae1e8] bg-[#f6f8fa] p-2">
          <div className="relative mx-auto h-[300px] w-full max-w-[520px]">
            <AssetImage
              src={shown.url}
              alt={shown.row.caption ?? "Фотография"}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span className="min-w-0 flex-1 truncate text-[#555]">
              {shown.row.caption ?? "без описания"}
            </span>
            {mine && (
              <VkButton tone="quiet" onClick={() => void makeAvatar(shown.row)}>
                Сделать аватаром
              </VkButton>
            )}
            {mine && (
              <VkButton
                tone="quiet"
                onClick={() => {
                  void remove(shown.row);
                  setShown(null);
                }}
              >
                Удалить
              </VkButton>
            )}
            <VkButton tone="quiet" onClick={() => setShown(null)}>
              Закрыть
            </VkButton>
          </div>
        </div>
      )}
    </div>
  );
}
