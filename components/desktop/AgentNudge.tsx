"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { NUDGES } from "@/core/agent/nudges";
import { useAgentNudges } from "@/hooks/use-agent-nudges";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import { useAgentStore } from "@/stores/agent-store";

const AGENT_ICON = "/assets/icons/agent.svg";

export function AgentNudge() {
  useAgentNudges();
  const currentId = useAgentStore((state) => state.currentNudgeId);
  const accept = useAgentStore((state) => state.accept);
  const dismiss = useAgentStore((state) => state.dismiss);
  const mute = useAgentStore((state) => state.mute);
  const openApp = useOpenApp();
  const t = useT();

  if (!currentId) return null;
  const nudge = NUDGES.find((item) => item.id === currentId);
  if (!nudge) return null;

  return (
    <div
      role="status"
      className="animate-fade-in absolute right-3 bottom-[40px] z-[59] w-[min(300px,calc(100vw-24px))] rounded-md border border-[#767676] bg-[#ffffe1] p-3 text-black shadow-[2px_2px_8px_rgba(0,0,0,0.45)] motion-reduce:animate-none"
    >
      <span
        aria-hidden="true"
        className="absolute right-9 -bottom-[7px] h-3.5 w-3.5 rotate-45 border-r border-b border-[#767676] bg-[#ffffe1]"
      />
      <div className="flex items-start gap-2.5">
        <Image
          src={AGENT_ICON}
          alt=""
          width={22}
          height={22}
          unoptimized
          className="mt-0.5 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-[#1c4e80]">
            {t("agent.botName")}
          </p>
          <p className="mt-0.5 text-[11px] leading-4">{t(nudge.messageKey)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {nudge.action && (
              <button
                type="button"
                onClick={() => {
                  accept();
                  if (nudge.action) openApp(nudge.action);
                }}
                className="rounded-[3px] border border-[#2b6cb0] bg-gradient-to-b from-[#7cc0f5] to-[#3f8ed6] px-2.5 py-0.5 text-[11px] font-bold text-white hover:brightness-105"
              >
                {t("nudge.show")}
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="rounded-[3px] border border-[#a9a9a9] bg-white px-2.5 py-0.5 text-[11px] hover:bg-[#f0f0f0]"
            >
              {t("nudge.later")}
            </button>
            <button
              type="button"
              onClick={mute}
              className="ml-auto text-[10px] text-[#6b7785] underline hover:text-[#2b6cb0]"
            >
              {t("nudge.mute")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
