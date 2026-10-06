"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/core/utils/cn";
import { useContextMenuStore } from "@/stores/context-menu-store";
import type { MenuEntry } from "@/types/context-menu";

const EDGE = 4;

/** Меню системы: рисуется один раз в оболочке и читает запрос из стора. */
export function ContextMenu() {
  const open = useContextMenuStore((state) => state.open);
  const hide = useContextMenuStore((state) => state.hide);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    const onDown = () => hide();
    window.addEventListener("keydown", onKey);
    // capture: закрываем до того, как щелчок дойдёт до рабочего стола.
    window.addEventListener("pointerdown", onDown, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown, true);
    };
  }, [hide, open]);

  if (!open) return null;
  return <MenuPanel x={open.x} y={open.y} items={open.items} onClose={hide} />;
}

interface MenuPanelProps {
  x: number;
  y: number;
  items: readonly MenuEntry[];
  onClose: () => void;
  nested?: boolean;
}

function MenuPanel({ x, y, items, onClose, nested }: MenuPanelProps) {
  const panel = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x, y });
  const [openAt, setOpenAt] = useState<number | null>(null);

  // Положение правится после отрисовки: до неё размер меню неизвестен.
  useLayoutEffect(() => {
    const box = panel.current?.getBoundingClientRect();
    if (!box) return;
    const right = window.innerWidth - EDGE;
    const bottom = window.innerHeight - EDGE;
    setSpot({
      x: x + box.width > right ? Math.max(EDGE, x - box.width) : x,
      y: y + box.height > bottom ? Math.max(EDGE, y - box.height) : y,
    });
  }, [x, y]);

  return (
    <div
      ref={panel}
      role="menu"
      onPointerDown={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
      style={{ left: spot.x, top: spot.y }}
      className={cn(
        "fixed z-[200] min-w-[170px] border border-[#8d8d8d] bg-[#f1efe2] py-[2px]",
        "[font-family:Tahoma,Verdana,sans-serif] text-[11px] shadow-[2px_2px_4px_rgba(0,0,0,0.35)] select-none",
        nested && "z-[201]",
      )}
    >
      {items.map((entry, at) => {
        if (entry.kind === "separator") {
          return (
            <div
              key={`sep-${at}`}
              role="separator"
              className="my-[3px] ml-[26px] border-t border-[#c3c1b4]"
            />
          );
        }

        const isSub = entry.kind === "submenu";
        const expanded = isSub && openAt === at;

        return (
          <div key={entry.label} className="relative">
            <button
              type="button"
              role="menuitem"
              aria-haspopup={isSub || undefined}
              aria-expanded={isSub ? expanded : undefined}
              disabled={entry.disabled}
              onPointerEnter={() => setOpenAt(isSub ? at : null)}
              onClick={() => {
                if (entry.disabled) return;
                if (isSub) {
                  setOpenAt(expanded ? null : at);
                  return;
                }
                entry.onSelect?.();
                onClose();
              }}
              className={cn(
                "flex w-full items-center gap-2 py-[3px] pr-6 pl-[26px] text-left",
                entry.disabled
                  ? "text-[#9b9b94]"
                  : "text-[#1a1a1a] hover:bg-[#316ac5] hover:text-white",
              )}
            >
              <span className="flex-1 truncate">{entry.label}</span>
              {isSub && <span className="text-[9px]">▶</span>}
            </button>

            {expanded && entry.kind === "submenu" && (
              <MenuPanel
                nested
                x={spot.x + 160}
                y={spot.y + at * 20}
                items={entry.items}
                onClose={onClose}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
