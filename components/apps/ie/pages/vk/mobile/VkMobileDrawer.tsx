"use client";

import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { cn } from "@/core/utils/cn";
import { VK_DRAWER } from "@/core/vk/mobile-nav";
import { VK_SECTION, isImplemented } from "@/core/vk/sections";
import type { VkCounters } from "@/core/vk/social-types";
import { fullName, type VkProfileRow } from "@/core/vk/vk-types";

interface VkMobileDrawerProps {
  open: boolean;
  active: string;
  me: VkProfileRow | null;
  counters: VkCounters;
  onSelect: (section: string) => void;
  onClose: () => void;
  onSignOut: () => void;
}

function badgeFor(section: string, counters: VkCounters): number {
  if (section === VK_SECTION.friends) return counters.friendRequests;
  if (section === VK_SECTION.messages) return counters.unreadMessages;
  if (section === VK_SECTION.answers) return counters.unreadNotifications;
  return 0;
}

export function VkMobileDrawer({
  open,
  active,
  me,
  counters,
  onSelect,
  onClose,
  onSignOut,
}: VkMobileDrawerProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-30",
        open ? "visible" : "invisible delay-200",
      )}
    >
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/45 transition-opacity duration-200 motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <nav
        aria-label="Разделы ВКонтакте"
        className={cn(
          "absolute inset-y-0 left-0 flex w-[80%] max-w-[300px] flex-col overflow-y-auto bg-[#3b4d5e] transition-transform duration-200 ease-out motion-reduce:transition-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={() => onSelect(VK_SECTION.profile)}
          className="flex items-center gap-3 border-b border-[#4c6075] px-3 py-3 text-left active:bg-[#34495e]"
        >
          <VkAvatar size={44} src={me?.avatar_url} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-medium text-white">
              {me ? fullName(me) : "Гость"}
            </span>
            {me && (
              <span className="block truncate text-[12px] text-[#9fb0c0]">
                vk.com/{me.username}
              </span>
            )}
          </span>
          <VkGlyph name="chevron" size={13} className="text-[#7e93a6]" />
        </button>

        <ul className="flex-1 py-1">
          {VK_DRAWER.map((entry) => {
            const badge = badgeFor(entry.section, counters);
            return (
              <li key={entry.section}>
                <button
                  type="button"
                  onClick={() => onSelect(entry.section)}
                  className={cn(
                    "flex min-h-[44px] w-full items-center gap-3 px-3 text-left text-[15px]",
                    entry.section === active
                      ? "bg-[#34495e] text-white"
                      : "active:bg-[#34495e]",
                    isImplemented(entry.section)
                      ? "text-[#dce4eb]"
                      : "text-[#7e93a6]",
                  )}
                >
                  <VkGlyph name={entry.glyph} size={18} />
                  <span className="min-w-0 flex-1 truncate">
                    {entry.section}
                  </span>
                  {badge > 0 && (
                    <span className="rounded-sm bg-[#5181b8] px-1.5 text-[11px] leading-[17px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={onSignOut}
          className="min-h-[44px] border-t border-[#4c6075] px-3 text-left text-[15px] text-[#9fb0c0] active:bg-[#34495e]"
        >
          Выйти
        </button>
      </nav>
    </div>
  );
}
