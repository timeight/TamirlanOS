"use client";

import { VkGlyph } from "@/components/apps/ie/pages/vk/mobile/VkGlyph";
import type { VkGlyphName } from "@/core/vk/glyphs";

export interface VkHeaderAction {
  glyph: VkGlyphName;
  label: string;
  onClick: () => void;
}

interface VkMobileHeaderProps {
  title: string;
  left: VkHeaderAction;
  right?: VkHeaderAction;
}

/**
 * Navigation bar iOS-эпохи: 44 px, вертикальный градиент, светлая линия
 * сверху как внутренний блик и тёмная граница снизу.
 */
export function VkMobileHeader({ title, left, right }: VkMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[44px] shrink-0 items-center border-b border-[#3c6291] bg-[linear-gradient(#5b86b8,#4a76a8)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
      <button
        type="button"
        onClick={left.onClick}
        aria-label={left.label}
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-[#eaf0f7] active:bg-[#41678f]"
      >
        <VkGlyph name={left.glyph} size={19} />
      </button>

      <h1 className="min-w-0 flex-1 truncate text-center text-[15px] font-bold [text-shadow:0_-1px_0_rgba(0,0,0,0.2)]">
        {title}
      </h1>

      {right ? (
        <button
          type="button"
          onClick={right.onClick}
          aria-label={right.label}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-[#eaf0f7] active:bg-[#41678f]"
        >
          <VkGlyph name={right.glyph} size={19} />
        </button>
      ) : (
        <span className="w-[44px] shrink-0" />
      )}
    </header>
  );
}
