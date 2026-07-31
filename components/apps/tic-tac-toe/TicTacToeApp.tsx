"use client";

import { useEffect, useState } from "react";
import {
  bestMoveTTT,
  winnerTTT,
  type Board,
  type Mark,
} from "@/core/games/tictactoe";
import { AchievementId } from "@/core/achievements/catalog";
import { cn } from "@/core/utils/cn";
import { useAchievement } from "@/hooks/use-achievement";
import { useT } from "@/hooks/use-translations";

const EMPTY: Board = Array.from({ length: 9 }, () => null);

export function TicTacToeApp() {
  const [board, setBoard] = useState<Board>(EMPTY);
  const [turn, setTurn] = useState<Mark>("X");
  const [vsAI, setVsAI] = useState(true);
  const t = useT();

  const result = winnerTTT(board);
  const thinking = vsAI && turn === "O" && !result;

  useAchievement(AchievementId.Stalemate, vsAI && result === "draw");

  useEffect(() => {
    if (!thinking) return;
    const id = window.setTimeout(() => {
      const index = bestMoveTTT(board, "O");
      if (index < 0) return;
      setBoard((current) => {
        const next = [...current];
        next[index] = "O";
        return next;
      });
      setTurn("X");
    }, 300);
    return () => window.clearTimeout(id);
  }, [thinking, board]);

  const reset = () => {
    setBoard(EMPTY);
    setTurn("X");
  };

  const play = (index: number) => {
    if (result || board[index] || thinking) return;
    const next = [...board];
    next[index] = turn;
    setBoard(next);
    setTurn(turn === "X" ? "O" : "X");
  };

  const status = result
    ? result === "draw"
      ? t("ttt.draw")
      : result === "X"
        ? t("ttt.winX")
        : t("ttt.winO")
    : thinking
      ? t("chk.thinking")
      : turn === "X"
        ? t("ttt.turnX")
        : t("ttt.turnO");

  return (
    <div className="flex h-full flex-col items-center gap-3 overflow-auto bg-[#ece9d8] p-4 text-black select-none">
      <div className="flex flex-wrap items-center justify-center gap-2 text-[12px]">
        <span className="font-bold">{status}</span>
        <button
          type="button"
          onClick={() => {
            setVsAI((value) => !value);
            reset();
          }}
          className={cn(
            "rounded-[3px] border border-[#003c74] px-2 py-1 text-[11px]",
            vsAI
              ? "bg-gradient-to-b from-[#cfe0ff] to-[#a9c6f5]"
              : "bg-gradient-to-b from-white to-[#ecebe5]",
          )}
        >
          {vsAI ? t("chk.vsAI") : t("chk.twoPlayers")}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-2 py-1 text-[11px]"
        >
          {t("mine.new")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            onClick={() => play(index)}
            className="flex h-20 w-20 items-center justify-center rounded-md border border-[#aca899] bg-white text-4xl font-bold focus-visible:outline-2 focus-visible:outline-[#316ac5] @sm:h-24 @sm:w-24"
            style={{ color: cell === "X" ? "#1f66c4" : "#d8352a" }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
