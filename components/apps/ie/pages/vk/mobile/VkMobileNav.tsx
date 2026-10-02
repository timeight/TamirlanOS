"use client";

import { VK_NAV, VK_SECTION, isImplemented } from "@/core/vk/sections";
import { cn } from "@/core/utils/cn";
import type { VkCounters } from "@/core/vk/social-types";

interface VkMobileNavProps {
  active: string;
  counters: VkCounters;
  onSelect: (section: string) => void;
}

/** m.vk.com держал в полосе несколько ссылок, остальное — обычным списком. */
const PRIMARY: readonly string[] = [
  VK_SECTION.profile,
  VK_SECTION.friends,
  VK_SECTION.messages,
  VK_SECTION.search,
];

const SECONDARY: readonly string[] = VK_NAV.filter(
  (item) => !PRIMARY.includes(item),
);

const SHORT: Record<string, string> = {
  [VK_SECTION.profile]: "страница",
  [VK_SECTION.friends]: "друзья",
  [VK_SECTION.messages]: "сообщения",
  [VK_SECTION.search]: "поиск",
};

function badgeFor(item: string, counters: VkCounters): number {
  if (item === VK_SECTION.friends) return counters.friendRequests;
  if (item === VK_SECTION.messages) return counters.unreadMessages;
  if (item === VK_SECTION.answers) return counters.unreadNotifications;
  return 0;
}

export function VkMobileNav({ active, counters, onSelect }: VkMobileNavProps) {
  return (
    <nav className="border-b border-[#dde3e8] bg-[#f0f3f6]">
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-[13px]">
        {PRIMARY.map((item) => {
          const badge = badgeFor(item, counters);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  "min-h-[44px] px-1",
                  item === active
                    ? "font-bold text-[#45688e]"
                    : "text-[#2b587a]",
                )}
              >
                {SHORT[item] ?? item}
                {badge > 0 && (
                  <span className="ml-1 bg-[#8b1a1a] px-1 text-[11px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <ul className="flex flex-wrap gap-x-3 border-t border-[#e6eaef] px-3 py-1.5 text-[12px]">
        {SECONDARY.map((item) => {
          const badge = badgeFor(item, counters);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  "min-h-[44px] px-1",
                  item === active && "font-bold",
                  isImplemented(item) ? "text-[#2b587a]" : "text-[#9aa7b3]",
                )}
              >
                {item.replace(/^Мои /, "").replace(/^Моя /, "")}
                {badge > 0 && (
                  <span className="ml-1 bg-[#8b1a1a] px-1 text-[11px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
