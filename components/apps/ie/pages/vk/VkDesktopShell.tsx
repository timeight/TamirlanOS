"use client";

import { VkAuthScreen } from "@/components/apps/ie/pages/vk/VkAuthScreen";
import { VkProfileCard } from "@/components/apps/ie/pages/vk/VkProfileCard";
import { VkSectionView } from "@/components/apps/ie/pages/vk/VkSectionView";
import { VkSidebar } from "@/components/apps/ie/pages/vk/VkSidebar";
import { VkWall } from "@/components/apps/ie/pages/vk/VkWall";
import { VK_SECTION } from "@/core/vk/sections";
import { signOut } from "@/core/vk/api/profiles";
import { fullName } from "@/core/vk/vk-types";
import type { VkApp } from "@/hooks/use-vk-app";

interface VkDesktopShellProps {
  app: VkApp;
  onLeave: () => void;
}

export function VkDesktopShell({ app, onLeave }: VkDesktopShellProps) {
  const { status, userId, me, shown, section, setSection, openProfile, write } =
    app;
  const onProfile = section === VK_SECTION.profile;

  return (
    <div className="@container bg-[#eceff3] [font-family:Tahoma,Verdana,Arial,sans-serif] text-[#000] select-text">
      <div className="border-b border-[#4a6785] bg-[#5e81a8]">
        <div className="mx-auto flex w-full max-w-[960px] items-center gap-4 px-2 py-1.5">
          <span className="text-[17px] leading-none font-bold tracking-tight text-white">
            ВКонтакте
          </span>
          <span className="ml-auto flex items-center gap-3 text-[11px] text-white">
            {me && <span>{fullName(me)}</span>}
            {status === "signed-in" && (
              <button
                type="button"
                onClick={() => void signOut()}
                className="hover:underline"
              >
                выйти
              </button>
            )}
            <button type="button" onClick={onLeave} className="hover:underline">
              закрыть
            </button>
          </span>
        </div>
      </div>

      <div className="mx-auto flex min-h-[420px] w-full max-w-[960px] gap-4 bg-white px-2 pb-8">
        {status === "signed-in" && (
          <VkSidebar
            active={section}
            counters={app.counters}
            onSelect={setSection}
            onLeave={onLeave}
          />
        )}

        <div className="min-w-0 flex-1 border-[#dae1e8] @[720px]:border-l @[720px]:pl-4">
          {status === "loading" && (
            <p className="py-10 text-[11px] text-[#939393]">Загрузка...</p>
          )}

          {status === "guest" && <VkAuthScreen />}

          {status === "signed-in" && userId && onProfile && shown && (
            <>
              <VkProfileCard
                profile={shown}
                isMe={shown.id === userId}
                viewerId={userId}
                onWrite={(id) => void write(id)}
                onOpenProfile={openProfile}
              />
              <VkWall
                ownerId={shown.id}
                viewerId={userId}
                viewerAvatar={me?.avatar_url ?? null}
                onOpenProfile={openProfile}
                focusPostId={app.focusPostId}
              />
            </>
          )}

          {status === "signed-in" && userId && !onProfile && (
            <VkSectionView app={app} userId={userId} />
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[960px] px-2 py-3 text-[10px] text-[#939393]">
        ВКонтакте © 2012 · учебная реконструкция внутри TamirlanOS
      </div>
    </div>
  );
}
