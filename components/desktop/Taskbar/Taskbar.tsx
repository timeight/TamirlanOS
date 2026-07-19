"use client";

import { useState } from "react";
import { ShutdownDialog } from "@/components/desktop/ShutdownDialog";
import { StartMenu } from "@/components/desktop/StartMenu/StartMenu";
import { Clock } from "@/components/desktop/Taskbar/Clock";
import { StartButton } from "@/components/desktop/Taskbar/StartButton";
import { SystemTray } from "@/components/desktop/Taskbar/SystemTray";
import { TaskbarWindowButtons } from "@/components/desktop/Taskbar/TaskbarWindowButtons";
import { useAudioStore } from "@/stores/audio-store";
import { SoundEvent } from "@/types/sound";

export function Taskbar() {
  const [startOpen, setStartOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const play = useAudioStore((state) => state.play);

  const toggleStart = () => {
    play(SoundEvent.Click);
    setStartOpen((open) => !open);
  };

  return (
    <div
      role="toolbar"
      aria-label="Taskbar"
      className="absolute inset-x-0 bottom-0 z-[60] flex h-[30px] items-stretch"
      style={{
        background:
          "linear-gradient(180deg, #245edc 0%, #3f8cf3 9%, #245edc 18%, #245edc 92%, #1941a5 100%)",
        borderTop: "1px solid #0831d9",
      }}
    >
      <StartButton open={startOpen} onToggle={toggleStart} />
      <TaskbarWindowButtons />
      <div
        className="flex items-stretch pl-1.5"
        style={{
          background:
            "linear-gradient(180deg, #0c59b9 1%, #139ee9 6%, #18b5f2 10%, #148bd7 14%, #1290e9 19%, #0d81d4 63%, #127bcd 81%, #0d6cc1 88%, #0a5bab 94%, #1941a5 100%)",
          borderLeft: "1px solid #092e51",
          boxShadow: "inset 1px 0 1px rgba(255, 255, 255, 0.35)",
        }}
      >
        <SystemTray />
        <Clock />
      </div>
      {startOpen && (
        <StartMenu
          onClose={() => setStartOpen(false)}
          onShutdownRequest={() => setShutdownOpen(true)}
        />
      )}
      {shutdownOpen && (
        <ShutdownDialog onClose={() => setShutdownOpen(false)} />
      )}
    </div>
  );
}
