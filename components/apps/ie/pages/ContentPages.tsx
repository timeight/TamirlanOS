"use client";

import { AppKey } from "@/core/apps/app-catalog";
import { useOpenApp } from "@/hooks/use-open-app";
import { useT } from "@/hooks/use-translations";
import type { AppId } from "@/types/application";

const ALBUMS = [
  { key: "street", tone: "#6b7f95" },
  { key: "portrait", tone: "#9c6b5a" },
  { key: "night", tone: "#2f3b57" },
  { key: "travel", tone: "#5a8a6b" },
] as const;

export function PhotographyPage() {
  const t = useT();
  return (
    <div className="bg-[#111] p-4 text-white">
      <p className="text-[18px] font-bold">Photography</p>
      <p className="mt-1 text-[11px] text-white/60">{t("ie.photo.sub")}</p>
      <div className="mt-4 grid gap-3 @sm:grid-cols-2">
        {ALBUMS.map((album) => (
          <div key={album.key} className="border border-white/15">
            <div
              className="grid h-24 grid-cols-3 gap-px"
              style={{ background: album.tone }}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <span
                  key={index}
                  className="block h-full"
                  style={{ background: album.tone, opacity: 0.6 + index * 0.2 }}
                />
              ))}
            </div>
            <p className="px-2 py-1.5 text-[12px] font-bold capitalize">
              {t(`ie.photo.${album.key}`)}
            </p>
          </div>
        ))}
      </div>
      <OpenAppButton appId={AppKey.Photography} label={t("ie.openGallery")} />
    </div>
  );
}

const AI_AREAS = [
  { key: "prompt", pct: 92 },
  { key: "automation", pct: 84 },
  { key: "llm", pct: 78 },
  { key: "vision", pct: 61 },
] as const;

export function AiLabPage() {
  const t = useT();
  return (
    <div className="bg-[#0a0e18] p-4 font-mono text-[#cbd5e1]">
      <p className="text-[18px] font-bold tracking-[0.14em] text-[#5fd4ff] uppercase">
        AI Lab
      </p>
      <p className="mt-1 text-[11px] text-slate-500">{t("ie.ai.sub")}</p>

      <div className="mt-4 space-y-2.5">
        {AI_AREAS.map((area) => (
          <div key={area.key}>
            <p className="mb-1 flex justify-between text-[11px]">
              <span>{t(`ie.ai.${area.key}`)}</span>
              <span className="text-[#c6f24e]">{area.pct}%</span>
            </p>
            <div className="h-1.5 bg-[#162033]">
              <div
                className="h-full bg-[#5fd4ff]"
                style={{ width: `${area.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 mb-1.5 text-[11px] tracking-[0.2em] text-[#c6f24e]">
        ACTIVE://
      </p>
      <ul className="space-y-1 text-[11px] leading-5">
        <li>{"// CutAI — AI-пайплайны для создателей контента"}</li>
        <li>{"// IRON FORM — оценка позы по камере, iOS"}</li>
        <li>{"// Агент 5.6 — ассистент этой операционной системы"}</li>
        <li>{"// MCP-интеграции и агентные сценарии"}</li>
      </ul>
    </div>
  );
}

export function SimplePage({
  titleKey,
  bodyKey,
  appId,
  openLabelKey,
}: {
  titleKey: string;
  bodyKey: string;
  appId: AppId;
  openLabelKey: string;
}) {
  const t = useT();
  return (
    <div className="bg-white p-5 text-[12px] text-[#333]">
      <p className="text-[17px] font-bold text-[#003399]">{t(titleKey)}</p>
      <p className="mt-2 max-w-[520px] leading-5">{t(bodyKey)}</p>
      <OpenAppButton appId={appId} label={t(openLabelKey)} />
    </div>
  );
}

export function NotFoundPage({ url }: { url: string }) {
  const t = useT();
  return (
    <div className="bg-white p-5 text-[12px] text-[#333]">
      <p className="text-[17px] font-bold">{t("ie.404.title")}</p>
      <p className="mt-2 max-w-[520px] leading-5">{t("ie.404.body")}</p>
      <ul className="mt-3 ml-4 list-disc space-y-0.5 text-[11px]">
        <li>{t("ie.404.hint1")}</li>
        <li>{t("ie.404.hint2")}</li>
      </ul>
      <p className="mt-4 border-t border-[#d4d0c8] pt-2 text-[11px] text-[#7a8390]">
        {t("ie.404.cannot")} <b>{url}</b>
      </p>
    </div>
  );
}

export function WindowsUpdatePage() {
  const t = useT();
  return (
    <div className="bg-white text-[12px] text-[#333]">
      <div className="bg-gradient-to-r from-[#1a56b8] to-[#3f8ed6] px-5 py-4 text-white">
        <p className="text-[18px] font-bold">Windows Update</p>
        <p className="text-[11px] text-white/85">{t("ie.upd.sub")}</p>
      </div>
      <div className="p-5">
        <p className="font-bold text-[#003399]">{t("ie.upd.available")}</p>
        <ul className="mt-2 space-y-1.5">
          <li>☑ TamirlanOS Service Pack 3 — {t("ie.upd.installed")}</li>
          <li>☑ Агент 5.6 — {t("ie.upd.installed")}</li>
          <li>☐ patience.sys — {t("ie.upd.pending")}</li>
          <li>☐ sleep_schedule.dll — {t("ie.upd.failed")}</li>
        </ul>
        <p className="mt-4 text-[11px] text-[#7a8390]">{t("ie.upd.note")}</p>
      </div>
    </div>
  );
}

export function SecretPage() {
  const t = useT();
  return (
    <div className="bg-black p-5 font-mono text-[12px] text-[#33ff66]">
      <p className="text-[15px]">{t("ie.secret.title")}</p>
      <p className="mt-3 leading-6">{t("ie.secret.body")}</p>
      <p className="mt-4 text-[#c6f24e]">{t("ie.secret.thanks")}</p>
      <p className="mt-6 text-[11px] text-[#33ff66]/60">
        &gt; connection closed by remote host
      </p>
    </div>
  );
}

export function DeveloperPage({ enabled }: { enabled: boolean }) {
  const t = useT();
  return (
    <div className="bg-[#1e1e1e] p-5 font-mono text-[12px] text-[#d4d4d4]">
      <p className="text-[15px] text-[#4ec9b0]">
        {enabled ? t("ie.dev.on") : t("ie.dev.off")}
      </p>
      <pre className="mt-3 leading-6 whitespace-pre-wrap">
        {`stack      : Next.js 15 · React 19 · TypeScript strict
styling    : Tailwind CSS v4 · container queries
state      : zustand + persist
hosting    : GitHub Pages (static export)
windows    : own manager — drag, resize, focus, z-order
apps       : ${t("ie.dev.apps")}
games      : 6
achievements: 22
i18n       : kk / ru / en
libraries  : 0 animation, 0 UI kit`}
      </pre>
      <p className="mt-4 text-[11px] text-[#808080]">{t("ie.dev.note")}</p>
    </div>
  );
}

function OpenAppButton({ appId, label }: { appId: AppId; label: string }) {
  const openApp = useOpenApp();
  return (
    <button
      type="button"
      onClick={() => openApp(appId)}
      className="mt-4 rounded-[3px] border border-[#2b6cb0] bg-gradient-to-b from-[#7cc0f5] to-[#3f8ed6] px-4 py-1 text-[11px] font-bold text-white hover:brightness-105"
    >
      {label}
    </button>
  );
}
