"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/core/utils/cn";

interface MenuItem {
  label: string;
  onSelect?: () => void;
}

interface Menu {
  label: string;
  items: readonly MenuItem[];
}

interface WindowMenuBarProps {
  onClose: () => void;
  onAbout: () => void;
}

export function WindowMenuBar({ onClose, onAbout }: WindowMenuBarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const menus: readonly Menu[] = [
    { label: "Файл", items: [{ label: "Закрыть", onSelect: onClose }] },
    { label: "Правка", items: [{ label: "Отменить" }, { label: "Повторить" }] },
    {
      label: "Вид",
      items: [{ label: "Панель инструментов" }, { label: "Строка состояния" }],
    },
    { label: "Избранное", items: [{ label: "Добавить в избранное" }] },
    { label: "Справка", items: [{ label: "О TamirlanOS", onSelect: onAbout }] },
  ];

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    const onDown = (event: PointerEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [openIndex]);

  return (
    <div
      ref={barRef}
      role="menubar"
      className="relative flex shrink-0 items-stretch border-b border-[#aca899] bg-[#f7f5ec] px-1 text-[11px] text-black select-none"
    >
      {menus.map((menu, index) => (
        <div key={menu.label} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={openIndex === index}
            onClick={() =>
              setOpenIndex((current) => (current === index ? null : index))
            }
            onPointerEnter={() =>
              setOpenIndex((current) => (current === null ? current : index))
            }
            className={cn(
              "px-2 py-1 focus-visible:outline-1 focus-visible:outline-[#316ac5]",
              openIndex === index
                ? "bg-xp-selection text-white"
                : "hover:bg-[#d6e6f8]",
            )}
          >
            {menu.label}
          </button>
          {openIndex === index && (
            <div
              role="menu"
              className="absolute top-full left-0 z-10 min-w-[170px] border border-[#8a8676] bg-white py-1 shadow-[2px_2px_6px_rgba(0,0,0,0.3)]"
            >
              {menu.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  disabled={!item.onSelect}
                  onClick={() => {
                    item.onSelect?.();
                    setOpenIndex(null);
                  }}
                  className="hover:bg-xp-selection flex w-full px-4 py-1 text-left hover:text-white disabled:text-[#9aa0a6] disabled:hover:bg-transparent disabled:hover:text-[#9aa0a6]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
