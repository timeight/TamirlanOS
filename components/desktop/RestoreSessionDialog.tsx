"use client";

import { useState } from "react";
import { getApplication } from "@/core/process/app-registry";
import { saveChoice } from "@/core/session/session-storage";
import { awayDays, awayKey } from "@/core/session/session-types";
import { useT } from "@/hooks/use-translations";
import { useSessionStore } from "@/stores/session-store";

interface RestoreSessionDialogProps {
  onRestore: () => void;
}

export function RestoreSessionDialog({ onRestore }: RestoreSessionDialogProps) {
  const phase = useSessionStore((state) => state.phase);
  const snapshot = useSessionStore((state) => state.snapshot);
  const awayMs = useSessionStore((state) => state.awayMs);
  const finish = useSessionStore((state) => state.finish);
  const [remember, setRemember] = useState(false);
  const t = useT();

  if (phase !== "asking" || !snapshot) return null;

  const decide = (restore: boolean) => {
    if (remember) saveChoice(restore ? "restore" : "fresh");
    if (restore) onRestore();
    else finish();
  };

  const names = snapshot.windows
    .map((entry) => getApplication(entry.appId)?.title ?? entry.appId)
    .join(", ");

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("session.title")}
        className="animate-window-open w-[min(420px,92vw)] rounded-t-[8px] bg-[var(--os-accent)] p-[3px] shadow-[3px_4px_16px_rgba(0,0,0,0.55)] motion-reduce:animate-none"
      >
        <p className="px-2 py-1 text-[12px] font-bold text-[var(--os-titlebar-text)]">
          {t("session.title")}
        </p>
        <div className="bg-[var(--os-face)] p-4">
          <p className="text-[12px] font-bold text-[var(--os-text-primary)]">
            {t(awayKey(awayMs))}
          </p>

          <dl className="mt-3 space-y-1 text-[11px] text-[var(--os-text-secondary)]">
            <div className="flex gap-2">
              <dt className="w-[104px] shrink-0">{t("session.last")}</dt>
              <dd>
                {awayDays(awayMs)} {t("session.days")}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-[104px] shrink-0">{t("session.windows")}</dt>
              <dd className="min-w-0 flex-1">{names || "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-[104px] shrink-0">{t("session.visits")}</dt>
              <dd>{snapshot.visits}</dd>
            </div>
          </dl>

          <label className="mt-4 flex items-center gap-2 text-[11px] text-[var(--os-text-secondary)]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            {t("session.remember")}
          </label>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => decide(false)}
              className="min-w-[96px] rounded-sm border border-[var(--os-frame)] bg-[var(--os-face)] px-3 py-1 text-[11px] hover:bg-[var(--os-hover-soft)] focus-visible:outline-1 focus-visible:outline-black active:translate-y-px"
            >
              {t("session.fresh")}
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => decide(true)}
              className="min-w-[96px] rounded-sm border border-[var(--os-frame)] bg-[var(--os-face)] px-3 py-1 text-[11px] font-bold hover:bg-[var(--os-hover-soft)] focus-visible:outline-1 focus-visible:outline-black active:translate-y-px"
            >
              {t("session.restore")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
