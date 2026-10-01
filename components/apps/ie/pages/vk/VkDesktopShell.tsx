"use client";

import { VkAuthScreen } from "@/components/apps/ie/pages/vk/VkAuthScreen";
import { VkProfileCard } from "@/components/apps/ie/pages/vk/VkProfileCard";
import { VkSearch } from "@/components/apps/ie/pages/vk/VkSearch";
import { VkSidebar } from "@/components/apps/ie/pages/vk/VkSidebar";
import { VkWall } from "@/components/apps/ie/pages/vk/VkWall";
import { signOut } from "@/core/vk/api/profiles";
import { fullName } from "@/core/vk/vk-types";
import { VK_MY_PAGE, VK_SEARCH, type VkApp } from "@/hooks/use-vk-app";

interface VkDesktopShellProps {
  app: VkApp;
  onLeave: () => void;
}

export function VkDesktopShell({ app, onLeave }: VkDesktopShellProps) {
  const { status, userId, me, shown, section, setSection, openProfile } = app;

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
            onSelect={setSection}
            onLeave={onLeave}
            extra={VK_SEARCH}
          />
        )}

        <div className="min-w-0 flex-1 border-[#dae1e8] @[720px]:border-l @[720px]:pl-4">
          {status === "loading" && (
            <p className="py-10 text-[11px] text-[#939393]">Загрузка...</p>
          )}

          {status === "guest" && <VkAuthScreen />}

          {status === "signed-in" && section === VK_SEARCH && (
            <VkSearch onOpenProfile={openProfile} />
          )}

          {status === "signed-in" &&
            section === VK_MY_PAGE &&
            shown &&
            userId && (
              <>
                <VkProfileCard profile={shown} isMe={shown.id === userId} />
                <VkWall
                  ownerId={shown.id}
                  viewerId={userId}
                  viewerAvatar={me?.avatar_url ?? null}
                  onOpenProfile={openProfile}
                />
              </>
            )}

          {status === "signed-in" &&
            section !== VK_MY_PAGE &&
            section !== VK_SEARCH && (
              <div className="py-10">
                <h1 className="text-[15px] font-bold text-[#2b587a]">
                  {section}
                </h1>
                <p className="mt-2 text-[12px] text-[#777]">
                  Этот раздел пока не загружен.
                </p>
                <button
                  type="button"
                  onClick={() => setSection(VK_MY_PAGE)}
                  className="mt-3 text-[12px] text-[#2b587a] hover:underline"
                >
                  Вернуться на мою страницу
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[960px] px-2 py-3 text-[10px] text-[#939393]">
        ВКонтакте © 2012 · учебная реконструкция внутри TamirlanOS
      </div>
    </div>
  );
}
