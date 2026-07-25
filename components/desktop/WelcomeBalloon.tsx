"use client";

import { AppKey } from "@/core/apps/app-catalog";

interface WelcomeBalloonProps {
  onClose: () => void;
  onOpenApp: (appId: AppKey) => void;
}

const linkClass =
  "text-[#0046d5] underline hover:text-[#2a68e8] focus-visible:outline-1 focus-visible:outline-[#0046d5]";

export function WelcomeBalloon({ onClose, onOpenApp }: WelcomeBalloonProps) {
  return (
    <div
      role="status"
      className="animate-fade-in absolute right-3 bottom-[40px] z-[55] w-[min(310px,calc(100vw-24px))] rounded-md border border-[#767676] bg-[#ffffe1] p-3 text-[11px] text-black shadow-[2px_2px_8px_rgba(0,0,0,0.45)] motion-reduce:animate-none"
    >
      <span
        aria-hidden="true"
        className="absolute right-9 -bottom-[7px] h-3.5 w-3.5 rotate-45 border-r border-b border-[#767676] bg-[#ffffe1]"
      />
      <div className="mb-1 flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white italic"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #8fc0f5, #1c48b0 75%)",
          }}
        >
          i
        </span>
        <p className="flex-1 text-[12px] font-bold">
          Добро пожаловать в TamirlanOS
        </p>
        <button
          type="button"
          aria-label="Закрыть подсказку"
          onClick={onClose}
          className="flex h-4 w-4 items-center justify-center rounded-sm text-[#555] hover:bg-black/10 focus-visible:outline-1 focus-visible:outline-black"
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
      <p className="leading-4">
        Точная копия интерфейса в стиле XP, собранная вручную, чтобы показать
        мои работы и внимание к деталям.
      </p>
      <p className="mt-1.5">
        Начать:{" "}
        <button
          type="button"
          className={linkClass}
          onClick={() => onOpenApp(AppKey.AboutMe)}
        >
          Обо мне
        </button>{" "}
        |{" "}
        <button
          type="button"
          className={linkClass}
          onClick={() => onOpenApp(AppKey.Projects)}
        >
          Мои проекты
        </button>
      </p>
    </div>
  );
}
