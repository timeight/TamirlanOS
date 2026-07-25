"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";

import { siteConfig } from "@/core/config/site";

const STEPS = [
  {
    icon: "/assets/icons/portfolio.svg",
    text: "Дважды кликните по иконке на рабочем столе, чтобы открыть приложение. Всё здесь настоящее и доступно для изучения.",
  },
  {
    icon: "/assets/icons/projects.svg",
    text: "Перетаскивайте окна за заголовок, меняйте размер за любой край и переключайтесь между ними через панель задач.",
  },
  {
    icon: "/assets/icons/about-me.svg",
    text: "В зелёной кнопке «Пуск» — все приложения, а также «Выключить компьютер», когда закончите.",
  },
  {
    icon: "/assets/icons/settings.svg",
    text: "В трее у часов: заново открыть этот тур, включить эффект ЭЛТ-монитора или перейти в полный экран (работает и F11).",
  },
] as const;

export function WelcomeApp() {
  return (
    <div className="flex h-full flex-col bg-white text-[11px] text-black">
      <div className="flex items-center gap-3 border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2.5">
        <Image
          src={siteConfig.avatarSrc}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="rounded-md border border-[#aca899]"
        />
        <div>
          <p className="text-[14px] font-bold text-[#003399]">
            Добро пожаловать в TamirlanOS
          </p>
          <p className="text-[#4a5a70]">
            Система в вашем распоряжении — вот как она работает.
          </p>
        </div>
      </div>
      <ul className="flex-1 space-y-3 overflow-auto p-3">
        {STEPS.map((step) => (
          <li key={step.icon} className="flex items-start gap-2.5">
            <Image
              src={step.icon}
              alt=""
              width={24}
              height={24}
              unoptimized
              draggable={false}
            />
            <p className="leading-4">{step.text}</p>
          </li>
        ))}
      </ul>
      <p className="border-t border-[#d8d5c4] bg-[#ece9d8] px-3 py-2 text-[#4a5a70]">
        Сделано Тамирланом Жамаловым · Tamirlan Studio
      </p>
    </div>
  );
}
