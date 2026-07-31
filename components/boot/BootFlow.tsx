"use client";

import { BiosScreen } from "@/components/boot/BiosScreen";
import { BsodScreen } from "@/components/boot/BsodScreen";
import { DesktopShell } from "@/components/desktop/DesktopShell";
import { LoadingScreen } from "@/components/boot/LoadingScreen";
import { PowerOffScreen } from "@/components/boot/PowerOffScreen";
import { ShutdownScreen } from "@/components/boot/ShutdownScreen";
import { WelcomeScreen } from "@/components/boot/WelcomeScreen";
import { LoginScreen } from "@/components/login/LoginScreen";
import { useAudioUnlock } from "@/hooks/use-audio-unlock";
import { useClickSound } from "@/hooks/use-click-sound";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useRageCrash } from "@/hooks/use-rage-crash";
import { useSystemStore } from "@/stores/system-store";
import { BootStage } from "@/types/boot";
import { SystemPhase } from "@/types/system";

export function BootFlow() {
  const phase = useSystemStore((state) => state.phase);
  const bootStage = useSystemStore((state) => state.bootStage);
  const crashed = useSystemStore((state) => state.crashed);

  useAudioUnlock();
  useClickSound();
  useDocumentTitle();
  useRageCrash();

  if (crashed) return <BsodScreen />;
  if (phase === SystemPhase.Off) return <PowerOffScreen />;
  if (phase === SystemPhase.Booting) {
    if (bootStage === BootStage.Bios) return <BiosScreen />;
    if (bootStage === BootStage.Loading) return <LoadingScreen />;
    if (bootStage === BootStage.Welcome) return <WelcomeScreen />;
  }
  if (phase === SystemPhase.Login) return <LoginScreen />;
  if (phase === SystemPhase.Desktop) return <DesktopShell />;
  if (phase === SystemPhase.ShuttingDown) return <ShutdownScreen />;
  return null;
}
