"use client";

import {
  Row,
  SettingsSection,
  Slider,
  Toggle,
  XpButton,
} from "@/components/apps/control-panel/XpControls";
import { ACHIEVEMENT_TOTAL } from "@/core/achievements/catalog";
import { tryResolve } from "@/core/kernel/service-registry";
import { OS_VERSION } from "@/core/system/runtime-managers";
import { THEME_MANAGER } from "@/core/system/theme-manager";
import { cn } from "@/core/utils/cn";
import type { SettingsBinding } from "@/hooks/use-settings";
import { useAchievementStore } from "@/stores/achievement-store";
import { useAudioStore } from "@/stores/audio-store";
import { useDesktopStore } from "@/stores/desktop-store";
import { useIcqStore } from "@/stores/icq-store";
import { useLostFilesStore } from "@/stores/lost-files-store";
import { usePetStore } from "@/stores/pet-store";
import { SoundEvent } from "@/types/sound";

export function AppearancePage({ settings, set }: SettingsBinding) {
  const themes = tryResolve(THEME_MANAGER)?.list() ?? [];

  return (
    <SettingsSection title="Тема оформления">
      <p className="mt-1 text-[11px] text-[var(--os-text-secondary)]">
        Изменения применяются сразу, без перезагрузки.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => set("theme", theme.id)}
            className={cn(
              "w-[120px] border p-1 text-left text-[10px]",
              settings.theme === theme.id
                ? "border-[var(--os-accent)] bg-[var(--os-hover)]"
                : "border-[var(--os-frame)] bg-[var(--os-face)]",
            )}
          >
            <span
              aria-hidden="true"
              className="block h-10 border border-[var(--os-frame)]"
              style={{
                background: `linear-gradient(180deg, ${theme.colors.titlebarActiveFrom} 0 34%, ${theme.colors.windowBackground} 34%)`,
              }}
            />
            <span className="mt-1 block truncate">{theme.name}</span>
          </button>
        ))}
      </div>
    </SettingsSection>
  );
}

export function DesktopPage({ settings, set }: SettingsBinding) {
  const crtEnabled = useDesktopStore((state) => state.crtEnabled);
  const toggleCrt = useDesktopStore((state) => state.toggleCrt);

  return (
    <>
      <SettingsSection title="Значки рабочего стола">
        <Toggle
          label="Показывать значки"
          checked={settings.showDesktopIcons}
          onChange={(value) => set("showDesktopIcons", value)}
        />
      </SettingsSection>
      <SettingsSection title="Оформление">
        <Toggle
          label="Анимация окон и рабочего стола"
          checked={settings.animations}
          onChange={(value) => set("animations", value)}
        />
        <Toggle
          label="Эффект ЭЛТ-монитора"
          checked={crtEnabled}
          onChange={(value) => {
            set("crtEnabled", value);
            if (useDesktopStore.getState().crtEnabled !== value) toggleCrt();
          }}
          hint="Тонкие линии развёртки поверх экрана"
        />
        <Toggle
          label="Погодные эффекты"
          checked={settings.weatherEnabled}
          onChange={(value) => set("weatherEnabled", value)}
        />
      </SettingsSection>
    </>
  );
}

export function PixPage({ settings, set }: SettingsBinding) {
  const friendship = usePetStore((state) => state.friendship);
  const unread = useIcqStore((state) => state.unread);

  return (
    <>
      <SettingsSection title="Помощник">
        <Toggle
          label="Показывать PIX на рабочем столе"
          checked={settings.petEnabled}
          onChange={(value) => {
            set("petEnabled", value);
            if (usePetStore.getState().enabled !== value) {
              usePetStore.getState().toggleEnabled();
            }
          }}
        />
      </SettingsSection>
      <SettingsSection title="Состояние">
        <Row label="Уровень дружбы" value={`${Math.round(friendship)} / 100`} />
        <Row label="Непрочитанных в ICQ" value={String(unread)} />
        <div
          aria-hidden="true"
          className="mt-2 h-3 border border-[var(--os-frame)] bg-[var(--os-field-background)]"
        >
          <div
            className="h-full bg-[var(--os-accent)] transition-[width] duration-200 motion-reduce:transition-none"
            style={{ width: `${Math.min(friendship, 100)}%` }}
          />
        </div>
      </SettingsSection>
    </>
  );
}

