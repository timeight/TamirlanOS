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
      className="flex shrink-0 border-t border-[#ccd4dd] bg-[linear-gradient(#fbfcfd,#eff2f5)]"
    >
      {VK_TABS.map((entry) => {
        const badge = badgeFor(entry.section, counters);
        return (
          <button
            key={entry.section}
            type="button"
            onClick={() => onSelect(entry.section)}
            className={cn(
              "relative flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5",
              entry.section === active ? "text-[#4a76a8]" : "text-[#8a949e]",
            )}
          >
            <VkGlyph name={entry.glyph} size={20} />
            <span className="text-[10px] leading-none">{entry.short}</span>
            {badge > 0 && (
              <span className="absolute top-1.5 right-[22%] rounded-sm bg-[#cc3a3a] px-1 text-[10px] leading-[14px] font-bold text-white">
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
        className="flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 text-[#8a949e]"
      >
        <VkGlyph name="menu" size={20} />
        <span className="text-[10px] leading-none">Ещё</span>
      </button>
    </nav>
  );
}
