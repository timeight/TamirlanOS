"use client";

import { VkAuthScreen } from "@/components/apps/ie/pages/vk/VkAuthScreen";
import { VkMobileProfile } from "@/components/apps/ie/pages/vk/mobile/VkMobileProfile";
import { VkMobileSearch } from "@/components/apps/ie/pages/vk/mobile/VkMobileSearch";
import { VkMobileWall } from "@/components/apps/ie/pages/vk/mobile/VkMobileWall";
import { VK_NAV } from "@/core/browser/vk/vk-data";
import { signOut } from "@/core/vk/api/profiles";
import { cn } from "@/core/utils/cn";
import { VK_MY_PAGE, VK_SEARCH, type VkApp } from "@/hooks/use-vk-app";

interface VkMobileShellProps {
  app: VkApp;
  onLeave: () => void;
}

/** The three links m.vk.com kept in the bar; the rest lived in a plain list. */
const PRIMARY = [VK_MY_PAGE, VK_SEARCH, "Мои сообщения"] as const;
const SECONDARY = VK_NAV.filter(
  (item) => !(PRIMARY as readonly string[]).includes(item),
);

export function VkMobileShell({ app, onLeave }: VkMobileShellProps) {
  const { status, userId, me, shown, section, setSection, openProfile } = app;

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
        <nav className="border-b border-[#dde3e8] bg-[#f0f3f6] px-3 py-1.5 text-[12px]">
          {PRIMARY.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className="px-1.5 text-[#b9c3cc]">|</span>}
              <button
                type="button"
                onClick={() => setSection(item)}
                className={cn(
                  section === item
                    ? "font-bold text-[#45688e]"
                    : "text-[#2b587a]",
                )}
              >
                {item.replace("Мои ", "").replace("Моя ", "")}
              </button>
            </span>
          ))}
        </nav>
      )}

      {status === "loading" && (
        <p className="px-3 py-6 text-[12px] text-[#939393]">Загрузка...</p>
      )}

      {status === "guest" && (
        <div className="px-3 py-4">
          <VkAuthScreen />
        </div>
      )}

      {status === "signed-in" && section === VK_SEARCH && (
        <VkMobileSearch onOpenProfile={openProfile} />
      )}

      {status === "signed-in" && section === VK_MY_PAGE && shown && userId && (
        <>
          <VkMobileProfile profile={shown} isMe={shown.id === userId} />
          <VkMobileWall
            ownerId={shown.id}
            viewerId={userId}
            onOpenProfile={openProfile}
          />
        </>
      )}

      {status === "signed-in" &&
        section !== VK_MY_PAGE &&
        section !== VK_SEARCH && (
          <div className="px-3 py-6">
            <h1 className="text-[14px] font-bold text-[#2b587a]">{section}</h1>
            <p className="mt-1.5 text-[13px] text-[#777]">
              Этот раздел пока не загружен.
            </p>
            <button
              type="button"
              onClick={() => setSection(VK_MY_PAGE)}
              className="mt-2 text-[13px] text-[#2b587a]"
            >
              Вернуться на мою страницу
            </button>
          </div>
        )}

      {status === "signed-in" && (
        <nav className="border-t border-[#dde3e8]">
          <ul>
            {SECONDARY.map((item) => (
              <li key={item} className="border-b border-[#eef1f4]">
                <button
                  type="button"
                  onClick={() => setSection(item)}
                  className="block w-full px-3 py-2.5 text-left text-[13px] text-[#2b587a]"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <footer className="px-3 py-4 text-center text-[11px] text-[#939393]">
        {me ? `Вы вошли как ${me.first_name}` : "ВКонтакте © 2012"}
        <span className="mt-1 block">учебная реконструкция в TamirlanOS</span>
      </footer>
    </div>
  );
}
