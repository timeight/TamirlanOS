interface VkAvatarProps {
  size: number;
}

/** The grey silhouette VK showed before a photo was uploaded. */
export function VkAvatar({ size }: VkAvatarProps) {
  return (
    <span
      style={{ width: size, height: size }}
      className="block shrink-0 overflow-hidden border border-[#c5cdd5] bg-[#e8ebee]"
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-full w-full">
        <rect width="48" height="48" fill="#dfe4e9" />
        <circle cx="24" cy="18" r="8" fill="#b6c0ca" />
        <path d="M8 48c0-9 7.2-14 16-14s16 5 16 14z" fill="#b6c0ca" />
      </svg>
    </span>
  );
}
