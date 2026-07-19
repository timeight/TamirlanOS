"use client";

import Image from "next/image";

import { siteConfig } from "@/core/config/site";

const STEPS = [
  {
    icon: "/assets/icons/portfolio.svg",
    text: "Double-click a desktop icon to open an application. Everything on this desktop is real and explorable.",
  },
  {
    icon: "/assets/icons/projects.svg",
    text: "Drag windows by their title bar, resize them from any edge, and use the taskbar to switch between them.",
  },
  {
    icon: "/assets/icons/about-me.svg",
    text: "The green start button holds every application, plus Turn Off Computer when you are done.",
  },
  {
    icon: "/assets/icons/settings.svg",
    text: "In the tray next to the clock: reopen this tour, toggle the CRT monitor effect, or go fullscreen (F11 works too).",
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
            Welcome to TamirlanOS
          </p>
          <p className="text-[#4a5a70]">
            The system is yours to explore — here is how it works.
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
        Built by Tamirlan Zhamalov · Tamirlan Studio
      </p>
    </div>
  );
}
