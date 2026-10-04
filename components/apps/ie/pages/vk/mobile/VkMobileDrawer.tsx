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
          "absolute inset-y-0 left-0 flex w-[76%] max-w-[295px] flex-col bg-[linear-gradient(#3e5265,#32424f)] shadow-[2px_0_6px_rgba(0,0,0,0.4)] transition-transform duration-200 ease-out motion-reduce:transition-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={() => onSelect(VK_SECTION.profile)}
          className="flex shrink-0 items-center border-b border-[#4e6275] px-[10px] py-[11px] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] active:bg-[#34495e]"
        >
          <VkAvatar size={46} src={me?.avatar_url} />
          <span className="ml-2.5 min-w-0 flex-1">
            <span className="block truncate text-[15px] font-bold text-white">
              {me ? fullName(me) : "Гость"}
            </span>
            {me && (
              <span className="mt-px block truncate text-[11px] text-[#9fb0c0]">
                vk.com/{me.username}
              </span>
            )}
          </span>
          <VkGlyph name="chevron" size={11} className="text-[#7e93a6]" />
        </button>

        <ul className="min-h-0 flex-1 overflow-y-auto">
          {VK_DRAWER.map((entry) => {
            const badge = badgeFor(entry.section, counters);
            const live = isImplemented(entry.section);
            return (
              <li key={entry.section}>
                <button
                  type="button"
                  onClick={() => onSelect(entry.section)}
                  className={cn(
                    "flex h-[42px] w-full items-center border-b border-white/[0.055] px-[10px] text-left text-[14px]",
                    entry.section === active
                      ? "bg-[linear-gradient(#4a6075,#405466)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "active:bg-[#34495e]",
                    live ? "text-[#dbe3ea]" : "text-[#8295a6]",
                  )}
                >
                  <span
                    className={cn(
                      "mr-[11px] flex w-[19px] justify-center",
                      live ? "text-[#9fb0c0]" : "text-[#6f8295]",
                    )}
                  >
                    <VkGlyph name={entry.glyph} size={18} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {entry.section}
                  </span>
                  {badge > 0 ? (
                    <span className="rounded-[2px] bg-[#cc3a3a] px-1 text-[10px] leading-[15px] font-bold text-white">
                      {badge}
                    </span>
                  ) : (
                    live && (
                      <VkGlyph
                        name="chevron"
                        size={11}
                        className="text-[#7e93a6]"
                      />
                    )
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={onSignOut}
          className="h-[42px] shrink-0 border-t border-[#4e6275] px-[10px] text-left text-[14px] text-[#9fb0c0] active:bg-[#34495e]"
        >
          Выйти
        </button>
      </nav>
    </div>
  );
}
