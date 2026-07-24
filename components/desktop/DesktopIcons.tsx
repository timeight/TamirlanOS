"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { ICON_GRID, slotToPosition } from "@/core/desktop/icon-grid";
import { cn } from "@/core/utils/cn";
import { useIsCompact } from "@/hooks/use-compact";
import { useDesktopStore } from "@/stores/desktop-store";
import type { DesktopIcon } from "@/types/desktop-icon";

interface DesktopIconsProps {
  onIconOpen: (icon: DesktopIcon) => void;
}

export function DesktopIcons({ onIconOpen }: DesktopIconsProps) {
  const icons = useDesktopStore((state) => state.icons);
  const selectedIconId = useDesktopStore((state) => state.selectedIconId);
  const selectIcon = useDesktopStore((state) => state.selectIcon);
  const compact = useIsCompact();

  return (
    <div
      className={cn(
        compact
          ? "absolute inset-0 flex flex-wrap content-start gap-1 overflow-auto p-3"
          : "contents",
      )}
    >
      {icons.map((icon) => {
        const position = slotToPosition(icon.slot);
        const selected = icon.id === selectedIconId;
        return (
          <button
            key={icon.id}
            type="button"
            aria-pressed={selected}
            onClick={(event) => {
              event.stopPropagation();
              selectIcon(icon.id);
            }}
            onDoubleClick={() => onIconOpen(icon)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onIconOpen(icon);
            }}
            style={
              compact
                ? { width: ICON_GRID.cellWidth }
                : {
                    width: ICON_GRID.cellWidth,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }
            }
            className={cn(
              "flex flex-col items-center gap-1 p-1 focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-dotted",
              !compact && "absolute top-0 left-0",
            )}
          >
            <Image
              src={icon.iconSrc}
              alt=""
              width={44}
              height={44}
              unoptimized
              draggable={false}
              className={cn(selected && "brightness-75 saturate-150")}
            />
            <span
              className={cn(
                "max-w-full px-1 text-center text-[11px] leading-tight text-white",
                selected
                  ? "bg-xp-selection"
                  : "[text-shadow:1px_1px_2px_rgb(0_0_0/0.9)]",
              )}
            >
              {icon.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