export function SoundPage({ settings, set }: SettingsBinding) {
  const play = useAudioStore((state) => state.play);
  const setVolume = useAudioStore((state) => state.setVolume);
  const toggleMute = useAudioStore((state) => state.toggleMute);
  const muted = useAudioStore((state) => state.muted);

  return (
    <SettingsSection title="Громкость системы">
      <Slider
        label="Общая громкость"
        value={settings.volume}
        min={0}
        max={1}
        step={0.01}
        display={`${Math.round(settings.volume * 100)}%`}
        onChange={(value) => {
          set("volume", value);
          setVolume(value);
        }}
      />
      <Toggle
        label="Выключить все звуки"
        checked={muted}
        onChange={() => {
          toggleMute();
          set("muted", !muted);
        }}
      />
      <div className="mt-3 flex gap-2">
        <XpButton onClick={() => play(SoundEvent.Notification)}>
          Проверка
        </XpButton>
        <XpButton onClick={() => play(SoundEvent.Boot)}>Звук запуска</XpButton>
      </div>
    </SettingsSection>
  );
}

export function AccessibilityPage({ settings, set }: SettingsBinding) {
  return (
    <SettingsSection title="Специальные возможности">
      <Toggle
        label="Уменьшить движение"
        checked={settings.reducedMotion}
        onChange={(value) => set("reducedMotion", value)}
        hint="Анимации сворачиваются в мгновенную смену состояния"
      />
      <Toggle
        label="Высокая контрастность"
        checked={settings.highContrast}
        onChange={(value) => set("highContrast", value)}
      />
      <p className="mt-3 text-[10px] leading-4 text-[var(--os-text-secondary)]">
        Системная настройка «prefers-reduced-motion» соблюдается всегда,
        независимо от этих переключателей.
      </p>
    </SettingsSection>
  );
}

function storageBytes(): number {
  if (typeof localStorage === "undefined") return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("tamirlanos")) {
      total += key.length + (localStorage.getItem(key)?.length ?? 0);
    }
  }
  return total;
}

export function SystemPage({ settings, reset }: SettingsBinding) {
  const unlocked = useAchievementStore((state) => state.unlocked.length);
  const lostRead = useLostFilesStore((state) => state.read.length);

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tamirlanos-config.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SettingsSection title="Сведения о системе">
        <Row label="Версия TamirlanOS" value={OS_VERSION} />
        <Row label="Ядро" value="kernel 1.0 · 9 менеджеров" />
        <Row label="Язык системы" value={settings.locale} />
        <Row label="Тема" value={settings.theme} />
        <Row label="Достижения" value={`${unlocked} из ${ACHIEVEMENT_TOTAL}`} />
        <Row label="Прочитано в архиве" value={`${lostRead} файлов`} />
        <Row
          label="Занято в хранилище"
          value={`${(storageBytes() / 1024).toFixed(1)} КБ`}
        />
      </SettingsSection>
      <SettingsSection title="Обслуживание">
        <div className="mt-2 flex flex-wrap gap-2">
          <XpButton onClick={exportConfig}>Экспорт…</XpButton>
          <XpButton tone="danger" onClick={reset}>
            Сбросить параметры
          </XpButton>
        </div>
        <p className="mt-2 text-[10px] leading-4 text-[var(--os-text-secondary)]">
          Сброс возвращает системные параметры к заводским. Достижения, архив и
          переписка не затрагиваются.
        </p>
      </SettingsSection>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <SettingsSection title="TamirlanOS">
        <Row label="Версия" value={OS_VERSION} />
        <Row label="Автор" value="Тамирлан Жамалов" />
        <Row label="Исходный код" value="github.com/timeight/TamirlanOS" />
      </SettingsSection>
      <SettingsSection title="Технологии">
        <Row label="Каркас" value="Next.js 15 · React 19" />
        <Row label="Язык" value="TypeScript, строгий режим" />
        <Row label="Стили" value="Tailwind CSS 4, токены темы" />
        <Row label="Состояние" value="zustand" />
        <Row label="Звук" value="Web Audio API" />
      </SettingsSection>
      <SettingsSection title="Благодарности">
        <p className="mt-1 text-[11px] leading-[1.6] text-[var(--os-text-primary)]">
          Windows XP — за интерфейс, который помнят до сих пор. Winamp — за то,
          что музыка выглядела так же хорошо, как звучала. И всем, кто дочитал
          до этого окна.
        </p>
      </SettingsSection>
    </>
  );
}
