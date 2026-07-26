"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";

import { siteConfig } from "@/core/config/site";
import { useT } from "@/hooks/use-translations";

const STEPS = [
  { icon: "/assets/icons/portfolio.svg", text: "welcome.step1" },
  { icon: "/assets/icons/projects.svg", text: "welcome.step2" },
  { icon: "/assets/icons/about-me.svg", text: "welcome.step3" },
  { icon: "/assets/icons/settings.svg", text: "welcome.step4" },
] as const;

export function WelcomeApp() {
  const t = useT();
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
            {t("boot.welcome")}
          </p>
          <p className="text-[#4a5a70]">{t("welcome.subtitle")}</p>
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
            <p className="leading-4">{t(step.text)}</p>
          </li>
        ))}
      </ul>
      <p className="border-t border-[#d8d5c4] bg-[#ece9d8] px-3 py-2 text-[#4a5a70]">
        {t("welcome.footer")}
      </p>
    </div>
  );
}
