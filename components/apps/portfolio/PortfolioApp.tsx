"use client";

import Image from "next/image";
import { AppKey } from "@/core/apps/app-catalog";
import { listApplications } from "@/core/process/app-registry";
import { useOpenApp } from "@/hooks/use-open-app";

export function PortfolioApp() {
  const openApp = useOpenApp();
  const apps = listApplications().filter((app) => app.id !== AppKey.Portfolio);

  return (
    <div className="flex h-full flex-col bg-white text-[11px] text-black">
      <div className="border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2">
        <p className="text-[13px] font-bold text-[#003399]">
          Installed applications
        </p>
        <p className="text-[#4a5a70]">
          Everything that ships with TamirlanOS. Double-click to open.
        </p>
      </div>
      <ul className="grid flex-1 auto-rows-min grid-cols-2 gap-1 overflow-auto p-2 @sm:grid-cols-3 @lg:grid-cols-4">
        {apps.map((app) => (
          <li key={app.id}>
            <button
              type="button"
              onDoubleClick={() => openApp(app.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter") openApp(app.id);
              }}
              className="flex w-full flex-col items-center gap-1 rounded-sm p-2 hover:bg-[#ebf3fb] focus-visible:outline-1 focus-visible:outline-[#316ac5] focus-visible:outline-dotted"
            >
              <Image
                src={app.iconSrc}
                alt=""
                width={32}
                height={32}
                unoptimized
                draggable={false}
              />
              <span className="text-center leading-tight">{app.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
