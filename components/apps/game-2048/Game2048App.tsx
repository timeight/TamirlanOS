"use client";

import { useEffect, useRef, useState } from "react";
import {
  createGame,
  move,
  type Direction,
  type Game,
} from "@/core/games/game2048";
import { AchievementId } from "@/core/achievements/catalog";
import { useAchievement } from "@/hooks/use-achievement";
import { useT } from "@/hooks/use-translations";

const TILE_STYLES: Record<number, { bg: string; fg: string }> = {
  0: { bg: "#cdc1b4", fg: "#cdc1b4" },
  2: { bg: "#eee4da", fg: "#776e65" },
  4: { bg: "#ede0c8", fg: "#776e65" },
  8: { bg: "#f2b179", fg: "#ffffff" },
  16: { bg: "#f59563", fg: "#ffffff" },
  32: { bg: "#f67c5f", fg: "#ffffff" },
  64: { bg: "#f65e3b", fg: "#ffffff" },
  128: { bg: "#edcf72", fg: "#ffffff" },
  256: { bg: "#edcc61", fg: "#ffffff" },
  512: { bg: "#edc850", fg: "#ffffff" },
  1024: { bg: "#edc53f", fg: "#ffffff" },
  2048: { bg: "#edc22e", fg: "#ffffff" },
};

const KEY_DIRS: Record<string, Direction> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  a: "left",
  d: "right",
  w: "up",
  s: "down",
};

export function Game2048App() {
  const [game, setGame] = useState<Game>(createGame);
  const start = useRef<{ x: number; y: number } | null>(null);
  const t = useT();

  useAchievement(
    AchievementId.TileMaster,
    Math.max(...game.grid.flat()) >= 512,
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const dir = KEY_DIRS[event.key];
      if (!dir) return;
      event.preventDefault();
      setGame((current) => move(current, dir));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPointerUp = (event: React.PointerEvent) => {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    const dir: Direction =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up";
    setGame((current) => move(current, dir));
  };

  return (
    <div className="flex h-full flex-col items-center gap-3 overflow-auto bg-[#faf8ef] p-4 text-[#776e65] select-none">
      <div className="flex w-full max-w-[340px] items-center justify-between">
        <div>
          <p className="text-[22px] font-bold">2048</p>
          <p className="text-[11px]">{t("g2048.hint")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-[#bbada0] px-3 py-1 text-center text-white">
            <p className="text-[9px] tracking-wide uppercase">
              {t("g2048.score")}
            </p>
            <p className="text-[15px] font-bold">{game.score}</p>
          </div>
          <button
            type="button"
            onClick={() => setGame(createGame())}
            className="rounded-md bg-[#8f7a66] px-3 py-2 text-[11px] font-bold text-white hover:brightness-110"
          >
            {t("mine.new")}
          </button>
        </div>
      </div>

      <div
        className="relative touch-none rounded-lg bg-[#bbada0] p-2"
        onPointerDown={(event) => {
          start.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={onPointerUp}
      >
        <div className="grid grid-cols-4 gap-2">
          {game.grid.flat().map((value, index) => {
            const style = TILE_STYLES[value] ?? TILE_STYLES[2048]!;
            return (
              <div
                key={index}
                className="flex h-[68px] w-[68px] items-center justify-center rounded-md font-bold @sm:h-[74px] @sm:w-[74px]"
                style={{
                  background: style.bg,
                  color: style.fg,
                  fontSize: value >= 1024 ? 20 : value >= 128 ? 24 : 28,
                }}
              >
                {value > 0 ? value : ""}
              </div>
            );
          })}
        </div>
        {(game.won || game.over) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
            <p className="text-[18px] font-bold">
              {game.won ? t("g2048.win") : t("g2048.over")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
