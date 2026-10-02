import { VK_GLYPH, type VkGlyphName } from "@/core/vk/glyphs";

interface VkGlyphProps {
  name: VkGlyphName;
  size?: number;
  className?: string;
}

export function VkGlyph({ name, size = 18, className }: VkGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={VK_GLYPH[name]} fill="currentColor" />
    </svg>
  );
}
