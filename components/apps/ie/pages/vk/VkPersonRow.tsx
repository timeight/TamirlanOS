"use client";

import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { fullName, type VkProfileRow } from "@/core/vk/vk-types";

interface VkPersonRowProps {
  profile: VkProfileRow;
  onOpenProfile: (profileId: string) => void;
  /** Кнопки справа: «добавить», «написать», «удалить» — зависит от списка. */
  actions?: React.ReactNode;
  note?: string;
}

export function VkPersonRow({
  profile,
  onOpenProfile,
  actions,
  note,
}: VkPersonRowProps) {
  return (
    <li className="flex items-center gap-2.5 border-b border-[#e3e8ec] py-2">
      <button
        type="button"
        onClick={() => onOpenProfile(profile.id)}
        aria-label={fullName(profile)}
      >
        <VkAvatar size={40} src={profile.avatar_url} />
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onOpenProfile(profile.id)}
          className="block truncate text-[12px] font-bold text-[#2b587a] hover:underline"
        >
          {fullName(profile)}
        </button>
        <p className="truncate text-[10px] text-[#939393]">
          vk.com/{profile.username}
          {profile.city ? ` · ${profile.city}` : ""}
          {note ? ` · ${note}` : ""}
        </p>
      </div>

      {actions && (
        <span className="flex shrink-0 items-center gap-1.5">{actions}</span>
      )}
    </li>
  );
}
