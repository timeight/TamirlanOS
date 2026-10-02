"use client";

import {
  VkMobileHeader,
  type VkHeaderAction,
} from "@/components/apps/ie/pages/vk/mobile/VkMobileHeader";

interface VkMobileScreenProps {
  title: string;
  left: VkHeaderAction;
  right?: VkHeaderAction;
  children: React.ReactNode;
}

/** Каждый экран носит свою шапку: действия в ней принадлежат самому экрану. */
export function VkMobileScreen({
  title,
  left,
  right,
  children,
}: VkMobileScreenProps) {
  return (
    <section className="flex min-h-full flex-col">
      <VkMobileHeader title={title} left={left} right={right} />
      <div className="flex-1">{children}</div>
    </section>
  );
}
