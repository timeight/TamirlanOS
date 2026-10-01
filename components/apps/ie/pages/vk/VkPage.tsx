"use client";

import { VkDesktopShell } from "@/components/apps/ie/pages/vk/VkDesktopShell";
import { VkMobileShell } from "@/components/apps/ie/pages/vk/mobile/VkMobileShell";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useVkApp } from "@/hooks/use-vk-app";

interface VkPageProps {
  onLeave: () => void;
}

/** The 2012 site served m.vk.com below this width; we split at the same place. */
const MOBILE = "(max-width: 767px)";

export function VkPage({ onLeave }: VkPageProps) {
  const app = useVkApp();
  const mobile = useMediaQuery(MOBILE);

  return mobile ? (
    <VkMobileShell app={app} onLeave={onLeave} />
  ) : (
    <VkDesktopShell app={app} onLeave={onLeave} />
  );
}
