"use client";

import { useRef, useState } from "react";
import { VkProfileCard } from "@/components/apps/ie/pages/vk/VkProfileCard";
import { VkSidebar } from "@/components/apps/ie/pages/vk/VkSidebar";
import { VkWall } from "@/components/apps/ie/pages/vk/VkWall";
import { VK_NAV, VK_PROFILE } from "@/core/browser/vk/vk-data";

interface VkPageProps {
  onLeave: () => void;
}

const MY_PAGE = VK_NAV[0]!;

export function VkPage({ onLeave }: VkPageProps) {
  const [section, setSection] = useState(MY_PAGE);
  const profileRef = useRef<HTMLDivElement>(null);

  // Clicking an author on the wall walks back up to the profile it belongs to.
  const openAuthor = () => {
    setSection(MY_PAGE);
    profileRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <div className="min-w-[960px] bg-[#eceff3] [font-family:Tahoma,Verdana,Arial,sans-serif] text-[#000] select-text">
      <div className="border-b border-[#4a6785] bg-[#5e81a8]">
        <div className="mx-auto flex w-[960px] items-center gap-4 px-2 py-1.5">
          <span className="text-[17px] leading-none font-bold tracking-tight text-white">
            ВКонтакте
          </span>
          <input
            placeholder="Поиск"
            aria-label="Поиск"
            className="w-[180px] border border-[#8aa5c2] bg-white px-1.5 py-[2px] text-[11px] outline-none"
          />
          <span className="ml-auto flex items-center gap-3 text-[11px] text-white">
            <span>{VK_PROFILE.name}</span>
            <button type="button" onClick={onLeave} className="hover:underline">
              выход
            </button>
          </span>
        </div>
      </div>

      <div className="mx-auto flex w-[960px] gap-4 bg-white px-2 pb-8">
        <VkSidebar active={section} onSelect={setSection} onLeave={onLeave} />

        <div className="min-w-0 flex-1 border-l border-[#dae1e8] pl-4">
          {section === MY_PAGE ? (
            <div ref={profileRef}>
              <VkProfileCard />
              <VkWall onOpenAuthor={openAuthor} />
            </div>
          ) : (
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

      <div className="mx-auto w-[960px] px-2 py-3 text-[10px] text-[#939393]">
        ВКонтакте © 2012 · русский · О сайте · Реклама · Разработчикам
      </div>
    </div>
  );
}
