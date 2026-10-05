"use client";

import { useState } from "react";
import { VkAuthScreen } from "@/components/apps/ie/pages/vk/VkAuthScreen";
import { VkPlayerHost } from "@/components/apps/ie/pages/vk/VkPlayerHost";
import { VkMobilePlayerBar } from "@/components/apps/ie/pages/vk/mobile/VkMobilePlayerBar";
import { VkMobileDrawer } from "@/components/apps/ie/pages/vk/mobile/VkMobileDrawer";
import { VkMobileHeader } from "@/components/apps/ie/pages/vk/mobile/VkMobileHeader";
import { VkMobileSection } from "@/components/apps/ie/pages/vk/mobile/VkMobileSection";
import { signOut } from "@/core/vk/api/profiles";
import type { VkApp } from "@/hooks/use-vk-app";
import { VK_TEXT } from "@/core/vk/ui-text";

interface VkMobileShellProps {
  app: VkApp;
  onLeave: () => void;
}

/**
 * Оболочка занимает высоту окна Internet Explorer и скроллит содержимое
 * сама: иначе выдвижное меню оказалось бы привязано к длине стены, а не
 * к видимой части экрана.
 */
export function VkMobileShell({ app, onLeave }: VkMobileShellProps) {
  const { status, userId, me, section, setSection } = app;
  const [menuOpen, setMenuOpen] = useState(false);

  const choose = (next: string) => {
    setMenuOpen(false);
    setSection(next);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white [font-family:Arial,Helvetica,sans-serif] text-[#2a2a2a] select-text">
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {status !== "signed-in" && (
          <>
            <VkMobileHeader
              title="ВКонтакте"
              left={{
                glyph: "back",
                label: "Выйти в TamirlanOS",
                onClick: onLeave,
              }}
            />
            {status === "loading" ? (
              <p className="px-[10px] py-6 text-[13px] text-[#9aa4ad]">
                {VK_TEXT.loading}
              </p>
            ) : (
              <div className="px-3 py-4">
                <VkAuthScreen />
              </div>
            )}
            <footer className="border-t border-[#d5d9de] px-[10px] py-3 text-center text-[11px] text-[#9aa4ad]">
              ВКонтакте © 2012 · учебная реконструкция в TamirlanOS
            </footer>
          </>
        )}

        {status === "signed-in" && userId && (
          <VkMobileSection
            app={app}
            userId={userId}
            onMenu={() => setMenuOpen(true)}
          />
        )}
      </div>

      {status === "signed-in" && <VkMobilePlayerBar />}
      {status === "signed-in" && <VkPlayerHost />}

      {status === "signed-in" && (
        <VkMobileDrawer
          open={menuOpen}
          active={section}
          me={me}
          counters={app.counters}
          onSelect={choose}
          onClose={() => setMenuOpen(false)}
          onSignOut={() => {
            setMenuOpen(false);
            void signOut();
          }}
        />
      )}
    </div>
  );
}
