import { create } from "zustand";
import { FIRST_BOOT_STAGE, nextBootStage } from "@/core/boot/boot-sequence";
import { canTransition } from "@/core/system/system-transitions";
import { SystemPhase, type SystemState } from "@/types/system";

interface SystemStore extends SystemState {
  restartPending: boolean;
  powerOn: () => void;
  advanceBoot: () => void;
  logIn: () => void;
  logOff: () => void;
  shutDown: () => void;
  restart: () => void;
  powerOff: () => void;
}

export const useSystemStore = create<SystemStore>()((set, get) => {
  const moveTo = (phase: SystemPhase) => {
    if (canTransition(get().phase, phase)) {
      set({ phase, bootStage: null });
    }
  };

  return {
    phase: SystemPhase.Off,
    bootStage: null,
    restartPending: false,

    powerOn: () => {
      if (canTransition(get().phase, SystemPhase.Booting)) {
        set({ phase: SystemPhase.Booting, bootStage: FIRST_BOOT_STAGE });
      }
    },

    advanceBoot: () => {
      const { phase, bootStage } = get();
      if (phase !== SystemPhase.Booting || bootStage === null) return;
      const next = nextBootStage(bootStage);
      if (next === null) {
        moveTo(SystemPhase.Login);
      } else {
        set({ bootStage: next });
      }
    },

    logIn: () => moveTo(SystemPhase.Desktop),
    logOff: () => moveTo(SystemPhase.Login),
    shutDown: () => moveTo(SystemPhase.ShuttingDown),

    restart: () => {
      if (canTransition(get().phase, SystemPhase.ShuttingDown)) {
        set({
          phase: SystemPhase.ShuttingDown,
          bootStage: null,
          restartPending: true,
        });
      }
    },

    powerOff: () => {
      const { phase, restartPending } = get();
      if (!canTransition(phase, SystemPhase.Off)) return;
      if (restartPending) {
        // The machine touches Off only conceptually: a restart powers straight back on.
        set({
          phase: SystemPhase.Booting,
          bootStage: FIRST_BOOT_STAGE,
          restartPending: false,
        });
      } else {
        set({ phase: SystemPhase.Off, bootStage: null });
      }
    },
  };
});
