"use client";

import { VK_NAV } from "@/core/browser/vk/vk-data";
import { cn } from "@/core/utils/cn";

interface VkSidebarProps {
  active: string;
  onSelect: (item: string) => void;
  onLeave: () => void;
}

export function VkSidebar({ active, onSelect, onLeave }: VkSidebarProps) {
  return (
    <div className="w-[168px] shrink-0 pt-3">
      <ul>
        {VK_NAV.map((item) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className={cn(
                "block w-full px-3 py-[3px] text-left text-[11px] leading-[16px]",
                item === active
                  ? "bg-[#dae1e8] font-bold text-[#2b587a]"
                  : "text-[#2b587a] hover:bg-[#e7ebf0] hover:underline",
              )}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-[#dae1e8] px-3 pt-2">
        <button
          type="button"
          onClick={onLeave}
          className="text-[11px] text-[#2b587a] hover:underline"
        >
          ← Выйти в TamirlanOS
        </button>
      </div>
    </div>
  );
}
