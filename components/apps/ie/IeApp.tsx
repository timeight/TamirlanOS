"use client";

import { useEffect, useRef, useState } from "react";
import { IeToolbar } from "@/components/apps/ie/IeToolbar";
import { IeStatusBar } from "@/components/apps/ie/IeStatusBar";
import { SecurityWarning } from "@/components/apps/ie/SecurityWarning";
import { ContentPagesRouter } from "@/components/apps/ie/IeRouter";
import { HOME_PAGE, PageId } from "@/core/browser/pages";
import { useT } from "@/hooks/use-translations";
import { useBrowserStore } from "@/stores/browser-store";

const PHASE_STEPS = [
  { phase: "opening", ms: 120 },
  { phase: "connecting", ms: 160 },
  { phase: "loading", ms: 180 },
] as const;

export function IeApp() {
  const page = useBrowserStore((state) => state.current());
  const phase = useBrowserStore((state) => state.phase);
  const setPhase = useBrowserStore((state) => state.setPhase);
  const navigate = useBrowserStore((state) => state.navigate);
  const devMode = useBrowserStore((state) => state.devMode);
  const enableDevMode = useBrowserStore((state) => state.enableDevMode);
  const [external, setExternal] = useState<{
    url: string;
    host: string;
  } | null>(null);
  const timers = useRef<number[]>([]);
  const t = useT();

  const go = (input: string) => {
    navigate(input);
    if (input.toLowerCase().includes("developer")) enableDevMode();
  };

  useEffect(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    let elapsed = 0;
    for (const step of PHASE_STEPS) {
      elapsed += step.ms;
      timers.current.push(
        window.setTimeout(() => setPhase(step.phase), elapsed - step.ms),
      );
    }
    timers.current.push(window.setTimeout(() => setPhase("done"), elapsed));
    return () => timers.current.forEach(window.clearTimeout);
  }, [page, setPhase]);

  const busy = phase !== "done" && phase !== "idle";

  return (
    <div className="@container flex h-full flex-col bg-[#ece9d8] select-none">
      <IeToolbar onNavigate={go} busy={busy} />

      <div className={cnBody(busy)} aria-busy={busy} aria-live="polite">
        {busy ? (
          <p className="p-6 text-[12px] text-[#7a8390]">
            {t("ie.status.loading")}
          </p>
        ) : (
          <ContentPagesRouter
            page={page}
            devMode={devMode}
            onNavigate={go}
            onExternal={(url, host) => setExternal({ url, host })}
          />
        )}
      </div>

      <IeStatusBar phase={phase} url={page.url || HOME_PAGE.url} />

      {external && (
        <SecurityWarning
          host={external.host}
          onCancel={() => setExternal(null)}
          onConfirm={() => {
            window.open(external.url, "_blank", "noreferrer");
            setExternal(null);
          }}
        />
      )}
    </div>
  );
}

function cnBody(busy: boolean) {
  return [
    "relative min-h-0 flex-1 overflow-auto border border-[#7f9db9] bg-white",
    busy ? "cursor-progress" : "cursor-auto",
  ].join(" ");
}

export { PageId };
