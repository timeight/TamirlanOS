"use client";

import { useEffect } from "react";
import { AssetImage } from "@/components/ui/AssetImage";

interface VkPhotoViewerProps {
  url: string;
  caption?: string | null;
  onClose: () => void;
}

/**
 * Полноэкранный просмотр одной фотографии. Крепится к ближайшему
 * позиционированному предку — это окно браузера внутри TamirlanOS,
 * поэтому снимок не вылезает за его рамку.
 */
export function VkPhotoViewer({ url, caption, onClose }: VkPhotoViewerProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label={caption ?? "Фотография"}
      className="absolute inset-0 z-40 flex flex-col bg-black/92"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть фотографию"
        className="self-end px-4 py-2 text-[20px] leading-none text-white"
      >
        ×
      </button>

      <div className="relative min-h-0 flex-1">
        <AssetImage
          src={url}
          alt={caption ?? "Фотография"}
          fill
          unoptimized
          className="object-contain"
        />
      </div>

      <p className="px-3 py-3 text-center text-[12px] text-[#c3cad1]">
        {caption ?? ""}
      </p>
    </div>
  );
}
