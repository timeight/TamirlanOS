"use client";

import { useState } from "react";
import {
  createBoard,
  minesLeft,
  reveal,
  toggleFlag,
  type Board,
} from "@/core/games/minesweeper";
import { cn } from "@/core/utils/cn";

const ROWS = 9;
const COLS = 9;
const MINES = 10;

const NUMBER_COLORS = [
  "",
  "#1f38c4",
  "#2f7d32",
  "#c62027",
  "#0b2a75",
  "#7a1f1a",
  "#0f7c86",
  "#1a1a1a",
  "#6b6b6b",
];

export function MinesweeperApp() {
  const [board, setBoard] = useState<Board>(() =>
    createBoard(ROWS, COLS, MINES),
  );
  const [flagMode, setFlagMode] = useState(false);

  const face =
    board.state === "won" ? "😎" : board.state === "lost" ? "😵" : "🙂";

  const onCell = (r: number, c: number) => {
    setBoard((current) =>
      flagMode ? toggleFlag(current, r, c) : reveal(current, r, c),
    );
  };

  return (
    <div className="flex h-full flex-col items-center gap-2 overflow-auto bg-[#c0c0b8] p-3 text-black select-none">
      <div className="flex items-center gap-4 rounded-sm border-2 border-[#7d7a6c] bg-[#d6d3c4] px-3 py-1.5">
        <span className="min-w-9 bg-black px-1 text-center font-mono text-[15px] text-[#ff3b30]">
          {String(Math.max(0, minesLeft(board))).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="Новая игра"
          onClick={() => setBoard(createBoard(ROWS, COLS, MINES))}
          className="flex h-7 w-7 items-center justify-center rounded-sm border-2 border-[#7d7a6c] bg-[#e6e3d4] text-[15px]"
        >
          {face}
        </button>
        <button
          type="button"
          onClick={() => setFlagMode((on) => !on)}
          className={cn(
            "rounded-sm border-2 border-[#7d7a6c] px-2 py-0.5 text-[11px]",
            flagMode ? "bg-[#f7d94e]" : "bg-[#e6e3d4]",
          )}
        >
          🚩 {flagMode ? "вкл" : "выкл"}
        </button>
      </div>
      <div
        className="grid gap-px border-2 border-[#7d7a6c] bg-[#9d9a8c]"
        style={{ gridTemplateColumns: `repeat(${COLS}, 26px)` }}
      >
        {board.cells.map((row, r) =>
          row.map((cell, c) => {
            const revealed = cell.state === "revealed";
            return (
              <button
                key={`${r}:${c}`}
                type="button"
                onClick={() => onCell(r, c)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  setBoard((current) => toggleFlag(current, r, c));
                }}
                className={cn(
                  "h-[26px] w-[26px] text-center font-mono text-[14px] leading-[26px] font-bold",
                  revealed
                    ? "bg-[#d6d3c4]"
                    : "border-t-2 border-l-2 border-t-white border-l-white bg-[#c0bdb0] shadow-[inset_-2px_-2px_0_#8f8c7e]",
                )}
                style={{
                  color:
                    revealed && !cell.mine
                      ? NUMBER_COLORS[cell.adjacent]
                      : undefined,
                }}
              >
                {cell.state === "flagged"
                  ? "🚩"
                  : revealed && cell.mine
                    ? "💣"
                    : revealed && cell.adjacent > 0
                      ? cell.adjacent
                      : ""}
              </button>
            );
          }),
        )}
      </div>
      <p className="text-[11px] text-[#3a382f]">
        {board.state === "won"
          ? "Победа! Все мины найдены."
          : board.state === "lost"
            ? "Взрыв! Нажмите на смайлик для новой игры."
            : "ЛКМ — открыть, ПКМ (или режим 🚩) — флажок."}
      </p>
    </div>
  );
}
