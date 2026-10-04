"use client";

import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { cn } from "@/core/utils/cn";
import { VK_TABS } from "@/core/vk/mobile-nav";
import { VK_SECTION } from "@/core/vk/sections";
import type { VkCounters } from "@/core/vk/social-types";

interface VkMobileTabBarProps {
  active: string;
  counters: VkCounters;
  onSelect: (section: string) => void;
  onOpenMenu: () => void;
}

function badgeFor(section: string, counters: VkCounters): number {
  if (section === VK_SECTION.friends) return counters.friendRequests;
  if (section === VK_SECTION.messages) return counters.unreadMessages;
  return 0;
}

export function VkMobileTabBar({
  active,
  counters,
  onSelect,
  onOpenMenu,
}: VkMobileTabBarProps) {
  return (
    <nav
      aria-label="Основные разделы"
      className="flex h-[49px] shrink-0 border-t border-[#c6ced6] bg-[linear-gradient(#fcfdfd,#e7ebef)] shadow-[inset_0_1px_0_#fff]"
    >
      {VK_TABS.map((entry) => {
        const badge = badgeFor(entry.section, counters);
        return (
          <button
            key={entry.section}
            type="button"
            onClick={() => onSelect(entry.section)}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-[2px]",
              entry.section === active ? "text-[#4a76a8]" : "text-[#8a949e]",
            )}
          >
            <VkGlyph name={entry.glyph} size={19} />
            <span className="text-[10px] leading-none">{entry.short}</span>
            {badge > 0 && (
              <span className="absolute top-1 right-[20%] rounded-[2px] bg-[#cc3a3a] px-1 text-[10px] leading-[14px] font-bold text-white">
                {badge}
              </span>
            )}
          </button>
        );
      })}

      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Открыть меню"
        className="flex flex-1 flex-col items-center justify-center gap-[2px] text-[#8a949e]"
      >
        <VkGlyph name="menu" size={19} />
        <span className="text-[10px] leading-none">Ещё</span>
      </button>
    </nav>
  );
}
