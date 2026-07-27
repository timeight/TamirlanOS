"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { useEffect } from "react";
import { AppKey } from "@/core/apps/app-catalog";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/notification-store";

const DISMISS_MS = 6000;

export function NotificationToast() {
  const items = useNotificationStore((state) => state.items);

  if (!items.length) return null;

  return (
    <div className="absolute right-3 bottom-[40px] z-[58] flex flex-col gap-2">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ToastCard({ item }: { item: Notification }) {
  const dismiss = useNotificationStore((state) => state.dismiss);
  const openApp = useOpenApp();
  const t = useT();

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(item.id), DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [dismiss, item.id]);

  return (
    <div
      role="status"
      onClick={() => {
        dismiss(item.id);
        openApp(AppKey.Agent);
      }}
      className="animate-fade-in w-[min(280px,calc(100vw-24px))] cursor-pointer rounded-md border border-[#2b6cb0] bg-gradient-to-b from-[#f2f9ff] to-[#d7eafb] p-2.5 shadow-[2px_2px_10px_rgba(0,0,0,0.45)] motion-reduce:animate-none"
    >
      <div className="mb-1 flex items-center gap-1.5">
        <Image src={item.iconSrc} alt="" width={18} height={18} unoptimized />
        <p className="flex-1 truncate text-[12px] font-bold text-[#1c4e80]">
          {item.title}
        </p>
        <button
          type="button"
          aria-label={t("balloon.close")}
          onClick={(event) => {
            event.stopPropagation();
            dismiss(item.id);
          }}
          className="flex h-4 w-4 items-center justify-center rounded-sm text-[#2b6cb0] hover:bg-black/10 focus-visible:outline-1 focus-visible:outline-[#2b6cb0]"
        >
          <svg viewBox="0 0 10 10" aria-hidden="true" className="h-2 w-2">
            <path
              d="M1 1l8 8M9 1l-8 8"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      </div>
      <p className="line-clamp-3 text-[11px] leading-4 text-[#274b6d]">
        {item.body}
      </p>
    </div>
  );
}
