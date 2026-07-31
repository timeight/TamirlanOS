"use client";

import { useT } from "@/hooks/use-translations";

interface SecurityWarningProps {
  host: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SecurityWarning({
  host,
  onConfirm,
  onCancel,
}: SecurityWarningProps) {
  const t = useT();

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/25 p-4">
      <div
        role="alertdialog"
        aria-label={t("ie.sec.title")}
        className="w-[min(360px,100%)] border border-[#0831d9] bg-[#ece9d8] shadow-[3px_3px_12px_rgba(0,0,0,0.5)]"
      >
        <div
          className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-white"
          style={{
            background:
              "linear-gradient(180deg, #1c68d8 0%, #3f8cf3 12%, #1956c4 70%, #1044a5 100%)",
          }}
        >
          {t("ie.sec.title")}
        </div>
        <div className="flex gap-3 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2c14e] text-[18px] font-bold text-[#5a4408]">
            !
          </span>
          <div className="min-w-0 text-[11px] leading-4 text-black">
            <p>{t("ie.sec.body")}</p>
            <p className="mt-1.5 truncate font-bold">{host}</p>
            <p className="mt-1.5 text-[#4a5a70]">{t("ie.sec.ask")}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#d4d0c8] px-3 py-2">
          <button
            type="button"
            onClick={onConfirm}
            className="min-w-[76px] rounded-[3px] border border-[#2b6cb0] bg-gradient-to-b from-[#f6fbff] to-[#cfe2f6] px-3 py-1 text-[11px] hover:brightness-105"
          >
            {t("ie.sec.yes")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            className="min-w-[76px] rounded-[3px] border border-[#8a8676] bg-gradient-to-b from-white to-[#e0ddd0] px-3 py-1 text-[11px] hover:brightness-105"
          >
            {t("ie.sec.no")}
          </button>
        </div>
      </div>
    </div>
  );
}
