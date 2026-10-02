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

/** Строка списка мобильного ВКонтакте: 44 px, тонкая линия, шеврон справа. */
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
  const body = (
    <>
      {avatar !== undefined && <VkAvatar size={40} src={avatar} />}
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="min-w-0 flex-1 truncate text-[15px] text-[#2a5885]">
            {title}
          </span>
          {meta && (
            <span className="shrink-0 text-[12px] text-[#95a0ab]">{meta}</span>
          )}
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[13px] text-[#7a7a7a]">
            {subtitle}
          </span>
        )}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className="shrink-0 rounded-sm bg-[#4a76a8] px-1.5 text-[11px] leading-[17px] font-bold text-white">
          {badge}
        </span>
      )}
      {chevron && (
        <VkGlyph name="chevron" size={13} className="shrink-0 text-[#c3cad1]" />
      )}
    </>
  );

  return (
    <li
      className={cn(
        "border-b border-[#e3e7ea]",
        unread && "bg-[#edf1f5]",
        "last:border-b-0",
      )}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="flex min-h-[56px] w-full items-center gap-3 px-3 py-2 text-left active:bg-[#e8edf2]"
        >
          {body}
        </button>
      ) : (
        <div className="flex min-h-[56px] items-center gap-3 px-3 py-2">
          {body}
        </div>
      )}
      {actions && (
        <div className="flex flex-wrap gap-2 px-3 pb-2.5 pl-[64px]">
          {actions}
        </div>
      )}
    </li>
  );
}
