"use client";

import { useEffect } from "react";
import { useT } from "@/hooks/use-translations";
import type { StoredPhoto } from "@/types/photo";

interface PhotoViewerProps {
  photo: StoredPhoto;
  onClose: () => void;
  onDelete: () => void;
}

export function PhotoViewer({ photo, onClose, onDelete }: PhotoViewerProps) {
  const t = useT();
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
      aria-modal="true"
      aria-label={photo.name}
      className="absolute inset-0 z-20 flex flex-col bg-black/85"
    >
      <div className="flex items-center gap-2 bg-[#1f1f1f] px-3 py-1.5 text-white">
        <span className="min-w-0 flex-1 truncate text-[11px]">
          {photo.name}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-[3px] border border-[#7a2a1d] bg-gradient-to-b from-[#e07a5f] to-[#bb3b1d] px-3 py-1 text-[11px] text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-white"
        >
          {t("photo.delete")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[3px] border border-white/40 bg-white/10 px-3 py-1 text-[11px] text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
        >
          {t("photo.close")}
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.dataUrl}
          alt={photo.name}
          draggable={false}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
}
