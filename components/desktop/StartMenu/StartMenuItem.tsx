"use client";

import Image from "next/image";
import { cn } from "@/core/utils/cn";

interface StartMenuItemProps {
  label: string;
  iconSrc: string;
  subtitle?: string;
  disabled?: boolean;
  bold?: boolean;
  onSelect?: () => void;
}

export function StartMenuItem({
  label,
  iconSrc,
  subtitle,
  disabled = false,
  bold = false,
  onSelect,
}: StartMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "group flex w-full items-center gap-2 px-2 py-1 text-left text-[11px]",
        bold && "font-bold",
        disabled
          ? "cursor-default opacity-45"
          : "hover:bg-xp-selection focus-visible:bg-xp-selection hover:text-white focus-visible:text-white focus-visible:outline-none",
      )}
    >
      <Image
        src={iconSrc}
        alt=""
        width={subtitle ? 30 : 24}
        height={subtitle ? 30 : 24}
        unoptimized
        draggable={false}
      />
      <span className="min-w-0">
        <span className="block truncate">{label}</span>
        {subtitle && (
          <span className="block truncate text-[10px] font-normal text-[#8a97a8] group-hover:text-white group-focus-visible:text-white">
            {subtitle}
          </span>
        )}
      </span>
    </button>
  );
}
