"use client";

import { VkAuthScreen } from "@/components/apps/ie/pages/vk/VkAuthScreen";
import { VkSectionView } from "@/components/apps/ie/pages/vk/VkSectionView";
import { VkMobileNav } from "@/components/apps/ie/pages/vk/mobile/VkMobileNav";
import { VkMobileProfile } from "@/components/apps/ie/pages/vk/mobile/VkMobileProfile";
import { VkMobileWall } from "@/components/apps/ie/pages/vk/mobile/VkMobileWall";
import { VK_SECTION } from "@/core/vk/sections";
import { signOut } from "@/core/vk/api/profiles";
import type { VkApp } from "@/hooks/use-vk-app";

interface VkMobileShellProps {
  app: VkApp;
  onLeave: () => void;
}

export function VkMobileShell({ app, onLeave }: VkMobileShellProps) {
  const { status, userId, shown, section, setSection, openProfile, write } =
    app;
  const onProfile = section === VK_SECTION.profile;

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-white [font-family:Arial,Tahoma,sans-serif] text-[#000] select-text">
      <header className="flex items-center justify-between bg-[#5e81a8] px-3 py-2">
        <span className="text-[16px] leading-none font-bold text-white">
          ВКонтакте
        </span>
        <span className="flex gap-3 text-[12px] text-white">
          {status === "signed-in" && (
            <button type="button" onClick={() => void signOut()}>
              выйти
            </button>
          )}
          <button type="button" onClick={onLeave}>
            закрыть
          </button>
        </span>
      </header>

      {status === "signed-in" && (
        <VkMobileNav
          active={section}
          counters={app.counters}
          onSelect={setSection}
        />
      )}

      {status === "loading" && (
        <p className="px-3 py-6 text-[12px] text-[#939393]">Загрузка...</p>
      )}

      {status === "guest" && (
        <div className="px-3 py-4">
          <VkAuthScreen />
        </div>
      )}

      {status === "signed-in" && userId && onProfile && shown && (
        <>
          <VkMobileProfile
            profile={shown}
            isMe={shown.id === userId}
            viewerId={userId}
            onWrite={(id) => void write(id)}
            onOpenProfile={openProfile}
          />
          <VkMobileWall
            ownerId={shown.id}
            viewerId={userId}
            onOpenProfile={openProfile}
          />
        </>
      )}

      {status === "signed-in" && userId && !onProfile && (
        <div className="px-3">
          <VkSectionView app={app} userId={userId} />
        </div>
      )}

      <footer className="border-t border-[#dde3e8] px-3 py-4 text-center text-[11px] text-[#939393]">
        ВКонтакте © 2012
        <span className="mt-1 block">учебная реконструкция в TamirlanOS</span>
      </footer>
    </div>
  );
}
