"use client";

import { VK_NAV, VK_SECTION, isImplemented } from "@/core/vk/sections";
import { cn } from "@/core/utils/cn";
import type { VkCounters } from "@/core/vk/social-types";

interface VkSidebarProps {
  active: string;
  counters: VkCounters;
  onSelect: (item: string) => void;
  onLeave: () => void;
}

/** Поиска людей в меню 2012 года не было — он дописан в конец. */
const ITEMS: readonly string[] = [...VK_NAV, VK_SECTION.search];

function badgeFor(item: string, counters: VkCounters): number {
  if (item === VK_SECTION.friends) return counters.friendRequests;
  if (item === VK_SECTION.messages) return counters.unreadMessages;
  if (item === VK_SECTION.answers) return counters.unreadNotifications;
  return 0;
}

export function VkSidebar({
  active,
  counters,
  onSelect,
  onLeave,
}: VkSidebarProps) {
  return (
    <div className="w-[168px] shrink-0 pt-3" role="navigation">
      <ul>
        {ITEMS.map((item) => {
          const badge = badgeFor(item, counters);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  "flex w-full items-center gap-1.5 px-3 py-[3px] text-left text-[11px] leading-[16px]",
                  item === active
                    ? "bg-[#dae1e8] font-bold text-[#2b587a]"
                    : "text-[#2b587a] hover:bg-[#e7ebf0] hover:underline",
                  !isImplemented(item) && "text-[#8a9aa8]",
                )}
              >
                <span className="min-w-0 truncate">{item}</span>
                {badge > 0 && (
                  <span className="ml-auto shrink-0 bg-[#8b1a1a] px-1 text-[10px] leading-[14px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
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
