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

/** Синяя полоса 44 px с лёгким градиентом — характер iOS-приложений той эпохи. */
export function VkMobileHeader({ title, left, right }: VkMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[46px] items-center border-b border-[#3e6594] bg-[linear-gradient(#5181b8,#4a76a8)] text-white">
      <button
        type="button"
        onClick={left.onClick}
        aria-label={left.label}
        className="flex h-[46px] w-[46px] shrink-0 items-center justify-center active:bg-[#41678f]"
      >
        <VkGlyph name={left.glyph} size={20} />
      </button>

      <h1 className="min-w-0 flex-1 truncate text-center text-[16px] font-medium">
        {title}
      </h1>

      {right ? (
        <button
          type="button"
          onClick={right.onClick}
          aria-label={right.label}
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center active:bg-[#41678f]"
        >
          <VkGlyph name={right.glyph} size={20} />
        </button>
      ) : (
        <span className="w-[46px] shrink-0" />
      )}
    </header>
  );
}
