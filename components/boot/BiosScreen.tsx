"use client";

import { useEffect, useState } from "react";
import {
  BIOS_COPYRIGHT,
  BIOS_ID,
  BIOS_VENDOR,
  CPU_LINE,
  DEVICE_ROWS,
  MEMORY_STEP_KB,
  MEMORY_TOTAL_KB,
  POST_LINES,
  formatMemory,
} from "@/core/boot/post-report";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSkipBoot } from "@/hooks/use-skip-boot";
import { useTimeout } from "@/hooks/use-timeout";
import { useT } from "@/hooks/use-translations";
import { useSystemStore } from "@/stores/system-store";

const MEMORY_TICK_MS = 55;
const DEVICE_REVEAL_START_MS = 2000;
const DEVICE_REVEAL_STEP_MS = 160;
const TOTAL_MS = 3400;

export function BiosScreen() {
  const advanceBoot = useSystemStore((state) => state.advanceBoot);
  const reducedMotion = useReducedMotion();
  const t = useT();
  const [memoryKb, setMemoryKb] = useState(reducedMotion ? MEMORY_TOTAL_KB : 0);
  const [elapsed, setElapsed] = useState(reducedMotion ? TOTAL_MS : 0);

  useSkipBoot(advanceBoot);
  useTimeout(advanceBoot, reducedMotion ? 400 : TOTAL_MS);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setMemoryKb((kb) => Math.min(MEMORY_TOTAL_KB, kb + MEMORY_STEP_KB));
      setElapsed((ms) => ms + MEMORY_TICK_MS);
    }, MEMORY_TICK_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const devicesShown = Math.max(
    0,
    Math.floor((elapsed - DEVICE_REVEAL_START_MS) / DEVICE_REVEAL_STEP_MS),
  );
  const memoryDone = memoryKb >= MEMORY_TOTAL_KB;

  return (
    <div className="h-full overflow-hidden bg-black px-4 py-3 font-mono text-[13px] leading-[1.45] text-[#c8c8c8] sm:px-8 sm:py-6 sm:text-[15px]">
      <p className="text-white">{BIOS_VENDOR}</p>
      <p>{BIOS_COPYRIGHT}</p>

      <p className="mt-5">{CPU_LINE}</p>
      <p>
        {t("bios.memoryTest")} : {formatMemory(memoryKb)}
        {memoryDone && <span className="ml-2 text-white">OK</span>}
      </p>

      {memoryDone && (
        <div className="mt-5">
          {POST_LINES.slice(0, Math.max(1, devicesShown)).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      {devicesShown > 0 && (
        <table className="mt-4 w-full max-w-[520px] text-left">
          <tbody>
            {DEVICE_ROWS.slice(0, devicesShown).map((row) => (
              <tr key={row.channel}>
                <td className="pr-6 whitespace-nowrap">{row.channel}</td>
                <td className="text-white">: {row.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {devicesShown >= DEVICE_ROWS.length && (
        <p className="mt-5 text-white">
          {t("bios.startingOs")}
          <span
            aria-hidden="true"
            className="animate-blink ml-1 motion-reduce:animate-none"
          >
            _
          </span>
        </p>
      )}

      <div className="mt-8 space-y-0.5 text-[12px] text-[#8a8a8a] sm:text-[13px]">
        <p>{t("bios.setupHint")}</p>
        <p>{BIOS_ID}</p>
      </div>
    </div>
  );
}
