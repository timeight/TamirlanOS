"use client";

import { VkAvatar } from "@/components/apps/ie/pages/vk/VkAvatar";
import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import { cn } from "@/core/utils/cn";

interface VkMobileRowProps {
  title: string;
  subtitle?: string | null;
  avatar?: string | null;
  meta?: string;
  badge?: number;
  chevron?: boolean;
  unread?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
}

/**
 * Ячейка списка iOS-эпохи: 43 px и разделитель, отступающий от левого края —
 * под аватаром линия не идёт, как в таблицах того времени.
 */
export function VkMobileRow({
  title,
  subtitle,
  avatar,
  meta,
  badge,
  chevron,
  unread,
  onClick,
  actions,
}: VkMobileRowProps) {
  const hasAvatar = avatar !== undefined;

  const body = (
    <>
      {hasAvatar && <VkAvatar size={40} src={avatar} />}
      <span className={cn("min-w-0 flex-1", hasAvatar && "ml-[9px]")}>
        <span className="block truncate text-[14px] leading-[16px] text-[#2a5885]">
          {title}
        </span>
        {subtitle && (
          <span className="mt-px block truncate text-[12px] leading-[15px] text-[#8a8a8a]">
            {subtitle}
          </span>
        )}
      </span>

      {meta && (
        <span className="ml-auto shrink-0 pl-2 text-[12px] text-[#9aa4ad]">
          {meta}
        </span>
      )}
      {badge !== undefined && badge > 0 && (
        <span className="ml-2 shrink-0 rounded-[2px] bg-[#cc3a3a] px-1 text-[10px] leading-[15px] font-bold text-white">
          {badge}
        </span>
      )}
      {chevron && (
        <VkGlyph
          name="chevron"
          size={11}
          className="ml-[7px] shrink-0 text-[#c3c9cf]"
        />
      )}
    </>
  );

  return (
    <li
      className={cn(
        "relative after:absolute after:right-0 after:bottom-0 after:h-px after:bg-[#d5d9de] after:content-['']",
        hasAvatar ? "after:left-[56px]" : "after:left-[10px]",
        unread ? "bg-[#eef3f8]" : "bg-white",
      )}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="flex min-h-[43px] w-full items-center px-[10px] py-1.5 text-left active:bg-[#e8edf2]"
        >
          {body}
        </button>
      ) : (
        <div className="flex min-h-[43px] items-center px-[10px] py-1.5">
          {body}
        </div>
      )}

      {actions && (
        <div
          className={cn(
            "flex flex-wrap gap-1.5 px-[10px] pb-2",
            hasAvatar && "pl-[56px]",
          )}
        >
          {actions}
        </div>
      )}
    </li>
  );
}
