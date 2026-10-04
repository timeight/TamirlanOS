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
    // Высота раздаётся по flex-цепочке, а не процентами: процент от родителя
    // с height:auto не резолвится, и чат схлопывался бы в ноль.
    <section className="flex min-h-full flex-col">
      <VkMobileHeader title={title} left={left} right={right} />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}
