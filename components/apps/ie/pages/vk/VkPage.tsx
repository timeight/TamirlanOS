"use client";

import { useEffect, useState } from "react";
import { VkAuthScreen } from "@/components/apps/ie/pages/vk/VkAuthScreen";
import { VkProfileCard } from "@/components/apps/ie/pages/vk/VkProfileCard";
import { VkSearch } from "@/components/apps/ie/pages/vk/VkSearch";
import { VkSidebar } from "@/components/apps/ie/pages/vk/VkSidebar";
import { VkWall } from "@/components/apps/ie/pages/vk/VkWall";
import { VK_NAV } from "@/core/browser/vk/vk-data";
import { fetchProfile, signOut } from "@/core/vk/api/profiles";
import { fullName, type VkProfileRow } from "@/core/vk/vk-types";
import { useVkSession } from "@/hooks/use-vk-session";
import { useVkSessionStore } from "@/stores/vk-session-store";

interface VkPageProps {
  onLeave: () => void;
}

const MY_PAGE = VK_NAV[0]!;
const SEARCH = "Поиск людей";

export function VkPage({ onLeave }: VkPageProps) {
  useVkSession();
  const status = useVkSessionStore((state) => state.status);
  const userId = useVkSessionStore((state) => state.userId);
  const me = useVkSessionStore((state) => state.profile);

  const [section, setSection] = useState(MY_PAGE);
  const [viewing, setViewing] = useState<VkProfileRow | null>(null);

  useEffect(() => {
    if (section === MY_PAGE) setViewing(null);
  }, [section]);

  const openProfile = async (profileId: string) => {
    setSection(MY_PAGE);
    if (profileId === userId) {
      setViewing(null);
      return;
    }
    setViewing(await fetchProfile(profileId));
  };

  const shown = viewing ?? me;

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
            extra={SEARCH}
          />
        )}

        <div className="min-w-0 flex-1 border-[#dae1e8] @[720px]:border-l @[720px]:pl-4">
          {status === "loading" && (
            <p className="py-10 text-[11px] text-[#939393]">Загрузка...</p>
          )}

          {status === "guest" && <VkAuthScreen />}

          {status === "signed-in" && section === SEARCH && (
            <VkSearch onOpenProfile={openProfile} />
          )}

          {status === "signed-in" && section === MY_PAGE && shown && userId && (
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
            section !== MY_PAGE &&
            section !== SEARCH && (
              <div className="py-10">
                <h1 className="text-[15px] font-bold text-[#2b587a]">
                  {section}
                </h1>
                <p className="mt-2 text-[12px] text-[#777]">
                  Этот раздел пока не загружен.
                </p>
                <button
                  type="button"
                  onClick={() => setSection(MY_PAGE)}
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
